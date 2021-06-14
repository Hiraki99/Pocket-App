import api from '~/utils/apisaure';

const fetchDegreeListen = (data) => {
  return api.post('/degrees/list', data);
};

const fetchLectureListen = (data) => {
  return api.post('/listening/list-by-degree', data);
};

const fetchLectureDetailListen = (data) => {
  return api.post('/listening/get-detail', data);
};

const fetchListenCategory = (data) => {
  return api.post('/listening-category/list', data);
};

const fetchSongLesson = (data) => {
  return api.post('/song/list', data);
};

export default {
  fetchLectureListen,
  fetchDegreeListen,
  fetchLectureDetailListen,
  fetchListenCategory,
  fetchSongLesson,
};
