import React, {useContext} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {RootStoreContext} from '../../App';
import {observer} from 'mobx-react-lite';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Avatar, Layout, Text} from '@ui-kitten/components';
import {Alert, Pressable, Modal, StyleSheet} from 'react-native';

interface Props {}

const OutGoingCallModal = ({}: Props): JSX.Element => {
  const {outGoingCall, onRejectCall} =
    useContext(RootStoreContext).messageStore;

  return (
    <Modal
      presentationStyle="fullScreen"
      animationType="fade"
      visible={outGoingCall}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
      }}>
      <Text style={styles.text}>Calling....</Text>
      <Layout style={styles.contentLayout}>
        <Avatar
          style={styles.avatar}
          source={require('../images/Default_Avatar.png')}
        />
        <Layout style={styles.buttonLayout}>
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

export default observer(OutGoingCallModal);
