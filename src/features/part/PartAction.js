import {
  CHANGE_CURRENT_PART,
  FETCH_PART,
  FETCH_PART_FAIL,
  FETCH_PART_SUCCESS,
  FETCH_PART_VIP,
  FETCH_PART_VIP_FAIL,
  FETCH_PART_VIP_SUCCESS,
  PART_DONE,
} from './PartType';

export const fetchPart = (form) => {
  return {
    type: FETCH_PART,
    payload: {form},
  };
};

export const fetchPartSuccess = (data) => {
  return {
    type: FETCH_PART_SUCCESS,
    payload: {data},
  };
};

export const fetchPartFail = () => {
  return {
    type: FETCH_PART_FAIL,
  };
};

export const changeCurrentPart = (currentPart) => {
  return {
    type: CHANGE_CURRENT_PART,
    payload: {currentPart},
  };
};

export const donePart = (data) => {
  return {
    type: PART_DONE,
    payload: {data},
  };
};

export const fetchPartVip = (form) => {
  return {
    type: FETCH_PART_VIP,
    payload: {form},
  };
};

export const fetchPartVipSuccess = (data) => {
  return {
    type: FETCH_PART_VIP_SUCCESS,
    payload: {data},
  };
};

export const fetchPartVipFail = () => {
  return {
    type: FETCH_PART_VIP_FAIL,
  };
};
