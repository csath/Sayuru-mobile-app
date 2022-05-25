import { CLEAR_USER_PROFILE, SET_LANGUAGE, UPDATE_USER_PROFILE, USRE_PROFILE_BACKEND_UPDATED } from '../types/index';
import { DISTRICT_LIST } from '../../constants/districts';
import { DISTANCE_MEASUREMENTS } from '../../constants/distanceMeasurements';
import { FUEL_CAPACITY_MEASUREMENTS } from '../../constants/fuelCapacityMeasurements';
import { getLangKey } from '../../shared/utilities/localizationHelper';

const INITIAL_STATE = {
    id: null,
    profilePic: null,
    firstName: '',
    lastName: '',
    preferedLanguage: 0,
    fishermanID: '',
    mobileNumber: '',
    emergencyContact: '',
    nic: '',
    birthDate: new Date().toISOString(),
    district: DISTRICT_LIST[4],
    zones: [],
    preferredDistanceMeasurement: DISTANCE_MEASUREMENTS[0],
    preferredFuelCapacityMeasurement: FUEL_CAPACITY_MEASUREMENTS[0],
    perDistanceFuelWastage: '1',
    hasRegisteredIVR: false,
    address: '',
    isActive: false,
    serverSyncTimestamp: new Date().getTime(),
    localSyncTimestamp: new Date().getTime(),
    offlineCreated: false,
};

const userProfileReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UPDATE_USER_PROFILE:
            return {
                ...state,
                ...action.payload,
                preferedLanguage: state.preferedLanguage,
            };
        case CLEAR_USER_PROFILE:
            return {
                ...INITIAL_STATE,
            };
        case USRE_PROFILE_BACKEND_UPDATED:
            return {
                ...state,
                offlineCreated: false,
                serverSyncTimestamp: state.localSyncTimestamp,
            };
        case SET_LANGUAGE:
            return {
                ...state,
                preferedLanguage: getLangKey(action.payload)
            }
        default:
            return state;
    }
}

export default userProfileReducer;
