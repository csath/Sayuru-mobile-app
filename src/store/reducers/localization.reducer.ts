import { CLEAR_LANGUAGE, SET_LANGUAGE } from "../types";
import { ENGLISH } from "../../localization/localization.keys";

const INITIAL_STATE = {
    didUserSelectedLang: false,
    selectedLang: ENGLISH,
};

const localizationReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_LANGUAGE:
            return {
                ...state,
                didUserSelectedLang: true,
                selectedLang: action.payload,
            };
        case CLEAR_LANGUAGE:
            return {
                ...INITIAL_STATE,
            };
        default:
            return state;
    }
};

export default localizationReducer;
