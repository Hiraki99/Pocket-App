import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import Sound from 'react-native-sound';
import ModalWrapper from 'react-native-modal-wrapper';
import {useDispatch} from 'react-redux';
import PropTypes from 'prop-types';

import {HighLightText} from '~/BaseComponent/components/elements/script/HighLightText';
import {FlexContainer, RowContainer, Text} from '~/BaseComponent/index';
import EmbedAudioRecorder from '~/BaseComponent/components/elements/script/EmbedAudioRecorder';
import AnswerFlashCard from '~/BaseComponent/components/elements/result/flashcard/AnswerFlashCard';
import Button from '~/BaseComponent/components/base/Button';
import {playAudioAnswer} from '~/utils/utils';
import {increaseScore} from '~/features/script/ScriptAction';
import {OS} from '~/constants/os';
import {doneQuestion} from '~/features/activity/ActivityAction';
import {colors, images} from '~/themes';
import {translate} from '~/utils/multilanguage';

const LetTalkWithSituation = (props) => {
  const dispatch = useDispatch();
  const audiosRef = React.useRef();
  const timeInterval = React.useRef();
  const {question, focus} = props;
  const [showModal, setShowModal] = React.useState(false);
  // const [playState, setPlayState] = React.useState(STATE_AUDIO.PAUSE);
  const [showResult, setShowResult] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [answers, setAnswers] = React.useState([]);
  const [bonusId, setBonusId] = React.useState([]);

  React.useEffect(() => {
    if (question.object.audio) {
      audiosRef.current = new Sound(question.object.audio, '');
    }
  });

  React.useEffect(() => {
    if (selectedItem) {
      timeInterval.current = setInterval(() => {
        audiosRef.current.getCurrentTime((time) => {
          if (selectedItem && time >= parseFloat(selectedItem.end)) {
            if (audiosRef.current) {
              audiosRef.current.pause();
            }
            if (timeInterval.current) {
              clearInterval(timeInterval.current);
            }
          }
        });
      }, 50);
    }
    return () => {
      if (timeInterval.current) {
        clearInterval(timeInterval.current);
      }
    };
  });

  const play = React.useCallback((item) => {
    setSelectedItem(item);
    if (audiosRef.current) {
      audiosRef.current.setCurrentTime(parseFloat(item.start));
      audiosRef.current.play();
    }
  }, []);

  const renderResult = React.useCallback(() => {
    if (!showResult || !selectedItem) {
      return null;
    }

    return <AnswerFlashCard isCorrect={selectedItem.isCorrect} />;
  }, [showResult, selectedItem]);

  const HEIGHT_BACKGROUND = (OS.WIDTH * question.backgroundHeight) / OS.HEIGHT;

  const data = React.useMemo(() => {
    let res = {};

    const getCollision = (itemA, itemB) => {
      const inTop =
        itemA.top - 48 <= itemB.top + itemB.height &&
        itemA.top - 48 >= itemB.top;
      const inTopNoPoint =
        itemA.top <= itemB.top + itemB.height && itemA.top >= itemB.top;

      const inBottom =
        itemA.top + itemA.height + 48 <= itemB.top + itemB.height &&
        itemA.top + itemA.height + 48 >= itemB.top;
      const inBottomNoPoint =
        itemA.top + itemA.height <= itemB.top + itemB.height &&
        itemA.top + itemA.height >= itemB.top;
      const inLeft =
        itemA.left - 48 <= itemB.left + itemB.width &&
        itemA.left - 48 >= itemB.left;
      const inLeftNoPoint =
        itemA.left <= itemB.left + itemB.width && itemA.left >= itemB.left;

      const inRight =
        itemA.left + itemA.width + 48 <= itemB.left + itemB.width &&
        itemA.left + itemA.width + 48 >= itemB.left;
      const inRightNoPoint =
        itemA.left + itemA.width <= itemB.left + itemB.width &&
        itemA.left + itemA.width >= itemB.left;
      // check top
      if (inTop && (inLeftNoPoint || inRightNoPoint)) {
        return 'top';
      }
      // check bottom
      if (inBottom && (inLeftNoPoint || inRightNoPoint)) {
        return 'bottom';
      }
      // check left
      if (inLeft && (inTopNoPoint || inBottomNoPoint)) {
        return 'left';
      }
      // check right
      if (
        (inRight && (inTopNoPoint || inBottomNoPoint)) ||
        itemA.left + itemA.width + 48 >= OS.WIDTH
      ) {
        return 'right';
      }

      return null;
    };

    const getPositionRecorderItem = (item, listAnotherQuestion = []) => {
      const position = ['right', 'left', 'bottom', 'top'];
      let listPositionCollision = [];
      if (listAnotherQuestion.length > 0) {
        listPositionCollision = listAnotherQuestion
          .map((it) => getCollision(item, it))
          .filter((filterItem) => filterItem !== null);
      }
      console.log('listPositionCollision ', listPositionCollision, item);
      if (
        listAnotherQuestion.length === 0 ||
        listPositionCollision.length === 0
      ) {
        if (item.left + item.width + 24 >= OS.WIDTH) {
          return 'left';
        }
        return 'right';
      }

      return position.find((it) => !listPositionCollision.includes(it));
    };

    const layoutsConversations = (question?.object?.conversations || []).map(
      (item) => {
        return {
          ...item,
          width: item.width * OS.WIDTH,
          top: item.y * HEIGHT_BACKGROUND,
          left: item.x * OS.WIDTH,
          height:
            ((question?.object?.default_text_size * OS.WIDTH) /
              question.backgroundWidth) *
            1.25,
        };
      },
    );
    const dubpl = layoutsConversations;
    layoutsConversations.map((item) => {
      res = {
        ...res,
        [item.id]: {
          ...item,
          position: getPositionRecorderItem(
            item,
            dubpl.filter((it) => it.id !== item.id),
          ),
        },
      };
      return item;
    });
    return res;
  }, [question, HEIGHT_BACKGROUND]);

  if (!focus) {
    return null;
  }

  console.log('question ', question);
  return (
    <>
      <FlexContainer justifyContent={'space-between'}>
        <ImageBackground
          resizeMode={'stretch'}
          source={{uri: question.backgroundUrl}}
          style={[styles.background, {height: HEIGHT_BACKGROUND}]}>
          {(question?.object?.conversations || []).map((item) => {
            return (
              <RowContainer
                key={item.id}
                style={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height:
                    question?.object?.default_text_size < 48
                      ? question?.object?.default_text_size * 1.25
                      : ((question?.object?.default_text_size * OS.WIDTH) /
                          question.backgroundWidth) *
                        1.25,
                  position: 'absolute',
                  zIndex: 102,
                  width: item.width * OS.WIDTH,
                  flexWrap: 'wrap',
                  top: item.y * HEIGHT_BACKGROUND,
                  left: item.x * OS.WIDTH,
                }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    play(item);
                  }}>
                  <Text accented>
                    <HighLightText
                      bold
                      content={item.content.trim()}
                      fontSize={
                        (question?.object?.default_text_size * OS.WIDTH) /
                        question.backgroundWidth
                      }
                    />
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectedItem(item);
                    setShowModal(true);
                  }}
                  style={
                    data[item.id]?.position === 'left'
                      ? {
                          position: 'absolute',
                          left: -28,
                        }
                      : data[item.id]?.position === 'bottom'
                      ? {
                          position: 'absolute',
                          bottom: -28,
                          left: (item.width * OS.WIDTH) / 2 - 24,
                        }
                      : data[item.id]?.position === 'top'
                      ? {
                          position: 'absolute',
                          top: -28,
                          left: (item.width * OS.WIDTH) / 2 - 24,
                        }
                      : {
                          position: 'absolute',
                          top: 0,
                          right: -28,
                        }
                  }>
                  <Image
                    source={images.micro_record}
                    style={{width: 24, height: 24}}
                  />
                </TouchableOpacity>
              </RowContainer>
            );
          })}
        </ImageBackground>
        <View paddingHorizontal={24} paddingBottom={OS.hasNotch ? 48 : 24}>
          <Button
            // disabled={
            //   answers.length !== (question?.object?.conversations || []).length
            // }
            onPress={() => props.doneQuestionItem()}
            large
            primary
            rounded
            block
            uppercase
            bold
            icon>
            {`${translate('Tiếp tục')}`}
          </Button>
        </View>
      </FlexContainer>
      <ModalWrapper
        containerStyle={styles.modalContainer}
        onRequestClose={() => {
          setShowModal(false);
          setShowResult(false);
        }}
        shouldAnimateOnRequestClose={true}
        style={styles.modalWrapper}
        visible={showModal}>
        {selectedItem && (
          <EmbedAudioRecorder
            word={selectedItem.content}
            isWord={false}
            activeScreen={true}
            colorHighLight={colors.successChoice}
            onRecorded={(isCorrect) => {
              setShowResult(true);
              playAudioAnswer(isCorrect);
              if (isCorrect && !bonusId.includes(selectedItem.id)) {
                dispatch(increaseScore(1, 1, 0));
                setBonusId((old) => [...old, selectedItem.id]);
              }
              if (!answers.includes(selectedItem.id)) {
                dispatch(doneQuestion());
                setAnswers((old) => [...old, selectedItem.id]);
              }
              setSelectedItem((old) => {
                return {
                  ...old,
                  isCorrect,
                };
              });
              setTimeout(() => {
                setShowResult(false);
                if (isCorrect) {
                  setShowModal(false);
                }
              }, 2000);
            }}
          />
        )}
        {renderResult()}
      </ModalWrapper>
    </>
  );
};

LetTalkWithSituation.propTypes = {
  question: PropTypes.object.isRequired,
  focus: PropTypes.bool,
  doneQuestionItem: PropTypes.func,
};

LetTalkWithSituation.defaultProps = {
  question: {},
  focus: false,
  doneQuestionItem: () => {},
};

const styles = StyleSheet.create({
  background: {
    width: OS.WIDTH,
    position: 'relative',
    zIndex: 1,
  },
  selected: {borderColor: colors.primary, borderWidth: 1},
  modalWrapper: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 48,
  },
  modalContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});

export default LetTalkWithSituation;
