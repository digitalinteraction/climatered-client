// Default configuration - Change these if you have a different STUN or TURN server.
const configuration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
    }
  ],
  iceCandidatePoolSize: 10
}

export default class WebRTC {
  peerConnections = {}

  currentUser = null

  constructor(currentUser) {
    this.currentUser = currentUser
  }

  async createOffer(
    forUserId,
    localStream,
    iceCb,
    remoteStreamCb,
    onUserStateChangeCb
  ) {
    const peerConnection = this._create(forUserId, localStream)
    this._listenForIceCandidates(peerConnection.pc, iceCb)
    this._listenForAudioStream(peerConnection.pc, remoteStreamCb)
    this._setupUserStateChannel(forUserId, onUserStateChangeCb)
    const offer = await peerConnection.pc.createOffer()
    peerConnection.pc.setLocalDescription(offer)
    return offer
  }

  async createAnswer(
    forUserId,
    offer,
    localStream,
    iceCb,
    remoteStreamCb,
    onUserStateChangeCb
  ) {
    if (this.peerConnections[forUserId]) {
      this.close(forUserId)
      console.log('Closed connection for new one: ', forUserId)
    }
    const peerConnection = this._create(forUserId, localStream)
    this._listenForIceCandidates(peerConnection.pc, iceCb)
    this._listenForAudioStream(peerConnection.pc, remoteStreamCb)
    this._setupUserStateChannel(forUserId, onUserStateChangeCb)
    peerConnection.pc.addEventListener('datachannel', ev => {
      peerConnection.dc = ev.channel
      // eslint-disable-next-line no-param-reassign
      ev.channel.onmessage = msg => {
        onUserStateChangeCb(msg.data)
      }
    })
    await peerConnection.pc.setRemoteDescription(offer)
    const answer = await peerConnection.pc.createAnswer()
    await peerConnection.pc.setLocalDescription(answer)
    return answer
  }

  async addAnswer(forUserId, answer) {
    if (this.peerConnections[forUserId].pc?.signalingState === 'stable') return
    await this.peerConnections[forUserId].pc.setRemoteDescription({
      sdp: answer.sdp,
      type: answer.type
    })
  }

  addIceCandidate(forUserId, candidate) {
    this.peerConnections[forUserId].pc.addIceCandidate(candidate.candidate)
  }

  sendUserStateChange(forUserId, msg) {
    if (
      this.peerConnections[forUserId]?.dc &&
      this.peerConnections[forUserId].dc?.readyState === 'open'
    ) {
      console.log('Sending MuteState:', msg)
      this.peerConnections[forUserId].dc?.send(msg)
    }
  }

  getAllPeerConnectionUserIds() {
    return Object.keys(this.peerConnections)
  }

  checkConnectionStatus(userId) {
    return this.peerConnections[userId]?.pc.connectionState
  }

  close(userId) {
    if (!this.peerConnections[userId]) return
    console.log('Closing connection to ', userId)
    this.peerConnections[userId].dc?.close()
    this.peerConnections[userId].pc.close()
    delete this.peerConnections[userId]
  }

  closeAll() {
    Object.keys(this.peerConnections).forEach(k => {
      this.close(k)
    })
  }

  determineCaller(user, toUser) {
    return user > toUser
  }

  _listenForIceCandidates(peerConnection, cb) {
    peerConnection.addEventListener('icecandidate', ev => {
      if (ev.candidate) cb(ev.candidate)
    })
  }

  /* eslint-disable-next-line class-methods-use-this */
  _listenForAudioStream(peerConnection, cb) {
    peerConnection.addEventListener('track', ev => {
      console.log(ev)
      console.log('RECEIVED STREAM!!!')
      cb(ev.streams[0])
    })
  }

  _create(forUserId, media) {
    if (this.peerConnections[forUserId]) {
      this.peerConnections[forUserId].pc.close()
      console.log('Closing connection to old user: ', forUserId)
    }
    this.peerConnections[forUserId] = {
      pc: new RTCPeerConnection(configuration)
    }
    media.getTracks().forEach(t => {
      this.peerConnections[forUserId].pc.addTrack(t, media)
    })
    return this.peerConnections[forUserId]
  }

  _setupUserStateChannel(forUserId, onUserStateChangeCb) {
    this.peerConnections[forUserId].dc = this.peerConnections[
      forUserId
    ].pc.createDataChannel('userState')

    this.peerConnections[forUserId].dc?.addEventListener('open', () => {
      console.log('dataChannel opened')
    })

    this.peerConnections[forUserId].dc?.addEventListener('message', msg => {
      onUserStateChangeCb(msg.data)
    })

    this.peerConnections[forUserId].dc?.addEventListener('error', error => {
      console.log(error)
    })

    this.peerConnections[forUserId].dc?.addEventListener('close', error => {
      console.log('dataChannel closed', error)
    })
  }
}
