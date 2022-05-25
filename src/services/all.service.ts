import { METHODS, client } from '../shared/utilities/network-communication/rest-client';

// user

export const login = (number: string) => {
    return client.API(METHODS.POST, '/api/userdata/login', { mobileNumber: parseInt(number) });
};

export const confirmOTP = (number: string, otp: string, regForIVR: boolean) => {
    return client.API(METHODS.POST, `/api/userdata/login/${otp}`, { mobileNumber: parseInt(number), IVRRegistered: regForIVR });
};

export const updateUser = (user: any, userToken: string) => {
    return client.API(METHODS.POST, '/api/userdata/user/update', {...user, mobileNumber: parseInt(user.mobileNumber),  emergencyContact: parseInt(user?.emergencyContact ? user?.emergencyContact : 0)}, { userToken })
};

export const getUser = (number: string, userid: string, userToken: string) => {
    return client.API(METHODS.GET, `/api/userdata/user/${userid}`, {}, { userToken });
};

export const getActivityLog = (userid: string, userToken: string) => {
    return client.API(METHODS.GET, `/api/userdata/activitylog?userid=${userid}`, {}, { userToken });
};

export const updateActivityLog = (userid: string, activities = [], userToken: string) => {
    return client.API(METHODS.POST, `/api/userdata/activitylog/${userid}`, activities, { userToken });
};

export const registerForIVR = (number: string, userid: string, userToken: string) => {
    return client.API(METHODS.POST, '/api/userdata/user/registerForIVR', { mobileNumber: parseInt(number), id: userid }, { userToken });
};

export const getAccountStatus = (number: string, userid: string, userToken: string) => {
    return client.API(METHODS.POST, '/api/externaldata/account/status', { mobileNumber: parseInt(number), id: userid }, { userToken });
};

// location

export const getRoutes = (userid: string, userToken: string) => {
    return client.API(METHODS.GET, `/api/userdata/routes?userid=${userid}`, { }, { userToken });
};

export const addRoutes = (userid: string, routes: Array<any>, userToken: string) => {
    return client.API(METHODS.POST, `/api/userdata/routes/${userid}`, routes, { userToken });
};

export const getPoints = (userid: string, userToken: string) => {
    return client.API(METHODS.GET, `/api/userdata/points?userid=${userid}`, { }, { userToken });
};

export const addPoints = (userid: string, points: Array<any>, userToken: string) => {
    return client.API(METHODS.POST, `/api/userdata/points/${userid}`, points, { userToken });
};

// weather

export const getCurrentLocationWeather = (lon: number, lat: number, userToken?: string) => {
    return client.API(METHODS.POST, '/api/externaldata/weathercurrent', { lat, lon }, { userToken });
};

// other

export const getZones = (userToken?: string) => {
    return client.API(METHODS.GET, '/api/externaldata/zones', {}, { userToken });
};

export const getDOFInfo = (userToken?: string) => {
    return client.API(METHODS.GET, '/api/externaldata/dof', {}, { userToken });
};

export const getAlerts = (userid: string, userToken: string) => {
    return client.API(METHODS.GET, `/api/userdata/alerts?userid=${userid}`, {}, { userToken });
};