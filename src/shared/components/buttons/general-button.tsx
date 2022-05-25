import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { scale, fontScale } from '../../utilities/scale';
import colors from '../../styles/colors';

export interface Props {
    onPress: () => void;
    text: string,
    textStyle?: any,
    backgroundColor?: string,
    textColor?: string,
    marginTop?: number,
    disabled?: boolean
    style?: any,
    img?: any
}

const GeneralButton = (props: Props) => {
    const { onPress, text, disabled, backgroundColor = colors.primary, textColor = colors.white, style, textStyle, img } = props;
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={[{
                height: scale(45),
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: disabled? `${backgroundColor}99` : backgroundColor,
                borderRadius: 8,
            }, style]}
        >
            <>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {img}
                    <Text style={[{
                        color: textColor,
                        fontSize: fontScale(16),
                        fontWeight: "500",
                        letterSpacing: 1.2,
                    }, textStyle]}> {text}</Text>
                </View>
            </>
        </TouchableOpacity>
    );
};

export { GeneralButton };