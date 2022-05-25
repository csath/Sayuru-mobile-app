import React from 'react';
import { useEffect, useState } from "react";
import { Image, View, Text, StyleSheet, Animated } from "react-native";
import CompassHeading from 'react-native-compass-heading';
import images from '../../../assets';
import colors from '../../styles/colors';
import { fontScale, scale } from '../../utilities/scale';

const MapDirection = ({ style = {}, imageStyle = {}, fullScreen = false }) => {
    const [compassHeading, setCompassHeading] = useState(0);

    useEffect(() => {
        const degree_update_rate = 0.05;
        CompassHeading.start(degree_update_rate, ({ heading, accuracy }) => {
            setCompassHeading(heading);
        });
        return () => {
            CompassHeading.stop();
        };
    }, []);

    return (
        <View style={[styles.imageContainer, style]}>
            <Animated.Image
                style={[
                    styles.image,
                    imageStyle,
                    { transform: [{ rotate: `${360 - compassHeading}deg` }] },
                ]}
                resizeMode="contain"
                source={fullScreen ? images.location_compass_large : images.location_direction}
            />
            <Text style={styles.text}>N</Text>
        </View>
    )
}

export default MapDirection;

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        zIndex: 20,
        elevation: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: scale(56),
        height: scale(56),
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    text: {
        fontSize: fontScale(14),
        color: colors.white,
        fontWeight: 'bold',
        position: 'absolute',
        textAlign: 'center',
    },
})