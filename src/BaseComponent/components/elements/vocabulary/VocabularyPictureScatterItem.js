import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View} from 'react-native';

import {OS} from '~/constants/os';
import {colors} from '~/themes';
import {NoFlexContainer, Text} from '~/BaseComponent';

class VocabularyPictureScatterItem extends React.PureComponent {
  render() {
    const {item, active} = this.props;
    if (!active) {
      return null;
    }
    return (
      <NoFlexContainer
        alignItems={'center'}
        justifyContent={'flex-end'}
        paddingHorizontal={24}>
        <View style={styles.wordContent}>
          <Text
            fontSize={24}
            center
            color={colors.primary}
            bold
            paddingVertical={20}>
            {item.name}
          </Text>
        </View>
      </NoFlexContainer>
    );
  }
}

VocabularyPictureScatterItem.propTypes = {
  item: PropTypes.object,
  onNext: PropTypes.func,
  updateTerminalGame: PropTypes.func,
  nextEnable: PropTypes.bool,
  onEndList: PropTypes.func,
  endGame: PropTypes.bool,
  active: PropTypes.bool,
  level: PropTypes.object,
  time: PropTypes.number,
};

VocabularyPictureScatterItem.defaultProps = {
  item: {},
  onNext: () => {},
  updateTerminalGame: () => {},
  onEndList: () => {},
  nextEnable: true,
  endGame: false,
  active: false,
  level: {},
  time: 0,
};

const styles = StyleSheet.create({
  wave: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    position: 'absolute',
    bottom: OS.Game - 24,
    zIndex: 3,
  },
  answerImgContainer: {
    overflow: 'hidden',
    top: 0,
    height: (OS.HEIGHT * 60) / 100,
    width: '100%',
    position: 'absolute',
    zIndex: 2,
  },
  container: {paddingTop: 80, paddingBottom: 20},
  wordContent: {
    backgroundColor: colors.white,
    width: '100%',
    marginHorizontal: 24,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  responseContainer: {
    position: 'absolute',
    zIndex: 4,
    width: '100%',
    top: 0,
    height: 80,
    backgroundColor: ' rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginLeft: 8,
    backgroundColor: 'rgba(226, 230, 239, 0.6)',
  },
  timeOutContainer: {
    position: 'absolute',
    zIndex: 1001,
    width: '100%',
    top: 0,
    height: '100%',
    backgroundColor: ' rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  result: {
    position: 'absolute',
    borderRadius: 8,
    overflow: 'hidden',
    height: 100,
    width: 100,
    backgroundColor: colors.white,
    justifyContent: 'center',
    marginLeft: 8,
    zIndex: 10,
  },
  resultBg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VocabularyPictureScatterItem;
