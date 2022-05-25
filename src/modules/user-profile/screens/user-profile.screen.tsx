import React, { useRef, FC, Fragment, useState } from 'react';
import {
    View,
    SafeAreaView,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    SectionList,
    RefreshControl,
    Alert,
    ToastAndroid,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useActionSheet } from '@expo/react-native-action-sheet'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import _ from 'lodash';
import VersionInfo from 'react-native-version-info';

import { UserStyles as sty } from '../styles/user-profile.style';
import { DefaultStyles } from '../../../shared/styles/common-styles';
import { NavHeader } from '../../../shared/components/navigation-header/nav-header.component';
import { TabBar } from '../components/tab-bar.component';
import colors from '../../../shared/styles/colors';
import { PrimaryBtn } from '../../../shared/components/buttons/primary-btn.component';
import ICprofileAvatar from '../../../assets/profile/profile_avatar.svg';
import { fontScale, scale } from '../../../shared/utilities/scale';
import localize from '../../../localization/translations';
import { FormInput } from '../../../shared/components/form-input/form-input.component';
import FuelEdit from '../../../assets/form-icons/fuel-edit.svg';
import ProfileEdit from '../../../assets/form-icons/profile-edit.svg';
import CameraEdit from '../../../assets/profile/edit-camera.svg';
import { GeneralButton } from '../../../shared/components/buttons/general-button';
import { DISTRICT_LIST } from '../../../constants/districts';
import { DISTANCE_MEASUREMENTS } from '../../../constants/distanceMeasurements';
import { FUEL_CAPACITY_MEASUREMENTS } from '../../../constants/fuelCapacityMeasurements';
import { LANGUAGES } from '../../../constants/languages';
import { CLEAR_ACTIVITY_LOG, SET_ACTIVITY_LOG, SET_LANGUAGE, SET_ZONES, UPDATE_ACTIVITY_LOG, UPDATE_USER_PROFILE } from '../../../store/types';
// import { ZONES } from '../../../constants/zones';
import { useEffect } from 'react';
import { isValidPhoneNumber } from '../../../shared/utilities/formValidators/validators';
import * as SERVICES from '.././../../services/all.service';
import { LOG_TYPES } from '../../../constants/logTypes';
import { listenToTopics } from '../../../shared/utilities/network-communication/push/util/notification-get-token';

const { bgPrimary, bgWhite, contentWrapper, outermostContainer } = DefaultStyles;
const windowHeight = Dimensions.get('window').height;
const profileImgWidth = scale(90);

const UserProfileScreen: FC = ({ navigation: { state: { params } } }) => {
    const [currentTab, setCurrentTab] = useState(1);
    const { showActionSheetWithOptions } = useActionSheet();
    const [refreshing, setRefreshing] = useState(false);
    const userProfile = useSelector(state => state?.userProfile);
    const activityLog = useSelector(state => state?.activityLog);
    const ZONES = useSelector(state => state?.data?.zones);
    const dispatch = useDispatch();
    const [isDirtyProfile, setIsDirtyProfile] = useState(false);
    const [isDirtySettings, setIsDirtySettings] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [showIVRBtn, setShowIVRBtn] = useState(!userProfile?.hasRegisteredIVR);
    const [firstName, setFirstName] = useState(userProfile.firstName);
    const [lastName, setLastName] = useState(userProfile.lastName);
    const [language, setLanguage] = useState(LANGUAGES.find(i => i?.key == localize.getLanguage()));
    const [fishermanId, setFishermanId] = useState(userProfile.fishermanID);
    const [nic, setNic] = useState(userProfile.nic);
    const [phoneNumber, setPhoneNumber] = useState(userProfile.mobileNumber);
    const [emergencyContact, setEmergencyContact] = useState(userProfile.emergencyContact);
    const [district, setDistrict] = useState(userProfile.district);
    const [preferredFuelCapacity, setPreferredFuelCapacity] = useState(userProfile.preferredFuelCapacityMeasurement);
    const [preferredDistance, setPreferredDistance] = useState(userProfile.preferredDistanceMeasurement);
    const [birthday, setBirthday] = useState(new Date(userProfile.birthDate) || new Date());
    const [zones, setZones] = useState(userProfile.zones || []);
    const [profilePic, setProfilePic] = useState(userProfile?.profilePicture);
    const [perDistanceFuelWastage, setPerDistanceFuelWastage] = useState(userProfile?.perDistanceFuelWastage);
    const [error, setError] = useState({});
    const dataReducer = useSelector(state => state?.data);
    const scrollRef = useRef(null);

    const onRefresh = React.useCallback(async () => {
        fetchData();
    }, []);

    useEffect(() => {
        setProfilePic(userProfile?.profilePicture)
    }, [userProfile?.profilePicture])

    useEffect(() => {
        setFishermanId(userProfile?.fishermanID)
    }, [userProfile?.fishermanID])

    useEffect(() => {
        setNic(userProfile?.nic)
    }, [userProfile?.nic])

    useEffect(() => {
        setShowIVRBtn(!userProfile?.hasRegisteredIVR)
    }, [userProfile?.hasRegisteredIVR])

    useEffect(() => {
        fetchData();

        if (!dataReducer?.hasDataFetched) {
            SERVICES.getZones()?.then(res => {
                if (res?.data?.isSuccess) {
                    dispatch({
                        type: SET_ZONES,
                        payload: res?.data?.data
                    })
                }
            }).catch(() => { })
        }
    }, [])

    useEffect(() => {
        if (params?.scrollToFuelSettings) {
            setCurrentTab(1);
            setTimeout(() => scrollRef.current?.scrollToBottom(), 200)
        }
    }, [params])

    // NEED TO IMPLEMENT API CALLS
    const fetchData = async () => {
        setRefreshing(true);
        try {
            const userInfo = await SERVICES.getUser(phoneNumber, userProfile.id, userProfile.userToken);
            const acitivityLogInfo = await SERVICES.getActivityLog(userProfile.id, userProfile.userToken);
            if (userInfo && userInfo.data && userInfo.data?.isSuccess) {
                const emg = `${userInfo.data?.data?.emergencyContact || ""}`;
                
                if (!emg?.startsWith('0') && emg.length > 1) {
                    userInfo.data.data.emergencyContact = `0${userInfo.data?.data?.emergencyContact}`;
                }

                dispatch({
                    type: UPDATE_USER_PROFILE,
                    payload: userInfo.data?.data
                });
            }
            if (acitivityLogInfo && acitivityLogInfo.data && acitivityLogInfo.data?.isSuccess) {
                dispatch({
                    type: SET_ACTIVITY_LOG,
                    payload: acitivityLogInfo.data?.data
                })
            }
            setRefreshing(false);

        }
        catch (e) {
            console.log(e)
            setRefreshing(false);
            ToastAndroid.show(
                'Unable to connect with Sayuru API.',
                ToastAndroid.LONG,
            );
        }
        finally {
            setRefreshing(false);
        }
    }

    const registerForSayuruService = () => {
        setRefreshing(true);
        SERVICES.registerForIVR(phoneNumber, userProfile.id, userProfile.userToken)?.then(res => {
            console.log('res', res)
            if (res.data && res.data?.isSuccess && res.data?.data?.hasRegisteredIVR) {
                dispatch({
                    type: UPDATE_USER_PROFILE,
                    payload: {
                        hasRegisteredIVR: res.data?.data?.hasRegisteredIVR,
                    }
                })
                dispatch({
                    type: UPDATE_ACTIVITY_LOG,
                    payload: [{
                        time: new Date().toISOString(),
                        logType: LOG_TYPES.REGISTER_FOR_IVR,
                        additionalInfo: ""
                    }]
                })
                Alert.alert(localize.myProfile.serviceRegistered, localize.myProfile.serviceRegisteredMsg)
                setShowIVRBtn(false);
            }
            else {
                ToastAndroid.show(
                    'Unable to register for IVR service.',
                    ToastAndroid.LONG,
                );
            }
        }).catch(e => {
            ToastAndroid.show(
                'Unable to register for IVR service.',
                ToastAndroid.LONG,
            );
        })
            .finally(() => {
                setRefreshing(false);
            })
    }

    const openGallery = () => {
        launchImageLibrary({
            mediaTypes: 'Images',
            allowsEditing: true,
            includeBase64: true,
            maxWidth: 300,
            maxHeight: 300,
        }, response => {
            if (response.base64) {
                setProfilePic(response.base64)
                setIsDirtyProfile(true)
            }
        })
    }

    const openCamera = () => {
        launchCamera({
            mediaType: 'photo',
            includeBase64: true,
            maxWidth: 300,
            maxHeight: 300,
            cameraType: 'front'
        }, response => {
            if (response.base64) {
                setProfilePic(response.base64)
                setIsDirtyProfile(true)
            }
        })
    }

    const openProfilePicCapturing = () => {
        showActionSheetWithOptions(
            { 
                options: [localize.myProfile.openCamera, localize.myProfile.openGallery, localize.myProfile.cancel],
                cancelButtonIndex: 2,
                destructiveButtonIndex: 2,
                title: localize.myProfile.selectProfilePic,
                showSeparators: true,
                textStyle: { textAlign: 'center', width: '100%' },
                titleTextStyle: { textAlign: 'center', width: '100%' },
                useModal: true,
            },
            (buttonIndex: number) => {
                if (buttonIndex == 0) {
                    openCamera()
                }
                else if (buttonIndex == 1) {
                    openGallery()
                }
            }
        )
    }

    const getImageURI = (base64String) => {
        return ({ uri: `data:image/png;base64, ${base64String}` })
    }

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setBirthday(date);
        hideDatePicker();
        setIsDirtyProfile(true)
    };

    const selectDistrict = () => {
        showActionSheetWithOptions(
            {
                options: [...DISTRICT_LIST.map(e => e?.[`label${localize.getLanguage()?.toUpperCase()}`]), localize.myProfile.cancel],
                cancelButtonIndex: DISTRICT_LIST.length,
                destructiveButtonIndex: DISTRICT_LIST.length,
                title: localize.myProfile.selectDistrict,
                showSeparators: true,
                textStyle: { textAlign: 'center', width: '100%' },
                titleTextStyle: { textAlign: 'center', width: '100%' },
                useModal: true,
            },
            (buttonIndex: number) => {
                setError({ ...error, district: false });
                if (buttonIndex < DISTRICT_LIST.length) {
                    setDistrict(DISTRICT_LIST[buttonIndex])
                    setIsDirtyProfile(true)
                }
            }
        );
    }

    const selectDistanceMeasurement = () => {
        showActionSheetWithOptions(
            {
                options: [...DISTANCE_MEASUREMENTS.map(e => e?.[`label${localize.getLanguage()?.toUpperCase()}`]), localize.myProfile.cancel],
                cancelButtonIndex: DISTANCE_MEASUREMENTS.length,
                destructiveButtonIndex: DISTANCE_MEASUREMENTS.length,
                title: localize.myProfile.distanceMeasurement,
                showSeparators: true,
                textStyle: { textAlign: 'center', width: '100%' },
                titleTextStyle: { textAlign: 'center', width: '100%' },
                useModal: true,
            },
            (buttonIndex: number) => {
                setError({ ...error, preferredDistance: false });
                if (buttonIndex < DISTANCE_MEASUREMENTS.length) {
                    setPreferredDistance(DISTANCE_MEASUREMENTS[buttonIndex])
                    setIsDirtySettings(true)
                }
            }
        );
    }

    const selectFuelCapacityMeasurement = () => {
        showActionSheetWithOptions(
            {
                options: [...FUEL_CAPACITY_MEASUREMENTS.map(e => e?.[`label${localize.getLanguage()?.toUpperCase()}`]), localize.myProfile.cancel],
                cancelButtonIndex: FUEL_CAPACITY_MEASUREMENTS.length,
                destructiveButtonIndex: FUEL_CAPACITY_MEASUREMENTS.length,
                title: localize.myProfile.fuelCapacityMeasurement,
                showSeparators: true,
                textStyle: { textAlign: 'center', width: '100%' },
                titleTextStyle: { textAlign: 'center', width: '100%' },
                useModal: true,
            },
            (buttonIndex: number) => {
                setError({ ...error, preferredFuelCapacity: false });
                if (buttonIndex < FUEL_CAPACITY_MEASUREMENTS.length) {
                    setPreferredFuelCapacity(FUEL_CAPACITY_MEASUREMENTS[buttonIndex])
                    setIsDirtySettings(true)
                }
            }
        );
    }

    const selectZones = () => {
        showActionSheetWithOptions(
            {
                options: [...ZONES.map(e => ((zones || [])?.find(i => i.id == e.id) ? "✓ " : "  ") + e?.[`${localize.getLanguage()?.toLowerCase()}_name`] + "  "), localize.myProfile.cancel],
                cancelButtonIndex: ZONES.length,
                destructiveButtonIndex: ZONES.length,
                title: localize.myProfile.allZones,
                showSeparators: true,
                textStyle: { textAlign: 'center', width: '100%' },
                titleTextStyle: { textAlign: 'center', width: '100%' },
                useModal: true,
            },
            (buttonIndex: number) => {
                ; setError({ ...error, zones: false });
                if (buttonIndex < ZONES.length) {
                    if ((zones || [])?.find(e => e.id == ZONES?.[buttonIndex]?.id)) {
                        setZones(e => [...(e?.filter(e => e.id != ZONES[buttonIndex]?.id))])
                        setIsDirtyProfile(true)
                    }
                    else {
                        setZones(e => [...e, ZONES?.[buttonIndex]]?.sort((a, b) => a.id - b.id))
                        setIsDirtyProfile(true)
                    }
                }
            }
        );
    }

    const selectPreferedLanguage = () => {
        showActionSheetWithOptions(
            {
                options: [...LANGUAGES.map(e => e?.label), localize.myProfile.cancel],
                cancelButtonIndex: LANGUAGES.length,
                destructiveButtonIndex: LANGUAGES.length,
                title: localize.myProfile.language,
                showSeparators: true,
                textStyle: { textAlign: 'center', width: '100%' },
                titleTextStyle: { textAlign: 'center', width: '100%' },
                useModal: true,
            },
            (buttonIndex: number) => {
                if (buttonIndex < LANGUAGES.length) {
                    setLanguage(LANGUAGES[buttonIndex])
                    localize.setLanguage(LANGUAGES?.[buttonIndex].key)
                    dispatch({
                        type: SET_LANGUAGE,
                        payload: LANGUAGES?.[buttonIndex].key,
                    });
                    setIsDirtyProfile(true)
                }
            }
        );
    }

    const onSaveFuelSettings = () => {
        if (isValidFuelPayload()) {
            const fuelSettings = {
                preferredFuelCapacityMeasurement: preferredFuelCapacity,
                preferredDistanceMeasurement: preferredDistance,
                perDistanceFuelWastage: perDistanceFuelWastage,
            }
            dispatch({
                type: UPDATE_USER_PROFILE, payload: fuelSettings
            })
            dispatch({
                type: UPDATE_ACTIVITY_LOG, payload: [{
                    time: new Date().toISOString(),
                    logType: LOG_TYPES.FUEL_SETTINGS_UPDATE,
                    additionalInfo: JSON.stringify(fuelSettings),
                }]
            })
            setIsDirtySettings(false)

            ToastAndroid.show(
                'Successfully saved fuel settings.',
                ToastAndroid.LONG,
            );
        }
        else {
            Alert.alert(localize.myProfile.inputErrorMsg, '', [{ text: localize.myProfile.okay}]);
        }
    }

    const onSaveProfileSettings = () => {
        if (isValidProfilePayload()) {
            setIsDirtyProfile(false)
            const user = {
                firstName: firstName,
                lastName: lastName,
                language: language?.key,
                district: district,
                birthday: birthday,
                zones: zones,
                profilePicture: profilePic,
                emergencyContact: emergencyContact,
            }

            dispatch({
                type: UPDATE_USER_PROFILE, payload: user
            })
            dispatch({
                type: UPDATE_ACTIVITY_LOG, payload: [{
                    time: new Date().toISOString(),
                    logType: LOG_TYPES.PROFILE_UPDATE,
                    additionalInfo: JSON.stringify(user),
                }]
            })

            ToastAndroid.show(
                'Successfully saved user profile.',
                ToastAndroid.LONG,
            );

            listenToTopics(zones?.map((e: any) => e.id),true);

        }
        else {
            Alert.alert(localize.myProfile.inputErrorMsg);
        }
    }

    const isValidProfilePayload = () => {
        firstName && setFirstName(firstName?.trim());
        lastName && setLastName(lastName?.trim());

        const reg = /^[a-zA-Z]+$/;
        const regNic = /^([0-9]{9}[x|X|v|V]|[0-9]{12})$/;
        const err = {
            firstName: !firstName ? localize.signup.firstNameMissing : firstName && !reg.test(firstName?.trim()) ? localize.signup.firstNameInvalid : false,
            lastName: !lastName ? localize.signup.lastNameMissing : lastName && !reg.test(lastName?.trim()) ? localize.signup.lastNameInvalid : false,
            birthday: !birthday ? localize.signup.birthdayMissing : false,
            emergencyContact: !isValidPhoneNumber(emergencyContact) || emergencyContact == phoneNumber || emergencyContact == `0${phoneNumber}` ? emergencyContact == phoneNumber || emergencyContact == `0${phoneNumber}` ? localize.myProfile.emergencyContactIsSameAsMobileNo : localize.myProfile.emergencyContactMissing : false,
            district: !district ? localize.myProfile.districtMissing : false,
            zones: !zones.length ? localize.myProfile.zoneMissing : false,
        };
        setError({ ...error, ...err });
        return !_.values(err).some(e => e !== false);
    }

    const isValidFuelPayload = () => {
        const err = {
            preferredFuelCapacity: !preferredFuelCapacity ? localize.myProfile.generalErrMsg : false,
            preferredDistance: !preferredDistance ? localize.myProfile.generalErrMsg : false,
            perDistanceFuelWastage: !perDistanceFuelWastage ? localize.myProfile.generalErrMsg : false,
        };
        setError({ ...error, ...err });
        return !(!preferredFuelCapacity || !preferredDistance || !perDistanceFuelWastage);
    }


    const PersonalDetails = () => {
        return (
            <View style={styles.container}>
                <View style={styles.headingWrapper}>
                    <ProfileEdit />
                    <Text style={styles.heading}>{localize.myProfile.personalDetails}</Text>
                </View>
                <FormInput
                    placeholder={localize.myProfile?.firstName}
                    onChangeText={(val) => { setFirstName(val); setIsDirtyProfile(true); setError({ ...error, firstName: false }); }}
                    value={`${firstName || ''}`}
                    textContentType={"name"}
                    error={error.firstName}
                />
                <FormInput
                    placeholder={localize.myProfile?.lastName}
                    onChangeText={(val) => { setLastName(val); setIsDirtyProfile(true); setError({ ...error, lastName: false }); }}
                    value={`${lastName || ''}`}
                    textContentType={"name"}
                    error={error.lastName}
                />
                <FormInput
                    placeholder={localize.myProfile?.language}
                    value={language?.label}
                    error={error.language}
                    isKeyboardInput={false}
                    onPress={() => selectPreferedLanguage()}
                />
                <FormInput
                    placeholder={localize.myProfile?.fishermanId}
                    onChangeText={(val) => { setFishermanId(val) }}
                    value={(fishermanId == 'string' ? fishermanId : `${fishermanId || ""}`) || 'No ID'}
                    error={error.fishermanId}
                    editable={false}
                />
                <FormInput
                    placeholder={localize.myProfile?.phoneNumber}
                    onChangeText={(val) => { setPhoneNumber(val) }}
                    value={`0${phoneNumber}`}
                    error={error.phoneNumber}
                    editable={false}
                />
                <FormInput
                    placeholder={localize.myProfile?.nic}
                    onChangeText={(val) => { setNic(val) }}
                    value={`${nic}`}
                    error={error.nic}
                    editable={false}
                />
                <FormInput
                    placeholder={localize.myProfile?.emergencyContact}
                    onChangeText={(val) => { setEmergencyContact(val); setIsDirtyProfile(true); setError({ ...error, emergencyContact: false }); }}
                    value={`${emergencyContact}`}
                    keyboardType={'phone-pad'}
                    error={error.emergencyContact}
                />
                <FormInput
                    placeholder={localize.myProfile?.birthday}
                    value={moment(birthday).format('YYYY/MM/DD')}
                    isKeyboardInput={false}
                    hideDownArrow={true}
                    onPress={showDatePicker}
                    error={error.birthday}
                />
                <FormInput
                    placeholder={localize.myProfile?.district}
                    value={district?.[`label${localize.getLanguage()?.toUpperCase()}`]}
                    isKeyboardInput={false}
                    error={error.district}
                    onPress={() => selectDistrict()}
                />
                <FormInput
                    placeholder={localize.myProfile?.zones}
                    value={(zones || [])?.map(e => e[`${localize.getLanguage()?.toLowerCase()}_name`])?.join(', ')}
                    isKeyboardInput={false}
                    error={error.zones}
                    multiline={true}
                    onPress={() => selectZones()}
                />

                <View style={styles.saveButtonWrapper}>
                    <GeneralButton
                        text={localize.myProfile.save}
                        style={styles.saveButton}
                        backgroundColor={colors.green_1}
                        disabled={!isDirtyProfile}
                        onPress={() => onSaveProfileSettings()}
                    />
                </View>

                <View style={styles.seperator} />

                <View style={styles.headingWrapper}>
                    <FuelEdit />
                    <Text style={styles.heading}>{localize.myProfile.fuelCalcualtorDetails}</Text>
                </View>

                <FormInput
                    placeholder={localize.myProfile?.preferredDistance}
                    value={preferredDistance ? preferredDistance?.[`label${localize.getLanguage()?.toUpperCase()}`] : ''}
                    isKeyboardInput={false}
                    error={error.preferredDistance}
                    onPress={() => selectDistanceMeasurement()}
                />
                <FormInput
                    placeholder={localize.myProfile?.preferredFuelCapacity}
                    value={preferredFuelCapacity ? preferredFuelCapacity?.[`label${localize.getLanguage()?.toUpperCase()}`] : ''}
                    isKeyboardInput={false}
                    error={error.preferredFuelCapacity}
                    onPress={() => selectFuelCapacityMeasurement()}
                />

                <FormInput
                    placeholder={ `${preferredFuelCapacity?.[`label${localize.getLanguage()?.toUpperCase()}`]} ${localize.myProfile?.perDistanceFuelWastage}`}
                    value={`${perDistanceFuelWastage}`}
                    onChangeText={(txt) => { setPerDistanceFuelWastage(txt); setIsDirtySettings(true); }}
                    keyboardType="decimal-pad"
                    error={error.perDistanceFuelWastage}
                />

                <View style={styles.saveButtonWrapper}>
                    <GeneralButton
                        text={localize.myProfile.save}
                        style={styles.saveButton}
                        backgroundColor={colors.green_1}
                        disabled={!isDirtySettings}
                        onPress={() => onSaveFuelSettings()}
                    />
                </View>

                {showIVRBtn && <View style={styles.seperator} />}

                <View>
                    {showIVRBtn &&
                        <PrimaryBtn
                            text={localize.myProfile.ivrReg}
                            onPress={() => registerForSayuruService()}
                            marginTop={1}
                        />}
                </View>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    date={birthday}
                    // maximumDate={moment().subtract(18, 'years')}
                    maximumDate={new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate())}
                />
            </View>
        )
    }

    const grouped = groupBy(activityLog?.activityLog || [], (e) => moment(e.createdTimeStamp).format('YYYY/MM/DD'));
    const todayLogs = grouped[moment().format('YYYY/MM/DD')];
    const otherLogs = Object.keys(grouped).filter(e => moment().format('YYYY/MM/DD') != moment(e, 'YYYY/MM/DD').format('YYYY/MM/DD')).map(e => ({ title: e, data: grouped[e] }))

    const ActivityLog = () => {
        return (
            <View style={styles.container}>
                <View style={styles.todayActivityContainer}>
                    <Text style={styles.blackText}>{localize.myProfile.today}</Text>
                    {
                        todayLogs ? (todayLogs.map(e => (
                            <View style={styles.logContainer}>
                                <Text style={[styles.blackText, styles.bigFont, styles.boldText, { flex: 1 }]}>{moment(e.createdTimeStamp).format('h:mm a')}</Text>
                                <Text style={[styles.blackText, { flex: 3 }]}>{getLogDescriptiom(e.logType)}</Text>
                            </View>
                        ))) : null
                    }
                    {
                        !todayLogs ?
                            <View style={styles.logContainer}>
                                <Text style={[styles.blackText, { flex: 3 }]}>{localize.myProfile.noLogs}</Text>
                            </View>
                            : null
                    }
                </View>
                <SectionList
                    scrollEnabled={false}
                    sections={otherLogs}
                    renderItem={({ item }) => <Item title={item} />}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={styles.listHeader}>{moment(title, 'YYYY/MM/DD').format('dddd YYYY/MM/DD')}</Text>
                    )}
                    contentContainerStyle={{ flex: 1 }}
                />
            </View>
        )
    }

    return (
        <Fragment>
            <SafeAreaView style={bgPrimary}></SafeAreaView>
            <View style={outermostContainer}>
                <NavHeader
                    title={localize.myProfile.title}
                    showBackButton={true}
                    darkContent={true}
                    bgColor={colors.primary_background}
                />
                <KeyboardAwareScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    // innerRef={scrollRef}
                    ref={scrollRef}
                >
                    <View style={sty.section1Wrapper_hard}>
                        <View style={[sty.logoContainer, { borderRadius: profileImgWidth / 2, padding: scale(2) }]}>
                            <TouchableOpacity
                                onPress={() => openProfilePicCapturing()}
                            >
                                {
                                    profilePic
                                        ?
                                        <Image
                                            source={getImageURI(profilePic)}
                                            resizeMode="cover"
                                            style={[{ width: profileImgWidth, height: profileImgWidth, borderRadius: profileImgWidth / 2 }, sty.imageBorder]}
                                        />
                                        :
                                        <ICprofileAvatar width={profileImgWidth} height={profileImgWidth} />
                                }
                                <View style={styles.cameraEditicon}>
                                    <CameraEdit width={scale(15)} height={scale(15)} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[contentWrapper, bgWhite]}>
                        <Text style={styles.appVersion}>Sayuru v{VersionInfo.appVersion}</Text>
                        <TabBar
                            tab1Name={localize.myProfile.editprofile}
                            tab2Name={localize.myProfile.activityLog}
                            selectedTab={currentTab}
                            onChangeTab={(tabVal: number) => {
                                setCurrentTab(tabVal)
                            }}
                        />
                        {
                            currentTab === 1 ?
                                PersonalDetails()
                                :
                                ActivityLog()
                        }
                    </View>
                </KeyboardAwareScrollView>
            </View>
            <SafeAreaView style={bgWhite}></SafeAreaView>
        </Fragment>
    );
};

const getLogDescriptiom = (type) => {
    switch (type) {
        case LOG_TYPES.PROFILE_UPDATE: return localize.myProfile.PROFILE_UPDATE
        case LOG_TYPES.FUEL_SETTINGS_UPDATE: return localize.myProfile.FUEL_SETTINGS_UPDATE
        case LOG_TYPES.START_LIVE_TRACKING: return localize.myProfile.START_LIVE_TRACKING
        case LOG_TYPES.END_LIVE_TRACKING: return localize.myProfile.END_LIVE_TRACKING
        case LOG_TYPES.SAVE_LOCATION_POINT: return localize.myProfile.SAVE_LOCATION_POINT
        case LOG_TYPES.START_JOURNEY: return localize.myProfile.START_JOURNEY
        case LOG_TYPES.END_JOURNEY: return localize.myProfile.END_JOURNEY
        case LOG_TYPES.SEND_SOS: return localize.myProfile.SEND_SOS
        case LOG_TYPES.REGISTER_FOR_IVR: return localize.myProfile.REGISTER_FOR_IVR
    }
}

const Item = ({ title }) => {
    return (
        <View style={styles.logContainer}>
            <Text style={[styles.blackText, styles.bigFont, styles.grayText, { flex: 1 }]}>{moment(title.createdTimeStamp).format('h:mm a')}</Text>
            <Text style={[styles.blackText, styles.grayText, { flex: 3 }]}>{getLogDescriptiom(title?.logType)}</Text>
        </View>
    )
};

export default UserProfileScreen;

const styles = StyleSheet.create({
    headingWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scale(15),
        marginLeft: scale(3),
    },
    container: {
        marginTop: scale(15),
        minHeight: windowHeight * 0.66
    },
    centerdContent: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: scale(20),
    },
    heading: {
        color: colors.black,
        fontSize: fontScale(16),
        fontWeight: '700',
        marginLeft: scale(10),
    },
    seperator: {
        height: 1.5,
        backgroundColor: colors.grey_2,
        marginVertical: scale(30),
    },
    saveButton: {
        marginTop: scale(20),
        marginBottom: scale(5),
        flex: 0.5,
        marginRight: scale(10),
    },
    saveButtonWrapper: {
        flexDirection: 'row',
        flex: 1,
    },
    cameraEditicon: {
        position: 'absolute',
        bottom: scale(5),
        alignSelf: 'center',
        zIndex: 99,
        elevation: 60,
    },
    todayActivityContainer: {
        borderRadius: 8,
        paddingVertical: scale(15),
        paddingHorizontal: scale(15),
        backgroundColor: colors.grey_2
    },
    blackText: {
        color: colors.black,
        fontSize: fontScale(14),
        // textAlign: 'justify',
    },
    bigFont: {
        fontSize: fontScale(16),
    },
    boldText: {
        fontWeight: '700',
    },
    grayText: {
        color: colors.grey_1
    },
    logContainer: {
        flexDirection: 'row',
        paddingTop: scale(20),
    },
    listHeader: {
        fontSize: fontScale(12),
        color: colors.disabledGrey,
        marginTop: scale(30),
        marginBottom: scale(5),
    },
    appVersion: {
        color: colors.grey_1,
        marginLeft: 30
    }

});