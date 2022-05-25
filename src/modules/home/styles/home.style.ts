import { StyleSheet } from 'react-native';
import { fontScale, scale } from '../../../shared/utilities/scale';
import colors from '../../../shared/styles/colors';

export const HomeStyles = StyleSheet.create({
    sayuruWPTO: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "center",
        padding: scale(5),
        marginTop: scale(15)
    },
    sayuruWpTxt: {
        color: colors.pink,
        fontSize: fontScale(15),
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontWeight: "500",
    },
    next7daysTxt: {
        color: colors.white,
        fontSize: fontScale(19),
        marginTop: scale(25)
    }
});