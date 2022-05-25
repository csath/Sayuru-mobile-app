
import React, { FC, useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native';
import moment from 'moment';
import MapboxGL from "@react-native-mapbox-gl/maps";
import { lineString as makeLineString } from '@turf/helpers';

import localize from '../../../localization/translations';
import colors from '../../../shared/styles/colors';
import navigationService from '../../../navigation/navigationService';
import SVGGoBackLight from '../../../assets/nav-header/back-icon-light';
import LocationSVG from '../../../assets/dashboard/location-pin.svg';
import MapLayout from '../../../shared/components/map-layout/map-layout';
import images from '../../../assets';
import { useSelector } from 'react-redux';
import { fontScale, scale } from '../../../shared/utilities/scale';


const RouteDetailsScreen: FC = ({ navigation: { state: { params } } }) => {
    const isRoute = params?.type == 'route';
    const routeDetails = params?.data;
    const mapRef = useRef(null);
    const [mapZoomLevel, setMapZoomLevel] = useState(15);
    const { preferredDistanceMeasurement, preferredFuelCapacityMeasurement } = useSelector(({ userProfile }: any) => userProfile);
    const routes = routeDetails?.points?.length == 0 ? [[0, 0], [0, 0]] : routeDetails?.points?.length < 2 ? [...(routeDetails?.points || [])?.map((e: any) => [e.lon, e.lat]), ...(routeDetails?.points || [])?.map((e: any) => [e.lon, e.lat])] : (routeDetails?.points)?.map((e: any) => [e.lon, e.lat])
    let lineRoute = routeDetails?.points ? makeLineString(routes) : null;

    return (
        <MapLayout>
            <MapLayout.MapContainer
                showMapDirection={false}
                showMyCurrentLocation={false}
                onZoomIn={async () => { const _zoom = await mapRef?.current?.getZoom(); setMapZoomLevel(_zoom + 0.5); }}
                onZoomOut={async () => { const _zoom = await mapRef?.current?.getZoom(); setMapZoomLevel(_zoom - 0.5); }}
            >
                <View style={{ flex: 1, height: "100%", width: "100%" }}>
                    <MapboxGL.MapView
                        styleURL={MapboxGL.StyleURL.Street}
                        compassEnabled={false}
                        logoEnabled={false}
                        style={{ flex: 1 }}
                        attributionEnabled={false}
                        ref={mapRef}
                    >
                        <MapboxGL.Camera
                            zoomLevel={mapZoomLevel}
                            defaultSettings={{
                                centerCoordinate: routeDetails?.points ? routes[Math.floor(routes.length / 2)] : [routeDetails?.point?.lon, routeDetails?.point?.lat]
                            }}
                            followUserLocation={true}
                            animationDuration={800}
                        />
                        <MapboxGL.MarkerView
                            key="startPoint"
                            id="startPoint"
                            coordinate={routeDetails?.points ? routes[0] : [routeDetails?.point?.lon, routeDetails?.point?.lat]}
                            title={routeDetails?.name}
                        >
                            <Image
                                source={images.location_current}
                                style={{ height: scale(18), width: scale(18), resizeMode: 'contain', tintColor: colors.red_1 }}
                            />
                        </MapboxGL.MarkerView>
                        {
                            routeDetails?.points &&
                            <MapboxGL.MarkerView
                                key="endPoint"
                                id="endPoint"
                                coordinate={routes[routes.length - 1]}
                            >
                                <Image
                                    source={images.location_marker}
                                    style={{ height: scale(34), width: scale(34), resizeMode: 'contain', tintColor: colors.red_1 }}
                                />
                            </MapboxGL.MarkerView>
                        }

                        {
                            routeDetails?.points &&
                            <MapboxGL.ShapeSource id='shapeSource' shape={lineRoute}>
                                <MapboxGL.LineLayer id='lineLayer' style={{ lineWidth: 2, lineJoin: 'bevel', lineColor: colors.typo_grey_header, lineDasharray: [3, 2.5] }} />
                            </MapboxGL.ShapeSource>
                        }

                    </MapboxGL.MapView>
                </View>

            </MapLayout.MapContainer>

            <MapLayout.ActionContainer>
                <View style={styles.backTitleRow}>
                    <TouchableOpacity onPress={() => navigationService.goBack()}>
                        <SVGGoBackLight height={scale(30)} width={scale(30)} />
                    </TouchableOpacity>
                    <View style={styles.rowTitleWrapper}>
                        <LocationSVG />
                        <Text style={styles.title}>{routeDetails?.name}</Text>
                    </View>
                </View>
                <View style={styles.detailContainer}>
                    {
                        isRoute ? <>
                            <View style={styles.detailRow}>
                                <Text style={styles.property}>{localize.routes.distance}:</Text>
                                <Text style={styles.value}>{`${(routeDetails?.distanceInKM * preferredDistanceMeasurement?.convertionTOKM).toFixed(4)} ${preferredDistanceMeasurement[`label${localize.getLanguage().toUpperCase()}`]}`}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.property}>{localize.routes.journeyDuration}:</Text>
                                <Text style={styles.value}>{moment.duration(moment(routeDetails?.endTimestamp).diff(moment(routeDetails?.startTimestamp))).as('h').toFixed(2)} h</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.property}>{localize.routes.sailedDate}:</Text>
                                <Text style={styles.value}>{moment(routeDetails?.startTimestamp).format('Do MMM, YYYY')}</Text>
                            </View>
                        </> :
                            <>
                                <View style={styles.detailRow}>
                                    <Text style={styles.property}>{localize.routes.locationName}:</Text>
                                    <Text style={styles.value}>{routeDetails?.name}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.property}>{localize.routes.markedDate}:</Text>
                                    <Text style={styles.value}>{moment(routeDetails?.timestamp).format('Do MMM, YYYY')}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.property}></Text>
                                    <Text style={styles.value}></Text>
                                </View>
                            </>
                    }
                </View>

            </MapLayout.ActionContainer>
        </MapLayout>
    );
};

export default RouteDetailsScreen;

const styles = StyleSheet.create({
    mapContainer: {
        flex: 5,
        width: '100%'
    },
    textContainer: {
        flex: 2,
        width: '100%',
        padding: scale(30)
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
        marginLeft: scale(30)
    },
    title: {
        fontSize: fontScale(18),
        fontWeight: '700',
        marginLeft: scale(8),
        color: colors.white
    },
    detailContainer: {
        paddingTop: scale(40),
        flex: 1,
        justifyContent: 'space-between',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    property: {
        flex: 2,
        color: colors.white,
    },
    value: {
        flex: 3,
        color: colors.white,
        fontSize: fontScale(20)
    }
})