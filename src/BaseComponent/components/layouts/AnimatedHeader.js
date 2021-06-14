import React from 'react';
import {Body, Header} from 'native-base';
import {TouchableOpacity, Animated, Easing} from 'react-native';
import styled from 'styled-components';
import {useIsFocused} from '@react-navigation/native';
import PropTypes from 'prop-types';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Text from '../base/Text';
import {RowContainer} from '../base/CommonContainer';

import {truncateStr} from '~/utils/common';
import {OS} from '~/constants/os';
import navigator from '~/navigation/customNavigator';

const AnimatedHeader = (props) => {
  const isFocused = useIsFocused();
  const {back, close, themeWhite} = props;
  const valueX = React.useRef(new Animated.Value(OS.WIDTH)).current;
  const [barStyle, setBarStyle] = React.useState('');
  React.useEffect(() => {
    setBarStyle(themeWhite ? 'dark-content' : 'light-content');
  }, [isFocused, setBarStyle]);

  React.useEffect(() => {
    if (props.runAnimated) {
      Animated.timing(valueX, {
        toValue: 0,
        duration: 1000,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(valueX, {
        toValue: OS.WIDTH,
        duration: 1000,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: false,
      }).start();
    }
  }, [props.runAnimated, valueX]);

  return (
    <SHeader
      style={[styles.header]}
      iosBarStyle={barStyle}
      androidStatusBarColor={barStyle}
      {...props}>
      <TouchableOpacity
        onPress={() => {
          if (close) {
            return props.onClose();
          }
          navigator.goBack();
        }}
        style={styles.corner}>
        {back && <SIonicons name="md-arrow-back" size={24} {...props} />}
        {close && <SAntDesign size={24} name="close" {...props} />}
      </TouchableOpacity>
      <Body>
        <Animated.View
          style={{
            minWidth: 200,
            alignItems: 'center',
            transform: [{translateX: valueX}],
          }}>
          <Text h5 bold center uppercase color={props.headerContentColor}>
            {truncateStr(props.title, 20)}
          </Text>
        </Animated.View>
      </Body>
      <RowContainer style={styles.corner}>{props.children}</RowContainer>
    </SHeader>
  );
};

AnimatedHeader.propTypes = {
  title: PropTypes.string,
  back: PropTypes.bool,
  close: PropTypes.bool,
  onClose: PropTypes.func,
  themeWhite: PropTypes.bool,
  themePrimary: PropTypes.bool,
  themeBlack: PropTypes.bool,
  runAnimated: PropTypes.bool,
  headerContentColor: PropTypes.string,
  androidStatusBarColor: PropTypes.string,
};

AnimatedHeader.defaultProps = {
  title: '',
  back: true,
  close: false,
  onClose: () => {},
  themeWhite: false,
  themePrimary: false,
  themeBlack: false,
  runAnimated: false,
  headerContentColor: '#1F2631',
  androidStatusBarColor: 'white',
};

const styles = {
  header: {
    alignItems: 'center',
    shadowColor: 'rgba(60,128,209)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 8,
    borderBottomWidth: 0,
  },
  corner: {
    width: 32,
    height: 32,
    alignItems: 'center',
    paddingTop: 5,
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

export default AnimatedHeader;
