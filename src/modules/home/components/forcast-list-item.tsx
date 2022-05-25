import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import SVGWindWhite from '../../../assets/weather-icons/wind-white.svg';
import SVGgrayExpand from '../../../assets/weather-icons/expand-gray.svg';
import SVGgrayCollapse from '../../../assets/weather-icons/collapse-gray.svg';
import SVGwhiteExpand from '../../../assets/weather-icons/expand-white.svg';
import SVGwhiteCollapse from '../../../assets/weather-icons/collapse-white.svg';
import colors from '../../../shared/styles/colors';
import { fontScale, scale } from '../../../shared/utilities/scale';
import localize from '../../../localization/translations';

export interface Props {
    isToday: boolean,
    isTomorrow?: boolean,
    temprature: number,
    windSpeed: number,
    windUnit: string,
    weatherIcon: any;
    weatherStatus: string,
    date: string,
    tempReport: {
        day: number
        eve: number
        max: number
        min: number
        morn: number
        night: number
    }
}

const ForcastDetailedItem = (props: Props) => {
    const { windSpeed, windUnit, weatherStatus, weatherIcon, temprature, isToday, date, tempReport, isTomorrow } = props;
    const [isExpanded, setisExpanded] = useState(false);

    const Section2SingleItem = (props) => {
        const { title, temp } = props;
        return (
            <View style={styles.section2SingleItemOuter}>
                <Text style={[styles.sec2Text, isToday ? styles.whiteText : null]}>{title}</Text>
                <View style={{ flexDirection: "row" }}>
                    <Text style={[styles.windSpeedNum, isToday ? styles.whiteText : null]}>{Math.round(temp)}</Text>
                    <Text style={[styles.tempText, { marginTop: scale(10) }, styles.degreeText, isToday ? styles.whiteText : null]}>{'o'}</Text>
                    <Text style={[styles.windSpeedNum, !isToday ? styles.whiteText : null]}>{'C'}</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={[
            styles.outerWrap,
            isToday ? { backgroundColor: colors.secondary_background, borderColor: colors.white, borderWidth: 3 } : isTomorrow ? { backgroundColor: colors.primary_dark } : styles.normalDayForecastOverride
        ]}>
            <View style={styles.uppersection}>
                <View style={styles.dateWrap}>
                    {
                        isToday ?
                            <Text style={[styles.dayStringText, isToday ? styles.whiteText : null]}>{localize.forecast.today}</Text>
                            :
                            isTomorrow ?
                                <Text style={[styles.dayStringText, isToday ? styles.whiteText : null]}>{localize.forecast.tomorrow}</Text>
                                :
                                <Text style={styles.dayStringText}>{' '}</Text>
                    }
                    <Text style={[styles.dateText, isToday ? styles.todayDate : null]}>{date}</Text>
                </View>
                <View style={styles.rainWrap}>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-end" }}>
                        <Image
                            source={weatherIcon}
                            style={{
                                height: scale(55),
                                width: scale(55),
                            }}
                        />
                        <>
                            <Text style={[styles.tempText, isToday ? styles.whiteText : null]}>{Math.round(temprature)}</Text>
                            <Text style={[styles.tempText, styles.degreeText, isToday ? styles.whiteText : null]}>{'o'}</Text>
                        </>
                    </View>
                    <Text style={[styles.windStatusText, isToday ? styles.whiteText : null]}>{weatherStatus}</Text>
                </View>
                <View style={styles.windWrap}>
                    <View style={{ flexDirection: "column", }}>
                        {
                            isToday ?
                                <SVGWindWhite width={fontScale(37)} height={fontScale(22)} />
                                :
                                <SVGWindWhite width={fontScale(37)} height={fontScale(22)} />
                        }
                        <Text style={[styles.windSpeedNum, isToday ? styles.whiteText : null]}>
                            {Math.round(windSpeed)}
                            <Text style={styles.windSpeedUnit}>{' ' + windUnit}</Text>
                        </Text>
                    </View>
                </View>
                <View style={styles.expandBtnWrap}>
                    <TouchableOpacity
                        style={{ padding: scale(10), paddingRight: 0 }}
                        onPress={() => { setisExpanded(!isExpanded) }}
                    >
                        {
                            isToday ?
                                isExpanded ?
                                    <SVGgrayCollapse width={fontScale(23)} height={fontScale(23)} />
                                    :
                                    <SVGgrayExpand width={fontScale(23)} height={fontScale(23)} />
                                :
                                isExpanded ?
                                    <SVGwhiteCollapse width={fontScale(23)} height={fontScale(23)} />
                                    :
                                    <SVGwhiteExpand width={fontScale(23)} height={fontScale(23)} />
                        }
                    </TouchableOpacity>
                </View>
            </View>
            {
                isExpanded ?
                    <>
                        <View style={[styles.sectionDivider, isToday ? { borderBottomColor: colors.white } : null]} />
                        <View style={styles.lowerSection}>
                            <Section2SingleItem title={localize.forecast.morning} temp={tempReport.morn} />
                            <Section2SingleItem title={localize.forecast?.afternoon} temp={tempReport.max} />
                            <Section2SingleItem title={localize.forecast?.evening} temp={tempReport.eve} />
                            <Section2SingleItem title={localize.forecast?.night} temp={tempReport.night} />
                        </View>
                    </>
                    :
                    null
            }
        </View>
    );
};



const styles = StyleSheet.create({

    outerWrap: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 15,
        padding: scale(20),
        marginTop: scale(20)
    },
    normalDayForecastOverride: {
        marginTop: scale(1),
        paddingBottom: scale(10),
    },
    uppersection: {
        flex: 1,
        flexDirection: "row"
    },
    lowerSection: {
        flex: 1,
        flexDirection: "row"
    },
    dateWrap: {
        flex: 2.3,
        flexDirection: "column",
        justifyContent: "flex-start",
        marginBottom: scale(5)
    },
    tempText: {
        color: colors.white,
        fontSize: fontScale(13),
    },
    windSpeedNum: {
        color: colors.white,
        fontSize: fontScale(15),
        fontWeight: '500',
        marginTop: scale(10)
    },
    windSpeedUnit: {
        fontSize: fontScale(10)
    },
    windStatusText: {
        color: colors.white,
        fontSize: fontScale(13),
        marginTop: scale(5)
    },
    windWrap: {
        flex: 1.6,
        justifyContent: "flex-end",
        alignItems: "flex-end",
        marginRight: scale(5)
    },
    rainWrap: {
        flex: 2.3,
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "flex-end"
    },
    degreeText: {
        fontSize: fontScale(9),
        paddingBottom: fontScale(7)
    },
    whiteText: {
        color: colors.white
    },
    todayDate: {
        color: colors.white,
        fontSize: fontScale(17)
    },
    expandBtnWrap: {
        justifyContent: "center",
        alignItems: 'center'
    },
    dayStringText: {
        color: colors.white,
        fontSize: fontScale(15),
        fontWeight: "500"
    },
    dateText: {
        color: colors.white,
        fontSize: fontScale(15),
        marginTop: scale(10)
    },
    sectionDivider: {
        borderBottomWidth: 1,
        borderBottomColor: colors.white,
        marginVertical: scale(20)
    },
    section2SingleItemOuter: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center"
    },
    sec2Text: {
        fontSize: fontScale(15),
        color: colors.white
    }

});

export { ForcastDetailedItem };