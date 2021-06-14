import React from 'react';
import {Image} from 'react-native';
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';
import {View} from 'react-native-animatable';

import {playAudio, removeAudio} from '~/utils/utils';
import {images} from '~/themes';
import activityStyles from '~/BaseComponent/components/elements/script/activityStyles';

export default class InlineActivityWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      doneDelay: false,
    };
  }

  componentDidMount(): void {
    const {loading, loadingCompleted, delay} = this.props;

    if (delay) {
      setTimeout(() => {
        this.setState(
          {
            doneDelay: true,
          },
          () => loadingCompleted(),
        );
      }, delay);
    } else {
      this.setState({doneDelay: true}, () => loadingCompleted());
    }

    if (loading) {
      this.loadingTimeout = setTimeout(() => {
        playAudio('messageSent');
        this.setState({show: true});

        this.loadingCompleteTimeout = setTimeout(() => {
          loadingCompleted();
        }, 1000);
      }, 3000 + delay);
    } else {
      this.setState({show: true});
    }
  }

  componentWillUnmount(): void {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }

    if (this.loadingCompleteTimeout) {
      clearTimeout(this.loadingCompleteTimeout);
    }
    removeAudio('messageSent');
  }

  render() {
    const {show, doneDelay} = this.state;
    const {isUser} = this.props;

    if (!doneDelay) {
      return null;
    }

    return (
      <View
        style={[activityStyles.wrap, isUser ? activityStyles.right : null]}
        animation="fadeInUp"
        useNativeDriver
        easing="ease-in-out"
        delay={500}
        duration={500}>
        {!isUser && (
          <Image source={images.teacher} style={activityStyles.avatar} />
        )}

        {!show && (
          <View
            style={[
              activityStyles.mainInfo,
              activityStyles.mainInfoNoPadding,
              activityStyles.autoWidth,
              {paddingVertical: 0},
            ]}>
            <View style={activityStyles.loading}>
              <LottieView
                source={require('~/assets/animate/pressing')}
                autoPlay
                loop
                speed={0.8}
                style={{width: 50}}
              />
            </View>
          </View>
        )}

        {show && this.props.children}
      </View>
    );
  }
}

InlineActivityWrapper.propTypes = {
  isUser: PropTypes.bool,
  loading: PropTypes.bool,
  loadingCompleted: PropTypes.func,
  delay: PropTypes.number,
};

InlineActivityWrapper.defaultProps = {
  isUser: false,
  loading: true,
  loadingCompleted: () => {},
  delay: 0,
};
