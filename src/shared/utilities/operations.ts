import { Linking } from "react-native";
import { PRIVACY_POLICY_LINK, TERMS_AND_CONDITIONS_LINK } from "../../../configs";

export function isNotEmptyObject(obj: any) {
    return obj != null && Object.keys(obj).length > 0 && obj.constructor === Object;
}

export async function openTermsAndConditions() {
    const url = TERMS_AND_CONDITIONS_LINK;
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    }
    else {
        console.log('cannot open url')
    }
}

export async function openPrivacyPolicy() {
    const url = PRIVACY_POLICY_LINK;
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    }
    else {
        console.log('cannot open url')
    }
}
