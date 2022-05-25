
import React, { FC, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Switch,
} from 'react-native';
import MapboxGL from "@react-native-mapbox-gl/maps";
import { lineString as makeLineString, point } from '@turf/helpers';
import calculateDistance from '@turf/distance';
import { useDispatch, useSelector } from 'react-redux';

import MapLayout from '../../../shared/components/map-layout/map-layout';
import localize from '../../../localization/translations';
import { FloatingPanel } from '../../../shared/components/floating-panel/floating-panel.component';
import navigationService from '../../../navigation/navigationService';
import SVGGoBackLight from '../../../assets/nav-header/back-icon-light';
import GasStationSVGGray from '../../../assets/location/gas-station-gray.svg';
import GasStationSVGBlack from '../../../assets/location/gas-station-black.svg';
import colors from '../../../shared/styles/colors';
import { GeneralButton } from '../../../shared/components/buttons/general-button';
import CustomModal from '../../../shared/components/modal/modal.component';
import images from '../../../assets';
import MarkerLocationIcon from '../../../shared/components/map/map-marker-location-icon';
import { Alert } from 'react-native';
import { fontScale, IS_SMALL_DEVICE, scale } from '../../../shared/utilities/scale';
import { SET_CURRENT_USER_LOCATION, UPDATE_ACTIVITY_LOG } from '../../../store/types';
import { LOG_TYPES } from '../../../constants/logTypes';
import { hasLocationPermission } from '../../../shared/utilities/fetch-locations/location-permission';

const mapStyles = {
    currentLocation: {
        iconImage: images.location_current,
        iconAllowOverlap: true,
        iconRotate: 0,
        iconSize: 1.2,
        iconColor: colors.red_1,
    }
};

const LocationsJourneyScreen: FC = () => {
    const mapRef = useRef(null);
    const cameraRef = useRef(null);
    const preferredDistanceMeasurement = useSelector(({ userProfile }: any) => userProfile.preferredDistanceMeasurement);
    const currentLocationFormListner = useSelector(({ route }: any) => route.userCurrentLocation);
    const preferredFuelCapacityMeasurement = useSelector(({ userProfile }: any) => userProfile.preferredFuelCapacityMeasurement);
    const perDistanceFuelWastage = useSelector(({ userProfile }: any) => userProfile.perDistanceFuelWastage);
    const [showHelperMessage, setShowHelperMessage] = useState(true);
    const [hasTrackingEnabled, setHasTrackingEnabled] = useState(false);
    const [mapZoomLevel, setMapZoomLevel] = useState(16);
    const [endLocation, setEndLocation] = useState(null);
    const [startLocation, setStartLocation] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    // console.log('currentLocation', currentLocation)
    const [isShowSavedPointsEnabled, setIsShowSavedPointsEnabled] = useState(false);
    const savedLocations = useSelector(({ route }: any) => route?.points || []);
    const [followUserLocation, setFollowUserLocation] = useState(true);
    const [locationPoints, setLocationPoints] = useState([]);
    const dispatch = useDispatch();

    const [showDistanceModal, setShowDistanceModal] = useState(false);
    const [distance, setDistance] = useState('0');

    useEffect(() => {
        hasLocationPermission();
    }, [])

    const toggleSwitch = () => setIsShowSavedPointsEnabled(previousState => !previousState);

    const onPressFuelCheck = () => {
        if (!startLocation) {
            setStartLocation([currentLocationFormListner.lon, currentLocationFormListner.lat])
        }
        if (currentLocationFormListner && locationPoints.length > 0) {
            const _distance = calculateDistance(point([currentLocationFormListner.lon, currentLocationFormListner.lat]), point(locationPoints[locationPoints.length - 1]), { units: 'kilometers' });
            const _convertedDistance = ((preferredDistanceMeasurement?.convertionTOKM || 1) * _distance)?.toFixed(2)
            setDistance(_convertedDistance)
            setShowDistanceModal(true)
        }
    }

    const onPressStartTracking = () => {
        if (showHelperMessage) {
            setShowHelperMessage(false)
        }
        setStartLocation([currentLocationFormListner.lon, currentLocationFormListner.lat])
        setHasTrackingEnabled(true)
        dispatch({
            type: UPDATE_ACTIVITY_LOG,
            payload: [{
                time: new Date().toISOString(),
                logType: LOG_TYPES.START_JOURNEY,
                additionalInfo: JSON.stringify([currentLocationFormListner.lon, currentLocationFormListner.lat]),
            }]
        })
    }

    const onPressStopTracking = () => {
        setHasTrackingEnabled(false)
        setStartLocation(null)
        dispatch({
            type: UPDATE_ACTIVITY_LOG,
            payload: [{
                time: new Date().toISOString(),
                logType: LOG_TYPES.END_JOURNEY,
                additionalInfo: JSON.stringify(startLocation),
            }]
        })
    }

    const onPressMap = (obj) => {
        if (!hasTrackingEnabled && obj?.geometry?.type == 'Point') {
            setEndLocation(obj?.geometry?.coordinates);
            setStartLocation([currentLocationFormListner.lon, currentLocationFormListner.lat])
            setLocationPoints([...locationPoints, obj?.geometry?.coordinates])
        }
    }

    const onUserCurrentLocationUpdate = (obj) => {
        // console.log('onUserCurrentLocationUpdate-1', [obj?.coords?.longitude, obj?.coords?.latitude])
        // setCurrentLocation([obj?.coords?.longitude, obj?.coords?.latitude])
        dispatch({ type: SET_CURRENT_USER_LOCATION,
            payload: {
                lat: obj?.coords?.latitude,
                lon: obj?.coords?.longitude,
            }});
    }

    const renderSavedLocations = () => {
        if (isShowSavedPointsEnabled) {
            return savedLocations.map(e => (
                <MarkerLocationIcon
                    key={`saved-locatison-${e.id}`}
                    coordinate={[e?.point?.lon, e?.point?.lat]}
                    id={`${e.id}`}
                    title={e.name}
                />
            ))
        }
    }

    const clearEndLocation = (obj) => {
        setEndLocation(null);
        setLocationPoints(locationPoints.filter(e => e[0] != obj[0] && e[1] != obj[1]))
    }

    const removePinAlert = (obj) => {
        Alert.alert(
            localize.routes.confirmation,
            localize.routes.removePin,
            [
                {
                    text: localize.routes.confirm,
                    onPress: () => clearEndLocation(obj?.geometry?.coordinates),
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
                showCompass={true}
                showLatLong={true}
                onZoomIn={async () => { const _zoom = await mapRef?.current?.getZoom(); setMapZoomLevel(_zoom + 0.5); }}
                onZoomOut={async () => { const _zoom = await mapRef?.current?.getZoom(); setMapZoomLevel(_zoom - 0.5); }}
                onCurrentLocationFocus={() => { setFollowUserLocation(false); setTimeout(() => setFollowUserLocation(true), 10) }}
            >
                <FloatingPanel text={localize.locationJourney.helperMsg} hidden={!showHelperMessage} onPress={() => setShowHelperMessage(false)} />

                <View style={{ flex: 1, height: "100%", width: "100%" }}>
                    <MapboxGL.MapView
                        styleURL={MapboxGL.StyleURL.Street}
                        compassEnabled={true}
                        compassViewMargins={{ x: 24, y: 44 }}
                        logoEnabled={false}
                        style={{ flex: 1 }}
                        zoomEnabled={true}
                        attributionEnabled={false}
                        onPress={(obj) => !hasTrackingEnabled && onPressMap(obj)}
                        ref={mapRef}
                    >
                        <MapboxGL.Camera
                            ref={cameraRef}
                            zoomLevel={mapZoomLevel}
                            defaultSettings={{
                                centerCoordinate: [currentLocationFormListner.lon, currentLocationFormListner.lat] || [0, 0]
                            }}
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

                        {/* {endLocation &&
                            <MapboxGL.PointAnnotation
                                key="destinationPoint"
                                id="destinationPoint"
                                coordinate={endLocation}
                                draggable={!hasTrackingEnabled}
                                anchor={{ x: 0.5, y: 0.5 }}
                                onDragEnd={(obj) => onPressMap(obj)}
                                onSelected={(obj) => removePinAlert(obj)}
                            />} */}

                        {locationPoints.length > 0 &&
                            locationPoints.map(e => (
                                <MapboxGL.PointAnnotation
                                    key={`destinationPoint-${e[0]}`}
                                    id={`destinationPoint-${e[0]}`}
                                    coordinate={e}
                                    draggable={false}
                                    anchor={{ x: 0.5, y: 0.5 }}
                                    // onDragEnd={(obj) => onPressMap(obj)}
                                    onSelected={(obj) => removePinAlert(obj)}
                                />))}

                        {startLocation && hasTrackingEnabled && <MarkerLocationIcon
                            key="startPoint"
                            coordinate={startLocation}
                            draggable={false}
                            anchor={{ x: 0.5, y: 0.5 }}
                        />}

                        {renderSavedLocations()}

                        {/* {
                            currentLocation && endLocation &&
                            <MapboxGL.ShapeSource id='shapeSource' shape={makeLineString([currentLocation, endLocation])}>
                                <MapboxGL.LineLayer id='lineLayer' style={{ lineWidth: 2, lineJoin: 'bevel', lineColor: colors.typo_grey_header, lineDasharray: [3, 2.5] }} />
                            </MapboxGL.ShapeSource>
                        } */}


                        {
                            !hasTrackingEnabled && currentLocationFormListner && locationPoints.length > 0 &&
                            <MapboxGL.ShapeSource id='shapeSourceLength1' shape={makeLineString([[currentLocationFormListner.lon, currentLocationFormListner.lat], ...locationPoints.filter(e => e != null)])}>
                                <MapboxGL.LineLayer id='shapeSourceLength1' style={{ lineWidth: 2, lineJoin: 'bevel', lineColor: colors.typo_grey_header, lineDasharray: [3, 2.5] }} />
                            </MapboxGL.ShapeSource>
                        }
                        {
                            hasTrackingEnabled && startLocation && locationPoints.length > 0 &&
                            <MapboxGL.ShapeSource id='shapeSourceLength2' shape={makeLineString([startLocation, ...locationPoints.filter(e => e)])}>
                                <MapboxGL.LineLayer id='shapeSourceLength2' style={{ lineWidth: 2, lineJoin: 'bevel', lineColor: colors.typo_grey_header, lineDasharray: [3, 2.5] }} />
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
                    <View style={styles.rowTitleWrapper}>
                        <Text style={[styles.title, styles.lightFontWeight]} numberOfLines={1}>{localize.locationJourney.selectLocation}</Text>
                    </View>
                </View>

                <View style={styles.bottomButtonWrapper}>
                    <View style={styles.toggleSwitchContainer}>
                        <Switch
                            trackColor={{ false: colors.white, true: colors.white }}
                            thumbColor={isShowSavedPointsEnabled ? colors.secondary : colors.grey_2}
                            ios_backgroundColor={colors.white}
                            onValueChange={toggleSwitch}
                            value={isShowSavedPointsEnabled}
                        />
                        <Text style={styles.toggleSwitchText}>{isShowSavedPointsEnabled ? localize.locationJourney.hideSavedPoints : localize.locationJourney.showSavedPoints}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <GeneralButton
                            text={localize.locationJourney.check}
                            style={styles.btn1}
                            textStyle={styles.btnText}
                            backgroundColor={colors.white}
                            textColor={colors.secondary}
                            onPress={() => onPressFuelCheck()}
                            img={<GasStationSVGGray height={15} width={15} />}
                            disabled={locationPoints.length == 0}
                        />
                        {
                            hasTrackingEnabled ?
                                <GeneralButton
                                    text={localize.locationJourney.endJourney}
                                    style={styles.btn2}
                                    textStyle={styles.btnText}
                                    backgroundColor={colors.red_1}
                                    onPress={() => onPressStopTracking()}
                                    disabled={false}
                                /> :
                                <GeneralButton
                                    text={localize.locationJourney.startJourney}
                                    style={styles.btn2}
                                    textStyle={styles.btnText}
                                    backgroundColor={colors.green_1}
                                    onPress={() => onPressStartTracking()}
                                    disabled={locationPoints.length == 0}
                                />
                        }
                    </View>
                </View>

                {/* Sail distance liter modal */}
                <CustomModal
                    visible={showDistanceModal}
                    hideCloseBtn={true}
                    onClose={() => setShowDistanceModal(false)}
                >
                    <View style={styles.centerdContent}>
                        <Text style={[styles.textLight]}>{localize.locationJourney.toSail} {`${distance} ${preferredDistanceMeasurement?.[`label${localize.getLanguage()?.toUpperCase()}`]}`}, {localize.locationJourney.youNeed}</Text>
                        <View style={styles.modalFuelCountContainer}>
                            <GasStationSVGBlack height={20} width={20} />
                            <Text style={styles.textLiters}>{`${(distance * perDistanceFuelWastage).toFixed(3)} ${preferredFuelCapacityMeasurement?.[`label${localize.getLanguage()?.toUpperCase()}`]}`}</Text>
                        </View>
                        <Text style={{ fontSize: 12, fontStyle: 'italic'}}>({localize.locationJourney.roughFigures})</Text>

                        <View style={{ flex: 0, flexDirection: 'row', }}>
                            <GeneralButton
                                text={localize.locationJourney.viewSettings}
                                style={[styles.okayBtn, { borderWidth: 1, borderColor: colors.primary_dark, marginRight: 30, width: scale(180) }]}
                                textStyle={[styles.btnText, {color: colors.primary_dark}]}
                                backgroundColor={'transparent'}
                                onPress={() => {setShowDistanceModal(false); navigationService.navigate("Tab_profile", { scrollToFuelSettings: true})}}
                            />
                            <GeneralButton
                                text={localize.locationJourney.okay}
                                style={[styles.okayBtn]}
                                textStyle={styles.btnText}
                                backgroundColor={colors.secondary}
                                onPress={() => setShowDistanceModal(false)}
                            />
                        </View>
                    </View>
                </CustomModal>


            </MapLayout.ActionContainer>
        </MapLayout >
    );
};

export default LocationsJourneyScreen;


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
        fontSize: fontScale(18),
        fontWeight: '700',
        marginLeft: scale(8),
        color: colors.white
    },
    markMyRoute: {
        color: colors.white,
        fontSize: fontScale(18),
        fontWeight: '700',
        lineHeight: scale(24),
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
        textTransform: 'uppercase',
        textAlign: 'center',
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
    },
    toggleSwitchText: {
        fontSize: fontScale(15),
        lineHeight: 25,
        marginLeft: scale(10),
        color: colors.white,
    },
    toggleSwitchContainer: {
        flexDirection: IS_SMALL_DEVICE ? 'row' : 'row',
        alignItems: 'center',
        marginBottom: scale(IS_SMALL_DEVICE ? 5 : 15)
    },
    modalFuelCountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scale(10)
    },
    textLight: {
        color: colors.grey_3,
        fontSize: fontScale(14),
        lineHeight: 19,
    },
    textLiters: {
        color: colors.black,
        fontSize: fontScale(24),
        lineHeight: 33,
        marginLeft: scale(15)
    },
    okayBtn: {
        width: scale(110),
        borderRadius: 23,
        marginTop: scale(8),
        marginBottom: scale(-20)
    }
})