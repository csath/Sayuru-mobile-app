import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { scale, fontScale } from '../../utilities/scale';
import colors from '../../styles/colors';
import SVG_thunder_W from '../../../assets/weather-icons/thunderstorm-white.svg'
import SVG_alert_W from '../../../assets/weather-icons/alert-circle-white.svg'
import SVGArrowForward from '../../../assets/form-icons/arrow-forward.svg';
import localize from '../../../localization/translations';
import { HIGH, MEDIUM } from '../../../constants/alert-types';

export interface Props {
    content: string,
    alertType: number,
    onPress: any
}

const getBackgroundColor = (type: number) => {
    if (type == HIGH) return colors.red_1;
    if (type == MEDIUM) return colors.grey_1;
    return colors.grey_1;
}

const getIcon = (type: number) => {
    if (type == HIGH) return <SVG_thunder_W width={fontScale(30)} height={fontScale(30)} />
    if (type == MEDIUM) return <SVG_alert_W width={fontScale(31)} height={fontScale(31)} />
    return <SVG_alert_W width={fontScale(31)} height={fontScale(31)} />
}

const DashboardAlert = (props: Props) => {
    const { content, onPress, alertType } = props;
    return (
        <TouchableOpacity style={[styles.outerWrapper, { backgroundColor: getBackgroundColor(alertType)}]} onPress={onPress}>
            <View style={styles.contentAndIconWrap}>
                {getIcon(alertType)}
                <Text style={styles.messageText}>{content}</Text>
            </View>
            <View style={styles.bottomActionWrap}>
                <SVGArrowForward width={fontScale(8)} height={fontScale(13)} />
                <Text style={styles.moreInfoText}>{localize.home.moreInfo}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    outerWrapper: {
        backgroundColor: colors.red_DE0E19,
        borderRadius: 10,
        flex: 1,
        flexDirection: "column",
        padding: scale(17),
        paddingTop: scale(20)
    },
    contentAndIconWrap: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center"
    },
    messageText: {
        flexShrink: 1,
        paddingLeft: scale(15),
        color: colors.white,
        fontSize: fontScale(16)
    },
    bottomActionWrap: {
        flex: 1,
        flexDirection: "row-reverse",
        alignItems: "center",
        marginTop: scale(7)
    },
    moreInfoText: {
        flexShrink: 1,
        paddingHorizontal: scale(10),
        color: colors.white,
        fontSize: fontScale(14),
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontWeight: '700',
    }

});

export { DashboardAlert };