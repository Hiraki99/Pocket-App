import React from 'react';
import PropTypes from 'prop-types';
import {View, ViewPropTypes, StyleSheet} from 'react-native';
import variables from '../config/variables';
import Text from '../../Text';

CommonAlertTitle.propTypes = {
  title: PropTypes.string.isRequired,
  titleContainerStyle: ViewPropTypes.style,
  titleStyle: PropTypes.any,
};

CommonAlertTitle.defaultProps = {
  titleContainerStyle: {},
  titleStyle: {},
};

function CommonAlertTitle(props) {
  return (
    <View style={[styles.container, props.titleContainerStyle]}>
      <Text numberOfLines={1} style={[styles.text, props.titleStyle]}>
        {props.title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  text: {
    textAlign: 'center',
    fontSize: variables.largeFontSize,
    color: variables.textColor,
    lineHeight: 30,
  },
});

export default CommonAlertTitle;
