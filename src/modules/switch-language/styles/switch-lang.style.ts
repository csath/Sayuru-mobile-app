import { StyleSheet } from 'react-native';
import colors from '../../../shared/styles/colors';
import { fontScale, scale } from '../../../shared/utilities/scale';

export const SwitchLangStyles = StyleSheet.create({
    langSwitchBoxWrapper: {
        flex: 2,
        alignItems: "flex-start",
        flexDirection: "row"
    },
    langSwitchBoxInner: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 25,
        marginHorizontal: scale(50),
        flexDirection: 'column',
        paddingHorizontal: scale(30),
        paddingVertical: scale(30),
        backgroundColor: colors.white,
    },
    headingText: {
        fontSize: fontScale(21),
        color: colors.black,
        marginBottom: scale(5),
        textAlign: 'center',
    },
    languageNameText: {
        fontSize: fontScale(16),
        color: colors.black,
        lineHeight: 19,
    },
    nextBtnContainer: {
        width: "100%"
    },
    container: {
        flex: 1,
        backgroundColor: colors.primary_background,
    },
    bgContainerAbsolute: {
        position: 'absolute',
        width: "100%",
        height: "100%",
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: colors.primary_background
    },
    bgImgStyles: {
        width: 'auto',
        height: '100%',
    },
    appLogo: {
        flex: 1.25,
        justifyContent: "center",
        alignItems: 'center'
    },
    logoStyle: {
        resizeMode: 'cover', 
        // tintColor: 'black',
    },
});