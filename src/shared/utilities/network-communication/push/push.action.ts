import { store } from '../../../../store/index';
import { NEW_NOTIFICATION_RECEIVED, ADD_NEW_ITEM_OLD_NOTIFICATION, NEW_FCM_TOKEN } from '../../../../store/types/index';

export function updateNewFcmToken(value: string) {
    return {
        type: NEW_FCM_TOKEN,
        payload: value
    }
}

export function updateNotificationList(value) {
    return {
        type: NEW_NOTIFICATION_RECEIVED,
        payload: value
    }
}

export function updateOldNotificationList(value) {
    return {
        type: ADD_NEW_ITEM_OLD_NOTIFICATION,
        payload: value
    }
}

export function maintainAlertSegments() {
    const existingAlertsInToday = store.getState().notificationsReducer.todayAlerts;

    if (existingAlertsInToday.length > 0) {
        store.dispatch<any>(updateOldNotificationList(
            {
                date: existingAlertsInToday[0].timeStamp,
                oldItems: existingAlertsInToday
            }
        ))
    }
}