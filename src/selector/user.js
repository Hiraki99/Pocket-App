import {createSelector} from 'reselect';

const classInfoUser = (state) => state.auth.user?.class;
const infoUser = (state) => state.auth.user || {};

export const classUserSelector = createSelector(classInfoUser, (data) => data);
export const infoUserSelector = createSelector(infoUser, (data) => data);
