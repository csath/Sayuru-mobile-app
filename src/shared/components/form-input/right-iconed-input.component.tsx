import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import SVGEdit from '../../../assets/form-icons/edit.svg';
import colors from '../../styles/colors';
import { scale, fontScale } from '../../utilities/scale';

export interface IInput extends TextInputProps {
  iconType: 'edit';
}

const RightSideIconedInput = (props: IInput) => {
  const { placeholder, value, onChangeText, iconType, editable, secureTextEntry, keyboardType, textContentType } = props;
  return (
    <View style={styles.outerWrapper}>
      <View style={{ flex: 1, marginRight: scale(16) }}>
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
      {iconType === 'edit' ? (
        <SVGEdit width={fontScale(19)} height={fontScale(19)} />
      ) : null}
    </View>
  );
};


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

export { RightSideIconedInput };


