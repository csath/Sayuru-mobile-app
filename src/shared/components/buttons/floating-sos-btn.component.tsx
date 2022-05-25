import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import SVGSOS from '../../../assets/nav-header/sos-icon.svg';
import { openSMSapp } from '../../utilities/openSMS';
import { scale } from '../../utilities/scale';

export interface Props {
    customStyle: any,
}

export const FloatingSoSBtn = ({customStyle = {}}) => {
    return (
        <TouchableOpacity
            onPress={() => openSMSapp()}
            style={[styles.touchWrapper, customStyle]}
        >
            <SVGSOS />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    touchWrapper: {
        position: "absolute",
        left: scale(14),
        top: scale(4),
        zIndex: 99,
        elevation: 50
    }
})
