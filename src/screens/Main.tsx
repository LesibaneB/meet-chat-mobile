import React, {useContext, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {observer} from 'mobx-react';
import {RootStoreContext} from '../../App';
import {Button, Input, Layout, Text} from '@ui-kitten/components';

interface Props {}

const MainScreen = ({}: Props): JSX.Element => {
  const {messageStore} = useContext(RootStoreContext);
  return (
    <Layout style={styles.layout}>
      <Input
        style={styles.connectionIdInput}
        label="Connection ID"
        placeholder="Enter connection ID"
      />
      <Button style={styles.startCallButton}>Start Call</Button>
    </Layout>
  );
};

const styles = StyleSheet.create({
  layout: {
    height: responsiveHeight(100),
    width: responsiveWidth(100),
    paddingLeft: responsiveWidth(5),
    paddingRight: responsiveWidth(5),
  },
  startCallButton: {
    backgroundColor: '#321AC6',
    marginTop: responsiveHeight(2),
  },
  connectionIdInput: {
    marginTop: responsiveHeight(40),
  },
});

export default observer(MainScreen);
