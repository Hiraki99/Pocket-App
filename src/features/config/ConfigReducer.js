import {OS} from '~/constants/os';
import {
  SET_LANGUAGE_APP,
  SET_STATUS_USER_UPDATE_APP,
  UPDATE_INFO_APP,
  UPDATE_KEYBOARD_HEIGHT,
} from '~/features/config/ConfigType';

const initReducer = {
  disableUpdate: false,
  infoAppLatest: {},
  keyboardHeight: OS.WIDTH,
  galleryUsers: [],
  language: 'vi',
};
export default (state = initReducer, action) => {
  const {type, payload} = action;
  switch (type) {
    case SET_STATUS_USER_UPDATE_APP:
      return {
        ...state,
        disableUpdate: payload.data,
      };
    case UPDATE_INFO_APP:
      return {
        ...state,
        infoAppLatest: payload.data,
      };
    case UPDATE_KEYBOARD_HEIGHT:
      return {
        ...state,
        keyboardHeight: payload.data,
      };
    case SET_LANGUAGE_APP:
      return {
        ...state,
        language: payload.data,
      };
    default:
      return state;
  }
};
