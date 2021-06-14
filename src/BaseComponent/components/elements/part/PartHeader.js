import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import * as Progress from 'react-native-progress';

import {Text} from '~/BaseComponent';
import {colors} from '~/themes';

export default class PartHeader extends React.PureComponent {
  render() {
    const {lesson} = this.props;

    return (
      <View style={styles.wrap}>
        <Text uppercase bold color={colors.white} style={styles.lessonName}>
          {(lesson?.name || '').replace('Bài', 'unit')}
        </Text>
        <Text h4 bold color={colors.white} paddingVertical={8}>
          {lesson?.display_name || ''}
        </Text>
        <Text color={colors.white} style={styles.lessonDesc}>
          {lesson?.description || ''}
        </Text>
        <Progress.Bar
          progress={0.7}
          color="#FFB300"
          unfilledColor="rgba(255,255,255,0.2)"
          width={100}
          borderWidth={0}
        />
      </View>
    );
  }
}

PartHeader.propTypes = {
  lesson: PropTypes.object.isRequired,
  colorTextHeader: PropTypes.string,
  backgroundHeaderColor: PropTypes.string,
};

PartHeader.defaultProps = {
  colorTextHeader: 'white',
  backgroundColor: '#4A50F1',
};

const styles = {
  wrap: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    paddingTop: 4,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 32,
  },
  btn: {
    paddingRight: 10,
  },
  lessonName: {
    opacity: 0.6,
    marginBottom: 7,
  },
  lessonDesc: {
    opacity: 0.38,
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 22,
  },
};
