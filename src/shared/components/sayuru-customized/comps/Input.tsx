import React, { Component } from "react";
import { TextInput, StyleSheet, Platform, Keyboard, View, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";

import { commonColors } from "../utils/sc-color";
import { S_Text } from "./Text";
import { Icon } from "./Icon";


const inputFieldHeight = 56;
const inputFieldPaddingLeft = 16;
const inputFieldFontSize = 16;
const inputFieldIconPaddingVerticle = (inputFieldHeight - inputFieldFontSize) / 2.4

export class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false,
            error: false,
            text: ""
        };
    }

    handleTextChange = text => {
        const { isValid, onChangeText } = this.props;
        this.setState({ text: text });

        if (onChangeText) {
            onChangeText(text);
        }

        if (isValid) {
            this.setState({ error: !isValid(text) });
        }
    };

    render() {
        const {
            errorMessage,
            color,
            noStyle,
            rounded,
            underline,
            defaultStyle,
            style,
            activeStyle,
            errorStyle,
            errorColor,
            iconLeft,
            iconRight,
            ...otherProps
        } = this.props;
        const { error, focused } = this.state;

        let inputStyle = [styles.input];
        let inputActiveStyle = [styles.input];
        let inputErrorStyle = [styles.input];

        if (noStyle) {
            inputStyle.push([style]);
            inputActiveStyle.push(activeStyle);
            inputErrorStyle.push(errorStyle);
        } else if (underline) {
            inputStyle.push(styles.underline);
            inputActiveStyle.push({
                borderBottomColor: color,
                borderBottomWidth: 2
            });
            inputErrorStyle.push({
                borderBottomColor: errorColor,
                borderBottomWidth: 2
            });
        } else if (defaultStyle || rounded) {
            if (Platform.OS === "android") {
                inputStyle.push(styles.default, style, styles.defaultAndroid);
                inputActiveStyle.push(styles.default, styles.defaultAndroid, {
                    borderColor: color,
                    borderWidth: 1
                });
                inputErrorStyle.push(styles.default, styles.defaultAndroid, {
                    borderColor: errorColor,
                    borderWidth: 1
                });
            } else {
                inputStyle.push(styles.default, style, styles.defaultIos);
                inputActiveStyle.push(styles.default, styles.defaultIos, {
                    borderColor: color,
                    borderWidth: 1
                });
                inputErrorStyle.push(styles.default, styles.defaultIos, {
                    borderColor: errorColor,
                    borderWidth: 1
                });
            }

            if (rounded) {
                inputStyle.push(styles.rounded);
                inputActiveStyle.push(styles.rounded, {
                    borderColor: color,
                    borderWidth: 1
                });
                inputErrorStyle.push(styles.rounded, {
                    borderColor: errorColor,
                    borderWidth: 1
                });
            }
        }

        return (
            <View style={styles.inputContainer}>
                <View
                    style={
                        error
                            ? inputErrorStyle
                            : focused
                                ? inputActiveStyle
                                : inputStyle
                    }
                >
                    <View style={{ flex: 7, flexDirection: 'row' }}>
                        {/* <View style={{ flex: 1 }}>
                            {iconLeft && this.renderIcon(iconLeft, { marginRight: 5 })}
                        </View> */}
                        <View style={{ flex: 5 }}>
                            <TextInput
                                ref={c => (this._root = c)}
                                style={{ width: "100%", fontSize: inputFieldFontSize, paddingLeft: inputFieldPaddingLeft, letterSpacing: 0.15, paddingTop: inputFieldIconPaddingVerticle }}
                                underlineColorAndroid={"transparent"}
                                placeholderTextColor={
                                    error ? errorColor : commonColors.inputGrey
                                }
                                onFocus={() => this.setState({ focused: true })}
                                onBlur={() => this.setState({ focused: false })}
                                onSubmitEditing={() => {
                                    this.setState({ focused: true });
                                    Keyboard.dismiss();
                                }}
                                {...otherProps}
                                onChangeText={this.handleTextChange}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            {iconRight && this.renderIcon(iconRight, { paddingTop: inputFieldIconPaddingVerticle })}
                        </View>
                    </View>



                </View>
                {error && errorMessage && (
                    <S_Text size="footnote" color={errorColor}>
                        {errorMessage}
                    </S_Text>
                )}
            </View>
        );
    }

    renderIcon(icon, style) {
        const { errorColor } = this.props;
        const { error } = this.state;
        return (
            <TouchableOpacity style={styles.iconContainer}>
                <Icon
                    {...icon}
                    size={icon.size || 25}
                    style={style}
                    color={error ? errorColor : icon.color}
                />
            </TouchableOpacity>
        );
    }
}

Input.propTypes = {
    color: PropTypes.string,
    isValid: PropTypes.func,
    errorMessage: PropTypes.string,
    activeStyle: PropTypes.object,
    errorStyle: PropTypes.object,
    rounded: PropTypes.bool,
    underline: PropTypes.bool,
    defaultStyle: PropTypes.bool,
    noStyle: PropTypes.bool,
    errorColor: PropTypes.string,
    iconRight: PropTypes.shape({
        ...Icon.propTypes
    }),
    iconLeft: PropTypes.shape({
        ...Icon.propTypes
    }),
    ...TextInput.propTypes
};

Input.defaultProps = {
    color: commonColors.primary,
    errorColor: commonColors.error,
    defaultStyle: true
};

const styles = StyleSheet.create({
    inputContainer: {
        width: "100%",
        marginBottom: 5
    },
    input: {
        marginTop: 16,
        marginBottom: 5,
        width: "100%",
        height: inputFieldHeight,
        flexDirection: "row",
    },
    default: {
        borderColor: commonColors.inputGreyHC,
        borderWidth: 1
    },
    defaultAndroid: {
        paddingHorizontal: 0,
        borderRadius: 3
    },
    defaultIos: {
        paddingHorizontal: 0,
        borderRadius: 3
    },
    underline: {
        borderBottomColor: commonColors.inputGrey,
        borderBottomWidth: 0.9
    },
    rounded: {
        borderRadius: 3,
        paddingHorizontal: 0
    },
    iconContainer: {
        alignItems: "center",
        justifyContent: "center"
    }
});
