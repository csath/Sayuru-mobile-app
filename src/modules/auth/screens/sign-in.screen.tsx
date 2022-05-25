import React, { FC, useState, useEffect } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Keyboard,
} from 'react-native';
import { AuthStyles as sty } from '../styles/auth.style';
import { DefaultStyles } from '../../../shared/styles/common-styles';
import navigationService from '../../../navigation/navigationService';
import { FormHeader } from '../components/form-header.component';
import { FormInput } from '../../../shared/components/form-input/form-input.component';
import { PrimaryBtn } from '../../../shared/components/buttons/primary-btn.component';
import { useSelector } from 'react-redux';
import localize from '../../../localization/translations';
import { LoginBackground } from '../components/loginBackground';
import { isValidPhoneNumber } from '../../../shared/utilities/formValidators/validators';
import { scale } from '../../../shared/utilities/scale';

const { bgWhite, contentWrapper } = DefaultStyles;

const SignInScreen: FC = () => {
    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

        // cleanup function
        return () => {
            Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
            Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
        };
    }, []);

    const [iskeyboardShown, setKeyboardStatus] = useState(false);
    const _keyboardDidShow = () => setKeyboardStatus(true);
    const _keyboardDidHide = () => setKeyboardStatus(false);

    useSelector(state => ({ persistedLang: state.localizationReducer.selectedLang }));
    const [phoneNumber, setphoneNumber] = useState('');

    const verifymobile = () => {
        if (phoneNumber && isValidPhoneNumber(phoneNumber)) {
            let isNewUser = undefined;
            // call API for login
            navigationService.navigate("VerifyMobileNum", { phone: phoneNumber, OTPsend: true, isNewUser })
        }
    }

    return (
        <LoginBackground title={iskeyboardShown ? undefined : localize.login.welcome} centeredContent={true}>
            <View style={[contentWrapper, bgWhite, { flex: 0, marginHorizontal: scale(30), borderRadius: 25, paddingHorizontal: scale(20) }]}>
                <FormHeader title={localize.login.loginToAccount} centeredContent={true} />
                <FormInput
                    iconType="user-circle"
                    placeholder={localize.login.phoneNumber}
                    onChangeText={(phNum) => { setphoneNumber(phNum) }}
                    value={phoneNumber}
                    keyboardType={"phone-pad"}
                    textContentType={"telephoneNumber"}
                    error={(phoneNumber && !isValidPhoneNumber(phoneNumber)) ? localize.login?.phoneNumberInvalid : ""}
                    onSubmitEditing={() => verifymobile()}
                    returnKeyType="done"
                />
                <View style={sty.loginButton}>
                    <PrimaryBtn
                        onPress={() => verifymobile()}
                        text={localize.login.verify}
                        marginTop={scale(30)}
                        disabled={!phoneNumber || !isValidPhoneNumber(phoneNumber)}

                    />
                    <TouchableOpacity
                        onPress={() => { navigationService.navigate("SignUp", {}) }}
                        style={sty.registerContainer}
                    >
                        <Text style={sty.regText1}>{localize.login.doNotHveAccount}  </Text>
                        <Text style={sty.regText2}>{localize.login.register}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LoginBackground>
    );
};

export default SignInScreen;
