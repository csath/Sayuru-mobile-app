import React, { Component } from "react";
import { View, StyleSheet, Platform, ViewProperties, Keyboard } from "react-native";
import { deviceVariables } from "../../../utilities/variables/deviceVariables";
import { commonColors } from "../utils/sc-color";
import { isIphoneX } from '../../../utilities/platform';

export interface Props extends ViewProperties {
    color: string,
    activeColor: string,
    inactiveColor: string,
    top?: boolean,
    useSayuruDefaults: boolean
}

interface State {
    orientation: "portrait" | "landscape",
    isVisible: boolean
}

export class TabBar extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isVisible: true,
            orientation:
                deviceVariables.height > deviceVariables.width
                    ? "portrait"
                    : "landscape"
        };
        this.keyboardWillShow = this.keyboardWillShow.bind(this)
        this.keyboardWillHide = this.keyboardWillHide.bind(this)
    }

    componentWillMount() {
        this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow)
        this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide)
    }

    componentWillUnmount() {
        this.keyboardWillShowSub.remove()
        this.keyboardWillHideSub.remove()
    }

    keyboardWillShow = event => {
        this.setState({
            isVisible: false
        })
    }

    keyboardWillHide = event => {
        this.setState({
            isVisible: true
        })
    }

    layoutChange(val) {
        let maxComp = Math.max(deviceVariables.width, deviceVariables.height);
        if (val.width >= maxComp) {
            this.setState({ orientation: "landscape" });
        } else {
            this.setState({ orientation: "portrait" });
        }
    }

    calculatePadder(mode, inset) {
        const insetValues =
            mode === "portrait" ? inset.portrait : inset.landscape;
        let bottomPadder = insetValues.bottomInset;
        return bottomPadder;
    }

    render() {
        const {
            color,
            activeColor,
            inactiveColor,
            children,
            top,
            useSayuruDefaults,
            ...otherProps
        } = this.props;

        // hide tab bar when keyboard is active
        if (!this.state.isVisible) {
            return null;
        }

        let tabBarStyle = [styles.container, {
            backgroundColor: color,
            borderTopColor: useSayuruDefaults ? color : null,
            borderTopWidth: useSayuruDefaults ? 1 : null
        }];

        if (isIphoneX() && !top) {
            tabBarStyle.push({
                paddingBottom:
                    this.calculatePadder(
                        this.state.orientation,
                        deviceVariables.Inset
                    ) * 0.55
            });
        }

        const newChildren = React.Children.map(children, child =>
            child
                ? React.cloneElement(child, {
                    ...child.props,
                    activeColor,
                    inactiveColor,
                    top
                })
                : null
        );

        return (
            <View style={tabBarStyle} {...otherProps}>
                {newChildren && newChildren}
            </View>
        );
    }
}

TabBar.defaultProps = {
    color: Platform.OS === "android" ? commonColors.primary : "#f8f8f8",
    top: false
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        ...Platform.select({
            ios: {
                borderTopColor: commonColors.inputGrey,
                borderTopWidth: 1
            }
        })
    }
});
