import {io} from 'socket.io-client';

export class SocketService {
  private socket;
  constructor() {
    this.socket = io('ws://192.168.0.103:3000');
    this.socket.on('connect', () => {
      console.log('Socket is Open');
    });
  }

  public registerSocketListener(event: string, callback: () => void): void {
    this.socket.on(event, callback);
  }

  public emitEvent(event: string, data: any): void {
    this.socket.emit(event, data);
  }
}
