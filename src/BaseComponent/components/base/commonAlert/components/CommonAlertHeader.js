import React from 'react';
import PropTypes from 'prop-types';
import {View, ViewPropTypes, StyleSheet, Image} from 'react-native';
import images from '../config/images';
import variables from '../config/variables';
import {themeType, defaultThemeType} from '../config/types';

function CommonAlertHeader(props) {
  return (
    <View style={[styles.container, props.headerContainerStyles]}>
      <View
        style={[
          styles.inner,
          props.headerInnerStyles,
          {backgroundColor: variables[`${props.theme}Background`]},
        ]}>
        {!props.headerIconComponent && (
          <Image source={{uri: images[props.theme]}} style={styles.image} />
        )}
        {props.headerIconComponent}
      </View>
    </View>
  );
}

CommonAlertHeader.propTypes = {
  headerContainerStyles: ViewPropTypes.style,
  headerInnerStyles: ViewPropTypes.style,
  theme: themeType,
  headerIconComponent: PropTypes.node,
};

CommonAlertHeader.defaultProps = {
  headerContainerStyles: {},
  headerInnerStyles: {},
  theme: defaultThemeType,
  headerIconComponent: null,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 150,
    top: 0,
    left: variables.contentWidth / 2 + 6,
    padding: 4,
    width: 72,
    height: 72,
    backgroundColor: '#fff',
    borderRadius: 36,
  },
  inner: {
    width: 64,
    height: 64,
    backgroundColor: '#fff',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 32,
    width: 32,
  },
});

export default CommonAlertHeader;
