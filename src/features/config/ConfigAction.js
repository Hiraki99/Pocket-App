import {
  CHECK_VERSION_APP,
  SET_FIRST_LANGUAGE_APP,
  SET_LANGUAGE_APP,
  SET_STATUS_USER_UPDATE_APP,
  UPDATE_INFO_APP,
  UPDATE_KEYBOARD_HEIGHT,
} from './ConfigType';

export const checkVersionApp = (data) => {
  return {
    type: CHECK_VERSION_APP,
    payload: {data},
  };
};

export const updateInfoApp = (data) => {
  return {
    type: UPDATE_INFO_APP,
    payload: {data},
  };
};

export const setStatusUserUpdateApp = (data) => {
  return {
    type: SET_STATUS_USER_UPDATE_APP,
    payload: {data},
  };
};

export const updateKeyboardHeight = (data) => {
  return {
    type: UPDATE_KEYBOARD_HEIGHT,
    payload: {data},
  };
};

export const setLanguageApp = (data = 'vi') => {
  return {
    type: SET_LANGUAGE_APP,
    payload: {data},
  };
};

export const setFirstLanguageApp = (data) => {
  return {
    type: SET_FIRST_LANGUAGE_APP,
    payload: {data},
  };
};
