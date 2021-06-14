import React from 'react';
import {StyleSheet} from 'react-native';
import styled from 'styled-components';

import {colors} from '~/themes';

export default class TextBase extends React.Component {
  render() {
    const {...props} = this.props;

    return (
      <TextContent
        allowFontScaling={false}
        {...props}
        style={[TextBaseStyle.normal, props.style || {}]}>
        {this.props.children}
      </TextContent>
    );
  }
}

export const TextBaseStyle = StyleSheet.create({
  normal: {
    fontSize: 14,
    fontFamily: 'CircularStd-Book',
    color: colors.helpText,
  },
  medium: {
    fontFamily: 'CircularStd-Medium',
  },
  bold: {
    fontFamily: 'CircularStd-Bold',
  },
  h1: {
    fontSize: 34,
    lineHeight: 40,
  },
  h2: {
    fontSize: 32,
    lineHeight: 40,
  },
  h3: {
    fontSize: 27,
    lineHeight: 30,
  },
  h4: {
    fontSize: 24,
    lineHeight: 28,
  },
  h5: {
    fontSize: 17,
    lineHeight: 24,
  },
  h6: {
    fontSize: 15,
    lineHeight: 17,
  },
  textDecorationLine: {
    textDecorationLine: 'line-through',
  },
  center: {
    textAlign: 'center',
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  success: {
    color: colors.success,
  },
  info: {
    color: colors.info,
  },
  successChoice: {
    color: colors.successChoice,
  },
  wrongChoice: {
    color: colors.heartActive,
  },
  danger: {
    color: colors.danger,
  },
  primary: {
    color: colors.primary,
  },
  warning: {
    color: colors.warning,
  },
});
const TextContent = styled.Text`
  opacity: ${(props) => props.opacity || 1}
  flex: ${(props) => (props.isUseFlex ? 1 : 'none')}
`;
