import {
  FETCH_LIST_VOCA_FEATURES,
  FETCH_LIST_VOCA_FEATURES_FAIL,
  FETCH_LIST_VOCA_FEATURES_SUCCESS,
  FETCH_LIST_TOPIC_VOCABULARY,
  FETCH_LIST_TOPIC_VOCABULARY_FAIL,
  FETCH_LIST_TOPIC_VOCABULARY_SUCCESS,
  SET_TRANSLATION,
  FETCH_TOPIC_MOST_ATTENTION,
  FETCH_TOPIC_MOST_ATTENTION_SUCCESS,
  FETCH_TOPIC_MOST_ATTENTION_FAIL,
  FETCH_WORDS_GROUP,
  FETCH_WORDS_GROUP_SUCCESS,
  FETCH_WORDS_GROUP_FAIL,
  SET_IN_WORD_GROUP,
} from './VocabularyType';

export const setTranslation = (word) => {
  return {
    type: SET_TRANSLATION,
    payload: {word},
  };
};

export const fetchVocabularyFeature = (data) => {
  return {
    type: FETCH_LIST_VOCA_FEATURES,
    payload: {data},
  };
};

export const fetchVocabularyFeatureSuccess = (data) => {
  return {
    type: FETCH_LIST_VOCA_FEATURES_SUCCESS,
    payload: {data},
  };
};

export const fetchVocabularyFeatureFail = (data) => {
  return {
    type: FETCH_LIST_VOCA_FEATURES_FAIL,
    payload: {data},
  };
};

export const fetchTopicVocabulary = (data) => {
  return {
    type: FETCH_LIST_TOPIC_VOCABULARY,
    payload: {data},
  };
};

export const fetchTopicVocabularySuccess = (data) => {
  return {
    type: FETCH_LIST_TOPIC_VOCABULARY_SUCCESS,
    payload: {data},
  };
};

export const fetchTopicVocabularyFail = (data) => {
  return {
    type: FETCH_LIST_TOPIC_VOCABULARY_FAIL,
    payload: {data},
  };
};

export const fetchTopicMostAttention = (data, topic) => {
  return {
    type: FETCH_TOPIC_MOST_ATTENTION,
    payload: {data, topic},
  };
};

export const fetchTopicMostAttentionSuccess = (data) => {
  return {
    type: FETCH_TOPIC_MOST_ATTENTION_SUCCESS,
    payload: {data},
  };
};

export const fetchTopicMostAttentionFail = (data) => {
  return {
    type: FETCH_TOPIC_MOST_ATTENTION_FAIL,
    payload: {data},
  };
};

export const fetchWordGroup = (data) => {
  return {
    type: FETCH_WORDS_GROUP,
    payload: {data},
  };
};

export const fetchWordGroupSuccess = (data) => {
  return {
    type: FETCH_WORDS_GROUP_SUCCESS,
    payload: {data},
  };
};

export const fetchWordGroupFail = (data) => {
  return {
    type: FETCH_WORDS_GROUP_FAIL,
    payload: {data},
  };
};

export const setInWordGroup = (data) => {
  return {
    type: SET_IN_WORD_GROUP,
    payload: {data},
  };
};
