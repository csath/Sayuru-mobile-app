import { StyleSheet } from 'react-native';
import colors from './colors';
import { scale } from '../utilities/scale';

export const DefaultStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white
    },
    safeAreaViewBase: {
        flex: 1
    },
    contentWrapper: {
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11,
        backgroundColor: colors.white,
        paddingHorizontal: 30,
        paddingVertical: 20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    outermostContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: colors.primary_background,
    },
    containerWithNavBar: {
        flex: 1,
        flexDirection: "column",
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: colors.primary_background,
    },
    scrollViewWrap: {
        padding: scale(15)
    },
    /** background colors */
    bgPrimary: {
        backgroundColor: colors.primary_background,
    },
    bgSeconday: {
        backgroundColor: colors.secondary_background,
    },
    bgSecondaryPurple: {
        backgroundColor: colors.secondary,
    },
    bgWhite: {
        backgroundColor: colors.white,
    },
});