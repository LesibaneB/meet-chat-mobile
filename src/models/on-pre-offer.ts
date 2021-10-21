export interface OnPreOffer {
  readonly callerId: string;
  readonly callType: 'voice' | 'video';
}
