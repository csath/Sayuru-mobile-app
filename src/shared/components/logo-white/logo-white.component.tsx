import React from 'react';
import { View, Image } from 'react-native';
import images from '../../../assets';
import { scale } from '../../utilities/scale';

const LogoWhite = () => {
    return (
        <View style={{ alignSelf: 'center' }}>
            <Image
                source={images.logo_white}
                style={{
                    height: scale(75),
                    width: scale(141)
                }}
            />
        </View>
    );
};

export { LogoWhite };