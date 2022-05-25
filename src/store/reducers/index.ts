import authReducer from './auth.reducer';
import localizationReducer from './localization.reducer';
import userProfileReducer from './user-profile.reducer';
import weatherReducer from './weather.reducer';
import notificationsReducer from './notification.reducer';
import routeReducer from './route.reducer';
import dofReducer from './dof.reducer';
import activityLogReducer from './activity-log.reducer';
import dataReducer from './data.reducer';

export default (
    {
        auth: authReducer,
        localization: localizationReducer,
        route: routeReducer,
        userProfile: userProfileReducer,
        notification: notificationsReducer,
        weather: weatherReducer,
        dof: dofReducer,
        activityLog: activityLogReducer,
        data: dataReducer,
    }
);