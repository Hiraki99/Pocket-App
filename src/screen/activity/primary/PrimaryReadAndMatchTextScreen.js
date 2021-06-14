import React, {useEffect, useState, useCallback, useMemo, useRef} from 'react';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import {StyleSheet, View, FlatList} from 'react-native';
import shuffle from 'lodash/shuffle';

import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import {colors} from '~/themes';
import {OS} from '~/constants/os';
import {matchAllRegex, playAudioAnswer} from '~/utils/utils';
import Button from '~/BaseComponent/components/base/Button';
import {
  ContinueBtnState,
  CorrectModalState,
} from '~/features/activity/container/primary/LookAndTraceContainer';
import {generateNextActivity} from '~/utils/script';
import {
  doneQuestion,
  setTotalQuestion,
} from '~/features/activity/ActivityAction';
import {increaseScore} from '~/features/script/ScriptAction';
import Answer from '~/BaseComponent/components/elements/result/Answer';
import ReadAndMatchTextModal from '~/BaseComponent/components/elements/script/primary/readAndMatchText/ReadAndMatchTextModal';
import ReadAndMatchTextItem from '~/BaseComponent/components/elements/script/primary/readAndMatchText/ReadAndMatchTextItem';
import {translate} from '~/utils/multilanguage';

const PrimaryReadAndMatchTextScreen = () => {
  const dispatch = useDispatch();
  const currentItemRef = useRef(null);
  const mapCorrectItems = useRef({});
  const mapAnswerUsed = useRef({});

  const [listItems, setListItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [continueBtnState, setContinueBtnState] = useState(
    ContinueBtnState.CHECK_ANSWER_DISABLE,
  );
  const [correctModalMode, setCorrectModalMode] = useState(
    CorrectModalState.HIDE,
  );
  const [showAnswer, setShowAnswer] = useState(false);

  const getBlankText = useCallback((inputString) => {
    const regex = /\[.*?]/g;
    const listMatchAll = matchAllRegex(regex, inputString);
    let blankText = '';
    listMatchAll.map((it) => {
      blankText = it[0].replace('[', '').replace(']', '').trim();
    });
    return blankText;
  }, []);

  const listCorrectAnswers = useMemo(() => {
    let listCorrect = [];
    for (let i = 0; i < listItems.length; i++) {
      const item = listItems[i];
      if (item.question) {
        listCorrect.push({
          key: item.key,
          correctAnswer: getBlankText(item.question),
        });
      }
    }
    return shuffle(listCorrect);
  }, [listItems, getBlankText]);

  const currentScriptItem = useSelector(
    (state) => state.script.currentScriptItem,
    shallowEqual,
  );

  useEffect(() => {
    if (currentScriptItem) {
      setListItems(currentScriptItem.objects);
      dispatch(setTotalQuestion(1));
    }
  }, [currentScriptItem, dispatch]);

  const selectItem = useCallback((index, params) => {
    currentItemRef.current = params;
    setSelectedIndex(index);
  }, []);

  const pushAnswer = useCallback((text) => {
    if (currentItemRef.current) {
      currentItemRef.current.setAnswer(text);
    }
  }, []);

  const updateCorrectItemStatus = useCallback(
    (key, isCorrect, score, answer) => {
      mapAnswerUsed.current[key] = answer;
      if (listItems.length > 0) {
        mapCorrectItems.current = {
          ...mapCorrectItems.current,
          [key]: {isCorrect: isCorrect, score: score},
        };
        if (Object.keys(mapCorrectItems.current).length === listItems.length) {
          setContinueBtnState(ContinueBtnState.CHECK_ANSWER_ENABLE);
        }
      }
    },
    [listItems],
  );
  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <ReadAndMatchTextItem
          key={item.key}
          item={item}
          index={index}
          selectItem={selectItem}
          updateCorrectStatus={updateCorrectItemStatus}
          showAnswer={showAnswer}
        />
      );
    },
    [selectItem, updateCorrectItemStatus, showAnswer],
  );

  const keyExtractor = useCallback((item) => {
    return item.key;
  }, []);

  const closePickAnswerModal = useCallback(() => {
    setSelectedIndex(-1);
  }, []);

  const renderPickAnswerModal = useCallback(() => {
    if (selectedIndex >= 0) {
      const selectedItem = listItems[selectedIndex];
      return (
        <ReadAndMatchTextModal
          selectedIndex={selectedIndex}
          selectedItem={selectedItem}
          listAnswers={listCorrectAnswers}
          closePickAnswerModal={closePickAnswerModal}
          pushAnswer={pushAnswer}
          mapAnswerUsed={mapAnswerUsed.current}
        />
      );
    }
    return null;
  }, [
    selectedIndex,
    listCorrectAnswers,
    closePickAnswerModal,
    listItems,
    pushAnswer,
  ]);
  const handleContinue = useCallback(() => {
    if (continueBtnState === ContinueBtnState.CHECK_ANSWER_ENABLE) {
      setShowAnswer(true);
      if (mapCorrectItems.current) {
        let totalCorrect = 0;
        let totalWrong = 0;
        let totalScore = 0;
        const values = Object.values(mapCorrectItems.current);
        values.map((it) => {
          if (it.isCorrect === true) {
            totalCorrect += 1;
            totalScore += it.score;
          } else {
            totalWrong += 1;
          }
        });
        playAudioAnswer(totalWrong === 0);
        setCorrectModalMode(
          totalWrong === 0
            ? CorrectModalState.SUCCESS
            : CorrectModalState.WRONG,
        );
        dispatch(doneQuestion());
        dispatch(increaseScore(totalScore, totalCorrect, totalWrong));
        setTimeout(() => {
          setCorrectModalMode(CorrectModalState.HIDE);
        }, 1000);
      }
      setContinueBtnState(ContinueBtnState.CONTINUE_WITH_ANSWER_WRONG);
    } else if (
      continueBtnState === ContinueBtnState.CONTINUE_WITH_ANSWER_WRONG
    ) {
      generateNextActivity();
    }
  }, [dispatch, continueBtnState]);
  const renderContinueButton = useCallback(() => {
    let disable = false;
    let title = `${translate('Kiểm tra')}`;

    if (continueBtnState === ContinueBtnState.CHECK_ANSWER_DISABLE) {
      disable = true;
      title = `${translate('Kiểm tra')}`;
    } else if (continueBtnState === ContinueBtnState.CHECK_ANSWER_ENABLE) {
      disable = false;
      title = `${translate('Kiểm tra')}`;
    } else if (
      continueBtnState === ContinueBtnState.CONTINUE_WITH_ANSWER_WRONG
    ) {
      disable = false;
      title = `${translate('Hoàn thành')}`;
    }

    return (
      <View style={styles.bottomWrapper}>
        <Button
          disabled={disable}
          large
          primary
          rounded
          block
          uppercase
          bold
          icon
          onPress={handleContinue}>
          {title}
        </Button>
      </View>
    );
  }, [continueBtnState, handleContinue]);

  const renderCorrectModal = useCallback(() => {
    if (correctModalMode === CorrectModalState.HIDE) {
      return null;
    }
    return (
      <Answer
        isCorrect={correctModalMode === CorrectModalState.SUCCESS}
        maxHeight={320}
      />
    );
  }, [correctModalMode]);

  if (!currentScriptItem) {
    return null;
  }
  return (
    <ScriptWrapper mainBgColor={colors.white}>
      <FlatList
        style={styles.flatList}
        data={listItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.flatListContentView}
        showsVerticalScrollIndicator={false}
      />
      {renderContinueButton()}
      {renderPickAnswerModal()}
      {renderCorrectModal()}
    </ScriptWrapper>
  );
};

const styles = StyleSheet.create({
  flatList: {
    marginBottom: 25,
  },
  flatListContentView: {
    paddingTop: 10,
    paddingBottom: 48,
  },
  bottomWrapper: {
    paddingHorizontal: 25,
    marginBottom: OS.hasNotch ? 48 : 24,
  },
});

export default PrimaryReadAndMatchTextScreen;
