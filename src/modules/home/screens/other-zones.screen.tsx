
import React, { FC, useCallback, useState } from 'react';
import {
    View,
    SafeAreaView,
    ScrollView,
    Text,
    Dimensions,
    StyleSheet,
    RefreshControl,
} from 'react-native';
import _ from 'lodash';
import Geolocation from 'react-native-geolocation-service';
import { DefaultStyles } from '../../../shared/styles/common-styles';
import { NavHeader } from '../../../shared/components/navigation-header/nav-header.component';
import colors from '../../../shared/styles/colors';
import localize from '../../../localization/translations';
import { getWeatherIconAndText } from '../utils/geticon';
import { DashboardWeatherW } from '../../../shared/components/widgets/dashboard-weather';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { fontScale, scale } from '../../../shared/utilities/scale';
import * as SERVICES from '../../../services/all.service';
import * as SETTINGS from '../../../shared/utilities/fetch-locations/location-settings';
import { SET_WEATHER_DATA } from '../../../store/types';

const { bgSeconday, scrollViewWrap } = DefaultStyles;
const windowHeight = Dimensions.get('window').height;

const OtherZonesScreen: FC = () => {

    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useDispatch();
    const { otherZones, otherZonesDate, weatherData } = useSelector(({ weather }: any) => weather);
    const { zones } = useSelector(({ data }: any) => data);
    const { userCurrentLocation } = useSelector(({ route }: any) => route);
    let zoneData = [];
    if (moment(weatherData?.toTime).isAfter(moment())) {
        const arr = [...weatherData?.predictions]
        arr.shift()
        zoneData = weatherData?.predictions && weatherData?.predictions.length > 0 ? arr : []
    }

    const onRefresh = useCallback(() => {
        fetchData()
    }, []);

    const fetchData = () => {
        setRefreshing(true);
        try {
            // fetch geo location
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

        }
        catch (e) {
            setRefreshing(false);
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

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

    return (
        <>
            <SafeAreaView style={bgSeconday}></SafeAreaView>
            <View style={DefaultStyles.containerWithNavBar}>
                <NavHeader
                    title={localize.otherZones.title}
                    darkContent={false}
                    bgColor={colors.secondary_background}
                />
                <View style={[{ flex: 1, width: '100%' }, bgSeconday]}>
                    {zoneData?.length > 0 &&
                        <View style={{ height: 40, justifyContent: 'center', backgroundColor: colors.grey_1, marginTop: 3 }}>
                            {
                                localize.getLanguage() === 'en' ?
                                    <Text style={styles.topBanner}>From {moment(weatherData?.fromTime).format('MMM DD, YYYY, hh:mm a')} to {moment(weatherData?.toTime).format('MMM DD, YYYY, hh:mm a')}</Text>
                                    : localize.getLanguage() === 'si' ?
                                        <Text style={styles.topBanner}>{moment(weatherData?.fromTime).format('MMM DD, YYYY, hh:mm a')} සිට {moment(weatherData?.toTime).format('MMM DD, YYYY, hh:mm a')} දක්වා</Text>
                                        : <Text style={styles.topBanner}>{moment(weatherData?.fromTime).format('MMM DD, YYYY, hh:mm a')} முதல் {moment(weatherData?.toTime).format('MMM DD, YYYY, hh:mm a')} வரை</Text>
                            }
                        </View>
                    }
                    <ScrollView
                        style={[scrollViewWrap, { paddingTop: scale(10) }]}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    >
                        {
                            !zoneData?.length > 0 ?
                                <Text style={styles.noData}>{localize.otherZones.noData}</Text>
                                :
                                zoneData?.map((currentForecast: object) => (
                                    <DashboardWeatherW
                                        viewOnlyMode={true}
                                        recommendation={{
                                            text: currentForecast?.isEmergency ? currentForecast?.[`${localize.getLanguage().toLowerCase()}_emergencyMsg`] : getRecommendationText(currentForecast?.advice),
                                            type: currentForecast?.advice,
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
                                            // rain: {
                                            //     text: getWeatherIconAndText('rain', currentForecast?.weatherCondition).text,
                                            //     icon: getWeatherIconAndText('rain', currentForecast?.weatherCondition).image,
                                            // }
                                        }}
                                        locationTxt={zones?.find(e => e.id == currentForecast?.zoneId)?.[`${localize.getLanguage().toLowerCase()}_name`]}
                                        dateFrom={moment(weatherData?.fromTime)}
                                        dateTo={moment(weatherData?.toTime)}
                                    />
                                ))
                        }
                        <View style={styles.footer}></View>
                    </ScrollView>
                </View>
            </View>
            <SafeAreaView style={bgSeconday}></SafeAreaView>
        </>
    );
};

export default OtherZonesScreen;

const styles = StyleSheet.create({
    noData: {
        marginTop: windowHeight / 2.5,
        textAlign: 'center',
        color: colors.white
    },
    footer: {
        height: scale(80)
    },
    topBanner: {
        textAlign: 'center',
        color: colors.white,
        fontSize: fontScale(12)
    }
})