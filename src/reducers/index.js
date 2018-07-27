
import {combineReducers} from 'redux'
import user from './user/user'




const initialState = {
    isFetching: true,
};

export const actionsTypes = {
    FETCH_START: "FETCH_START",
    FETCH_END: "FETCH_END",
};

export function reducer(state = initialState, action) {
    switch (action.type) {
        case actionsTypes.FETCH_START:
            return {
                ...state, isFetching: true
            };
        case actionsTypes.FETCH_END:
            return {
                ...state, isFetching: false
            };
        default:
            return state
    }
}



export default combineReducers({
       globalState: reducer,
       user
})
