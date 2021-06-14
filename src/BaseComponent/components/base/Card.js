import React from 'react';
import {View, Platform} from 'react-native';
import {Card as NBCard} from 'native-base';
import PropTypes from 'prop-types';

export default class Card extends React.Component {
  render() {
    const {arrowTranslateX} = this.props;

    return (
      <NBCard {...this.props} noShadow={Platform.OS === 'android'}>
        {this.props.hasArrow && (
          <View
            style={[
              styles.bubbleTriangle,
              {transform: [{translateX: arrowTranslateX}]},
            ]}
          />
        )}
        {this.props.children}
      </NBCard>
    );
  }
}

Card.propTypes = {
  hasArrow: PropTypes.bool,
  arrowTranslateX: PropTypes.number,
};

Card.defaultProps = {
  hasArrow: false,
  arrowTranslateX: -13,
};

const styles = {
  container: {
    borderRadius: 16,
  },
  bubbleTriangle: {
    position: 'absolute',
    transform: [{translateX: -13}],
    left: '50%',
    top: -26,
    width: 0,
    height: 0,
    borderTopWidth: 13,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderLeftWidth: 15,
    borderRightColor: 'transparent',
    borderRightWidth: 15,
    borderBottomColor: 'white',
    borderBottomWidth: 13,
  },
};
