import React, {useState, useMemo, useRef, useCallback, useEffect} from 'react';
import {TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Icon} from 'native-base';

import activityStyles from '~/BaseComponent/components/elements/script/activityStyles';
import {Text} from '~/BaseComponent';
import InlineAttachment from '~/BaseComponent/components/elements/script/attachment/InlineAttachment';
import InlineActivityWrapper from '~/BaseComponent/components/elements/script/InlineActivityWrapper';
import {PronunciationWord} from '~/BaseComponent/components/elements/pronunciation/element/PronunciationWord';
import SpeakVipModal from '~/BaseComponent/components/elements/script/SpeakVipModal';
import {makeid, playAudio} from '~/utils/utils';
import colors from '~/themes/colors';
import SpeakApi from '~/features/speak/SpeakApi';
import {generateNextActivity} from '~/utils/script';
import {makeAction} from '~/utils/action';
import * as actionTypes from '~/constants/actionTypes';
import {pushAction} from '~/features/script/ScriptAction';
import * as emotions from '~/constants/emotions';
import {THRESHOLD} from '~/constants/threshold';
import {translate} from '~/utils/multilanguage';

const SpeakCoachResult = (props) => {
  const modalResultRef = useRef(null);
  const [disable, setDisable] = useState(false);
  const [speakWorstPhone, setSpeakWorstPhone] = useState(false);
  const [infoWorstPhone, setInfoWorstPhone] = useState(null);

  useEffect(() => {
    const fetchInfoWordPhone = async () => {
      if (props.item.data.worst_phone) {
        const res = await SpeakApi.infoPronunciation({
          name: `/${props.item.data.worst_phone}/`,
        });
        if (res.ok && res.data && res.data.length > 0) {
          setInfoWorstPhone(res.data[0]);
        }
      }
    };

    fetchInfoWordPhone().then((r) => r);
  }, [props.item.data.worst_phone]);

  const checkTrainingPhone = (training_phone, letter, word) => {
    const indexTrainPhone = word
      .toLowerCase()
      .indexOf(training_phone.toLowerCase());
    if (indexTrainPhone === -1) {
      return false;
    }
    const arr = [...Array(training_phone.length).keys()].map(
      (i) => i + indexTrainPhone,
    );
    if (arr.includes(letter)) {
      return true;
    }
    return false;
  };

  const pronunciation = useMemo(() => {
    const {pronunciations, training_phone, attachment} = props.item.data;
    const response = [];
    pronunciations.forEach((item) => {
      let incidator = 0;
      const analysis = [];
      item.letters.map((it) => {
        analysis.push({
          word: it.letter,
          key: makeid(8),
          good: it.score_normalize >= THRESHOLD.GOOD,
          passable:
            it.score_normalize >= THRESHOLD.PASSABLE &&
            it.score_normalize < THRESHOLD.GOOD,
          average:
            it.score_normalize > THRESHOLD.BAD &&
            it.score_normalize < THRESHOLD.PASSABLE,
          bad: it.score_normalize <= THRESHOLD.BAD,
          refer: checkTrainingPhone(training_phone, incidator, item.word),
          phone_ipa: it.phones[0].phone_ipa,
        });
        incidator += it.letter.length;
      });
      response.push({
        key: makeid(8),
        word: item,
        analysis,
        attachment: {
          ...attachment,
          startTime: item.start_time,
          endTime: item.end_time,
        },
      });
    });
    return response;
  }, [props.item.data]);

  const onAnswer = (data = {}) => {
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
    pronunciations.forEach((item) => (score = item.score_normalize + score));
    score = score / pronunciations.length;
    const actionListenAudioRecorded = makeAction(
      actionTypes.INLINE_USER_AUDIO,
      {
        audio: filePath,
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
      speakWorstPhone,
    };
    const actionPracticeResult = makeAction(actionTypes.SPEAK_COACH_RESULT, {
      ...dataResult,
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
    modalResultRef.current.closeModal();
    setDisable(true);
  };

  const showModal = (speakWorstPhone = false) => {
    if (modalResultRef) {
      modalResultRef.current.showModal();
      if (speakWorstPhone) {
        setSpeakWorstPhone(true);
      }
    }
    playAudio('selected');
  };

  const disableSpeakWorstPhone = () => {
    setSpeakWorstPhone(false);
  };

  const renderModal = useCallback(() => {
    const {
      item: {data},
    } = props;
    return (
      <SpeakVipModal
        ref={modalResultRef}
        word={data.word}
        sentence={data.sentence}
        data={data.pronunciationPractice}
        scriptData={data}
        pronunciation={data.pronunciation}
        onResult={onAnswer}
        speakWorstPhone={speakWorstPhone}
        infoWorstPhone={infoWorstPhone}
        disableSpeakWorstPhone={disableSpeakWorstPhone}
      />
    );
  }, [infoWorstPhone, onAnswer, props, speakWorstPhone]);

  const {delay, loadingCompleted, item} = props;
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
          {item.data?.attachment && (
            <InlineAttachment
              attachment={item.data?.attachment}
              darker
              autoPlay={autoPlay}
            />
          )}
          <Text h5>{item.data ? item.data.detail_review.trim() : ''}</Text>
          <PronunciationWord
            data={pronunciation}
            word={!!props.item.data.word}
            viewDetail
          />
        </View>
        {renderModal()}
        {!disableAction && (
          <>
            {!props.item.data.speakWorstPhone && (
              <TouchableOpacity
                style={activityStyles.embedBtnNoBorder}
                activeOpacity={0.6}
                disabled={disable}
                onPress={() => showModal()}>
                <Text primary h5 center>
                  <Icon
                    name="microphone"
                    style={{color: colors.primary, fontSize: 16}}
                    type="FontAwesome"
                  />{' '}
                  {translate('Nói lại')}
                </Text>
              </TouchableOpacity>
            )}

            {props.item.data.worst_phone.length > 0 && infoWorstPhone && (
              <TouchableOpacity
                style={activityStyles.embedBtnNoBorder}
                activeOpacity={0.6}
                disabled={disable}
                onPress={() => showModal(true)}>
                <Text primary h5 center>
                  <Icon
                    name="microphone"
                    style={{color: colors.primary, fontSize: 16}}
                    type="FontAwesome"
                  />{' '}
                  {translate('Nói lại âm /%s/', {
                    s1: `${props.item.data.worst_phone}`,
                  })}
                  {/*{` Nói lại âm /${props.item.data.worst_phone}/`}*/}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={activityStyles.embedBtn}
              activeOpacity={0.6}
              disabled={disable}
              onPress={() => {
                playAudio('selected');
                setDisable(true);
                generateNextActivity();
              }}>
              <Text primary h5 center>
                {translate('Tiếp tục')}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </InlineActivityWrapper>
  );
};

SpeakCoachResult.propTypes = {
  item: PropTypes.object,
};

SpeakCoachResult.defaultProps = {
  item: {},
};

export default connect(null, {pushAction})(SpeakCoachResult);
