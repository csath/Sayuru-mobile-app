import React from 'react';
import { View, Text } from 'react-native';
import colors from '../../../shared/styles/colors';
import { scale, fontScale } from '../../../shared/utilities/scale';

export interface Props {
  title: string;
}

const FormHeader = (props: Props) => {
  if (props.centeredContent) {
    return (
      <View style={{ alignSelf: 'center', marginBottom: scale(30), marginTop: scale(25) }}>
      <Text style={{ fontSize: fontScale(24), color: colors.grey_1, fontWeight: '500', lineHeight: 33, letterSpacing: 0.5, fontFamily: 'Open Sans', textAlign: 'center' }}>{props.title}</Text>
    </View>
    )
  }
  return (
    <View style={{ alignSelf: 'flex-start', marginBottom: scale(25), marginTop: scale(10) }}>
      <Text style={{ fontSize: fontScale(24), color: colors.typo_grey_header, fontWeight: '700', lineHeight: 33, letterSpacing: 0.5, fontFamily: 'Open Sans' }}>{props.title}</Text>
    </View>
  );
};

export { FormHeader };
