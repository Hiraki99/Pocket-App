import {channel} from 'redux-saga';
import {all, fork, call} from 'redux-saga/effects';

import authSagas from './features/authentication/AuthenSaga';
import courseSagas from './features/course/CourseSaga';
import lessonSagas from './features/lessons/LessonSaga';
import partSagas from './features/part/PartSaga';
import activitySagas from './features/activity/ActivitySaga';
import scriptSagas from './features/script/ScriptSaga';
import vocabularySaga from './features/vocalbulary/VocabularySaga';
import examSaga from './features/exam/ExamSaga';
import classSaga from './features/class/ClassSaga';
import configSaga from './features/config/ConfigSaga';
import homeworkSaga from './features/homework/HomeworkSaga';
import notificationSaga from './features/notification/NotificationSaga';

export default function* rootSaga() {
  yield all([
    fork(authSagas),
    fork(courseSagas),
    fork(lessonSagas),
    fork(partSagas),
    fork(activitySagas),
    fork(scriptSagas),
    fork(examSaga),
    fork(vocabularySaga),
    fork(homeworkSaga),
    fork(classSaga),
    fork(configSaga),
    fork(notificationSaga),
  ]);
}
