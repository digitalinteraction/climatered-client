import WebRTC from './webrtc'

export default class CoffeeChat {
  socket
  mediaStream
  webRTC
  mediaStreamCb
  userStateCb
  userId
  currentRoom
  acknowledgedUsers
  secondAcknowledgeUsers

  constructor(socket, mediaStream, userId, mediaStreamCb, userStateCb) {
    this.socket = socket
    this.mediaStream = mediaStream
    this.webRTC = new WebRTC(userId)
    this.mediaStreamCb = mediaStreamCb
    this.userStateCb = userStateCb
    this.userId = userId
    this.acknowledgedUsers = []
    this.secondAcknowledgeUsers = []
  }

  destroy() {
    this.socket.unbindAllEvents(this)
    this.socket.emit('leave-room', this.currentRoom, this.userId)
    this.webRTC.closeAll()
    this.currentRoom = undefined
  }

  joinRoom(roomId) {
    if (this.currentRoom)
      throw new Error(
        'Invalid usage: Coffee Chat instance has been used. Destroy this instance and create a new one.'
      )

    this.currentRoom = roomId

    this.socket.bindEvent(this, 'user-joined', fromUser => {
      if (this.userId === fromUser) return
      this.acknowledgedUsers.push(fromUser)
      this._setupUserListeners(fromUser)
      this.socket.emit('user-ack', this.currentRoom, this.userId, fromUser)
    })

    this.socket.bindEvent(this, `user-ack-${this.userId}`, fromUser => {
      if (
        this.acknowledgedUsers.includes(fromUser) &&
        !this.secondAcknowledgeUsers.includes(fromUser)
      ) {
        this.secondAcknowledgeUsers.push(fromUser)
        this._setupUserConnection(fromUser)
      } else {
        this.acknowledgedUsers.push(fromUser)
        this._setupUserListeners(fromUser)
        this.socket.emit('user-ack', this.currentRoom, this.userId, fromUser)
      }
    })

    this.socket.bindEvent(this, 'user-left', fromUser => {
      this.webRTC.close(fromUser)
      this.acknowledgedUsers = this.acknowledgedUsers.filter(
        a => a !== fromUser
      )
      this.secondAcknowledgeUsers = this.secondAcknowledgeUsers.filter(
        a => a !== fromUser
      )
      this.socket.unbindEvent(`offer-${fromUser}-${this.userId}`)
      this.socket.unbindEvent(`answer-${fromUser}-${this.userId}`)
      this.socket.unbindEvent(`ice-${fromUser}-${this.userId}`)
    })

    this.socket.emit('join-room', this.currentRoom, this.userId)
  }

  _setupUserListeners(toUser) {
    if (this.webRTC.determineCaller(this.userId, toUser)) {
      this.socket.bindEvent(this, `answer-${toUser}-${this.userId}`, answer => {
        this.webRTC.addAnswer(toUser, answer)
      })
    } else {
      this.socket.bindEvent(
        this,
        `offer-${toUser}-${this.userId}`,
        async offer => {
          const answer = await this.webRTC.createAnswer(
            toUser,
            offer,
            this.mediaStream,
            ice => this._iceCandidateReceived(toUser, ice),
            rs => this._remoteStreamReceived(toUser, rs),
            s => this._remoteUserStateChanged(toUser, s)
          )
          this.socket.emit(
            'send-answer',
            this.currentRoom,
            this.userId,
            toUser,
            answer
          )
        }
      )
    }
    this.socket.bindEvent(this, `ice-${toUser}-${this.userId}`, ice => {
      this.webRTC.addIceCandidate(toUser, ice)
    })
  }

  async _setupUserConnection(toUser) {
    console.log('Setting up user connection:', toUser)
    if (this.webRTC.determineCaller(this.userId, toUser)) {
      const offer = await this.webRTC.createOffer(
        toUser,
        this.mediaStream,
        ice => this._iceCandidateReceived(toUser, ice),
        rs => this._remoteStreamReceived(toUser, rs),
        s => this._remoteUserStateChanged(toUser, s)
      )
      this.socket.emit(
        'send-offer',
        this.currentRoom,
        this.userId,
        toUser,
        offer
      )
    }
  }

  _iceCandidateReceived(toUser, ice) {
    this.socket.emit(
      'send-ice',
      this.currentRoom,
      this.userId,
      toUser,
      ice.candidate
    )
  }

  _remoteStreamReceived(fromUser, stream) {
    console.log('Remote stream recieved: ', fromUser, stream)
    this.mediaStreamCb(fromUser, stream)
  }

  _remoteUserStateChanged(fromUser, state) {
    console.log('User state changed: ', fromUser, state)
    this.userStateCb(fromUser, state)
  }
}
