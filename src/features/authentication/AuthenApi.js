import api from '~/utils/apisaure';

const login = (form) => {
  return api.post('/user/login', form);
};

const loginGG = (data) => {
  return api.post('/google/oauth/mobile/callback', data);
};

const loginApple = (data) => {
  return api.post('/apple/oauth/callback', data);
};

const fetchMe = (data = {}) => {
  return api.post('/user/me', data);
};

const logTimeUsingApp = (data = {}) => {
  return api.post('/user-logs/log', data);
};

const logout = (data) => {
  return api.post('/user/logout', data);
};

const updateProfile = (data) => {
  return api.post('/user/update-profile', data);
};

const subscribeNotification = (data) => {
  return api.post('/notification-tokens/subscribe', data);
};

const unSubscribeNotification = (data) => {
  return api.post('/notification-tokens/unsubscribe', data);
};

const register = (form) => {
  return api.post('/user/register', form);
};

const ping = () => {
  return api.get('/ping');
};

const changePassword = (data) => {
  return api.post('/user/change-account-password', data);
};

const uploadAvatar = (data) => {
  return api.post('/media/upload-single-image', data, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
};

const updateFcmToken = (data) => {
  return api.post('/user/update-fcm-token', data);
};

export default {
  login,
  fetchMe,
  logTimeUsingApp,
  logout,
  subscribeNotification,
  unSubscribeNotification,
  ping,
  updateProfile,
  register,
  changePassword,
  uploadAvatar,
  updateFcmToken,
  loginGG,
  loginApple,
};
