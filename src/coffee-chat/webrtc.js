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
    onDataReceivedCb,
    connectionClosedCb
  ) {
    const peerConnection = this._create(forUserId, localStream)
    this._listenForIceCandidates(peerConnection.pc, iceCb)
    this._listenForRemoteStream(peerConnection.pc, remoteStreamCb)
    this._setupDataChannel(forUserId, onDataReceivedCb)
    this._listenForPeerConnectionClosed(peerConnection.pc, connectionClosedCb)
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
    onDataReceivedCb,
    connectionClosedCb
  ) {
    if (this.peerConnections[forUserId]) {
      this.close(forUserId)
    }
    const peerConnection = this._create(forUserId, localStream)
    this._listenForIceCandidates(peerConnection.pc, iceCb)
    this._listenForRemoteStream(peerConnection.pc, remoteStreamCb)
    this._listenForPeerConnectionClosed(peerConnection.pc, connectionClosedCb)
    peerConnection.pc.addEventListener('datachannel', ev => {
      peerConnection.dc = ev.channel
      ev.channel.onmessage = msg => {
        onDataReceivedCb(msg.data)
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
    this.peerConnections[forUserId].pc.addIceCandidate(candidate)
  }

  sendMessageToPeer(forUserId, msg) {
    if (
      this.peerConnections[forUserId]?.dc &&
      this.peerConnections[forUserId].dc?.readyState === 'open'
    ) {
      this.peerConnections[forUserId].dc?.send(msg)
    }
  }

  sendMessageToAll(msg) {
    this.getAllPeerConnectionUserIds().forEach(user => {
      this.sendMessageToPeer(user, msg)
    })
  }

  getAllPeerConnectionUserIds() {
    return Object.keys(this.peerConnections)
  }

  checkConnectionStatus(userId) {
    return this.peerConnections[userId]?.pc.connectionState
  }

  close(userId) {
    if (!this.peerConnections[userId]) return
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

  _listenForRemoteStream(peerConnection, cb) {
    peerConnection.addEventListener('track', ev => {
      cb(ev.track)
    })
  }

  _listenForPeerConnectionClosed(peerConnection, cb) {
    peerConnection.addEventListener('connectionstatechange', () => {
      switch (peerConnection.connectionState) {
        case 'disconnected':
        case 'failed':
        case 'closed':
          cb()
          break
      }
    })
  }

  _create(forUserId, media) {
    if (this.peerConnections[forUserId]) {
      this.peerConnections[forUserId].pc.close()
    }
    this.peerConnections[forUserId] = {
      pc: new RTCPeerConnection(configuration)
    }
    media.getTracks().forEach(t => {
      this.peerConnections[forUserId].pc.addTrack(t, media)
    })
    return this.peerConnections[forUserId]
  }

  _setupDataChannel(forUserId, onDataReceivedCb) {
    this.peerConnections[forUserId].dc = this.peerConnections[
      forUserId
    ].pc.createDataChannel('userDataChannel')

    this.peerConnections[forUserId].dc?.addEventListener('message', msg => {
      onDataReceivedCb(msg.data)
    })
  }
}
