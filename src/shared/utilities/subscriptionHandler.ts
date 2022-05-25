import { Platform } from 'react-native';
import * as RNIap from 'react-native-iap';
import { SUBSCRIPTION_SKU } from '../../../configs';

const SUB_SKU = SUBSCRIPTION_SKU;
const SUBS = Platform.select({
    default: [ SUB_SKU ],
});

export const checkSubscriptionStatus = async (requestToActivate: boolean = false) => {
    try {
        const subscriptions = await RNIap.getSubscriptions(SUBS);
        const purchases = await RNIap.getAvailablePurchases();
        // console.log(subscriptions, purchases)

        if (requestToActivate) {
            RNIap.requestSubscription(SUB_SKU)
        }
        
    }
    catch (e) {
        console.log('err', e)
    }
}