import React from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  View,
  Text as NativeText,
} from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import {colors} from '~/themes';

export default class Button extends React.PureComponent {
  render() {
    const {
      onPress,
      shadow,
      shadowColor,
      marginTop,
      marginBottom,
      ...props
    } = this.props;

    return (
      <ButtonContainer
        activeOpacity={0.8}
        {...props}
        onPress={onPress}
        style={[
          shadow ? styles.shadow : null,
          shadowColor ? {shadowColor: shadowColor} : null,
          marginTop ? {marginTop} : null,
          marginBottom ? {marginBottom} : null,
        ]}>
        <ButtonText {...props} allowFontScaling={false}>
          {this.props.children}
        </ButtonText>
        {this.props.loading ? (
          <Loading
            size="small"
            color={'white'}
            style={{
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              right: 12,
              width: 30,
              height: 30,
            }}
          />
        ) : (
          <>
            {this.props.icon && (
              <View
                style={{
                  position: 'absolute',
                  justifyContent: 'center',
                  alignItems: 'center',
                  right: 12,
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: props.reloadIcon
                    ? props.danger
                      ? colors.red_brick
                      : colors.denim_medium
                    : props.white
                    ? colors.primary
                    : colors.denim_medium,
                  paddingTop: 0,
                  paddingLeft: 0,
                }}>
                {!props.reloadIcon && (
                  <MaterialCommunityIcons
                    name="arrow-right"
                    style={{color: '#fff', fontSize: 20, paddingTop: 2}}
                  />
                )}
                {props.reloadIcon && (
                  <EvilIcons
                    name="redo"
                    style={{
                      color: 'white',
                      fontSize: 30,
                      marginTop: 3,
                    }}
                  />
                )}
              </View>
            )}
          </>
        )}
      </ButtonContainer>
    );
  }
}

Button.propTypes = {
  block: PropTypes.bool,
  outline: PropTypes.bool,
  primary: PropTypes.bool,
  white: PropTypes.bool,
  transparent: PropTypes.bool,
  success: PropTypes.bool,
  danger: PropTypes.bool,
  warning: PropTypes.bool,
  info: PropTypes.bool,
  facebook: PropTypes.bool,
  disabled: PropTypes.bool,
  rounded: PropTypes.bool,
  large: PropTypes.bool,
  small: PropTypes.bool,
  avg: PropTypes.bool,
  uppercase: PropTypes.bool,
  capitalize: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.bool,
  shadow: PropTypes.bool,
  shadowColor: PropTypes.string,
  marginTop: PropTypes.number,
  marginBottom: PropTypes.number,
  reloadIcon: PropTypes.bool,
  pill: PropTypes.bool,
  action: PropTypes.bool,
};

Button.defaultProps = {
  block: false,
  outline: false,
  white: false,
  primary: false,
  transparent: false,
  success: false,
  danger: false,
  warning: false,
  info: false,
  facebook: false,
  disabled: false,
  rounded: false,
  large: false,
  small: false,
  avg: false,
  uppercase: false,
  capitalize: false,
  loading: false,
  icon: false,
  shadow: true,
  shadowColor: null,
  marginTop: 0,
  marginBottom: 0,
  reloadIcon: false,
  pill: false,
  action: false,
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    // elevation: 4,
  },
});

const ButtonContainer = styled.TouchableOpacity`
  backgroundColor: ${(props) => {
    if (props.transparent) {
      return 'transparent';
    }
    if (props.outline) {
      return props.theme.colors.white;
    }
    if (props.info) {
      return props.theme.colors.info;
    }
    if (props.success) {
      return props.theme.colors.success;
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
    if (props.facebook) {
      return props.theme.colors.facebook;
    }
    if (props.white) {
      return props.theme.colors.white;
    }
    return props.theme.colors.info;
  }}
  opacity: ${(props) => {
    if (props.disabled) {
      return 0.3;
    }
    return 1;
  }}
  borderWidth: ${(props) => {
    if (props.outline) {
      return '1px';
    }
    return '0px';
  }}
  borderColor: ${(props) => {
    if (props.outline) {
      if (props.info) {
        return props.theme.colors.info;
      }
      if (props.success) {
        return props.theme.colors.success;
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
      if (props.facebook) {
        return props.theme.colors.facebook;
      }
      if (props.action) {
        return props.theme.colors.action;
      }
      return props.theme.colors.info;
    }
    return 'transparent';
  }}
  width: ${(props) => {
    if (props.block) {
      return '100%';
    }
    return 'auto';
  }}
  borderRadius: ${(props) => {
    if (props.large) {
      if (props.rounded) {
        return '15px';
      }

      if (props.pill) {
        return '20px';
      }

      return '4px';
    }
    if (props.small) {
      if (props.rounded) {
        return '20px';
      }
      if (props.pill) {
        return '20px';
      }
      return '4px';
    }

    if (props.pill) {
      return '20px';
    }

    if (props.rounded) {
      return '15px';
    }
    return '4px';
  }}
  paddingVertical:  ${(props) => {
    if (props.large) {
      return '13px';
    }
    if (props.avg) {
      return '8px';
    }
    if (props.small) {
      return '5px';
    }
    return '10px';
  }}
  paddingHorizontal: ${(props) => {
    if (props.avg) {
      return '15px';
    }
    return '20px';
  }}
  flex-direction: row
  align-items: center
  justify-content: center
`;

const ButtonText = styled(NativeText)`
  letter-spacing: 1
  fontSize: ${(props) => {
    if (props.large) {
      return '17px';
    }
    if (props.avg) {
      return '14px';
    }
    if (props.small) {
      return '12px';
    }
    return '16px';
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
  fontFamily: ${(props) => {
    if (props.bold) {
      return 'CircularStd-Bold';
    }
    if (props.medium) {
      return 'CircularStd-Medium';
    }
    return 'CircularStd-Book';
  }}
  color:  ${(props) => {
    if (props.white) {
      return props.theme.colors.helpText;
    }
    if (props.outline) {
      if (props.info) {
        return props.theme.colors.info;
      }
      if (props.success) {
        return props.theme.colors.success;
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
      if (props.facebook) {
        return props.theme.colors.facebook;
      }
      if (props.action) {
        return props.theme.colors.helpText;
      }
      return props.theme.colors.info;
    }
    if (props.transparent) {
      return props.theme.colors.primary;
    }
    return '#fff';
  }}
  textAlign: center
`;
const Loading = styled(ActivityIndicator)`
  padding-horizontal: 15px;
`;
