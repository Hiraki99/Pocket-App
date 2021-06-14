import {makeid} from '~/utils/utils';

export const makeAction = (type, data, delay) => {
  return {
    key: makeid(),
    type: type,
    data: {
      ...data,
      delay,
    },
  };
};

export const makeActionLive = (type, data, delay) => {
  return {
    key: makeid(),
    type,
    zoom: 'live',
    data: {
      ...data,
      delay,
    },
  };
};
