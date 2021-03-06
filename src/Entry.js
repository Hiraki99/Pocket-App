import React, {Suspense} from 'react';
import 'react-native-gesture-handler';
import {ActivityIndicator} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import codePush from 'react-native-code-push';
import Orientation from 'react-native-orientation';
import {Container, StyleProvider} from 'native-base';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {ThemeProvider} from 'styled-components';
// import {investigate} from 'react-native-bundle-splitter/dist/utils';

import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';

import configureStore from './store';
import Bootstrap from './Bootstrap';
// import Routes from './navigation/Routes';

import theme from '~/themes/theme';
import {setStoreApiSaure} from '~/utils/apisaure';
import {setStoreScript} from '~/utils/script';
import ReviewContext from '~/ReviewContext';

const {store, persistor} = configureStore();
const Routes = React.lazy(() => import('./navigation/Routes'));
// console.log('Bundle Info: ', investigate());

class Entry extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount = async () => {
    Orientation.lockToPortrait();
    await TrackPlayer.setupPlayer();
    setStoreScript(store);
    setStoreApiSaure(store);
  };

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Container>
            <ThemeProvider theme={theme}>
              <StyleProvider style={getTheme(platform)}>
                <Bootstrap>
                  <ReviewContext>
                    <Suspense fallback={<ActivityIndicator />}>
                      <Routes />
                    </Suspense>
                  </ReviewContext>
                </Bootstrap>
              </StyleProvider>
            </ThemeProvider>
          </Container>
        </PersistGate>
      </Provider>
    );
  }
}
let codePushOptions = {
  updateDialog: {
    optionalInstallButtonLabel: 'C??i ?????t',
    optionalIgnoreButtonLabel: 'B??? qua',
    title: 'C???p nh???t c?? s???n',
    optionalUpdateMessage: '???? c?? b???n c???p nh???t, b???n c?? mu???n c??i ?????t n???',
  },
  installMode: codePush.InstallMode.IMMEDIATE,
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
};

export default codePush(codePushOptions)(Entry);
