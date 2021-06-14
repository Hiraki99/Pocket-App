import React from 'react';
import PropTypes from 'prop-types';
import {View, ViewPropTypes, StyleSheet} from 'react-native';
import HTML from 'react-native-render-html';

import variables from '../config/variables';
import Text from '../../Text';

import {colors} from '~/themes';

CommonAlertSubtitle.propTypes = {
  subtitle: PropTypes.string.isRequired,
  subtitleContainerStyle: ViewPropTypes.style,
  subtitleStyle: PropTypes.object,
  html: PropTypes.bool,
};

CommonAlertSubtitle.defaultProps = {
  subtitleContainerStyle: {},
  subtitleStyle: {},
  html: false,
};

function CommonAlertSubtitle(props) {
  return (
    <View style={[styles.container, props.subtitleContainerStyle]}>
      {!props.html ? (
        <Text style={[styles.subtitle, props.subtitleStyle]}>
          {props.subtitle}
        </Text>
      ) : (
        <HTML
          // key={item.id}
          html={props.subtitle}
          tagsStyles={stylesHtml.tagsStyles}
          renderers={{
            a: (htmlAttribs, children, convertedCSSStyles, passProps) => {
              return (
                <Text {...passProps} accessibilityRole={'button'} accessible>
                  {children}&#160;
                </Text>
              );
            },
            p: (htmlAttribs, children, convertedCSSStyles, passProps) => {
              return (
                <Text {...passProps} accessibilityRole={'button'} accessible>
                  {children}&#160;
                </Text>
              );
            },
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: variables.mediumFontSize,
    color: variables.subtitleColor,
  },
});

const stylesHtml = {
  tagsStyles: {
    p: {
      fontSize: 17,
      fontFamily: 'CircularStd-Book',
      color: colors.helpText,
    },
    strong: {
      fontSize: 17,
      fontFamily: 'CircularStd-Book',
      color: colors.helpText,
    },
    a: {
      fontSize: 17,
      color: colors.helpText,
      textDecorationLine: 'none',
      fontFamily: 'CircularStd-Book',
    },
    article: {
      backgroundColor: 'yellow',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  },
};

export default CommonAlertSubtitle;
