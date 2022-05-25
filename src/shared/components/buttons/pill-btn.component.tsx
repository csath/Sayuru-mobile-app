import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { scale, fontScale } from '../../utilities/scale';
import colors from '../../styles/colors';

export interface Props {
    onPress: () => void;
    text: string,
    type: "light" | "dark",
    height: number,
    disabled: boolean,
}

const PillBtn = (props: Props) => {
    const { onPress, text, type, height = 34, disabled } = props;
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={{
                height: scale(height),
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: type === "dark" ? colors.secondary : colors.white,
                borderRadius: scale(50),
            }}
        >
            <Text style={{
                color: type === "dark" ? colors.white : colors.secondary,
                fontSize: fontScale(12),
                fontWeight: "500",
                letterSpacing: 1,
                // textTransform: 'uppercase'
            }}>{text}</Text>
        </TouchableOpacity>
    );
};

export { PillBtn };