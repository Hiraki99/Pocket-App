import React from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import {
  StyleSheet,
  View as NativeView,
  TouchableWithoutFeedback,
} from 'react-native';
import {useDispatch} from 'react-redux';
import LottieView from 'lottie-react-native';

import {RowContainer, Text} from '~/BaseComponent/index';
import activityStyles from '~/BaseComponent/components/elements/script/activityStyles';
import GivenWordModal from '~/BaseComponent/components/elements/script/GivenWordModal';
import {OS} from '~/constants/os';
import {colors} from '~/themes';
import {makeid, playAudioAnswer} from '~/utils/utils';
import {doneQuestion} from '~/features/activity/ActivityAction';
import {increaseScore} from '~/features/script/ScriptAction';
const infoWidth = OS.WIDTH - 24 * 2 - 24 * 2 - 8 * 2;
import {translate} from '~/utils/multilanguage';

const ConversationLetTalk = (props) => {
  const {conversation, pushActions} = props;
  const modalRef = React.useRef(null);
  const [data, setData] = React.useState(conversation);
  const [show, setShow] = React.useState(false);
  const [isPushed, setIsPushed] = React.useState(false);
  const dispatch = useDispatch();
  const CONVERSATION_CONTENT = conversation && conversation.type === 'content';
  const CONVERSATION_ANSWER = conversation && conversation.type === 'answer';
  const CONVERSATION_ANSWER_WRONG =
    conversation && conversation.type === 'answer_wrong';
  const answers = React.useMemo(() => {
    return (conversation.answers || []).map((item) => {
      return {
        key: makeid(32),
        text: item,
        isAnswer: true,
      };
    });
  }, [conversation]);

  React.useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 1000);
  }, []);

  const animatedEnd = React.useCallback(() => {
    console.log('animatedEnd ', data);
    if (data.type !== 'answer' && !isPushed) {
      pushActions(data);
      setIsPushed(true);
    }
  }, [data, pushActions, isPushed]);

  const onDone = React.useCallback(
    (isCorrect, answer) => {
      playAudioAnswer(isCorrect);
      if (modalRef.current) {
        modalRef.current.closeModal();
      }
      setData((oldData) => {
        return {
          ...oldData,
          isAnswer: true,
          isCorrect,
          userAnswer: answer,
        };
      });
      dispatch(doneQuestion());
      if (isCorrect) {
        pushActions(data);
        dispatch(increaseScore(1, 1, 0));
      } else {
        dispatch(increaseScore(0, 0, 1));
        pushActions({
          ...data,
          userAnswer: answer,
          nextItem: {
            key: makeid(16),
            speakerObject: data.speakerObject,
            type: 'answer_wrong',
            correctAnswer: (data?.answers || []).join(' '),
            nextItem: data.nextItem,
          },
        });
      }
    },
    [pushActions, data, dispatch],
  );
  const renderContent = React.useCallback(() => {
    return (
      <>
        <FastImage
          source={{
            uri: data?.speakerObject?.avatar,
          }}
          style={styles.avatar}
        />
        <NativeView style={styles.mainInfo}>
          <Text color={colors.primary} uppercase bold>
            {data?.speakerObject?.name}
          </Text>
          <RowContainer>
            <Text h5 color={colors.helpText} paddingTop={4}>
              {(data?.content || '').trim()}
            </Text>
          </RowContainer>
        </NativeView>
      </>
    );
  }, [data]);

  const renderAnswer = React.useCallback(() => {
    return (
      <>
        <FastImage
          source={{
            uri: data?.speakerObject?.avatar,
          }}
          style={styles.avatar}
        />
        <TouchableWithoutFeedback
          onPress={() => {
            modalRef.current.showModal();
          }}>
          <NativeView
            style={[styles.mainInfo, data.isAnswer ? null : {width: 160}]}>
            <Text color={colors.primary} uppercase bold>
              {data?.speakerObject?.name}
            </Text>
            {!data.isAnswer ? (
              <RowContainer
                justifyContent={'center'}
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: colors.primary,
                  paddingVertical: 8,
                }}>
                <Text h5 primary center medium>
                  {translate('Trả lời ngay')}
                </Text>
              </RowContainer>
            ) : (
              <RowContainer>
                <Text h5 color={colors.helpText} paddingTop={4}>
                  {data.userAnswer}
                </Text>
              </RowContainer>
            )}
          </NativeView>
        </TouchableWithoutFeedback>
      </>
    );
  }, [data]);

  const renderWrongAnswer = React.useCallback(() => {
    return (
      <>
        <FastImage
          source={{
            uri: data?.speakerObject?.avatar,
          }}
          style={styles.avatar}
        />
        <TouchableWithoutFeedback
          onPress={() => {
            modalRef.current.showModal();
          }}>
          <NativeView style={[styles.mainInfo]}>
            <Text color={colors.primary} uppercase bold>
              {data?.speakerObject?.name}
            </Text>
            <Text fontSize={19} color={colors.helpText} medium>
              {`${translate('Sai rồi!')}`}
            </Text>
            <RowContainer>
              <Text h5 color={colors.helpText} paddingTop={4}>
                <Text h5 medium color={colors.helpText}>
                  {`${translate('Đáp án đúng là:')}`}&nbsp;
                </Text>
                {data.correctAnswer}
              </Text>
            </RowContainer>
          </NativeView>
        </TouchableWithoutFeedback>
      </>
    );
  }, [data]);

  return (
    <NativeView
      style={CONVERSATION_CONTENT ? styles.wrapRecorder : styles.wrap}>
      {!show ? (
        <View style={activityStyles.loading}>
          <LottieView
            source={require('~/assets/animate/pressing')}
            autoPlay
            loop
            speed={0.8}
            style={{width: 50}}
          />
        </View>
      ) : (
        <View
          style={[CONVERSATION_CONTENT ? styles.wrapRecorder : styles.wrap]}
          animation={'fadeInRight'}
          onAnimationEnd={animatedEnd}
          useNativeDriver
          easing="ease-in-out"
          delay={500}
          duration={1000}>
          {CONVERSATION_CONTENT && renderContent()}
          {CONVERSATION_ANSWER && renderAnswer()}
          {CONVERSATION_ANSWER_WRONG && renderWrongAnswer()}
        </View>
      )}
      {!CONVERSATION_CONTENT && (
        <GivenWordModal
          ref={modalRef}
          options={answers}
          score={1}
          onDone={onDone}
          usingStore={false}
        />
      )}
    </NativeView>
  );
};
ConversationLetTalk.propTypes = {
  conversation: PropTypes.object.isRequired,
  pushActions: PropTypes.func,
};
ConversationLetTalk.defaultProps = {
  conversation: {},
  pushActions: () => {},
};
const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  wrapRecorder: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  mainInfo: {
    position: 'relative',
    borderRadius: 20,
    backgroundColor: '#F3F5F9',
    paddingVertical: 16,
    paddingHorizontal: 16,
    width: infoWidth,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  mainInfoRecorder: {
    position: 'relative',
    borderRadius: 20,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 16,
    width: infoWidth,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  translateWrap: {
    alignSelf: 'center',
  },
  translate: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  speaker: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  bgProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 0,
    backgroundColor: 'rgba(226,230,239,0.5)',
    zIndex: -1,
  },
  bgProgressRecorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 0,
    backgroundColor: '#595FFF',
    zIndex: -1,
    borderRadius: 20,
  },
});
export default ConversationLetTalk;
