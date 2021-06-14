import api from '~/utils/apisaure';

const fetchExamFeature = (data) => {
  return api.post('/test/list-feature', data);
};

const fetchExamByMultiCategories = (data) => {
  return api.post('/test/search-by-categories', data);
};

const fetchExamByCategory = (data) => {
  return api.post('/test/search', data);
};

const getDetailExam = (data) => {
  return api.post('/test/get-detail', data);
};

const fetchCategoriesExam = (data) => {
  return api.post('/test-category/list', data);
};

const searchExam = (data) => {
  return api.post('/test/search', data);
};

const fetchSectionByExam = (data) => {
  return api.post('/test/get-detail-by-id', data);
};

const fetchQuestionByPart = (data) => {
  return api.post('/test-parts/get-detail-by-id', data);
};

const fetchListExamEssay = (data) => {
  return api.post('/writing-test/list', data);
};

const fetchListExamEssayUser = (data) => {
  return api.post('/writing-test-user/list', data);
};

const getDetailExamEssayUser = (data) => {
  return api.post('/writing-test-user/get-detail', data);
};

const saveAnswerExamEssayUser = (data) => {
  return api.post('/writing-test-user/save-answer', data);
};

const setTestResult = (data) => {
  return api.post('/test/set-test-result', data);
};

const getTestedResult = (data) => {
  return api.post('/test/get-test-result', data);
};

export default {
  fetchExamFeature,
  fetchExamByCategory,
  fetchExamByMultiCategories,
  fetchCategoriesExam,
  searchExam,
  getDetailExam,
  fetchSectionByExam,
  fetchQuestionByPart,
  fetchListExamEssay,
  fetchListExamEssayUser,
  getDetailExamEssayUser,
  saveAnswerExamEssayUser,
  setTestResult,
  getTestedResult,
};
