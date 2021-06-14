import {create} from 'apisauce';
import DeviceInfo from 'react-native-device-info';
import Config from 'react-native-config';
import {Alert, Linking} from 'react-native';

import {logout, logoutSuccess} from '~/features/authentication/AuthenAction';
import {OS} from '~/constants/os';
import {translate} from '~/utils/multilanguage';
let isUpdated = false;
// import lodash from 'lodash';
// import {
//   setStatusUserUpdateApp,
//   updateInfoApp,
// } from '~/features/config/ConfigAction';

// import {fetchLesson} from '~/features/lesson/LessonAction';
// import {fetchPart} from '~/features/part/PartAction';
// import navigator from '~/navigation/customNavigator';
// import {FETCH_LESSON} from '~/features/lesson/LessonType';
// import {FETCH_PART} from '~/features/part/PartType';
// const omitField = [
//   'created_at',
//   'updated_at',
//   '__v',
//   'description',
//   'pathBundleApp',
//   'pathInstallApp',
// ];

const api = create({
  headers: {
    'Cache-Control': 'no-cache',
  },
});
api.axiosInstance.defaults.timeout = 10000;

let store = null;
// let checkCookie = false;

export const setStoreApiSaure = (initStore) => {
  store = initStore;
};

export async function configApi(token = null, url = Config.API_URL) {
  api.setBaseURL(url);
  api.setHeader('Accept', 'application/json');
  api.setHeader('appVersion', DeviceInfo.getVersion());
  api.setHeader('bundleId', DeviceInfo.getBundleId());
  api.setHeader('appPlatform', OS.IsAndroid ? 'android' : 'ios');

  if (token) {
    api.setHeader('Authorization', `Bearer ${token}`);
  }
}

const naviMonitor = (response) => {
  if (
    response.status === 403 &&
    !response.config.url.includes('authentication/logout')
  ) {
    store.dispatch(logout());
    store.dispatch(logoutSuccess());
    return;
  }
  // if (
  //   response.headers['set-cookie'] &&
  //   response.status === 201 &&
  //   !checkCookie &&
  //   !response.config.url.includes('store/check-version') &&
  //   store
  // ) {
  //   const state = store.getState();
  //   const {config} = state;
  //   const cookies = response.headers['set-cookie'][0].split(';');
  //   const newVersion =
  //     cookies.filter((item) => item.includes('new_version'))[0] || '';
  //   if (newVersion) {
  //     try {
  //       const data = JSON.parse(
  //         decodeURIComponent(newVersion.replace('new_version=', '')),
  //       );
  //       if (
  //         !lodash.isEqual(
  //           lodash.omit(config.infoAppLatest, omitField),
  //           lodash.omit(data, omitField),
  //         )
  //       ) {
  //         store.dispatch(setStatusUserUpdateApp(false));
  //         store.dispatch(
  //           updateInfoApp(
  //             lodash.omit(data, ['created_at', 'updated_at', '__v']),
  //           ),
  //         );
  //       }
  //     } catch (e) {}
  //   }
  //   checkCookie = false;
  // }
  if (
    response.status === 406 &&
    response.data &&
    response.data.type === 'old_version_error' &&
    !isUpdated
  ) {
    const {new_version} = response.data;
    console.log('new_version ', new_version);
    isUpdated = true;
    Alert.alert(
      translate('Thông báo'),
      translate('Ứng dụng đã có phiên bản mới. Vui lòng cập nhật ứng dụng'),
      [
        {
          text: translate('Đồng ý'),
          onPress: () => {
            Linking.openURL(new_version?.pathInstallApp);
          },
        },
      ],
      {cancelable: false},
    );
  }
};

api.addMonitor(naviMonitor);

export default api;
