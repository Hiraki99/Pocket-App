import React, {useState, useCallback, useRef, useMemo} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import {View as AnimateView} from 'react-native-animatable';
import {Card as NBCard} from 'native-base';
import PropTypes from 'prop-types';

import Text from '~/BaseComponent/components/base/Text';
import Button from '~/BaseComponent/components/base/Button';
import ReadAndMatchTextItem from '~/BaseComponent/components/elements/script/primary/readAndMatchText/ReadAndMatchTextItem';
import {OS} from '~/constants/os';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';

const ReadAndMatchTextModal = (props) => {
  const itemRef = useRef(null);
  const {
    selectedItem,
    selectedIndex,
    mapAnswerUsed,
    listAnswers,
    closePickAnswerModal,
    pushAnswer,
  } = props;

  const listItems = useMemo(() => {
    let mapUsed = {};
    Object.values(mapAnswerUsed).map((it) => {
      mapUsed[it] = 'used';
    });
    let listAns = [];
    for (let i = 0; i < listAnswers.length; i++) {
      const answer = listAnswers[i];
      listAns.push({
        ...answer,
        used: mapUsed[answer.correctAnswer] === 'used',
      });
    }
    return listAns;
  }, [mapAnswerUsed, listAnswers]);

  const [chooseIndex, setChooseIndex] = useState(-1);

  const renderHeader = useCallback(() => {
    return (
      <View style={stylesModal.headerTop}>
        <ReadAndMatchTextItem
          key={selectedItem.key}
          item={selectedItem}
          index={selectedIndex}
          itemRef={itemRef}
        />
      </View>
    );
  }, [selectedIndex, selectedItem]);

  const chooseAnswer = useCallback((index, answer) => {
    if (itemRef.current) {
      itemRef.current.setAnswer(answer);
      setChooseIndex(index);
    }
  }, []);

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <AnswerItem
          key={item.key}
          item={item}
          index={index}
          chooseIndex={chooseIndex}
          chooseAnswer={chooseAnswer}
        />
      );
    },
    [chooseAnswer, chooseIndex],
  );

  const keyExtractor = useCallback((item) => {
    return item.key;
  }, []);

  const submitAnswer = useCallback(() => {
    if (chooseIndex >= 0) {
      const item = listAnswers[chooseIndex];
      pushAnswer(item.correctAnswer);
      closePickAnswerModal();
    } else {
      closePickAnswerModal();
    }
  }, [chooseIndex, pushAnswer, listAnswers, closePickAnswerModal]);

  return (
    <View style={stylesModal.modalWrapper}>
      <TouchableWithoutFeedback onPress={closePickAnswerModal}>
        <View style={stylesModal.backgroundModal} />
      </TouchableWithoutFeedback>
      <View style={stylesModal.bottomCard}>
        <AnimateView
          animation="fadeInUp"
          useNativeDriver={true}
          easing="ease-in-out"
          duration={300}>
          <View style={stylesModal.contentModal}>
            {renderHeader()}
            <FlatList
              style={stylesModal.flatList}
              data={listItems}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              contentContainerStyle={stylesModal.flatListContentView}
              showsVerticalScrollIndicator={false}
            />
            <View style={stylesModal.bottomWrapper}>
              <Button
                disabled={false}
                large
                primary
                rounded
                block
                uppercase
                bold
                icon
                onPress={submitAnswer}>
                {translate('OK')}
              </Button>
            </View>
          </View>
        </AnimateView>
      </View>
    </View>
  );
};
const AnswerItem = (props) => {
  const {item, chooseAnswer, index, chooseIndex} = props;
  const text = item.correctAnswer;
  const used = item.used;

  const handleChoose = useCallback(() => {
    if (chooseAnswer) {
      chooseAnswer(index, text);
    }
  }, [chooseAnswer, text, index]);

  const renderItem = useCallback(() => {
    let styleItem = [stylesModalItem.item];
    let styleText = [stylesModalItem.text];
    if (used) {
      styleItem.push(stylesModalItem.itemUsed);
      styleText.push(stylesModalItem.textWhite);
    }
    if (chooseIndex === index) {
      styleItem.push(stylesModalItem.itemCorrect);
      styleText.push(stylesModalItem.textWhite);
    }
    return (
      <TouchableWithoutFeedback onPress={handleChoose}>
        <View style={stylesModalItem.itemWrapper}>
          <NBCard style={styleItem}>
            <Text style={styleText}>{text}</Text>
          </NBCard>
        </View>
      </TouchableWithoutFeedback>
    );
  }, [handleChoose, text, chooseIndex, index, used]);
  return renderItem();
};

const stylesModal = StyleSheet.create({
  bottomCard: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: 'rgb(226,230,239)',
    overflow: 'visible',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: OS.hasNotch ? 24 : 10,

    shadowColor: '#3C80D1',
    shadowOffset: {
      width: 0,
      height: -12,
    },
    shadowOpacity: 0.09,
    shadowRadius: 40,
  },
  contentModal: {
    minHeight: 430,
    maxHeight: OS.HEIGHT - 200,
  },
  modalWrapper: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    overflow: 'visible',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  backgroundModal: {
    overflow: 'visible',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  headerTop: {
    marginTop: 15,
  },
  flatList: {
    marginBottom: 15,
    marginTop: 10,
  },
  flatListContentView: {
    paddingBottom: 0,
  },
  bottomWrapper: {
    paddingHorizontal: 25,
    marginBottom: 15,
  },
});

const stylesModalItem = StyleSheet.create({
  itemWrapper: {
    marginHorizontal: 26,
  },
  item: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  itemCorrect: {
    backgroundColor: 'rgb(74,80,241)',
  },
  itemWrong: {
    backgroundColor: 'rgb(251,2,59)',
  },
  itemUsed: {
    backgroundColor: 'rgba(74,80,241, 0.3)',
  },
  text: {
    fontSize: 17,
    color: colors.black,
  },
  textWhite: {
    color: colors.white,
  },
});

export default ReadAndMatchTextModal;

ReadAndMatchTextModal.propTypes = {
  selectedItem: PropTypes.object.isRequired,
  selectedIndex: PropTypes.number,
  mapAnswerUsed: PropTypes.object,
  listAnswers: PropTypes.array,
  closePickAnswerModal: PropTypes.func,
  pushAnswer: PropTypes.func,
};

ReadAndMatchTextModal.defaultProps = {
  selectedItem: {},
  selectedIndex: 0,
  mapAnswerUsed: {},
  listAnswers: [],
  closePickAnswerModal: () => {},
  pushAnswer: () => {},
};
