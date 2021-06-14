import React from 'react';
import {StyleSheet, Image} from 'react-native';
import {NoFlexContainer} from './CommonContainer';
import PropTypes from 'prop-types';

export default class Logo extends React.PureComponent {
  render() {
    return (
      <NoFlexContainer justifyContent="center" alignItems="center">
        <Image
          source={this.props.images}
          style={styles.logo}
          resizeMode="contain"
        />
      </NoFlexContainer>
    );
  }
}
Logo.propTypes = {
  images: PropTypes.number,
};
Logo.defaultProps = {
  images: null,
};

const styles = StyleSheet.create({
  logo: {width: 98, height: 63},
});
