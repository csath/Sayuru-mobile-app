import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { scale, fontScale } from '../../utilities/scale';
import colors from '../../styles/colors';
import SVGArrowForward from '../../../assets/form-icons/arrow-forward.svg';

export interface Props {
    onPress: () => void;
    text: string,
    marginTop?: number
}

export const NextIconBtn = (props: Props) => {
    const { onPress, text, marginTop } = props;
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                height: scale(47),
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.primary,
                borderRadius: 6,
                paddingHorizontal: scale(20),
                flexDirection: "row"
            }}
        >
            <Text style={{ color: colors.white, fontSize: fontScale(16), marginRight: scale(15) }}>{text}</Text>
            <SVGArrowForward width={fontScale(8)} height={fontScale(13)} />
        </TouchableOpacity>
    );
};
