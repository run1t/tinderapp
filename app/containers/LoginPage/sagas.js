//  import { LOCATION_CHANGE } from 'react-router-redux';
import { takeEvery, call } from 'redux-saga';
import { SUBMIT_FORM } from './constants';
import request from 'utils/request';

export function* auth() {
  const requestURL = '/api/tinder/auth';
  yield call(request, requestURL);
}

export function* loginSaga() {
  yield takeEvery(SUBMIT_FORM, auth);
}

export default [
  loginSaga,
];
