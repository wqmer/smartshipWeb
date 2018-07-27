const initialState = []



export const actionTypes = {
    GET_ALL_BALANCE: "GET_ALL_BALANCE",
    SET_ALL_BALANCE: "SET_ALL_BALANCE",

};

export const actions = {
    get_all_balance: function () {
        return {
            type: actionTypes.GET_ALL_BALANCE,
        }
    }
};

export function reducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.SET_ALL_BALANCE:
            return [ ...action.data ];

        default:
            return state;
    }
}
