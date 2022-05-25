import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, Text } from 'react-native';
import SVGEdit from '../../../assets/form-icons/edit.svg';
import colors from '../../styles/colors';
import { scale, fontScale } from '../../utilities/scale';
export interface IInput extends TextInputProps {
  isRightTextExists: boolean;
  rightText?: string;
  isRightIconExists: boolean;
  iconType?: 'edit';
  marginTop?: number;
  marginBottom?: number;
  isBorderColorFixed: boolean;
  isFieldNameOnBorder: boolean;
  fieldName?: string
  borderColor?: string
}

const PrimaryInput = (props: IInput) => {
  const { placeholder, value, onChangeText, iconType, editable, secureTextEntry, keyboardType, textContentType,
    isRightIconExists, isRightTextExists, rightText, marginTop, marginBottom, borderColor } = props;
  return (
    <View style={[
      styles.outerWrapper,
      marginTop ? { marginTop: scale(marginTop) } : null,
      marginBottom ? { marginBottom: scale(marginBottom) } : null,
      borderColor ? { borderColor: borderColor } : null
    ]}>
      <View style={{ flex: 1, marginRight: scale(16), justifyContent: "center" }}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder_grey}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          secureTextEntry={secureTextEntry}
          style={styles.textInputStyles}
          keyboardType={keyboardType}
          textContentType={textContentType}
        />
      </View>
      {isRightTextExists && rightText ? (
        <Text style={styles.leftTxt}>{rightText}</Text>
      )
        :
        isRightIconExists && iconType === 'edit' ? (
          <SVGEdit width={fontScale(16)} height={fontScale(16)} />
        )
          : null
      }
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    flexDirection: 'row',
    alignItems: "center",
    marginTop: scale(19),
    marginBottom: scale(10), //19
    //borderColor: colors.pink,
    //borderWidth: 1,
    paddingHorizontal: scale(15),
    //paddingBottom: scale(1),
    //paddingTop: scale(1),
    //borderRadius: 7,
    //backgroundColor: colors.white
  },
  textInputStyles: {
    fontSize: fontScale(16),
    height: scale(48),
    paddingVertical: scale(3)
  },
  leftTxt: {
    color: colors.pink,
    fontSize: fontScale(16)
  },
  disabledBorder: {
    borderColor: colors.disabledBorder
  }
});

export { PrimaryInput };


