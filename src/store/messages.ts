import {PRE_OFFER, PRE_OFFER_ANSWER} from './../utils/const';
import {PreOffer} from './../models/pre-offer';
import {action, makeObservable, observable} from 'mobx';
import {SocketService} from '../services/websocket';
import {CallDetails} from '../models/call-details';
import {PreOfferAnswer} from '../models/pre-offer-answer';

export class MessagesStore {
  @observable
  incomingCall: boolean = false;

  @observable
  callDetails: CallDetails = {} as CallDetails;

  constructor(private readonly socketService: SocketService) {
    makeObservable(this);

    this.socketService.registerSocketListener(PRE_OFFER, this.onPreOffer);
  }

  @action.bound
  onPreOffer(preOffer: PreOffer): void {
    const {callType, callerId} = preOffer;
    this.callDetails = {
      connectionId: callerId,
      callType: callType,
    };
    this.incomingCall = true;
  }

  @action.bound
  onAcceptCall(): void {
    const {connectionId, callType} = this.callDetails;
    this.incomingCall = false;

    const preOfferAnswer: PreOfferAnswer = {
      callerId: connectionId,
      callType: callType,
      answer: 'accept',
    };
    this.socketService.emitEvent(PRE_OFFER_ANSWER, preOfferAnswer);
    console.log('Call Accepted');
  }

  @action.bound
  onRejectCall(): void {
    this.incomingCall = false;
    console.log('Call Rejected');
  }
}
