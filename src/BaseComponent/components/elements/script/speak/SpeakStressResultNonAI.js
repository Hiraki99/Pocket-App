import React, {useCallback} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {Icon} from 'native-base';
import WaveForm from 'react-native-audiowaveform';

import {Text} from '~/BaseComponent';
import InlineActivityWrapper from '~/BaseComponent/components/elements/script/InlineActivityWrapper';
import activityStyles from '~/BaseComponent/components/elements/script/activityStyles';
import EmbedAudio from '~/BaseComponent/components/elements/script/EmbedAudio';
import StressWord from '~/BaseComponent/components/elements/script/speak/StressWord';
import StressRecordButton from '~/BaseComponent/components/elements/script/speak/StressRecordButton';
import StressSentence from '~/BaseComponent/components/elements/script/speak/StressSentence';
import {SpeakStressType} from '~/BaseComponent/components/elements/script/speak/SpeakStressPractice';
import IntonationSentence from '~/BaseComponent/components/elements/script/speak/IntonationSentence';
import LinkingSoundSentence from '~/BaseComponent/components/elements/script/speak/LinkingSoundSentence';
import AbstractContinueButton from '~/BaseComponent/components/elements/script/speak/AbstractContinueButton';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';

const SpeakStressResultNonAI = (props) => {
  const {item} = props;
  const {data} = item;
  const {type} = data;

  const renderMainContent = useCallback(() => {
    if (type === SpeakStressType.WORD) {
      const {word, ipa} = data;
      return <StressWord word={word} ipa={ipa} />;
    } else if (type === SpeakStressType.SENTENCE) {
      const {sentence} = data;
      return <StressSentence sentence={sentence} />;
    } else if (type === SpeakStressType.INTONATION) {
      const {sentence} = data;
      return <IntonationSentence sentence={sentence} />;
    } else if (type === SpeakStressType.LINKING_SOUND) {
      const {sentence} = data;
      return <LinkingSoundSentence sentence={sentence} />;
    }
    return null;
  }, [type, data]);

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

  const {audioRecorded, audio} = data;

  return (
    <InlineActivityWrapper>
      <View style={[activityStyles.mainInfo, activityStyles.mainInfoNoPadding]}>
        <View style={activityStyles.contentWrap}>
          <Text primary uppercase bold>
            Mike
          </Text>
          <Text h5 bold>
            {`${translate('So sánh với câu mẫu')}`}
          </Text>
          <Text h5>
            {translate(
              'Hãy nghe lại câu bạn nói và so sánh với câu mẫu coi sao nhé!',
            )}
          </Text>
        </View>
        {renderMainContent()}
        <View style={styles.playerWrapper}>
          <EmbedAudio audio={audioRecorded} autoPlay={false} darker />
        </View>
        <View style={styles.waveFormWrapper}>
          <WaveForm
            style={[styles.waveForm, styles.waveFormMargin]}
            source={{uri: 'file://' + audioRecorded}}
            waveFormStyle={{
              waveColor: colors.primary,
              scrubColor: 'rgba(0,0,0,0)',
            }}
          />
          <WaveForm
            style={styles.waveForm}
            source={{uri: audio}}
            waveFormStyle={{
              waveColor: colors.good,
              scrubColor: 'rgba(0,0,0,0)',
            }}
          />
        </View>
        <View style={styles.playerWrapper}>
          <EmbedAudio audio={audio} autoPlay={false} darker />
        </View>
        <StressRecordButton
          renderComponent={renderAudioRecordButton}
          data={data}
        />
        <AbstractContinueButton renderComponent={renderContinueButton} />
      </View>
    </InlineActivityWrapper>
  );
};

const styles = StyleSheet.create({
  playerWrapper: {
    paddingHorizontal: 16,
  },
  waveForm: {
    height: 30,
  },
  waveFormMargin: {
    marginBottom: 8,
  },
  waveFormWrapper: {
    backgroundColor: 'rgba(226, 230, 239, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});

SpeakStressResultNonAI.propTypes = {
  item: PropTypes.object,
};

SpeakStressResultNonAI.defaultProps = {
  item: {},
};

export default SpeakStressResultNonAI;
