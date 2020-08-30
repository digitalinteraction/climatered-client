import WebRTC from './webrtc'

export default class CoffeeChat {
  socket
  webRTC
  mediaStreamCb
  userStateCb
  userId
  currentRoom
  acknowledgedUsers
  listenersSetup

  constructor(socket, userId, mediaStreamCb, userStateCb) {
    this.socket = socket
    this.webRTC = new WebRTC(userId)
    this.mediaStreamCbs = mediaStreamCb
    this.userStateCb = userStateCb
    this.userId = userId
    this.acknowledgedUsers = []
    this.listenersSetup = []
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
    const userId = this.userId

    this.socket.bindEvent(this, 'user-joined', fromUser => {
      this.socket.emit('user-ack', this.currentRoom, userId, fromUser)
      this._setupUserListeners(fromUser)
    })

    this.socket.bindEvent(this, `user-ack-${userId}`, fromUser => {
      if (this.acknowledgedUsers.includes(fromUser)) return
      this.acknowledgedUsers.push(fromUser)
      this._setupUserListeners(fromUser)
      this.socket.emit('user-ack', this.currentRoom, userId, fromUser)
    })

    this.socket.bindEvent(this, 'user-left', userId => {
      this.webRTC.close(userId)
      this.socket.unbindEvent(`offer-${userId}-${this.userId}`)
      this.socket.unbindEvent(`answer-${userId}-${this.userId}`)
      this.socket.unbindEvent(`ice-${userId}-${this.userId}`)
    })

    this.socket.emit('join-room', this.currentRoom, userId)
  }

  _setupUserListeners(toUser) {
    if (this.listenersSetup.includes(toUser)) return
    this.listenersSetup.push(toUser)
    if (this.webRTC.determineCaller(this.userId, toUser)) {
      this.socket.bindEvent(this, `answer-${toUser}-${this.userId}`, answer => {
        this.webRTC.addAnswer(toUser, answer)
      })
    } else {
      this.socket.bindEvent(
        this,
        `offer-${toUser}-${this.userId}`,
        async offer => {
          const answer = this.webRTC.createAnswer(
            toUser,
            offer,
            await this._setupMedia(),
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
    this.bindEvent(this, `ice-${toUser}-${this.userId}`, ice => {
      this.webRTC.addIceCandidate(toUser, ice)
    })
  }

  async _setupUserConnection(toUser) {
    if (this.webRTC.determineCaller(this.userId, toUser)) {
      const offer = this.webRTC.createOffer(
        toUser,
        await this._setupMedia(),
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

  _setupMedia() {
    return new Promise((resolve, reject) => {
      navigator.getUserMedia(
        {
          video: true,
          audio: {
            echoCancellation: true,
            autoGainControl: true,
            noiseSuppression: true
          }
        },
        stream => {
          resolve(stream)
        },
        error => {
          reject(error)
        }
      )
    })
  }

  _iceCandidateReceived(toUser, ice) {
    this.socket.emit(
      `ice-${this.userId}-${toUser}`,
      this.currentRoom,
      this.userId,
      toUser,
      ice
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
