
import React, { FC } from 'react';
import {
    View,
    SafeAreaView,
    Text,
    StatusBar,
    Dimensions,
    ImageBackground,
    Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { SwitchLangStyles as sty } from '../styles/switch-lang.style';
import navigationService from '../../../navigation/navigationService';
import { DefaultStyles } from '../../../shared/styles/common-styles';
import { PrimaryBtn } from '../../../shared/components/buttons/primary-btn.component';
import RadioForm from '../../../shared/components/radio-button/radioButton';
import { fontScale, scale } from '../../../shared/utilities/scale';
import localize from '../../../localization/translations';
import { ENGLISH, SINHALA, TAMIL } from '../../../localization/localization.keys';
import colors from '../../../shared/styles/colors';
import images from '../../../assets';
import { SET_LANGUAGE } from '../../../store/types';

const windowWidth = Dimensions.get('window').width;

const { outermostContainer, bgPrimary } = DefaultStyles;
const radio_props = [
    { label: 'සිංහල', value: 0, key: SINHALA },
    { label: 'English', value: 1, key: ENGLISH },
    { label: 'தமிழ்', value: 2, key: TAMIL }
];

const SwitchLangScreen: FC = () => {
    const dispatch = useDispatch();
    const {selectedLang} = useSelector(({localization}: any) => localization)

    const persistSelectedLang = (value: any) => {
        const langKey = value === 0 ? SINHALA : value === 2 ? TAMIL : ENGLISH;
        dispatch({
            type: SET_LANGUAGE,
            payload: langKey,
        });
        localize.setLanguage(langKey);
    };

    const handleOnLangugaeSelect = async () => {
        navigationService.navigate('Onboarding', {})
    }

    return (
        <>
            <SafeAreaView style={bgPrimary}></SafeAreaView >
            <StatusBar backgroundColor={colors.primary_background} barStyle={'dark-content'} />
            <View style={[outermostContainer, sty.container]}>
                <View style={sty.bgContainerAbsolute}>
                    <ImageBackground source={images.switch_language_background} style={sty.bgImgStyles} />
                </View>
                <View style={[sty.appLogo]}>
                    <Image source={images.app_logo_org} style={[sty.logoStyle, { width: windowWidth / 2.5, height: windowWidth / 4, transform: [{ scale: 1.13 }] }]} />
                    <Text style={{ color: colors.grey_1, fontSize: fontScale(14), textAlign: 'center'}}>The National Service For Fishermen</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: windowWidth}}>
                        <Image source={images.app_logo_meteorology} style={[sty.logoStyle, { width: windowWidth / 3.5, height: windowWidth / 4, marginRight: scale(15)}]} />
                        <Image source={images.app_logo_fishery} style={[sty.logoStyle, { width: windowWidth / 3.5, height: windowWidth / 4}]} />
                    </View>
                </View>
                <View style={sty.langSwitchBoxWrapper}>
                    <View style={sty.langSwitchBoxInner}>
                        <Text style={sty.headingText}>{localize.switchLanguage.selectLanguage}</Text>
                        <RadioForm
                            radio_props={radio_props}
                            initial={radio_props.find(e => e.key == selectedLang)?.value}
                            labelStyle={sty.languageNameText}
                            animation={true}
                            buttonSize={scale(12)}
                            buttonOuterSize={scale(20)}
                            borderWidth={1}
                            onPress={(value: number) => {
                                persistSelectedLang(value);
                            }}
                        />

                        <View style={sty.nextBtnContainer}>
                            <PrimaryBtn
                                onPress={handleOnLangugaeSelect}
                                text={localize.switchLanguage.start}
                                lowerCase
                            />
                        </View>

                    </View>
                </View>
            </View>
            <SafeAreaView style={[bgPrimary]}></SafeAreaView >
        </>
    );
};


export default SwitchLangScreen;