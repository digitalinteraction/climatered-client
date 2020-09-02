import WebRTC from './webrtc'

export default class CoffeeChat {
  socket
  mediaStream
  webRTC
  mediaStreamCb
  userDataCb
  userId
  currentRoom
  mediationState

  constructor(socket, mediaStream, userId, mediaStreamTrackCb, userDataCb) {
    this.socket = socket
    this.mediaStream = mediaStream
    this.webRTC = new WebRTC(userId)
    this.mediaStreamTrackCb = mediaStreamTrackCb
    this.userDataCb = userDataCb
    this.userId = userId
    this.mediationState = {}
  }

  destroy() {
    this.socket.unbindOwner(this)
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
      this.mediationState[fromUser] = 'acknowledged'
      this._setupUserListeners(fromUser)
      this.socket.emit('user-ack', this.currentRoom, this.userId, fromUser)
    })

    this.socket.bindEvent(this, `user-ack-${this.userId}`, fromUser => {
      if (this.mediationState[fromUser] === 'acknowledged') {
        this.mediationState[fromUser] = 'ready'
        this._setupUserConnection(fromUser)
      } else if (this.mediationState[fromUser] === undefined) {
        this.mediationState[fromUser] = 'ready'
        this._setupUserListeners(fromUser)
        this._setupUserConnection(fromUser)
        this.socket.emit('user-ack', this.currentRoom, this.userId, fromUser)
      }
    })

    this.socket.bindEvent(this, 'user-left', fromUser => {
      this._cleanUpClosedUserConnection(fromUser)
    })

    this.socket.emit('join-room', this.currentRoom, this.userId)
  }

  sendUserData(data) {
    this.webRTC.sendMessageToAll(data)
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
            s => this._remoteUserDataReceived(toUser, s),
            () => this._cleanUpClosedUserConnection(toUser)
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
        s => this._remoteUserDataReceived(toUser, s),
        () => this._cleanUpClosedUserConnection(toUser)
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
    this.socket.emit('send-ice', this.currentRoom, this.userId, toUser, ice)
  }

  _remoteStreamReceived(fromUser, stream) {
    this.mediaStreamTrackCb(fromUser, stream)
  }

  _remoteUserDataReceived(fromUser, state) {
    this.userDataCb(fromUser, state)
  }

  _cleanUpClosedUserConnection(toUser) {
    this.webRTC.close(toUser)
    delete this.mediationState[toUser]
    this.socket.unbindEvent(`offer-${toUser}-${this.userId}`)
    this.socket.unbindEvent(`answer-${toUser}-${this.userId}`)
    this.socket.unbindEvent(`ice-${toUser}-${this.userId}`)
  }
}
