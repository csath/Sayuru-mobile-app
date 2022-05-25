import React, { Component } from "react";
import { Platform, StyleSheet, TouchableOpacity, Image, TouchableOpacityProps, Text } from "react-native";
import { Icon } from "./Icon";

export interface Props extends TouchableOpacityProps {
    activeColor?: string,
    inactiveColor?: string,
    active: boolean,
    top?: boolean,
    useSayuruDefaults: boolean,

}
export class TabItem extends Component<Props> {
    render() {
        const {
            children,
            activeColor,
            inactiveColor,
            active,
            top,
            useSayuruDefaults,
            ...otherProps
        } = this.props;

        let newChildren = [];

        let topPosition = top && Platform.OS === "android";

        const color = active ? activeColor : inactiveColor;

        let containerStyle = topPosition
            ? [styles.container, styles.containerTop]
            : styles.container;

        if (children) {
            newChildren = React.Children.map(children, child =>
                child && child.type === Text
                    ? React.cloneElement(child, {
                        ...child.props,
                        style: {
                            ...child.props.style,
                            opacity: active ? 1 : 0.8,
                            position: useSayuruDefaults ? 'absolute' : null,
                            bottom: useSayuruDefaults ? 5 : null,
                            paddingBottom: useSayuruDefaults ? 5 : null,
                            fontSize: useSayuruDefaults ? 8 : 15,
                            color
                        }
                    })
                    : child && child.type === Icon ?
                        React.cloneElement(child, {
                            ...child.props,
                            size: topPosition ? 20 : 28,
                            color,
                            style: {
                                ...child.props.style,
                                opacity: active ? 1 : 0.8,
                                marginRight: topPosition ? 5 : 0
                            }
                        })
                        : child && child.type === Image ?
                            useSayuruDefaults ?
                                React.cloneElement(child, {
                                    style: {
                                        ...child.props.style,
                                        height: 22,
                                        width: 22,
                                        marginBottom: 14,
                                    },
                                    ...child.props
                                })
                                : React.cloneElement(child, {
                                    style: {
                                        ...child.props.style,
                                        width: topPosition ? 20 : 28,
                                        height: topPosition ? 20 : 28,
                                        opacity: active ? 1 : 0.8,
                                        marginRight: topPosition ? 5 : 0
                                    },
                                    ...child.props
                                })
                            : null
            );
        }

        return (
            <TouchableOpacity style={containerStyle} {...otherProps}>
                {newChildren && newChildren}
            </TouchableOpacity>
        );
    }
}

TabItem.defaultProps = {
    activeColor: "#ffffff",
    inactiveColor: "#DADADA",
    active: false,
    top: false
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10
    },
    containerTop: {
        flexDirection: "row"
    }
});
