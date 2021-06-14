import React, {useCallback, useMemo} from 'react';
import {View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {Icon} from 'native-base';

import {Text} from '~/BaseComponent';
import InlineActivityWrapper from '~/BaseComponent/components/elements/script/InlineActivityWrapper';
import activityStyles from '~/BaseComponent/components/elements/script/activityStyles';
import EmbedAudio from '~/BaseComponent/components/elements/script/EmbedAudio';
import StressWord from '~/BaseComponent/components/elements/script/speak/StressWord';
import StressSentence from '~/BaseComponent/components/elements/script/speak/StressSentence';
import StressRecordButton from '~/BaseComponent/components/elements/script/speak/StressRecordButton';
import IntonationSentence from '~/BaseComponent/components/elements/script/speak/IntonationSentence';
import LinkingSoundSentence from '~/BaseComponent/components/elements/script/speak/LinkingSoundSentence';
import {matchAllRegex} from '~/utils/utils';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';

export const SpeakStressType = {
  WORD: 0,
  SENTENCE: 1,
  INTONATION: 2,
  LINKING_SOUND: 3,
};

const SpeakStressPractice = (props) => {
  const {loadingCompleted, item} = props;
  const {data} = item;
  const {delay} = data;

  const normalizeData = useMemo(() => {
    const {type} = data;
    if (type === 'speaking_stress_word_inline') {
      const {title, title_vn, word, pronunciation, audio, score} = data;
      const mainText = word;
      const regex = /<s>.*?<\/s>/g;
      const listMatchAll = matchAllRegex(regex, mainText);
      let cursorIndex = 0;

      let newWord = '';
      let displayWord = '';

      listMatchAll.map((it) => {
        const itemLength = it[0].length;
        const indexItem = it.index;

        const stringValue = it[0].replace('<s>', '').replace('</s>', '');

        if (cursorIndex < indexItem) {
          const subString = mainText.substr(
            cursorIndex,
            indexItem - cursorIndex,
          );
          newWord += subString;
          displayWord += subString;
        }
        newWord += '<' + stringValue + '>';
        displayWord += stringValue;
        cursorIndex = indexItem + itemLength;
      });
      if (cursorIndex <= mainText.length - 1) {
        const subString = mainText.substr(
          cursorIndex,
          mainText.length - 1 - cursorIndex + 1,
        );
        newWord += subString;
        displayWord += subString;
      }
      return {
        type: SpeakStressType.WORD,
        title: title,
        title_vn: title_vn,
        stressWord: word,
        displayWord: displayWord,
        word: newWord,
        ipa: pronunciation,
        audio: audio,
        score: score,
      };
    } else if (type === 'speaking_stress_sentence_inline') {
      const {title, title_vn, sentence, audio, score} = data;
      return {
        type: SpeakStressType.SENTENCE,
        title: title,
        title_vn: title_vn,
        audio: audio,
        score: score,
        sentence: sentence,
      };
    } else if (type === 'speaking_linking_sound_inline') {
      const {title, title_vn, sentence, audio, score} = data;
      return {
        type: SpeakStressType.LINKING_SOUND,
        title: title,
        title_vn: title_vn,
        audio: audio,
        score: score,
        sentence: sentence,
      };
    } else if (type === 'speaking_intonation_inline') {
      const {title, title_vn, sentence, audio, score} = data;
      return {
        type: SpeakStressType.INTONATION,
        title: title,
        title_vn: title_vn,
        audio: audio,
        score: score,
        sentence: sentence,
      };
    }
  }, [data]);

  const renderAudioRecordButton = useCallback((showRecordModal) => {
    return (
      <TouchableOpacity
        style={activityStyles.embedBtn}
        activeOpacity={0.6}
        onPress={showRecordModal}>
        <Text primary h5 center>
          <Icon
            name="microphone"
            style={{color: colors.primary, fontSize: 16}}
            type="FontAwesome"
          />{' '}
          {translate('Bắt đầu nói')}
        </Text>
      </TouchableOpacity>
    );
  }, []);

  const renderBottomContent = useCallback(() => {
    const {type, sentence, word, ipa} = normalizeData;
    if (type === SpeakStressType.WORD) {
      return <StressWord word={word} ipa={ipa} />;
    } else if (type === SpeakStressType.SENTENCE) {
      return <StressSentence sentence={sentence} />;
    } else if (type === SpeakStressType.INTONATION) {
      return <IntonationSentence sentence={sentence} />;
    } else if (type === SpeakStressType.LINKING_SOUND) {
      return <LinkingSoundSentence sentence={sentence} />;
    }
    return null;
  }, [normalizeData]);

  const {title, title_vn, audio} = normalizeData;
  return (
    <InlineActivityWrapper delay={delay} loadingCompleted={loadingCompleted}>
      <View style={[activityStyles.mainInfo, activityStyles.mainInfoNoPadding]}>
        <View style={activityStyles.contentWrap}>
          <Text primary uppercase bold>
            `${translate('Mike')}`
          </Text>

          <EmbedAudio audio={audio} darker />

          <Text h5 bold>
            {title}
          </Text>
          <Text h5>{title_vn || translate('Nghe và nhắc lại')}</Text>
        </View>
        {renderBottomContent()}
        <StressRecordButton
          renderComponent={renderAudioRecordButton}
          data={normalizeData}
        />
      </View>
    </InlineActivityWrapper>
  );
};

SpeakStressPractice.propTypes = {
  item: PropTypes.object,
};

SpeakStressPractice.defaultProps = {
  item: {},
};

export default SpeakStressPractice;
