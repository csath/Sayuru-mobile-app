import moment from 'moment';
import { CLEAR_WEATHER_DATA, SET_WEATHER_DATA } from '../types/index';

const INITIAL_STATE = {
    todayWeather: null,
    weatherData: null,
};

const weatherReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CLEAR_WEATHER_DATA:
            return {
                ...INITIAL_STATE,
            };

        case SET_WEATHER_DATA:
            return {
                ...state,
                weatherData: action.payload
            };
        default:
            return state;
    }
}

export default weatherReducer;
