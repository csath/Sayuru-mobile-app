import React from 'react';
import moment from 'moment';
import { Text, View, StyleSheet, Image } from 'react-native';

import { scale, fontScale } from '../../utilities/scale';
import colors from '../../styles/colors';
import { PillBtn } from '../buttons/pill-btn.component';
import localize from '../../../localization/translations';
import LocationSVG from '../../../assets/dashboard/location-pin.svg';
import { getWeatherIconAndText } from '../../../modules/home/utils/geticon';
import { TouchableOpacity } from 'react-native-gesture-handler';

export interface Props {
    weather: {
        // sea: {
        //     text: string,
        //     icon: any
        // },
        // wind: {
        //     text: string,
        //     speed: number,
        //     icon: any,
        //     unit: string
        // },
        // rain: {
        //     text: string,
        //     icon: any,
        // },
        generalWind: {
            generalWindMin: number,
            generalWindMax: number,
        },
        gustyWind: number,
        thundershowerWind: number,
        weatherCondition: string,
        seaCondition: string,
    },
    recommendation?: {
        text: string,
        type: string,
        icon: any
    },
    date?: any,
    locationTxt: string,
    onPressOther?: () => void,
    onPressMore?: () => void,
    viewOnlyMode?: boolean,
    isEmergency: boolean,
}

const getRecommendationBgColor = (type) => {
    switch (type) {
        case 'be_vigilant':
            return colors.yellow_1
        case 'avoid_sailing':
            return colors.red_1
        case 'no_risk_for_sailing':
            return colors.green_1
        default:
            return colors.red_1
    }
}

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

const renderIconWithInfo = (type = "", data, i) => {
    switch (type) {
        case "seaCondition":
            return (
                <View style={styles.tempWrap} key={`seaCondition${i}`}>
                    <Image
                        source={getWeatherIconAndText('sea', data).image}
                        style={{
                            height: scale(55),
                            width: scale(55),
                            resizeMode: 'contain'
                        }}
                    />
                    <Text style={styles.windStatusText}>{getWeatherIconAndText('sea', data).text}</Text>
                    <Text style={styles.windSpeedNum}></Text>
                </View>
            );
        case "gustyWind":
            return (
                <View style={styles.tempWrap} key={`gustyWind${i}`}>
                    <Image
                        source={getWeatherIconAndText('wind', 'gustyWind').image}
                        style={{
                            height: scale(55),
                            width: scale(55),
                            resizeMode: 'contain'
                        }}
                    />
                    <Text style={styles.windSpeedNum}>{data} kmph</Text>
                    <Text style={styles.windStatusText}>{getWeatherIconAndText('wind', 'gustyWind').text}</Text>
                </View>
            );
        case "weatherCondition":
            return (
                <View style={styles.tempWrap} key={`weatherCondition${i}`}>
                    <Image
                        source={getWeatherIconAndText('rain', data).image}
                        style={{
                            height: scale(55),
                            width: scale(55),
                            resizeMode: 'contain'
                        }}
                    />
                    <Text style={styles.windStatusText}>{getWeatherIconAndText('rain', data).text}</Text>
                    <Text style={styles.windSpeedNum}></Text>
                </View>
            );

        case "generalWind":
            return (
                <View style={styles.windWrap} key={`generalWind${i}`}>
                    <Image
                        source={getWeatherIconAndText('wind', 'general').image}
                        style={{
                            height: scale(55),
                            width: scale(55),
                            resizeMode: 'contain'
                        }}
                    />
                    <Text style={styles.windSpeedNum}>{data?.generalWindMin?.toFixed(1)} <Text style={styles.windSpeedUnit}>kmph</Text> - {data?.generalWindMax?.toFixed(1)} <Text style={styles.windSpeedUnit}>kmph</Text></Text>
                    <Text style={styles.windStatusText}>{getWeatherIconAndText('wind', 'general').text}</Text>
                </View>
            );

        case "thundershowerWind":
            return (
                <View style={styles.tempWrap} key={`thundershowerWind${i}`}>
                    <Image
                        source={getWeatherIconAndText('wind', 'thundershowerWind').image}
                        style={{
                            height: scale(55),
                            width: scale(55),
                            resizeMode: 'contain'
                        }}
                    />
                    <Text style={styles.windSpeedNum}>{data} kmph</Text>
                    <Text style={styles.windStatusText}>{getWeatherIconAndText('wind', 'thundershowerWind').text}</Text>
                </View>
            );
    }

}

const DashboardWeatherW = (props: Props) => {
    const { onPressOther, onPress, onPressMore, weather, dateFrom, dateTo, locationTxt, recommendation, viewOnlyMode, isEmergency } = props;
    const allIcons = ['seaCondition', weather.gustyWind > 0 ? 'gustyWind': null, 'weatherCondition', weather.generalWind.generalWindMax > 0 && weather.generalWind.generalWindMin > 0 ? 'generalWind' : null, weather.thundershowerWind > 0 ? 'thundershowerWind' : null].filter(e => e != null);
    let iconRow1 = allIcons;
    let iconRow2: any = [];
    if (allIcons.length > 2 && allIcons.length < 4) {
        iconRow1 = allIcons
        iconRow2 = []
    }
    else if (allIcons.length > 2 && allIcons.length < 5) {
        iconRow1 = allIcons.slice(0, 2)
        iconRow2 = allIcons.slice(2)
    }
    else if (allIcons.length > 2) {
        iconRow1 = allIcons.slice(0, 3)
        iconRow2 = allIcons.slice(3)
    }


    return (
        <TouchableOpacity onPress={onPress} activeOpacity={viewOnlyMode ? 1 : 0.3} style={[styles.outerWrap, viewOnlyMode ? { backgroundColor: colors.primary_dark, paddingTop: scale(20) } : {}]}>
            {
                !viewOnlyMode ?
                    <View style={styles.firstLineWrapper}>
                        <Text style={styles.titleSty}>{localize.home.todayWeather}</Text>
                        {
                            localize.getLanguage() === 'en' ?
                                <Text style={styles.subTitleSty}>From {moment(dateFrom).format('MMM DD,YYYY, hh:mm a')}{'\n'} to {moment(dateTo).format('MMM DD,YYYY, hh:mm a')}</Text>
                                : localize.getLanguage() === 'si' ?
                                    <Text style={styles.subTitleSty}>{moment(dateFrom).format('MMM DD,YYYY, hh:mm a')} සිට {'\n'}{moment(dateTo).format('MMM DD,YYYY, hh:mm a')} දක්වා</Text>
                                    : <Text style={styles.subTitleSty}>{moment(dateFrom).format('MMM DD,YYYY, hh:mm a')} முதல் {'\n'}{moment(dateTo).format('MMM DD,YYYY, hh:mm a')} வரை</Text>
                        }

                    </View> : null
            }
            <View style={styles.firstLineWrapper}>
                <LocationSVG />
                <Text style={styles.locationText}>{locationTxt}</Text>
            </View>
            {
                !isEmergency &&
                <View style={styles.inforWrap}>
                    {
                        iconRow1.map((r, i) => {
                            return renderIconWithInfo(r, weather[r], i)
                        })
                    }
                    {/* {renderIconWithInfo('seaCondition', weather.seaCondition)}
                    {renderIconWithInfo('gustyWind', weather.gustyWind)}
                    {renderIconWithInfo('weatherCondition', weather.weatherCondition)}
                    {renderIconWithInfo('generalWind', weather.generalWind)}
                    {renderIconWithInfo('thundershowerWind', weather.thundershowerWind)} */}
                </View>
            }
            {
                !isEmergency && iconRow2.length > 0 &&
                <View style={[styles.inforWrap,]}>
                   {
                        iconRow2.map((r, i) => {
                            return renderIconWithInfo(r, weather[r], i)
                        })
                    }
                </View>
            }
            {
                !viewOnlyMode ?
                    <>
                        <View style={[styles.statusIndidator, { flexDirection: 'row', backgroundColor: isEmergency ? getRecommendationBgColor("avoid_sailing") : getRecommendationBgColor(recommendation?.type), marginTop: isEmergency ? 15 : 0 }]}>
                            {recommendation?.icon && <Image
                                source={recommendation?.icon}
                                style={{
                                    height: scale(40),
                                    width: scale(40),
                                    resizeMode: 'contain',
                                    marginRight: 5,
                                }}
                            />}
                            <Text style={styles.recommendationtext}>{recommendation?.text}</Text>
                        </View>
                        <View style={styles.dateButtonContainer}>
                            {
                                onPressOther &&
                                <View style={styles.pillButton}>
                                    <PillBtn
                                        onPress={onPressOther}
                                        text={localize.home.otherInfo}
                                        type="light"
                                        height={40}
                                    />
                                </View>
                            }
                            {
                                onPressMore &&
                                <View style={styles.pillButton}>
                                    <PillBtn
                                        onPress={onPressMore}
                                        text={localize.home.moreInfo}
                                        type="light"
                                        height={scale(40)}
                                    />
                                </View>
                            }

                        </View>
                    </>
                    : null
            }
            {
                viewOnlyMode && isEmergency &&
                <View style={[styles.statusIndidator, { backgroundColor: isEmergency ? getRecommendationBgColor("avoid_sailing") : getRecommendationBgColor(recommendation?.type) }]}>
                    <Text style={styles.recommendationtext}>{recommendation?.text}</Text>
                </View>
            }

        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    outerWrap: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: colors.secondary_background,
        borderRadius: 15,
        padding: scale(15),
        marginTop: scale(15)
    },
    firstLineWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    titleSty: {
        flex: 1,
        color: colors.white,
        fontSize: fontScale(18),
        fontWeight: "700",
        lineHeight: 48,
    },
    subTitleSty: {
        flex: 1,
        color: colors.white,
        fontSize: fontScale(12),
        textAlign: 'right',
        opacity: 0.6,
        letterSpacing: 0.17
    },
    locationText: {
        color: colors.white,
        fontSize: fontScale(14),
        fontWeight: "700",
        lineHeight: 19,
        marginLeft: scale(8),
    },
    inforWrap: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: scale(15),
    },
    tempWrap: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: 'center',
        // marginBottom: scale(5)
    },
    tempText: {
        color: colors.white,
        fontSize: fontScale(32),
        fontWeight: '300'
    },
    windSpeedNum: {
        color: colors.white,
        fontSize: fontScale(14),
        fontWeight: '700',
        marginTop: scale(0),
        textAlign: 'center',
    },
    windSpeedUnit: {
        color: colors.white,
        fontSize: fontScale(10)
    },
    windStatusText: {
        color: colors.white,
        fontSize: fontScale(13),
        marginTop: scale(0),
        textAlign: 'center',
    },
    windWrap: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    rainWrap: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: 'flex-start',
    },
    dateButtonContainer: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-around",
        marginTop: scale(20)
    },
    pillButton: {
        flex: 1,
        marginHorizontal: scale(15),
    },
    statusIndidator: {
        minHeight: scale(30),
        padding: scale(10),
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: scale(-15)
    },
    recommendationtext: {
        textTransform: 'uppercase',
        color: colors.white,
        fontWeight: '700',
        fontSize: fontScale(15),
        textAlign: 'center',
    },
    degreetext: {
        fontSize: fontScale(9),
        marginTop: 0,
        color: colors.white
    },
});

export { DashboardWeatherW };