import {put, call, takeLatest} from 'redux-saga/effects';
import FastImage from 'react-native-fast-image';

import {
  FETCH_LESSON,
  CHANGE_CURRENT_LESSON,
  FETCH_LESSON_PRACTICE_SPEAK,
  FETCH_TEACH_CATEGORY,
  FETCH_TEACH_CATEGORY_DETAIL,
} from './LessonType';
import lessonApi from './LessonApi';
import {
  fetchLessonFail,
  fetchLessonPracticeSpeakFail,
  fetchLessonPracticeSpeakSuccess,
  fetchLessonSuccess,
  fetchTeachingCategorySuccess,
  fetchTeachingCategoryFail,
  fetchTeachCategoryDetailSuccess,
  fetchTeachCategoryDetailFail,
} from './LessonAction';

export default function* lessonSagas() {
  yield takeLatest(FETCH_LESSON, fetchLesson);
  yield takeLatest(FETCH_LESSON_PRACTICE_SPEAK, fetchLessonSpeakPractice);
  yield takeLatest(CHANGE_CURRENT_LESSON, updateCurrentLesson);
  yield takeLatest(FETCH_TEACH_CATEGORY, fetchTeachCategory);
  yield takeLatest(FETCH_TEACH_CATEGORY_DETAIL, fetchTeachCategoryDetail);
}

function* fetchLesson({payload: {form}}) {
  const response = yield call(lessonApi.fetchLesson, form);
  if (response.ok && response.data) {
    yield put(fetchLessonSuccess(response.data));
    const listMedia = [];
    (response.data?.data || []).forEach((item) => {
      listMedia.push({uri: item.featured_image});
    });
    FastImage.preload(listMedia);
    return;
  }
  yield put(fetchLessonFail());
}

function* fetchLessonSpeakPractice({payload: {form}}) {
  const response = yield call(lessonApi.fetchSpeakPractice, form);
  if (response.ok && response.data) {
    yield put(fetchLessonPracticeSpeakSuccess(response.data));
    return;
  }
  yield put(fetchLessonPracticeSpeakFail());
}

function* fetchTeachCategory({payload: {data}}) {
  const response = yield call(lessonApi.fetchTeachingCategory, data);
  if (response.ok && response.data && response.data.data) {
    yield put(fetchTeachingCategorySuccess(response.data.data));
    return;
  }
  yield put(fetchTeachingCategoryFail());
}

function* fetchTeachCategoryDetail({payload: {data}}) {
  const response = yield call(lessonApi.fetchTeachingCategoryDetail, data);
  if (response.ok && response.data && response.data.data) {
    yield put(fetchTeachCategoryDetailSuccess(response.data.data));
    return;
  }
  yield put(fetchTeachCategoryDetailFail());
}

function* updateCurrentLesson({payload: {currentLesson}}) {
  yield call(lessonApi.updateCurrentLesson, {lesson_id: currentLesson._id});
}
