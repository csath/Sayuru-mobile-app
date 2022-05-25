import React, { useState, useEffect, createRef } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
  View
} from 'react-native';
import Animated, { Clock, useCode, interpolate, Easing, Value, set } from 'react-native-reanimated';
import debounce from 'lodash/debounce';

import { timing } from '../../utilities/animationUtils';
import colors from '../../styles/colors';
import ArrowDown from '../../../assets/common/arrow-down.svg';

const scale = (s: any) => s;
const fontScale = (s: any) => s;

const theme = {
  TEXT_INPUT_ACTIVE_COLOR: '#066acf',
  TEXT_INPUT_ACTIVE_LABEL_COLOR: '#0b78e6',
  PRIMARY_BACKGROUND_COLOR: '#fff',
  SECONDARY_TEXT_COLOR: '#8a8a8a',
  TEXT_INPUT_TEXT_COLOR: '#2b2b2b',
  TEXT_INPUT_DEFAULT_COLOR: colors.grey_2,
  TEXT_INPUT_ERROR_COLOR: '#eb452f',
  TEXT_INPUT_BORDER_RADIUS: 4,
  TEXT_INPUT_BORDER_DEFAULT_WIDTH: 1,
}

const onExecution = (e, innerFunc, outerFunc) => {
  innerFunc && innerFunc(e);
  outerFunc && outerFunc(e);
}

const getAndoridExtraPadding = (_textInputFontSize) => {
  if (Platform.OS === "android") {
    let defaultPadding = scale(12);
    if (_textInputFontSize < 14) {
      defaultPadding = defaultPadding + (14 - _textInputFontSize)
    }
    return defaultPadding;
  }
  return 0;
}

const getLabelPositions = (style, labelStyle) => {
  const height = (style?.height || ((style?.paddingTop || 0) + (style?.paddingBottom || 0)) || style?.padding) || 0;
  const textInputFontSize = style?.fontSize || 13;
  const labelFontSize = labelStyle?.fontSize || 13;
  const fontSizeDiff = textInputFontSize - labelFontSize;
  let unfocused, focused;


  unfocused = height * 0.5 + fontSizeDiff * (Platform.OS === "android" ? 0.5 : 0.6) + getAndoridExtraPadding(textInputFontSize);
  focused = -labelFontSize * 0.6;
  return [unfocused, focused]
}

const CustomInput = ({
  error,
  errorColor = theme.TEXT_INPUT_ERROR_COLOR,
  errorTextStyle,
  textInputStyle,
  labelTextStyle,
  containerStyle,
  isKeyboardInput = true,
  editable = true,
  value = '',
  label = '',
  labelTextColor = '',
  activeColor = theme.TEXT_INPUT_ACTIVE_COLOR,
  activeLabelColor = theme.TEXT_INPUT_ACTIVE_LABEL_COLOR,
  onPress = () => { },
  onFocus,
  onBlur,
  hideDownArrow,
  ...props
}) => {
  const [focusedLabel, _onFocusLabel] = useState(!!value);
  const [focused, _onFocusTextInput] = useState(!!value);
  const inputRef = createRef(null);
  const [animation, _] = useState(new Value(focusedLabel ? 1 : 0));
  const clock = new Clock();
  const debouncedOnFocusTextInput = debounce(_onFocusLabel, 500, { 'leading': true, 'trailing': false });

  useCode(
    () => set(
      animation,
      timing({
        clock,
        animation,
        duration: 150,
        from: focusedLabel ? 0 : 1,
        to: focusedLabel ? 1 : 0,
        easing: Easing.linear,
      })
    ),
    [focusedLabel]
  )

  useEffect(
    () => {
      if (!focusedLabel && value) {
        debouncedOnFocusTextInput(true)
      }
      if (focusedLabel && !value) {
        debouncedOnFocusTextInput(false)
      }
    },
    [value]
  )

  const focusStyle = {
    top: interpolate(animation, {
      inputRange: [0, 1],
      outputRange: [...getLabelPositions((textInputStyle || styles.textInput), (labelTextStyle || styles.label))]
    }),
    fontSize: interpolate(animation, {
      inputRange: [0, 1],
      outputRange: [scale(16), scale(13)]
    }),
    backgroundColor: (
      focusedLabel
        ? theme.PRIMARY_BACKGROUND_COLOR
        : 'transparent'
    ),
    color: labelTextColor || theme.SECONDARY_TEXT_COLOR,
  }

  const shouldShowError = ( error && errorColor);
  let textInputColorStyles;
  let labelColorStyles;

  if (focused) {
    textInputColorStyles = { borderColor: shouldShowError ? errorColor : activeColor }
    labelColorStyles = { color: activeLabelColor }
  }
  else if (shouldShowError) {
    textInputColorStyles = { borderColor: errorColor }
  }

  return (
    <>
      <TouchableOpacity style={[styles.container, containerStyle]} onPress={!isKeyboardInput && editable ? onPress : null} activeOpacity={!isKeyboardInput && editable ? 0.2 : 1}>
        {<Animated.Text useNativeDriver={true} style={[styles.label, focusStyle, labelTextStyle, labelColorStyles, error ? { color: errorColor } : {}, !editable ? { color: colors.grey_1 } : {}]} onPress={() => { !isKeyboardInput ? onPress() : !focused ? inputRef?.current?.focus() : null }}>{label}</Animated.Text>}
        <TextInput
          underlineColorAndroid={'rgba(0,0,0,0)'}
          {...props}
          editable={isKeyboardInput && editable}
          style={[styles.textInput, textInputStyle, textInputColorStyles, !(editable) ? { borderColor: theme.TEXT_INPUT_DEFAULT_COLOR } : {}]}
          placeholder=''
          placeholderTextColor='transparent'
          value={value}
          pointerEvents={isKeyboardInput ? "auto" : "none"}
          onFocus={(e) => onExecution(e, () => { _onFocusLabel(true); _onFocusTextInput(true) }, onFocus)}
          onBlur={(e) => onExecution(e, () => { _onFocusLabel(!!value); _onFocusTextInput(false) }, onBlur)}
          ref={inputRef}
        />
        {!isKeyboardInput && !hideDownArrow && <View style={[styles.arrowDown, error ? { top: scale(25) } : {}]}><ArrowDown /></View>}
        {error ? <Text style={[styles.errorText, { color: errorColor }, errorTextStyle]}>{error}</Text> : null}
      </TouchableOpacity>

    </>
  );
}

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginVertical: scale(5)
  },
  textInput: {
    fontSize: fontScale(16),
    paddingTop: scale(10),
    paddingBottom: scale(10),
    paddingHorizontal: scale(15),
    color: theme.TEXT_INPUT_TEXT_COLOR,
    borderColor: theme.TEXT_INPUT_DEFAULT_COLOR,
    borderRadius: theme.TEXT_INPUT_BORDER_RADIUS,
    borderWidth: theme.TEXT_INPUT_BORDER_DEFAULT_WIDTH,
  },
  label: {
    position: 'absolute',
    left: scale(15),
    fontSize: fontScale(16),
    zIndex: 1,
  },
  errorText: {
    fontSize: fontScale(13),
    paddingHorizontal: scale(2),
    paddingVertical: scale(5),
  },
  arrowDown: {
    position: 'absolute',
    right: scale(15),
  }
});