import React, {useCallback, useState, useRef, useMemo} from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import PropTypes from 'prop-types';

import StressWord from '~/BaseComponent/components/elements/script/speak/StressWord';
import SpeakModal from '~/BaseComponent/components/elements/script/SpeakModal';
import StressSentence from '~/BaseComponent/components/elements/script/speak/StressSentence';
import {SpeakStressType} from '~/BaseComponent/components/elements/script/speak/SpeakStressPractice';
import IntonationSentence from '~/BaseComponent/components/elements/script/speak/IntonationSentence';
import LinkingSoundSentence from '~/BaseComponent/components/elements/script/speak/LinkingSoundSentence';
import {makeAction} from '~/utils/action';
import * as actionTypes from '~/constants/actionTypes';
import {addAction, dispatchAnswerQuestion} from '~/utils/script';
import * as emotions from '~/constants/emotions';
import {translate} from '~/utils/multilanguage';

const StressRecordButton = (props) => {
  const currentPart = useSelector(
    (state) => state.part.currentPart,
    shallowEqual,
  );

  const {renderComponent, data} = props;

  const {type} = data;
  const modalRef = useRef(null);
  const [isDone, setIsDone] = useState(false);

  const customDataModal = useMemo(() => {
    if (type === SpeakStressType.WORD) {
      const stressWord = data.stressWord;
      return {
        type,
        stressWord: stressWord,
        part_id: currentPart ? currentPart._id : '',
      };
    } else if (type === SpeakStressType.SENTENCE) {
      const stressSentence = data.sentence;
      return {
        type,
        stressSentence: stressSentence,
        part_id: currentPart ? currentPart._id : '',
      };
    } else if (type === SpeakStressType.INTONATION) {
      const stressSentence = data.sentence;
      return {
        type,
        stressSentence: stressSentence,
        part_id: currentPart ? currentPart._id : '',
      };
    } else if (type === SpeakStressType.LINKING_SOUND) {
      return {
        type,
        part_id: currentPart ? currentPart._id : '',
      };
    }
    return {};
  }, [data, type, currentPart]);

  const showModal = useCallback(() => {
    if (!isDone && modalRef && modalRef.current) {
      modalRef.current.showModal();
    }
  }, [isDone]);

  const onRecorded = useCallback(
    (filePath, responseData) => {
      if (
        responseData &&
        (responseData.response_type || responseData.api_data)
      ) {
        setIsDone(true);

        const responseType = responseData.response_type;
        let timeOut = 2000;
        const {score} = data;

        const action1 = makeAction(actionTypes.INLINE_USER_AUDIO, {
          audio: filePath,
        });
        addAction(action1);

        if (responseType === 'not-match') {
          const action = makeAction(
            actionTypes.SPEAKING_STRESS_RESULT,
            {
              ...data,
              audioRecorded: filePath,
              responseType: responseType,
            },
            500,
          );
          setTimeout(() => addAction(action), timeOut);
          return;
        } else if (responseType === 'non-ai') {
          const image = emotions.HASH_TABLE_EMOJI.correct_3_3;
          if (image) {
            const imageAction = makeAction(
              actionTypes.INLINE_EMOTION,
              {
                image,
              },
              500,
            );
            setTimeout(() => addAction(imageAction), timeOut);
            timeOut += 2000;
          }

          const action = makeAction(actionTypes.INLINE_SENTENCE, {
            content: translate('OK, để so sánh xem nhé!'),
            score: 1,
            scoreBonus: score,
          });
          setTimeout(() => addAction(action), timeOut);
          timeOut += 2000;

          const action2 = makeAction(
            actionTypes.SPEAKING_STRESS_RESULT_NON_AI,
            {
              ...data,
              audioRecorded: filePath,
            },
            500,
          );
          setTimeout(() => addAction(action2), timeOut);
          dispatchAnswerQuestion(true, score);
          return;
        }

        // Disable show emoji + comment
        // const emoji = responseData.emoji;
        // if (emoji) {
        //   const image = emotions.HASH_TABLE_EMOJI[emoji.name.split('.')[0]];
        //   if (image) {
        //     const imageAction = makeAction(
        //       actionTypes.INLINE_EMOTION,
        //       {
        //         image,
        //       },
        //       500,
        //     );
        //     setTimeout(() => addAction(imageAction), timeOut);
        //     timeOut += 2000;
        //   } else {
        //     const imageAction = makeAction(
        //       actionTypes.INLINE_EMOTION,
        //       {
        //         image: {uri: emoji.path},
        //       },
        //       500,
        //     );
        //     setTimeout(() => addAction(imageAction), timeOut);
        //     timeOut += 2000;
        //   }
        // }

        // if (responseData.brief_review) {
        //   const benchmarkScore = responseData.score_normalize_brief || 0;
        //   const action2 = makeAction(actionTypes.INLINE_SENTENCE, {
        //     content: responseData.brief_review,
        //     score: benchmarkScore,
        //     scoreBonus: score,
        //   });
        //   dispatchAnswerQuestion(benchmarkScore * 100 >= MEDIUM_SCORE, score);
        //   setTimeout(() => addAction(action2), timeOut);
        //   timeOut += 2000;
        // }

        // Disable show score
        // if (responseData.score_normalize_brief) {
        //   const benchmarkScore = responseData.score_normalize_brief;
        //   const action3 = makeAction(
        //     actionTypes.SPEAKER_RESULT,
        //     {
        //       score: benchmarkScore,
        //     },
        //     500,
        //   );
        //   setTimeout(() => addAction(action3), timeOut);
        //   timeOut += 2000;
        // }

        if (type === SpeakStressType.WORD) {
          const action4 = makeAction(
            actionTypes.SPEAKING_STRESS_RESULT,
            {
              ...data,
              audioRecorded: filePath,
              responseType: 'ai',
              detailDataStressWord: responseData.api_data,
              detailReview: responseData.detail_review || '',
            },
            500,
          );
          setTimeout(() => addAction(action4), timeOut);
        }
        if (type === SpeakStressType.SENTENCE) {
          const action4 = makeAction(
            actionTypes.SPEAKING_STRESS_RESULT,
            {
              ...data,
              audioRecorded: filePath,
              responseType: 'ai',
              detailDataStressSentence: responseData.api_data,
              detailReview: responseData.detail_review || '',
            },
            500,
          );
          setTimeout(() => addAction(action4), timeOut);
        }
        if (type === SpeakStressType.INTONATION) {
          const action4 = makeAction(
            actionTypes.SPEAKING_STRESS_RESULT,
            {
              ...data,
              audioRecorded: filePath,
              responseType: 'ai',
              detailDataIntonationSentence: responseData.api_data,
              detailReview: responseData.detail_review || '',
            },
            500,
          );
          setTimeout(() => addAction(action4), timeOut);
        }
      }
    },
    [data, type],
  );

  const renderCustomContent = useCallback(() => {
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
  }, [data, type]);

  const renderRecordModal = useCallback(() => {
    return (
      <SpeakModal
        ref={modalRef}
        word={''}
        sentence={''}
        pronunciation={''}
        onRecorded={onRecorded}
        googleApiKey={''}
        customContent={renderCustomContent}
        customData={customDataModal}
      />
    );
  }, [onRecorded, renderCustomContent, customDataModal]);

  return (
    <>
      {renderComponent(showModal)}
      {renderRecordModal()}
    </>
  );
};

StressRecordButton.propTypes = {
  renderComponent: PropTypes.func,
  data: PropTypes.object,
};

StressRecordButton.defaultProps = {
  renderComponent: () => {},
  data: {},
};

export default StressRecordButton;
