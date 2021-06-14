import {
  FETCH_DETAIL_HOMEWORK,
  FETCH_DETAIL_HOMEWORK_FAIL,
  FETCH_DETAIL_HOMEWORK_SUCCESS,
  FETCH_LIST_HOMEWORK,
  FETCH_LIST_HOMEWORK_FAIL,
  FETCH_LIST_HOMEWORK_SUCCESS,
  PUSH_PROGRESS_HOMEWORK,
  SELECTED_HOMEWORK,
} from '~/features/homework/HomeworkType';
import {PAGE_SIZE} from '~/constants/query';
// import lodash from 'lodash';

export const fetchListHomework = (data) => {
  return {
    type: FETCH_LIST_HOMEWORK,
    payload: {data},
  };
};

export const fetchListHomeworkSuccess = (list, query, totalCount) => {
  const canLoadMore = totalCount > (query.page + 1) * PAGE_SIZE;
  let activitiesHomework = {};
  const data = list.map((item) => {
    if (item.type === 'writing') {
      return item;
    }
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
    return {
      ...restData,
      activitiesIds: listActivitiesIds,
    };
  });
  return {
    type: FETCH_LIST_HOMEWORK_SUCCESS,
    payload: {
      data,
      body: {
        query: {
          ...query,
          canLoadMore,
        },
        totalCount,
      },
      activitiesHomework,
    },
  };
};

export const fetchListHomeworkFail = () => {
  return {
    type: FETCH_LIST_HOMEWORK_FAIL,
  };
};

export const selectedHomework = (data) => {
  return {
    type: SELECTED_HOMEWORK,
    payload: {data},
  };
};

export const fetchDetailHomework = (data) => {
  return {
    type: FETCH_DETAIL_HOMEWORK,
    payload: {data},
  };
};

export const fetchDetailHomeworkSuccess = (data, detailActivity = {}) => {
  return {
    type: FETCH_DETAIL_HOMEWORK_SUCCESS,
    payload: {data, detailActivity},
  };
};

export const fetchDetailHomeworkFail = () => {
  return {
    type: FETCH_DETAIL_HOMEWORK_FAIL,
    payload: {},
  };
};

export const pushProgressHomework = (data) => {
  return {
    type: PUSH_PROGRESS_HOMEWORK,
    payload: {data},
  };
};
