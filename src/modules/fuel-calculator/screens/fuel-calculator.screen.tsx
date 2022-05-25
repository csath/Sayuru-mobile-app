
import React, { FC, useEffect, useState } from 'react';
import {
    View,
    SafeAreaView,
    Text,
    TextInput,
    Alert,
    TouchableOpacity,
} from 'react-native';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';

import { DefaultStyles } from '../../../shared/styles/common-styles';
import { NavHeader } from '../../../shared/components/navigation-header/nav-header.component';
import { useSelector, useDispatch } from 'react-redux';
import { FuelCalcStyles as sty } from '../styles/fuel-calculator.style';
import { PrimaryBtn } from '../../../shared/components/buttons/primary-btn.component';
import localize from '../../../localization/translations';
import EditIcon from '../../../assets/form-icons/edit.svg';
import navigationService from '../../../navigation/navigationService';
import { scale } from '../../../shared/utilities/scale';

const { bgPrimary, bgWhite, scrollViewWrap } = DefaultStyles;

const FuelCalculatorScreen: FC = () => {

    const dispatch = useDispatch();

    const { latestLat, latestLon, forecastDaily } = useSelector((state: any) => ({
        latestLat: state.userProfile.latestLat,
        latestLon: state.userProfile.latestLon,
        forecastDaily: state.weather.forecastData.daily
    }));

    useEffect(() => {
        (async () => {

        })();
    }, []);

    const [economy, seteconomy] = useState('0.00');
    const [travelDist, settravelDist] = useState('0');
    const [calcResult, setcalcResult] = useState('0');

    const calcEconomy = () => {
        try {
            const res = parseFloat(economy) * parseFloat(travelDist);
            setcalcResult(res.toString())
            if (res == 0) {
                Alert.alert(localize.fuelCalculator.invalidInputs, localize.fuelCalculator.errormsg)
            }
        } catch (e) {
            Alert.alert(localize.fuelCalculator.invalidInputs, localize.fuelCalculator.errormsg)
        }
    }

    return (
        <>
            <SafeAreaView style={bgWhite}></SafeAreaView>
            <View style={DefaultStyles.containerWithNavBar}>
                <NavHeader
                    title={localize.fuelCalculator.title}
                />
                <KeyboardAwareView style={[sty.outerCont]} animated={true} useNativeDriver={true}>
                    <View style={sty.flex2}>
                        <Text style={sty.calcFuel}>{localize.fuelCalculator.calculateFuelUsage}</Text>
                        <View style={sty.inputWrap}>
                            <Text style={sty.inputHeaders}>{localize.fuelCalculator?.fuelConsumption}</Text>
                            <View>
                                <TextInput
                                    style={sty.textInput}
                                    onChangeText={(text: string) => seteconomy(text)}
                                    value={economy}
                                />
                                <Text style={sty.measurementType}>nmi per liter</Text>
                            </View>
                            <Text style={sty.inputHeaders}>{localize.fuelCalculator?.distanceYouNeedToGo}</Text>
                            <View>
                                <TextInput
                                    style={sty.textInput}
                                    onChangeText={(text: string) => settravelDist(text)}
                                    value={travelDist}
                                />
                                <Text style={sty.measurementType}>nmi</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={sty.changeMeasurementWrapper} onPress={() => navigationService.navigate('Tab_profile', { scrollTobottom: true})}>
                            <EditIcon width={scale(15)} height={scale(15)} fill={'red'} />
                            <Text style={sty.changeMeasurement}>{localize.fuelCalculator.changeMeasurement}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={sty.resultsWrap}>
                        {
                            calcResult !== '0' ?
                                <Text style={sty.ecoResultTxt}>{localize.fuelCalculator?.youNeed}{' '}
                                    <Text style={sty.ecoResultNum}>{calcResult}</Text>
                                    <Text>{' '}{localize.fuelCalculator?.liters}</Text>
                                </Text>
                                :
                                null
                        }
                    </View>
                    <View style={sty.calcBtnWrap}>
                        <PrimaryBtn
                            text={localize.fuelCalculator?.calculate}
                            onPress={() => { calcEconomy() }}
                        />
                    </View>
                </KeyboardAwareView>
            </View>
            <SafeAreaView style={bgWhite}></SafeAreaView>
        </>
    );
};

export default FuelCalculatorScreen;
