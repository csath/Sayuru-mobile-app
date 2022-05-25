
import React, { FC, useCallback, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    RefreshControl,
    FlatList,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import moment from 'moment';

import localize from '../../../localization/translations';
import { NavHeader } from '../../../shared/components/navigation-header/nav-header.component';
import colors from '../../../shared/styles/colors';
import { DefaultStyles } from '../../../shared/styles/common-styles';
import { RoutesStyles as styles } from '../styles/routes.style';
import Arrowup from '../../../assets/form-icons/arrow-up.svg';
import Arrowdown from '../../../assets/form-icons/arrow-down.svg';
import LocationIcon from '../../../assets/form-icons/location.svg';
import ArrowForward from '../../../assets/form-icons/arrow-forward.svg';
import navigationService from '../../../navigation/navigationService';
import { useDispatch, useSelector } from 'react-redux';
import { SET_POINTS_LIST, SET_ROUTES_LIST } from '../../../store/types';
import { useEffect } from 'react';
import { scale } from '../../../shared/utilities/scale';
import * as SERVICES from '../../../services/all.service';

const { bgSeconday, bgWhite, scrollViewWrap } = DefaultStyles;

const RoutesMainScreen: FC = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [isRoutesVisible, setIsRoutesVisible] = useState(true);
    const [isLocationsVisible, setIsLocationsVisible] = useState(true);
    const { points, routes, routeServerSyncTimestamp, routeLocalSyncTimestamp, pointServerSyncTimestamp, pointLocalSyncTimestamp } = useSelector(({ route }: any) => route);
    const { id : userId, userToken } = useSelector(({ userProfile }: any) => userProfile);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await fetchData();
            setRefreshing(false);
        }
        catch (e) {
            setRefreshing(false);
        }
    }, []);

    const fetchData = async () => {
        try{
            const routes = await SERVICES.getRoutes(userId, userToken);
            const points = await SERVICES.getPoints(userId, userToken);

            if (routes && routes.data && routes.data?.isSuccess && routeLocalSyncTimestamp <= routeServerSyncTimestamp) {
                dispatch({
                    type: SET_ROUTES_LIST,
                    payload: routes.data?.data
                })
            }

            if (points && points.data && points.data?.isSuccess && pointLocalSyncTimestamp <= pointServerSyncTimestamp) {
                dispatch({
                    type: SET_POINTS_LIST,
                    payload: points.data?.data
                });
            }
        }
        catch(e)
        {}
    }

    return (
        <>
            <SafeAreaView style={bgSeconday}></SafeAreaView>
            <View style={DefaultStyles.containerWithNavBar}>
                <NavHeader
                    title={localize.routes.title}
                    darkContent={false}
                    bgColor={colors.secondary_background}
                />
                <View style={[{ flex: 1, width: '100%' }, bgSeconday]}>
                    <ScrollView
                        style={[scrollViewWrap, styles.scrollView]}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    >
                        {/* <Text style={styles.noData}>{localize.routes.noData}</Text> */}

                        <View style={styles.container}>
                            <TouchableOpacity
                                style={styles.titleContainer}
                                onPress={() => setIsRoutesVisible(!isRoutesVisible)}
                            >
                                <Text style={styles.title}>{localize.routes.mySavedRoutes}</Text>
                                {isRoutesVisible ? <Arrowup /> : <Arrowdown />}
                            </TouchableOpacity>
                            {
                                isRoutesVisible ?
                                    routes.length > 0 ?
                                        <FlatList
                                            data={[...routes].reverse()}
                                            ItemSeparatorComponent={() => <View style={styles.itemSeperator} />}
                                            ListHeaderComponent={() => <View style={styles.listheader} />}
                                            renderItem={({ item, index }) => <Row item={item} isHighlighted={index == 0} entityName="route" onPress={() => navigationService.navigate("RouteDetails", { data: item, type: 'route' })} />}
                                        />
                                        : <Text style={styles.noData}>{localize.routes.noSavedRoutes}</Text>
                                    : null
                            }
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.container}>
                            <TouchableOpacity
                                style={styles.titleContainer}
                                onPress={() => setIsLocationsVisible(!isLocationsVisible)}
                            >
                                <Text style={styles.title}>{localize.routes?.mySavedLocations}</Text>
                                {isLocationsVisible ? <Arrowup /> : <Arrowdown />}
                            </TouchableOpacity>
                            {
                                isLocationsVisible ?
                                    points.length > 0 ?
                                        <FlatList
                                            data={[...points].reverse()}
                                            ItemSeparatorComponent={() => <View style={styles.itemSeperator} />}
                                            ListHeaderComponent={() => <View style={styles.listheader} />}
                                            ListFooterComponent={() => <View style={styles.listFooter} />}
                                            renderItem={({ item, index }) => <Row item={item} isHighlighted={index == 0} entityName="location" onPress={() => navigationService.navigate("RouteDetails", { data: item, type: 'location' })} />}
                                        />
                                        : <Text style={styles.noData}>{localize.routes?.noSavedLocations}</Text>
                                    : null
                            }
                        </View>

                    </ScrollView>
                </View>
            </View>
        </>
    );
};

const Row = ({ item, isHighlighted, entityName, onPress }) => {
    return (
        <TouchableOpacity style={[styles.rowContainer, isHighlighted ? { backgroundColor: colors.secondary } : {}]} onPress={onPress}>
            <View style={styles.locationIconWrapper}>
                <LocationIcon height={scale(18)} width={scale(18)} style={{ marginTop: scale(8) }} />
            </View>
            <View style={styles.locationDescWrapper}>
                <Text style={styles.rowTitle}>{item.name}</Text>
                <Text style={[styles.rowSubTitle, isHighlighted ? { color: colors.white, opacity: 0.8 } : {}]}>{moment(item.timestamp ? item.timestamp : item.startTimestamp).format('DD MMM YYYY')} {isHighlighted ? entityName == 'location' ? `(${localize.routes?.lastSavedLocation})` : `(${localize.routes?.lastSavedRoute})` : ''}</Text>
            </View>
            <View style={styles.locationArrowWrapper}>
                <View style={[styles.arrowContainer, isHighlighted ? { backgroundColor: colors.primary } : {}]}>
                    <ArrowForward width={scale(16)} height={scale(16)} />
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default RoutesMainScreen;
