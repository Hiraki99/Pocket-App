import {UPDATE_LEVEL} from './ProgressType';

export const updateLevel = (levelProgress, nextLevel, currentLevel) => {
  return {
    type: UPDATE_LEVEL,
    payload: {levelProgress, nextLevel, currentLevel},
  };
};
