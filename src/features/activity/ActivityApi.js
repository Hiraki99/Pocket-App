import api from '~/utils/apisaure';

const fetchActivity = (data) => {
  return api.post('/activity/list', data);
};

const reviewActivity = (data) => {
  return api.post('/review-activity-media/add', data, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
};

const fetchSpeakPracticeActivity = (data) => {
  return api.post('/activity/list-vip', data);
};

const fetchGrammarActivity = (data) => {
  return api.post('/activity-grammar/search-by-grammar', data);
};

const fetchCommunicationActivity = (data) => {
  return api.post('/activity-communication/search-by-communication', data);
};

const fetchVocabularyActivity = (data) => {
  return api.post('/activity-word-group/search-by-word-group', data);
};

const pronunciationByWord = (data) => {
  return api.post('/pronunciation/find-by-id', data);
};

const getVocabularyAllActivity = (data) => {
  return api.post('/activity/get-vocabulary', data);
};

const getActivitySong = (data) => {
  return api.post('/activity-song/search-by-song', data);
};

const fetchTutorialsActivity = () => {
  return api.post('/activity-type/get-all-tutorials');
};

const fetchReadingContent = (data) => {
  return api.post('/reading-content/find-by-id', data);
};

export default {
  fetchActivity,
  reviewActivity,
  fetchSpeakPracticeActivity,
  pronunciationByWord,
  fetchGrammarActivity,
  fetchCommunicationActivity,
  fetchVocabularyActivity,
  getVocabularyAllActivity,
  getActivitySong,
  fetchTutorialsActivity,
  fetchReadingContent,
};
