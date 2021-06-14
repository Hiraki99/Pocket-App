import React from 'react';
import {StyleSheet} from 'react-native';
import styled from 'styled-components';
import {Body, Button, Header, Left, Right} from 'native-base';
import LottieView from 'lottie-react-native';
import PropTypes from 'prop-types';
import * as Progress from 'react-native-progress';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Text from '../base/Text';
import {RowContainer} from '../base/CommonContainer';

import {OS} from '~/constants/os';
import navigator from '~/navigation/customNavigator';

const StarHeader = (props) => {
  const lottieview = React.useRef(null);
  React.useEffect(() => {
    lottieview.current.play();
  }, [props.star]);

  const {
    white,
    primary,
    game,
    star,
    close,
    onClose,
    showBody,
    actionGoActivity,
  } = props;
  return (
    <SHeader
      style={styles.header}
      white={white}
      primary={primary}
      game={game}
      iosBarStyle={game ? 'light-content' : 'dark-content'}
      androidStatusBarColor={props.androidStatusBarColor}>
      <Left>
        {close ? (
          <Button transparent onPress={onClose}>
            <SIcon
              name="ios-close"
              size={32}
              white={white}
              primary={primary}
              game={game}
            />
          </Button>
        ) : (
          <Button
            transparent
            onPress={() => {
              if (props.goActivity) {
                return actionGoActivity();
              }
              navigator.goBack();
            }}>
            <SIcon
              name="ios-arrow-round-back"
              size={32}
              white={white}
              primary={primary}
              game={game}
            />
          </Button>
        )}
      </Left>
      {showBody && (
        <Body
          style={{
            minWidth: 200,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Progress.Bar
            progress={0.5}
            borderRadius={3}
            unfilledColor={white ? '#F3F5F9' : 'rgba(255, 255, 255, 0.2)'}
            color={props.progressBarColor}
            borderWidth={0}
            style={styles.progress}
          />
        </Body>
      )}
      <Right>
        <RowContainer>
          <SText h5 bold uppercase white={white} primary={primary} game={game}>
            {star}
          </SText>
          <LottieView
            ref={lottieview}
            source={require('~/assets/animate/star-blast')}
            style={styles.icon}
            duration={1500}
            loop={false}
          />
        </RowContainer>
      </Right>
    </SHeader>
  );
};

StarHeader.propTypes = {
  title: PropTypes.string,
  androidStatusBarColor: PropTypes.string,
  progressBarColor: PropTypes.string,
  white: PropTypes.bool,
  close: PropTypes.bool,
  primary: PropTypes.bool,
  game: PropTypes.bool,
  star: PropTypes.number,
  onClose: PropTypes.func,
  actionGoActivity: PropTypes.func,
  goActivity: PropTypes.bool,
  showBody: PropTypes.bool,
};

StarHeader.defaultProps = {
  title: '',
  white: false,
  close: false,
  primary: false,
  game: false,
  star: 0,
  showBody: true,
  goActivity: false,
  onClose: () => {},
  actionGoActivity: () => {},
  androidStatusBarColor: 'white',
  progressBarColor: '#FFC64E',
};

const SHeader = styled(Header)`
  background-color: ${(props) => {
    if (props.white) {
      return props.theme.colors.white;
    }
    if (props.primary) {
      return props.theme.colors.white;
    }
    if (props.game) {
      return props.theme.colors.helpText;
    }
  }};
`;

const SIcon = styled(Ionicons)`
  color: ${(props) => {
    if (props.white) {
      return props.theme.colors.primary;
    }
    if (props.primary) {
      return props.theme.colors.white;
    }
    if (props.game) {
      return props.theme.colors.white;
    }
  }};
`;

const SText = styled(Text)`
  color: ${(props) => {
    if (props.white) {
      return props.theme.colors.primary;
    }
    if (props.primary) {
      return props.theme.colors.white;
    }
    if (props.game) {
      return props.theme.colors.white;
    }
  }};
`;

const styles = StyleSheet.create({
  header: {
    shadowColor: '#788db4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 8,
    borderBottomWidth: 0,
  },
  icon: {
    width: 40,
    height: 40,
    // marginHorizontal: 4,
  },
  wrap: {
    backgroundColor: 'rgba(17,0,0,0.6)',
    position: 'relative',
    height: OS.HEIGHT,
  },
  bottomCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: getStatusBarHeight() + 40,
    left: 0,
    right: 0,
    paddingTop: 30,
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  listen: {
    position: 'absolute',
    top: -20,
    left: OS.WIDTH / 2 - 20,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  wordAnswerWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  score: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  result: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  correctResult: {
    backgroundColor: '#18D63C',
  },
  wrongResult: {
    backgroundColor: '#FF3636',
  },
  resultBg: {
    width: '95%',
    height: '95%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StarHeader;
