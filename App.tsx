import React, {createContext} from 'react';
import * as eva from '@eva-design/eva';

import MainScreen from './src/screens/Main';
import {observer} from 'mobx-react';
import {RootStore} from './src/store/root-store';
import IncomingCallModal from './src/components/IncomingCallModal';
import {ApplicationProvider} from '@ui-kitten/components';
import OutGoingCallModal from './src/components/OutGoingCallModal';
import VideoCallModal from './src/components/VideoCallModal';

export const RootStoreContext = createContext<RootStore>({} as RootStore);
const rootStore = new RootStore();

const App = () => {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <RootStoreContext.Provider value={rootStore}>
        <MainScreen />
        <IncomingCallModal />
        <OutGoingCallModal />
        <VideoCallModal />
      </RootStoreContext.Provider>
    </ApplicationProvider>
  );
};

export default observer(App);
