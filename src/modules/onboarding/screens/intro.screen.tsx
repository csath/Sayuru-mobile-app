
import React, { FC, useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Image,
    Dimensions,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { useDispatch, useSelector } from 'react-redux';

import { OnboardingIntroStyles as sty } from '../styles/intro.style';
import navigationService from '../../../navigation/navigationService';
import localize from '../../../localization/translations';
import { PrimaryBtn } from '../../../shared/components/buttons/primary-btn.component';
import images from '../../../assets';
import { scale } from '../../../shared/utilities/scale';
import { UPDATE_FIRST_TIME_USER_FLAG } from '../../../store/types';
import { Icon } from '../../../shared/components/sayuru-customized';
import colors from '../../../shared/styles/colors';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const IntroScreen: FC = () => {
    const pages = [localize.onboarding.description1, localize.onboarding.description2, localize.onboarding.description3];
    const dispatch = useDispatch();
    useSelector(({localization}: any) => localization);
    const scrollRef = useRef();
    
    const [sliderIndex, setIndex] = useState(0);

    const handleGetStarted = () => {
        dispatch({
            type: UPDATE_FIRST_TIME_USER_FLAG,
            payload: false,
        })

        navigationService.navigate('VerifyMobileNum');
    }

    const _renderItem = ({ item, index }) => {
        return (
            <View style={sty.textWrapper} key={index}>
                <Text style={sty.textStyle}>{item}</Text>
            </View>
        );
    }

    return (
        <View style={sty.container}>
            <Image source={images.onboard_background} style={sty.bgImage} resizeMode="stretch" />
            <SafeAreaView ></SafeAreaView>
            <View style={sty.logoMargin}>
                <Image source={images.app_logo_white} resizeMode={'contain'} style={{ width: windowHeight / 4.5, height: windowHeight / 7 }} />
            </View>
            <Carousel
                ref={scrollRef}
                data={pages}
                renderItem={_renderItem}
                sliderWidth={windowWidth}
                itemWidth={windowWidth}
                centerContent={true}
                onSnapToItem={(i) => setIndex(i)}
            />
            <View style={{ flex: 1, justifyContent: "flex-start" }}>
                <View style={sty.btnArrayContainer}>
                    {sliderIndex != 0 && <Icon type="antdesign" name='left' size={14} color={colors.white} onPress={() => scrollRef.current?.snapToPrev()}  />}
                    {pages.map((item, ind, key) => {
                        return (
                            <TouchableOpacity
                                style={sty.onboardingProgressBtn}
                                key={ind}
                            >
                                <View style={ind === sliderIndex ? [sty.innerbtnIndicator, { marginRight: scale(12) }] : [sty.innerbtnIndicator, sty.innerbtnIndicatorSelected]}></View>
                            </TouchableOpacity>
                        );
                    })}
                    <TouchableOpacity style={sty.onboardingProgressBtn}>
                        <View style={[sty.innerbtnIndicator, sty.innerbtnIndicatorSelected]}></View>
                    </TouchableOpacity>
                    {(sliderIndex != pages.length - 1) && <Icon type="antdesign" name='right' size={14} color={colors.white} onPress={() => scrollRef?.current?.snapToNext()} />}
                </View>

                <View style={sty.getStartedBtnWrap}>
                    <PrimaryBtn
                        onPress={() => { handleGetStarted() }}
                        text={localize.onboarding.skip}
                        type={"secondary"}
                        lowerCase
                        marginTop={1}
                    />
                </View>
            </View>
        </View>
    );
};

export default IntroScreen;
