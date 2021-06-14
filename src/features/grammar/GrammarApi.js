import api from '~/utils/apisaure';

const fetchGrammarLecture = (data) => {
  return api.post('/grammar/list', data);
};
const fetchDocsHelpful = (data) => {
  return api.post('/reference-category/list', data);
};
const fetchListDocsHelpful = (data) => {
  return api.post('/reference/search-by-category', data);
};

export default {
  fetchGrammarLecture,
  fetchDocsHelpful,
  fetchListDocsHelpful,
};
