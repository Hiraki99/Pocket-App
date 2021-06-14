import api from '~/utils/apisaure';

const fetchListNotification = (data) => {
  return api.post('/notification/list-all', data);
};

const markReadNotification = (data) => {
  return api.post('/notification/mark-read', data);
};

const markReadAllNotificationApi = (data) => {
  return api.post('/notification/mark-read-all', data);
};

export default {
  markReadNotification,
  fetchListNotification,
  markReadAllNotificationApi,
};
