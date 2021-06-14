import React, {useCallback} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Text as TextReact,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';

import Text from '~/BaseComponent/components/base/Text';
import {OS} from '~/constants/os';
import {colors} from '~/themes';

const ListenAndNumberItem = (props) => {
  const {
    list,
    showPickAnswerModal,
    mapAnswer,
    playAudioClip,
    showAnswer,
  } = props;

  const renderList = useCallback(() => {
    return (
      <View style={stylesItem.item}>
        {list.map((it, idx) => {
          const answer = mapAnswer[it.id] || '';
          return (
            <PictureItem
              key={it.id}
              item={it}
              index={idx}
              showPickAnswerModal={showPickAnswerModal}
              answer={answer}
              playAudioClip={playAudioClip}
              showAnswer={showAnswer}
            />
          );
        })}
      </View>
    );
  }, [list, showPickAnswerModal, mapAnswer, playAudioClip, showAnswer]);
  return renderList();
};

const PictureItem = (props) => {
  const {
    item,
    showPickAnswerModal,
    index,
    answer,
    playAudioClip,
    showAnswer,
  } = props;
  const label = item.label;
  const isCorrect = item.correctIndex === answer;

  const playAudio = useCallback(() => {
    const clip = {start: item.start, end: item.end};
    playAudioClip(clip);
  }, [playAudioClip, item.start, item.end]);

  const renderCorrectAnswer = useCallback(() => {
    if (showAnswer) {
      return (
        <View style={stylesItem.correctView}>
          <TextReact style={stylesItem.correctLabel}>
            {item.correctIndex}
          </TextReact>
        </View>
      );
    }
    return null;
  }, [showAnswer, item.correctIndex]);
  return (
    <View
      style={[
        stylesItem.childItem,
        index === 1 ? stylesItem.childItemWithMargin : {},
      ]}
      key={item.id}>
      <TouchableWithoutFeedback onPress={playAudio}>
        <FastImage
          style={stylesItem.image}
          source={{
            uri: item.image,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </TouchableWithoutFeedback>
      {renderCorrectAnswer()}
      <View style={stylesItem.topRightView}>
        <IndexView
          label={label}
          itemId={item.id}
          showPickAnswerModal={showPickAnswerModal}
          answer={answer}
          showAnswer={showAnswer}
          isCorrect={isCorrect}
        />
      </View>
    </View>
  );
};

export const IndexView = (props) => {
  const label = props.label;
  const answer = props.answer || '';
  const itemId = props.itemId || '';
  const showAnswer = props.showAnswer || false;
  const isCorrect = props.isCorrect || false;
  const isShowWrong = showAnswer && !isCorrect;
  const showPickAnswerModal = props.showPickAnswerModal;

  const pickAnswer = useCallback(() => {
    if (showAnswer) {
      return;
    }
    if (showPickAnswerModal) {
      const params = {label: label, itemId: itemId};
      showPickAnswerModal(params);
    }
  }, [showPickAnswerModal, label, itemId, showAnswer]);
  return (
    <TouchableWithoutFeedback onPress={pickAnswer}>
      <View style={stylesNumberView.item}>
        <View style={stylesNumberView.labelBg}>
          <Text style={stylesNumberView.label}>{label}</Text>
        </View>
        <View
          style={[
            stylesNumberView.numberBg,
            isShowWrong ? stylesNumberView.numberBgWrong : {},
          ]}>
          <Text
            style={[
              stylesNumberView.number,
              isShowWrong ? stylesNumberView.numberWrong : {},
            ]}>
            {answer}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const CALCULATED_WIDTH_ITEM = (OS.WIDTH - 20 * 2 - 10) / 2.0;
const WIDTH_ITEM = CALCULATED_WIDTH_ITEM > 180 ? 180 : CALCULATED_WIDTH_ITEM;

const stylesItem = StyleSheet.create({
  item: {
    flexDirection: 'row',
    marginHorizontal: (OS.WIDTH - WIDTH_ITEM * 2 - 10) / 2.0,
    marginTop: 10,
  },
  childItem: {
    width: WIDTH_ITEM,
    height: WIDTH_ITEM,
    borderRadius: 15,
    backgroundColor: colors.white,
  },
  childItemWithMargin: {
    marginLeft: 10,
  },
  image: {
    width: WIDTH_ITEM - 10,
    height: WIDTH_ITEM - 10,
    position: 'absolute',
    top: 5,
    left: 5,
    borderRadius: 15,
  },
  topRightView: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  correctView: {
    width: WIDTH_ITEM - 10,
    height: WIDTH_ITEM - 10,
    position: 'absolute',
    top: 5,
    left: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 15,
  },
  correctLabel: {
    fontSize: 60,
    color: colors.white,
    fontWeight: 'bold',
  },
});

const stylesNumberView = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelBg: {
    backgroundColor: 'rgb(74,80,241)',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  label: {
    fontSize: 15,
    color: colors.white,
  },
  numberBg: {
    width: 28,
    height: 28,
    backgroundColor: colors.white,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: 'rgb(74,80,241)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  numberBgWrong: {
    borderColor: colors.milanoRed,
  },
  number: {
    fontSize: 16,
    color: 'rgb(74,80,241)',
  },
  numberWrong: {
    color: colors.milanoRed,
  },
});

export default ListenAndNumberItem;

ListenAndNumberItem.propTypes = {
  list: PropTypes.array.isRequired,
  showPickAnswerModal: PropTypes.func,
  mapAnswer: PropTypes.object,
  playAudioClip: PropTypes.func,
  showAnswer: PropTypes.bool,
};
ListenAndNumberItem.defaultProps = {
  list: [],
  showPickAnswerModal: () => {},
  mapAnswer: {},
  playAudioClip: () => {},
  showAnswer: false,
};
