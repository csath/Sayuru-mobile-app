import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { fontScale, scale } from '../../utilities/scale';
import colors from '../../styles/colors';
import { PillBtn } from '../buttons/pill-btn.component';
import localize from '../../../localization/translations';

export interface Props {
    title: string,
    buttonText: string,
    description: string,
    bgColor: string
    onPress: () => void;
    img: any,
    disabled: boolean,
    freeTrialDays: number,
}

const GeneralQuickAccessWidget = (props: Props) => {
    const { buttonText = localize.home.moreInfo, title, description, bgColor = colors.secondary, img = () => <View />, onPress, disabled, freeTrialDays, isPremiumAccount = false } = props;
    return (
        <TouchableOpacity onPress={onPress} disabled={disabled}>
        <View style={[styles.imageWrap, { backgroundColor: bgColor }]}>
            <View style={styles.textContainer}>
                <Text style={styles.titleSty}>{title}</Text>
                <Text style={styles.titleDesc}>{description}</Text>
                {!disabled && freeTrialDays != undefined && !isPremiumAccount && <Text style={styles.trialDesc}>Free trial ends in {freeTrialDays} day(s)</Text>}
            </View>
            <View style={styles.buttonContainer}>
                <View style={styles.image}>{img()}</View>
                <PillBtn
                    onPress={onPress}
                    text={buttonText}
                    type="light"
                    disabled={disabled}
                />
            </View>
        </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    imageWrap: {
        flex: 1,
        flexDirection: "row",
        marginTop: scale(15),
        borderRadius: 15,
        minHeight: scale(130),
        padding: scale(15),
    },
    textContainer: {
        flex: 2,
        flexDirection: 'column',
        paddingRight: scale(15),
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    titleSty: {
        color: colors.white,
        fontSize: fontScale(18),
        fontWeight: "500"
    },
    titleDesc: {
        color: colors.white,
        fontSize: fontScale(12),
        marginTop: scale(10),
        lineHeight: 17,
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: scale(20),
        marginTop: scale(10),
    },
    trialDesc: {
        color: colors.yellow_1,
        fontSize: fontScale(15),
        fontWeight: 'bold',
        marginTop: scale(30),
        lineHeight: 17,
    }
});

export { GeneralQuickAccessWidget };