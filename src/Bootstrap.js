import {Root} from 'native-base';
import React, {useEffect, useRef, useState} from 'react';
import {AppState} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import SplashScreen from 'react-native-splash-screen';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import notifee, {EventType} from '@notifee/react-native';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import {requestTrackingPermission} from 'react-native-tracking-transparency';
import moment from 'moment';
import * as RNLocalize from 'react-native-localize';

import {OS} from '~/constants/os';
import {
  updateFcmToken,
  updateTimeUsingApp,
  saveFcmToken,
} from '~/features/authentication/AuthenAction';
import {checkVersionApp, setLanguageApp} from '~/features/config/ConfigAction';
import {
  decreaseNumberNotification,
  increaseNumberNotification,
  markReadNotificationAction,
} from '~/features/notification/NotificationAction';
import navigator from '~/navigation/customNavigator';
import {unreadCountNotificationSelector} from '~/selector/notification';
import {configApi} from '~/utils/apisaure';
import SocketClient from '~/utils/socket-client';
import {CREATE_ONLINE_CLASS} from '~/constants/exam';
import {LANGUAGE_SUPPORT, setI18nConfig} from '~/utils/multilanguage';

const Bootstrap = (props) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token || {}, shallowEqual);
  const language = useSelector((state) => state.config.language || 'vi');
  const isFirstUseApp = useSelector((state) => state.config.isFirstSetLanguage);
  const unreadCountNotification = useSelector(unreadCountNotificationSelector);
  const fcmToken = useSelector((state) => state.auth.fcmToken, shallowEqual);
  const appState = useRef(AppState.currentState);
  const [timeStartApp, setTimeStartApp] = useState(moment());
  const [channelId, setChannelId] = useState(null);

  const _handleAppStateChange = React.useCallback(
    (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // console.log('App has come to the foreground!');
      }
      const currentTime = moment();
      if (nextAppState === 'active') {
        setTimeStartApp(currentTime);
      }

      if (nextAppState === 'inactive') {
        const rangeTime = currentTime.diff(timeStartApp, 'second');
        if (token.token) {
          dispatch(
            updateTimeUsingApp({
              type: 'DURATION',
              meta: {duration: rangeTime},
            }),
          );
        }
      }
      appState.current = nextAppState;
    },
    [timeStartApp, dispatch, token],
  );

  const navigagteNotification = React.useCallback(
    (remoteMessage) => {
      if (!remoteMessage) {
        return;
      }
      const {
        data: {type, data, topic},
      } = remoteMessage;
      const detailData = JSON.parse(data);
      if (type === CREATE_ONLINE_CLASS) {
        navigator.navigate('AccessClass');
      } else {
        if (detailData.exercise) {
          navigator.navigate('EditorEssayExam', {
            params: {id: detailData.exercise},
          });
        }
        if (topic) {
          dispatch(
            markReadNotificationAction({topic, _id: detailData.exercise}),
          );
        }
      }
    },
    [dispatch],
  );

  useEffect(() => {
    setI18nConfig(language);
  }, [language]);

  useEffect(() => {
    if (isFirstUseApp) {
      const defaultLanguage = LANGUAGE_SUPPORT.includes(
        RNLocalize.getLocales()[0].languageCode,
      )
        ? RNLocalize.getLocales()[0].languageCode
        : 'en';
      dispatch(setLanguageApp(defaultLanguage));
      setI18nConfig(defaultLanguage);
      return;
    }
    setI18nConfig(language);
  }, [isFirstUseApp, language, dispatch]);

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, [timeStartApp, _handleAppStateChange]);

  useEffect(() => {
    const initChannel = async () => {
      const res = await notifee.createChannel({
        id: 'pocket_app',
        name: 'Pocket English',
        lights: false,
        vibration: true,
        importance: 4,
      });
      setChannelId(res);
    };
    if (OS.IsAndroid) {
      initChannel();
    }
  }, []);

  useEffect(() => {
    const getToken = async () => {
      if (!fcmToken) {
      }
      try {
        const newFCMToken = await messaging().getToken();
        dispatch(saveFcmToken({newToken: newFCMToken}));
      } catch (e) {
        console.log('error ', e);
      }
    };

    const checkPermission = async () => {
      await requestTrackingPermission();
      const authorizationStatus = await messaging().requestPermission();
      if (authorizationStatus) {
        getToken();
      }
    };
    checkPermission();
  }, [dispatch, fcmToken]);

  useEffect(() => {
    AsyncStorage.setItem('badge', `${unreadCountNotification}`);
    if (unreadCountNotification >= 0) {
      notifee.setBadgeCount(unreadCountNotification).then(() => console.log());
    }
  }, [unreadCountNotification]);

  useEffect(() => {
    messaging().onMessage(async (remoteMessage) => {
      if (AppState.currentState !== 'background') {
        dispatch(increaseNumberNotification());
        const dataNoti = remoteMessage.data;
        if (OS.IsAndroid) {
          await notifee.displayNotification({
            title:
              remoteMessage?.notification?.title || remoteMessage?.data?.title,
            body:
              remoteMessage?.notification?.body || remoteMessage?.data?.body,
            data: dataNoti,
            android: {channelId},
          });
        } else {
          await notifee.displayNotification({
            title:
              remoteMessage?.notification?.title || remoteMessage?.data?.title,
            body:
              remoteMessage?.notification?.body || remoteMessage?.data?.body,
            data: dataNoti,
            ios: {
              foregroundPresentationOptions: {
                alert: true,
                badge: true,
                sound: true,
              },
            },
          });
        }
      }
    });
  }, [channelId, dispatch]);

  useEffect(() => {
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          // console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          navigagteNotification(detail.notification);
          // console.log('User pressed notification', detail.notification);
          break;
        default:
          return;
      }
    });
  }, [navigagteNotification]);

  useEffect(() => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      try {
        navigagteNotification(remoteMessage);
      } catch (e) {}
      dispatch(decreaseNumberNotification());
    });
  }, [navigagteNotification, dispatch]);

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      });
  }, []);

  useEffect(() => {
    messaging().onTokenRefresh((tokenRefresh) => {
      dispatch(
        updateFcmToken({
          newToken: tokenRefresh,
          oldToken: fcmToken,
        }),
      );
    });
  }, [fcmToken, dispatch]);

  useEffect(() => {
    configApi(token.token || '');

    SplashScreen.hide();
  }, [token]);

  useEffect(() => {
    if (token.token) {
      SocketClient.initSocket(token.token);
      SocketClient.connect();
    }
  }, [token]);

  useEffect(() => {
    const bundleId = DeviceInfo.getBundleId();
    const version = DeviceInfo.getVersion();
    if (!token.token) {
      dispatch(
        // checkVersionApp({bundleId: 'org.aic.group.englishforschool', version}),
        checkVersionApp({bundleId, version}),
      );
    }
  }, [dispatch, token]);

  return <Root>{props.children}</Root>;
};

export default Bootstrap;
