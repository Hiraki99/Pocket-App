import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TouchableWithoutFeedback, StyleSheet} from 'react-native';

import {Card, Text} from '~/BaseComponent/index';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';

const TimePicker = () => {
  return (
    <TouchableWithoutFeedback>
      <Card style={styles.container} padding={16}>
        <Text h5>{translate('Tháng này')}</Text>
        <AntDesign
          name={'down'}
          size={16}
          color={colors.helpText}
          style={styles.icon}
        />
      </Card>
    </TouchableWithoutFeedback>
  );
};
TimePicker.propTypes = {};
TimePicker.defaultProps = {};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {marginTop: 4},
});
export default TimePicker;
