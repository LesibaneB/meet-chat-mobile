import {SendPreOffer} from '../models/send-pre-offer';
import {
  CALL_STATE,
  PRE_OFFER,
  PRE_OFFER_ANSWER,
  WEBRTCSIGNALLING,
  WEBRTC_SIGNALLING,
} from '../utils/const';
import {OnPreOffer} from '../models/on-pre-offer';
import {action, makeObservable, observable} from 'mobx';
import {SocketService} from '../services/websocket';
import {CallDetails} from '../models/call-details';
import {PreOfferAnswer} from '../models/pre-offer-answer';
import {
  EventOnCandidate,
  RTCPeerConnection,
  mediaDevices,
  MediaStream,
  EventOnAddStream,
} from 'react-native-webrtc';
import {
  request,
  PERMISSIONS,
  PermissionStatus,
  RESULTS,
} from 'react-native-permissions';
import {Platform} from 'react-native';

export class WebRTCStore {
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

  @observable
  localStream = null;
  @observable
  remoteStream = null;

  private peerConnection: RTCPeerConnection = {} as RTCPeerConnection;

  constructor(private readonly socketService: SocketService) {
    makeObservable(this);

    this.socketService.registerSocketListener(PRE_OFFER, this.onPreOffer);
    this.socketService.registerSocketListener(
      PRE_OFFER_ANSWER,
      this.onPreOfferAnswer,
    );

    this.socketService.registerSocketListener(
      WEBRTC_SIGNALLING,
      (data: any) => {
        switch (data.type) {
          case WEBRTCSIGNALLING.OFFER:
            this.onWebRTCOffer(data);
            break;
          case WEBRTCSIGNALLING.ANSWER:
            this.onWebRTCAnswer(data);
            break;
          case WEBRTCSIGNALLING.ICE_CANDIDATE:
            this.onWebRTCIceCandidate(data);
            break;
          default:
            console.log(`Error : ${data} not supported`);
            return;
        }
      },
    );
  }

  initializeWebRTCPeerConnection(): void {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
          ],
        },
      ],
    });

    this.peerConnection.onicecandidate = (event: EventOnCandidate) => {
      console.log('On Ice candidate : ', event);
      if (event.candidate) {
        this.socketService.emitEvent(WEBRTC_SIGNALLING, {
          connectedSocketId: this.callDetails.connectionId,
          type: WEBRTCSIGNALLING.ICE_CANDIDATE,
          data: event.candidate,
        });
      }
    };

    this.peerConnection.onicecandidateerror = (event: Event) => {
      console.log('Ice candidate error : ', event);
    };

    this.peerConnection.onconnectionstatechange = (event: Event) => {
      console.log('connection state change : ', event);
    };

    this.peerConnection.oniceconnectionstatechange = (event: Event) => {
      console.log('Ice connection state change : ', event);
    };

    this.peerConnection.onaddstream = (event: EventOnAddStream) => {
      event.stream.getTracks().forEach(track => {
        this.remoteStream.addTrack(track);
      });
    };

    this.peerConnection.onsignalingstatechange = () => {
      console.log('On signalling state change!');
    };
  }

  @action.bound
  initializeStreams(): void {
    if (Platform.OS === 'android') {
      request(PERMISSIONS.ANDROID.CAMERA).then((result: PermissionStatus) => {
        switch (result) {
          case RESULTS.DENIED:
            console.log('The permission has been denied.');
            break;
          case RESULTS.GRANTED:
            this.setupStreams();
            break;
          default:
            console.log('Error getting camera permission.');
        }
      });
    } else if (Platform.OS === 'ios') {
      request(PERMISSIONS.IOS.CAMERA).then((result: PermissionStatus) => {
        switch (result) {
          case RESULTS.DENIED:
            console.log('The permission has been denied.');
            break;
          case RESULTS.GRANTED:
            this.setupStreams();
            break;
          default:
            console.log('Error getting camera permission.');
        }
      });
    }
  }

  @action.bound
  setupStreams(): void {
    mediaDevices.enumerateDevices().then(sourceInfos => {
      console.log(sourceInfos);
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (sourceInfo.kind == 'videoinput' && sourceInfo.facing == 'front') {
          videoSourceId = sourceInfo.deviceId;
        }
        mediaDevices
          .getUserMedia({
            audio: true,
            video: {
              mandatory: {
                minWidth: 640,
                minHeight: 480,
                minFrameRate: 30,
              },
              facingMode: 'user',
              optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
            },
          })
          .then(stream => {
            this.localStream = stream as MediaStream;

            this.peerConnection.addStream(this.localStream);
          })
          .catch(error => {
            console.log('Error getting stream from camera : ', error);
          });
      }
    });
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
    const {callerId, answer} = preOfferAnswer;
    if (callerId !== this.callDetails.connectionId) {
      // TODO Think about what to do here
      console.log(
        'Caller Id not the same as pre-offered, aborting....',
        callerId,
      );
      return;
    }

    if (answer === CALL_STATE.ACCEPT) {
      this.initializeWebRTCPeerConnection();
      this.peerConnection.createOffer().then(offer => {
        this.peerConnection.setLocalDescription(offer).then(() => {
          this.socketService.emitEvent(WEBRTC_SIGNALLING, {
            connectedSocketId: this.callDetails.connectionId,
            type: WEBRTCSIGNALLING.OFFER,
            data: offer,
          });
        });
      });

      this.initializeStreams();
      this.outGoingCall = false;
      this.inCall = true;
    } else {
      this.callRejected = true;
    }
  }

  @action.bound
  onAcceptCall(): void {
    this.initializeWebRTCPeerConnection();
    this.initializeStreams();

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
    } else if (this.outGoingCall) {
      this.outGoingCall = false;
    }
  }

  @action.bound
  onEndCall(): void {
    this.inCall = false;
  }

  onWebRTCOffer(data: any) {
    this.peerConnection.setRemoteDescription(data.data).then(() => {
      this.peerConnection.createAnswer().then(answer => {
        this.peerConnection.setLocalDescription(answer).then(() => {
          this.socketService.emitEvent(WEBRTC_SIGNALLING, {
            connectedSocketId: this.callDetails.connectionId,
            type: WEBRTCSIGNALLING.ANSWER,
            data: answer,
          });
        });
      });
    });
  }

  onWebRTCAnswer(data: any) {
    this.peerConnection.setRemoteDescription(data.data).then(() => {
      console.log('localDescription set');
    });
  }

  onWebRTCIceCandidate(data: any) {
    this.peerConnection
      .addIceCandidate(data.data)
      .then(() => {
        console.log('ICE candidate added successfully.');
      })
      .catch(error => {
        console.log('Error occured while adding ice candidate : ', error);
      });
  }
}
