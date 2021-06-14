import {put, call, takeLatest} from 'redux-saga/effects';
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
} from './CourseAction';

export default function* courseSagas() {
  yield takeLatest(FETCH_COURSE, fetchCourse);
  yield takeLatest(CHANGE_CURRENT_COURSE, updateCurrentCourse);
  yield takeLatest(FETCH_COMMON_COMMENT_SPEAK, fetchCommonCommentSpeak);
}

function* fetchCourse({payload: {form}}) {
  const response = yield call(courseApi.fetchCourse, form);
  if (response.ok && response.data) {
    yield put(fetchCourseSuccess(response.data));
    return;
  }
  yield put(fetchCourseFail());
}

function* updateCurrentCourse({payload: {currentCourse}}) {
  yield call(courseApi.updateCurrentCourse, {course_id: currentCourse._id});
}

function* fetchCommonCommentSpeak() {
  const response = yield call(courseApi.fetchCommonCommentSpeak);
  if (response.ok && response.data) {
    yield put(fetchCommonCommentSpeakSuccess(response.data.brief_comments));
    return;
  }
  yield put(fetchCommonCommentSpeakFail());
}
