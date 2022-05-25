import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Dimensions } from 'react-native';
import { scale, fontScale } from '../../utilities/scale';
import colors from '../../styles/colors';
import SVGClose from '../../../assets/form-icons/close.svg';

const windowWidth = Dimensions.get('window').width;

export interface Props {
    onPress: () => void;
    text: string,
    marginTop?: number,
    hidden?: boolean
}

export const FloatingPanel = (props: Props) => {
    const { onPress, text, hidden } = props;
    if(hidden) {
        return null;
    }
    return (
        <View style={styles.outerContainer}>
            <Text style={styles.text}>{text}</Text>
            <TouchableOpacity
                onPress={onPress}
                style={styles.closeButtonContainer}
            >
                <SVGClose width={fontScale(15)} height={fontScale(15)} />
            </TouchableOpacity>
        </View>

    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flexDirection: 'row',
        zIndex: 70,
        elevation: 70,
        minHeight: 70,
        borderRadius: scale(15),
        marginHorizontal: scale(20),
        marginTop: scale(34),
        width: windowWidth - scale(40),
        position: 'absolute',
        backgroundColor: colors.primary,
        flex: 1,
    },
    closeButtonContainer: {
        flex: 1,
        padding: scale(20),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
    },
    text: {
        padding: scale(20),
        color: colors.white,
        flex: 10,
        lineHeight: 20,
        fontSize: fontScale(13)
    }
})
