import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { scale, fontScale } from '../../../shared/utilities/scale';
import colors from '../../../shared/styles/colors';
import moment from "moment";
import { LOW, MEDIUM } from '../../../constants/alert-types';
import SVG_alert_W from '../../../assets/weather-icons/alert-circle-white.svg'
import SVG_alert_D from '../../../assets/weather-icons/alert-circle-dark.svg'
import SVG_thunder_W from '../../../assets/weather-icons/thunderstorm-white.svg'
import SVG_thunder_D from '../../../assets/weather-icons/thunderstorm-dark.svg'
import localize from '../../../localization/translations';

export interface Props {
    itemData: any,
    theme: "light-text" | "dark-text",
    boldText: boolean,
    isLast: boolean,
}

export const SingleListItem = (props: Props) => {
    const { itemData, theme, boldText, isLast } = props;

    return (
        <>
            <View style={[sty.outerWrapper, theme === "dark-text" ? { marginBottom: scale(15) } : null]}>
                <View style={sty.timeSection}>
                    <Text style={[theme === "dark-text" ? sty.darkText : sty.lightText, boldText ? sty.bold : {}]}>{moment(itemData.timeStamp).format("hh:mm A")}</Text>
                </View>
                <View style={sty.iconSection}>
                    {
                        theme === "dark-text" ?
                            getIconDark(itemData.payload.alertType) :
                            getIconLight(itemData.payload.alertType)
                    }
                </View>

                <View style={sty.descriptionSection}>
                    <Text style={theme === "dark-text" ? sty.darkText : sty.lightText}>{getDescription(itemData.payload)}</Text>
                </View>
            </View>
            <View style={{ backgroundColor: theme === "dark-text" ? '#a8a8a8' : 'white', height: isLast ? 0 : 1, marginBottom: scale(15) }}></View>
        </>
    );
};

const getDescription = (payload: object) => {
    const lang = localize.getLanguage()

    if (lang == 'en') return payload?.en_message;
    if (lang == 'si') return payload?.si_message;
    if (lang == 'ta') return payload?.ta_message;
    return ""
}

const getIconLight = (alertType: number) => {
    return alertType === MEDIUM ?
        // <Image source={images.forecast_warn_sail} style={{ height: 35, width: 35 }} />
        <SVG_alert_W width={fontScale(21)} height={fontScale(21)} />
        :
        alertType === LOW ?
            // <Image source={images.forecast_no_sail} style={{ height: 35, width: 35 }} />
            <SVG_alert_W width={fontScale(21)} height={fontScale(21)} />
            : <SVG_thunder_W width={fontScale(23)} height={fontScale(23)} />
}

const getIconDark = (alertType: number) => {
    return alertType === MEDIUM ?
        // <Image source={images.forecast_warn_sail} style={{ height: 35, width: 35 }} />
        <SVG_alert_D width={fontScale(21)} height={fontScale(21)} />
        :
        alertType === LOW ?
            // <Image source={images.forecast_no_sail} style={{ height: 35, width: 35 }} />
            <SVG_alert_D width={fontScale(21)} height={fontScale(21)} />
            : <SVG_thunder_D width={fontScale(23)} height={fontScale(23)} />
}

const sty = StyleSheet.create({
    outerWrapper: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: scale(15)
    },
    timeSection: {
        flex: 2
    },
    iconSection: {
        flex: 1.5,
        alignItems: "center"
    },
    descriptionSection: {
        flex: 6
    },
    lightText: {
        color: colors.white,
        fontSize: fontScale(14)
    },
    darkText: {
        color: colors.grey_1,
        fontSize: fontScale(14)
    },
    bold: {
        fontWeight: '700',
        fontSize: fontScale(16),
    }
});