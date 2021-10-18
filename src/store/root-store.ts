import {SocketService} from '../services/websocket';
import {MessagesStore} from './messages';

export class RootStore {
  public messageStore: MessagesStore;

  constructor() {
    const websocket = new SocketService();
    this.messageStore = new MessagesStore(websocket);
  }
}
