import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {
  View as AnimatedView,
  View as AnimateView,
} from 'react-native-animatable';
import PropTypes from 'prop-types';

import {Button, NoFlexContainer, Text} from '~/BaseComponent';
import EmbedAudioAnimate from '~/BaseComponent/components/elements/result/EmbedAudioAnimate';
import {colors, images} from '~/themes';
import {fetchCourse, changeCurrentCourse} from '~/features/course/CourseAction';
import {OS} from '~/constants/os';
import {translate} from '~/utils/multilanguage';

class ReviewAnswerWrong extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      maxHeight: OS.Game - 24,
    };
  }
  onLayout = (e) => {
    this.setState({
      maxHeight: e.nativeEvent.layout.height,
    });
  };

  render = () => {
    const newBottom = this.state.maxHeight - 24 - OS.headerHeight;
    const heightAnswer =
      OS.HEIGHT - this.state.maxHeight + OS.headerHeight + 24;
    return (
      <>
        <AnimatedView
          animation="fadeInUp"
          useNativeDriver={true}
          easing="ease-in-out"
          duration={500}
          style={[
            styles.responseContainer,
            {bottom: newBottom, height: heightAnswer},
          ]}>
          <NoFlexContainer justifyContent="center" alignItems="center">
            <Image source={images.wrong_answer} style={styles.wrongIcon} />
            <Text
              h2
              fontSize={32}
              bold
              color={colors.white}
              paddingVertical={10}>
              {translate('Chưa chuẩn')}
            </Text>
          </NoFlexContainer>
        </AnimatedView>

        <AnimateView
          style={[styles.result]}
          animation="fadeInUp"
          useNativeDriver={true}
          easing="ease-in-out"
          duration={300}
          onLayout={this.onLayout}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => this.props.onPlayOriginalAudio()}
            style={styles.iconAudioContainer}>
            <View>
              <Image source={images.sound_2} style={styles.iconAudio} />
            </View>
          </TouchableOpacity>
          <View style={styles.wrapper}>
            <Text
              fontSize={19}
              center
              color={colors.helpText}
              accented
              medium
              style={styles.title}>
              {translate('Phần nói của bạn')}
            </Text>
            <EmbedAudioAnimate audio={this.props.audio} />
            <Text
              fontSize={19}
              lineHeight={28}
              center
              color={colors.helpText}
              accented
              medium
              paddingVertical={16}>
              {this.props.content}
            </Text>
          </View>
          <View style={styles.replayButton}>
            <Button
              primary
              rounded
              large
              shadow
              icon
              reloadIcon
              uppercase
              bold
              marginBottom={12}
              onPress={this.props.onRework}>
              {translate('Thử lại')}
            </Button>
            <Button
              primary
              rounded
              large
              outline
              transparent
              shadow={false}
              icon
              uppercase
              bold
              disabled={this.props.loadingAnswer}
              loading={this.props.loadingAnswer}
              onPress={this.props.onSkip}>
              {translate('Bỏ qua')}
            </Button>
          </View>
        </AnimateView>
      </>
    );
  };
}

const styles = {
  result: {
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: '100%',
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevate: 2,
    zIndex: 10,
  },
  correctResult: {
    backgroundColor: '#18D63C',
  },
  wrongResult: {
    backgroundColor: '#FF3636',
  },
  resultBg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconAudioContainer: {
    position: 'absolute',
    top: -20,
    left: OS.WIDTH / 2 - 20,
    zIndex: 100,
  },
  iconAudio: {width: 40, height: 40},
  responseContainer: {
    position: 'absolute',
    zIndex: 0,
    width: '100%',
    bottom: OS.Game - 24,
    height: OS.GameImageWater + OS.headerHeight * 2 + 24,
    backgroundColor: ' rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  replayButton: {marginBottom: 48, width: '100%'},
  titleTextRecord: {paddingBottom: 8, paddingTop: 24},
  title: {paddingTop: 32, paddingBottom: 16},
  wrapper: {width: OS.WIDTH - 48, alignItems: 'center'},
};

ReviewAnswerWrong.propTypes = {
  audio: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  onRework: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired,
  onPlayOriginalAudio: PropTypes.func.isRequired,
  loadingAnswer: PropTypes.bool,
};

ReviewAnswerWrong.defaultProps = {
  loadingAnswer: false,
};

const mapStateToProps = (state) => {
  return {
    courses: state.course.courses,
    currentCourse: state.course.currentCourse,
    loading: state.course.loading,
    errorMessage: state.course.errorMessage,
    user: state.auth.user,
  };
};

export default connect(mapStateToProps, {fetchCourse, changeCurrentCourse})(
  ReviewAnswerWrong,
);
