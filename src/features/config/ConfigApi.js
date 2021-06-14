import api from '~/utils/apisaure';

const checkVersionApp = (data) => {
  return api.post('/store/check-version', data);
};

export default {
  checkVersionApp,
};
