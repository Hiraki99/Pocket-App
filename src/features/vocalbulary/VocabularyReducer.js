import {
  SET_TRANSLATION,
  FETCH_LIST_VOCA_FEATURES_SUCCESS,
  FETCH_LIST_TOPIC_VOCABULARY_SUCCESS,
  FETCH_TOPIC_MOST_ATTENTION_SUCCESS,
  FETCH_WORDS_GROUP_SUCCESS,
  SET_IN_WORD_GROUP,
} from './VocabularyType';

const initState = {
  wordTranslation: '',
  vocabularyFeatures: [],
  topicsVocabulary: [],
  topicsMostAttention: [],
  wordGroup: [],
  fromWordGroup: false,
};

export default (state = initState, action) => {
  const {type, payload} = action;
  switch (type) {
    case SET_TRANSLATION:
      return {
        ...state,
        wordTranslation: payload.word,
      };
    case FETCH_LIST_VOCA_FEATURES_SUCCESS:
      return {
        ...state,
        vocabularyFeatures: payload.data,
      };
    case FETCH_LIST_TOPIC_VOCABULARY_SUCCESS:
      return {
        ...state,
        topicsVocabulary: payload.data,
      };
    case FETCH_TOPIC_MOST_ATTENTION_SUCCESS:
      return {
        ...state,
        topicsMostAttention: payload.data,
      };
    case FETCH_WORDS_GROUP_SUCCESS:
      return {
        ...state,
        wordGroup: payload.data,
      };
    case SET_IN_WORD_GROUP:
      return {
        ...state,
        fromWordGroup: payload.data,
      };
    default:
      return state;
  }
};
