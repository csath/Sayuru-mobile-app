import React, { useEffect, useState } from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import Geolocation from 'react-native-geolocation-service';
import { useDispatch } from 'react-redux';
import images from '../../../assets';
import localize from '../../../localization/translations';
import { SET_CURRENT_USER_LOCATION } from '../../../store/types';
import colors from '../../styles/colors';
import { hasLocationPermission } from '../../utilities/fetch-locations/location-permission';
import { checkIfpointWithinPolygon } from '../../utilities/geofencingUtil';
import { fontScale, scale } from '../../utilities/scale';;

const deviceWidth = Dimensions.get('window').width; 

const MapLatLong = ({ style = {}, onPress = () => { } }) => {
    // console.log(userCurrentLocation)
    const dispatch = useDispatch();
    const [userCurrentLocation, setUserCurrentLocation] = useState({latitude: 0, longtitude: 0})
    useEffect(() => {
        hasLocationPermission();
        Geolocation.getCurrentPosition(
            (position) => {
            //   console.log('getCurrentPosition',position);
              dispatch({ type: SET_CURRENT_USER_LOCATION,
                payload: {
                    lat: position?.coords?.latitude,
                    lon: position?.coords?.longitude,
                }});
              
              setUserCurrentLocation({latitude: position.coords.latitude, longtitude: position.coords.longitude});
            },
            (error) => {
              // See error code charts below.
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }, [])

    return (
        <View style={[styles.imageContainer, style]}>
            <Text style={{ color: colors.dark_grey, paddingHorizontal: 5, fontWeight: 'bold', fontSize: 13 }}>Lat: <Text style={{ fontWeight: 'normal'}}> {userCurrentLocation?.latitude?.toFixed(4)}</Text> Long: <Text style={{ fontWeight: 'normal'}}>{userCurrentLocation?.longtitude?.toFixed(4)}</Text>
                </Text>
        </View>
    )
}

export default MapLatLong;

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        zIndex: 20,
        elevation: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        left: scale(0),
        bottom: scale(0),
        backgroundColor: colors.white,
        borderWidth: 3.8,
        borderColor: colors.white,
        borderRadius: 2,
    },
    image: {
        flex: 1,
        width: scale(27),
        height: scale(27),
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    text: {
        fontSize: 8,
        color: colors.typo_grey_header,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: scale(15),
    },
    pressable: {
        flex: 1,
    }
})