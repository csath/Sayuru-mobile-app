import React from 'react';
import { StatusBar, View, StyleSheet, Dimensions } from 'react-native';

export interface Props {
    backgroundColor?: string,
    barStyle?: 'default' | 'light-content' | 'dark-content'
}

const windowWidth = Dimensions.get('window').width;

const CustomStatusBar = (props: Props) => {
    const { backgroundColor, barStyle } = props;
    return (
        <>
            <StatusBar backgroundColor={'transparent'} barStyle={barStyle} translucent={true} />
            {(backgroundColor != 'transparent') && <View style={[styles.container, {backgroundColor: backgroundColor}]}/>}
        </>
    );
};

export default CustomStatusBar;

const styles = StyleSheet.create({
    container: {
        width: windowWidth,
        height: 24,
    },
})