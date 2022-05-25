import { Dimensions } from "react-native";

export function getVerificationCodeBoxWidth() {
    const { height, width } = Dimensions.get('window');
    const widthWithoutPadding = width - (30 * 2);
    const boxWidth = widthWithoutPadding / 6.7;
    const marginLeft = (widthWithoutPadding - (boxWidth * 4)) / 5;

    return { boxWidth, marginLeft };
}