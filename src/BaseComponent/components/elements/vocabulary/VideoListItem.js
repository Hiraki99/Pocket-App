import React from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import PropTypes from 'prop-types';

import {OS} from '~/constants/os';
import {Text} from '~/BaseComponent';
import {colors, images} from '~/themes';

export default class VideoListItem extends React.PureComponent {
  render() {
    const {item, index, isActive, action} = this.props;

    return (
      <TouchableOpacity activeOpacity={0.7} onPress={action}>
        <View style={[styles.wrapper, isActive ? styles.wrapperActive : null]}>
          <View>
            <Image
              style={styles.image}
              source={{
                uri: `https://img.youtube.com/vi/${item.video_id}/hqdefault.jpg`,
              }}
              resizeMode="cover"
            />
            <Image style={styles.playIcon} source={images.playIconSm} />
            <View style={styles.index}>
              <Text color={colors.white} fontSize={12} bold accented>
                {index < 9 ? '0' + (index + 1) : index + 1}
              </Text>
            </View>
          </View>
          <View flex={1}>
            <Text fontSize={17} bold={isActive} primary={isActive}>
              {item.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

VideoListItem.propTypes = {
  index: PropTypes.number,
  item: PropTypes.object,
  isActive: PropTypes.bool,
  action: PropTypes.func,
};

VideoListItem.defaultProps = {
  isActive: false,
  index: 0,
  action: () => {},
};

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    width: OS.WIDTH,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.white,
  },
  wrapperActive: {
    backgroundColor: '#F3F5F9',
  },
  image: {
    borderRadius: 8,
    width: 92,
    height: 52,
    marginRight: 16,
    shadowColor: '#3C80D1',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.09,
    shadowRadius: 19,
  },
  index: {
    backgroundColor: 'rgba(31,38,49,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20,
    height: 20,
    borderTopLeftRadius: 8,
  },
  playIcon: {
    width: 18,
    height: 18,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -18,
    marginTop: -9,
  },
};
