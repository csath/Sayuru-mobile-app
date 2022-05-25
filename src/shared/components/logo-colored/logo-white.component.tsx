import React from 'react';
import { View, Image } from 'react-native';
import images from '../../../assets';
import { scale } from '../../utilities/scale';

const LogoColor = () => {
    return (
        <View style={{ alignSelf: 'center' }}>
            <Image
                source={images.app_logo_white}
                style={{
                    height: scale(75),
                    width: scale(141)
                }}
            />
        </View>
    );
};

export { LogoColor };