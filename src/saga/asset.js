import {actionTypes as asset} from '../reducers/user/asset'
import {actionsTypes as gobal} from '../reducers'
import {put, take, call, select} from 'redux-saga/effects'
import {get, post} from '../util/fetch'

export function* getAllbalance() {
     yield put({type: gobal.FETCH_START});
       try {
         return yield call(get, '/user/getAllAsset');
       } catch (err) {
        //  console.log('Error happened!')
       } finally {
        yield put({type: gobal.FETCH_END});
        //  console.log('Finish fetching')
       }
}


export function* getAllbalanceFlow() {
    while (true) {
        yield take(asset.GET_ALL_BALANCE);
        let res = yield call(getAllbalance);
        if (res.code === 0) {
            let tempArr = [];
            for (let i = 0; i < res.data.length; i++) {
                tempArr.push(res.data[i])
            }
            yield put({type: asset.SET_ALL_BALANCE, data: tempArr});
        } 
    }
}

