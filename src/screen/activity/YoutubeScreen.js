import React from 'react';
import YouTube from 'react-native-youtube';
import Config from 'react-native-config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import {Body, Header, Left, Right} from 'native-base';
import {ActivityIndicator, TouchableOpacity} from 'react-native';

import {OS} from '~/constants/os';
import {colors} from '~/themes';
import {FlexContainer} from '~/BaseComponent';
import navigator from '~/navigation/customNavigator';

export default class VideoPlayer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      quality: null,
      error: null,
      isPlaying: false,
      fullScreen: false,
      ended: false,
      count: 0,
    };

    this.video = navigator.getParam('video', {});
  }

  youTubeRef = React.createRef();

  // componentDidUpdate(prevProps, prevState) {
  //   // if (this.state.ended && this.state.ended !== prevState.ended) {
  //   //   setTimeout(() => {
  //   //     navigator.goBack();
  //   //   }, 200);
  //   // }
  // }

  componentWillUnmount(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  togglePlay = () => {
    this.setState((state) => ({
      isPlaying: !state.isPlaying,
    }));
  };

  checkProgress = () => {
    const video = navigator.getParam('video') || {};
    if (this.youTubeRef.current) {
      this.youTubeRef.current.getCurrentTime().then((val) => {
        if (val < (video.start || 0)) {
          this.youTubeRef.current.seekTo(video.start);
        }

        if (val >= video.end && video.end > 0) {
          setTimeout(() => {
            this.setState({isPlaying: false, ended: true});
          }, 100);
          // this.togglePlay();
          // this.youTubeRef.current.seekTo(this.video.start);
          if (this.timeInterval) {
            clearInterval(this.timeInterval);
          }
        }
      });
    }
  };

  changeState = (e) => {
    if (e.state === 'ended') {
      this.setState({ended: true});
      // setTimeout(() => {
      //   navigator.goBack();
      // }, 2000);
    }
    if (e.state === 'buffering') {
      if (!this.state.started) {
        this.checkProgress(true);
        this.setState({started: true, isPlaying: true});
      }
      return;
    }
    if (e.state === 'playing') {
      setTimeout(() => {
        if (!this.timeInterval) {
          this.timeInterval = setInterval(this.checkProgress, 100);
        }
      }, 1000);
    } else {
      if (OS.IsAndroid) {
        this.setState({isPlaying: false});
      }
      if (this.timeInterval) {
        clearInterval(this.timeInterval);
      }
      this.setState({started: false});
    }
  };

  render() {
    const video = navigator.getParam('video', {});
    if (!video.videoId) {
      return null;
    }
    return (
      <>
        <Header
          style={{backgroundColor: colors.black}}
          iosBarStyle="light-content"
          transparent>
          <Left>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigator.goBack()}>
              <Ionicons
                name={'md-close'}
                color={colors.white}
                size={30}
                style={{paddingHorizontal: 20}}
              />
            </TouchableOpacity>
          </Left>
          <Body />
          <Right />
        </Header>
        <FlexContainer
          justifyContent={'center'}
          style={{backgroundColor: colors.helpText}}>
          {!this.state.isReady && (
            <ActivityIndicator size={'large'} color={'white'} />
          )}
          <YouTube
            ref={this.youTubeRef}
            apiKey={Config.API_KEY_YOUTUBE_API}
            videoId={video.videoId}
            // videoId={'6t-MjBazs3o'}
            origin={'https://www.youtube.com'}
            play={this.state.isPlaying}
            fullscreen={true}
            loop={false}
            showinfo={true}
            rel={false}
            modestbranding={false}
            controls={1}
            onReady={() => {
              this.setState({isReady: true});
              this.youTubeRef.current.seekTo(video.start || 0);
            }}
            onError={(e) => {
              this.setState({error: e.error});
            }}
            onChangeState={this.changeState}
            onChangeFullscreen={(e) => {
              if (!e.isFullscreen && !this.state.ended) {
                navigator.goBack();
              } else {
                if (e.isFullscreen) {
                  this.setState({fullScreen: true});
                }
              }
            }}
            style={{
              flex: this.state.isReady ? 1 : 0,
            }}
          />
        </FlexContainer>
      </>
    );
  }
}

VideoPlayer.propTypes = {
  start: PropTypes.number,
  end: PropTypes.number,
  height: PropTypes.number,
  fullScreen: PropTypes.bool,
};

VideoPlayer.defaultProps = {
  start: 0,
  end: 0,
  height: 0,
  fullScreen: false,
};
