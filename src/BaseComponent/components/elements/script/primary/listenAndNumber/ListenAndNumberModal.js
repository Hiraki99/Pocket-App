import React, {useState, useCallback, useMemo} from 'react';
import {
  View,
  FlatList,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import {View as AnimateView} from 'react-native-animatable';
import {Card as NBCard} from 'native-base';
import PropTypes from 'prop-types';

import Text from '~/BaseComponent/components/base/Text';
import Button from '~/BaseComponent/components/base/Button';
import {IndexView} from '~/BaseComponent/components/elements/script/primary/listenAndNumber/ListenAndNumberItem';
import {colors} from '~/themes';
import {OS} from '~/constants/os';
import {translate} from '~/utils/multilanguage';

const ListenAndNumberModal = (props) => {
  const {
    totalPicture,
    submitAnswer,
    mapAnswer,
    label,
    closePickAnswerModal,
  } = props;

  const [answer, setAnswer] = useState(0);

  const listFlatlist = useMemo(() => {
    let mapUsed = {};
    Object.values(mapAnswer).map((it) => {
      mapUsed[it] = 'used';
    });
    let listFList = [];
    let tempList = [];
    let count = 0;
    for (let i = 1; i <= totalPicture; i++) {
      const it = {value: i, used: mapUsed[i] === 'used'};
      if (count < 2) {
        tempList.push(it);
        count += 1;
      } else {
        listFList.push(tempList);
        tempList = [it];
        count = 1;
      }
    }
    if (count > 0) {
      listFList.push(tempList);
    }
    return listFList;
  }, [mapAnswer, totalPicture]);

  const sendAnswer = useCallback(() => {
    submitAnswer(answer);
  }, [submitAnswer, answer]);

  const chooseNumber = useCallback((number) => {
    setAnswer(number);
  }, []);

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <PickAnswerItem
          key={index}
          list={item}
          answer={answer}
          chooseNumber={chooseNumber}
        />
      );
    },
    [chooseNumber, answer],
  );

  const keyExtractor = useCallback((item, index) => {
    return index;
  }, []);

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
            <View style={stylesModal.headerTop}>
              <IndexView label={label} answer={answer === 0 ? '' : answer} />
            </View>
            <FlatList
              style={stylesModal.flatList}
              data={listFlatlist}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
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
                onPress={sendAnswer}>
                {translate('OK')}
              </Button>
            </View>
          </View>
        </AnimateView>
      </View>
    </View>
  );
};
const PickAnswerItem = (props) => {
  const {list, chooseNumber, answer} = props;

  const renderList = useCallback(() => {
    return (
      <View style={stylesAnswerView.parent}>
        {list.map((it, idx) => {
          return (
            <AnswerView
              key={idx}
              idx={idx}
              number={it.value}
              used={it.used}
              chooseNumber={chooseNumber}
              answer={answer}
            />
          );
        })}
      </View>
    );
  }, [list, answer, chooseNumber]);
  return renderList();
};

const AnswerView = (props) => {
  const {number, idx, chooseNumber, answer, used} = props;

  const onPress = useCallback(() => {
    if (chooseNumber) {
      chooseNumber(number);
    }
  }, [chooseNumber, number]);
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <NBCard
        style={[
          stylesAnswerView.item,
          idx === 1 ? stylesAnswerView.itemMargin : {},
          used ? stylesAnswerView.itemUsed : {},
          answer === number ? stylesAnswerView.itemSelected : {},
        ]}>
        <Text
          style={[
            stylesAnswerView.number,
            answer === number || used ? stylesAnswerView.numberSelected : {},
          ]}>
          {number}
        </Text>
      </NBCard>
    </TouchableWithoutFeedback>
  );
};
const stylesModal = StyleSheet.create({
  modalWrapper: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    overflow: 'visible',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
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
    minHeight: 300,
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
    marginTop: 25,
    alignItems: 'center',
  },
  flatList: {
    marginBottom: 15,
    marginTop: 15,
  },
  flatListContentView: {
    paddingBottom: 0,
  },
  bottomWrapper: {
    paddingHorizontal: 25,
    marginBottom: 15,
  },
});

const CALCULATED_WIDTH_ANSWER_ITEM = (OS.WIDTH - 47 * 2 - 15) / 2.0;
const WIDTH_ANSWER_ITEM =
  CALCULATED_WIDTH_ANSWER_ITEM > 160 ? 160 : CALCULATED_WIDTH_ANSWER_ITEM;

const stylesAnswerView = StyleSheet.create({
  parent: {
    flexDirection: 'row',
    marginHorizontal: (OS.WIDTH - WIDTH_ANSWER_ITEM * 2 - 15) / 2.0,
    marginTop: 10,
  },
  item: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingVertical: 7,
    width: WIDTH_ANSWER_ITEM,
  },
  itemSelected: {
    backgroundColor: 'rgb(74,80,241)',
  },
  itemUsed: {
    backgroundColor: 'rgba(74,80,241, 0.3)',
  },
  itemMargin: {
    marginLeft: 15,
  },
  number: {
    fontSize: 16,
    color: colors.black,
  },
  numberSelected: {
    color: colors.white,
  },
});

export default ListenAndNumberModal;

ListenAndNumberModal.propTypes = {
  totalPicture: PropTypes.number,
  submitAnswer: PropTypes.func,
  mapAnswer: PropTypes.object,
  label: PropTypes.string,
  closePickAnswerModal: PropTypes.func,
};

ListenAndNumberModal.defaultProps = {
  totalPicture: 0,
  submitAnswer: () => {},
  mapAnswer: {},
  label: '#',
  closePickAnswerModal: () => {},
};
