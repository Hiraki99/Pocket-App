import api from '~/utils/apisaure';

const fetchLesson = (data) => {
  return api.post('/lesson/list', data);
};

const fetchWordGroupData = (data) => {
  return api.post('/word/list-by-word-group-id', data);
};

const updateCurrentLesson = (data) => {
  return api.post('/user/update-current-lesson', data);
};

const fetchSpeakPractice = (data) => {
  return api.post('/part/list-vip', data);
};

const fetchTeachingCategory = (data) => {
  return api.post('/teaching-category/list', data);
};

const fetchTeachingCategoryDetail = (data) => {
  return api.post('/teaching/search-by-category', data);
};

const fetchCommunicationLesson = (data) => {
  return api.post('/communication/list', data);
};

export default {
  fetchLesson,
  fetchWordGroupData,
  updateCurrentLesson,
  fetchSpeakPractice,
  fetchTeachingCategory,
  fetchTeachingCategoryDetail,
  fetchCommunicationLesson,
};
