import React, { Component } from "react";
import { Text, TextProps, TextStyle } from "react-native";
import { commonColors } from "../utils/sc-color";

export interface Props extends TextProps {
    color?: string,
    align?: string,
    margin?: boolean,
    style?: TextStyle
}

/** customized for sayuru */
class S_Text extends Component<Props> {
    render() {
        const {
            color,
            children,
            style,
            align,
            margin,
            ...otherProps
        } = this.props;

        let textStyle = [
            {
                color: color,
                textAlign: align,

            }
        ];

        if (style) {
            textStyle.push(style);
        }
        if (margin) {
            textStyle.push({ marginVertical: 5 });
        }

        return (
            <Text ref={c => (this._root = c)} style={textStyle} {...otherProps}>
                {children}
            </Text>
        );
    }
}

S_Text.defaultProps = {
    color: commonColors.black,
    align: "left",
    margin: false
};

export { S_Text };
