import React, {useCallback, useState, useMemo} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {Icon} from 'native-base';

import {Text} from '~/BaseComponent';
import InlineActivityWrapper from '~/BaseComponent/components/elements/script/InlineActivityWrapper';
import activityStyles from '~/BaseComponent/components/elements/script/activityStyles';
import EmbedAudio from '~/BaseComponent/components/elements/script/EmbedAudio';
import StressWord from '~/BaseComponent/components/elements/script/speak/StressWord';
import StressRecordButton from '~/BaseComponent/components/elements/script/speak/StressRecordButton';
import StressSentence from '~/BaseComponent/components/elements/script/speak/StressSentence';
import SpeakStressSentenceModal from '~/BaseComponent/components/elements/script/speak/SpeakStressSentenceModal';
import {SpeakStressType} from '~/BaseComponent/components/elements/script/speak/SpeakStressPractice';
import IntonationSentence from '~/BaseComponent/components/elements/script/speak/IntonationSentence';
import AbstractContinueButton from '~/BaseComponent/components/elements/script/speak/AbstractContinueButton';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';

const SpeakStressResult = (props) => {
  const [showSentenceModal, setShowSentenceModal] = useState(false);
  const {item} = props;
  const {data} = item;
  const {type, responseType} = data;

  const {
    detailDataStressWord,
    detailDataStressSentence,
    detailDataIntonationSentence,
  } = data;

  const resultStressWord = useMemo(() => {
    let list = [];
    if (detailDataStressWord) {
      detailDataStressWord.map((it) => {
        list.push({
          isStress: it.expect_stress,
          isCorrect: it.actual_stress === it.expect_stress,
          isActualStress: it.actual_stress,
        });
      });
    }
    return list;
  }, [detailDataStressWord]);

  const resultStressSentence = useMemo(() => {
    let list = [];
    if (detailDataStressSentence) {
      detailDataStressSentence.map((it) => {
        list.push({
          isStress: it.expect_stress,
          isCorrect: it.actual_stress === it.expect_stress,
          isActualStress: it.actual_stress,
          wordIndex: it.word_index,
          word: it.word,
        });
      });
    }
    return list;
  }, [detailDataStressSentence]);

  const resultIntonationSentence = useMemo(() => {
    let list = [];
    if (detailDataIntonationSentence) {
      detailDataIntonationSentence.map((it) => {
        list.push({
          actualType: it.actual_intonation_type,
          expectType: it.expect_intonation_type,
          isCorrect: it.actual_intonation_type === it.expect_intonation_type,
          word: it.word,
          wordIndex: it.word_index,
        });
      });
    }
    return list;
  }, [detailDataIntonationSentence]);

  const renderAudioRecordButton = useCallback((showRecordModal) => {
    return (
      <TouchableOpacity
        style={activityStyles.embedBtnNoBorder}
        activeOpacity={0.6}
        onPress={showRecordModal}>
        <Text primary h5 center>
          <Icon
            name="microphone"
            style={{color: colors.primary, fontSize: 16}}
            type="FontAwesome"
          />{' '}
          {`${translate('Nói lại')}`}
        </Text>
      </TouchableOpacity>
    );
  }, []);

  const renderContinueButton = useCallback(() => {
    return (
      <View style={activityStyles.embedBtn}>
        <Text primary h5 center>
          {`${translate('Tiếp tục')}`}
        </Text>
      </View>
    );
  }, []);

  const renderResultNotMatch = useCallback(() => {
    const {audioRecorded} = data;
    return (
      <InlineActivityWrapper>
        <View
          style={[activityStyles.mainInfo, activityStyles.mainInfoNoPadding]}>
          <View style={activityStyles.contentWrap}>
            <Text primary uppercase bold>
              {`${translate('Mike')}`}
            </Text>
            <EmbedAudio audio={audioRecorded} autoPlay={true} darker />
            <Text h5 bold color={colors.bad}>
              {`${translate('Không được rồi!')}`}
            </Text>
            <Text h5>
              {translate(
                'Bạn nói không đúng nội dung cần phát âm rồi! Hãy nói lại để mình nghe rõ hơn nhé bạn!',
              )}
            </Text>
          </View>
          <StressRecordButton
            renderComponent={renderAudioRecordButton}
            data={data}
          />
          <AbstractContinueButton renderComponent={renderContinueButton} />
        </View>
      </InlineActivityWrapper>
    );
  }, [data, renderAudioRecordButton, renderContinueButton]);

  const renderResultForWord = useCallback(() => {
    const {audioRecorded, detailReview, word, ipa} = data;
    return (
      <InlineActivityWrapper>
        <View
          style={[activityStyles.mainInfo, activityStyles.mainInfoNoPadding]}>
          <View style={activityStyles.contentWrap}>
            <Text primary uppercase bold>
              {`${translate('Mike')}`}
            </Text>
            <EmbedAudio audio={audioRecorded} autoPlay={true} darker />
            <Text h5 bold>
              {translate('Nhận xét')}
            </Text>
            <Text h5>{detailReview}</Text>
          </View>
          <StressWord
            word={word}
            ipa={ipa}
            showIPA={false}
            resultStressWord={resultStressWord}
          />
          <StressWordSignalColumn resultStressWord={resultStressWord} />
          <StressRecordButton
            renderComponent={renderAudioRecordButton}
            data={data}
          />
          <AbstractContinueButton renderComponent={renderContinueButton} />
        </View>
      </InlineActivityWrapper>
    );
  }, [data, renderAudioRecordButton, resultStressWord, renderContinueButton]);

  const closeSentenceModal = useCallback(() => {
    setShowSentenceModal(false);
  }, []);

  const openSentenceModal = useCallback(() => {
    setShowSentenceModal(true);
  }, []);

  const renderSentenceModal = useCallback(() => {
    if (showSentenceModal) {
      return (
        <SpeakStressSentenceModal
          dismiss={closeSentenceModal}
          data={data}
          resultStressSentence={resultStressSentence}
        />
      );
    } else {
      return null;
    }
  }, [showSentenceModal, closeSentenceModal, data, resultStressSentence]);

  const renderResultForSentence = useCallback(() => {
    const {audioRecorded, detailReview, sentence} = data;
    return (
      <InlineActivityWrapper>
        <View
          style={[activityStyles.mainInfo, activityStyles.mainInfoNoPadding]}>
          <View style={activityStyles.contentWrap}>
            <Text primary uppercase bold>
              {`${translate('Mike')}`}
            </Text>
            <EmbedAudio audio={audioRecorded} autoPlay={true} darker />
            <Text h5 bold>
              {translate('Nhận xét')}
            </Text>
            <Text h5>{detailReview}</Text>
          </View>
          <StressSentence
            sentence={sentence}
            onPress={openSentenceModal}
            resultStressSentence={resultStressSentence}
          />
          <StressRecordButton
            renderComponent={renderAudioRecordButton}
            data={data}
          />
          <AbstractContinueButton renderComponent={renderContinueButton} />
        </View>
        {renderSentenceModal()}
      </InlineActivityWrapper>
    );
  }, [
    data,
    renderAudioRecordButton,
    openSentenceModal,
    renderSentenceModal,
    resultStressSentence,
    renderContinueButton,
  ]);

  const renderResultForIntonationSentence = useCallback(() => {
    const {audioRecorded, detailReview, sentence} = data;
    return (
      <InlineActivityWrapper>
        <View
          style={[activityStyles.mainInfo, activityStyles.mainInfoNoPadding]}>
          <View style={activityStyles.contentWrap}>
            <Text primary uppercase bold>
              {`${translate('Mike')}`}
            </Text>
            <EmbedAudio audio={audioRecorded} autoPlay={true} darker />
            <Text h5 bold>
              {`${translate('Nhận xét')}`}
            </Text>
            <Text h5>{detailReview}</Text>
          </View>
          <IntonationSentence
            sentence={sentence}
            resultIntonationSentence={resultIntonationSentence}
          />
          <StressRecordButton
            renderComponent={renderAudioRecordButton}
            data={data}
          />
          <AbstractContinueButton renderComponent={renderContinueButton} />
        </View>
      </InlineActivityWrapper>
    );
  }, [
    data,
    renderAudioRecordButton,
    resultIntonationSentence,
    renderContinueButton,
  ]);

  const renderContent = useCallback(() => {
    if (responseType === 'not-match') {
      return renderResultNotMatch();
    } else {
      if (type === SpeakStressType.WORD) {
        return renderResultForWord();
      } else if (type === SpeakStressType.SENTENCE) {
        return renderResultForSentence();
      } else if (type === SpeakStressType.INTONATION) {
        return renderResultForIntonationSentence();
      }
      return null;
    }
  }, [
    type,
    responseType,
    renderResultForWord,
    renderResultForSentence,
    renderResultForIntonationSentence,
    renderResultNotMatch,
  ]);

  return renderContent();
};

const StressWordSignalColumn = (props) => {
  const {resultStressWord} = props;

  const renderColumnChart = useCallback((showActualStress, listStressWord) => {
    let isCorrectStress = true;
    if (showActualStress) {
      listStressWord.map((it) => {
        if (!it.isCorrect) {
          isCorrectStress = false;
        }
      });
    }
    return (
      <>
        {listStressWord.map((it, idx) => {
          const isStress = showActualStress ? it.isActualStress : it.isStress;
          const height = isStress ? 20 : 10;
          const color = showActualStress
            ? isCorrectStress
              ? colors.good
              : colors.bad
            : colors.primary;
          return (
            <View
              key={idx}
              style={[
                signalStyles.columnItem,
                {
                  height: height,
                  backgroundColor: color,
                },
              ]}
            />
          );
        })}
      </>
    );
  }, []);

  const renderRow = useCallback(
    (title, showActualStress, listStressWord, marginBottom) => {
      return (
        <View style={[signalStyles.lineWrapper, {marginBottom: marginBottom}]}>
          <View style={signalStyles.textWrapper}>
            <Text h5>{title}</Text>
          </View>
          <View style={signalStyles.columnWrapper}>
            {renderColumnChart(showActualStress, listStressWord)}
          </View>
        </View>
      );
    },
    [renderColumnChart],
  );
  return (
    <View style={signalStyles.content}>
      {renderRow(translate('Trọng âm chuẩn'), false, resultStressWord, 8)}
      {renderRow(translate('Trọng âm bạn nói'), true, resultStressWord, 0)}
    </View>
  );
};

const signalStyles = StyleSheet.create({
  content: {
    backgroundColor: 'rgba(226,230,239,0.6)',
    paddingVertical: 15,
  },
  lineWrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  textWrapper: {
    flex: 1,
  },
  columnWrapper: {
    flexDirection: 'row',
    height: 20,
    alignItems: 'flex-end',
  },
  columnItem: {
    width: 10,
    marginRight: 3,
  },
});

SpeakStressResult.propTypes = {
  item: PropTypes.object,
};

SpeakStressResult.defaultProps = {
  item: {},
};

export default SpeakStressResult;
