import React from 'react';
import {View} from 'react-native';
import LottieView from 'lottie-react-native';
import Text from './Text';

export default class Loading extends React.Component {
  render() {
    return (
      <View
        style={{justifyContent: 'center', alignItems: 'center'}}
        {...this.props}>
        <LottieView
          source={require('~/assets/animate/loading')}
          autoPlay
          loop
          style={{width: 120}}
        />

        <Text wrongChoice style={{marginTop: -40, fontSize: 16}}>
          {this.props.loadingText}
        </Text>
      </View>
    );
  }
}
