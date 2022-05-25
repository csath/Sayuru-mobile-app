import { DeserializePayload } from "./util/deserialize-notification-payload";

export function parseNotification(msg: any) {
    try {
        return {
            notificationId: msg.messageId,
            title: msg.notification.title,
            shortDesc: msg.notification.body,
            timeStamp: msg.data.timeStamp,
            payload: DeserializePayload(msg.data.payload)
        }
    }
    catch (e) {
        return null;
    }
}