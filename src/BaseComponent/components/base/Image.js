import React from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Platform,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';

export default class CommonImage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      placeholderOpacity: new Animated.Value(1),
      showFallback: false,
      loadEnd: false,
    };
  }

  onLoad = () => {
    const minimumWait = 100;
    const staggerNonce = 200 * Math.random();
    setTimeout(
      () => {
        Animated.timing(this.state.placeholderOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: Platform.OS !== 'android',
        }).start();
      },
      Platform.OS === 'android' ? 0 : Math.floor(minimumWait + staggerNonce),
    );
  };

  onError = (e) => {
    this.setState({
      showFallback: true,
    });
  };

  onLoadEnd = () => {
    this.setState({loadEnd: true});
  };

  render() {
    const hasImage = typeof this.props.source !== 'undefined';

    return (
      <>
        {!this.state.showFallback && this.props.source && (
          <FastImage
            resizeMode={this.props.resizeMode || 'cover'}
            source={this.props.source}
            onLoad={this.onLoad}
            onLoadEnd={this.onLoadEnd}
            onError={this.onError}
            style={[this.props.style]}
          />
        )}

        {/*{this.state.showFallback && (*/}
        {/*  <NativeImage*/}
        {/*    source={require('~/assets/images/common/default-fallback-image.png')}*/}
        {/*    style={this.props.style}*/}
        {/*  />*/}
        {/*)}*/}

        {!this.state.showFallback && !this.state.loadEnd && (
          <Animated.View
            pointerEvents={hasImage ? 'none' : 'auto'}
            accessibilityElementsHidden={hasImage}
            importantForAccessibility={hasImage ? 'no-hide-descendants' : 'yes'}
            style={[
              styles.placeholderContainer,
              {
                opacity: hasImage ? this.state.placeholderOpacity : 1,
              },
            ]}>
            <View
              testID="RNE__Image__placeholder"
              style={[styles.placeholder, this.props.style]}>
              <ActivityIndicator />
            </View>
          </Animated.View>
        )}
      </>
    );
  }
}

const styles = {
  container: {
    backgroundColor: 'transparent',
    position: 'relative',
  },
  placeholderContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  placeholder: {
    backgroundColor: '#EBECF0',
    alignItems: 'center',
    justifyContent: 'center',
    // borderRadius: 50,
  },
};
