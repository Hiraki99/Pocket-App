import {call, put, takeLatest} from 'redux-saga/effects';
import {DONE_ACTIVITY} from './ScriptType';
import scriptApi from './ScriptApi';
import {
  doneActivitySuccess,
  doneActivityError,
} from '~/features/activity/ActivityAction';
import {donePart} from '~/features/part/PartAction';

export default function* scriptSagas() {
  yield takeLatest(DONE_ACTIVITY, doneActivity);
}

function* doneActivity({payload: {form}}) {
  const response = yield call(scriptApi.doneActivity, form);
  if (response.ok && response.data) {
    yield put(doneActivitySuccess(response.data));
    yield put(
      donePart({
        part_id: form.part_id,
      }),
    );
  } else {
    yield put(doneActivityError());
  }
}
