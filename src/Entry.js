import React from 'react';
import 'react-native-gesture-handler';
import TrackPlayer from 'react-native-track-player';
import Config from 'react-native-config';
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
import Routes from './navigation/Routes';

import {OS} from '~/constants/os';
import theme from '~/themes/theme';
import {setStoreApiSaure} from '~/utils/apisaure';
import {setStoreScript} from '~/utils/script';
import ReviewContext from '~/ReviewContext';

const {store, persistor} = configureStore();

// console.log('Bundle Info: ', investigate());

class Entry extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    Orientation.lockToPortrait();
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
                    <Routes />
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

export default Entry;
