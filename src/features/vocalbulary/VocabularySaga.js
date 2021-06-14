import {put, call, takeLatest} from 'redux-saga/effects';
import FastImage from 'react-native-fast-image';
import {
  FETCH_LIST_TOPIC_VOCABULARY,
  FETCH_LIST_VOCA_FEATURES,
  FETCH_TOPIC_MOST_ATTENTION,
  FETCH_WORDS_GROUP,
} from './VocabularyType';
import vocabularyApi from './VocabularyApi';
import {
  fetchVocabularyFeatureSuccess,
  fetchVocabularyFeatureFail,
  fetchTopicVocabularySuccess,
  fetchTopicVocabularyFail,
  fetchTopicMostAttention,
  fetchTopicMostAttentionSuccess,
  fetchTopicMostAttentionFail,
  fetchWordGroupSuccess,
  fetchWordGroupFail,
} from './VocabularyAction';

export default function* lessonSagas() {
  yield takeLatest(FETCH_LIST_VOCA_FEATURES, fetchVocabularyFeature);
  yield takeLatest(FETCH_LIST_TOPIC_VOCABULARY, fetchTopicVocabulary);
  yield takeLatest(FETCH_TOPIC_MOST_ATTENTION, fetchTopicMostAttentionSaga);
  yield takeLatest(FETCH_WORDS_GROUP, fetchWordsByGroup);
}

function* fetchVocabularyFeature({payload: {form}}) {
  const response = yield call(vocabularyApi.fetchVocabularyFeatures, form);
  if (response.ok && response.data && response.data.data) {
    yield put(fetchVocabularyFeatureSuccess(response.data.data));
    return;
  }
  yield put(fetchVocabularyFeatureFail());
}

function* fetchTopicVocabulary({payload: {form}}) {
  const response = yield call(vocabularyApi.fetchTopicVocabulary, form);
  if (response.ok && response.data && response.data.data) {
    const listIdTopicVHottest = response.data.data;
    yield put(
      fetchTopicMostAttention(
        {
          word_categories: listIdTopicVHottest.map((item) => item._id),
        },
        listIdTopicVHottest,
      ),
    );
    yield put(fetchTopicVocabularySuccess(response.data.data));
    return;
  }
  yield put(fetchTopicVocabularyFail());
}

function* fetchTopicMostAttentionSaga({payload: {data, topic}}) {
  const response = yield call(vocabularyApi.fetchVocabularyMostAttention, data);
  if (response.ok && response.data && response.data.data) {
    const dataUpdate = [];
    response.data.data.forEach((item) => {
      const info = topic.filter((it) => it._id === item.category);
      if (info.length === 0) {
        return;
      }
      dataUpdate.push({
        id: `${info[0]._id}_most_attention`,
        title: info[0].name,
        topic: info[0],
        data: item.items,
      });
    });
    yield put(fetchTopicMostAttentionSuccess(dataUpdate));
    return;
  }
  yield put(fetchTopicMostAttentionFail());
}

function* fetchWordsByGroup({payload: {data}}) {
  const response = yield call(vocabularyApi.fetchWordsByGroup, data);
  if (response.ok && response.data) {
    let listPreload = [];
    response.data.forEach((item) => {
      item.list_images.forEach((it) => {
        listPreload.push({uri: it.thumb});
      });
    });
    FastImage.preload(listPreload);
    yield put(fetchWordGroupSuccess(response.data));
    return;
  }
  yield put(fetchWordGroupFail());
}
