import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Image} from 'react-native-animatable';

import {NoFlexContainer, Card} from '~/BaseComponent';

const Avatar = (props) => {
  const {onPress, update, uri} = props;
  const defaultAvatar = require('~/assets/images/script/teacher.png');
  const containerUpdateAvatar = require('~/assets/images/haftOval.png');

  return (
    <NoFlexContainer alignItems={'center'}>
      <TouchableOpacity
        activeOpacity={0.85}
        disable={!update}
        onPress={onPress}>
        <Card style={styles.container}>
          <Image
            source={uri ? {uri} : defaultAvatar}
            style={styles.avatar}
            resizeMode="cover"
          />
          {update && (
            <Image
              source={containerUpdateAvatar}
              style={styles.blur}
              resizeMode="contain"
            />
          )}
        </Card>
      </TouchableOpacity>
    </NoFlexContainer>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  avatar: {
    width: 102,
    height: 102,
    borderRadius: 51,
    zIndex: 1,
    position: 'absolute',
  },
  blur: {
    width: 96,
    height: 43,
    zIndex: 200,
    position: 'absolute',
    bottom: 4,
  },
});
