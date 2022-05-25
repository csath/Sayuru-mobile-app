
import React, { FC, useEffect } from 'react';
import {
    View,
    ActivityIndicator,
    Text,
    StatusBar,
    Dimensions,
    ImageBackground,
    Image,
} from 'react-native';
import { SplashScreenStyles as sty } from '../styles/splash-screen.style';
import navigationService from '../../../navigation/navigationService';
import images from '../../../assets';
import colors from '../../../shared/styles/colors';
import { DefaultStyles } from '../../../shared/styles/common-styles';
import { useDispatch, useSelector } from 'react-redux';
import SVGDialog from '../../../assets/common/dialog.svg';
import localize from '../../../localization/translations';
import { fontScale } from '../../../shared/utilities/scale';
import * as SERVICES from '../../../services/all.service';
import { SET_LANGUAGE, SET_ZONES, UPDATE_TRIAL_ACCOUNT_INFO } from '../../../store/types';
import { checkSubscriptionStatus } from '../../../shared/utilities/subscriptionHandler';
import { listenToTopics } from '../../../shared/utilities/network-communication/push/util/notification-get-token';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SplashScreen: FC = () => {
    const dispatch = useDispatch();
    const { selectedLang } = useSelector(({ localization }: any) => localization)
    const { isFirstTimeUser, isLoggedIn, mobileNo, isInternetConnected, userid } = useSelector(({ auth }: any) => auth)
    const { zones, userToken } = useSelector(({ userProfile }: any) => userProfile)

    useEffect(() => {
        localize.setLanguage(selectedLang);
        dispatch({
            type: SET_LANGUAGE,
            payload: selectedLang
        })
    }, [])

    useEffect(() => {
        if (isLoggedIn) {
            // checkSubscriptionStatus();

            SERVICES.getAccountStatus(mobileNo, userid, userToken)?.then(res => {
                if (res?.data?.isSuccess) {
                    dispatch({
                        type: UPDATE_TRIAL_ACCOUNT_INFO,
                        payload: ({
                            isPremiumAccount: res?.data?.data?.isPremiumAccount,
                            remainingFreeTrialDays: res?.data?.data?.remainingFreeTrialDays,
                        })
                    })
                }
            }).catch(() => { })
        }
    }, [])

    useEffect(() => {
        if (isLoggedIn && zones?.length > 0) {
            listenToTopics(zones?.map((e: any) => e.id), true);
        }
    }, [])

    useEffect(() => {
        let nextScreen = 'OnboardStack';

        if (isFirstTimeUser) {
            nextScreen = 'OnboardStack';
        }
        else if (isLoggedIn && mobileNo) {
            fetchInitialData();
            nextScreen = 'VerifiedUser';
        }
        else if (!isLoggedIn && !isFirstTimeUser) {
            nextScreen = 'VerifyMobileNum';
        }

        setTimeout(function () {
            navigationService.navigate(nextScreen, {});
        }, 800);
    }, []);

    const fetchInitialData = () => {
        if (isInternetConnected) {
            // fetch data
            SERVICES.getZones()?.then(res => {
                if (res?.data?.isSuccess) {
                    dispatch({
                        type: SET_ZONES,
                        payload: res?.data?.data
                    })
                }
            }).catch(() => { })
        }
    }

    return (
        <View style={DefaultStyles.container}>
            <StatusBar backgroundColor={colors.primary_background} barStyle={'dark-content'} />
            <View style={sty.spashBgAbsolute}>
                <ImageBackground source={images.splash_background} style={sty.bgImgStyles} />
            </View>
            <View>
                <View style={sty.topView}>
                    <SVGDialog width={windowHeight / 4} height={windowHeight / 6} />
                    <Text style={{ textAlign: 'left', width: windowHeight / 4, color: colors.grey_1, lineHeight: 12, fontSize: fontScale(11) }}>Sustainability Initiative</Text>
                </View>
                <View style={sty.centeredView}>
                    <Image source={images.app_logo_white} style={{ width: windowHeight / 4, height: windowHeight / 6 }} resizeMode="contain" />
                    <Text style={sty.descStyles}>{"You are not alone in the sea\nwith Sayuru fishing app"}</Text>
                </View>
                <View>
                    <ActivityIndicator
                        size="large"
                        color={colors.primary_background}
                        style={sty.activityInd} />
                </View>
            </View>
        </View>
    );
};

export default SplashScreen;