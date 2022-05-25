import { SET_DOF_SLIDER_IMAGES, SET_DOF_BUTTON_LINKS, SET_DOF_WEBVIEW_URL, CLEAR_DOF_REDUCER, SET_DOF_DATA } from "../types";

const INITIAL_STATE = {
    images: [],
    buttonLinks: [],
    webViewUrl: '',
};

const dofReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_DOF_SLIDER_IMAGES:
            return {
                ...state,
                images: [...action.payload],
            };
        case SET_DOF_BUTTON_LINKS:
            return {
                ...state,
                buttonLinks: [...action.payload],
            };
        case SET_DOF_WEBVIEW_URL:
            return {
                ...state,
                webViewUrl: action.payload,
            };
        case CLEAR_DOF_REDUCER:
            return {
                ...INITIAL_STATE,
            };
        case SET_DOF_DATA:
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
};

export default dofReducer;
