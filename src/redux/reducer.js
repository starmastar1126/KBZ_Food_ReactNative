import {combineReducers} from 'redux';

const reducer_LoadingIndicator = (state = {isLoading: undefined}, action) => {
    switch (action.type) {
        case "LAODING_INDICATOR":
            return Object.assign({}, state, {
                isLoading: action.isLoading
            })
        default:
            return state;
    }
}

const reducer_NetworkStatus = (state = {loginUser: {}}, action) => {
    switch (action.type) {
        case "NETWORK_STATUS":
            return Object.assign({}, state, {
                isConnected: action.isConnected
            })
        default:
            return state;
    }
}

const reducer_GetOdooRes = (state = {response: {}}, action) => {
    switch (action.type) {
        case "ODOO_RESPONSE":
            return Object.assign({}, state, {
                response: action.response
            })
        default:
            return state;
    }
}


const reducer_UserLogin = (state = {user: undefined}, action) => {
    switch (action.type) {
        case "USER_LOGIN":
            return Object.assign({}, state, {
                user: action.user
            })
        default:
            return state;
    }
}


export default combineReducers({
    reducer_LoadingIndicator: reducer_LoadingIndicator,
    reducer_NetworkStatus: reducer_NetworkStatus,
    reducer_GetOdooRes: reducer_GetOdooRes,
    reducer_UserLogin: reducer_UserLogin
})