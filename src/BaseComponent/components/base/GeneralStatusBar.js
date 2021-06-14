import React from 'react';
import {View, StatusBar} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';

const STATUSBAR_HEIGHT = getStatusBarHeight();

const GeneralStatusBar = ({backgroundColor, barStyle, ...props}) => (
  <View style={[styles.statusBar, {backgroundColor}]}>
    <StatusBar
      barStyle={barStyle || 'dark-content'}
      backgroundColor={backgroundColor}
      {...props}
    />
  </View>
);

const styles = {
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
};
export default GeneralStatusBar;
