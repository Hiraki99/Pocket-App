import {
  LOGIN,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  FETCH_ME,
  FETCH_ME_SUCCESS,
  LOGOUT,
  LOGOUT_SUCCESS,
  FETCH_ME_FAIL,
  ADD_NOTIFICATION_TOKEN,
  ENABLE_NOTIFICATION,
  SUBSCRIBE_NOTIFICATION,
  UNSUBSCRIBE_NOTIFICATION,
  UPDATE_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  REGISTER,
  REGISTER_FAIL,
  REFRESH_USER,
  CLEAR_ERROR_MESSAGE,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAIL,
  SPEECH_TO_TEXT_TOKEN,
  ADD_ACTION_ERROR,
  REMOVE_ACTION_ERROR,
  RETRY_ACTION_ERROR,
  UPDATE_FCM_TOKEN,
  UPDATE_TIME_USING,
  JOIN_CLASS,
  SAVE_FCM_TOKEN,
  LOGIN_GOOGLE,
  LOGIN_APPLE,
} from './AuthenType';

export const login = (form) => {
  return {
    type: LOGIN,
    payload: {form},
  };
};

export const joinClassInSchool = (data) => {
  return {
    type: JOIN_CLASS,
    payload: {data},
  };
};

export const fetchMe = () => {
  return {
    type: FETCH_ME,
  };
};

export const fetchMeSuccess = (data) => {
  return {
    type: FETCH_ME_SUCCESS,
    payload: {data},
  };
};
export const fetchSTTTokenSuccess = (data) => {
  return {
    type: SPEECH_TO_TEXT_TOKEN,
    payload: {data},
  };
};

export const fetchMeFail = () => {
  return {
    type: FETCH_ME_FAIL,
  };
};

export const loginFail = (message) => {
  return {
    type: LOGIN_FAIL,
    payload: message,
  };
};

export const loginSuccess = (data) => {
  return {
    type: LOGIN_SUCCESS,
    payload: {data},
  };
};

export const logout = (data) => {
  return {type: LOGOUT, payload: {data}};
};
export const logoutSuccess = () => {
  return {type: LOGOUT_SUCCESS};
};

export const addFcmToken = (data) => {
  return {type: ADD_NOTIFICATION_TOKEN, payload: {data}};
};
export const enableNotification = (data) => {
  return {type: ENABLE_NOTIFICATION, payload: {data}};
};
export const subscribeNotification = (data) => {
  return {type: SUBSCRIBE_NOTIFICATION, payload: {data}};
};
export const unSubscribeNotification = (data) => {
  return {type: UNSUBSCRIBE_NOTIFICATION, payload: {data}};
};

export const updateProfile = (body) => {
  return {
    type: UPDATE_PROFILE,
    payload: {body},
  };
};

export const updateProfileSuccess = (body) => {
  return {
    type: UPDATE_PROFILE_SUCCESS,
    payload: {body},
  };
};

export const updateProfileFail = () => {
  return {
    type: UPDATE_PROFILE_FAIL,
  };
};

export const register = (form) => {
  return {
    type: REGISTER,
    payload: {form},
  };
};

export const registerFail = (data) => {
  return {
    type: REGISTER_FAIL,
    payload: {data},
  };
};

export const refreshUser = (form) => {
  return {
    type: REFRESH_USER,
    payload: form,
  };
};

export const clearForm = () => {
  return {
    type: CLEAR_ERROR_MESSAGE,
  };
};

export const changePassword = (body) => {
  return {
    type: CHANGE_PASSWORD,
    payload: {body},
  };
};

export const changePasswordSuccess = () => {
  return {
    type: CHANGE_PASSWORD_SUCCESS,
  };
};
export const changePasswordFail = () => {
  return {
    type: CHANGE_PASSWORD_FAIL,
  };
};

export const addActionError = (data) => {
  return {
    type: ADD_ACTION_ERROR,
    payload: {data},
  };
};

export const retryActionError = (data) => {
  return {
    type: RETRY_ACTION_ERROR,
    payload: {data},
  };
};

export const removeActionError = () => {
  return {
    type: REMOVE_ACTION_ERROR,
  };
};

export const updateFcmToken = (data) => {
  return {
    type: UPDATE_FCM_TOKEN,
    payload: {data},
  };
};

export const saveFcmToken = (data) => {
  return {
    type: SAVE_FCM_TOKEN,
    payload: {data},
  };
};

export const updateTimeUsingApp = (data) => {
  return {
    type: UPDATE_TIME_USING,
    payload: {data},
  };
};

export const loginGGAction = (data) => {
  return {
    type: LOGIN_GOOGLE,
    payload: {data},
  };
};

export const loginAppleAction = (data) => {
  return {
    type: LOGIN_APPLE,
    payload: {data},
  };
};
