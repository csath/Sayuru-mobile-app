import messaging from '@react-native-firebase/messaging';
// import { isNotEmptyObject } from "../../operations";

export function updateTopics(zones) {
    messaging()
        .unsubscribeFromTopic('1')
        .then(() => {
            console.log('Unsubscribed fom the topic!')

            messaging()
                .subscribeToTopic('1')
                .then(() => { console.log('Subscribed to topic!') });

        });

    // OneSignal.getTags((existingTags) => {
    //     if (isNotEmptyObject(existingTags)) {
    //         OneSignal.deleteTags(Object.keys(existingTags));
    //     }

    //     if (isNotEmptyObject(zones)) {
    //         OneSignal.sendTags(zones);
    //     }
    // });
}
