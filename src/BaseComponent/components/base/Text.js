import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {colors} from '~/themes';

export default class Text extends React.Component {
  render() {
    const {...props} = this.props;

    return (
      <TextContent {...props} allowFontScaling={false}>
        {this.props.children}
      </TextContent>
    );
  }
}

Text.propTypes = {
  h1: PropTypes.bool,
  h2: PropTypes.bool,
  h3: PropTypes.bool,
  h4: PropTypes.bool,
  h5: PropTypes.bool,
  h6: PropTypes.bool,
  accented: PropTypes.bool,
  primary: PropTypes.bool,
  main: PropTypes.bool,
  success: PropTypes.bool,
  successChoice: PropTypes.bool,
  wrongChoice: PropTypes.bool,
  danger: PropTypes.bool,
  warning: PropTypes.bool,
  info: PropTypes.bool,
  bold: PropTypes.bool,
  medium: PropTypes.bool,
  center: PropTypes.bool,
  color: PropTypes.string,
  fontSize: PropTypes.number,
  uppercase: PropTypes.bool,
  capitalize: PropTypes.bool,
  lineThrough: PropTypes.bool,
  paddingTop: PropTypes.number,
  paddingLeft: PropTypes.number,
  paddingRight: PropTypes.number,
  paddingBottom: PropTypes.number,
  marginTop: PropTypes.number,
  marginLeft: PropTypes.number,
  marginRight: PropTypes.number,
  marginBottom: PropTypes.number,
  isUseFlex: PropTypes.bool,
};

Text.defaultProps = {
  h1: false,
  h2: false,
  h3: false,
  h4: false,
  h5: false,
  h6: false,
  primary: false,
  main: false,
  success: false,
  successChoice: false,
  wrongChoice: false,
  danger: false,
  warning: false,
  info: false,
  bold: false,
  medium: false,
  center: false,
  color: '#1F2631',
  fontSize: 14,
  accented: false,
  uppercase: false,
  capitalize: false,
  lineThrough: false,
  paddingTop: null,
  paddingLeft: null,
  paddingRight: null,
  paddingBottom: null,
  marginTop: null,
  marginLeft: null,
  marginRight: null,
  marginBottom: null,
  isUseFlex: false,
};

const TextContent = styled.Text`
  fontSize: ${(props) => {
    if (props.h1) {
      return '34px';
    }
    if (props.h2) {
      return '32px';
    }
    if (props.h3) {
      return '27px';
    }
    if (props.h4) {
      return '24px';
    }
    if (props.h5) {
      return '17px';
    }
    if (props.h6) {
      return '15px';
    }
    return `${props.fontSize}px`;
  }}
  lineHeight: ${(props) => {
    if (props.accented) {
      return 'null';
    }
    if (props.lineHeight) {
      return props.lineHeight;
    }
    if (props.h1) {
      return '40px';
    }
    if (props.h2) {
      return '40px';
    }
    if (props.h3) {
      return '27px';
    }
    if (props.h4) {
      return '28px';
    }
    if (props.h5) {
      return '24px';
    }
    if (props.h6) {
      return '15px';
    }
    return '24px';
  }}
  color: ${(props) => {
    if (props.info) {
      return props.theme.colors.info;
    }
    if (props.main) {
      return props.theme.colors.helpText;
    }
    if (props.success) {
      return props.theme.colors.success;
    }
    if (props.successChoice) {
      return props.theme.colors.successChoice;
    }
    if (props.wrongChoice) {
      return props.theme.colors.heartActive;
    }
    if (props.danger) {
      return props.theme.colors.danger;
    }
    if (props.primary) {
      return props.theme.colors.primary;
    }
    if (props.warning) {
      return props.theme.colors.warning;
    }
    if (props.header) {
      return props.theme.colors.card;
    }
    if (props.color) {
      return props.color;
    }
    return colors.helpText;
  }}
  textAlign: ${(props) => {
    if (props.center) {
      return 'center';
    }
    return 'auto';
  }}
  textTransform: ${(props) => {
    if (props.uppercase) {
      return 'uppercase';
    }
    if (props.capitalize) {
      return 'capitalize';
    }
    return 'none';
  }}
  opacity: ${(props) => props.opacity || 1}
  textDecorationLine: ${(props) => {
    if (props.lineThrough) {
      return 'line-through';
    }
    return 'none';
  }}
  paddingVertical: ${(props) => props.paddingVertical || 'null'}
  paddingHorizontal: ${(props) => props.paddingHorizontal || 'null'}
  paddingTop: ${(props) => props.paddingTop || 'null'}
  paddingLeft: ${(props) => props.paddingLeft || 'null'}
  paddingRight: ${(props) => props.paddingRight || 'null'}
  paddingBottom: ${(props) => props.paddingBottom || 'null'}
  marginTop: ${(props) => props.marginTop || 'null'}
  marginBottom: ${(props) => props.marginBottom || 'null'}
  marginLeft: ${(props) => props.marginLeft || 'null'}
  marginRight: ${(props) => props.marginRight || 'null'}
  flex: ${(props) => (props.isUseFlex ? 1 : 'none')}
 
  ${(props) => {
    if (props.fontWeight) {
      return `font-weight:${props.fontWeight}`;
    }
    return '';
  }}
  fontFamily: ${(props) => {
    if (props.bold) {
      return 'CircularStd-Bold';
    }
    if (props.medium) {
      return 'CircularStd-Medium';
    }
    return 'CircularStd-Book';
  }}
`;
