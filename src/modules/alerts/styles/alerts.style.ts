import { StyleSheet } from 'react-native';
import colors from '../../../shared/styles/colors';
import { scale, fontScale } from '../../../shared/utilities/scale';

export const AlertsStyles = StyleSheet.create({
    segementToday: {
        backgroundColor: colors.red_1,
        marginBottom: scale(10)
    },
    segmentWrap: {
        flex: 1,
        backgroundColor: colors.primary_background,
        flexDirection: 'column',
        padding: scale(15),
        borderRadius: scale(15)
    },
    segmentHeadingToday: {
        color: colors.pale_red_1,
    },
    segementHeading: {
        color: colors.grey_3C3C3C,
        fontSize: fontScale(15),
        marginBottom: scale(10)
    },
    oldDateText: {
        fontSize: fontScale(13),
        color: colors.grey_1,
        marginBottom: scale(15)
    },
    oldAlertsTitle: {
        color: colors.grey_3,
        fontSize: fontScale(16),
        fontWeight: '700',
    }
});