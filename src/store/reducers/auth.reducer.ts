import { NEW_FCM_TOKEN, UPDATE_FIRST_TIME_USER_FLAG, USER_LOG_OUT, USER_LOG_IN, IS_INTERNET_CONNECTED, UPDATE_SUBSCRIPTION, UPDATE_TRIAL_ACCOUNT_INFO } from '../types/index';

const INITIAL_STATE = {
    isFirstTimeUser: true,
    isLoggedIn: false,
    mobileNo: '',
    tokenValue: '',
    FCMToken: '',
    isInternetConnected: false,
    subscriptionChecked: false,
    subscription: null,
    isPremiumAccount: false,
    remainingFreeTrialDays: 45, 
};

const authReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UPDATE_FIRST_TIME_USER_FLAG:
            return {
                ...state,
                isFirstTimeUser: action.payload,
            };
        case USER_LOG_OUT:
            return {
                ...state,
                isLoggedIn: false,
            };
        case USER_LOG_IN:
            return {
                ...state,
                isLoggedIn: true,
                mobileNo: action.payload,
            };
        case NEW_FCM_TOKEN:
            return {
                ...state,
                FCMToken: action.payload,
            };
        case IS_INTERNET_CONNECTED:
            return {
                ...state,
                isInternetConnected: action.payload,
            };
        case UPDATE_SUBSCRIPTION:
            return {
                ...state,
                subscriptionChecked: true,
                subscription: action.payload,
            };
        case UPDATE_TRIAL_ACCOUNT_INFO:
            return {
                ...state,
                isPremiumAccount: action.payload.isPremiumAccount,
                remainingFreeTrialDays: action.payload.remainingFreeTrialDays,
            };
        default:
            return state;
    }
}

export default authReducer;
