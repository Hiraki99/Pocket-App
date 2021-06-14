import {put, call, takeLatest} from 'redux-saga/effects';
import {FETCH_PART, FETCH_PART_VIP} from './PartType';
import partApi from './PartApi';
import {
  fetchPartFail,
  fetchPartSuccess,
  fetchPartVipFail,
  fetchPartVipSuccess,
} from './PartAction';

export default function* partSagas() {
  yield takeLatest(FETCH_PART, fetchPart);
  yield takeLatest(FETCH_PART_VIP, fetchPartsVip);
}

function* fetchPart({payload: {form}}) {
  const response = yield call(partApi.fetchPart, form);
  if (response.ok && response.data) {
    yield put(fetchPartSuccess(response.data));
    return;
  }
  yield put(fetchPartFail());
}

function* fetchPartsVip({payload: {form}}) {
  const response = yield call(partApi.fetchPartsVip, form);
  if (response.ok && response.data) {
    yield put(fetchPartVipSuccess(response.data));
    return;
  }
  yield put(fetchPartVipFail());
}
