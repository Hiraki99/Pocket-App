import {
  ANSWER_QUESTION,
  CHANGE_CURRENT_SCRIPT_ITEM,
  DONE_ACTIVITY,
  DONE_ACTIVITY_FAIL,
  DONE_ACTIVITY_SUCCESS,
  INCREASE_SCORE,
  INCREASE_WORD_SPEAK,
  PUSH_ACTION,
  PUSH_LIST_ACTIONS,
  PUSH_SCRIPT_ITEM_SPEAK,
  RESET_ACTION,
  SET_MAX_CORRECT,
} from './ScriptType';

const initState = {
  actions: [],
  currentScriptItem: null,
  speakScriptVipCurrent: null,
  score: 0,
  maxCorrect: 0,
  currentCorrectCount: 0,
  currentWrongCount: 0,
  totalCorrect: 0,
  totalWrong: 0,
  doneLoading: false,
  words_speak: 0,
  words: [],
};

const checkWordHistory = (words, word, isCorrect) => {
  const index = words.findIndex((item) => item.word === word);

  if (index === -1) {
    words.push({
      word: word,
      correct: isCorrect ? 1 : 0,
      wrong: isCorrect ? 0 : 1,
    });
  } else {
    words[index].correct = isCorrect
      ? words[index].correct + 1
      : words[index].correct;
    words[index].wrong = isCorrect
      ? words[index].wrong
      : words[index].wrong + 1;
  }

  return words;
};

export default (state = initState, action) => {
  const {type, payload} = action;
  switch (type) {
    case PUSH_ACTION:
      return {
        ...state,
        actions: state.actions.concat(payload.action),
        currentWrongCount: payload.resetWrong ? 0 : state.currentWrongCount,
      };
    case PUSH_LIST_ACTIONS:
      return {
        ...state,
        actions: [...payload.listActions],
        currentWrongCount: 0,
      };
    case PUSH_SCRIPT_ITEM_SPEAK:
      return {
        ...state,
        speakScriptVipCurrent: payload.action,
      };
    case RESET_ACTION:
      return {
        ...state,
        actions: [],
        score: 0,
        maxCorrect: 0,
        currentCorrectCount: 0,
        currentWrongCount: 0,
        totalCorrect: 0,
        totalWrong: 0,
        words_speak: 0,
      };
    case INCREASE_SCORE:
      return {
        ...state,
        score: parseInt(state.score) + parseInt(payload.score),
        totalCorrect:
          parseInt(state.totalCorrect) + parseInt(payload.totalCorrect),
        totalWrong: parseInt(state.totalWrong) + parseInt(payload.totalWrong),
      };
    case INCREASE_WORD_SPEAK:
      return {
        ...state,
        words_speak: state.words_speak + 1,
      };
    case SET_MAX_CORRECT:
      return {
        ...state,
        maxCorrect: parseInt(payload.maxCorrect),
      };
    case ANSWER_QUESTION:
      return {
        ...state,
        maxCorrect: payload.isCorrect
          ? Math.max(state.maxCorrect, state.currentCorrectCount + 1)
          : state.maxCorrect,
        currentCorrectCount: payload.isCorrect
          ? state.currentCorrectCount + 1
          : state.currentCorrectCount,
        currentWrongCount: payload.isCorrect ? 0 : state.currentWrongCount + 1,
        score: payload.isCorrect
          ? payload.score
            ? parseInt(payload.score) + parseInt(state.score)
            : state.score
          : state.score,
        totalCorrect: payload.isCorrect
          ? state.totalCorrect + 1
          : state.totalCorrect,
        totalWrong: payload.isCorrect ? state.totalWrong : state.totalWrong + 1,
        words:
          payload.extraData && payload.extraData.word
            ? checkWordHistory(
                [...state.words],
                payload.extraData.word,
                payload.isCorrect,
              )
            : state.words,
      };
    case CHANGE_CURRENT_SCRIPT_ITEM:
      return {
        ...state,
        currentScriptItem: payload.script,
      };
    case DONE_ACTIVITY:
      return {
        ...state,
        doneLoading: true,
      };
    case DONE_ACTIVITY_SUCCESS:
      return {
        ...state,
        doneLoading: false,
      };
    case DONE_ACTIVITY_FAIL:
      return {
        ...initState,
        doneLoading: false,
      };
    default:
      return state;
  }
};
