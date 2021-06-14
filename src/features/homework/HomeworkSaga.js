import {put, call, takeLatest} from 'redux-saga/effects';

import {FETCH_DETAIL_HOMEWORK, FETCH_LIST_HOMEWORK} from './HomeworkType';
import homeworkApi from './HomeworkApi';
import {
  fetchListHomeworkSuccess,
  fetchListHomeworkFail,
  fetchDetailHomeworkSuccess,
  fetchDetailHomeworkFail,
} from './HomeworkAction';

export default function* homeworkSaga() {
  yield takeLatest(FETCH_LIST_HOMEWORK, listHomework);
  yield takeLatest(FETCH_DETAIL_HOMEWORK, detailHomework);
}

function* listHomework({payload: {data}}) {
  const response = yield call(homeworkApi.fetchListHomework, data);
  if (response.ok && response.data && response.data.data) {
    yield put(
      fetchListHomeworkSuccess(
        response.data.data,
        data,
        response.data.totalCount,
      ),
    );
    return;
  }
  yield put(fetchListHomeworkFail());
}

function* detailHomework({payload: {data}}) {
  const response = yield call(homeworkApi.fetchDetailHomework, data);
  if (response.ok && response.data && response.data.data) {
    const item = response.data.data;
    if (item.type === 'writing') {
      return item;
    }
    let activitiesHomework = {};
    const {
      common_activities,
      communication_activities,
      grammar_activities,
      idioms_activities,
      reading_activities,
      story_activities,
      word_group_activities,
      user_progress,
      ...restData
    } = item;
    const listActivity = [
      ...common_activities,
      ...communication_activities,
      ...grammar_activities,
      ...idioms_activities,
      ...reading_activities,
      ...story_activities,
      ...story_activities,
      ...word_group_activities,
    ];
    const progressActivities = user_progress
      ? user_progress.activities || []
      : [];
    const listActivitiesIds = listActivity.map((activity) => {
      let progress = {};
      if (progressActivities.length !== 0) {
        progress =
          progressActivities.filter((it) => it.activity === activity._id)[0] ||
          {};
      }
      activitiesHomework = {
        ...activitiesHomework,
        [activity._id]: {
          ...activity,
          exercise: item._id,
          progress: progress.progress || [],
        },
      };
      return activity._id;
    });

    const updateItem = {
      ...restData,
      activitiesIds: listActivitiesIds,
    };
    yield put(fetchDetailHomeworkSuccess(updateItem, activitiesHomework));
    return;
  }
  yield put(fetchDetailHomeworkFail());
}
