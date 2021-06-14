import React from 'react';
import {Body, Button, Header, Left, Right} from 'native-base';
import {TouchableOpacity, BackHandler} from 'react-native';
import styled from 'styled-components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';

import Text from '../base/Text';

import navigator from '~/navigation/customNavigator';
import {truncateStr} from '~/utils/common';
import {tutorialSelector} from '~/selector/activity';

const TutorialHeader = (props) => {
  const videoTutorial = useSelector(tutorialSelector);
  const {back, close, themeWhite, androidStatusBarColor, onClose} = props;
  const {...updateProps} = props;
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      props.back,
    );

    return () => backHandler.remove();
  }, [props.back]);
  return (
    <SHeader
      style={[styles.header]}
      iosBarStyle={themeWhite ? 'dark-content' : 'light-content'}
      androidStatusBarColor={androidStatusBarColor}
      {...props}>
      <Left style={{height: 42}}>
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
      <Body style={{minWidth: 200, height: 40, alignItems: 'center'}}>
        <Text h5 bold center uppercase color={props.headerContentColor}>
          {truncateStr(props.title, 30)}
        </Text>
      </Body>
      <Right
        style={{
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          marginBottom: 12,
          height: 50,
        }}>
        {!!videoTutorial.tutorial && (
          <Button
            transparent
            onPress={() => {
              navigator.navigate('Youtube', {
                video: {
                  videoId: videoTutorial.tutorial,
                },
              });
            }}>
            <SIonicons
              name="ios-help-circle-outline"
              size={26}
              {...updateProps}
            />
          </Button>
        )}
      </Right>
    </SHeader>
  );
};

TutorialHeader.propTypes = {
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
};

TutorialHeader.defaultProps = {
  title: '',
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
    alignItems: 'center',
    shadowColor: 'rgba(60, 128, 209, 1)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.0851449,
    shadowRadius: 2,
    elevation: 8,
    borderBottomWidth: 0,
    height: 50,
  },
  corner: {
    // width: 32,
    // height: 32,
    // alignItems: 'center',
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

export default TutorialHeader;
