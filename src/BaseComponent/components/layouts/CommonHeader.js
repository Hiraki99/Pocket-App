import React from 'react';
import {Body, Header, Left, Right} from 'native-base';
import {TouchableOpacity, ViewPropTypes} from 'react-native';
import styled from 'styled-components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';

import Text from '../base/Text';

import {RowContainer} from '~/BaseComponent';
import {truncateStr} from '~/utils/common';
import navigator from '~/navigation/customNavigator';
import {OS} from '~/constants/os';

const CommonHeader = (props) => {
  const {back, close, themeWhite, androidStatusBarColor, onClose} = props;
  const {children, ...updateProps} = props;
  return (
    <SHeader
      style={[styles.header]}
      iosBarStyle={themeWhite ? 'dark-content' : 'light-content'}
      androidStatusBarColor={androidStatusBarColor}
      {...props}>
      <Left height={40}>
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
      <Body height={40} style={{minWidth: 200, alignItems: 'center'}}>
        <Text h5 bold center uppercase color={props.headerContentColor}>
          {truncateStr(props.title, 28)}
        </Text>
      </Body>
      <Right
        height={40}
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
        <RowContainer
          style={props.styleChildren ? props.styleChildren : styles.corner}>
          {children}
        </RowContainer>
      </Right>
    </SHeader>
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
};

const styles = {
  header: {
    // alignItems: 'center',
    shadowColor: 'rgba(60, 128, 209, 1)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.0851449,
    shadowRadius: 2,
    elevation: 2,
    borderBottomWidth: 0,
    height: 40,
    overflow: 'hidden',
    // backgroundColor: 'red',
    // paddingBottom: 20,
  },
  corner: {
    width: 40,
    height: !OS.IsAndroid ? null : 40,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingTop: 5,
  },
};

const SHeader = styled(Header)`
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
