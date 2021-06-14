import React from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';

import Text from '../../base/Text';

import {OS} from '~/constants/os';

const SpeakActivityItem = (props) => {
  const {item, onChange} = props;
  if (!item) {
    return null;
  }
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => onChange(item)}>
      <View style={styles.container}>
        <FastImage source={{uri: item.featured_image}} style={styles.image} />
        <View style={{maxWidth: OS.WIDTH * 0.6}}>
          <Text h5 bold center>
            {item.name}
          </Text>
          <Text fontSize={14} center mainColor opacity={0.54}>
            {item.display_name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

SpeakActivityItem.propTypes = {
  item: PropTypes.object,
  onChange: PropTypes.func,
};
SpeakActivityItem.defaultProps = {
  item: {},
  onChange: () => {},
};

export default SpeakActivityItem;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  image: {width: 108, height: 108, marginBottom: 12},
});
