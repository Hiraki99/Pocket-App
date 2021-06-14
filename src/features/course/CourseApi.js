import api from '~/utils/apisaure';

const fetchCourse = (data) => {
  return api.post('/course/list', data);
};

const updateCurrentCourse = (data) => {
  return api.post('/user/update-current-course', data);
};

const fetchCommonCommentSpeak = () => {
  return api.post('/config/remember-comment-on-pronunciation-normal', {});
};

const joinClass = (data) => {
  return api.post('/student/join-class', data);
};

const statisticByDay = (data) => {
  return api.post('/statistic/user-duration-statistic-by-days', data);
};

const getTableContentCourse = (data) => {
  return api.post('/table-of-content/list', data);
};

export default {
  fetchCourse,
  updateCurrentCourse,
  fetchCommonCommentSpeak,
  joinClass,
  statisticByDay,
  getTableContentCourse,
};
