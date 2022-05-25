import React from 'react';
import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';

import colors from '../../styles/colors';
import SVGCose from '../../../assets/form-icons/close.svg';
import { scale } from '../../utilities/scale';

export interface Props {
    onClose?: () => void;
    visible?: boolean,
    children?: any,
    hideCloseBtn?: boolean,
}

const CustomModal = (props: Props) => {
    const { onClose, visible, hideCloseBtn, children, ...otherprops } = props;
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            statusBarTranslucent={true}
            onRequestClose={onClose}
            {...otherprops}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {
                        !hideCloseBtn ?
                            <TouchableOpacity
                                style={[styles.button]}
                                onPress={onClose}
                            >
                                <SVGCose height={scale(8)} width={scale(8)} />
                            </TouchableOpacity> : null
                    }
                    {children}
                </View>
            </View>
        </Modal>
    );
};

export default CustomModal;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: scale(20),
        backgroundColor: colors.white,
        borderRadius: 15,
        padding: scale(25),
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 9,
        height: scale(18),
        width: scale(18),
        elevation: 8,
        position: 'absolute',
        right: scale(25),
        top: scale(25),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.black,
    },
});
