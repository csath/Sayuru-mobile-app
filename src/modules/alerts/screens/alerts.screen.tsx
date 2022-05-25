
import React, { FC, useCallback, useState } from 'react';
import {
    View,
    SafeAreaView,
    Text,
    ScrollView,
    RefreshControl,
} from 'react-native';
import moment from "moment";
import groupBy from 'lodash/groupBy';
import { AlertsStyles as sty } from '../styles/alerts.style';
import { DefaultStyles } from '../../../shared/styles/common-styles';
import { NavHeader } from '../../../shared/components/navigation-header/nav-header.component';
import { useDispatch, useSelector } from 'react-redux';
import { SingleListItem } from './single-item';
import localize from '../../../localization/translations';
import colors from '../../../shared/styles/colors';
import { useEffect } from 'react';
import { SET_ALERT_LIST } from '../../../store/types';
import * as SERVICES from '../../../services/all.service';
import { HIGH } from '../../../constants/alert-types';

const { bgPrimary, bgWhite, scrollViewWrap } = DefaultStyles;

const AlertScreen: FC = () => {
    const { alerts } = useSelector((state: any) => state.notification);
    const mobileNumber = useSelector(({ auth }) => auth.mobileNumber);
    const userId = useSelector(({ userProfile }) => userProfile.id);
    const userToken = useSelector(({ userProfile }) => userProfile.userToken);
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await fetchData();
            setRefreshing(false)
        }
        catch (e) {
            setRefreshing(false)
        }
    }, []);

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        // NEED TO IMPELEMENT DATA FETCHING PART
        SERVICES.getAlerts(userId, userToken)?.then(res => {
            console.log(res)
            if (res.data && res.data?.isSuccess) {

                dispatch({
                    type: SET_ALERT_LIST,
                    payload: [
                        ...res.data?.data
                    ]
                })
            }
        })
            .catch(e => {

            })

    }

    const grouped = groupBy((alerts || []), (e: any) => moment(e?.timeStamp).format('YYYY/MM/DD'));
    const todayAlerts = grouped[moment().format('YYYY/MM/DD')] || [];
    const oldAlerts = Object.keys(grouped).filter(e => moment().format('YYYY/MM/DD') != moment(e, 'YYYY/MM/DD').format('YYYY/MM/DD')).map(e => ({ date: e, oldItems: grouped[e] }))

    return (
        <>
            <SafeAreaView style={bgWhite}></SafeAreaView>
            <View style={DefaultStyles.containerWithNavBar}>
                <NavHeader
                    title={localize.alert.title}
                />
                {todayAlerts.length > 0 || oldAlerts.length > 0 ?
                    <ScrollView
                        style={[scrollViewWrap, { width: "100%" }]}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    >

                        {todayAlerts.length > 0 ?
                            <View style={[sty.segmentWrap, sty.segementToday, {backgroundColor: todayAlerts?.filter(e => e?.payload?.alertType == HIGH)?.length > 0 ? colors.red_1: colors.grey_1}]}>
                                <Text style={[sty.segementHeading, sty.segmentHeadingToday, todayAlerts?.filter(e => e?.payload?.alertType == HIGH)?.length > 0 ? {} : {color: 'white'}]}>{localize.alert.today}</Text>

                                {todayAlerts.map((item, index) => (
                                    <SingleListItem
                                        itemData={item}
                                        theme="light-text"
                                        key={`npotlist-${item.id}-${index}`}
                                        boldText={true}
                                        isLast={index == todayAlerts.length - 1}
                                    />
                                ))}
                            </View>
                            :
                            null
                        }

                        {oldAlerts.length > 0 ?
                            <View style={sty.segmentWrap}>
                                <Text style={[sty.segementHeading, sty.oldAlertsTitle]}>{localize.alert.old}</Text>

                                {oldAlerts.map((item, index) => (
                                    <View key={`lkey-${index}`}>
                                        <Text style={sty.oldDateText}>{moment(item.date, 'YYYY/MM/DD').format("dddd, YYYY/MM/DD")}</Text>

                                        <>
                                            {
                                                item.oldItems.map((innerItem, index) => (
                                                    <SingleListItem
                                                        itemData={innerItem}
                                                        theme="dark-text"
                                                        key={innerItem.id}
                                                        isLast={index == item.oldItems.length - 1}
                                                    />
                                                ))}
                                        </>
                                    </View>
                                ))}
                            </View>
                            :
                            null
                        }
                    </ScrollView>
                    :
                    <ScrollView
                        contentContainerStyle={[scrollViewWrap, { width: "100%", height: '100%' }]}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    >
                        <View style={[DefaultStyles.container, { backgroundColor: colors.primary_background }]}>
                            <Text>{localize.alert.noAlerts}</Text>
                        </View>
                    </ScrollView>
                }
            </View>
            <SafeAreaView style={bgPrimary}></SafeAreaView>
        </>
    );

};


export default AlertScreen;
