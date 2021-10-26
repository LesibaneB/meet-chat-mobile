import React, {useContext, useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {RootStoreContext} from '../../App';
import {observer} from 'mobx-react-lite';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Layout, Text} from '@ui-kitten/components';
import {Pressable, Modal, StyleSheet} from 'react-native';
import {MediaStream, RTCView} from 'react-native-webrtc';

interface Props {}

const VideoCallModal = ({}: Props): JSX.Element => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  //   setInterval(() => {
  //     setSeconds(prevState => prevState + 1);
  //     console.log('seconds : ', seconds);
  //     if (seconds > 59) {
  //       setMinutes(prevState => prevState + 1);
  //       setSeconds(0);
  //     }
  //   }, 1000);
  const {inCall, onEndCall, localStream} =
    useContext(RootStoreContext).webRTCStore;

  console.log(
    'localStream here : ',
    (localStream as unknown as MediaStream)?.getTracks(),
  );

  return (
    <Modal presentationStyle="fullScreen" animationType="fade" visible={true}>
      <Text style={styles.text}>{`01:59`}</Text>
      <Layout style={styles.contentLayout}>
        <Layout style={styles.rtcview}>
          {localStream ? (
            <RTCView
              style={styles.rtc}
              streamURL={(localStream as unknown as MediaStream)?.toURL()}
            />
          ) : null}
        </Layout>
        <Layout style={styles.buttonLayout}>
          <Pressable
            onPress={onEndCall}
            style={[styles.callButtonsBase, styles.rejectCallButton]}>
            <Icon style={styles.icon} name="call-end" size={40} color="white" />
          </Pressable>
        </Layout>
      </Layout>
    </Modal>
  );
};

const styles = StyleSheet.create({
  contentLayout: {
    height: responsiveHeight(100),
    paddingLeft: responsiveWidth(5),
    paddingRight: responsiveWidth(5),
  },
  buttonLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  avatar: {
    alignSelf: 'center',
    marginTop: responsiveHeight(12),
    height: responsiveHeight(20),
    width: responsiveWidth(40),
  },
  callButtonsBase: {
    borderRadius: 10,
    width: responsiveWidth(15),
    height: responsiveHeight(7.5),
    marginTop: responsiveHeight(15),
  },
  rejectCallButton: {
    marginLeft: responsiveWidth(35),
    backgroundColor: 'red',
    borderColor: 'red',
  },
  icon: {
    marginTop: responsiveHeight(1.8),
    marginLeft: responsiveWidth(2.5),
  },
  text: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(4),
    marginTop: responsiveHeight(15),
  },
  rtc: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  rtcview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    margin: 5,
  },
});

export default observer(VideoCallModal);
