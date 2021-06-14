import React from 'react';
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {View as AnimatedView} from 'react-native-animatable';
import PropTypes from 'prop-types';

import CommonAlertHeader from '../../base/commonAlert/components/CommonAlertHeader';
import CommonAlertTitle from '../../base/commonAlert/components/CommonAlertTitle';
import CommonAlertSubtitle from '../../base/commonAlert/components/CommonAlertSubtitle';
import variables from '../../base/commonAlert/config/variables';
import {Text} from '../../..';

import {colors} from '~/themes';
import {OS} from '~/constants/os';

class OverlayResult extends React.PureComponent {
  render() {
    return (
      <AnimatedView
        style={styles.inner}
        animation="fadeInUp"
        useNativeDriver={true}
        easing="ease-in-out"
        duration={500}>
        <TouchableWithoutFeedback onPress={this.handleOnClose}>
          <View style={[styles.overlay, this.props.overlayStyle]} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[
            styles.contentContainer,
            {transform: this.interpolationTranslate},
          ]}>
          <CommonAlertHeader {...this.props} />
          <View style={styles.innerContent}>
            <CommonAlertTitle {...this.props} />
            {this.props.memo && (
              <Text h4 bold center paddingVertical={16} color={colors.helpText}>
                {this.props.memo}
              </Text>
            )}
            <CommonAlertSubtitle {...this.props} />
            <View style={styles.bodyContainer}>{this.props.children}</View>
          </View>
        </Animated.View>
      </AnimatedView>
    );
  }
}

const styles = {
  inner: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    zIndex: 100,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    zIndex: 110,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
  },
  contentContainer: {
    zIndex: 150,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
    marginTop: OS.headerHeight,
    position: 'relative',
  },
  innerContent: {
    padding: variables.gutter,
    paddingTop: 24,
    borderRadius: variables.baseBorderRadius,
    backgroundColor: variables.baseBackgroundColor,
    width: variables.contentWidth,
  },
  bodyContainer: {
    marginTop: variables.gutter,
    justifyContent: 'flex-end',
  },
};

OverlayResult.propTypes = {
  isCorrect: PropTypes.bool,
  timeout: PropTypes.bool,
};

OverlayResult.defaultProps = {
  isCorrect: false,
  timeout: false,
};

export default OverlayResult;
