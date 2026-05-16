type MessageHandler = (data: any) => void;

export class RealtimeClient {
  socket: WebSocket | null = null;
  handlers: MessageHandler[] = [];

  connect(url: string) {
    if (this.socket) this.socket.close();
    this.socket = new WebSocket(url);
    this.socket.onopen = () => console.log('Realtime connected');
    this.socket.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        this.handlers.forEach((h) => h(data));
      } catch (e) {
        console.error('Invalid realtime message', e);
      }
    };
    this.socket.onclose = () => console.log('Realtime disconnected');
    this.socket.onerror = (e) => console.error('Realtime error', e);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  onMessage(handler: MessageHandler) {
    this.handlers.push(handler);
    return () => { this.handlers = this.handlers.filter((h) => h !== handler); };
  }

  send(payload: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(payload));
    }
  }
}

export const realtimeClient = new RealtimeClient();
