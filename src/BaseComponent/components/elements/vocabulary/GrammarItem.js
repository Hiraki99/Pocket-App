import React from 'react';
import {Image, View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import {OS} from '~/constants/os';
import {Text} from '~/BaseComponent';

export default class GrammarItem extends React.PureComponent {
  render() {
    const {item, marginRight} = this.props;
    return (
      <TouchableOpacity activeOpacity={0.7}>
        <View style={[styles.wrapper, {marginRight}]}>
          <Image style={styles.image} source={item.image} resizeMode="cover" />
          <Text style={styles.name} medium>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

GrammarItem.propTypes = {
  item: PropTypes.object,
  marginRight: PropTypes.number,
};

GrammarItem.defaultProps = {
  marginRight: 7,
};

const styles = {
  wrapper: {
    width: (OS.WIDTH - 55) / 2,
    display: 'flex',
    marginRight: 7,
    marginBottom: 32,
  },
  image: {
    width: (OS.WIDTH - 55) / 2,
    height: 90,
    borderRadius: 8,
    shadowColor: '#3C80D1',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.09,
    shadowRadius: 19,
    elevation: 2,
    marginBottom: 8,
  },
  name: {
    flexWrap: 'wrap',
    fontSize: 17,
    marginBottom: 4,
  },
};
