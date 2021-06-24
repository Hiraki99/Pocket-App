import {put, call, takeLatest, select} from 'redux-saga/effects';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {
  LOGIN,
  FETCH_ME,
  LOGOUT,
  UNSUBSCRIBE_NOTIFICATION,
  SUBSCRIBE_NOTIFICATION,
  UPDATE_PROFILE,
  REGISTER,
  // REGISTER_FAIL,
  CHANGE_PASSWORD,
  RETRY_ACTION_ERROR,
  UPDATE_FCM_TOKEN,
  UPDATE_TIME_USING,
  LOGIN_GOOGLE,
  LOGIN_APPLE,
} from './AuthenType';
import authApi from './AuthenApi';
import {
  updateFcmToken,
  loginSuccess,
  fetchMe,
  fetchMeSuccess,
  loginFail,
  logoutSuccess,
  fetchMeFail,
  enableNotification,
  // subscribeNotification,
  updateProfileSuccess,
  updateProfileFail,
  registerFail,
  changePasswordSuccess,
  changePasswordFail,
  fetchSTTTokenSuccess,
  // setStatusUserUpdateApp,
  // removeActionError,
} from './AuthenAction';

import api from '~/utils/apisaure';
// import Analytics, {logUserEvent} from '~/utils/firebase';
import {SUCCESS, ACCESS_DENIED, UNAUTHORIZED} from '~/constants/responseCodes';
import {
  fetchCommonCommentSpeak,
  fetchCourse,
} from '~/features/course/CourseAction';
import navigator from '~/navigation/customNavigator';
import {fetchDetailClass} from '~/features/class/ClassAction';
import {fetchTutorialActivity} from '~/features/activity/ActivityAction';

const CryptoJS = require('crypto-js');

const getUser = (state) => state.auth.user;
const getFcmToken = (state) => state.auth.fcmToken;

export default function* authSagas() {
  yield takeLatest(LOGIN, login);
  yield takeLatest(LOGIN_GOOGLE, loginGgSaga);
  yield takeLatest(LOGIN_APPLE, loginAppleSaga);
  yield takeLatest(FETCH_ME, gFetchMe);
  yield takeLatest(LOGOUT, logout);
  yield takeLatest(UNSUBSCRIBE_NOTIFICATION, unSubscribeNoti);
  yield takeLatest(SUBSCRIBE_NOTIFICATION, subscribeNoti);
  yield takeLatest(UPDATE_PROFILE, updateProfile);
  yield takeLatest(REGISTER, register);
  yield takeLatest(CHANGE_PASSWORD, changePassword);
  yield takeLatest(RETRY_ACTION_ERROR, retryActionError);
  yield takeLatest(UPDATE_FCM_TOKEN, updateFcmTokenSaga);
  yield takeLatest(UPDATE_TIME_USING, updateTimeUsingApp);
}

function* login({payload: {form}}) {
  const response = yield call(authApi.login, form);
  const fcmToken = yield select(getFcmToken);
  if (response.ok) {
    yield put(loginSuccess(response.data));
    api.setHeader('Authorization', `Bearer ${response.data.token}`);
    AsyncStorage.setItem('access_token', response.data.token);
    yield put(fetchMe());
    yield put(updateFcmToken({newToken: fcmToken}));
  } else {
    yield put(loginFail('Thông tin đăng nhập không đúng!'));
  }
}

function* loginGgSaga({payload: {data}}) {
  const response = yield call(authApi.loginGG, data);
  const fcmToken = yield select(getFcmToken);
  if (response.ok) {
    yield put(loginSuccess(response.data));
    api.setHeader('Authorization', `Bearer ${response.data.token}`);
    AsyncStorage.setItem('access_token', response.data.token);
    yield put(fetchMe());
    yield put(updateFcmToken({newToken: fcmToken}));
  } else {
    yield put(loginFail('Thông tin đăng nhập không đúng!'));
  }
}

function* loginAppleSaga({payload: {data}}) {
  const response = yield call(authApi.loginApple, data);
  console.log('response ', response);
  const fcmToken = yield select(getFcmToken);
  if (response.ok && response.data) {
    yield put(loginSuccess(response.data));
    api.setHeader('Authorization', `Bearer ${response.data.token}`);
    AsyncStorage.setItem('access_token', response.data.token);
    yield put(fetchMe());
    console.log('fcmToken ', fcmToken);
    yield put(updateFcmToken({newToken: fcmToken}));
  } else {
    yield put(loginFail('Thông tin đăng nhập không đúng!'));
  }
}

function* updateFcmTokenSaga({payload: {data}}) {
  yield call(authApi.updateFcmToken, data);
}

function* updateTimeUsingApp({payload: {data}}) {
  const user = yield select(getUser);
  if (user?._id) {
    yield call(authApi.logTimeUsingApp, {
      ...data,
      userId: user._id,
    });
  }
}

function* gFetchMe() {
  const response = yield call(authApi.fetchMe);
  if (response.ok && response.data) {
    yield put(fetchMeSuccess(response.data));
    if (response.data?.user && response.data?.user?.class) {
      yield put(fetchDetailClass({id: response.data?.user?.class}));
    }
    yield put(fetchCommonCommentSpeak());
    yield put(fetchCourse());
    yield put(fetchTutorialActivity());
    const {stt} = response.data;
    const bytes = yield CryptoJS.AES.decrypt(stt.stt_token, stt.stt_key);
    let originalText = yield bytes.toString(CryptoJS.enc.Utf8);
    yield put(
      fetchSTTTokenSuccess({
        ...stt,
        api_key: originalText,
      }),
    );
    return;
  }
  yield put(fetchMeFail());
  if (
    response.status === UNAUTHORIZED ||
    response.status === ACCESS_DENIED ||
    (!response.ok &&
      (response.data?.status === ACCESS_DENIED ||
        response.data?.status === UNAUTHORIZED))
  ) {
    Alert.alert(
      'Thông báo',
      'Phiên sử dụng hệ thống của bạn đã hết! Vui lòng đăng nhập lại để sử dụng hệ thống!',
      [
        {
          text: 'Đồng ý',
        },
      ],
    );
    api.deleteHeader('Authorization');
    AsyncStorage.removeItem('access_token');
    navigator.navigate('AuthStack');
  }
}

function* updateProfile({payload: {body}}) {
  let avatarPath;
  if (body.avatar) {
    const bodyFormData = new FormData();
    bodyFormData.append('image', {
      uri: body.avatar,
      name: '123.jpg',
      type: 'image/jpg',
    });
    bodyFormData.append('type', 'image/jpeg');
    const resUpload = yield call(authApi.uploadAvatar, bodyFormData);
    if (resUpload.ok) {
      avatarPath = resUpload.data.filePath;
    }
  }

  const response = yield call(authApi.updateProfile, {
    full_name: body.full_name,
    avatar: avatarPath,
  });

  if (response.ok) {
    yield put(
      updateProfileSuccess({
        full_name: body.full_name,
        avatar: avatarPath,
      }),
    );
    Alert.alert('Thông báo', 'Cập nhập thông tin thành công!', [
      {text: 'Đồng ý'},
    ]);
  } else {
    Alert.alert(
      'Thông báo',
      'Cập nhập thông tin không thành công, Mời thử lại!',
      [{text: 'Đồng ý'}],
    );
    yield put(updateProfileFail());
  }
}

function* logout({payload: {data}}) {
  navigator.reset('AuthStack');
  const response = yield call(authApi.logout, data);
  if (response.ok) {
    yield put(logoutSuccess());
  }

  api.deleteHeader('Authorization');
  AsyncStorage.removeItem('access_token');
}

function* subscribeNoti({payload: {data}}) {
  const response = yield call(authApi.subscribeNotification, data);
  if (response.ok && response.data.code === SUCCESS) {
    yield put(enableNotification(true));
  }
}

function* unSubscribeNoti({payload: {data}}) {
  const response = yield call(authApi.unSubscribeNotification, data);
  if (response.ok && response.data.code === SUCCESS) {
    yield put(enableNotification(false));
  }
}

function* register({payload: {form}}) {
  const response = yield call(authApi.register, form);
  if (response.ok) {
    yield put(loginSuccess(response.data));
    api.setHeader('Authorization', `Bearer ${response.data.token}`);
    AsyncStorage.setItem('access_token', response.data.token);
    yield put(fetchMe());
    const fcmToken = yield select(getFcmToken);
    yield put(updateFcmToken({newToken: fcmToken}));
  } else {
    let errorMess;
    if (response.data.message) {
      errorMess = response.data.message.join(',');
    }
    yield put(registerFail(errorMess));
  }
}

function* changePassword({payload: {body}}) {
  const response = yield call(authApi.changePassword, body);
  if (response.ok) {
    yield put(changePasswordSuccess());
    Alert.alert('Thông báo', 'Cập nhập mật khẩu thành công!', [
      {text: 'Đồng ý'},
    ]);
    navigator.goBack();
  } else {
    yield put(changePasswordFail());
    Alert.alert(
      'Thông báo',
      'Cập nhập mật khẩu không thành công, Mời thử lại!',
      [{text: 'Đồng ý'}],
    );
  }
}

function* retryActionError({payload: {data}}) {
  yield put(data);
}
