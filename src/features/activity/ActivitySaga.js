import {put, call, takeLatest} from 'redux-saga/effects';
import {
  FETCH_ACTIVITY,
  FETCH_ACTIVITY_COMMUNICATION,
  FETCH_ACTIVITY_GRAMMAR,
  FETCH_ACTIVITY_PRACTICE_SPEAK,
  FETCH_ACTIVITY_SONG,
  FETCH_ACTIVITY_VOCABULARY,
  FETCH_TUTORIALS_ACTIVITY,
} from './ActivityType';
import activitiesApi from './ActivityApi';
import {
  fetchActivityFail,
  fetchActivitySuccess,
  fetchActivityPracticeSpeakSuccess,
  fetchActivityPracticeSpeakFail,
  fetchActivityGrammarSuccess,
  fetchActivityGrammarFail,
  fetchActivityCommunicationSuccess,
  fetchActivityCommunicationFail,
  fetchActivityVocabularySuccess,
  fetchActivityVocabularyFail,
  fetchActivitySongSuccess,
  fetchActivitySongFail,
  fetchTutorialActivitySuccess,
  fetchTutorialActivityFail,
} from './ActivityAction';

export default function* activitiesSagas() {
  yield takeLatest(FETCH_ACTIVITY, fetchActivity);
  yield takeLatest(FETCH_ACTIVITY_PRACTICE_SPEAK, fetchActivityPracticeSpeak);
  yield takeLatest(FETCH_ACTIVITY_GRAMMAR, fetchActivityGrammar);
  yield takeLatest(FETCH_ACTIVITY_COMMUNICATION, fetchActivityCommunication);
  yield takeLatest(FETCH_ACTIVITY_VOCABULARY, fetchActivityVocabulary);
  yield takeLatest(FETCH_ACTIVITY_SONG, fetchSongActivity);
  yield takeLatest(FETCH_TUTORIALS_ACTIVITY, fetchTutorial);
}

function* fetchActivity({payload: {form}}) {
  const response = yield call(activitiesApi.fetchActivity, form);
  if (response.ok && response.data) {
    yield put(fetchActivitySuccess(response.data));
    return;
  }
  yield put(fetchActivityFail());
}

function* fetchActivityPracticeSpeak({payload: {form}}) {
  const response = yield call(activitiesApi.fetchSpeakPracticeActivity, form);
  if (response.ok && response.data) {
    yield put(fetchActivityPracticeSpeakSuccess(response.data));
    return;
  }
  yield put(fetchActivityPracticeSpeakFail());
}

function* fetchActivityGrammar({payload: {data}}) {
  const response = yield call(activitiesApi.fetchGrammarActivity, data);
  if (response.ok && response.data) {
    yield put(fetchActivityGrammarSuccess(response.data));
    return;
  }
  yield put(fetchActivityGrammarFail());
}

function* fetchSongActivity({payload: {data}}) {
  const response = yield call(activitiesApi.getActivitySong, data);
  if (response.ok && response.data) {
    yield put(fetchActivitySongSuccess(response.data));
    return;
  }
  yield put(fetchActivitySongFail());
}

function* fetchActivityCommunication({payload: {data}}) {
  const response = yield call(activitiesApi.fetchCommunicationActivity, data);
  if (response.ok && response.data) {
    yield put(fetchActivityCommunicationSuccess(response.data));
    return;
  }
  yield put(fetchActivityCommunicationFail());
}

function* fetchActivityVocabulary({payload: {data}}) {
  const response = yield call(activitiesApi.fetchVocabularyActivity, data);
  if (response.ok && response.data) {
    yield put(fetchActivityVocabularySuccess(response.data));
    return;
  }
  yield put(fetchActivityVocabularyFail());
}

function* fetchTutorial() {
  const response = yield call(activitiesApi.fetchTutorialsActivity);
  if (response.ok && response.data) {
    yield put(fetchTutorialActivitySuccess(response.data));
    return;
  }
  yield put(fetchTutorialActivityFail());
}
