import messaging from '@react-native-firebase/messaging';
import { getFcmToken } from './notification-get-token';

export async function checkNotificationPermissionAndGetToken() {
    messaging().setAutoInitEnabled(true)
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
        await getFcmToken()
    }
    else {
        /** no permission has granted for notifications */
        await messaging().requestPermission({
            sound: false,
            provisional: true,
            badge: true,
            alert: true
        })
            .then(() => {

            })
            .catch(() => {

            });
    }
}
