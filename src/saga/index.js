import {fork} from 'redux-saga/effects'
import {getAllbalanceFlow} from './asset'

export default function* rootSaga() {
    yield fork(getAllbalanceFlow);
}
