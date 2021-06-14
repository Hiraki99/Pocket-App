import {createSelector} from 'reselect';

const queryHomework = (state) => {
  return {
    ...state.homework.query,
    loading: state.homework.loading,
  };
};
const dataHomework = (state) => state.homework.homeworks;
const homeworkSelected = (state) => state.homework.homeworkSelected;
const activitiesHomework = (state) => state.homework.activitiesHomework;

const queryHomeworkSelector = createSelector(queryHomework, (data) => data);
const dataHomeworkSelector = createSelector(
  dataHomework,
  activitiesHomework,
  (data, detail) => {
    return (data || []).map((item) => {
      const activities = (item.activitiesIds || []).map((id) => detail[id]);
      return {
        ...item,
        activities,
      };
    });
  },
);
const homeworkSelectedSelector = createSelector(
  homeworkSelected,
  activitiesHomework,
  (item, detail) => {
    const activities = (item?.activitiesIds || []).map((id) => detail[id]);
    return {
      ...item,
      activities,
    };
  },
);

export const homeworkChoose = createSelector(
  homeworkSelectedSelector,
  (data) => data,
);
export const homeworkSelector = createSelector(
  queryHomeworkSelector,
  dataHomeworkSelector,
  (query, data) => ({
    query,
    data,
  }),
);
