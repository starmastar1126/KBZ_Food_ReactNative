export const action_NetworkStatus = isConnected => ({
    type: "NETWORK_STATUS",
    isConnected
})

export const action_UserLogin = user => ({
    type: "USER_LOGIN",
    user: user
})

export const action_LoadingIndicator = isLoading => ({
    type: "LAODING_INDICATOR",
    isLoading
})

export const action_Odoo_Response = response => ({
    type: "ODOO_RESPONSE",
    response: response
})



