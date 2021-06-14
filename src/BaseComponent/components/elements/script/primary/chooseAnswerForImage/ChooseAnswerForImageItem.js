import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import HTMLView from 'react-native-htmlview';
import PropTypes from 'prop-types';

import {colors} from '~/themes';
import {OS} from '~/constants/os';
import AutoResizeImage from '~/BaseComponent/components/elements/script/primary/lookAndWrite/AutoResizeImage';

const ChooseAnswerForImageItem = (props) => {
  const parentItem = props.item;
  const setCanContinue = props.setCanContinue;
  const imageUrl = parentItem.path;
  const textProps = parentItem.text;
  const listAnswers = parentItem.listAnswers;

  const [selectedIndex, setSelectedIndex] = useState(-1);

  const renderImage = useCallback(() => {
    return <AutoResizeImage url={imageUrl} imageWidth={OS.WIDTH} />;
  }, [imageUrl]);

  const selectAnswer = useCallback(
    (index) => {
      setSelectedIndex(index);
      const answer = listAnswers[index];
      const isCorrect = textProps === answer.text;
      setCanContinue(isCorrect);
    },
    [setCanContinue, listAnswers, textProps],
  );

  const renderItem = useCallback(
    ({item, index}) => {
      const isSelected = index === selectedIndex;
      const isCorrect = textProps === item.text;
      const text = item.text;

      return (
        <AnswerItem
          isSelected={isSelected}
          isCorrect={isCorrect}
          text={text}
          selectItem={selectAnswer}
          index={index}
        />
      );
    },
    [selectedIndex, textProps, selectAnswer],
  );

  return (
    <FlatList
      data={listAnswers}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={renderImage}
      contentContainerStyle={stylesItem.flatListContentView}
    />
  );
};
const AnswerItem = (props) => {
  const {isSelected, isCorrect, selectItem, index, text} = props;

  const onPressItem = useCallback(() => {
    selectItem(index);
  }, [index, selectItem]);

  let styles = [stylesAnswerItem.item];
  let stylesHTML = stylesHtml;
  if (isSelected) {
    styles.push(
      isCorrect ? stylesAnswerItem.itemCorrect : stylesAnswerItem.itemWrong,
    );
    stylesHTML = isCorrect ? stylesCorrectHtml : stylesWrongHtml;
  }

  return (
    <TouchableWithoutFeedback onPress={onPressItem}>
      <View style={styles}>
        <HTMLView value={`<body>${text}</body>`} stylesheet={stylesHTML} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const stylesItem = StyleSheet.create({
  flatListContentView: {
    paddingBottom: 48,
  },
});

const stylesAnswerItem = StyleSheet.create({
  item: {
    backgroundColor: 'rgb(243,245,249)',
    marginTop: 15,
    paddingHorizontal: 35,
    paddingVertical: 10,
    marginHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  itemCorrect: {
    borderWidth: 1,
    borderColor: 'rgb(74, 79, 241)',
    backgroundColor: 'rgb(255,255,239)',
  },
  itemWrong: {
    borderWidth: 1,
    borderColor: 'rgb(251, 2, 59)',
  },
});
const stylesHtml = StyleSheet.create({
  p: {
    fontFamily: 'CircularStd-Book',
    color: colors.helpText,
    fontSize: 19,
    lineHeight: 22,
    paddingBottom: 0,
    marginBottom: 0,
  },
});
const stylesCorrectHtml = StyleSheet.create({
  p: {
    fontFamily: 'CircularStd-Book',
    color: 'rgb(74, 79, 241)',
    fontSize: 19,
    lineHeight: 22,
    paddingBottom: 0,
    marginBottom: 0,
  },
});
const stylesWrongHtml = StyleSheet.create({
  p: {
    fontFamily: 'CircularStd-Book',
    color: 'rgb(251, 2, 59)',
    fontSize: 19,
    lineHeight: 22,
    paddingBottom: 0,
    marginBottom: 0,
  },
});
export default ChooseAnswerForImageItem;

ChooseAnswerForImageItem.propTypes = {
  item: PropTypes.object.isRequired,
  setCanContinue: PropTypes.func,
};

ChooseAnswerForImageItem.defaultProps = {
  item: {path: '', text: '', listAnswers: []},
  setCanContinue: () => {},
};
