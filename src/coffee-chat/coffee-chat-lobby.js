export default class CoffeeChatLobby {
  socket
  roomFoundCb

  constructor(socket, roomFoundCb) {
    this.socket = socket
    this.roomFoundCb = roomFoundCb
  }

  joinLobby(languagePrefs, topicPrefs) {
    this.socket.bindEvent(this, 'room-found', room => {
      this.socket.unbindEvent(this, 'room-found')
      this.roomFoundCb(room)
    })
    this.socket.emit('join-lobby', languagePrefs, topicPrefs)
  }
}
