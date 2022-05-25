
import React, { FC, useEffect, useState } from 'react';
import {
    View,
    SafeAreaView,
    ScrollView,
    RefreshControl,
    Alert,
    Text
} from 'react-native';
import _ from 'lodash';
import Geolocation from 'react-native-geolocation-service';
import { DefaultStyles } from '../../../shared/styles/common-styles';
import { NavHeader } from '../../../shared/components/navigation-header/nav-header.component';
import { DashboardAlert } from '../../../shared/components/widgets/dashboard-alert.component';
import { GeneralQuickAccessWidget } from '../../../shared/components/widgets/general-quick-access.component';
import { useSelector, useDispatch } from 'react-redux';
import { DashboardWeatherW } from '../../../shared/components/widgets/dashboard-weather';
import navigationService from '../../../navigation/navigationService';
import moment from "moment";
import localize from '../../../localization/translations';
import colors from '../../../shared/styles/colors';
import Boat from '../../../assets/dashboard/fishing-boat.svg';
import Links from '../../../assets/dashboard/flat.svg';
import Map from '../../../assets/dashboard/location.svg';
import { getWeatherIconAndText } from '../utils/geticon';
import { GEOFENCE_STATUS, GEOFENCE_STATUS_IN, GEOFENCE_STATUS_OUT, GEOFENCE_STATUS_WARNING_SHOWED, SET_ALERT_LIST, SET_WEATHER_DATA } from '../../../store/types';
import { scale } from '../../../shared/utilities/scale';
import * as SERVICES from '../../../services/all.service';
import * as SETTINGS from '../../../shared/utilities/fetch-locations/location-settings';
import images from '../../../assets';
import { hasLocationPermission } from '../../../shared/utilities/fetch-locations/location-permission';
import { checkIfpointWithinPolygon } from '../../../shared/utilities/geofencingUtil';
import CustomModal from '../../../shared/components/modal/modal.component';
import { GeneralButton } from '../../../shared/components/buttons/general-button';

const { bgPrimary, scrollViewWrap } = DefaultStyles;

const HomeScreen: FC = () => {
    const dispatch = useDispatch();
    const { alerts } = useSelector(({ notification }: any) => notification);
    const { geoFenceWarningLastShown, isUserInGeoFence } = useSelector(({ route }: any) => route);
    const todayLatestAlert = [...alerts].find(e => moment().format('YYYY-MM-DD') == moment(e.timeStamp).format('YYYY-MM-DD'));

    const { firstName, id: userId, userToken } = useSelector(({ userProfile }: any) => userProfile);
    const { isPremiumAccount, remainingFreeTrialDays } = useSelector(({ auth }: any) => auth);
    const [refreshing, setRefreshing] = useState(false);
    const { userCurrentLocation } = useSelector(({ route }: any) => route);
    const { zones } = useSelector(({ data }: any) => data);
    const { todayWeather: _todayWeather, weatherData } = useSelector(({ weather }: any) => weather);
    let currentForecast = null;
    const [showWarningMsgModal, setShowWarningMsgModal] = useState(false);

    if (moment(weatherData?.toTime).isAfter(moment())) {
        currentForecast = weatherData?.predictions && weatherData?.predictions.length > 0 ? weatherData?.predictions[0] : null
    }

    const onRefresh = React.useCallback(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [])

    const showWarningMsg = (res) => {
        console.log('showWarningMsg', [res?.coords?.longitude, res?.coords?.latitude], checkIfpointWithinPolygon([res?.coords?.longitude, res?.coords?.latitude]))
        if (!res?.coords?.longitude && !res?.coords?.latitude) return;
        
        let isIn = checkIfpointWithinPolygon([res?.coords?.longitude, res?.coords?.latitude])
        if (!isIn) {

            setShowWarningMsgModal(true);
            dispatch({ type: GEOFENCE_STATUS_WARNING_SHOWED });
            // Alert.alert(r
            //     "Warning",
            //     "You are crossing Sri Lankan fishing border. Please return back!",
            //     [
            //         {
            //             text: "Cancel",
            //             style: "cancel",
            //         },
            //     ],
            // )
        }

        if (isIn) {
            dispatch({ type: GEOFENCE_STATUS_IN, payload: isIn });
        }
        else {
            dispatch({ type: GEOFENCE_STATUS_OUT, payload: isIn });
        }


    }

    // const debouncedShowWarningMsg = _.debounce(showWarningMsg, 250)

    useEffect(() => {
        Geolocation.watchPosition(
            (res) => {
                console.log('Geolocation', res)
                showWarningMsg(res)
            }, () => { })
    }, [])

    const fetchData = async () => {
        await hasLocationPermission();
        setRefreshing(true);
        try {

            SERVICES.getAlerts(userId, userToken)?.then(res => {
                if (res.data && res.data?.isSuccess) {

                    dispatch({
                        type: SET_ALERT_LIST,
                        payload: [
                            ...res.data?.data
                        ]
                    })
                }
            })
                .catch(e => {

                })

            if (userCurrentLocation?.lon == 0 && userCurrentLocation?.lat == 0) {
                Geolocation.getCurrentPosition(
                    (position) => {
                        // Do api call here
                        SERVICES.getCurrentLocationWeather(position.coords.longitude, position.coords.latitude)?.then(res => {

                            if (res.data && res.data?.isSuccess) {
                                dispatch({
                                    type: SET_WEATHER_DATA,
                                    payload: res?.data?.data
                                })
                            }
                            setRefreshing(false);
                        })
                            .catch(e => {
                                setRefreshing(false);
                            });
                    },
                    (error) => {
                        setRefreshing(false);
                    },
                    {
                        accuracy: {
                            android: SETTINGS.ACCURACY_ANDROID,
                            ios: SETTINGS.ACCURACY_IOS,
                        },
                        enableHighAccuracy: SETTINGS.IS_HIGH_ACCURACY_ENABLED,
                        timeout: SETTINGS.TIMEOUT,
                        maximumAge: SETTINGS.MAXIMUM_AGE,
                        distanceFilter: SETTINGS.DISTANCE_FILTER,
                        forceRequestLocation: SETTINGS.IS_FORCE_LOCATION,
                        showLocationDialog: SETTINGS.SHOW_LOCATION_DIALOG,
                    },
                );
            }
            else {
                SERVICES.getCurrentLocationWeather(userCurrentLocation?.lon, userCurrentLocation?.lat)?.then(res => {

                    if (res.data && res.data?.isSuccess) {
                        dispatch({
                            type: SET_WEATHER_DATA,
                            payload: res?.data?.data
                        })
                    }
                    setRefreshing(false);
                })
                    .catch(e => {
                        setRefreshing(false);
                    });
            }

            setRefreshing(false);
        }
        catch (e) {
            setRefreshing(false);
        }
    }

    const getMaxWind = (generalWindMax: number, gustyWind: number, thundershowerWind: number) => {
        const arr = [{ type: 'generalWindMax', value: generalWindMax }, { type: 'gustyWind', value: gustyWind }, { type: 'thundershowerWind', value: thundershowerWind }]
        const max = _.maxBy(arr, 'value')
        return max
    }

    const getRecommendationText = (type: string) => {
        if (type == "be_vigilant") return localize.forecast.beVigilant;
        if (type == "no_risk_for_sailing") return localize.forecast.noRiskForSailing;
        if (type == "avoid_sailing") return localize.forecast.avoidSailing;
    }

    const getRecommendationIcon = (type: string, isEmer: boolean) => {
        if (isEmer) return images.forecast_no_sail;
        if (type == "be_vigilant") return images.forecast_warn_sail;
        if (type == "no_risk_for_sailing") return images.forecast_sail;
        if (type == "avoid_sailing") return images.forecast_no_sail;
    }


    return (
        <>
            <SafeAreaView style={bgPrimary}></SafeAreaView>
            <View style={DefaultStyles.containerWithNavBar}>
                <NavHeader
                    rightText={localize.home.hello + " " + firstName + "!"}
                />
                <View style={{ flex: 1, width: '100%' }}>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                        style={scrollViewWrap}
                    >
                        {
                            todayLatestAlert ?
                                <DashboardAlert
                                    content={todayLatestAlert?.payload[`${localize.getLanguage().toLowerCase()}_message`]}
                                    alertType={todayLatestAlert?.payload?.alertType}
                                    onPress={() => navigationService.navigate("Tab_alerts", {})}
                                /> : null
                        }

                        {
                            currentForecast ?
                                <DashboardWeatherW
                                    isEmergency={currentForecast?.isEmergency}
                                    recommendation={{
                                        text: currentForecast?.isEmergency ? currentForecast?.[`${localize.getLanguage().toLowerCase()}_emergencyMsg`] : getRecommendationText(currentForecast?.advice),
                                        type: currentForecast?.advice,
                                        icon: getRecommendationIcon(currentForecast?.advice, currentForecast?.isEmergency)
                                    }}
                                    weather={{
                                        generalWind: {
                                            generalWindMin: currentForecast?.generalWindMin,
                                            generalWindMax: currentForecast?.generalWindMax,
                                        },
                                        gustyWind: currentForecast?.gustyWind,
                                        thundershowerWind: currentForecast?.thundershowerWind,
                                        weatherCondition: currentForecast?.weatherCondition,
                                        seaCondition: currentForecast?.seaCondition,

                                        // rain: {
                                        //     text: getWeatherIconAndText('rain', currentForecast?.weatherCondition).text,
                                        //     icon: getWeatherIconAndText('rain', currentForecast?.weatherCondition).image,
                                        // },
                                        // sea: {
                                        //     text: getWeatherIconAndText('sea', currentForecast?.seaCondition).text,
                                        //     icon: getWeatherIconAndText('sea', currentForecast?.seaCondition).image
                                        // },
                                        // wind: {
                                        //     text: getWeatherIconAndText('wind', getMaxWind(currentForecast?.thundershowerWind, currentForecast?.gustyWind, currentForecast?.generalWindMax).type).text,
                                        //     speed: getMaxWind(currentForecast?.thundershowerWind, currentForecast?.gustyWind, currentForecast?.generalWindMax).value,
                                        //     icon: getWeatherIconAndText('wind', getMaxWind(currentForecast?.thundershowerWind, currentForecast?.gustyWind, currentForecast?.generalWindMax).type).image,
                                        //     unit: "kmph"
                                        // },
                                    }}
                                    locationTxt={zones?.find(e => e.id == currentForecast?.zoneId)?.[`${localize.getLanguage().toLowerCase()}_name`]}
                                    dateFrom={moment(weatherData?.fromTime)}
                                    dateTo={moment(weatherData?.toTime)}
                                    // onPressMore={() => { navigationService.navigate("ForcastScreen", {}) }}
                                    onPressOther={() => { navigationService.navigate("OtherZones", {}) }}
                                    onPress={() => { navigationService.navigate("OtherZones", {}) }}
                                />
                                :
                                null
                        }

                        {/* <GeneralQuickAccessWidget
                            title={localize.home.markMyRoute}
                            bgColor={colors.secondary}
                            description={localize.home?.markMyRouteDesc}
                            img={() => <Map />}
                            onPress={() => { navigationService.navigate("Tab_routes", {}) }}
                            disabled={!(isPremiumAccount || !isPremiumAccount && remainingFreeTrialDays > 0)}
                            freeTrialDays={isPremiumAccount ? 0 : remainingFreeTrialDays}
                            isPremiumAccount={isPremiumAccount}
                        /> */}

                        <GeneralQuickAccessWidget
                            title={localize.home.myLocation}
                            bgColor={colors.secondary_background}
                            description={localize.home?.myLocationDesc}
                            img={() => <Boat />}
                            onPress={() => { navigationService.navigate("RoutesMain", {}) }}
                            disabled={!(isPremiumAccount || !isPremiumAccount && remainingFreeTrialDays > 0)}
                            freeTrialDays={isPremiumAccount ? 0 : remainingFreeTrialDays}
                            isPremiumAccount={isPremiumAccount}
                        />

                        <GeneralQuickAccessWidget
                            title={localize.home.dofServices}
                            bgColor={colors.grey_1}
                            description={localize.home.dofServicesDesc}
                            img={() => <Links />}
                            onPress={() => { navigationService.navigate("DOFServices", {}) }}
                        />
                        <View style={{ flex: 1, flexDirection: 'row', marginVertical: scale(25) }}>
                        </View>
                    </ScrollView>
                </View>
                <CustomModal
                    visible={showWarningMsgModal}
                    hideCloseBtn={true}
                    onClose={() => setShowWarningMsgModal(false)}
                >
                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: 'red'}}>Warning!{'\n'}
                            You are crossing Sri Lankan fishing border.{'\n'}Return back immediately</Text>
                        <GeneralButton
                            text={'Dismiss'}
                            style={[{
                                flex: 0,
                                width: scale(110),
                                borderRadius: 23,
                                marginHorizontal: scale(15),
                                borderWidth: 1,
                                marginTop: 20,
                                borderColor: colors.primary_dark
                            }]}
                            textStyle={{ color: colors.primary_dark }}
                            backgroundColor={'transparent'}
                            disabled={false}
                            onPress={() => setShowWarningMsgModal(false)}
                        />
                    </View>
                </CustomModal>
            </View>
            <SafeAreaView style={bgPrimary}></SafeAreaView>
        </>
    );
};

export default HomeScreen;
