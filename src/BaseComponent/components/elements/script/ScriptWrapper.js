import React from 'react';
import {BackHandler, View, Image} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Body, Button, Header, Left, Right} from 'native-base';
import styled from 'styled-components';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import * as Progress from 'react-native-progress';

import {RowContainer} from '~/BaseComponent';
import Text from '~/BaseComponent/components/base/Text';
import navigator from '~/navigation/customNavigator';
import {OS} from '~/constants/os';
import {setSkipGenerateActivityAtFirst} from '~/features/activity/ActivityAction';
import {
  forceBackActivity,
  truncateStr,
  acronymName,
  onOffPlayAudioZoom,
} from '~/utils/utils';
import {
  changeCurrentScriptItem,
  pushListActions,
  resetAction,
} from '~/features/script/ScriptAction';
import colors from '~/themes/colors';

class ScriptWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      progress: 0,
    };
  }

  componentDidMount(): void {
    if (this.lottieview) {
      this.lottieview.play();
    }
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.onClose,
    );
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.score !== nextProps.score) {
      if (this.lottieview) {
        this.lottieview.play();
      }
    }
    return true;
  }

  componentWillUnmount(): void {
    if (this.backHandler) {
      this.backHandler.remove();
    }
  }

  onClose = () => {
    const {
      isActivityVip,
      fromWordGroup,
      immediate,
      currentActivity,
    } = this.props;

    if (currentActivity?.scriptInType === 'live_result') {
      resetAction();
      navigator.goBack();
      onOffPlayAudioZoom(true);
      return;
    }
    const isFromLiveClass = currentActivity?.scriptInType === 'live';
    const reset = () => {
      // Khong can reset action voi live class de vao lai thi tiep tuc lam tiep
      if (isFromLiveClass) {
        const {
          setSkipGenerateActivityAtFirst,
          actions,
          pushListActions,
        } = this.props;

        // Skip generate activity at first
        setSkipGenerateActivityAtFirst(currentActivity?._id);

        // Update current list actions: disable show loading, auto play...
        pushListActions(
          actions.map((item) => {
            return {
              ...item,
              data: {...item.data, autoPlay: false, showLoading: false},
            };
          }),
        );
      } else {
        const {changeCurrentScriptItem, resetAction} = this.props;
        changeCurrentScriptItem(null);
        resetAction();
      }
    };
    forceBackActivity(
      immediate,
      reset,
      isActivityVip,
      fromWordGroup,
      isFromLiveClass,
    );
    return true;
  };

  onViewTutorial = () => {
    const {videoTutorial} = this.props;
    navigator.navigate('Youtube', {video: {videoId: videoTutorial.tutorial}});
  };
  renderCenter = () => {
    const {
      currentActivity,
      game,
      showProgress,
      totalQuestion,
      doneQuestion,
    } = this.props;

    if (currentActivity?.scriptInType === 'live_result') {
      return (
        <Body
          style={{
            minWidth: 100,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 6,
            flexDirection: 'row',
          }}>
          <Image
            source={{uri: currentActivity?.studentInfo?.avatar}}
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              borderWidth: 1,
              borderColor: 'rgb(230,230,230)',
            }}
            resizeMode="contain"
          />
          <Text h5 bold uppercase color={colors.helpText} marginLeft={8}>
            {acronymName(currentActivity?.studentInfo?.full_name)}
          </Text>
        </Body>
      );
    }

    const progress = totalQuestion > 0 ? doneQuestion / totalQuestion : 0;

    return (
      <>
        {(!showProgress || game) && (
          <Body
            style={{
              minWidth: 100,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 6,
            }}>
            <Text
              h5
              bold
              uppercase
              color={game ? colors.white : colors.helpText}>
              {truncateStr(
                currentActivity ? currentActivity?.name?.toUpperCase() : '',
                20,
              )}
            </Text>
          </Body>
        )}

        {showProgress && !game && (
          <Body
            style={{
              height: 40,
              minWidth: 150,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 6,
            }}>
            <Progress.Bar
              progress={progress}
              borderRadius={3}
              unfilledColor={'#F3F5F9'}
              color={colors.warning}
              borderWidth={0}
              width={100}
            />
          </Body>
        )}
      </>
    );
  };
  renderRight = () => {
    const {
      currentActivity,
      white,
      primary,
      game,
      score,
      totalScore,
      showProgress,
      videoTutorial,
    } = this.props;

    if (currentActivity?.scriptInType === 'live_result') {
      return null;
    }
    return (
      <>
        {showProgress ? (
          <RowContainer>
            <SText
              h5
              bold
              uppercase
              white={white}
              primary={primary}
              game={game}>
              {totalScore + score}
            </SText>
            <LottieView
              ref={(ref) => {
                this.lottieview = ref;
              }}
              source={require('~/assets/animate/star-blast')}
              style={styles.icon}
              duration={1500}
              loop={false}
            />
          </RowContainer>
        ) : (
          <>
            {!!videoTutorial.tutorial && (
              <Button
                transparent
                onPress={this.onViewTutorial}
                style={{width: 55}}>
                <SIonicons
                  name="ios-help-circle-outline"
                  size={24}
                  white={white}
                  primary={primary}
                  game={game}
                />
              </Button>
            )}
          </>
        )}
      </>
    );
  };
  render() {
    const {mainBgColor, white, primary, game} = this.props;
    return (
      <View style={[styles.wrapper, {backgroundColor: mainBgColor}]}>
        <SHeader
          white={white}
          primary={primary}
          game={game}
          iosBarStyle={game ? 'light-content' : 'dark-content'}
          style={[styles.header]}
          androidStatusBarColor={game ? colors.helpText : colors.white}>
          <Left height={50}>
            <Button transparent onPress={this.onClose} style={{width: 40}}>
              <SIcon
                name="close"
                size={20}
                white={white}
                primary={primary}
                game={game}
              />
            </Button>
          </Left>
          {this.renderCenter()}
          <Right
            style={{
              height: 40,
              alignItems: 'center',
              justifyContent: 'flex-end',
              marginBottom: 10,
            }}>
            {this.renderRight()}
          </Right>
        </SHeader>
        {this.props.children}
      </View>
    );
  }
}

const SHeader = styled(Header)`
  background-color: ${(props) => {
    if (props.white) {
      return colors.white;
    }
    if (props.primary) {
      return colors.white;
    }
    if (props.game) {
      return colors.helpText;
    }

    return colors.white;
  }};
`;

const SIcon = styled(AntDesign)`
  color: ${(props) => {
    if (props.white) {
      return colors.primary;
    }
    if (props.primary) {
      return colors.white;
    }
    if (props.game) {
      return colors.white;
    }

    return colors.primary;
  }};
`;

const SIonicons = styled(Ionicons)`
  color: ${(props) => {
    if (props.white) {
      return colors.primary;
    }
    if (props.primary) {
      return colors.white;
    }
    if (props.game) {
      return colors.white;
    }

    return colors.primary;
  }};
`;

const SText = styled(Text)`
  color: ${(props) => {
    if (props.white) {
      return colors.primary;
    }
    if (props.primary) {
      return colors.white;
    }
    if (props.game) {
      return colors.white;
    }

    return colors.helpText;
  }};
`;

const styles = {
  wrapper: {
    backgroundColor: colors.white,
    flex: 1,
    overflow: 'hidden',
  },
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
  icon: {
    width: 40,
    height: 40,
    marginBottom: OS.IsAndroid ? 0 : 4,
  },
  progress: {
    width: 100,
  },
};

ScriptWrapper.propTypes = {
  mainBgColor: PropTypes.string,
  paddingHorizontal: PropTypes.number,
  paddingTop: PropTypes.number,
  showProgress: PropTypes.bool,
  immediate: PropTypes.bool,
  white: PropTypes.bool,
  primary: PropTypes.bool,
  game: PropTypes.bool,
};

ScriptWrapper.defaultProps = {
  mainBgColor: colors.white,
  paddingHorizontal: 0,
  paddingTop: 0,
  showProgress: true,
  immediate: false,
  white: false,
  primary: false,
  game: false,
};

const mapStateToProps = (state) => {
  const tutorialActivity = state.activity.tutorialActivity;
  const currentScriptItem = state.script.currentScriptItem;
  const videoTutorial = tutorialActivity[currentScriptItem?.type] || {};
  return {
    currentActivity: state.activity.currentActivity,
    actions: state.script.actions,
    videoTutorial,
    isActivityVip: state.activity.isActivityVip,
    currentScriptItem,
    totalScore: state.auth.user.score,
    score: state.script.score,
    totalQuestion: state.activity.totalQuestion,
    doneQuestion: state.activity.doneQuestion,
    user: state.auth.user,
    fromWordGroup: state.vocabulary.fromWordGroup,
  };
};

export default connect(mapStateToProps, {
  setSkipGenerateActivityAtFirst,
  changeCurrentScriptItem,
  resetAction,
  pushListActions,
})(ScriptWrapper);
