import {SendPreOffer} from './../models/send-pre-offer';
import {PRE_OFFER, PRE_OFFER_ANSWER} from './../utils/const';
import {OnPreOffer} from '../models/on-pre-offer';
import {action, makeObservable, observable} from 'mobx';
import {SocketService} from '../services/websocket';
import {CallDetails} from '../models/call-details';
import {PreOfferAnswer} from '../models/pre-offer-answer';

export class MessagesStore {
  @observable
  incomingCall: boolean = false;

  @observable
  outGoingCall: boolean = false;

  @observable
  inCall: boolean = false;

  @observable
  callRejected: boolean = false;

  @observable
  callDetails: CallDetails = {} as CallDetails;

  constructor(private readonly socketService: SocketService) {
    makeObservable(this);

    this.socketService.registerSocketListener(PRE_OFFER, this.onPreOffer);
    this.socketService.registerSocketListener(
      PRE_OFFER_ANSWER,
      this.onPreOfferAnswer,
    );
  }

  @action.bound
  sendPreOffer(preOffer: SendPreOffer): void {
    this.socketService.emitEvent(PRE_OFFER, preOffer);
    const {calleeId, callType} = preOffer;
    this.callDetails = {
      connectionId: calleeId,
      callType: callType,
    };
    this.outGoingCall = true;
  }

  @action.bound
  onPreOffer(preOffer: OnPreOffer): void {
    const {callType, callerId} = preOffer;
    this.callDetails = {
      connectionId: callerId,
      callType: callType,
    };
    this.incomingCall = true;
  }

  @action.bound
  onPreOfferAnswer(preOfferAnswer: PreOfferAnswer): void {
    const {callerId, callType, answer} = preOfferAnswer;
    if (callerId !== this.callDetails.connectionId) {
      // TODO Think about what to do here
      console.log(
        'Caller Id not the same as pre-offered, aborting....',
        callerId,
      );
      return;
    }

    if (answer === 'accept') {
      // TODO create WEBRTC connection instance here
      // TODO send WEBRTC offer
      // TODO add localStream to peer connection
      this.outGoingCall = false;
      this.inCall = true;
    } else {
      this.callRejected = true;
    }
  }

  @action.bound
  onAcceptCall(): void {
    //TODO create WEBRTC connection instance here

    const {connectionId, callType} = this.callDetails;
    this.incomingCall = false;

    const preOfferAnswer: PreOfferAnswer = {
      callerId: connectionId,
      callType: callType,
      answer: 'accept',
    };
    this.socketService.emitEvent(PRE_OFFER_ANSWER, preOfferAnswer);
    this.inCall = true;
  }

  @action.bound
  onRejectCall(): void {
    const {connectionId, callType} = this.callDetails;
    if (this.incomingCall) {
      this.incomingCall = false;
      const preOfferAnswer: PreOfferAnswer = {
        callerId: connectionId,
        callType: callType,
        answer: 'reject',
      };
      this.socketService.emitEvent(PRE_OFFER_ANSWER, preOfferAnswer);
      console.log('Incoming call rejected.');
    } else if (this.outGoingCall) {
      this.outGoingCall = false;
      console.log('Outgoing call rejected.');
    }
  }

  @action.bound
  onEndCall(): void {
    this.inCall = false;
  }
}
