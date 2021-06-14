import {
  LOAD_AUDIO_REACTIVE_STATUS,
  REMOVE_REACTIVE_COURSEWARE,
  UPDATE_REACTIVE_COURSEWARE_DATA,
} from '~/features/liveclass/LiveClassType';

const initReactiveCoursewares = {
  reactiveCoursewares: {},
  loadAudioSuccess: false,
  loadVideoSuccess: false,
};

export const liveReactiveCoursewareReducer = (
  state = initReactiveCoursewares,
  action,
) => {
  const {type, payload} = action;
  switch (type) {
    case UPDATE_REACTIVE_COURSEWARE_DATA: {
      return {
        ...state,
        reactiveCoursewares: {
          ...state.reactiveCoursewares,
          ...payload.data,
        },
      };
    }
    case REMOVE_REACTIVE_COURSEWARE: {
      let newData = state.reactiveCoursewares;
      if (state.reactiveCoursewares.type === 'audio') {
        return {
          ...state,
          reactiveCoursewares: {},
        };
      }
      delete newData[payload.data];
      return {
        ...state,
        reactiveCoursewares: {...newData},
      };
    }
    case LOAD_AUDIO_REACTIVE_STATUS:
      return {
        ...state,
        loadAudioSuccess: payload.status,
      };
    default:
      return state;
  }
};
