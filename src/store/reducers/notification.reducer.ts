import { ADD_NEW_ALERT, SET_ALERT_LIST, CLEAR_ALERT_LIST, IS_PUSH_CONFIGURED } from '../types/index';

const INITIAL_STATE = {
    alerts: [],
    isPushConfigured: false,
};

const notificationsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_NEW_ALERT:
            return {
                ...state,
                alerts: [action.payload, ...state.alerts],
            };
        case SET_ALERT_LIST:
            return {
                ...state,
                alerts: [...action.payload],
            };
        case IS_PUSH_CONFIGURED:
            return {
                ...state,
                isPushConfigured: action.payload,
            };
        case CLEAR_ALERT_LIST:
            return {
                ...INITIAL_STATE,
            };
        default:
            return state;
    }
}

export default notificationsReducer;
