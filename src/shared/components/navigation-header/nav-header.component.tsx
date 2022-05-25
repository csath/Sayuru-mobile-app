import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

import { scale, fontScale } from '../../utilities/scale';
import colors from '../../styles/colors';
import SVGGoBackLight from '../../../assets/nav-header/back-icon-light';
import SVGGoBackDark from '../../../assets/nav-header/back-icon-dark';
import SVGSOS from '../../../assets/nav-header/sos-icon.svg';
import SVGSOSLight from '../../../assets/nav-header/sos-icon-light.svg';
import navigationService from '../../../navigation/navigationService';
import { openSMSapp } from '../../utilities/openSMS';
import CustomStatusBar from '../statusbar/statusbar';

export interface Props {
    onPressSOSBtn?: () => void;
    onPressBackBtn?: () => void;
    darkContent?: boolean,
    showBackButton?: boolean,
    title?: string,
    rightText?: string,
    bgColor?: string,
}

const NavHeader = (props: Props) => {
    const { onPressSOSBtn, onPressBackBtn, darkContent = true, showBackButton = true, title, rightText, bgColor } = props;
    return (
        <>
            <CustomStatusBar backgroundColor={bgColor} barStyle={darkContent ? 'dark-content' : 'light-content'}/>
            <View style={[styles.outerWrapper, { backgroundColor: bgColor }]}>
                <TouchableOpacity
                    onPress={() => onPressSOSBtn ? onPressSOSBtn?.() : openSMSapp()}
                    style={styles.sosBtnTouch}
                >
                    {
                        darkContent ?
                            <SVGSOS /> :
                            <SVGSOSLight />
                    }
                </TouchableOpacity>
                <Text style={[styles.headerText, !darkContent ? { color: colors.white } : { color: colors.black }]}>{title}</Text>
                {!rightText && showBackButton ?
                    <TouchableOpacity
                        onPress={() => onPressBackBtn ? onPressBackBtn?.() : navigationService.goBack()}
                        style={styles.backBtnTouch}
                    >
                        {
                            !darkContent ?
                                <SVGGoBackLight width={fontScale(23)} height={fontScale(15)} /> :
                                <SVGGoBackDark width={fontScale(23)} height={fontScale(15)} />
                        }

                    </TouchableOpacity>
                    :
                    null
                }
                {!rightText && !showBackButton ? <View style={styles.backBtnTouch} /> : null}
                {
                    rightText ?
                        <Text style={[styles.headerRightText, { color: colors.grey_1 }]}>{rightText}</Text>
                        : null
                }
            </View >
        </>
    );
};

const styles = StyleSheet.create({
    outerWrapper: {
        flex: 0,
        flexDirection: 'row',
        alignItems: "center",
        height: scale(72)
    },
    backBtnTouch: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginLeft: scale(-15),
        marginRight: scale(15),
        flexDirection: "row"
    },
    headerText: {
        flex: 1,
        fontSize: fontScale(20),
        textAlign: 'center',
        marginLeft: scale(-30),
        marginRight: scale(-30),
    },
    headerRightText: {
        flex: 1,
        fontSize: fontScale(16),
        textAlign: 'right',
        marginRight: scale(15),
        marginLeft: scale(-15),
        justifyContent: 'center',
        alignItems: 'flex-end',
        flexDirection: 'row',
    },
    sosBtnTouch: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginLeft: scale(15),
        marginRight: scale(-15),
    }
});

export { NavHeader };