import { Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';
import colors from '../../../shared/styles/colors';
import { scale, fontScale } from '../../../shared/utilities/scale';
import { getVerificationCodeBoxWidth } from '../components/verification-box-width_calculator.logic';
const windowHeight = Dimensions.get('window').height;

export const AuthStyles = StyleSheet.create({
    section1Wrapper: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between"
    },
    section1Wrapper_hard: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        height: windowHeight / 4.4
    },
    section1Wrapper_hard_selectZone: {
        height: windowHeight / 4.9
    },
    logoContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    welcomeText: {
        color: colors.white,
        fontSize: fontScale(25),
        paddingLeft: scale(25),
        marginBottom: scale(20)
    },
    forgotPwContainer: {
        marginVertical: scale(15),
        paddingVertical: scale(5),
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    forgotPwText: {
        color: colors.typo_grey_header,
        fontSize: fontScale(14)
    },
    registerContainer: {
        flexDirection: "row",
        padding: scale(5),
        marginVertical: scale(23),
        marginTop: scale(100),
        justifyContent: "center"
    },
    regText1: {
        color: colors.typo_grey_header,
        fontSize: fontScale(16)
    },
    regText2: {
        color: colors.grey_1,
        fontSize: fontScale(16),
        letterSpacing: 1,
        // textDecorationLine: "underline"
    },
    actionItemsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: scale(65),
        marginBottom: scale(55)
    },
    actionItemsContainerZones: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: scale(35),
        marginBottom: scale(55)
    },
    stepProgrssWrap: {
        flex: 1,
        paddingLeft: scale(20)
    },
    stepProgress: {
        color: colors.placeholder_grey,
        fontSize: fontScale(13)
    },
    stepProgressCurrentStep: {
        color: colors.black,
    },
    disclaimerWrap: {
        alignItems: "center",
        marginTop: scale(25)
    },
    disclaimerTextBase: {
        fontSize: fontScale(11),
        textAlign: "center",
        color: colors.placeholder_grey,
        lineHeight: fontScale(17),
        // marginHorizontal: 5,
    },
    disclaimerHighlights: {
        color: colors.black,
        textDecorationLine: "underline"
    },
    OTPnumPadContainer: {
        // flex: 1,
        backgroundColor: colors.primary,
        borderRadius: 25,
        flexDirection: "column",
        justifyContent: "center",
        paddingVertical: scale(30),
        paddingHorizontal: scale(30),
        marginTop: scale(15)
    },
    OTPinstructions: {
        color: colors.white,
        fontSize: fontScale(17),
        textAlign: "center",
        marginBottom: scale(10)
    },
    resendOTPcontainer: {
        // flexDirection: "row",
        padding: scale(5),
        marginVertical: scale(5),
        justifyContent: "center",
        alignItems: 'center',
    },
    resendOTPTextBase: {
        color: colors.ligh_grey,
        fontSize: fontScale(16)
    },
    resendOTPTextHighlight: {
        color: colors.grey_E3E3E3,
        fontSize: fontScale(16),
        fontWeight: '700',
    },
    mockOTPboxContainer: {
        flex: 1,
        flexDirection: "row",
        paddingHorizontal: scale(20),
        marginVertical: scale(20)
    },
    verificationBoxHolder: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    singleOTPbox: {
        flex: 1,
        borderStyle: "solid",
        borderBottomColor: colors.white,
        borderBottomWidth: 2,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: scale(7),
        paddingVertical: scale(10)
    },
    singlenumber: {
        fontSize: fontScale(22),
        color: colors.white,
        textAlign: "center"
    },
    loginButton: {
        // marginTop: scale(270),
        flexDirection: "column"
    },
    requestOtpDiscl: {
        // marginTop: scale(110),
        flex: 1,
        justifyContent: 'flex-end',
    },
    singleInputField: {
        position: "absolute",
        fontSize: fontScale(18),
        textAlign: "center",
        width: getVerificationCodeBoxWidth().boxWidth,
        height: scale(56),
        borderColor: colors.white
    },
    display: {
        borderBottomColor: colors.white,
        borderBottomWidth: 2,
        width: getVerificationCodeBoxWidth().boxWidth,
        height: scale(56),
        alignItems: "center",
        justifyContent: "center",
    },
    inputFocused: {
        borderBottomColor: colors.white,
        borderBottomWidth: 3,
    },
    otpText: {
        fontSize: fontScale(18),
        color: colors.white,
    },
    OTPDescription: {
        lineHeight: 24,
        fontSize: fontScale(15),
        color: colors.grey_1,
        textAlign: 'justify',
        paddingVertical: 20,
    },
    exampleText: {
        color: colors.grey_2,
        fontSize: 14,
    },
    optionalText: {
        fontSize: fontScale(12),
    }
});
