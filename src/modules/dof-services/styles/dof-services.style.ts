import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../../shared/styles/colors';
import { scale } from '../../../shared/utilities/scale';

const windowWidth = Dimensions.get('window').width;

export const DOFServicesStyles = StyleSheet.create({
    outerCont: {
        flex: 1,
        flexDirection: "column",
        width: '100%',
        padding: scale(30)
    },
    buttonWrapper: {
        flex: 1,
        marginBottom: scale(80),
    },
    slideItemWrapper: {
    },
    image: {
        height: windowWidth - scale(30),
        width: windowWidth - scale(60),
        resizeMode: 'cover',
        borderRadius: 10,
    },
    dotStyle: {
        width: scale(8),
        height: scale(8),
        borderRadius: 4,
        marginHorizontal: 0,
        backgroundColor: colors.secondary_background
    },
    dotInactiveStyle: {
        backgroundColor: colors.secondary_background,
    },
    dotContainer: {
        backgroundColor: 'transparent'
    }
});