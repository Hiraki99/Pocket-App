import lodash from 'lodash';
import {put, call, takeLatest, select} from 'redux-saga/effects';
import moment from 'moment';

import {
  FETCH_CLASS_LIVE_INFO,
  FETCH_DOCS_LIVE,
  FETCH_LIST_LIVE_CLASS,
  FETCH_SESSION_ACTIVITY,
  FETCH_LIVE_CLASS_INFO,
  UPDATE_SCORE_RECONNECT,
  RESTORE_SCRIPT_STATE,
  UPDATE_STATE_JOIN_CLASS,
  SET_MAIN_SCRIPT_ACTIVITY,
  SEND_LIVE_SCORE,
  UPDATE_COURSEWARES_DATA,
  UPDATE_SCORE_WHEN_DONE_WARES,
} from './LiveClassType';
import liveClassApi from './LiveClassApi';

import SocketClient from '~/utils/socket-client';
import {
  fetchClassLiveInfoSuccess,
  fetchDocsLiveClass,
  fetchDocsLiveClassSuccess,
  fetchListLiveClassSuccessAction,
  fetchSessionActivitySuccessAction,
  fetchLiveClassInfoSuccessAction,
  setStatusDoneWares,
  setTimerLiveClass,
  setCurrentWares,
  restoreScriptStateAction,
  setMainScriptActivity,
  restoreRaiseHandData,
  updateCoursewaresData,
  setCurrentLessonOpenLive,
} from '~/features/liveclass/LiveClassAction';
import {
  createDetailInfoStudentClass,
  updateScoreClass,
  resetStudentScriptScore,
  updateStudentScriptScore,
  selectedStudentViewResult,
  resetDetailResultStudent,
  updateScoreReconnect,
} from '~/features/liveclass/LiveClassResultsAction';
import {PAGE_SIZE} from '~/constants/query';
import {changeCurrentActivity} from '~/features/activity/ActivityAction';
import {
  changeCurrentScriptItem,
  pushListActions,
  resetAction,
} from '~/features/script/ScriptAction';
import navigator from '~/navigation/customNavigator';
import {restoreActionFromLiveState} from '~/utils/liveClass';
import {generateNextActivity} from '~/utils/script';
import {makeid} from '~/utils/utils';
import {restoreReactiveCoursewareData} from '~/features/liveclass/LiveClassReactiveCoursewareAction';

const getUser = (state) => state.auth.user;
const getClassUser = (state) => state.auth?.user?.class;
const detailResultStudentsClassLive = (state) =>
  state.liveClassResults.detailResultQuestion;
const getEnableScript = (state) => state.socket.enableScript;
const detailWaresClassLive = (state) => state.liveClass.detailCourseWares;

const getCurrentScriptItem = (state) => state.script.currentScriptItem;
const getScoreFlashcardNew = (state) => {
  return state.activity.totalQuestion === 0
    ? 0
    : Math.round(
        (state.activity.doneQuestion / state.activity.totalQuestion) * 100,
      );
};
const getSelectedScheduleId = (state) => state.liveClass.selectedScheduleId;
const getCurrentWares = (state) => state.liveClass.currentWares;

export default function* lessonSagas() {
  yield takeLatest(FETCH_LIST_LIVE_CLASS, fetchListLiveClassSaga);
  yield takeLatest(FETCH_LIVE_CLASS_INFO, fetchLiveClassInfoSaga);
  yield takeLatest(FETCH_SESSION_ACTIVITY, fetchSessionActivitySaga);
  yield takeLatest(FETCH_CLASS_LIVE_INFO, fetchClassLiveInfoSaga);
  yield takeLatest(UPDATE_COURSEWARES_DATA, updateCoursewaresDataSaga);
  yield takeLatest(FETCH_DOCS_LIVE, fetchDocsClassSaga);
  yield takeLatest(UPDATE_SCORE_RECONNECT, updateScoreReconnectSaga);
  yield takeLatest(RESTORE_SCRIPT_STATE, restoreScriptState);
  yield takeLatest(UPDATE_STATE_JOIN_CLASS, updateStateJoinClassFunction);
  yield takeLatest(SET_MAIN_SCRIPT_ACTIVITY, setMainScriptActivitySaga);
  yield takeLatest(SEND_LIVE_SCORE, sendLiveScoreSaga);
  yield takeLatest(UPDATE_SCORE_WHEN_DONE_WARES, updateScoreWhenDoneWaresSaga);
}

function* fetchListLiveClassSaga({payload: {data}}) {
  const response = yield call(liveClassApi.fetchListLiveClass, data);
  if (response.ok && response.data && response.data.data) {
    const canLoadMore = response.data.totalCount > (data.page + 1) * PAGE_SIZE;
    yield put(
      fetchListLiveClassSuccessAction({...data, canLoadMore}, response.data),
    );
  }
}

function* updateStateJoinClassFunction({payload: {data}}) {
  let detailWaresClass = {};
  const userInfo = yield select(getUser);
  const detailWaresClassSchedule = yield select(detailWaresClassLive);
  if (Object.keys(detailWaresClassSchedule).length > 0) {
    detailWaresClass = detailWaresClassSchedule;
  }
  yield put(selectedStudentViewResult(userInfo.email));
  if (data && data.joinSuccess) {
    // console.log('data ', data);
    const {liveClassState} = data;
    const {courseware_id, is_completed, score, current_state} =
      liveClassState?.current_courseware || {};
    // set timer countdown
    if (liveClassState?.current_countdown) {
      const start_time = moment.unix(
        liveClassState?.current_countdown?.start_time / 1000,
      );

      yield put(
        setTimerLiveClass({
          type: liveClassState?.current_countdown?.params?.type,
          time: liveClassState?.current_countdown?.time,
          timeStart: start_time,
        }),
      );
    }
    yield put(restoreRaiseHandData(liveClassState?.raise_hand || []));
    if (liveClassState?.current_lesson) {
      (liveClassState?.current_lesson?.items || []).forEach((item) => {
        let normalizeData = {
          ...item,
          _id: item.key,
          type: 'general',
        };
        if (item.activity) {
          normalizeData = {
            ...normalizeData,
            items: [
              {
                key: item.key,
                attachment: {
                  ...item.activity,
                  type: 'activity',
                },
              },
            ],
          };
        }
        detailWaresClass[item.key] = normalizeData;
      });
      yield put(
        setCurrentLessonOpenLive(
          liveClassState?.current_lesson,
          detailWaresClass,
        ),
      );
    }

    let currentDetailWaresInClass = null;
    if (detailWaresClass[courseware_id]) {
      currentDetailWaresInClass = detailWaresClass[courseware_id];
    } else {
      if (liveClassState?.current_courseware) {
        currentDetailWaresInClass = {
          ...liveClassState?.current_courseware,
          type: liveClassState?.current_courseware.courseware_type,
          items: [
            {
              key: liveClassState?.current_courseware.courseware_id,
              attachment: {
                ...liveClassState?.current_courseware.activity,
                type: 'activity',
              },
            },
          ],
        };
      }
    }
    // set current coursewares
    if (currentDetailWaresInClass) {
      if (!is_completed) {
        yield put(setStatusDoneWares(is_completed));
      }
      const currentWares = yield select(getCurrentWares);
      if (currentWares?._id !== courseware_id) {
        yield put(resetStudentScriptScore());
      }
      yield put(
        setCurrentWares(
          currentDetailWaresInClass,
          current_state?.generalActivePage || 0,
        ),
      );
      if (liveClassState?.current_attachment) {
        yield put(
          restoreReactiveCoursewareData(
            {
              ware: currentDetailWaresInClass,
              wareIndex: current_state?.generalActivePage || 0,
            },
            liveClassState?.current_attachment,
          ),
        );
      }
      if (currentDetailWaresInClass?.type === 'script') {
        //  Xu ly script
        yield put(
          restoreScriptStateAction(
            data.liveClassState?.current_courseware,
            currentDetailWaresInClass,
          ),
        );
      }
      if (currentDetailWaresInClass?.type === 'general') {
        const currentQuestionWares =
          currentDetailWaresInClass.items[
            current_state?.generalActivePage || 0
          ];
        // check set main script activity
        if (currentQuestionWares?.attachment?.type === 'activity') {
          let isSubmitted = false;
          (score || []).some((it) => {
            if (userInfo.email === it.user.email && it.is_submitted) {
              isSubmitted = true;
              return true;
            }
          });
          yield put(
            setMainScriptActivity(
              currentQuestionWares?.attachment,
              score,
              !isSubmitted,
            ),
          );
        }
        // sync result data
        if (currentQuestionWares && score && score.length > 0) {
          yield put(updateScoreReconnect(score, currentQuestionWares));
        }
      }
    } else {
      yield put(setCurrentWares(null, 0));
    }
  }
}

function* updateScoreReconnectSaga({payload: {data, currentQuestionWares}}) {
  const detailResultStudentInClass = yield select(
    detailResultStudentsClassLive,
  );
  const user = yield select(getUser);

  for (let i = 0; i <= data.length - 1; i++) {
    let updateQuestions = [];
    const item = data[i];
    if (user.email === item.user.email && item.is_submitted) {
      yield put(setStatusDoneWares(item.is_submitted));
    }

    if (
      detailResultStudentInClass[item.user.email] &&
      detailResultStudentInClass[item.user.email].questions &&
      detailResultStudentInClass[item.user.email].questions.length > 0
    ) {
      updateQuestions = detailResultStudentInClass[
        item.user.email
      ].questions.map((questionItem) => {
        const questionReconnect = (item.answers || []).filter(
          (ans) => ans.question_key === questionItem.key,
        );
        if (questionReconnect.length > 0) {
          return {
            ...questionItem,
            ...questionReconnect[0],
          };
        }
        return questionItem;
      });
    } else {
      (
        currentQuestionWares?.attachment?.items ||
        currentQuestionWares?.attachment?.script ||
        []
      ).forEach((questionItem) => {
        if (questionItem.type !== 'sentence') {
          const questionReconnect = (item.answers || []).filter(
            (ans) => ans.question_key === questionItem.key,
          );
          if (questionReconnect.length > 0) {
            updateQuestions.push({
              ...questionItem,
              ...questionReconnect[0],
            });
          } else {
            updateQuestions.push(questionItem);
          }
        }
      });
    }
    yield put(
      updateScoreClass(item.user.email, {
        ...item.user,
        questions: updateQuestions,
      }),
    );
    updateQuestions = null;
  }
}

function* fetchLiveClassInfoSaga({payload: {classId}}) {
  const response = yield call(liveClassApi.fetchLiveClassInfo, classId);
  const user = yield select(getUser);
  if (response.ok && response.data) {
    yield put(fetchLiveClassInfoSuccessAction(classId, response.data));
    if (response.data.class) {
      let detail = {};
      const listId = response.data.class.students.map((item) => {
        detail[item.email] = item;
        return item.email;
      });
      yield put(
        createDetailInfoStudentClass(
          lodash.uniq([user.email, ...listId]),
          detail,
        ),
      );
    }
  }
}

function* fetchSessionActivitySaga({payload: {sessionId}}) {
  const response = yield call(liveClassApi.fetchSessionActivity, sessionId);
  if (response.ok && response.data) {
    yield put(fetchSessionActivitySuccessAction(sessionId, response.data));
  }
}

function* fetchClassLiveInfoSaga({payload: {data}}) {
  yield put(fetchDocsLiveClass(data));
  const response = yield call(liveClassApi.getClassOnline, data);

  if (response.ok && response.data && response.data.data) {
    const {students} = response.data.data;
    let detailStudent = {};
    (students || []).forEach((item) => {
      detailStudent = {...detailStudent, [item.email]: item};
    });
    yield put(fetchClassLiveInfoSuccess(detailStudent));
  }
}

function* fetchDocsClassSaga({payload: {data, isSchoolClass}}) {
  const response = isSchoolClass
    ? yield call(liveClassApi.getSchoolClassCoursewares, data)
    : yield call(liveClassApi.getDocsClassOnline, data);
  if (response.ok && response.data && response.data.length > 0) {
    const listData = isSchoolClass
      ? [{coursewares: response.data, _id: 1}]
      : response.data;
    yield put(updateCoursewaresData(listData));
  }
}

function* updateCoursewaresDataSaga({payload: {listData}}) {
  let detailCourseWares = {};
  const parts = listData.map((item, index) => {
    (item.coursewares || []).forEach((ware, wareIndex) => {
      // eslint-disable-next-line no-unused-vars
      const {coursewares, ...restCourse} = item;
      let formatWares = {
        ...ware,
      };
      if (ware.type === 'script') {
        formatWares = ware;
        formatWares.script = (ware.items || []).map((scriptItem) => {
          return {
            ...scriptItem,
            id: scriptItem.key,
            scriptInType: 'live',
          };
        });
      }
      detailCourseWares = {
        ...detailCourseWares,
        [ware._id]: {
          ...formatWares,
          scriptInType: 'live',
          wareIndex: wareIndex + 1,
          coursewaresLength: item.coursewares.length,
          partInfo: restCourse,
        },
      };
    });

    return {
      ...item,
      partIndex: index + 1,
    };
  });
  yield put(fetchDocsLiveClassSuccess(parts, detailCourseWares));
}
// Restore lại trạng thái dạng MainScript
function* restoreScriptState({payload: {currentState, courseWare}}) {
  const isComplete = currentState.is_completed;
  const myUser = yield select(getUser);
  const enableScript = yield select(getEnableScript);
  let myAnswerMap = new Map();

  let listUpdateScores = [];

  // update current score + my answer map
  currentState?.score.map((it) => {
    const user = it.user;
    const answers = it.answers;
    answers.map((itAnswer) => {
      if (user.email === myUser.email) {
        myAnswerMap.set(itAnswer.question_key, itAnswer);
      }
      listUpdateScores.push({
        userId: user.email,
        scriptId: itAnswer.question_key,
        data: {user, answer: itAnswer},
      });
    });
  });

  // update score
  yield put(updateStudentScriptScore(listUpdateScores));

  // restore data main script
  let currentScript = null;
  let listActions = [];
  courseWare.script.map((itScript) => {
    const scriptId = itScript.id;
    if (itScript.type !== 'sentence') {
      if (myAnswerMap.has(scriptId)) {
        const itAnswer = myAnswerMap.get(scriptId);
        listActions.push(...restoreActionFromLiveState(itScript, itAnswer));
        currentScript = itScript;
      }
    }
  });
  yield put(changeCurrentActivity(courseWare));
  yield put(changeCurrentScriptItem(currentScript));
  if (listActions.length > 0) {
    yield put(pushListActions(listActions));
  } else {
    yield put(resetAction());
  }

  // navigate to main script
  if (currentScript && !isComplete && enableScript) {
    setTimeout(() => {
      navigator.navigate('MainScript');
    }, 500);
  }
}

function* setMainScriptActivitySaga({
  payload: {activity, score, autoGenerateNextActivity},
}) {
  const userInfo = yield select(getUser);
  const enableScript = yield select(getEnableScript);
  let currentScriptId;
  let currentScriptItem = null;
  (score || []).some((item) => {
    if (item?.user?.email === userInfo.email) {
      if (item?.answers?.length > 0) {
        currentScriptId = item.answers[item.answers.length - 1].question_key;
      }
      return true;
    }
  });
  let formatData = activity;
  formatData.scriptInType = 'live';
  formatData._id = activity._id || makeid(8);
  formatData.script = (activity.script || []).map((scriptItem) => {
    const formatItem = {
      ...scriptItem,
      scriptInType: 'live',
      key: scriptItem.id,
    };
    if (currentScriptId && scriptItem.id === currentScriptId) {
      currentScriptItem = formatItem;
    }
    return formatItem;
  });
  yield put(resetDetailResultStudent());
  yield put(resetStudentScriptScore());
  yield put(changeCurrentActivity(formatData));
  yield put(changeCurrentScriptItem(currentScriptItem));
  yield put(resetAction());
  if (currentScriptItem && enableScript && autoGenerateNextActivity) {
    setTimeout(() => {
      generateNextActivity();
    }, 500);
  }
}

function* sendLiveScoreSaga({payload: {isCorrect, answerKey}}) {
  const currentScriptItem = yield select(getCurrentScriptItem);
  const selectedScheduleId = yield select(getSelectedScheduleId);
  const schoolClassId = yield select(getClassUser);
  const currentWares = yield select(getCurrentWares);
  let params = {
    class_scheduled_id: selectedScheduleId,
    school_class_id: schoolClassId,
    courseware_id: currentWares._id,
    courseware_type: currentWares.type,
  };
  if (currentScriptItem.type === 'flashcard_new') {
    const data = yield select(getScoreFlashcardNew);
    params = {
      ...params,
      answer: {
        question_key: currentScriptItem.id,
        score_activity: data,
      },
    };
  } else {
    params = {
      ...params,
      answer: {
        question_key: currentScriptItem.id,
        is_true: isCorrect,
        answer_key: answerKey,
      },
    };
  }

  SocketClient.sendEvent('courseware_update_score', params);
}
function* updateScoreWhenDoneWaresSaga({payload: {scores, wares, page}}) {
  let listUpdateScores = [];
  if (wares?.type === 'script') {
    scores.map((it) => {
      const user = it.user;
      const answers = it.answers;
      answers.map((itAnswer) => {
        listUpdateScores.push({
          userId: user.email,
          scriptId: itAnswer.question_key,
          data: {user, answer: itAnswer},
        });
      });
    });
    // update score
    yield put(updateStudentScriptScore(listUpdateScores));
  } else if (wares?.type === 'general') {
    const currentQuestionWares = wares.items[page];
    // sync result data
    if (currentQuestionWares && scores && scores.length > 0) {
      yield put(updateScoreReconnect(scores, currentQuestionWares));
    }
  }
}
