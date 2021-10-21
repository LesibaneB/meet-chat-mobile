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
  const {inCall, onEndCall} = useContext(RootStoreContext).messageStore;

  return (
    <Modal presentationStyle="fullScreen" animationType="fade" visible={inCall}>
      <Text style={styles.text}>{`01:59`}</Text>
      <Layout style={styles.contentLayout}>
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
    borderRadius: 50,
    width: responsiveWidth(20),
    height: responsiveHeight(10),
    marginTop: responsiveHeight(15),
  },
  rejectCallButton: {
    marginLeft: responsiveWidth(35),
    backgroundColor: 'red',
    borderColor: 'red',
  },
  icon: {
    marginTop: responsiveHeight(2.5),
    marginLeft: responsiveWidth(5),
  },
  text: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(4),
    marginTop: responsiveHeight(15),
  },
});

export default observer(VideoCallModal);
