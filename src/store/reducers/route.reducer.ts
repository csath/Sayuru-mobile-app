import { ADD_POINT, ADD_ROUTE, ADD_TEMP_LOCATION, CLEAR_ROUTE_REDUCER, CLEAR_TEMP_LOCATION, SET_POINTS_LIST, SET_ROUTES_LIST, SET_CURRENT_USER_LOCATION, ROUTE_BACKEND_UPDATED, POINT_BACKEND_UPDATED, GEOFENCE_STATUS, GEOFENCE_STATUS_WARNING_SHOWED, GEOFENCE_STATUS_IN, GEOFENCE_STATUS_OUT } from "../types";

const INITIAL_STATE = {
    points: [],
    pointServerSyncTimestamp: new Date().getTime(),
    pointLocalSyncTimestamp: new Date().getTime(),
    routes: [],
    routeServerSyncTimestamp: new Date().getTime(),
    routeLocalSyncTimestamp: new Date().getTime(),
    tempLocations: [],
    userCurrentLocation: {
        lat: 0,
        lon: 0,
    },
    isUserInGeoFence: true,
    geoFenceWarningLastShown: null
};

const routeReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CLEAR_ROUTE_REDUCER:
            return {
                ...INITIAL_STATE,
            };
        case SET_POINTS_LIST:
            return {
                ...state,
                pointServerSyncTimestamp: new Date().getTime(),
                pointLocalSyncTimestamp: new Date().getTime(),
                points: action.payload,
            };
        case ADD_POINT:
            return {
                ...state,
                pointLocalSyncTimestamp: new Date().getTime(),
                points: [...state.points, action.payload]
            };
        case SET_ROUTES_LIST:
            return {
                ...state,
                routeServerSyncTimestamp: new Date().getTime(),
                routeLocalSyncTimestamp: new Date().getTime(),
                routes: action.payload,
            };
        case ADD_ROUTE:
            return {
                ...state,
                routeLocalSyncTimestamp: new Date().getTime(),
                routes: [...state.routes, action.payload]
            };
        case ADD_TEMP_LOCATION:
            return {
                ...state,
                tempLocations: [...state.tempLocations, action.payload]
            };
        case CLEAR_TEMP_LOCATION:
            return {
                ...state,
                tempLocations: []
            };
        case POINT_BACKEND_UPDATED:
            return {
                ...state,
                points: state.points.map(e => ({ ...e, offlineCreated: false })),
                pointServerSyncTimestamp: state.pointLocalSyncTimestamp
            };
        case ROUTE_BACKEND_UPDATED:
            return {
                ...state,
                routes: state.routes.map(e => ({ ...e, offlineCreated: false })),
                routeServerSyncTimestamp: state.routeLocalSyncTimestamp
            };
        case SET_CURRENT_USER_LOCATION:
            return {
                ...state,
                userCurrentLocation: {
                    lat: action.payload.lat,
                    lon: action.payload.lon,
                }
            };
        case GEOFENCE_STATUS_IN:
            return {
                ...state,
                isUserInGeoFence: true,
            }
        case GEOFENCE_STATUS_OUT:
            return {
                ...state,
                isUserInGeoFence: false,
            }
        case GEOFENCE_STATUS_WARNING_SHOWED:
            return {
                ...state,
                geoFenceWarningLastShown: new Date().getTime(),
            }
        default:
            return state;
    }
};

export default routeReducer;
