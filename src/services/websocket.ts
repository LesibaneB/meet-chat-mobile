import {io} from 'socket.io-client';

export class SocketService {
  private socket;
  constructor() {
    this.socket = io('');

    console.log('Socket created');

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
