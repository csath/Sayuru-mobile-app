import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../../shared/styles/colors';
import { fontScale, scale } from '../../../shared/utilities/scale';

const windowWidth = Dimensions.get('window').width;

export const RoutesStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    noData: {
        marginTop: windowWidth / 10,
        marginBottom: (windowWidth / 10) - 20,
        textAlign: 'center',
        color: colors.white
    },
    footer: {
        height: scale(80)
    },
    divider: {
        height: 1,
        backgroundColor: colors.grey_2,
        marginVertical: scale(20)
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: fontScale(16),
        color: colors.white,
        fontWeight: '700',
        lineHeight: 22,
    },
    itemSeperator: {
        height: scale(15),
    },
    listheader: {
        height: scale(30)
    },
    listFooter: {
        height: scale(80)
    },
    rowContainer: {
        borderRadius: 10,
        backgroundColor: colors.primary_dark,
        padding: scale(13),
        flexDirection: 'row',
    },
    locationIconWrapper: {
        flex: 1,
    },
    locationDescWrapper: {
        flex: 8,
    },
    locationArrowWrapper: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    rowTitle: {
        fontSize: fontScale(16),
        color: colors.white,
    },
    rowSubTitle: {
        fontSize: fontScale(14),
        color: colors.grey_1,
        paddingTop: scale(5),
    },
    arrowContainer: {
        height: scale(33),
        width: scale(33),
        borderRadius: 17,
        backgroundColor: colors.grey_1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        paddingTop: scale(25),
        paddingHorizontal: scale(25)
    }
});