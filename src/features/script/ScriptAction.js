import {
  PUSH_ACTION,
  CHANGE_CURRENT_SCRIPT_ITEM,
  RESET_ACTION,
  ANSWER_QUESTION,
  INCREASE_SCORE,
  SET_MAX_CORRECT,
  PUSH_SCRIPT_ITEM_SPEAK,
  INCREASE_WORD_SPEAK,
  PUSH_LIST_ACTIONS,
} from './ScriptType';

export const pushAction = (action, resetWrong = false) => {
  return {
    type: PUSH_ACTION,
    payload: {action, resetWrong},
  };
};

export const pushListActions = (listActions) => {
  return {
    type: PUSH_LIST_ACTIONS,
    payload: {listActions},
  };
};

export const pushScriptItemSpeak = (action, resetWrong = false) => {
  return {
    type: PUSH_SCRIPT_ITEM_SPEAK,
    payload: {action, resetWrong},
  };
};

export const resetAction = () => {
  return {
    type: RESET_ACTION,
  };
};

export const changeCurrentScriptItem = (script) => {
  return {
    type: CHANGE_CURRENT_SCRIPT_ITEM,
    payload: {script},
  };
};

export const answerQuestion = (
  isCorrect,
  score,
  canRetry = false,
  extraData = null,
) => {
  return {
    type: ANSWER_QUESTION,
    payload: {isCorrect, score, canRetry, extraData},
  };
};

export const increaseScore = (score = 0, totalCorrect = 0, totalWrong = 0) => {
  return {
    type: INCREASE_SCORE,
    payload: {score, totalCorrect, totalWrong},
  };
};

export const increaseWorkSpeak = () => {
  return {
    type: INCREASE_WORD_SPEAK,
  };
};

export const setMaxCorrect = (maxCorrect) => {
  return {
    type: SET_MAX_CORRECT,
    payload: {maxCorrect},
  };
};
