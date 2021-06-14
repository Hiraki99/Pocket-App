import {createSelector} from 'reselect';

const classDetailSelector = (state) => state.classInfo.classDetail;
const queryTimeSelected = (state) => state.classInfo.querySelected;

export const classDetailSelect = createSelector(
  classDetailSelector,
  (data) => data,
);

export const queryTimeSelector = createSelector(
  queryTimeSelected,
  (data) => data,
);
