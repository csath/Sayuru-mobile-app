import React, { Fragment, Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Keyboard,
    ScrollView,
    Alert,
    ToastAndroid,
} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import CheckBox from '@react-native-community/checkbox';
import RNIap from 'react-native-iap';
import Loader from 'react-native-modal-loader'

import { AuthStyles as sty } from '../styles/auth.style';
import { DefaultStyles } from '../../../shared/styles/common-styles';
import navigationService from '../../../navigation/navigationService';
import { FormHeader } from '../components/form-header.component';
import { PrimaryBtn } from '../../../shared/components/buttons/primary-btn.component';
import colors from '../../../shared/styles/colors';
import { connect } from 'react-redux';
import { LoginBackground } from '../components/loginBackground';
import { FormInput } from '../../../shared/components/form-input/form-input.component';
import { fontScale, scale } from '../../../shared/utilities/scale';
import localize from '../../../localization/translations';
import { isValidPhoneNumber } from '../../../shared/utilities/formValidators/validators';
import { openPrivacyPolicy, openTermsAndConditions } from '../../../shared/utilities/operations';
import * as API_SERVICE from '../../../services/all.service';
import { UPDATE_TRIAL_ACCOUNT_INFO, UPDATE_USER_PROFILE, USER_LOG_IN } from '../../../store/types';
import { checkSubscriptionStatus } from '../../../shared/utilities/subscriptionHandler';

const { bgWhite, contentWrapper } = DefaultStyles;

export interface Props {
}

interface State {
    phoneNumber: string,
    focused: boolean,
    OTPrequested: boolean,
}

class VerifyMobileNumScreen extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            phoneNumber: props.navigation?.state?.params?.phone || '',
            OTPrequested: props.navigation?.state?.params?.OTPsend || false,
            isKeyboardOpen: false,
            regForIVR: false,
            userOTP: '',
            agreeToTerms: false,
            isLoading: false,
            showIVRLogin: true,
        };
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = () => {
        this.setState({ isKeyboardOpen: true });
    }

    _keyboardDidHide = () => {
        this.setState({ isKeyboardOpen: false });
    }

    submitOtp = () => {
        // do api call
        this.setState({ isLoading: true });
        API_SERVICE.confirmOTP(this.state.phoneNumber, this.state.userOTP, this.state.regForIVR)?.then(async res => {
            if (res?.data && res?.data?.isSuccess) {
                const user = res?.data?.data;
                console.log(user)
                if (user) {
                    this.props.updateUser(user);
                }

                if (!this.isDialogNumber(this.state.phoneNumber)) {
                    // do playstore payment
                    // todo
                    try {
                        await checkSubscriptionStatus(true);
                        API_SERVICE.getAccountStatus(this.state.phoneNumber, user.id, user.userToken)?.then(res => {
                            if (res?.data?.isSuccess) {
                                this.props.accountStatusUpdate({
                                        isPremiumAccount: res?.data?.data?.isPremiumAccount,
                                        remainingFreeTrialDays: res?.data?.data?.remainingFreeTrialDays,
                                    })
                            }
                        }).catch(() => { })

                    } catch (err) {
                        console.log(err);
                    }
                }

                if (!user?.isActive) {
                    navigationService.navigate("SignUp", { mobileNumber: this.state.phoneNumber, userId: user.id, userToken: user.userToken });
                }
                else {
                    this.props.markUserLoggedIn(this.state.phoneNumber);
                    navigationService.navigate('VerifiedUser', { user });
                }
            }
            else {
                ToastAndroid.show(
                    'OTP is expired or invalid!',
                    ToastAndroid.LONG,
                ); 
            }

        })
            .catch(e => {
                ToastAndroid.show(
                    'OTP is invalid or unable to connect with Sayuru API.',
                    ToastAndroid.LONG,
                );
            }).finally(() => {
                this.setState({ isLoading: false });
            })
    }

    sendOtp = () => {
        this.setState({ isLoading: true });
        if (this.state.phoneNumber && isValidPhoneNumber(this.state.phoneNumber)) {

            API_SERVICE.login(this.state.phoneNumber).then(res => {
                // console.log(res)
                if (res?.data && res?.data?.isSuccess) {
                    if (res?.data?.data.hasRegisteredIVR) {
                        this.setState({ showIVRLogin: false });
                    }

                    this.setState({ OTPrequested: true });
                    ToastAndroid.show(
                        'You\'ll get a new OTP to your device.',
                        ToastAndroid.LONG,
                    );
                }
                else {
                    ToastAndroid.show(
                        'Unable to connect with Sayuru API.',
                        ToastAndroid.LONG,
                    );
                }

            }).catch(e => {
                //console.log(e)
                ToastAndroid.show(
                    'Unable to connect with Sayuru API.',
                    ToastAndroid.LONG,
                );
            })
                .finally(() => {
                    this.setState({ isLoading: false });
                })

        }
    }

    resendOtp = () => {
        this.setState({ userOtp: '' }, () => this.sendOtp());
    }

    showCustomErrorModa = (pnumber = '') => {
        if (pnumber.length > 10 || !(/^[0-9]+$/.test(pnumber))) {
            Alert.alert(localize.verification.invalidPhoneNumber)
        }
    }

    isDialogNumber = (number = '') => {
        return (number?.startsWith('074') || number?.startsWith('076') || number?.startsWith('077'))
    }


    render() {
        const { OTPrequested, phoneNumber } = this.state;

        return (
            <LoginBackground onBackPressed={() => navigationService.goBack()} showBackButton={false}>
                <View style={[contentWrapper, bgWhite, { flex: 1, paddingBottom: OTPrequested ? 0 : 15 }]}>
                    <FormHeader title={localize.verification?.title} />
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flex: OTPrequested ? 0 : 1 }}>
                        {!(OTPrequested && this.state.isKeyboardOpen) &&
                            <FormInput
                                iconType="edit"
                                focusable={false}
                                placeholder={localize.verification?.phoneNumber}
                                onChangeText={(phNum) => { this.setState({ phoneNumber: phNum }); this.showCustomErrorModa(phNum); }}
                                value={phoneNumber}
                                keyboardType={"phone-pad"}
                                textContentType={"telephoneNumber"}
                                editable={!OTPrequested}
                                error={(phoneNumber && (!isValidPhoneNumber(phoneNumber) || phoneNumber.length > 10)) ? localize.verification.invalidPhoneNumber : ""}
                            />
                        }
                        {!OTPrequested && <Text style={sty.exampleText}>{localize.verification.eg}: 07XXXXXXXX</Text>}
                        {
                            !OTPrequested && !this.state.isKeyboardOpen ?
                                <Text style={sty.OTPDescription}>
                                    {localize.verification?.otpDescription}
                                </Text>
                                : null
                        }
                        {
                            OTPrequested ?

                                <View style={sty.OTPnumPadContainer}>
                                    {!this.state.isKeyboardOpen && <Text style={sty.OTPinstructions}>{localize.verification?.otpInstruction}</Text>}
                                    <OTPInputView
                                        autoFocusOnLoad={true}
                                        pinCount={4}
                                        focusable={true}
                                        style={styles.inputcontainer}
                                        codeInputFieldStyle={styles.underlineStyleBase}
                                        codeInputHighlightStyle={styles.underlineStyleHighLighted}
                                        placeholderTextColor={colors.white}
                                        onCodeChanged={(otp) => this.setState({ userOTP: otp })}
                                        onCodeFilled={(otp) => this.setState({ userOTP: otp })}
                                        code={this.state.userOTP}
                                    />
                                    {!this.state.isKeyboardOpen &&
                                        <View
                                            style={sty.resendOTPcontainer}
                                        >
                                            <Text style={sty.resendOTPTextBase}>{localize.verification?.didNotReceiveOTP}</Text>
                                            <TouchableOpacity onPress={() => this.resendOtp()}><Text style={sty.resendOTPTextHighlight}>{localize.verification?.resendOTP}</Text></TouchableOpacity>
                                        </View>
                                    }

                                    {!this.state.isKeyboardOpen && !this.isDialogNumber(this.state.phoneNumber) && this.state.showIVRLogin &&
                                        <TouchableOpacity style={styles.checkboxContainer} onPress={() => this.setState({ regForIVR: !this.state.regForIVR })}>
                                            <CheckBox
                                                disabled={false}
                                                value={this.state.regForIVR}
                                                tintColors={{
                                                    true: colors.white,
                                                    false: colors.white,
                                                }}
                                                style={{ borderRadius: 8, padding: 0, margin: 0 }}
                                                tintColor={colors.white}
                                                onCheckColor={colors.white}
                                                onValueChange={(newValue) => this.setState({ regForIVR: newValue })}
                                            />
                                            <Text style={styles.checkBoxText}>
                                                {localize.verification?.regForIVR} <Text style={sty.optionalText}>({localize.verification?.optional})</Text>
                                            </Text>
                                        </TouchableOpacity>
                                    }

                                    <PrimaryBtn
                                        onPress={() => this.submitOtp()}
                                        text={localize.verification?.verify}
                                        type={"secondary"}
                                        marginTop={scale(15)}
                                        disabled={this.state.userOTP?.length != 4 || this.state.isLoading}
                                    />
                                </View>

                                :
                                <View style={[sty.requestOtpDiscl, { flex: OTPrequested ? 0 : 1 }]}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <CheckBox
                                            disabled={false}
                                            value={this.state.agreeToTerms}
                                            tintColors={{
                                                true: colors.grey_1,
                                                false: colors.grey_1,
                                            }}
                                            style={{ borderRadius: 8, height: scale(18), marginTop: -5 }}
                                            tintColor={colors.grey_1}
                                            onCheckColor={colors.grey_1}
                                            onValueChange={(newValue) => this.setState({ agreeToTerms: newValue })}
                                        />
                                        {/* <Text style={sty.disclaimerTextBase} onPress={() => this.setState({ agreeToTerms: !this.state.agreeToTerms })} >{localize.signup?.checkBoxAgreement}
                                            <Text style={sty.disclaimerHighlights} onPress={() => openTermsAndConditions()}> {localize.signup?.termsAndCond}</Text>
                                        </Text> */}

                                        <View style={sty.disclaimerWrap}>
                                            <Text style={sty.disclaimerTextBase} >{localize.signup?.agreement1}{"\n"}
                                                <Text style={sty.disclaimerHighlights} onPress={() => openTermsAndConditions()}>{localize.signup?.termsAndCond}</Text>
                                                <Text style={sty.disclaimerTextBase}> {localize.signup?.agreement2} </Text><Text style={sty.disclaimerHighlights} onPress={() => openPrivacyPolicy()}>{localize.signup?.privacyPolicy}</Text>
                                            </Text>
                                        </View>
                                    </View>
                                    <PrimaryBtn
                                        text={localize.verification?.sendOTP}
                                        onPress={() => this.sendOtp()}
                                        marginTop={scale(30)}
                                        
                                        disabled={!phoneNumber || !isValidPhoneNumber(phoneNumber) || !this.state.agreeToTerms || this.state.isLoading}
                                    />
                                    <View style={{height: 30}}/>

                                    {/* {!this.state.isKeyboardOpen &&
                                        <View style={sty.disclaimerWrap}>
                                            <Text style={sty.disclaimerTextBase} >{localize.signup?.agreement1}{"\n"}
                                                <Text style={sty.disclaimerHighlights} onPress={() => openTermsAndConditions()}>{localize.signup?.termsAndCond}</Text>
                                                <Text style={sty.disclaimerTextBase}> {localize.signup?.agreement2} </Text><Text style={sty.disclaimerHighlights} onPress={() => openPrivacyPolicy()}>{localize.signup?.privacyPolicy}</Text>
                                            </Text>
                                        </View>
                                    } */}
                                </View>
                        }
                    </ScrollView>
                </View>
                <Loader loading={this.state.isLoading} color={colors.grey_1} size="large" />
            </LoginBackground>
        );
    }
};

const mapStateToProps = (state: any) => ({

});

const mapDsipatchToProps = (dispatch) => {
    return ({
        updateUser: (payload) => {
            dispatch({
                type: UPDATE_USER_PROFILE,
                payload: payload,
            })
        },
        markUserLoggedIn: (payload) => {
            dispatch({
                type: USER_LOG_IN,
                payload: payload,
            })
        },
        accountStatusUpdate: (payload) => {
            dispatch({
                type: UPDATE_TRIAL_ACCOUNT_INFO,
                payload: payload,
            })
        }
    })
}


export default connect(mapStateToProps, mapDsipatchToProps)(VerifyMobileNumScreen);


const styles = StyleSheet.create({
    inputcontainer: {
        width: '90%',
        height: scale(60),
        alignSelf: 'center',
    },
    underlineStyleBase: {
        width: scale(48),
        height: scale(46),
        borderWidth: 0,
        borderBottomColor: colors.white,
        borderBottomWidth: 2,
        fontSize: fontScale(20),
    },
    underlineStyleHighLighted: {
        borderColor: colors.white,
    },
    checkboxContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: scale(10)
    },
    checkBoxText: {
        color: colors.white,
        fontSize: fontScale(14),
        paddingTop: scale(7),
    },
});