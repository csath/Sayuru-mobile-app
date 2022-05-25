import React from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import images from '../../../assets';
import colors from '../../styles/colors';
import { scale } from '../../utilities/scale';

const MapMyCurrentLocation = ({ style = {}, onPress = () => { } }) => {
    return (
        <View style={[styles.imageContainer, style]}>
            <TouchableOpacity onPress={onPress} style={styles.pressable}>
                <Image
                    style={[
                        styles.image,

                    ]}
                    resizeMode="contain"
                    tintColor={colors.typo_grey_header}
                    source={images.location_gps}
                />
            </TouchableOpacity>
        </View>
    )
}

export default MapMyCurrentLocation;

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        zIndex: 20,
        elevation: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        right: scale(18),
        bottom: scale(134),
        backgroundColor: colors.white,
        borderWidth: 0.8,
        borderColor: colors.typo_grey_header,
        borderRadius: 40,
    },
    image: {
        flex: 1,
        width: scale(32),
        height: scale(32),
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