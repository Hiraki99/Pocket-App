import {
  RECEIVE_REACTIVE_COURSEWARE_ACTION,
  REMOVE_REACTIVE_COURSEWARE,
  RESTORE_REACTIVE_COURSEWARE_DATA,
  UPDATE_REACTIVE_COURSEWARE_DATA,
} from '~/features/liveclass/LiveClassType';

export const restoreReactiveCoursewareData = (wareInfo, data) => {
  return {
    type: RESTORE_REACTIVE_COURSEWARE_DATA,
    payload: {wareInfo, data},
  };
};

export const receiveReactiveCoursewareAction = (data) => {
  return {
    type: RECEIVE_REACTIVE_COURSEWARE_ACTION,
    payload: {data},
  };
};

export const updateReactiveCoursewareData = (data) => {
  return {
    type: UPDATE_REACTIVE_COURSEWARE_DATA,
    payload: {data},
  };
};

export const removeReactiveCourseware = (data) => {
  return {
    type: REMOVE_REACTIVE_COURSEWARE,
    payload: {data},
  };
};
