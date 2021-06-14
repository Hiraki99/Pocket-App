import orderBy from 'lodash/orderBy';

import {
  FETCH_PART_SUCCESS,
  FETCH_PART,
  FETCH_PART_FAIL,
  CHANGE_CURRENT_PART,
  PART_DONE,
  FETCH_PART_VIP_SUCCESS,
} from './PartType';

const initState = {
  parts: [],
  partsIdDone: [],
  partsVip: [],
  currentPart: null,
  errorMessage: null,
  loading: false,
};

export default (state = initState, action) => {
  const {type, payload} = action;
  switch (type) {
    case FETCH_PART_FAIL:
      return {
        ...state,
        loading: false,
        errorMessage: 'error',
      };
    case FETCH_PART:
      return {
        ...state,
        parts: [],
        loading: true,
        errorMessage: null,
      };
    case FETCH_PART_SUCCESS:
      return {
        ...state,
        parts: orderBy(payload.data.data, 'order'),
        loading: false,
        errorMessage: null,
      };
    case FETCH_PART_VIP_SUCCESS:
      return {
        ...state,
        partsVip: orderBy(payload.data.data, 'order'),
        loading: false,
        errorMessage: null,
      };
    case PART_DONE:
      const parts = state.parts.map((item) => {
        if (item._id === payload.data.part_id) {
          return {
            ...item,
            activity_done_count: !state.partsIdDone.includes(
              payload.data.part_id,
            )
              ? item.activity_done_count + 1
              : item.activity_done_count,
          };
        }
        return item;
      });
      return {
        ...state,
        partsIdDone: [...state.partsIdDone, payload.data.part_id],
        parts,
      };
    case CHANGE_CURRENT_PART:
      return {
        ...state,
        currentPart: payload.currentPart,
      };
    default:
      return state;
  }
};
