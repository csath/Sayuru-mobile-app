import { StyleSheet } from 'react-native';
import { scale, fontScale } from '../../../shared/utilities/scale';
import colors from '../../../shared/styles/colors';

export const FuelCalcStyles = StyleSheet.create({
    outerCont: {
        flex: 1,
        flexDirection: "column",
        width: '100%',
        padding: scale(20)
    },
    calcFuel: {
        color: colors.grey_3,
        fontSize: fontScale(16),
    },
    inputWrap: {
        flexDirection: "column",
        marginVertical: scale(15),
        backgroundColor: colors.secondary,
        padding: scale(25),
        borderRadius: 15
    },
    inputHeaders: {
        color: colors.white,
        fontSize: fontScale(16),
        lineHeight: 22,
        marginBottom: scale(10),
    },
    resultsWrap: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    ecoResultTxt: {
        color: colors.grey_3C3C3C,
        fontSize: fontScale(24),
        fontWeight: "400",
        letterSpacing: 0.8
    },
    ecoResultNum: {
        color: colors.dark_grey,
        fontSize: fontScale(32),
    },
    calcBtnWrap: {
        flex: 1,
        marginHorizontal: scale(60)
    },
    textInput: {
        height: scale(48),
        borderRadius: 8,
        backgroundColor: colors.secondary_background,
        paddingHorizontal: scale(15),
        color: colors.white,
        fontSize: fontScale(16),
        lineHeight: 18,
        marginBottom: scale(25),
    },
    flex2: {
        flex: 2,
    },
    measurementType: {
        position: 'absolute',
        right: scale(15),
        top: scale(12),
        bottom: 0,
        textAlign: 'right',
        color: colors.disabledGrey
    },
    changeMeasurement: {
        fontSize: fontScale(14),
        color: colors.secondary,
        textTransform: 'uppercase',
        fontWeight: '700',
        marginLeft: scale(8),
        letterSpacing: 1
    },
    changeMeasurementWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    }
});