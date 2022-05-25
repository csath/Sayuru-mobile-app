import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Linking } from 'react-native';
import { FloatingSoSBtn } from '../buttons/floating-sos-btn.component';
import { DefaultStyles } from '../../styles/common-styles';
import CustomStatusBar from '../statusbar/statusbar';
import MapDirection from '../map/map-direction.component';
import MapZoom from '../map/map-zoom.component';
import MapCurrentLocation from '../map/map-my-current-location.component';
import MapCompass from '../map/map-compass.component';
import MapLatLong from '../map/map-lat-long.component';
import { IS_SMALL_DEVICE, scale } from '../../utilities/scale';
import { hasLocationPermission } from '../../utilities/fetch-locations/location-permission';
import colors from '../../styles/colors';

export interface Props {
    children: any,
    style?: any,
}

const { bgSeconday } = DefaultStyles;

const WarningMsg = ({onPress}) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 17, textAlign: 'center'}}>Location Permissions denied.</Text>
            <Text style={{marginTop: 10, fontSize: 17, textAlign: 'center'}}>Go to <Text onPress={() => Linking.openSettings()} style={{fontWeight: 'bold', fontSize: 19, color: colors.primary, textDecorationLine: 'underline'}}>settings</Text> and enable permissions.</Text>
            {/* </Text> */}
            <Text onPress={onPress} style={{ position: 'absolute', textDecorationLine: 'underline', bottom: 30}}>Press to recheck permission</Text>
        </View>
    )
}

const MapLayout = (props: Props) => {
    const { children } = props;

    useEffect(() => {
        getPermissionStatus();
    }, [])

    const [pgranted, setpgranted] = useState(false)

    const getPermissionStatus = async () => {
        try {
            const granted = await hasLocationPermission()
            setpgranted(granted)
        }
        catch (e) {

        }
    }

    return (
        <>
            <CustomStatusBar backgroundColor={'transparent'} barStyle={'dark-content'} />
            <View style={DefaultStyles.containerWithNavBar}>
                {pgranted ? children : <WarningMsg onPress={() => getPermissionStatus()} />}
            </View>
        </>
    );
};

MapLayout.MapContainer = ({ children, style, onZoomOut, onZoomIn, onCurrentLocationFocus, showZoomControls = true, showMyCurrentLocation = true, showMapDirection = true, showCompass = false, showLatLong = false }) => {
    return (
        <View style={[styles.mapContainer, style]}>
            <FloatingSoSBtn customStyle={styles.customSOSBtn} />
            {showMapDirection && <MapDirection style={styles.imageContainer} />}
            {showZoomControls && <MapZoom onZoomIn={onZoomIn} onZoomOut={onZoomOut} />}
            {showMyCurrentLocation && <MapCurrentLocation onPress={onCurrentLocationFocus} />}
            {showCompass && <MapCompass />}
            {showLatLong && <MapLatLong />}
            {children}
        </View>
    )
}

MapLayout.ActionContainer = ({ children, style }) => {
    return (
        <View style={[styles.textContainer, bgSeconday, style]}>
            {children}
        </View>
    )
}

export default MapLayout;

const styles = StyleSheet.create({
    mapContainer: {
        flex: IS_SMALL_DEVICE ? 8 : 8,
        width: '100%',
    },
    textContainer: {
        flex: IS_SMALL_DEVICE ? 2.125 : 2,
        width: '100%',
        padding: scale(15),
    },
    customSOSBtn: {
        top: scale(28),
    },
    imageContainer: {
        flex: 1,
        top: scale(36),
        right: scale(14),
        zIndex: 20,
        elevation: 20,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
})