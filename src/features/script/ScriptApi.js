import api from '~/utils/apisaure';

const doneActivity = (data) => {
  return api.post('/user-part-progress/done-activity', data);
};

export default {
  doneActivity,
};
