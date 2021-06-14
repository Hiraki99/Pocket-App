import {AppRegistry, YellowBox, LogBox} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import * as Sentry from '@sentry/react-native';

import Entry from './src/Entry';
import {name as appName} from './app.json';

console.disableYellowBox = true;
const ignoredWarnings: string[] = ['Expected style'];

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreLogs(['Animated.event now requires']);
LogBox.ignoreLogs(['Animated: ', 'VirtualizedLists ']);

function isWarnIgnored(...args: any[]) {
  return args.some((arg) => {
    if (typeof arg !== 'string') {
      return false;
    }

    return ignoredWarnings.some((ignoredWarning) => {
      return arg.includes(ignoredWarning);
    });
  });
}

if (__DEV__) {
  const _warn = console.warn;
  console.warn = function (...args: any[]) {
    if (isWarnIgnored(...args)) {
      return;
    }
    _warn(...args);
  };

  YellowBox.ignoreWarnings(ignoredWarnings);
}

messaging().setBackgroundMessageHandler(async () => {
  AsyncStorage.getItem('badge').then((data) => {
    const badge = parseInt(data || '0');
    AsyncStorage.setItem('badge', `${badge + 1}`);
    notifee
      .setBadgeCount(badge + 1)
      .then(() => console.log('Badge count set! '));
  });
});

Sentry.init({
  dsn:
    'https://463a118b7b0442be8c9721667e48fe16@o494305.ingest.sentry.io/5565221',
  tracesSampleRate: 0.2,
});

AppRegistry.registerComponent(appName, () => Entry);
