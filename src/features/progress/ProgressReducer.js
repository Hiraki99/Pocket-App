import {UPDATE_LEVEL} from './ProgressType';
import {DONE_ACTIVITY_SUCCESS} from '~/features/script/ScriptType';

const initState = {
  levelProgress: 0,
  nextLevel: null,
  currentLevel: null,
  perfectScoreStreak: false,
};

export default (state = initState, action) => {
  const {type, payload} = action;
  switch (type) {
    case UPDATE_LEVEL:
      return {
        ...state,
        levelProgress: payload.levelProgress,
        nextLevel: payload.nextLevel,
        currentLevel: payload.currentLevel,
      };
    case DONE_ACTIVITY_SUCCESS:
      return {
        ...state,
        perfectScoreStreak: payload.result && payload.result.is_perfect_streak,
      };

    default:
      return state;
  }
};
