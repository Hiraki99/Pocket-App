import React from 'react';
import YouTube from 'react-native-youtube';
import Config from 'react-native-config';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

import {OS} from '~/constants/os';
import {colors, images} from '~/themes';

export default class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      quality: null,
      error: null,
      isPlaying: false,
      fullscreen: false,
      started: false,
      isFirst: true,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.start !== prevProps.start && this._youTubeRef) {
      this._youTubeRef.current.seekTo(this.props.start || 0);
    }
  }

  componentWillUnmount(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  _youTubeRef = React.createRef();

  togglePlay = () => {
    this.setState((state) => ({
      isPlaying: !state.isPlaying,
    }));
  };

  checkProgress = (jump = false) => {
    if (this._youTubeRef.current) {
      const {start, end} = this.props;
      const startTimeSeek = OS.IsAndroid ? start : start + 1;
      this._youTubeRef.current.getCurrentTime().then((val) => {
        if (val <= startTimeSeek && jump) {
          this._youTubeRef.current.seekTo(startTimeSeek);
          this.setState({isPlaying: true});
        }

        if (val >= end && end > 0) {
          this._youTubeRef.current.seekTo(startTimeSeek);
          setTimeout(() => {
            this.setState({isPlaying: false});
          }, 100);
          clearInterval(this.timeInterval);
        }
      });
    }
  };

  changeState = (e) => {
    if (e.state === 'buffering') {
      if (!this.state.started) {
        this.checkProgress(true);
        this.setState({started: true});
      }
      // return;
    }
    if (e.state === 'playing') {
      this.timeInterval = setInterval(() => this.checkProgress(), 200);
    } else {
      if (this.timeInterval) {
        clearInterval(this.timeInterval);
      }
      this.setState({started: false});
    }
    this.setState({isFirst: false});
  };

  render() {
    const {videoId, height} = this.props;
    const {fullscreen} = this.state;
    return (
      <View style={{height, backgroundColor: colors.helpText}}>
        {!this.state.isReady && (
          <ActivityIndicator
            size={'large'}
            color={'white'}
            style={{paddingTop: (height - 36) / 2}}
          />
        )}
        <YouTube
          ref={this._youTubeRef}
          apiKey={Config.API_KEY_YOUTUBE_API}
          videoId={videoId}
          play={this.state.isPlaying}
          fullscreen={fullscreen}
          loop={false}
          showinfo={false}
          rel={false}
          modestbranding={false}
          controls={OS.IsAndroid ? 2 : 0}
          onReady={(e) => {
            this.setState({isReady: true});
          }}
          onError={(e) => {
            this.setState({error: e.error});
          }}
          onChangeState={this.changeState}
          style={{
            alignSelf: 'stretch',
            height: this.state.isReady ? height : 0,
            zIndex: 10,
          }}
        />

        {!OS.IsAndroid && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={this.togglePlay}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
            }}>
            {!this.state.isPlaying && !this.state.isFirst && (
              <View
                style={{
                  paddingTop: (height - 40) / 2,
                  position: 'absolute',
                  zIndex: 1000,
                  justifyContent: 'center',
                  marginLeft: (OS.WIDTH - 31) / 2,
                }}>
                <Image
                  source={images.shapePlay}
                  style={{
                    width: 31,
                    height: 40,
                    opacity: 0.9,
                  }}
                />
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

VideoPlayer.propTypes = {
  videoId: PropTypes.string.isRequired,
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

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.black,
    height: OS.GameImageWater,
  },
});
