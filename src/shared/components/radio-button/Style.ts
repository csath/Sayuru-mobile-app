import { StyleSheet } from 'react-native';
import { scale } from '../../utilities/scale';

export const Style = StyleSheet.create({
  radioForm: {
  },

  radioWrap: {
    flexDirection: 'row',
    marginBottom: scale(5),
    paddingTop: scale(30)
  },
  radio: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(30),
    height: scale(30),
    alignSelf: 'center',
    borderColor: '#2196f3',
    borderRadius: 30,
  },

  radioLabel: {
    paddingLeft: scale(10),
    lineHeight: scale(20),
  },

  radioNormal: {
    borderRadius: 10,
  },

  radioActive: {
    width: scale(20),
    height: scale(20),
    backgroundColor: '#2196f3',
  },

  labelWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center'
  },

  labelVerticalWrap: {
    flexDirection: 'column',
    paddingLeft: scale(10),
  },

  labelVertical: {
    paddingLeft: 0,
  },

  formHorizontal: {
    flexDirection: 'row',
  },
});

