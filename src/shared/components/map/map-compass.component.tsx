import React, { useState } from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from "react-native";
import images from '../../../assets';
import localize from '../../../localization/translations';
import colors from '../../styles/colors';
import { fontScale, scale } from '../../utilities/scale';
import SVGGoBackDark from '../../../assets/form-icons/close.svg';
import MapDirection from './map-direction.component';

const deviceWidth = Dimensions.get('window').width; 

const MapCompass = ({ style = {}, onPress = () => { } }) => {
    const [modalVisible, setModalVisible] = useState(false)
    return (
        <View style={[styles.imageContainer, style]}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.pressable}>
                <Image
                    style={[
                        styles.image,

                    ]}
                    resizeMode="contain"
                    tintColor={colors.typo_grey_header}
                    source={images.location_compass}
                />
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
                statusBarTranslucent={true}
            >
                <View style={{ backgroundColor: colors.secondary_background, flex: 1}}>
                <View style={{ height: scale(98), backgroundColor: 'transparent', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={{ fontSize: fontScale(20), flex: 1, textAlign: 'left', paddingHorizontal: scale(15) }}></Text>
                    <Text style={{ fontSize: fontScale(20), flex: 1, textAlign: 'center', paddingHorizontal: scale(15) }}></Text>
                    <Text style={{ fontSize: fontScale(20), flex: 1, textAlign: 'right', paddingHorizontal: scale(35) }} onPress={() => setModalVisible(false)}><SVGGoBackDark width={scale(26)} height={scale(18)} /></Text>
                </View>
                <MapDirection fullScreen={true} imageStyle={{  width: scale(deviceWidth - 60), height: scale(deviceWidth - 60),}} />
                </View>
            </Modal>
        </View>
    )
}

export default MapCompass;

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        zIndex: 20,
        elevation: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        right: scale(18),
        bottom: scale(184),
        backgroundColor: colors.white,
        borderWidth: 3.8,
        borderColor: colors.white,
        borderRadius: 40,
    },
    image: {
        flex: 1,
        width: scale(27),
        height: scale(27),
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    text: {
        fontSize: 8,
        color: colors.typo_grey_header,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: scale(15),
    },
    pressable: {
        flex: 1,
    }
})