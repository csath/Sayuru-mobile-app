import React from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import images from '../../../assets';
import colors from '../../styles/colors';
import { fontScale, scale } from '../../utilities/scale';

const MapZoom = ({ style = {}, onZoomIn = () => { }, onZoomOut = () => { } }) => {
    return (
        <View style={[styles.imageContainer, style]}>
            <TouchableOpacity onPress={onZoomIn} style={styles.pressable}>
                <Image
                    style={[
                        styles.image,
                    ]}
                    resizeMode="contain"
                    source={images.location_zoom_in}
                />
            </TouchableOpacity>
            <Text style={styles.text}>Zoom</Text>
            <TouchableOpacity onPress={onZoomOut} style={styles.pressable}>
                <Image
                    style={[
                        styles.image,
                    ]}
                    resizeMode="contain"
                    source={images.location_zoom_out}
                />
            </TouchableOpacity>
        </View>
    )
}

export default MapZoom;

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        zIndex: 20,
        elevation: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        right: scale(18),
        bottom: scale(14),
        backgroundColor: colors.white,
        borderWidth: 0.8,
        borderColor: colors.typo_grey_header,
        borderRadius: 40,
        padding: 4,
    },
    image: {
        flex: 1,
        width: scale(24),
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    text: {
        fontSize: fontScale(8),
        color: colors.typo_grey_header,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: scale(15),
    },
    pressable: {
        flex: 1,
    }
})