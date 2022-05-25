import React, { Fragment } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Dimensions, Image, StatusBar } from 'react-native';

import colors from '../../../shared/styles/colors';
import { scale, fontScale } from '../../../shared/utilities/scale';
import { DefaultStyles } from '../../../shared/styles/common-styles';
import images from '../../../assets';
import BackIcon from '../../../assets/nav-header/back-icon-light.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';

export interface Props {
    title: string;
    children: any,
    centeredContent: any,
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LoginBackground = (props: Props) => {
    const { bgPrimary, bgWhite, outermostContainer } = DefaultStyles;
    return (
        <Fragment>
            <StatusBar backgroundColor={colors.primary_background} barStyle='dark-content' />
            <SafeAreaView style={bgPrimary}></SafeAreaView>
            <View style={outermostContainer}>
                <View style={[sty.section1Wrapper, props.centeredContent ? { flex: 2 } : {}]}>
                    {
                        props?.showBackButton && (
                            <View style={sty.backButtonContainer}>
                            <TouchableOpacity style={sty.touchArea} onPress={props?.onBackPressed}>
                                <BackIcon />
                            </TouchableOpacity>
                        </View>
                        )
                    }
                   

                    <View style={sty.logoContainer}>
                        <Image source={images.app_logo_with_dialog} style={sty.logoImage} resizeMode="contain" />
                        {props.title && <Text style={sty.title}>{props.title}</Text>}
                    </View>
                </View>
                <View style={[sty.section2Wrapper, props.centeredContent ? { justifyContent: 'flex-start', } : {}]}>
                    {props.children}
                </View>
            </View>
            <SafeAreaView style={bgWhite}></SafeAreaView>
        </Fragment >
    );
};

export { LoginBackground };


export const sty = StyleSheet.create({
    section1Wrapper: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
    },
    section2Wrapper: {
        flex: 5,
        justifyContent: 'flex-end',
    },
    logoContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        textAlign: 'center',
        color: colors.black,
        fontSize: fontScale(25),
        lineHeight: 33,
        fontWeight: '700',
        marginBottom: scale(40),
        letterSpacing: 0.5,
        marginTop: windowWidth / 20
    },
    logoImage: {
        width: windowHeight / 6,
        position: 'absolute',
    },
    backButtonContainer: {
        position: 'absolute',
        left: 30,
        top: 50,
        height: 80,
        width: 80
    },
    touchArea: {
        height: 80,
        width: 80
    },
});
