import { ACTIVITY_LOG_BACKEND_UPDATED, ADD_POINT, ADD_ROUTE, POINT_BACKEND_UPDATED, ROUTE_BACKEND_UPDATED, UPDATE_ACTIVITY_LOG, UPDATE_USER_PROFILE, USRE_PROFILE_BACKEND_UPDATED } from "../../store/types";
import * as SERVICES from '../../services/all.service';
import { store } from "../../store";

export const offlineDataSyncherMiddleware = (store) => (next) => (action) => {

  if (action.type === UPDATE_USER_PROFILE) {
    const { auth, userProfile } = store.getState();
    if (auth.isInternetConnected) {
      const req = { ...userProfile, ...action.payload, preferedLanguage: userProfile.preferedLanguage, id: userProfile.id, mobileNumber: userProfile.mobileNumber}
      SERVICES.updateUser(req, userProfile.userToken)?.then((res) => {
        store.dispatch({
          type: USRE_PROFILE_BACKEND_UPDATED
        })
      }).catch((e) =>{
      })
    }
    else {
      action.payload = {...action.payload, offlineCreated: true};
    }
  }

  if (action.type === UPDATE_ACTIVITY_LOG) {
    const { auth, activityLog, userProfile } = store.getState();
    action.payload = action.payload?.map(e => ({...e, userId: userProfile?.id, createdTimeStamp: new Date().getTime()}))
    if (auth.isInternetConnected) {
      const res = [...activityLog?.activityLog.filter(x => x.offlineCreated), ...action.payload]
      SERVICES.updateActivityLog(userProfile.id, res, userProfile.userToken)?.then((response) => {
        store.dispatch({
          type: ACTIVITY_LOG_BACKEND_UPDATED,
          payload: response?.createdTimeStamp,
        })
      }).catch((e) =>{
      })
    }
    else {
      action.payload = action.payload?.map(e => ({...e, offlineCreated: true}))
    }
  }

  if (action.type === ADD_POINT) {
    const { auth, route, userProfile } = store.getState();
    action.payload = {...action.payload, userId: userProfile?.id, createdTimeStamp: new Date().getTime()};
    if (auth.isInternetConnected) {
      const res = [...route?.points.filter(x => x.offlineCreated), action.payload]
      SERVICES.addPoints(userProfile?.id, res, userProfile.userToken)?.then((response) => {
        store.dispatch({
          type: POINT_BACKEND_UPDATED,
          payload: response?.createdTimeStamp,
        })
      }).catch((e) =>{
      })
    }
    else {
      action.payload = {...action.payload, offlineCreated: true}
    }
  }

  if (action.type === ADD_ROUTE) {
    const { auth, route, userProfile } = store.getState();
    action.payload = {...action.payload, userId: userProfile?.id, createdTimeStamp: new Date().getTime()};

    if (auth.isInternetConnected) {
      const res = [...route?.routes.filter(x => x.offlineCreated), action.payload]
      SERVICES.addRoutes(userProfile?.id, res, userProfile.userToken)?.then((response) => {
        store.dispatch({
          type: ROUTE_BACKEND_UPDATED,
          payload: response?.createdTimeStamp,
        })
      }).catch((e) =>{
      })
    }
    else {
      action.payload = {...action.payload, offlineCreated: true}
    }
  }


  next(action);
}


export const runBackgroundSyncer = () => {
  const {activityLog, route, userProfile, auth} = store.getState();

  if (!auth.isLoggedIn) return; // skip if not logged in

  if (userProfile.offlineCreated) {
    // sync user profile
    SERVICES.updateUser(userProfile, userProfile.userToken)?.then((res) => {
      store.dispatch({
        type: USRE_PROFILE_BACKEND_UPDATED,
      })
    }).catch(() =>{})
  }

  if (activityLog.activityLog.filter(e => e.offlineCreated).length > 0) {
    SERVICES.updateActivityLog(userProfile?.id, activityLog?.activityLog?.filter(e => e.offlineCreated), userProfile.userToken)?.then((response) => {
      store.dispatch({
        type: ACTIVITY_LOG_BACKEND_UPDATED,
        payload: response?.createdTimeStamp,
      })
    }).catch(() =>{})
  }

  if (route?.routes.filter(e => e.offlineCreated).length > 0) {
      SERVICES.addRoutes(userProfile?.id, route?.routes.filter(e => e.offlineCreated), userProfile.userToken)?.then((response) => {
        store.dispatch({
          type: ROUTE_BACKEND_UPDATED,
          payload: response?.createdTimeStamp,
        })
      }).catch(() =>{})
  }

  if (route?.points.filter(e => e.offlineCreated).length > 0) {
      SERVICES.addPoints(userProfile?.id, route?.points.filter(e => e.offlineCreated), userProfile.userToken)?.then((response) => {
        store.dispatch({
          type: POINT_BACKEND_UPDATED,
          payload: response?.createdTimeStamp,
        })
      }).catch(() =>{})
  }

}