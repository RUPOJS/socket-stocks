export default class WSUtil {
  constructor(url, dispatcher) {
    this.websocket = new WebSocket(`ws://${url}`);
    this.dispatcher = dispatcher
    this.websocket.onmessage = function (event) {
      dispatcher(event.data)
    }
  }

  close() {
    this.websocket.close();
  }

}
