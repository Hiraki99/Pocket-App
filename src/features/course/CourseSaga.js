import {put, call, takeLatest, select} from 'redux-saga/effects';

import {
  CHANGE_CURRENT_COURSE,
  FETCH_COURSE,
  FETCH_COMMON_COMMENT_SPEAK,
} from './CourseType';
import courseApi from './CourseApi';
import {
  fetchCourseFail,
  fetchCourseSuccess,
  fetchCommonCommentSpeakSuccess,
  fetchCommonCommentSpeakFail,
  changeCurrentCourse,
} from './CourseAction';

export default function* courseSagas() {
  yield takeLatest(FETCH_COURSE, fetchCourse);
  yield takeLatest(CHANGE_CURRENT_COURSE, updateCurrentCourse);
  yield takeLatest(FETCH_COMMON_COMMENT_SPEAK, fetchCommonCommentSpeak);
}

const getCurrentCourse = (state) => state.course.currentCourse;

function* fetchCourse({payload: {form}}) {
  const response = yield call(courseApi.fetchCourse, form);
  if (response.ok && response.data) {
    const currentCourse = yield select(getCurrentCourse);
    yield put(fetchCourseSuccess(response.data));
    if (!currentCourse) {
      yield put(changeCurrentCourse(response.data.data[0]));
    }
    return;
  }
  yield put(fetchCourseFail());
}

function* updateCurrentCourse({payload: {currentCourse}}) {
  yield call(courseApi.updateCurrentCourse, {course_id: currentCourse._id});
}

function* fetchCommonCommentSpeak() {
  const response = yield call(courseApi.fetchCommonCommentSpeak);
  if (response.ok && response.data && response.data.brief_comments) {
    yield put(fetchCommonCommentSpeakSuccess(response.data.brief_comments));
    return;
  }
  yield put(fetchCommonCommentSpeakFail());
}
