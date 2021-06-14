import api from '~/utils/apisaure';

const fetchDetailClass = (data) => {
  return api.post('/class/detail', data);
};

const rankingDuration = (data) => {
  return api.post('/class/ranking-duration-by-days', data);
};

const rankingScore = (data) => {
  return api.post('/class/ranking-normal-score-by-days', data);
};

const getListProvinces = (data) => {
  return api.post('/provincial-department-of-education/list', data);
};

const getListDistricts = (data) => {
  return api.post('/district-department-of-education/list', data);
};

const getListSchoolLevels = (data) => {
  return api.post('/school-level/list', data);
};

const getListSchools = (data) => {
  return api.post('/school/list', data);
};

const updateSchool = (data) => {
  return api.post('/user/update-school', data);
};

export default {
  fetchDetailClass,
  rankingDuration,
  rankingScore,
  getListProvinces,
  getListDistricts,
  getListSchoolLevels,
  getListSchools,
  updateSchool,
};
