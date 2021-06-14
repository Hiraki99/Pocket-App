import React from 'react';
import {StyleSheet} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {NoFlexContainer} from '~/BaseComponent';
import {OS} from '~/constants/os';
import {colors} from '~/themes';
import {getDimensionVideo169} from '~/utils/utils';

export const PreloadVideoComponent = () => {
  return (
    <NoFlexContainer
      justifyContent={'center'}
      alignItems={'center'}
      style={styles.container}>
      <NoFlexContainer
        justifyContent={'center'}
        alignItems={'center'}
        style={styles.container}>
        <FontAwesome name={'play'} size={40} color={colors.white} />
      </NoFlexContainer>
    </NoFlexContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.black,
    height: getDimensionVideo169(OS.WIDTH),
  },
});
