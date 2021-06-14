import React, {useRef} from 'react';
import {StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ModalWrapper from 'react-native-modal-wrapper';
import Carousel from 'react-native-snap-carousel';
import RNFS from 'react-native-fs';

import {colors} from '~/themes';
import {currentScriptSelector} from '~/selector/activity';
import {OS} from '~/constants/os';
import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import {generateNextActivity} from '~/utils/script';
import {setTotalQuestion} from '~/features/activity/ActivityAction';
import ListenAndRepeatKaraoke from '~/BaseComponent/components/elements/karaoke/ListenAndRepeatKaraoke';
import EmbedAudioRecorder from '~/BaseComponent/components/elements/script/EmbedAudioRecorder';
import {playAudioAnswer} from '~/utils/utils';
import {increaseScore} from '~/features/script/ScriptAction';
import AnswerFlashCard from '~/BaseComponent/components/elements/result/flashcard/AnswerFlashCard';

const PrimaryListenAndRepeatLetterScreen = () => {
  const question = useSelector(currentScriptSelector);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = React.useState(false);
  const [showResult, setShowResult] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [listBonus, setListBonus] = React.useState([]);
  const carouselRef = useRef(null);

  React.useEffect(() => {
    const initRecord = async () => {
      const checkExistedFolder = await RNFS.exists(
        RNFS.DocumentDirectoryPath + '/rolePlayRecorder',
      );
      if (!checkExistedFolder) {
        RNFS.mkdir(RNFS.DocumentDirectoryPath + '/rolePlayRecorder');
      }
    };
    initRecord();
    return () => {
      RNFS.unlink(
        `${RNFS.DocumentDirectoryPath}/rolePlayRecorder`,
      ).then(() => {});
    };
  }, []);

  React.useEffect(() => {
    if (question && question.objects) {
      dispatch(setTotalQuestion(question.objects.length));
    }
  }, [dispatch, question]);

  const onNext = React.useCallback(() => {
    if (
      carouselRef.current.currentIndex ===
      (question.objects || []).length - 1
    ) {
      generateNextActivity(500);
    } else {
      setSelectedItem(null);
      setTimeout(() => {
        carouselRef.current.snapToNext();
      }, 250);
    }
  }, [question]);

  const showRecord = React.useCallback((item) => {
    setSelectedItem(item);
    setShowModal(true);
  }, []);

  const renderItem = React.useCallback(
    ({item, index}) => {
      if (index !== activeSlide) {
        return null;
      }
      return (
        <ListenAndRepeatKaraoke
          rawData={item}
          selectedItem={selectedItem}
          onNext={onNext}
          showRecord={showRecord}
        />
      );
    },
    [activeSlide, onNext, showRecord, selectedItem],
  );

  const renderResult = React.useCallback(() => {
    if (!showResult || !selectedItem) {
      return null;
    }
    return <AnswerFlashCard isCorrect={selectedItem.isCorrect} />;
  }, [showResult, selectedItem]);

  return (
    <ScriptWrapper backgroundColor={colors.mainBgColor}>
      <Carousel
        ref={carouselRef}
        data={question.objects || []}
        onSnapToItem={(index) => setActiveSlide(index)}
        renderItem={renderItem}
        sliderWidth={OS.WIDTH}
        itemWidth={OS.WIDTH}
        firstItem={0}
        inactiveSlideScale={1.0}
        inactiveSlideOpacity={1.0}
        overScrollMode={'never'}
        scrollEnabled={false}
        maxToRenderPerBatch={1}
      />
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
            word={selectedItem.text}
            isWord={false}
            // attachment={{item: {audio: selectedItem.audio}}}
            activeScreen={true}
            onRecorded={(isCorrect) => {
              let updateItem = selectedItem;
              if (isCorrect && !listBonus.includes(selectedItem.id)) {
                dispatch(increaseScore(1, 1, 0));
                setListBonus((old) => [...old, selectedItem.id]);
              }
              setSelectedItem({
                ...updateItem,
                isCorrect,
              });
              setShowResult(true);
              playAudioAnswer(isCorrect);
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
    </ScriptWrapper>
  );
};

const styles = StyleSheet.create({
  background: {
    width: OS.WIDTH,
    height: (OS.WIDTH * 1080) / 1440,
    position: 'relative',
    zIndex: 1,
    marginBottom: 24,
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

export default PrimaryListenAndRepeatLetterScreen;
