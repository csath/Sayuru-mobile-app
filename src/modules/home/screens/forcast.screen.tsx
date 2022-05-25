
import React, { FC, useCallback, useEffect, useState } from 'react';
import {
    View,
    SafeAreaView,
    ScrollView,
    Text,
    Dimensions,
    StyleSheet,
    RefreshControl,
} from 'react-native';
import { DefaultStyles } from '../../../shared/styles/common-styles';
import { NavHeader } from '../../../shared/components/navigation-header/nav-header.component';
import { useSelector, useDispatch } from 'react-redux';
import { ForcastDetailedItem } from '../components/forcast-list-item';
import { HomeStyles } from '../styles/home.style';
import { getWeatherForcastAction } from '../../../store/actions/forecast-action';
import moment from "moment";
import colors from '../../../shared/styles/colors';
import localize from '../../../localization/translations';
import { getWeatherIconAndText } from '../utils/geticon';
import { scale } from '../../../shared/utilities/scale';

const { bgSeconday, bgWhite, scrollViewWrap } = DefaultStyles;
const windowHeight = Dimensions.get('window').height;
const ForcastScreen: FC = () => {

    const dispatch = useDispatch();

    const { latestLat, latestLon, forecastDaily: test } = useSelector((state: any) => ({
        latestLat: state.userProfile.latestLat,
        latestLon: state.userProfile.latestLon,
        forecastDaily: state.weather.forecastData.daily
    }));

    useEffect(() => {
        (async () => {
            dispatch(getWeatherForcastAction(latestLat, latestLon))
        })();
    }, []);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const forecastDaily = [
        {
            temp: {
                day: 1,
                eve: 23,
                max: 25,
                min: 17,
                morn: 21,
                night: 18
            },
            dt: 1622888163,
            windSpeedKMH: 20.5,
            weather: [{
                description: "Heavy rain",
                type: 'heavy_rain'
            }]
        },
        {
            temp: {
                day: 1,
                eve: 23,
                max: 25,
                min: 17,
                morn: 21,
                night: 18
            },
            dt: 1622888163,
            windSpeedKMH: 20.5,
            weather: [{
                description: "Thunder storm",
                type: 'thunder_storm'
            }]
        },
        {
            temp: {
                day: 1,
                eve: 23,
                max: 25,
                min: 17,
                morn: 21,
                night: 18
            },
            dt: 1622888163,
            windSpeedKMH: 20.5,
            weather: [{
                description: "Strong wind",
                type: 'windy'
            }]
        },
        {
            temp: {
                day: 1,
                eve: 23,
                max: 25,
                min: 17,
                morn: 21,
                night: 18
            },
            dt: 1622888163,
            windSpeedKMH: 20.5,
            weather: [{
                description: "Few clouds",
                type: 'clouds'
            }]
        }
    ]


    return (
        <>
            <SafeAreaView style={bgSeconday}></SafeAreaView>
            <View style={DefaultStyles.containerWithNavBar}>
                <NavHeader
                    title={localize.forecast.title}
                    darkContent={false}
                    bgColor={colors.secondary_background}
                />
                <View style={[{ flex: 1, width: '100%' }, bgSeconday]}>
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
                            !forecastDaily?.length > 0 ?
                                <Text style={styles.noData}>{localize.forecast.noData}</Text>
                                :
                                <>
                                    <ForcastDetailedItem
                                        isToday={true}
                                        temprature={forecastDaily?.[0]?.temp.day}
                                        windSpeed={forecastDaily?.[0]?.windSpeedKMH}
                                        windUnit={'kmph'}
                                        weatherIcon={getWeatherIconAndText('rain', forecastDaily?.[0]?.weather[0]?.type)}
                                        weatherStatus={forecastDaily?.[0]?.weather[0]?.description}
                                        date={moment.unix(forecastDaily?.[0]?.dt).format("dddd, DD")}
                                        tempReport={forecastDaily?.[0]?.temp}
                                    />

                                    {
                                        forecastDaily?.[1] ?
                                            <>
                                                <Text style={HomeStyles.next7daysTxt}>{localize.forecast.next7days}</Text>
                                                <ForcastDetailedItem
                                                    isToday={false}
                                                    isTomorrow={true}
                                                    temprature={forecastDaily?.[1]?.temp.day}
                                                    windSpeed={forecastDaily?.[1]?.windSpeedKMH}
                                                    windUnit={'kmph'}
                                                    weatherIcon={getWeatherIconAndText('rain', forecastDaily?.[1]?.weather[0]?.type)}
                                                    weatherStatus={forecastDaily?.[1]?.weather[0]?.description}
                                                    date={moment.unix(forecastDaily?.[1]?.dt).format("dddd, DD")}
                                                    tempReport={forecastDaily?.[1]?.temp}
                                                />
                                            </> : null
                                    }


                                    {forecastDaily?.length > 2 ?
                                        <>
                                            {
                                                forecastDaily.map((item, index) => (
                                                    index > 1 ?
                                                        <ForcastDetailedItem
                                                            isToday={false}
                                                            isTomorrow={false}
                                                            temprature={item?.temp.day}
                                                            windSpeed={item?.windSpeedKMH}
                                                            windUnit={'kmph'}
                                                            weatherIcon={getWeatherIconAndText('rain', item?.weather[0]?.type)}
                                                            weatherStatus={item?.weather[0]?.description}
                                                            date={moment.unix(item?.dt).format("dddd, DD")}
                                                            tempReport={item?.temp}
                                                            key={index}
                                                        />
                                                        :
                                                        null
                                                ))
                                            }
                                        </>
                                        :
                                        null
                                    }
                                </>
                        }
                        <View style={styles.footer}></View>
                    </ScrollView>
                </View>
            </View>
            <SafeAreaView style={bgSeconday}></SafeAreaView>
        </>
    );
};

export default ForcastScreen;

const styles = StyleSheet.create({
    noData: {
        marginTop: windowHeight / 2.5,
        textAlign: 'center',
        color: colors.white
    },
    footer: {
        height: scale(80)
    }
})