import React from 'react';
import MapboxGL from "@react-native-mapbox-gl/maps";
import { v4 as uuidv4 } from 'uuid';
import { View, Text } from 'react-native';
import { useState } from 'react';
import colors from '../../styles/colors';
import moment from 'moment';
import { useEffect } from 'react';
import { scale } from '../../utilities/scale';

export const CurrentLocationIcon = ({ coordinate, showTime = false }) => {
    const [customId] = useState(uuidv4());
    const [timeMsg, setTimeMsg] = useState(moment().format('hh:mm A'))

    useEffect(() => {
        let terminator = 0;
        if (showTime) {
            terminator = setInterval(() => {
                setTimeMsg(moment().format('hh:mm A'))
            }, 60000)
        }
        return () => clearInterval(terminator)
    }, []);

    return (
        <MapboxGL.PointAnnotation
            id={customId}
            coordinate={coordinate}
        >
            <View style={{ height: scale(150), width: scale(810), flexDirection: 'row', flex: 1}}>
                <View style={{ height: scale(20), width: scale(20), borderRadius: scale(10), borderWidth: 1, borderColor: colors.red_1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ height: scale(16), width: scale(16), borderRadius: 8, backgroundColor: colors.red_1 }}></View>
                </View>
                {showTime && <Text style={{ padding: scale(5), backgroundColor: colors.primary, color: colors.white, height: scale(28), borderRadius: 12, textAlign:'center' }}>{timeMsg}</Text>}
            </View>
        </MapboxGL.PointAnnotation>
    )

}

export default CurrentLocationIcon;