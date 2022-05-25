import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import Input from './input';
import SVGIdCard from '../../../assets/form-icons/id-card.svg';
import SVGLocation from '../../../assets/form-icons/location.svg';
import SVGLock from '../../../assets/form-icons/lock.svg';
import SVGUser from '../../../assets/form-icons/user.svg';
import SVGUserCircle from '../../../assets/form-icons/user-circle.svg';
import colors from '../../styles/colors';
import { scale, fontScale } from '../../utilities/scale';

export interface IInput extends TextInputProps {
  iconType:
  'nic'
  | 'user-circle'
  | 'location'
  | 'password'
  | 'user';
}

const FormInputWithIcon = (props: IInput) => {
  const { placeholder, value, onChangeText, iconType, editable, secureTextEntry, keyboardType, textContentType } = props;
  return (
    <View style={styles.outerWrapper}>
      {iconType === 'nic' ? (
        <SVGIdCard width={fontScale(21)} height={fontScale(18)} />
      ) : iconType === 'password' ? (
        <SVGLock width={fontScale(18)} height={fontScale(20.5)} style={{ marginLeft: fontScale(3) }} />
      ) : iconType === 'location' ? (
        <SVGLocation width={fontScale(14)} height={fontScale(20)} style={{ marginLeft: fontScale(2), marginRight: fontScale(4) }} />
      ) : iconType === 'user' ? (
        <SVGUser width={fontScale(18)} height={fontScale(20)} style={{ marginLeft: fontScale(1), marginRight: fontScale(2) }} />
      ) : iconType === 'user-circle' ? (
        <SVGUserCircle width={fontScale(21)} height={fontScale(21)} />
      ) : null}
      <View style={{ flex: 1, marginLeft: scale(16) }}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder_grey}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          secureTextEntry={secureTextEntry}
          style={{ fontSize: fontScale(18), height: scale(40), paddingVertical: scale(3) }}
          keyboardType={keyboardType}
          textContentType={textContentType}
        />
      </View>
    </View>
  );
};

const FormInput = (props: IInput) => {
  const { placeholder, error } = props;
  return (
    <Input
      label={placeholder}
      activeColor={colors.primary}
      activeLabelColor={colors.primary}
      labelTextStyle={{ color: colors.primary }}
      error={error}
      textInputStyle={{ borderRadius: 8, color: colors.grey_1 }}
      containerStyle={{ marginVertical: scale(10) }}
      {...props}
    />
  );
}


const styles = StyleSheet.create({
  outerWrapper: {
    flexDirection: 'row',
    alignItems: "center",
    marginTop: scale(19),
    marginBottom: scale(19),
    borderBottomColor: colors.border_grey,
    borderBottomWidth: 0.5,
    paddingHorizontal: scale(15),
    paddingBottom: scale(5)
  }
});

export { FormInput };


