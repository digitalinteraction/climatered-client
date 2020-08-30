import WebRTC from './webrtc'

export default class CoffeeChat {
  sockets
  webRTC
  userId
  currentRoom
  acknowledgedUsers
  listenersSetup

  constructor(sockets, userId) {
    this.sockets = sockets
    this.webRTC = new WebRTC(userId)
    this.userId = userId
    this.acknowledgedUsers = []
    this.listenersSetup = []
  }

  destroy() {
    this.sockets.unbindAllEvents(this)
    this.sockets.emit('user-left', this.currentRoom, this.userId)
    this.sockets.leaveRoom(this.currentRoom)
    this.webRTC.closeAll()
    this.currentRoom = undefined
  }

  joinLobby(languagePrefs, topicPrefs) {
    this.sockets.bindEvent(this, 'room-found', room => {
      if (!this.currentRoom) this.joinRoom(room)
      this.sockets.unbindEvent(this, 'room-found')
    })
    this.sockets.emit('join-lobby', languagePrefs, topicPrefs)
  }

  joinRoom(roomId) {
    if (this.currentRoom)
      throw new Error(
        'Invalid usage: Coffee Chat instance has been used. Destroy this instance and create a new one.'
      )

    this.currentRoom = roomId
    const userId = this.userId

    this.sockets.bindEvent(this, 'user-joined', fromUser => {
      this.sockets.emit('user-ack', this.currentRoom, userId, fromUser)
      this._setupUserListeners(fromUser)
    })

    this.sockets.bindEvent(this, `user-ack-${userId}`, fromUser => {
      if (this.acknowledgedUsers.includes(fromUser)) return
      this.acknowledgedUsers.push(fromUser)
      this._setupUserListeners(fromUser)
      this.sockets.emit('user-ack', this.currentRoom, userId, fromUser)
    })

    this.sockets.bindEvent(this, 'user-left', userId => {
      this.webRTC.close(userId)
      this.sockets.unbindEvent(`offer-${userId}-${this.userId}`)
      this.sockets.unbindEvent(`answer-${userId}-${this.userId}`)
      this.sockets.unbindEvent(`ice-${userId}-${this.userId}`)
    })

    this.sockets.join(roomId)
    this.sockets.emit('user-joined', this.currentRoom, userId)
  }

  _setupUserListeners(toUser) {
    if (this.listenersSetup.includes(toUser)) return
    this.listenersSetup.push(toUser)
    if (this.webRTC.determineCaller(this.userId, toUser)) {
      this.sockets.bindEvent(
        this,
        `answer-${toUser}-${this.userId}`,
        answer => {
          this.webRTC.addAnswer(toUser, answer)
        }
      )
    } else {
      this.sockets.bindEvent(
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
          this.sockets.emit(
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
      this.sockets.emit(
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
    this.sockets.emit(
      `ice-${this.userId}-${toUser}`,
      this.currentRoom,
      this.userId,
      toUser,
      ice
    )
  }

  _remoteStreamReceived(fromUser, stream) {
    console.log('Remote stream recieved: ', fromUser, stream)
  }

  _remoteUserStateChanged(fromUser, state) {
    console.log('User state changed: ', fromUser, state)
  }
}
