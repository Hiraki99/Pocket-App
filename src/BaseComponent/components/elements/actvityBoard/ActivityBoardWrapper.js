import React from 'react';
import {ScrollView, View, ImageBackground, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

import {Button, GeneralStatusBar} from '~/BaseComponent';
import {colors, images} from '~/themes';
import {translate} from '~/utils/multilanguage';

export default class ActivityBoardWrapper extends React.Component {
  render() {
    const {
      nextNavigation,
      mainContentStyle,
      loading,
      useImageBackground,
    } = this.props;

    return (
      <ImageBackground
        source={useImageBackground ? images.perfectBackground : null}
        style={styles.imageBackgroundContainer}>
        <GeneralStatusBar barStyle="light-content" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={mainContentStyle}>
          {this.props.children}
        </ScrollView>

        <View style={styles.bottomContainer}>
          <Button
            large
            white
            rounded
            block
            uppercase
            bold
            icon
            loading={loading}
            onPress={nextNavigation}>
            {translate('Tiếp tục')}
          </Button>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  imageBackgroundContainer: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: colors.primary,
  },
  bottomContainer: {paddingTop: 20, paddingBottom: 30},
});
ActivityBoardWrapper.propTypes = {
  nextNavigation: PropTypes.func,
  mainContentStyle: PropTypes.object,
  loading: PropTypes.bool,
  useImageBackground: PropTypes.bool,
};

ActivityBoardWrapper.defaultProps = {
  nextNavigation: () => {},
  mainContentStyle: null,
  loading: false,
  useImageBackground: true,
};
