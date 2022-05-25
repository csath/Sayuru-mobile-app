import { CLEAR_USER_PROFILE, UPDATE_ACTIVITY_LOG, UPDATE_USER_PROFILE, CLEAR_ACTIVITY_LOG, ACTIVITY_LOG_BACKEND_UPDATED, SET_ACTIVITY_LOG } from '../types/index';

// SAMPLE ACTIVITY LOG
// { 
//     time: '2021-06-04T11:17:30.275Z', 
//     logType: '',
//     additionalInfo: 'Heavy rain will begin around 8:45 PM, Continuing off and on over next half hour.' 
// }

const INITIAL_STATE = {
    serverSyncTimestamp: new Date().getTime(),
    localSyncTimestamp: new Date().getTime(),
    activityLog: [],
};

const activityLogReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {

        case UPDATE_ACTIVITY_LOG:
            return {
                ...state,
                localSyncTimestamp: new Date().getTime(),
                activityLog: [...state.activityLog, ...action.payload]
            };
        case CLEAR_ACTIVITY_LOG:
            return {
                ...state,
                activityLog: []
            };
        case ACTIVITY_LOG_BACKEND_UPDATED:
            return {
                ...state,
                activityLog: state.activityLog.map(e => ({ ...e, offlineCreated: false })),
                serverSyncTimestamp: state.localSyncTimestamp
            };
        case SET_ACTIVITY_LOG:
            return {
                ...state,
                activityLog: action.payload
            };
        default:
            return state;
    }
}

export default activityLogReducer;
