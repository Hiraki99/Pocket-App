import React, {useState, useMemo, useRef, useCallback} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {connect, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {Icon} from 'native-base';

import activityStyles from '~/BaseComponent/components/elements/script/activityStyles';
import {Text} from '~/BaseComponent';
import InlineAttachment from '~/BaseComponent/components/elements/script/attachment/InlineAttachment';
import InlineActivityWrapper from '~/BaseComponent/components/elements/script/InlineActivityWrapper';
import {PronunciationWord} from '~/BaseComponent/components/elements/pronunciation/element/PronunciationWord';
import SpeakVipModal from '~/BaseComponent/components/elements/script/SpeakVipModal';
import {makeid, matchAllRegex, playAudio} from '~/utils/utils';
import colors from '~/themes/colors';
import {makeAction} from '~/utils/action';
import {increaseScore, pushAction} from '~/features/script/ScriptAction';
import * as actionTypes from '~/constants/actionTypes';
import {THRESHOLD} from '~/constants/threshold';
import * as emotions from '~/constants/emotions';
import {OS} from '~/constants/os';
import {infoUserSelector} from '~/selector/user';
import {translate} from '~/utils/multilanguage';

const SpeakCoachPractice = (props) => {
  const userInfo = useSelector(infoUserSelector);
  const modalRef = useRef(null);
  const [data] = useState(
    props.item.data.word || props.item.data.sentence || '',
  );
  const [disable, setDisable] = useState(false);
  const {delay, loadingCompleted, item} = props;

  const pronunciationPractice = useMemo(() => {
    const list = data.split(' ');
    const response = [];
    list.forEach((item) => {
      const pronunciationRegex = /<.*?>/g;
      const listMatchAll = matchAllRegex(pronunciationRegex, item);
      if (pronunciationRegex.test(item)) {
        const analysis = [];
        listMatchAll.map((it, index) => {
          if (index === 0 && it.index > 0) {
            analysis.push({
              word: it.input.slice(0, it.index).trim(),
              key: makeid(8),
            });
          }
          analysis.push({
            word: it[0].replace(/[<|>]/g, '').trim(),
            key: makeid(8),
            primary: true,
            refer: true,
          });
          if (index === listMatchAll.length - 1) {
            analysis.push({
              word: it.input.slice(it[0].length + it.index).trim(),
              key: makeid(8),
            });
          } else {
            analysis.push({
              word: it.input
                .slice(it.index + it[0].length, listMatchAll[index + 1].index)
                .trim(),
              key: makeid(8),
            });
          }
        });
        response.push({
          key: makeid(8),
          word: item,
          analysis,
        });
      } else {
        response.push({
          key: makeid(8),
          word: item,
        });
      }
    });
    return response;
  }, [data]);

  const showModal = () => {
    if (modalRef) {
      modalRef.current.showModal();
    }
    playAudio('selected');
  };

  const onResult = useCallback(
    (data = {}) => {
      let score = 0;
      const {
        pronunciations,
        brief_review,
        detail_review,
        audio_url,
        worst_phone,
        filePath,
        training_phone,
      } = data;
      setDisable(true);
      pronunciations.forEach((item) => (score = item.score_normalize + score));
      score = score / pronunciations.length;
      const actionListenAudioRecorded = makeAction(
        actionTypes.INLINE_USER_AUDIO,
        {
          audio: OS.IsAndroid ? filePath.slice(6) : filePath,
        },
      );
      props.pushAction(actionListenAudioRecorded);
      const actionEvaluateOverview = makeAction(actionTypes.INLINE_SENTENCE, {
        content: brief_review,
        score: score > 0.5 ? 2 : 0,
      });
      const actionScoreResult = makeAction(actionTypes.SPEAKER_RESULT, {
        score: score,
      });
      const dataResult = {
        ...props.item.data,
        attachment: {
          type: 'audio',
          path: audio_url,
        },
        worst_phone,
        pronunciations,
        detail_review,
        training_phone,
      };
      const actionPracticeResult = makeAction(actionTypes.SPEAK_COACH_RESULT, {
        ...dataResult,
        pronunciationPractice,
      });
      let emotionResults = null;

      if (score < THRESHOLD.BAD) {
        emotionResults = emotions.threeWrong;
      }

      if (score >= THRESHOLD.BAD && score < THRESHOLD.PASSABLE) {
        emotionResults = emotions.oneCorrect;
      }

      if (score >= THRESHOLD.PASSABLE && score < THRESHOLD.GOOD) {
        emotionResults = emotions.twoCorrect;
      }

      if (score >= THRESHOLD.GOOD) {
        emotionResults = emotions.threeCorrect;
      }

      const image =
        emotionResults.image[
          Math.floor(Math.random() * emotionResults.image.length)
        ];
      const imageAction = makeAction(
        actionTypes.INLINE_EMOTION,
        {
          image,
        },
        500,
      );

      setTimeout(() => {
        props.pushAction(imageAction);
      }, 2000);

      setTimeout(() => {
        props.pushAction(actionEvaluateOverview);
      }, 4000);

      setTimeout(() => {
        props.pushAction(actionScoreResult);
        setTimeout(() => {
          props.pushAction(actionPracticeResult);
        }, 2000);
      }, 6000);
      if (modalRef.current) {
        modalRef.current.closeModal();
      }
    },
    [pronunciationPractice, userInfo],
  );

  const renderModal = useCallback(() => {
    const {
      item: {data},
    } = props;

    return (
      <SpeakVipModal
        ref={modalRef}
        word={data.word}
        sentence={data.sentence}
        data={pronunciationPractice}
        onResult={onResult}
        scriptData={data}
        pronunciation={data.pronunciation}
      />
    );
  }, [onResult, pronunciationPractice, props]);

  const disableAction =
    item.data?.disableAction !== undefined ? item.data?.disableAction : false;
  const showLoading =
    item.data?.showLoading !== undefined ? item.data?.showLoading : true;
  const autoPlay =
    item.data?.autoPlay !== undefined ? item.data?.autoPlay : true;

  return (
    <InlineActivityWrapper
      loading={showLoading}
      delay={delay}
      loadingCompleted={disableAction ? undefined : loadingCompleted}>
      <View style={[activityStyles.mainInfo, activityStyles.mainInfoNoPadding]}>
        <View style={activityStyles.contentWrap}>
          <Text primary uppercase bold>
            {translate('Mike')}
          </Text>
          <InlineAttachment
            attachment={item.data.attachment}
            darker
            autoPlay={autoPlay}
          />
          <Text h5>
            {item.data && item.data.desc
              ? item.data.desc
              : translate('Nghe và nhắc lại')}
          </Text>
          <PronunciationWord
            data={pronunciationPractice}
            word={!!props.item.data.word}
          />
        </View>
        {renderModal()}
        {!disableAction && (
          <TouchableOpacity
            style={activityStyles.embedBtn}
            activeOpacity={0.6}
            disabled={disable}
            onPress={showModal}>
            <Text primary h5 center>
              <Icon
                name="microphone"
                style={{color: colors.primary, fontSize: 16}}
                type="FontAwesome"
              />{' '}
              {translate('Bắt đầu nói')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </InlineActivityWrapper>
  );
};

SpeakCoachPractice.propTypes = {
  item: PropTypes.object,
};

SpeakCoachPractice.defaultProps = {
  item: {},
};

export default connect(null, {
  pushAction,
  increaseScore,
})(SpeakCoachPractice);
