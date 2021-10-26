import React, {useContext} from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {RootStoreContext} from '../../App';
import {observer} from 'mobx-react-lite';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Avatar, Layout} from '@ui-kitten/components';
import {Pressable, Modal, StyleSheet} from 'react-native';

interface Props {}

const IncomingCallModal = ({}: Props): JSX.Element => {
  const {incomingCall, onAcceptCall, onRejectCall} =
    useContext(RootStoreContext).webRTCStore;

  return (
    <Modal
      presentationStyle="fullScreen"
      animationType="fade"
      visible={incomingCall}>
      <Layout style={styles.contentLayout}>
        <Avatar
          style={styles.avatar}
          source={require('../images/Default_Avatar.png')}
        />
        <Layout style={styles.buttonLayout}>
          <Pressable
            onPress={onAcceptCall}
            style={[styles.callButtonsBase, styles.acceptCallButton]}>
            <Icon style={styles.icon} name="call" size={40} color="white" />
          </Pressable>
          <Pressable
            onPress={onRejectCall}
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
    marginTop: responsiveHeight(30),
    height: responsiveHeight(20),
    width: responsiveWidth(40),
  },
  callButtonsBase: {
    borderRadius: 50,
    width: responsiveWidth(20),
    height: responsiveHeight(10),
    marginTop: responsiveHeight(15),
  },
  acceptCallButton: {
    marginLeft: responsiveWidth(15),
    backgroundColor: 'green',
    borderColor: 'green',
  },
  rejectCallButton: {
    marginLeft: responsiveWidth(20),
    backgroundColor: 'red',
    borderColor: 'red',
  },
  icon: {
    marginTop: responsiveHeight(2.5),
    marginLeft: responsiveWidth(5),
  },
});

export default observer(IncomingCallModal);
