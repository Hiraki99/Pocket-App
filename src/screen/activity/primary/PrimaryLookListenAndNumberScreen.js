import React, {useRef} from 'react';
import {ImageBackground, View, StyleSheet} from 'react-native';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import LookListenAndNumber from '~/BaseComponent/components/elements/listen/LookListenAndNumber';
import {increaseScore} from '~/features/script/ScriptAction';
import {colors} from '~/themes';
import {currentScriptListenAndNumberSelector} from '~/selector/activity';
import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import {OS} from '~/constants/os';
import {Button, FlexContainer, SeparatorVertical} from '~/BaseComponent/index';
import EmbedMultiAudioAnimate from '~/BaseComponent/components/elements/result/EmbedMultiAudioAnimate';
import {generateNextActivity} from '~/utils/script';
import {setTotalQuestion} from '~/features/activity/ActivityAction';
import {translate} from '~/utils/multilanguage';

const PrimaryLookListenAndNumberScreen = () => {
  const audioRef = useRef(null);
  const question = useSelector(
    currentScriptListenAndNumberSelector,
    shallowEqual,
  );
  const totalSuccess = useSelector(
    (state) => state.script.totalCorrect,
    shallowEqual,
  );
  const dispatch = useDispatch();
  const [loadingDone, setLoadingDone] = React.useState(false);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const isFocus = useIsFocused();
  const numberQuestion = (question?.numbers || []).length;
  const stylesBackground = React.useMemo(() => {
    if (question) {
      return {
        width: OS.WIDTH,
        height:
          (OS.WIDTH * question.backgroundHeight) / question.backgroundWidth,
      };
    }

    return null;
  }, [question]);

  const action = React.useCallback(() => {
    if (audioRef && audioRef.current) {
      audioRef.current.pause();
    }
  }, []);
  const inputStyle = React.useMemo(() => {
    if (question) {
      return {
        width: 28,
        fontSize: Math.ceil(
          ((question.default_text_size * OS.WIDTH) / question.backgroundWidth) *
            1.25 *
            1.25,
        ),
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderColor: colors.normalText,
        backgroundColor: colors.white,
        borderWidth: 1,
        fontFamily: 'CircularStd-Book',
        fontWeight: '800',
      };
    }
    return null;
  }, [question]);

  React.useEffect(() => {
    dispatch(setTotalQuestion((question?.numbers || []).length));
  }, [dispatch]);

  if (!isFocus) {
    return null;
  }

  return (
    <ScriptWrapper backgroundColor={colors.white}>
      {question?.object?.audio && (
        <EmbedMultiAudioAnimate
          data={question.object}
          ref={audioRef}
          loadingDone={loadingDone}
          isUser
        />
      )}
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'flex-end',
        }}>
        <FlexContainer>
          <ImageBackground
            source={{uri: question.backgroundUrl}}
            onLoadEnd={() => {
              setLoadingDone(true);
            }}
            onLoadStart={() => {
              setLoadingDone(false);
            }}
            style={[styles.background, stylesBackground]}>
            {(question?.numbers || []).map((item) => {
              return (
                <LookListenAndNumber
                  key={`${item.x}_${item.y}`}
                  data={item}
                  containerStyle={{
                    position: 'absolute',
                    top: stylesBackground.height * item.y,
                    left: stylesBackground.width * item.x,
                  }}
                  showResult={showAnswer}
                  inputStyle={inputStyle}
                  action={action}
                />
              );
            })}
          </ImageBackground>
        </FlexContainer>
        <View paddingHorizontal={24} paddingVertical={OS.hasNotch ? 48 : 24}>
          <SeparatorVertical sm />
          <Button
            large
            primary
            rounded
            block
            uppercase
            bold
            icon
            onPress={() => {
              if (showAnswer) {
                if (totalSuccess < numberQuestion) {
                  dispatch(increaseScore(0, 0, numberQuestion - totalSuccess));
                }
                generateNextActivity();
                return;
              }
              setShowAnswer(true);
            }}>
            {showAnswer
              ? `${translate('Tiếp tục')}`
              : `${translate('Kiểm tra')}`}
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </ScriptWrapper>
  );
};

const styles = StyleSheet.create({
  background: {
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
export default PrimaryLookListenAndNumberScreen;
