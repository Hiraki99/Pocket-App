import React from 'react';
import {ImageBackground} from 'react-native';
import {connect} from 'react-redux';
import LottieView from 'lottie-react-native';

import {colors, images} from '~/themes';
import GeneralStatusBar from '~/BaseComponent/components/base/GeneralStatusBar';
import navigator from '~/navigation/customNavigator';
import {playAudio, removeAudio} from '~/utils/utils';

class ActivityFinishedScreen extends React.PureComponent {
  constructor(props) {
    const arr = [
      {voice: 'perfectScore', animate: require('~/assets/animate/drummer')},
      {voice: 'bassRiff', animate: require('~/assets/animate/guitarist')},
    ];

    super(props);

    this.state = {
      animateItem: arr[Math.floor(Math.random() * arr.length)],
    };
  }

  componentDidMount() {
    const {currentActivity, currentScriptItem} = this.props;
    const {script} = currentActivity;
    const index = script.findIndex((item) => item.id === currentScriptItem.id);

    if (index === script.length - 1) {
      setTimeout(() => {
        navigator.navigate('ActivityBoard');
      }, 5000);
    }

    playAudio(this.state.animateItem.voice);
  }

  componentWillUnmount(): void {
    removeAudio(this.state.animateItem.voice);
  }

  render() {
    return (
      <ImageBackground style={styles.wrap} source={images.activityFinish}>
        <GeneralStatusBar
          backgroundColor={colors.denim}
          barStyle="light-content"
        />
        <LottieView
          source={require('~/assets/animate/done-1')}
          autoPlay
          style={{width: 400}}
        />
        <LottieView
          source={this.state.animateItem.animate}
          autoPlay
          style={{width: 260, marginBottom: 80}}
        />
      </ImageBackground>
    );
  }
}

const styles = {
  wrap: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    height: 200,
    marginBottom: 120,
  },
};

const mapStateToProps = (state) => {
  return {
    currentActivity: state.activity.currentActivity,
    currentScriptItem: state.script.currentScriptItem,
  };
};

export default connect(mapStateToProps, null)(ActivityFinishedScreen);
