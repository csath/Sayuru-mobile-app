import React, { Component } from "react";
import { TouchableOpacityProperties } from "react-native";
import { commonColors } from "../utils/sc-color";
import getIconType from "../utils/getIconType";
export interface IconProperties extends TouchableOpacityProperties {
    name: string,
    size?: number,
    color: string,
    type: "zocial" | "octicon" | "material" | "material-community" | "ionicon" | "foundation" | "evilicon" | "entypo" | "font-awesome" | "simple-line-icon" | "feather" | "antdesign"
}

export class Icon extends Component<IconProperties> {
    render() {
        const { name, type, ...otherProps } = this.props;

        const IconComponent = getIconType(type);

        if (type === "ionicon" && !name.includes("logo")) {
            return (
                <IconComponent
                    name={name
                        // Platform.OS === "android" ? "md-" + name : "ios-" + name
                    }
                    {...otherProps}
                />
            );
        }
        return <IconComponent name={name} {...otherProps} />;
    }
}

Icon.defaultProps = {
    color: commonColors.white,
    size: 18,
    type: "ionicon"
};
