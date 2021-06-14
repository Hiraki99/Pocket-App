import api from '~/utils/apisaure';

const fetchTopicVocabulary = (data) => {
  return api.post('/word-category/list', data);
};

const fetchVocabularyFeatures = (data) => {
  return api.post('/word-group/list-feature', data);
};

const fetchVocabularyByCategory = (data) => {
  return api.post('/word-group/search-by-category', data);
};

const fetchVocabularyMostAttention = (data) => {
  return api.post('/word-group/search-by-categories', data);
};

const searchVocabulary = (data) => {
  return api.post('/vocabulary/list', data);
};

const translateVocabulary = (data) => {
  return api.post('/english-dictionary/get-detail', data);
};

const searchWordGroup = (data) => {
  return api.post('/word-group/search', data);
};

const fetchWordsByGroup = (data) => {
  return api.post('/word/list-by-word-group-id', data);
};

export default {
  fetchVocabularyFeatures,
  fetchTopicVocabulary,
  fetchVocabularyMostAttention,
  fetchVocabularyByCategory,
  searchVocabulary,
  translateVocabulary,
  searchWordGroup,
  fetchWordsByGroup,
};
