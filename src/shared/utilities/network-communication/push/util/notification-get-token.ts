import { Alert, Platform } from 'react-native';
import { store } from '../../../../../store/index';
import messaging from '@react-native-firebase/messaging';
import { ADD_NEW_ALERT, IS_PUSH_CONFIGURED, NEW_FCM_TOKEN } from '../../../../../store/types';
import navigationService from '../../../../../navigation/navigationService';
import localize from '../../../../../localization/translations';

export async function getFcmToken() {
    try {
        const fcmToken = await messaging().getToken();

        if (fcmToken) {
            const existingFirebaseToken = store.getState().auth.FCMToken;

            if (existingFirebaseToken !== fcmToken) {
                store.dispatch({
                    type: NEW_FCM_TOKEN,
                    payload: fcmToken,
                });
            }
        } else {
            console.warn("Failed", "No token received");
        }

        return fcmToken;
    }
    catch (e) { }
}

function onMessagehandler() {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
        const pyl = JSON.parse(remoteMessage?.data?.alert)
        Alert.alert(localize.alert.newAlert, pyl?.payload[`${localize.getLanguage().toLowerCase()}_message`], [
            {
                text: localize.alert.readMore,
                onPress: () => navigationService.navigate("Tab_alerts", {})
            },
            {
                text: localize.alert.later,
                style: "cancel",
            }
        ])
        persistPushNotification(pyl);
    });

    messaging().onNotificationOpenedApp((remoteMessage) => {
        const pyl = JSON.parse(remoteMessage?.data?.alert);
        persistPushNotification(pyl);
        navigationService.navigate("Tab_alerts", {});
    })

    return unsubscribe;
}

export async function listenToTopics(topicNames: string [], deleteToken: boolean) {
    try {
        if (deleteToken)
        {
            await messaging().deleteToken();
            await messaging().getToken();
        }
        return Promise.all([...topicNames?.map(e => messaging().subscribeToTopic(e))])
        .then(res => {
            console.log(res);
            store.dispatch({
                type: IS_PUSH_CONFIGURED,
                payload: true,
            })
        })
        .catch(e => {
            console.log(e);
            store.dispatch({
                type: IS_PUSH_CONFIGURED,
                payload: false,
            })
        });
    }
    catch(e)
    {
        store.dispatch({
            type: IS_PUSH_CONFIGURED,
            payload: false,
        })
        return false;
    }
}

export async function handleBackgroundfMsgs() {
    if (Platform.OS === 'android') {
        onMessagehandler();
    }
}

export function persistPushNotification(msg) {
    if (msg) {
        store.dispatch({
            type: ADD_NEW_ALERT,
            payload: msg,
        })
    }
}
