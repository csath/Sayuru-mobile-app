import { Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';
import colors from '../../../shared/styles/colors';
import { scale, fontScale } from '../../../shared/utilities/scale';

export const UserStyles = StyleSheet.create({
    section1Wrapper_hard: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        height: scale(100),
        zIndex: 99,
        elevation: 50
    },
    logoContainer: {
        position: "absolute",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        bottom: scale(-20),
        zIndex: 9,
        backgroundColor: colors.white
    },
    sendOTPwrap: {
        justifyContent: "center",
        alignItems: "center",
        padding: scale(10),
        marginVertical: scale(20)
    },
    sendOTPcode: {
        color: colors.primary,
        fontSize: fontScale(18)
    },
    imageBorder: {
        borderColor: colors.white,
        borderWidth: 1
    }
});