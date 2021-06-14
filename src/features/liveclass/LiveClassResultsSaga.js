import {select, takeEvery, put, takeLatest} from 'redux-saga/effects';
import moment from 'moment';
import {Toast} from 'native-base';

import {OS} from '~/constants/os';
import {setScreenActivity} from '~/features/activity/ActivityAction';
import {
  addNewUserJoinZoomSuccess,
  setCurrentWares,
  setMainScriptActivity,
  setStatusDoneWares,
  setTimerLiveClass,
  updateStatusUserZoom,
} from '~/features/liveclass/LiveClassAction';
import {
  COUNTDOWN_REMOVE_ACTION,
  COUNTDOWN_START_ACTION,
  COURSEWARE_ACTION_SOCKET,
  COURSEWARE_OPEN_ACTION,
  NEW_USER_JOIN_ZOOM,
  RECEIVE_UPDATE_SCORE_EVENT,
} from '~/features/liveclass/LiveClassType';
import {
  resetDetailResultStudent,
  selectedStudentViewResult,
  setShowLatencyNetworkContainer,
  updateScoreClass,
  updateStudentScriptScore,
} from '~/features/liveclass/LiveClassResultsAction';
import navigator from '~/navigation/customNavigator';
import {colors} from '~/themes';

const getDoneWares = (state) => state.socket.doneWares;
const getStateLantencySocket = (state) => {
  return {
    latency: state.zoomState.latencyServer,
    showLatencyContainer: state.zoomState.showLatencyContainer,
  };
};
const getCurrentWares = (state) => state.liveClass.currentWares;
const getCurrentWaresIndex = (state) => state.socket.indexCurrentItemWare;
const getUserJoinedZoom = (state) => state.zoomState.usersJoin;
const getDetailResultStudentsClassLive = (state) =>
  state.liveClassResults.detailResultQuestion;
const getDetailWaresClassLive = (state) => state.liveClass.detailCourseWares;
const userInfoSelect = (state) => state.auth.user;
const getInfoCurrentWare = (state) => {
  return {
    indexCurrentItemWare: state.socket.indexCurrentItemWare,
    currentWare: state.socket.currentWares,
  };
};

export default function* liveClassResultsSagas() {
  yield takeEvery(RECEIVE_UPDATE_SCORE_EVENT, handleUpdateScoreEventSaga);
  yield takeLatest(COURSEWARE_OPEN_ACTION, coursewareOpenSaga);
  yield takeLatest(COURSEWARE_ACTION_SOCKET, coursewareActionSaga);
  yield takeLatest(COUNTDOWN_START_ACTION, countDownStartSaga);
  yield takeLatest(COUNTDOWN_REMOVE_ACTION, countDownRemoveSaga);
  yield takeEvery(NEW_USER_JOIN_ZOOM, handleEventNewUserJoinZoom);
}

function* handleUpdateScoreEventSaga({payload: {data}}) {
  const userInfo = yield select(userInfoSelect);
  const doneWares = yield select(getDoneWares);
  if (!(doneWares || data?.user?.email === userInfo.email)) {
    return;
  }
  const currentWare = yield select(getCurrentWares);
  const indexCurrentItemWare = yield select(getCurrentWaresIndex);
  const detailResultStudentInClass = yield select(
    getDetailResultStudentsClassLive,
  );

  if (currentWare && currentWare.type === 'general') {
    const user = data.user;
    const answer = data.answer;
    const currentQuestionWares = currentWare.items[indexCurrentItemWare];
    const attachmentType = currentQuestionWares?.attachment?.type;
    if (
      attachmentType === 'list_single_choice' ||
      attachmentType === 'activity'
    ) {
      let updateQuestions = [];
      if (
        detailResultStudentInClass[user.email] &&
        detailResultStudentInClass[user.email].questions &&
        detailResultStudentInClass[user.email].questions.length > 0
      ) {
        updateQuestions = detailResultStudentInClass[user.email].questions.map(
          (item) => {
            if (item.key === answer.question_key) {
              return {
                ...item,
                ...answer,
              };
            }
            return item;
          },
        );
      } else {
        (
          currentQuestionWares?.attachment?.items ||
          currentQuestionWares?.attachment?.script ||
          []
        ).forEach((item) => {
          if (item.type !== 'sentence') {
            if (item.key === answer.question_key) {
              updateQuestions.push({
                ...item,
                ...answer,
              });
            } else {
              updateQuestions.push(item);
            }
          }
        });
      }
      yield put(
        updateScoreClass(user.email, {
          ...user,
          questions: updateQuestions,
        }),
      );
      updateQuestions = null;
    }
  }
  if (currentWare && currentWare.type === 'script') {
    if (data.courseware_type === 'script') {
      const user = data.user;
      const answer = data.answer;
      yield put(
        updateStudentScriptScore([
          {userId: user.email, scriptId: answer.question_key, data},
        ]),
      );
    }
  }
}

function* coursewareOpenSaga({payload: {data}}) {
  console.log('coursewareOpenSaga ', data);
  const detailWaresClass = yield select(getDetailWaresClassLive);
  const currentWares = detailWaresClass[data?.courseware_id];
  const latencyServer = yield select(getStateLantencySocket);

  if (!latencyServer.showLatencyContainer) {
    const rangeTime =
      moment().diff(moment(data.created_at), 'ms') - latencyServer.latency;
    // Toast.show({
    //   text: rangeTime,
    //   buttonText: 'Đồng ý',
    //   duration: 2000,
    //   position: 'bottom',
    //   style: {
    //     backgroundColor: colors.black,
    //     bottom: OS.IsAndroid ? 18 : 10,
    //   },
    //   textStyle: {
    //     fontFamily: 'CircularStd-Book',
    //     fontSize: 17,
    //     fontWeight: '500',
    //     color: 'white',
    //   },
    //   buttonTextStyle: {
    //     fontFamily: 'CircularStd-Book',
    //     fontSize: 17,
    //     lineHeight: 20,
    //     fontWeight: '500',
    //     color: 'white',
    //   },
    // });
    if (Math.abs(rangeTime) >= 3000) {
      yield put(setShowLatencyNetworkContainer(true));
    }
  }
  if (currentWares) {
    yield put(setStatusDoneWares(false));
    yield put(setCurrentWares(currentWares || null));
    if (currentWares?.type === 'general') {
      const currentItem = currentWares?.items[0];
      if (currentItem?.attachment?.type === 'activity') {
        yield put(setMainScriptActivity(currentItem.attachment));
      }
    } else if (currentWares?.type === 'script') {
      yield put(setMainScriptActivity(currentWares));
      yield put(setScreenActivity('LiveHome'));
    }
  }
}

function navigateToLiveHome() {
  if (navigator.getCurrentRoute() !== 'LiveHome') {
    navigator.navigate('LiveHome');
  }
}

function* coursewareActionSaga({payload: {data}}) {
  const detailWaresClass = yield select(getDetailWaresClassLive);
  const latencyServer = yield select(getStateLantencySocket);

  if (!latencyServer.showLatencyContainer) {
    const rangeTime =
      moment().diff(moment(data.created_at), 'ms') - latencyServer.latency;
    // Toast.show({
    //   text: rangeTime,
    //   buttonText: 'Đồng ý',
    //   duration: 2000,
    //   position: 'bottom',
    //   style: {
    //     backgroundColor: colors.black,
    //     bottom: OS.IsAndroid ? 18 : 10,
    //   },
    //   textStyle: {
    //     fontFamily: 'CircularStd-Book',
    //     fontSize: 17,
    //     fontWeight: '500',
    //     color: 'white',
    //   },
    //   buttonTextStyle: {
    //     fontFamily: 'CircularStd-Book',
    //     fontSize: 17,
    //     lineHeight: 20,
    //     fontWeight: '500',
    //     color: 'white',
    //   },
    // });
    if (Math.abs(rangeTime) >= 3000) {
      yield put(setShowLatencyNetworkContainer(true));
    }
  }

  if (data?.params?.type === 'pagination') {
    navigateToLiveHome();
    const currentWares = detailWaresClass[data?.courseware_id];
    const pageIndex = parseInt(data?.params?.page, 10);
    if (currentWares.type === 'general') {
      const currentItem = currentWares?.items[pageIndex];
      if (currentItem?.attachment?.type === 'activity') {
        yield put(setMainScriptActivity(currentItem.attachment));
        yield put(setStatusDoneWares(false));
      }
    }
    yield put(setCurrentWares(currentWares || null, pageIndex));
    return;
  }
  if (data?.params?.type === 'close') {
    yield put(setCurrentWares(null));
  }
}

function* countDownStartSaga({payload: {data}}) {
  const detailWaresClass = yield select(getDetailWaresClassLive);
  const userInfo = yield select(userInfoSelect);
  const {indexCurrentItemWare, currentWare} = yield select(getInfoCurrentWare);
  yield put(selectedStudentViewResult(userInfo.email));
  if (data?.params?.type === 'courseware') {
    yield put(
      setCurrentWares(
        detailWaresClass[data?.params?.id] || null,
        indexCurrentItemWare,
      ),
    );
  }
  if (currentWare && currentWare.type === 'script') {
    navigateToLiveHome();
    yield put(setMainScriptActivity(currentWare));
  }
  if (currentWare && currentWare.type === 'general') {
    navigateToLiveHome();
    const currentQuestionWares = currentWare.items[indexCurrentItemWare];
    if (currentQuestionWares?.attachment?.type === 'activity') {
      yield put(setMainScriptActivity(currentQuestionWares?.attachment));
    }
  }
  yield put(setStatusDoneWares(false));
  yield put(resetDetailResultStudent());
}

function* countDownRemoveSaga() {
  const {currentWare} = yield select(getInfoCurrentWare);
  yield put(setTimerLiveClass(null));
  if (currentWare && currentWare.type === 'script') {
    yield put(setMainScriptActivity(currentWare));
  }
  if (currentWare && currentWare.type === 'general') {
    yield put(setStatusDoneWares(false));
  }
  yield put(resetDetailResultStudent());
  navigateToLiveHome();
}

function* handleEventNewUserJoinZoom({payload: {data}}) {
  const usersJoinedZoom = yield select(getUserJoinedZoom);

  const userExisted =
    usersJoinedZoom.filter((item) => item.userID === data.userID).length > 0;
  if (!data.userName) {
    return;
  }
  if (userExisted) {
    yield put(updateStatusUserZoom({[data.userName]: data}));
    return;
  }
  yield put(
    addNewUserJoinZoomSuccess({
      newMember: {
        userName: data.userName,
        videoStatus: data.videoStatus,
        userID: data.userID,
      },
      detailNewMember: {[data.userName]: data},
    }),
  );
}
