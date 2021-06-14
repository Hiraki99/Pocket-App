import {put, call, takeLatest, select} from 'redux-saga/effects';
import {Alert, Linking} from 'react-native';
import {setStatusUserUpdateApp} from '~/features/config/ConfigAction';
import configApi from './ConfigApi';
import {CHECK_VERSION_APP} from '~/features/config/ConfigType';
const disableUpdateSelect = (state) => state.config.disableUpdate;

export default function* config() {
  yield takeLatest(CHECK_VERSION_APP, checkVersionAppSaga);
}

const AsyncAlert = async () =>
  new Promise((resolve) => {
    Alert.alert(
      'Thông báo',
      'Có phiên bản mới, Cập nhật ngay!',
      [
        {
          text: 'Đồng ý',
          onPress: () => {
            resolve({status: true});
          },
          style: 'cancel',
        },
        {
          text: 'Từ chối',
          onPress: () => {
            resolve({status: false});
          },
        },
      ],
      {cancelable: false},
    );
  });

function* checkVersionAppSaga({payload: {data}}) {
  const res = yield call(configApi.checkVersionApp, data);
  // const disableUpdate = yield select(disableUpdateSelect);
  if (res.ok && res.data) {
    if (data.manually && !res.data.enableUpdate) {
      Alert.alert(
        'Thông báo',
        'Ứng dụng đã được cập nhật phiên bản mới nhất.',
        [
          {
            text: 'Đồng ý',
          },
        ],
      );
      return;
    }
    const {infoApp} = res.data;
    if (infoApp?.forceUpdate && res.data.enableUpdate) {
      yield put(setStatusUserUpdateApp(false));
      return Alert.alert(
        'Thông báo',
        'Có phiên bản mới quan trong, Cập nhật ngay!',
        [
          {
            text: 'Đồng ý',
            onPress: () => {
              Linking.openURL(infoApp.pathInstallApp);
            },
          },
        ],
        {
          onDismiss: () => Linking.openURL(infoApp.pathInstallApp),
        },
      );
    }
    if (res.data.enableUpdate && data.manually) {
      const alertRes = yield call(AsyncAlert);
      if (!alertRes.status) {
        yield put(setStatusUserUpdateApp(true));
      } else {
        Linking.openURL(infoApp.pathInstallApp);
      }
    }
  }
}
