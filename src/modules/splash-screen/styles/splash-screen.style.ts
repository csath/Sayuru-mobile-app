import { StyleSheet } from 'react-native';

import colors from '../../../shared/styles/colors';
import { fontScale, IS_SMALL_DEVICE, scale } from '../../../shared/utilities/scale';

export const SplashScreenStyles = StyleSheet.create({
    activityInd: {
        marginTop: scale(60),
        marginBottom: scale(60)
    },
    topView: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        marginVertical: IS_SMALL_DEVICE ? scale(0) : scale(10)
    },
    centeredView: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    spashBgAbsolute: {
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
    descStyles: {
        textAlign: 'center',
        color: colors.white,
        fontSize: fontScale(18),
        lineHeight: 30,
        marginTop: scale(35)
    }

});