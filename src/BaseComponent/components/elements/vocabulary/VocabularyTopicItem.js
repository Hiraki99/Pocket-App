import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import {CommonImage, Text} from '~/BaseComponent';
import {OS} from '~/constants/os';
import {getDimensionVideo169} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

export default class VocabularyTopicItem extends React.PureComponent {
  render() {
    const {item, marginRight, action, large} = this.props;

    return (
      <TouchableOpacity activeOpacity={0.7} onPress={action}>
        <View
          style={[large ? styles.wrapperLarge : styles.wrapper, {marginRight}]}>
          <CommonImage
            style={large ? styles.imageLarge : styles.image}
            source={{uri: item.featured_image || item.listen_image}}
            resizeMode="cover"
          />
          <Text style={styles.name} medium>
            {item.name}
          </Text>
          {this.props.showUpLevel &&
            item.degree &&
            typeof item.degree === 'object' && (
              <Text color={'rgba(31,38,49,0.38)'}>
                {translate('Trình độ %s', {
                  s1: `${item.degree.name.toLowerCase()}`,
                })}
              </Text>
            )}
        </View>
      </TouchableOpacity>
    );
  }
}

VocabularyTopicItem.propTypes = {
  item: PropTypes.object,
  marginRight: PropTypes.number,
  action: PropTypes.func,
  showUpLevel: PropTypes.bool,
  large: PropTypes.bool,
};

VocabularyTopicItem.defaultProps = {
  marginRight: 7,
  action: () => {},
  showUpLevel: true,
  large: false,
};

const styles = {
  wrapperLarge: {
    width: OS.WIDTH - 48,
    display: 'flex',
    marginRight: 7,
    // marginBottom: 0,
  },
  imageLarge: {
    width: OS.WIDTH - 48,
    height: getDimensionVideo169(OS.WIDTH - 48),
    borderRadius: 8,
    shadowColor: '#3C80D1',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.09,
    shadowRadius: 19,
    // elevation: 2,
    marginBottom: 8,
  },
  wrapper: {
    width: (OS.WIDTH - 48 - 7) / 2,
    display: 'flex',
    marginRight: 7,
    // marginBottom: 0,
  },
  image: {
    width: (OS.WIDTH - 48 - 7) / 2,
    height: 120,
    borderRadius: 8,
    shadowColor: '#3C80D1',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.09,
    shadowRadius: 19,
    // elevation: 2,
    marginBottom: 8,
  },
  name: {
    flexWrap: 'wrap',
    fontSize: 17,
    marginBottom: 4,
  },
};
