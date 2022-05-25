import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { scale, fontScale } from '../../utilities/scale';
import colors from '../../styles/colors';

export interface Props {
    onPress: () => void;
    text: string,
    marginTop?: number,
    type?: "secondary"
    lowerCase?: boolean,
    disabled: boolean,
    bgColor: string
}

const PrimaryBtn = (props: Props) => {
    const { onPress, text, marginTop, type, lowerCase, disabled, bgColor } = props;
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={{
                height: scale(52),
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: bgColor ? bgColor : (type === "secondary" ? colors.white : colors.secondary),
                borderRadius: scale(8),
                marginTop: marginTop ? scale(marginTop) : scale(50),
                opacity: disabled ? 0.6 : 1
                // marginHorizontal: scale(10),
            }}
        >
            <Text style={{
                color: type === "secondary" ? colors.black : colors.white,
                fontSize: fontScale(16),
                fontWeight: "500",
                letterSpacing: 1.2,
                textTransform: lowerCase ? 'capitalize' : 'uppercase'
            }}>{text}</Text>
        </TouchableOpacity>
    );
};

export { PrimaryBtn };