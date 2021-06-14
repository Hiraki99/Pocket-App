import orderBy from 'lodash/orderBy';

import {
  FETCH_ACTIVITY_SUCCESS,
  FETCH_ACTIVITY,
  FETCH_ACTIVITY_FAIL,
  CHANGE_CURRENT_ACTIVITY,
  RESET_ACTIVITY_DONE,
  DONE_QUESTION,
  INCREMENT_QUESTION,
  FETCH_ACTIVITY_PRACTICE_SPEAK_SUCCESS,
  FETCH_ACTIVITY_GRAMMAR_SUCCESS,
  FETCH_ACTIVITY_COMMUNICATION_SUCCESS,
  FETCH_ACTIVITY_VOCABULARY_SUCCESS,
  SET_TAB_ACTIVITY,
  SET_SCREEN_ACTIVITY,
  FETCH_ACTIVITY_SONG_SUCCESS,
  FETCH_TUTORIALS_ACTIVITY_SUCCESS,
  SET_TOTAL_QUESTION,
  SET_SKIP_GENERATE_ACTIVITY_AT_FIRST,
} from './ActivityType';

import {
  ANSWER_QUESTION,
  DONE_ACTIVITY,
  DONE_ACTIVITY_FAIL,
  DONE_ACTIVITY_SUCCESS,
} from '~/features/script/ScriptType';

const initState = {
  tutorialActivity: {},
  activities: [],
  currentActivity: null,
  skipGenerateActivityAtFirst: null,
  doneActivity: null,
  errorMessage: null,
  loading: false,
  totalQuestion: 0,
  doneQuestion: 0,
  isActivityVip: false,
  tabActivity: null,
  screenActivity: null,
};

const calculateTotalQuestion = (activity) => {
  let total = 0;

  if (activity) {
    const singleQuestion = [
      'listen_and_answer',
      'listen_single_choice',
      'listen_multi_choice',
      'listen_choose_correct_pictures',
      'single_choice_inline',
      'answer_question_with_given_words',
      'answer_question_writing',
      'multi_choice_inline',
      'answer_question_picture',
      'listen_and_speak_word',
      'listen_and_speak_sentence',
      'listen_and_speak_word_full',
      'listen_and_speak_sentence_full',
      'vocabulary_word_meditation',
      'fill_in_blank_with_given_words',
      'fill_in_blank_paragraph_with_given_words',
      'fill_in_blank_paragraph_writing',
      'fill_in_blank_paragraph_choose_correct_words',
      'fill_in_blank_sentence_with_given_word',
      'common_answer_all_questions',
      'common_highlight_or_strikethrough_sentence',
      'common_highlight_or_strikethrough_paragraph',
      'speaking_roleplay',
      'pronounciation_syllable_highlight',
      'video_speaking_answer',
      'speaking_coach_word',
      'speaking_coach_sentence',
    ];

    const multiQuestion = [
      'common_matching',
      'match_expression_with_picture',
      'listen_answer_question_with_order',
      'fill_in_blank_multi_part',
      'fill_in_blank_writing',
      'reading_answer_questions',
      'reading_matching',
    ];

    activity.script.forEach((item) => {
      if (singleQuestion.indexOf(item.type) !== -1) {
        total++;
      }

      if (multiQuestion.indexOf(item.type) !== -1) {
        total += item.items.length;
      }
    });
  }
  return total;
};

export default (state = initState, action) => {
  const {type, payload} = action;
  switch (type) {
    case FETCH_ACTIVITY_FAIL:
      return {
        ...state,
        loading: false,
        errorMessage: 'error',
      };
    case FETCH_ACTIVITY:
      return {
        ...state,
        activities: [],
        loading: true,
        errorMessage: null,
      };
    case FETCH_ACTIVITY_SUCCESS:
    case FETCH_ACTIVITY_PRACTICE_SPEAK_SUCCESS:
    case FETCH_ACTIVITY_GRAMMAR_SUCCESS:
    case FETCH_ACTIVITY_COMMUNICATION_SUCCESS:
    case FETCH_ACTIVITY_VOCABULARY_SUCCESS:
    case FETCH_ACTIVITY_SONG_SUCCESS:
      const arr = orderBy(payload.data.data, 'order');

      let maxEnableIndex = 0;

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].done) {
          maxEnableIndex = i + 1;
        }

        if (i <= maxEnableIndex) {
          arr[i].enabled = true;
        }

        arr[i].enabled = true;
      }

      return {
        ...state,
        activities: arr,
        loading: false,
        errorMessage: null,
        isActivityVip: type === FETCH_ACTIVITY_PRACTICE_SPEAK_SUCCESS,
      };
    case CHANGE_CURRENT_ACTIVITY:
      return {
        ...state,
        currentActivity: payload.currentActivity,
        skipGenerateActivityAtFirst: null,
        totalQuestion: calculateTotalQuestion(payload.currentActivity),
        doneQuestion: 0,
      };
    case SET_SKIP_GENERATE_ACTIVITY_AT_FIRST: {
      return {
        ...state,
        skipGenerateActivityAtFirst: payload.data,
      };
    }
    case DONE_ACTIVITY:
      const activities = [...state.activities];

      let maxEnable = -1;

      for (let i = 0; i < activities.length; i++) {
        if (activities[i]._id === payload.form.activityId) {
          activities[i].done = true;
          maxEnable = i + 1;
        }

        if (i <= maxEnable) {
          activities[i].enabled = true;
        }

        activities[i].enabled = true;
      }

      return {
        ...state,
        doneActivity: state.currentActivity,
        errorMessage: null,
        loading: false,
        activities: activities,
        doneQuestion: 0,
        totalQuestion: 0,
      };
    case DONE_ACTIVITY_SUCCESS:
      return {
        ...state,
        currentActivity: null,
      };
    case DONE_ACTIVITY_FAIL:
      return {
        ...state,
        currentActivity: null,
      };
    case RESET_ACTIVITY_DONE:
      return {
        ...state,
        doneActivity: null,
      };
    case ANSWER_QUESTION:
      return {
        ...state,
        doneQuestion:
          payload.isCorrect || !payload.canRetry
            ? state.doneQuestion + 1
            : state.doneQuestion,
      };
    case DONE_QUESTION:
      return {
        ...state,
        doneQuestion: state.doneQuestion + 1,
      };
    case INCREMENT_QUESTION:
      return {
        ...state,
        totalQuestion: state.totalQuestion + payload.total,
      };
    case SET_TAB_ACTIVITY:
      return {
        ...state,
        tabActivity: payload.data,
      };
    case SET_SCREEN_ACTIVITY:
      return {
        ...state,
        screenActivity: payload.data,
      };
    case FETCH_TUTORIALS_ACTIVITY_SUCCESS:
      return {
        ...state,
        tutorialActivity: payload.data,
      };
    case SET_TOTAL_QUESTION:
      return {
        ...state,
        totalQuestion: payload.data,
      };
    default:
      return state;
  }
};
