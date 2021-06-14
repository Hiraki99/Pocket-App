import {
  CHANGE_CURRENT_ACTIVITY,
  DONE_QUESTION,
  FETCH_ACTIVITY,
  FETCH_ACTIVITY_COMMUNICATION,
  FETCH_ACTIVITY_COMMUNICATION_FAIL,
  FETCH_ACTIVITY_COMMUNICATION_SUCCESS,
  FETCH_ACTIVITY_FAIL,
  FETCH_ACTIVITY_GRAMMAR,
  FETCH_ACTIVITY_GRAMMAR_FAIL,
  FETCH_ACTIVITY_GRAMMAR_SUCCESS,
  FETCH_ACTIVITY_PRACTICE_SPEAK,
  FETCH_ACTIVITY_PRACTICE_SPEAK_FAIL,
  FETCH_ACTIVITY_PRACTICE_SPEAK_SUCCESS,
  FETCH_ACTIVITY_SONG,
  FETCH_ACTIVITY_SONG_FAIL,
  FETCH_ACTIVITY_SONG_SUCCESS,
  FETCH_ACTIVITY_SUCCESS,
  FETCH_ACTIVITY_VOCABULARY,
  FETCH_ACTIVITY_VOCABULARY_FAIL,
  FETCH_ACTIVITY_VOCABULARY_SUCCESS,
  FETCH_TUTORIALS_ACTIVITY,
  FETCH_TUTORIALS_ACTIVITY_FAIL,
  FETCH_TUTORIALS_ACTIVITY_SUCCESS,
  INCREMENT_QUESTION,
  RESET_ACTIVITY_DONE,
  SET_SCREEN_ACTIVITY,
  SET_TAB_ACTIVITY,
  SET_TOTAL_QUESTION,
  SET_SKIP_GENERATE_ACTIVITY_AT_FIRST,
} from './ActivityType';
import {
  DONE_ACTIVITY,
  DONE_ACTIVITY_FAIL,
  DONE_ACTIVITY_SUCCESS,
} from '~/features/script/ScriptType';

export const fetchActivity = (form) => {
  return {
    type: FETCH_ACTIVITY,
    payload: {form},
  };
};

export const fetchActivitySuccess = (data) => {
  return {
    type: FETCH_ACTIVITY_SUCCESS,
    payload: {data},
  };
};

export const fetchActivityFail = () => {
  return {
    type: FETCH_ACTIVITY_FAIL,
  };
};

export const fetchActivityPracticeSpeak = (form) => {
  return {
    type: FETCH_ACTIVITY_PRACTICE_SPEAK,
    payload: {form},
  };
};

export const fetchActivityPracticeSpeakSuccess = (data) => {
  return {
    type: FETCH_ACTIVITY_PRACTICE_SPEAK_SUCCESS,
    payload: {data},
  };
};

export const fetchActivityPracticeSpeakFail = () => {
  return {
    type: FETCH_ACTIVITY_PRACTICE_SPEAK_FAIL,
  };
};

export const changeCurrentActivity = (currentActivity) => {
  return {
    type: CHANGE_CURRENT_ACTIVITY,
    payload: {currentActivity},
  };
};

export const doneActivity = (form) => {
  return {
    type: DONE_ACTIVITY,
    payload: {form},
  };
};

export const resetActivityDone = (form) => {
  return {
    type: RESET_ACTIVITY_DONE,
    payload: {form},
  };
};

export const doneActivitySuccess = (form) => {
  return {
    type: DONE_ACTIVITY_SUCCESS,
    payload: form,
  };
};

export const doneActivityError = () => {
  return {
    type: DONE_ACTIVITY_FAIL,
  };
};

export const doneQuestion = () => {
  return {
    type: DONE_QUESTION,
  };
};

export const incrementQuestion = (total) => {
  return {
    type: INCREMENT_QUESTION,
    payload: {total},
  };
};

export const fetchActivityGrammar = (data) => {
  return {
    type: FETCH_ACTIVITY_GRAMMAR,
    payload: {data},
  };
};

export const fetchActivityGrammarSuccess = (data) => {
  const res = data.data.map((item) => {
    return {
      type: 'grammar',
      ...item,
    };
  });
  return {
    type: FETCH_ACTIVITY_GRAMMAR_SUCCESS,
    payload: {
      data: {
        ...data,
        data: res,
      },
    },
  };
};

export const fetchActivityGrammarFail = () => {
  return {
    type: FETCH_ACTIVITY_GRAMMAR_FAIL,
  };
};

export const fetchActivityCommunication = (data) => {
  return {
    type: FETCH_ACTIVITY_COMMUNICATION,
    payload: {data},
  };
};

export const fetchActivityCommunicationSuccess = (data) => {
  const res = data.data.map((item) => {
    return {
      type: 'communication',
      ...item,
    };
  });
  return {
    type: FETCH_ACTIVITY_COMMUNICATION_SUCCESS,
    payload: {
      data: {
        ...data,
        data: res,
      },
    },
  };
};

export const fetchActivityCommunicationFail = () => {
  return {
    type: FETCH_ACTIVITY_COMMUNICATION_FAIL,
  };
};

export const fetchActivityVocabulary = (data) => {
  return {
    type: FETCH_ACTIVITY_VOCABULARY,
    payload: {data},
  };
};

export const fetchActivityVocabularySuccess = (data) => {
  const res = data.data.map((item) => {
    return {
      type: 'word-group',
      ...item,
    };
  });
  return {
    type: FETCH_ACTIVITY_VOCABULARY_SUCCESS,
    payload: {
      data: {
        ...data,
        data: res,
      },
    },
  };
};

export const fetchActivityVocabularyFail = () => {
  return {
    type: FETCH_ACTIVITY_VOCABULARY_FAIL,
  };
};

export const fetchTutorialActivity = () => {
  return {
    type: FETCH_TUTORIALS_ACTIVITY,
    payload: {},
  };
};

export const fetchTutorialActivitySuccess = (data = []) => {
  let detail = {};
  // data.forEach((item) => {
  //   detail = {
  //     ...detail,
  //     [item.type]: {
  //       ...item,
  //       tutorial:
  //         item.type === 'common_highlight_or_strikethrough_paragraph'
  //           ? 'KgOtLOUdCMQ'
  //           : '',
  //     },
  //   };
  // });
  data.forEach((item) => {
    detail = {
      ...detail,
      [item.type]: item,
    };
  });
  return {
    type: FETCH_TUTORIALS_ACTIVITY_SUCCESS,
    payload: {data: detail},
  };
};

export const fetchTutorialActivityFail = (data) => {
  return {
    type: FETCH_TUTORIALS_ACTIVITY_FAIL,
    payload: {data},
  };
};

export const fetchActivitySong = (data) => {
  return {
    type: FETCH_ACTIVITY_SONG,
    payload: {data},
  };
};

export const fetchActivitySongSuccess = (data) => {
  const res = data.data.map((item) => {
    return {
      type: 'song',
      ...item,
    };
  });
  return {
    type: FETCH_ACTIVITY_SONG_SUCCESS,
    payload: {
      data: {
        ...data,
        data: res,
      },
    },
  };
};

export const fetchActivitySongFail = () => {
  return {
    type: FETCH_ACTIVITY_SONG_FAIL,
  };
};

export const setTabActivity = (data) => {
  return {
    type: SET_TAB_ACTIVITY,
    payload: {data},
  };
};

export const setScreenActivity = (data) => {
  return {
    type: SET_SCREEN_ACTIVITY,
    payload: {data},
  };
};

export const setTotalQuestion = (data) => {
  return {
    type: SET_TOTAL_QUESTION,
    payload: {data},
  };
};

export const setSkipGenerateActivityAtFirst = (data) => {
  return {
    type: SET_SKIP_GENERATE_ACTIVITY_AT_FIRST,
    payload: {data},
  };
};
