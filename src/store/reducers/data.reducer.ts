import { SET_ZONES } from "../types";

const INITIAL_STATE = {
    zones: [],
    hasDataFetched: false,
};

const dataReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_ZONES:
            return {
                ...state,
                zones: action.payload,
                hasDataFetched: true,
            };
        default:
            return state;
    }
};

export default dataReducer;
