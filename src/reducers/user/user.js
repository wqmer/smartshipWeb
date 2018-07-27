
import {reducer as balance} from './asset'
import {combineReducers} from 'redux'


const user = combineReducers({
    balance,
});

export default user
