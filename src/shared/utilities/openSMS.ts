import { store } from '../../store';
import { Alert, Linking, Platform } from 'react-native';
import localize from '../../localization/translations';
import { UPDATE_ACTIVITY_LOG } from '../../store/types';
import { LOG_TYPES } from '../../constants/logTypes';

export function openSMSapp() {
    const { lat, lon } = store.getState().route.userCurrentLocation;
    const name = store.getState().userProfile.firstName + " " + store.getState().userProfile.lastName;
    const emergencyNum = store.getState().userProfile.emergencyContact;
    const smsBody = 'Emergency SOS msg from ' + name + ' via Sayuru app.\nLast position: ' + lat + ', ' + lon + "\n\n" + "Open in maps: https://maps.google.com/?q=" + lat + "," + lon; 
    const operator = Platform.select({ ios: '&', android: '?' });

    if (!emergencyNum) {
        Alert.alert(localize.myProfile.sosNumberMissingTitle, localize.myProfile.sosNumberMissingMsg)
    }
    else {
        Alert.alert(
            localize.myProfile.confirmation,
            localize.myProfile.sosWarning,
            [
                { text: localize.myProfile.proceed, onPress: () => {
                    store.dispatch({
                        type: UPDATE_ACTIVITY_LOG,
                        payload: [{
                            time: new Date().toISOString(),
                            logType: LOG_TYPES.SEND_SOS,
                            additionalInfo: `To: ${emergencyNum}, SMS: ${smsBody}`,
                        }]
                    })
                    Linking.openURL(`sms:${emergencyNum}${operator}body=${smsBody}`);
                }},
                { text: localize.myProfile.cancel, onPress: () => console.log('No Pressed'), style: 'cancel' }
            ]
        )
    }
}

