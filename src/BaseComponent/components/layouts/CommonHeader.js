import React from 'react';
import {Body, Left, Right} from 'native-base';
import {
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ViewPropTypes,
  View,
} from 'react-native';
import styled from 'styled-components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';

import Text from '../base/Text';

import {colors} from '~/themes';
import {NoFlexContainer, RowContainer} from '~/BaseComponent';
import {truncateStr} from '~/utils/common';
import navigator from '~/navigation/customNavigator';
import {OS} from '~/constants/os';

const CommonHeader = (props) => {
  const {back, close, themeWhite, androidStatusBarColor, onClose} = props;
  const {children, ...updateProps} = props;

  return (
    <NoFlexContainer>
      <StatusBar
        backgroundColor={androidStatusBarColor}
        barStyle={themeWhite ? 'dark-content' : 'light-content'}
      />
      {!OS.IsAndroid && (
        <SView
          style={{
            height: OS.statusBarHeight,
            width: OS.WIDTH,
            zIndex: 1000001,
          }}
          {...updateProps}
        />
      )}

      <RowContainer
        style={[styles.header, props.border ? styles.border : null]}>
        <Left>
          <TouchableOpacity
            onPress={() => {
              if (close) {
                return onClose();
              }
              props.onBack();
            }}
            style={styles.corner}>
            {back && (
              <SIonicons name="md-arrow-back" size={24} {...updateProps} />
            )}
            {close && <SAntDesign size={24} name="close" {...updateProps} />}
          </TouchableOpacity>
        </Left>
        <Body style={styles.body}>
          <Text
            h5
            bold
            center
            uppercase={props.uppercase}
            color={props.headerContentColor}>
            {truncateStr(props.title, 28)}
          </Text>
        </Body>
        <Right style={styles.right}>
          <RowContainer
            style={props.styleChildren ? props.styleChildren : styles.corner}>
            {children}
          </RowContainer>
        </Right>
      </RowContainer>
    </NoFlexContainer>
  );
};

CommonHeader.propTypes = {
  title: PropTypes.string,
  back: PropTypes.bool,
  close: PropTypes.bool,
  onClose: PropTypes.func,
  onBack: PropTypes.func,
  themeWhite: PropTypes.bool,
  themePrimary: PropTypes.bool,
  themeBlack: PropTypes.bool,
  androidStatusBarColor: PropTypes.string,
  headerContentColor: PropTypes.string,
  styleChildren: ViewPropTypes.style,
  border: PropTypes.bool,
  shadow: PropTypes.bool,
  uppercase: PropTypes.bool,
};

CommonHeader.defaultProps = {
  title: '',
  styleChildren: null,
  back: true,
  close: false,
  onClose: () => {},
  onBack: () => {
    navigator.goBack();
  },
  themeWhite: false,
  themePrimary: false,
  themeBlack: false,
  androidStatusBarColor: 'white',
  headerContentColor: 'black',
  border: false,
  shadow: false,
  uppercase: true,
};

const styles = StyleSheet.create({
  header: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 2,
    height: 48,
    paddingVertical: 8,
    zIndex: 100000,
    backgroundColor: 'white',
    overflow: 'visible',
  },
  corner: {
    // width: 40,
    height: !OS.IsAndroid ? null : 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    // paddingTop: 5,
  },
  right: {justifyContent: 'flex-end', alignItems: 'center'},
  body: {minWidth: 200, alignItems: 'center'},
  border: {
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
});

const SView = styled(View)`
  background-color: ${(props) => {
    if (props.themeWhite) {
      return props.theme.colors.white;
    }
    if (props.themePrimary) {
      return props.theme.colors.primary;
    }
    if (props.themeBlack) {
      return props.theme.colors.helpText;
    }
    return props.theme.colors.white;
  }};
`;

const SIonicons = styled(Ionicons)`
  color: ${(props) => {
    if (props.themeWhite) {
      return props.theme.colors.normalText;
    }
    if (props.themePrimary) {
      return props.theme.colors.white;
    }
    if (props.themeBlack) {
      return props.theme.colors.white;
    }
    return props.theme.colors.white;
  }};
`;

const SAntDesign = styled(AntDesign)`
  color: ${(props) => {
    if (props.themeWhite) {
      return props.theme.colors.primary;
    }
    if (props.themePrimary) {
      return props.theme.colors.white;
    }
    if (props.themeBlack) {
      return props.theme.colors.white;
    }
    return props.theme.colors.white;
  }};
`;

export default CommonHeader;
