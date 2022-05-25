import React from 'react';
import MapboxGL from "@react-native-mapbox-gl/maps";
import { v4 as uuidv4 } from 'uuid';
import { Text, View, Image } from 'react-native';
import { useState } from 'react';
import colors from '../../styles/colors';
import { scale } from '../../utilities/scale';

export const MarkerLocationIcon = ({ coordinate, showTime = false, id, title, ...props }) => {
    const [customId] = useState(`${id || uuidv4()}`);
    return (
        <MapboxGL.PointAnnotation
            id={customId}
            key={customId}
            coordinate={coordinate}
            title={title}
            {...props}
        >
            <View style={{ height: scale(20), width: scale(20), borderRadius: 10, borderWidth: 1, borderColor: colors.red_DE0E19, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ height: scale(16), width: scale(16), borderRadius: 8, backgroundColor: colors.red_1 }}></View>
            </View>
            <MapboxGL.Callout title={title}/>
        </MapboxGL.PointAnnotation>
    )
}

export default MarkerLocationIcon;