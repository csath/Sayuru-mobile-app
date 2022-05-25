import React, { FC, useEffect, useState } from 'react';
import {
    View,
    BackHandler,
    Text,
    Keyboard,
    ToastAndroid,
} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { useActionSheet } from '@expo/react-native-action-sheet'
import _ from 'lodash';

import { AuthStyles as sty } from '../styles/auth.style';
import { DefaultStyles } from '../../../shared/styles/common-styles';
import navigationService from '../../../navigation/navigationService';
import { FormHeader } from '../components/form-header.component';
import { FormInput } from '../../../shared/components/form-input/form-input.component';
import { LoginBackground } from '../components/loginBackground';
import localize from '../../../localization/translations';
import { PrimaryBtn } from '../../../shared/components/buttons/primary-btn.component';
import { openPrivacyPolicy, openTermsAndConditions } from '../../../shared/utilities/operations';
import { DISTRICT_LIST } from '../../../constants/districts';
import { useDispatch, useSelector } from 'react-redux';
import { SET_ZONES, UPDATE_USER_PROFILE, USER_LOG_IN } from '../../../store/types';
import * as API_SERVICE from '../../../services/all.service';
import { listenToTopics } from '../../../shared/utilities/network-communication/push/util/notification-get-token';
import { getLangKey } from '../../../shared/utilities/localizationHelper';

const { bgWhite, contentWrapper } = DefaultStyles;

const SignUpScreen: FC = ({ navigation: { state: { params } } }) => {
    const { showActionSheetWithOptions } = useActionSheet();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthday, setBirthday] = useState(new Date());
    const [nic, setNic] = useState('');
    const [district, setDistrict] = useState(DISTRICT_LIST[4]);
    const [zones, setZones] = useState([]);
    const [error, setError] = useState({
        firstName: false,
        lastName: false,
        birthday: false,
        nic: false,
        district: false,
        zones: false,
    });
    const ZONES = useSelector(({data}) => data.zones);
    const [isLoading, setIsLoading] = useState(false);

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [iskeyboardShown, setKeyboardStatus] = useState(false);
    const dispatch = useDispatch()

    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

        // cleanup function
        return () => {
            Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
            Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
        };
    }, []);

    useEffect(() => {
        if (params.isNewUser) {
            const backAction = () => {
                BackHandler.exitApp();
                return true;
            };

            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                backAction
            );

            return () => backHandler.remove();
        }
    }, []);

    useEffect(() => {
        API_SERVICE.getZones()?.then(res => {

            if (res?.data?.isSuccess) {
                dispatch({
                    type: SET_ZONES,
                    payload: res?.data?.data
                })
            }
        }).catch(() => {})
    }, [])

    const _keyboardDidShow = () => setKeyboardStatus(true);
    const _keyboardDidHide = () => setKeyboardStatus(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleBirthdayConfirm = (date) => {
        setBirthday(date);
        hideDatePicker();
    };

    const selectDistrict = () => {
        showActionSheetWithOptions(
            {
                options: [...DISTRICT_LIST.map(e => e[`label${localize.getLanguage()?.toUpperCase()}`]), localize.myProfile.cancel],
                cancelButtonIndex: DISTRICT_LIST.length,
                destructiveButtonIndex: DISTRICT_LIST.length,
                title: localize.myProfile.selectDistrict,
                showSeparators: true,
                textStyle: { textAlign: 'center', width: '100%' },
                titleTextStyle: { textAlign: 'center', width: '100%' },
                useModal: true,
            },
            (buttonIndex: number) => {
                if (buttonIndex < DISTRICT_LIST.length) {
                    setDistrict(DISTRICT_LIST[buttonIndex])
                }
            }
        );
    }

    const selectZones = () => {
        showActionSheetWithOptions(
            {
                options: [...ZONES.map(e => ((zones || [])?.find(i => i.id == e.id) ? "✓ " : "  ") + e[`${localize.getLanguage()?.toLowerCase()}_name`] + "  "), localize.myProfile.cancel],
                cancelButtonIndex: ZONES.length,
                destructiveButtonIndex: ZONES.length,
                title: localize.myProfile.allZones,
                showSeparators: true,
                textStyle: { textAlign: 'center', width: '100%' },
                titleTextStyle: { textAlign: 'center', width: '100%' },
                useModal: true,
            },
            (buttonIndex: number) => {
                setError({ ...error, zones: false });
                if (buttonIndex < ZONES.length) {
                    if ((zones || [])?.find(e => e.id == ZONES[buttonIndex]?.id)) {
                        setZones(e => [...(e?.filter(e => e.id != ZONES[buttonIndex]?.id))])
                    }
                    else {
                        setZones(e => [...e, ZONES[buttonIndex]]?.sort((a, b) => a.id - b.id))
                    }
                }
            }
        );
    }

    const isValidPayload = () => {
        const reg = /^[a-zA-Z]+$/;
        const regNic = /^([0-9]{9}[x|X|v|V]|[0-9]{12})$/;
        const err = {
            firstName: !firstName ? localize.signup.firstNameMissing : firstName && !reg.test(firstName) ? localize.signup.firstNameInvalid : false,
            lastName: !lastName ? localize.signup.lastNameMissing : lastName && !reg.test(lastName) ? localize.signup.lastNameInvalid : false,
            birthday: !birthday ? localize.signup.birthdayMissing : false,
            nic: !nic ? localize.signup.nicMissing : nic && !regNic.test(nic) ? localize.signup.nicInvalid : false,
            district: !district ? localize.signup.districtMissing : false,
            zones: !zones.length ? localize.signup.zoneMissing : false,
        };
        setError(err);
        return !_.values(err).some(e => e !== false);
    }

    const onRegister = () => {
        if (isValidPayload()) {
            setIsLoading(true);

            const user = {
                firstName: firstName,
                lastName: lastName,
                preferedLanguage: getLangKey(localize.getLanguage()),
                mobileNumber: params.mobileNumber,
                nic: nic,
                birthDate: birthday,
                district: district,
                zones: zones,
                id: params.userId
            }
            API_SERVICE.updateUser(user, params.userToken)?.then(res => {
                console.log(res)
                if (res.data && res.data?.isSuccess) {
                    dispatch({
                        type: UPDATE_USER_PROFILE,
                        payload: res.data?.data,
                    })
                    dispatch({
                        type: USER_LOG_IN,
                        payload: params.mobileNumber,
                    })
                    navigationService.navigate('VerifiedUser', {})

                    listenToTopics(res.data?.data?.zones?.map((e: any) => e.id), true);
                    
                }
                else {
                    ToastAndroid.show(
                        'Unable signup for Sayuru.',
                        ToastAndroid.LONG,
                    );
                }
            }).catch(e => {
                console.log(e)
                ToastAndroid.show(
                    'Unable signup for Sayuru.',
                    ToastAndroid.LONG,
                );
            }).finally(() => {
                setIsLoading(false);
            })
        }
    }

    return (
        <LoginBackground onBackPressed={() => navigationService.goBack()} showBackButton={!params.isNewUser}>
            <View style={[contentWrapper, bgWhite, { flex: 1 }]}>
                <FormHeader title={localize.signup.createAccount} />
                <View style={{ flex: 2 }}>
                    <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                        <FormInput
                            iconType="user-circle"
                            placeholder={localize.signup?.firstName}
                            onChangeText={(val) => { setFirstName(val); setError({ ...error, firstName: false }); }}
                            value={firstName}
                            textContentType={"name"}
                            error={error.firstName}
                        />
                        <FormInput
                            iconType="user"
                            placeholder={localize.signup?.lastName}
                            onChangeText={(val) => { setLastName(val); setError({ ...error, lastName: false }); }}
                            value={lastName}
                            error={error.lastName}
                        />
                        <FormInput
                            iconType="nic"
                            placeholder={localize.signup?.nic}
                            onChangeText={(val) => { setNic(val); setError({ ...error, nic: false }); }}
                            value={nic}
                            error={error.nic}
                        />
                        <FormInput
                            iconType="location"
                            placeholder={localize.signup?.birthday}
                            value={moment(birthday).format('YYYY/MM/DD')}
                            isKeyboardInput={false}
                            hideDownArrow={true}
                            onPress={showDatePicker}
                            error={error.birthday}
                        />
                        <FormInput
                            iconType="location"
                            placeholder={localize.signup?.district}
                            value={district[`label${localize.getLanguage()?.toUpperCase()}`]}
                            isKeyboardInput={false}
                            error={error.district}
                            onPress={() => selectDistrict()}
                        />
                        <FormInput
                            iconType="location"
                            placeholder={localize.signup?.zones}
                            value={(zones || [])?.map(e => e[`${localize.getLanguage()?.toLowerCase()}_name`])?.join(', ')}
                            isKeyboardInput={false}
                            error={error.zones}
                            multiline={true}
                            onPress={() => selectZones()}
                        />
                    </KeyboardAwareScrollView>
                </View>

                <View style={[sty.requestOtpDiscl, { marginTop: 0 }]}>
                    <PrimaryBtn
                        text={localize.signup?.register}
                        onPress={() => onRegister()}
                        // disabled={(!firstName || !lastName || !nic || !birthday || !district || !zones.length)}
                        disabled={isLoading}
                        marginTop={20}
                    />
                    {
                        !iskeyboardShown && (
                            <View style={sty.disclaimerWrap}>
                                <Text style={sty.disclaimerTextBase} >{localize.signup?.agreement1}{"\n"}
                                    <Text style={sty.disclaimerHighlights} onPress={() => openTermsAndConditions()}>{localize.signup?.termsAndCond}</Text>
                                    <Text style={sty.disclaimerTextBase}> {localize.signup?.agreement2} </Text><Text style={sty.disclaimerHighlights} onPress={() => openPrivacyPolicy()}>{localize.signup?.privacyPolicy}</Text>
                                </Text>
                            </View>
                        )
                    }
                </View>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleBirthdayConfirm}
                    onCancel={hideDatePicker}
                    date={birthday}
                />
            </View>
        </LoginBackground>
    );
};

export default SignUpScreen;
