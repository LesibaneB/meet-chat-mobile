import {SocketService} from '../services/websocket';
import {WebRTCStore} from './webRTC-store';

export class RootStore {
  public webRTCStore: WebRTCStore;

  constructor() {
    const websocket = new SocketService();
    this.webRTCStore = new WebRTCStore(websocket);
  }
}
