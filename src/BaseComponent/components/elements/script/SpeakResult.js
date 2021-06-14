import React from 'react';
import {Animated, Easing, StyleSheet, Image} from 'react-native';
import PropTypes from 'prop-types';
import {View} from 'react-native-animatable';

import {RowContainer, Text} from '~/BaseComponent';
import activityStyles from '~/BaseComponent/components/elements/script/activityStyles';
import {colors, images} from '~/themes';
import {OS} from '~/constants/os';
const WIDTH_GAS = OS.WIDTH - 154;
import {translate} from '~/utils/multilanguage';

export default class SpeakResult extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      valueDeg: new Animated.Value(0),
    };
  }

  componentDidMount() {
    const {activity} = this.props;
    const {delay, score} = activity.data;
    Animated.timing(this.state.valueDeg, {
      toValue: score > 1 ? score / 100 : score,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    if (delay && delay !== 0) {
      this.timeout = setTimeout(() => {
        this.setState({
          show: true,
        });
      }, delay);
    } else {
      this.setState({
        show: true,
      });
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  render() {
    const {show} = this.state;
    const {activity} = this.props;
    const {score} = activity.data;

    if (!show) {
      return null;
    }

    const spin = this.state.valueDeg.interpolate({
      inputRange: [0, 1],
      outputRange: ['-135deg', '45deg'],
    });
    const spin2 = this.state.valueDeg.interpolate({
      inputRange: [0, 1],
      outputRange: [10, 24],
    });
    const spin3 = this.state.valueDeg.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, -2, -18],
    });

    return (
      <View
        style={[activityStyles.wrap]}
        animation="fadeInUp"
        useNativeDriver
        easing="ease-in-out"
        duration={500}>
        <Image source={images.teacher} style={activityStyles.avatar} />

        <View
          style={[
            activityStyles.mainInfo,
            activityStyles.mainInfoNoPadding,
            {overflow: 'visible'},
          ]}>
          <View style={activityStyles.contentWrap}>
            <Text primary uppercase bold>
              {translate('Mike')}
            </Text>
            <Text h5>
              {translate('Điểm số:')}{' '}
              <Text h5 bold>
                {`${Math.round(score > 1 ? score : (score || 0) * 100)}/100`}
              </Text>
            </Text>
          </View>
          <View style={styles.wrapper}>
            <Image
              source={images.tourist}
              resizeMode={'cover'}
              style={styles.imageTourist}
            />
            <Animated.Image
              source={images.needle}
              resizeMode={'cover'}
              style={[
                styles.needle,
                {
                  transform: [
                    {rotate: spin},
                    {translateX: spin2},
                    {translateY: spin3},
                  ],
                },
              ]}
            />
            <RowContainer
              justifyContent={'space-between'}
              style={styles.containerNeedle}>
              <Text h5 color={colors.helpText}>
                {translate('Tourist')}
              </Text>
              <Text h5 color={colors.helpText}>
                {translate('Native')}
              </Text>
            </RowContainer>
          </View>
        </View>
      </View>
    );
  }
}

SpeakResult.propTypes = {
  activity: PropTypes.object.isRequired,
  score: PropTypes.number,
};

SpeakResult.defaultProps = {
  score: 0,
};

const styles = StyleSheet.create({
  containerNeedle: {width: '100%', paddingHorizontal: 21, paddingTop: 4},
  needle: {
    width: 44,
    height: 46.2,
    position: 'absolute',
    bottom: 50,
    // left: 0,
    left: (OS.WIDTH - 156) / 2,
  },
  imageTourist: {
    width: WIDTH_GAS,
    height: WIDTH_GAS / 2.03,
    paddingHorizontal: 30,
  },
  wrapper: {
    backgroundColor: colors.white,
    paddingVertical: 34,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderColor: '#EDF0F5',
    borderWidth: 1,
  },
});
