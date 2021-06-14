import {
  LOGIN_SUCCESS,
  FETCH_ME_SUCCESS,
  LOGIN,
  LOGIN_FAIL,
  FETCH_ME,
  FETCH_ME_FAIL,
  ENABLE_NOTIFICATION,
  UPDATE_PROFILE,
  UPDATE_PROFILE_FAIL,
  UPDATE_PROFILE_SUCCESS,
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
  JOIN_CLASS,
  SAVE_FCM_TOKEN,
} from './AuthenType';
import {DONE_ACTIVITY_SUCCESS} from '~/features/script/ScriptType';

const initAuthState = {
  user: null,
  levels: [],
  errorMessage: null,
  token: null,
  loading: false,
  isProfileLoaded: false,
  loadProfileError: false,
  fcmToken: null,
  enableNoti: false,
  updateProfileErrorMessage: null,
  loadingUpdateProfile: false,
  loginStreaks: [],
  stt: null,
  disableUpdate: false,
};

export default (state = initAuthState, action) => {
  const {type, payload} = action;
  switch (type) {
    case LOGIN:
      return {
        ...state,
        loading: true,
        isProfileLoaded: false,
        errorMessage: null,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: payload.data,
        loading: false,
        errorMessage: null,
      };
    case LOGIN_FAIL: {
      return {
        ...state,
        errorMessage: payload,
        loading: false,
      };
    }
    case FETCH_ME_FAIL:
      return {
        ...state,
        loading: false,
        isProfileLoaded: false,
        loadProfileError: true,
        errorMessage: null,
      };
    case FETCH_ME:
      return {
        ...state,
        user: null,
        loading: true,
        isProfileLoaded: false,
        errorMessage: null,
      };
    case FETCH_ME_SUCCESS:
      return {
        ...state,
        user: payload.data.user,
        levels: payload.data.levels,
        loginStreaks: payload.data.loginStreaks,
        loading: false,
        isProfileLoaded: true,
        errorMessage: null,
      };
    case JOIN_CLASS:
      return {
        ...state,
        user: {
          ...state.user,
          ...payload.data,
        },
      };
    case UPDATE_FCM_TOKEN:
    case SAVE_FCM_TOKEN:
      return {
        ...state,
        fcmToken: payload.data.newToken,
        errorMessage: null,
      };
    case ENABLE_NOTIFICATION:
      return {
        ...state,
        enableNoti: payload.data,
        errorMessage: null,
      };
    case UPDATE_PROFILE_FAIL:
      return {
        ...state,
        loadingUpdateProfile: false,
        updateProfileErrorMessage: 'error',
        errorMessage: null,
      };
    case UPDATE_PROFILE:
      return {
        ...state,
        loadingUpdateProfile: true,
        updateProfileErrorMessage: null,
        errorMessage: null,
      };
    case DONE_ACTIVITY_SUCCESS:
      if (!state.user) {
        return state;
      }
      return {
        ...state,
        user: {
          ...state.user,
          score: payload.result ? payload.result.score : state.user.score,
        },
      };
    case CHANGE_PASSWORD:
      return {
        ...state,
        loading: true,
      };
    case CHANGE_PASSWORD_SUCCESS:
    case CHANGE_PASSWORD_FAIL:
      return {
        loading: false,
      };
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          ...payload.body,
        },
        loadingUpdateProfile: false,
        updateProfileErrorMessage: null,
        errorMessage: null,
      };
    case REGISTER: {
      return {
        ...state,
        loading: true,
        isProfileLoaded: false,
        errorMessage: null,
      };
    }

    case REGISTER_FAIL: {
      return {
        ...state,
        loading: false,
        isProfileLoaded: false,
        errorMessage: payload.data,
      };
    }

    case CLEAR_ERROR_MESSAGE: {
      return {
        ...state,
        errorMessage: null,
      };
    }

    case REFRESH_USER: {
      return initAuthState;
    }
    default:
      return state;
  }
};

const initReducer = {
  stt: null,
};
export const sttReducer = (state = initReducer, action) => {
  const {type, payload} = action;
  switch (type) {
    case SPEECH_TO_TEXT_TOKEN:
      return {
        ...state,
        stt: payload.data,
      };
    default:
      return state;
  }
};

const initErrorReducer = {
  actionError: null,
  loading: false,
};
export const errorReducer = (state = initErrorReducer, action) => {
  const {type, payload} = action;
  switch (type) {
    case ADD_ACTION_ERROR:
      return {
        ...state,
        loading: false,
        actionError: payload.data,
      };
    case RETRY_ACTION_ERROR:
      return {
        ...state,
        loading: true,
      };
    case REMOVE_ACTION_ERROR:
      return {
        ...initErrorReducer,
        loading: false,
      };
    default:
      return state;
  }
};
