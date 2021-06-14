import React from 'react';
import {Image, View} from 'react-native';
import Animated from 'react-native-reanimated';
import AutoHeightImage from 'react-native-auto-height-image';
import PropTypes from 'prop-types';

import {AnimatableCard, AnimatableNoFlexContainer, Text} from '~/BaseComponent';
import VideoPlayer from '~/BaseComponent/components/elements/script/VideoPlayer';
import EmbedAudio from '~/BaseComponent/components/elements/script/EmbedAudio';
import {runTiming} from '~/features/liveclass/component/Progress';
import {OS, ConfigAnimationAndroid} from '~/constants/os';
import {colors, images} from '~/themes';
import {translate} from '~/utils/multilanguage';

const {Clock} = Animated;

export default class SentenceActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animationValue: new Animated.Value(OS.HEIGHT / 2),
      height: null,
      endAnimation: false,
    };
  }

  clock = new Clock();
  transY = runTiming(this.clock, -OS.HEIGHT / 2, 0);

  componentDidUpdate(prevProps, prevState): void {
    if (
      OS.IsAndroid &&
      Math.ceil(this.state.height) !== Math.ceil(prevState.height || 0)
    ) {
      Animated.timing(this.state.animationValue, {
        toValue: this.state.height,
        duration: 1000,
        useNativeDriver: true,
      }).start();
      // Animated.parallel([
      //
      //   this.view.animate(ConfigAnimationAndroid.sentenceActivity),
      // ]);
    }
  }

  onLayout = (e) => {
    this.setState({
      height: e.nativeEvent.layout.height + 140,
    });
  };

  renderLogo = () => {
    return (
      <AnimatableNoFlexContainer
        justifyContent="center"
        alignItems="center"
        animation="fadeInUp"
        useNativeDriver={true}
        easing="ease-in-out"
        duration={500}>
        <View style={styles.iconWrap}>
          <Image
            source={images.teacher}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>
      </AnimatableNoFlexContainer>
    );
  };

  renderContent = () => {
    const {activity} = this.props;
    const {data} = activity;
    const {attachment} = data;
    return (
      <>
        <Text bold primary uppercase>
          {translate('Mike')}
        </Text>
        <View>
          {attachment && attachment.type === 'image' && (
            <AutoHeightImage
              source={{uri: attachment.path}}
              width={OS.WIDTH - 24 * 4}
              style={{marginVertical: 10}}
            />
          )}

          {attachment && attachment.type === 'video' && (
            <View style={{width: '100%', marginVertical: 10}}>
              <VideoPlayer
                videoId={attachment.path.id}
                start={attachment.path.start}
                end={attachment.path.end}
                height={200}
              />
            </View>
          )}
        </View>

        <Text bold fontSize={19} style={styles.title}>
          {data.title}
        </Text>
        <Text h5>{data.content}</Text>

        {attachment && attachment.type === 'audio' && (
          <View style={{width: '100%', marginVertical: 10}}>
            <EmbedAudio
              ref={(ref) => (this.audioRef = ref)}
              audio={attachment.path}
            />
          </View>
        )}
      </>
    );
  };
  render() {
    if (OS.IsAndroid) {
      return (
        <View
          style={{
            flex: 1,
            paddingBottom: this.state.endAnimation ? 0 : 1000,
          }}>
          {this.renderLogo()}
          <AnimatableCard
            style={[styles.cardContainer, {height: 'auto'}]}
            ref={(ref) => {
              this.view = ref;
            }}
            onLayout={this.onLayout}
            arrowTranslateX={12}
            hasArrow={true}
            animation={ConfigAnimationAndroid.sentenceActivity}
            onAnimationEnd={() => {
              this.setState({endAnimation: true});
            }}
            useNativeDriver={true}
            easing="ease-out-cubic"
            duration={700}>
            {this.renderContent()}
          </AnimatableCard>
        </View>
      );
    }
    return (
      <View>
        {this.renderLogo()}
        <AnimatableCard
          style={styles.cardContainer}
          ref={(ref) => {
            this.view = ref;
          }}
          // onLayout={this.onLayout}
          arrowTranslateX={12}
          hasArrow={true}
          animation={'fadeInUp'}
          useNativeDriver={true}
          easing="ease-in-out"
          duration={500}
          delay={500}>
          {this.renderContent()}
        </AnimatableCard>
      </View>
    );
  }
}

SentenceActivity.propTypes = {
  activity: PropTypes.object.isRequired,
  isFirst: PropTypes.bool,
};

SentenceActivity.defaultProps = {
  isFirst: true,
};

const styles = {
  wrap: {
    justifyContent: 'center',
  },
  cardContainer: {
    paddingVertical: 20,
    marginTop: 20,
    paddingHorizontal: 24,
    zIndex: 10000,
  },
  title: {
    marginBottom: 8,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    width: 100,
    height: 100,
    borderRadius: 50,
    shadowColor: '#788db4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 8,
  },
  icon: {
    width: 92,
    height: 92,
    borderRadius: 46,
  },
};
