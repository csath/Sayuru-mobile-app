
import React, { FC, useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    PermissionsAndroid
} from 'react-native';
import { lineString as makeLineString } from '@turf/helpers';
import { v4 as uuidv4 } from 'uuid';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import lineDistance from '@turf/length';

import MapLayout from '../../../shared/components/map-layout/map-layout';
import localize from '../../../localization/translations';
import navigationService from '../../../navigation/navigationService';
import SVGGoBackLight from '../../../assets/nav-header/back-icon-light';
import LocationSVG from '../../../assets/dashboard/location-pin.svg';
import CurrentLocationSVG from '../../../assets/location/current-location.svg';
import CheckMarkSVG from '../../../assets/location/success.svg';
import colors from '../../../shared/styles/colors';
import { GeneralButton } from '../../../shared/components/buttons/general-button';
import CustomModal from '../../../shared/components/modal/modal.component';
import { FormInput } from '../../../shared/components/form-input/form-input.component';
import MapboxGL from '@react-native-mapbox-gl/maps';
import images from '../../../assets';
import MarkerLocationIcon from '../../../shared/components/map/map-marker-location-icon';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_POINT, ADD_ROUTE, ADD_TEMP_LOCATION, CLEAR_TEMP_LOCATION, SET_CURRENT_USER_LOCATION, UPDATE_ACTIVITY_LOG } from '../../../store/types';
import { fontScale, scale } from '../../../shared/utilities/scale';
import { LOG_TYPES } from '../../../constants/logTypes';
import { hasLocationPermission } from '../../../shared/utilities/fetch-locations/location-permission';
import { MapBox_Token } from '../../../../configs';

const LOCATION_ACCURACY = 20;

const mapStyles = {
    currentLocation: {
        iconImage: images.location_current,
        iconAllowOverlap: true,
        iconRotate: 0,
        iconSize: 1.2,
        iconColor: colors.red_1,
    }
};

const LocationsMainScreen: FC = () => {
    const mapRef = useRef(null);
    const [hasTrackingEnabled, setHasTrackingEnabled] = useState(false);
    const [mapZoomLevel, setMapZoomLevel] = useState(16);
    const [startLocation, setStartLocation] = useState(null);
    const currentLocationFormListner = useSelector(({ route }: any) => route.userCurrentLocation);
    const [currentLocation, setCurrentLocation] = useState([currentLocationFormListner.lon, currentLocationFormListner.lat]);
    const [isModalVisiblePointSaved, setIsModalVisiblePointSaved] = useState(false);
    const [isModalVisibleRouteSaved, setIsModalVisibleRouteSaved] = useState(false);
    const [isModalVisibleSavePoint, setIsModalVisibleSavePoint] = useState(false);
    const [isModalVisibleSaveRoute, setIsModalVisibleSaveRoute] = useState(false);
    const [routeName, setRouteName] = useState('');
    const [pointName, setPointName] = useState('');
    const [startTime, setStartTime] = useState('');
    const [mapCity, setMapCity] = useState('Sri Lanka');
    const [tempSavedLocation, setTempSavedLocation] = useState({ lat: 0, lon: 0 })
    const tempRoute = useSelector(({ route }: any) => route.tempLocations)
    const dispatch = useDispatch();
    const [followUserLocation, setFollowUserLocation] = useState(true);
    const [tempLocation, setTempLocation] = useState(null);

    const fetchCityName = ({ lat, lon }) => {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${MapBox_Token}&autocomplete=true`
        fetch(url)
            .then(res => res.json())
            .then(res => {
                // console.log(res)
                const place = res?.features.find(e => e.place_type?.includes('place')) || res?.features.find(e => e.place_type?.includes('city')) || res?.features.find(e => e.place_type?.includes('region')) || res?.features.find(e => e.place_type?.includes('country')) || res?.features.find(e => !!e)
                if (place) {
                    setMapCity(place.place_name)
                }
                else {
                    setMapCity('Sri Lanka')
                }
            })
    }

    const onUserCurrentLocationUpdate = (obj) => {
        if (!currentLocation) {
            fetchCityName({ lon: obj?.coords?.latitude, lat: obj?.coords?.longitude })
        }

        setCurrentLocation([obj?.coords?.longitude, obj?.coords?.latitude])
        dispatch({
            type: SET_CURRENT_USER_LOCATION,
            payload: {
                lat: obj?.coords?.latitude,
                lon: obj?.coords?.longitude,
            }
        })
    }

    const onPressSavePoint = () => {
        setTempSavedLocation({
            lat: tempLocation? tempLocation[1] : currentLocation ? currentLocation[1] : 0,
            lon: tempLocation? tempLocation[0] : currentLocation ? currentLocation[0] : 0,
        })
        setIsModalVisibleSavePoint(true)
    }

    const onSavePoint = () => {
        setIsModalVisibleSavePoint(false)
        setIsModalVisiblePointSaved(true)
        const loc = {
            id: uuidv4(),
            name: pointName,
            timestamp: new Date().toISOString(),
            point: {
                lat: tempSavedLocation?.lat || 0,
                lon: tempSavedLocation?.lon || 0,
            }
        }
        console.log('loc',loc)
        dispatch({
            type: ADD_POINT,
            payload: loc
        })
        dispatch({
            type: UPDATE_ACTIVITY_LOG,
            payload: [{
                time: new Date().toISOString(),
                logType: LOG_TYPES.SAVE_LOCATION_POINT,
                additionalInfo: JSON.stringify(loc),
            }]
        })

        setTimeout(() => setIsModalVisiblePointSaved(false), 900)
        setPointName('')
        setTempLocation(null);
    }

    const onSaveRoute = () => {
        BackgroundGeolocation.stop()
        setIsModalVisibleSaveRoute(false)
        setIsModalVisibleRouteSaved(true)
        setHasTrackingEnabled(false)
        const payload = {
            id: uuidv4(),
            name: routeName,
            startTimestamp: startTime,
            endTimestamp: new Date().toISOString(),
            distanceInKM: tempRoute.length < 2 ? 0 : lineDistance(makeLineString(tempRoute?.map(e => [e?.lon, e?.lat])), { units: 'kilometers' }),
            points: [...tempRoute]
        }
        dispatch({
            type: ADD_ROUTE,
            payload: payload
        })
        dispatch({
            type: UPDATE_ACTIVITY_LOG,
            payload: [{
                time: new Date().toISOString(),
                logType: LOG_TYPES.END_LIVE_TRACKING,
                additionalInfo: JSON.stringify(payload),
            }]
        })
        dispatch({ type: CLEAR_TEMP_LOCATION })
        setTimeout(() => setIsModalVisibleRouteSaved(false), 900)
        setRouteName('')
        setStartTime('')
        setCurrentLocation(null)
    }

    const onPressStartTracking = () => {
        dispatch({ type: CLEAR_TEMP_LOCATION })
        dispatch({
            type: UPDATE_ACTIVITY_LOG,
            payload: [{
                time: new Date().toISOString(),
                logType: LOG_TYPES.SAVE_LOCATION_POINT,
                additionalInfo: JSON.stringify(currentLocation),
            }]
        })
        BackgroundGeolocation.start()
        setStartLocation(currentLocation)
        setHasTrackingEnabled(true)
        setStartTime(new Date().toISOString())
    }

    const onPressStopTracking = () => {
        setIsModalVisibleSaveRoute(true)
    }

    useEffect(() => {
        hasLocationPermission();
        PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        );
        BackgroundGeolocation.configure({
            desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
            stationaryRadius: 50,
            distanceFilter: 50,
            notificationTitle: localize.locationTracking.trackingNotificationTitle,
            notificationText: localize.locationTracking.trackingNotificationBody,
            notificationIconColor: colors.green_1,
            debug: false,
            startOnBoot: false,
            stopOnTerminate: true,
            locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
            interval: 10000,
            fastestInterval: 5000,
            activitiesInterval: 10000,
            stopOnStillActivity: false,
            startForeground: true
        });

        BackgroundGeolocation.checkStatus(status => {
            if (status.isRunning) {
                BackgroundGeolocation.stop();
            }
        });

        BackgroundGeolocation.on('location', (location) =>
            dispatch({
                type: ADD_TEMP_LOCATION,
                payload: {
                    lat: location?.latitude,
                    lon: location?.longitude,
                }
            })
        );

        BackgroundGeolocation.on('authorization', (status) => {
            console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
            if (status !== BackgroundGeolocation.AUTHORIZED) {
                // we need to set delay or otherwise alert may not be shown
                setTimeout(() =>
                    Alert.alert(localize.locationTracking.locationTrackingPermissions, '', [
                        { text: localize.locationTracking.yes, onPress: () => BackgroundGeolocation.showAppSettings() },
                        { text: localize.locationTracking.no, onPress: () => console.log('No Pressed'), style: 'cancel' }
                    ]), 1000);
            }
        });

        BackgroundGeolocation.on('stop', () => {
            setHasTrackingEnabled(false)
        });

        return () => BackgroundGeolocation.removeAllListeners();
    }, [])

    const onPressMap = (obj) => {
        if (obj?.geometry?.type == 'Point') {
            setTempLocation(obj?.geometry?.coordinates);
        }
    }

    const removePinAlert = () => {
        Alert.alert(
            localize.routes.confirmation,
            localize.routes.removePin,
            [
                {
                    text: localize.routes.confirm,
                    onPress: () => setTempLocation(null),
                    style: 'default',
                },
                {
                    text: localize.routes.cancel,
                    style: 'cancel',
                }
            ]
        );
    }

    return (
        <MapLayout>
            <MapLayout.MapContainer
                showMapDirection={false}
                onZoomIn={async () => { const _zoom = await mapRef?.current?.getZoom(); setMapZoomLevel(_zoom + 0.5); }}
                onZoomOut={async () => { const _zoom = await mapRef?.current?.getZoom(); setMapZoomLevel(_zoom - 0.5); }}
                onCurrentLocationFocus={() => { setFollowUserLocation(false); setTimeout(() => setFollowUserLocation(true), 10) }}
                showCompass={true}
                showLatLong={true}
            >

                <View style={{ flex: 1, height: "100%", width: "100%" }}>
                    <MapboxGL.MapView
                        styleURL={MapboxGL.StyleURL.Street}
                        compassEnabled={true}
                        compassViewMargins={{ x: 24, y: 44 }}
                        logoEnabled={false}
                        style={{ flex: 1 }}
                        zoomEnabled={true}
                        attributionEnabled={false}
                        ref={mapRef}
                        onLongPress={(obj) => onPressMap(obj)}
                    >
                        <MapboxGL.Camera
                            zoomLevel={mapZoomLevel}
                            defaultSettings={{
                                centerCoordinate: currentLocation || [0, 0]
                            }}
                            // animationDuration={800}
                            followUserLocation={followUserLocation}
                        />
                        <MapboxGL.UserLocation
                            visible={true}
                            androidRenderMode={'compass'}
                            renderMode={'native'}
                            onUpdate={(obj) => onUserCurrentLocationUpdate(obj)}
                            children={[
                                <MapboxGL.SymbolLayer
                                    key="currentUser"
                                    id="currentUser"
                                    minZoomLevel={1}
                                    style={mapStyles.currentLocation}
                                />
                            ]}
                        />

                        {tempLocation &&
                            <MapboxGL.PointAnnotation
                                key="destinationPoint"
                                id="destinationPoint"
                                coordinate={tempLocation}
                                draggable={!hasTrackingEnabled}
                                anchor={{ x: 0.5, y: 0.5 }}
                                onDragEnd={(obj) => onPressMap(obj)}
                                onSelected={() => removePinAlert()}
                            />}

                        {startLocation && hasTrackingEnabled && <MarkerLocationIcon
                            key="startPoint"
                            coordinate={startLocation}
                            draggable={false}
                            anchor={{ x: 0.5, y: 0.5 }}
                        />}

                        {
                            hasTrackingEnabled && tempRoute.length >= 2 &&
                            <MapboxGL.ShapeSource id='shapeSource' shape={makeLineString(tempRoute?.map(e => [e?.lon, e?.lat]))}>
                                <MapboxGL.LineLayer id='lineLayer' style={{ lineWidth: 2, lineJoin: 'bevel', lineColor: colors.typo_grey_header, lineDasharray: [3, 2.5] }} />
                            </MapboxGL.ShapeSource>
                        }

                    </MapboxGL.MapView>
                </View>

            </MapLayout.MapContainer>

            <MapLayout.ActionContainer style={styles.actionContainer}>

                <View style={styles.backTitleRow}>
                    <TouchableOpacity onPress={() => navigationService.goBack()}>
                        <SVGGoBackLight height={scale(28)} width={scale(28)} />
                    </TouchableOpacity>
                    {
                        hasTrackingEnabled ?
                            <View style={styles.rowTitleWrapper}>
                                <CurrentLocationSVG height={scale(15)} width={scale(15)} />
                                <Text style={[styles.title, styles.lightFontWeight]}>{localize.locationTracking.liveTrackingStarted}</Text>
                            </View> :
                            <View style={styles.rowTitleWrapper}>
                                <LocationSVG />
                                <Text style={styles.title} numberOfLines={1}>{mapCity}</Text>
                            </View>
                    }
                </View>

                <View style={styles.bottomButtonWrapper}>
                    <Text style={styles.markMyRoute}>{localize.locationTracking.markmyRoute}</Text>
                    <View style={styles.buttonContainer}>
                        <GeneralButton
                            text={localize.locationTracking.savePoint}
                            style={styles.btn1}
                            textStyle={styles.btnText}
                            backgroundColor={colors.white}
                            textColor={colors.secondary}
                            onPress={() => onPressSavePoint()}
                            img={<CurrentLocationSVG height={15} width={15} />}
                        />
                        {
                            hasTrackingEnabled ?
                                <GeneralButton
                                    text={localize.locationTracking.stopNow}
                                    style={styles.btn2}
                                    textStyle={styles.btnText}
                                    backgroundColor={colors.red_1}
                                    onPress={() => onPressStopTracking()}
                                /> :
                                <GeneralButton
                                    text={localize.locationTracking.startNow}
                                    style={styles.btn2}
                                    textStyle={styles.btnText}
                                    backgroundColor={colors.green_1}
                                    onPress={() => onPressStartTracking()}
                                />
                        }
                    </View>
                </View>

                {/*  */}
                {/*  */}
                {/* Save route modal */}
                <CustomModal
                    visible={isModalVisibleSaveRoute}
                    hideCloseBtn={true}
                    onClose={() => setIsModalVisibleSaveRoute(false)}
                >
                    <View style={styles.inputModalContentWrapper}>
                        <Text style={styles.modalTitle}>{localize.locationTracking.saveRoute}</Text>
                        <FormInput
                            placeholder={localize.locationTracking?.routeName}
                            value={routeName}
                            onChangeText={(txt) => setRouteName(txt)}
                        />
                        <View style={styles.buttonContainer}>
                            <GeneralButton
                                text={localize.locationTracking.cancel}
                                style={[styles.btn2, styles.cancelBtn, styles.modalButtons]}
                                textStyle={styles.btnText}
                                textColor={colors.secondary}
                                backgroundColor={colors.white}
                                onPress={() => { setIsModalVisibleSaveRoute(false); BackgroundGeolocation.start(); }}
                            />
                            <GeneralButton
                                text={localize.locationTracking.save}
                                style={[styles.btn2, styles.modalButtons]}
                                textStyle={styles.btnText}
                                backgroundColor={colors.secondary}
                                disabled={!routeName}
                                onPress={() => onSaveRoute()}
                            />
                        </View>
                    </View>
                </CustomModal>

                {/* Save point modal */}
                <CustomModal
                    visible={isModalVisibleSavePoint}
                    onClose={() => setIsModalVisibleSavePoint(false)}
                    hideCloseBtn={true}
                >
                    <View style={styles.inputModalContentWrapper}>
                        <Text style={styles.modalTitle}>{localize.locationTracking.savePoint}</Text>
                        <FormInput
                            placeholder={localize.locationTracking?.pointName}
                            value={pointName}
                            onChangeText={(txt) => setPointName(txt)}
                        />
                        <View style={styles.buttonContainer}>
                            <GeneralButton
                                text={localize.locationTracking.cancel}
                                style={[styles.btn2, styles.cancelBtn, styles.modalButtons]}
                                textStyle={styles.btnText}
                                textColor={colors.secondary}
                                backgroundColor={colors.white}
                                onPress={() => setIsModalVisibleSavePoint(false)}
                            />
                            <GeneralButton
                                text={localize.locationTracking.save}
                                style={[styles.btn2, styles.modalButtons]}
                                textStyle={styles.btnText}
                                backgroundColor={colors.secondary}
                                disabled={!pointName}
                                onPress={() => onSavePoint()}
                            />
                        </View>
                    </View>
                </CustomModal>

                {/* Route saved modal */}
                <CustomModal
                    visible={isModalVisibleRouteSaved}
                    hideCloseBtn={true}
                >
                    <View style={styles.centerdContent}>
                        <CheckMarkSVG height={50} width={50} />
                        <Text style={styles.modalSuccessMessage}>{localize.locationTracking.routeSaved}</Text>
                    </View>
                </CustomModal>

                {/* Point saved modal */}
                <CustomModal
                    visible={isModalVisiblePointSaved}
                    hideCloseBtn={true}
                >
                    <View style={styles.centerdContent}>
                        <CheckMarkSVG height={50} width={50} />
                        <Text style={styles.modalSuccessMessage}>{localize.locationTracking.pointSaved}</Text>
                    </View>
                </CustomModal>


            </MapLayout.ActionContainer>
        </MapLayout>
    );
};

export default LocationsMainScreen;


const styles = StyleSheet.create({
    actionContainer: {
        paddingBottom: scale(10)
    },
    backTitleRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    rowTitleWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: scale(20)
    },
    title: {
        fontSize: fontScale(17),
        fontWeight: '600',
        marginLeft: scale(8),
        color: colors.white
    },
    markMyRoute: {
        color: colors.white,
        fontSize: fontScale(16),
        fontWeight: '600',
        lineHeight: 18,
        marginBottom: scale(10),
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: scale(10),
    },
    bottomButtonWrapper: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    btn1: {
        flex: 1,
        marginRight: scale(10)
    },
    btn2: {
        flex: 1,
        marginLeft: scale(10)
    },
    btnText: {
        textTransform: 'uppercase'
    },
    lightFontWeight: {
        fontWeight: 'normal',
    },
    modalSuccessMessage: {
        marginTop: scale(10),
        color: colors.grey_1,
        fontSize: fontScale(20),
        fontWeight: "700",
    },
    centerdContent: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: scale(20),
    },
    inputModalContentWrapper: {

    },
    modalTitle: {
        fontWeight: 'bold',
        fontSize: fontScale(16),
        lineHeight: 22,
        color: colors.black,
        marginBottom: scale(5),
    },
    cancelBtn: {
        borderColor: colors.grey_E3E3E3,
        borderWidth: 2,
    },
    modalButtons: {
        borderRadius: 23,
        marginHorizontal: scale(15)
    }
})