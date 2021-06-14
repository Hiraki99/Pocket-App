import api from '~/utils/apisaure';

const fetchListHomework = (data) => {
  return api.post('/exercise/list', data);
};

const fetchDetailHomework = (data) => {
  return api.post('/exercise/detail', data);
};

const saveWritingHomework = (data) => {
  return api.post('/exercise-writing-user/save-answer', data);
};

const detailWritingHomework = (data) => {
  return api.post('/exercise-writing-user/get-detail', data);
};

export default {
  fetchListHomework,
  fetchDetailHomework,
  saveWritingHomework,
  detailWritingHomework,
};
