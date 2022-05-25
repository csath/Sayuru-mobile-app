import React, { FC, useEffect, useState } from 'react';
import {
    View,
    SafeAreaView,
    Alert,
    ScrollView,
    Linking,
    Dimensions,
    Image,
    RefreshControl,
    Modal,
    Text,
    ActivityIndicator,
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useDispatch, useSelector } from 'react-redux';
import WebView from 'react-native-webview';

import { DefaultStyles } from '../../../shared/styles/common-styles';
import { NavHeader } from '../../../shared/components/navigation-header/nav-header.component';
import { DOFServicesStyles as sty } from '../styles/dof-services.style';
import { PrimaryBtn } from '../../../shared/components/buttons/primary-btn.component';
import localize from '../../../localization/translations';
import colors from '../../../shared/styles/colors';
import SVGGoBackDark from '../../../assets/nav-header/back-icon-dark.svg';
import { SET_DOF_DATA } from '../../../store/types';
import customImages from '../../../assets';
import { fontScale, scale } from '../../../shared/utilities/scale';
import * as SERVICES from '../../../services/all.service';

const { bgWhite } = DefaultStyles;

const windowWidth = Dimensions.get('window').width;

const CustomImageComp = ({ item }) => {
    const [loading, setLoading] = useState(true);
    const [hasError, setError] = useState(false);
    const imageLoaded = () => { setLoading(false); setError(false); }
    const imageLoadedError = () => { setLoading(false); setError(true); }
    return (
        <>
            <Image
                key={item}
                style={sty.image}
                source={{
                    uri: item
                }}
                onLoad={imageLoaded}
                onError={imageLoadedError}
            />
            {
                hasError &&
                <View style={{ position: 'absolute' }}>
                    <Image
                        source={customImages.placeholder_image}
                        style={sty.image}
                    />
                </View>
            }
            <ActivityIndicator
                style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: windowWidth / 7 }}
                color={colors.grey_3C3C3C}
                size="large"
                animating={loading}
            />
        </>
    )
}

const DOFServicesScreen: FC = () => {
    const [activeindex, setActiveIndex] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const buttonColorArr = [colors.primary_dark, colors.secondary, colors.disabledGrey]
    const { images, buttonLinks, webViewURL } = useSelector(({ dof }: any) => dof)

    const dispatch = useDispatch()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setRefreshing(true);
        SERVICES.getDOFInfo()?.then(res => {
            if (res?.data) {
                dispatch({
                    type: SET_DOF_DATA,
                    payload: res?.data?.data,
                })
            }
            setRefreshing(false);
        }).catch(() => {
            setRefreshing(false);
        })
    }

    const onRefresh = React.useCallback(async () => {
        fetchData()
    }, []);

    const updateActiveIndex = () => {
        if (activeindex == images.length - 1) {
            setActiveIndex(0);
        }
        else if (activeindex < images.length - 1) {
            setActiveIndex(activeindex + 1);
        }
    }

    const openLink = async (url) => {
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(`Cannot open URL`, url);
        }
    }



    const renderItem = ({ item }) => {
        return (
            <View style={sty.slideItemWrapper}>
                <CustomImageComp
                    item={item}
                />
            </View>
        );
    }

    const pagination = () => {
        return (
            <Pagination
                dotsLength={images.length}
                activeDotIndex={activeindex}
                containerStyle={sty.dotContainer}
                dotStyle={sty.dotStyle}
                inactiveDotStyle={sty.dotInactiveStyle}
                inactiveDotOpacity={0.2}
                inactiveDotScale={0.8}
            />
        );
    }

    return (
        <>
            <SafeAreaView style={bgWhite}></SafeAreaView>
            <View style={DefaultStyles.containerWithNavBar}>
                <NavHeader
                    title={localize.dofServices.title}
                />
                <ScrollView
                    style={[sty.outerCont]}
                    scrollEnabled={true}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    {images.length > 0 &&
                        <>
                            <Carousel
                                data={images}
                                renderItem={renderItem}
                                sliderWidth={windowWidth}
                                itemWidth={windowWidth}
                                centerContent={true}
                                loop={true}
                                autoplay={true}
                                onSnapToItem={(index) => setActiveIndex(index)}
                            />
                            {pagination()}
                        </>
                    }
                    {
                        buttonLinks.length > 0 &&
                        <View style={sty.buttonWrapper}>
                            {
                                buttonLinks.map((e, i) => (
                                    <PrimaryBtn
                                        key={i}
                                        text={e.label}
                                        onPress={() => openLink(e.url)}
                                        marginTop={scale(25)}
                                        bgColor={buttonColorArr[i % 3]}
                                    />
                                ))
                            }
                            {
                                webViewURL ?
                                    <PrimaryBtn
                                        text={localize.dofServices.moreInfo}
                                        onPress={() => setModalVisible(true)}
                                        marginTop={25}
                                        bgColor={colors.green_1}
                                    /> : null
                            }
                        </View>
                    }
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={{ height: scale(48), backgroundColor: colors.primary_background, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={{ fontSize: fontScale(20), flex: 1, textAlign: 'left', paddingHorizontal: scale(15) }}></Text>
                            <Text style={{ fontSize: fontScale(20), flex: 1, textAlign: 'center', paddingHorizontal: scale(15) }}>{localize.dofServices.moreInfo}</Text>
                            <Text style={{ fontSize: fontScale(20), flex: 1, textAlign: 'right', paddingHorizontal: scale(15) }} onPress={() => setModalVisible(false)}><SVGGoBackDark width={scale(23)} height={scale(15)} /></Text>
                        </View>
                        <WebView source={{ uri: webViewURL }} scrollEnabled={false} />
                    </Modal>

                </ScrollView>
            </View>
            <SafeAreaView style={bgWhite}></SafeAreaView>
        </>
    );
};

export default DOFServicesScreen;
