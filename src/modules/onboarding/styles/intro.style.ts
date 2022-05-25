import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../../shared/styles/colors';
import { scale, fontScale } from '../../../shared/utilities/scale';

const windowWidth = Dimensions.get('window').width;

export const OnboardingIntroStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.primary_background,
    },
    btnArrayContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    onboardingProgressBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: scale(15),
    },
    innerbtnIndicator: {
        width: windowWidth / 18,
        height: scale(5),
        backgroundColor: colors.primary_background,
    },
    innerbtnIndicatorSelected: {
        backgroundColor: colors.primary_background,
    },
    getStartedBtnWrap: {
        paddingHorizontal: scale(100),
        marginTop: scale(30),
    },
    logoMargin: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    bgImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    textWrapper: {
        flex: 1,
        flexBasis: 200,
        flexGrow: 1,
        paddingVertical: scale(20),
        paddingHorizontal: scale(40),
        justifyContent: 'center',
    },
    textStyle: {
        textAlign: 'center',
        color: colors.white,
        fontSize: fontScale(16),
        lineHeight: 30,
    },
});