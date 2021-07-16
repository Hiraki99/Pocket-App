import React, {useState, useEffect, useCallback} from 'react';
import {FlatList, View} from 'react-native';
import {connect} from 'react-redux';

import {
  FlexContainer,
  Text,
  Button,
  NoFlexContainer,
  SeparatorVertical,
  TranslateText,
} from '~/BaseComponent';
import Answer from '~/BaseComponent/components/elements/result/Answer';
import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import CommonHighlightOrStrikeItem from '~/BaseComponent/components/elements/script/commonHighlightOrStrike/CommonHighlightOrStrikeItem';
import CommonAttachment from '~/BaseComponent/components/elements/script/attachment/CommonAttachment';
import {playAudioAnswer} from '~/utils/utils';
import {colors} from '~/themes';
import {generateNextActivity} from '~/utils/script';
import {increaseScore, answerQuestion} from '~/features/script/ScriptAction';
import {translate} from '~/utils/multilanguage';

const CommonHighlightOrStrikeContainer = (props) => {
  const [countAnswer, setCountAnswer] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showAnswerAward, setShowAnswerAward] = useState(false);
  const [arrayAnswer, updateArrayAnswer] = useState({});
  const {attachment} = props;

  useEffect(() => {
    setShowAnswer(false);
    updateArrayAnswer({});
    setCountAnswer(0);
  }, [props.id]);

  const increaseCountAnswer = useCallback(() => {
    setCountAnswer((value) => value + 1);
  }, []);

  const decreaseCountAnswer = useCallback(() => {
    setCountAnswer((value) => value - 1);
  }, []);

  const updateArrAnswer = useCallback((item) => {
    updateArrayAnswer((arr) => {
      return {...arr, ...item};
    });
  }, []);

  const noAttachment = !attachment || attachment?.type === 'none';

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <CommonHighlightOrStrikeItem
          content={item}
          index={index}
          id={props.id}
          paragraph={props.paragraph}
          showAnswer={showAnswer}
          increaseCountAnswer={increaseCountAnswer}
          decreaseCountAnswer={decreaseCountAnswer}
          updateArrAnswer={updateArrAnswer}
          question_type={props.question_type}
        />
      );
    },
    [
      decreaseCountAnswer,
      increaseCountAnswer,
      props.id,
      props.paragraph,
      props.question_type,
      showAnswer,
      updateArrAnswer,
    ],
  );

  const renderHeader = useCallback(() => {
    return (
      <NoFlexContainer
        backgroundColor={colors.mainBgColor}
        paddingHorizontal={noAttachment ? 0 : 24}
        paddingBottom={noAttachment ? 16 : 0}>
        {!noAttachment && (
          <NoFlexContainer>
            <CommonAttachment attachment={attachment} showText={false} />
          </NoFlexContainer>
        )}
        <TranslateText
          // justifyContent={'center'}
          textVI={props.title_vn}
          textEN={props.title}
          RenderComponent={(props) => (
            <>
              {attachment?.type === 'audio' ? (
                <Text
                  h5
                  bold
                  // center
                  primary>
                  {props.content}
                </Text>
              ) : (
                <Text
                  h5
                  bold
                  // center
                  paddingTop={noAttachment ? 0 : 16}
                  primary>
                  {props.content}
                </Text>
              )}
            </>
          )}
        />
      </NoFlexContainer>
    );
  }, [noAttachment, attachment, props.title, props.title_vn]);

  return (
    <ScriptWrapper showProgress={false}>
      {!noAttachment && renderHeader()}
      {showAnswerAward && <Answer isCorrect />}
      <FlexContainer
        paddingHorizontal={24}
        backgroundColor={colors.mainBgColor}
        paddingVertical={props.attachment ? null : 8}
        paddingBottom={48}>
        <FlexContainer paddingVertical={16}>
          <FlatList
            ListHeaderComponent={noAttachment ? renderHeader() : null}
            ListFooterComponent={() => <SeparatorVertical slg />}
            showsVerticalScrollIndicator={false}
            data={props.items}
            keyExtractor={(item, index) => `${item.key}_${index}`}
            renderItem={renderItem}
            ItemSeparatorComponent={() => (
              <View style={{height: props.paragraph ? 8 : 24}} />
            )}
          />
        </FlexContainer>
        <Button
          primary
          rounded
          large
          // marginBottom={24}
          shadow
          icon
          uppercase
          bold
          disabled={
            !(
              (countAnswer > 0 &&
                (props.paragraph ||
                  (props.items && countAnswer === props.items.length))) ||
              showAnswer
            )
          }
          onPress={() => {
            if (showAnswer) {
              generateNextActivity();
            } else {
              let countAnswerSuccess = 0;
              setShowAnswer(true);
              let answerLasted = true;
              if (Object.keys(arrayAnswer).length === 0) {
                answerLasted = false;
              } else {
                for (let key in arrayAnswer) {
                  if (arrayAnswer[key]) {
                    countAnswerSuccess += 1;
                  }
                  answerLasted = arrayAnswer[key] && answerLasted;
                }
              }
              props.increaseScore(
                countAnswerSuccess,
                countAnswerSuccess,
                props.items.length - countAnswerSuccess,
              );
              if (
                countAnswerSuccess / ((props.items || []).length || 1) >=
                0.6
              ) {
                playAudioAnswer(true);
                setShowAnswerAward(true);
                setTimeout(() => {
                  setShowAnswerAward(false);
                  generateNextActivity();
                }, 2000);
              } else {
                playAudioAnswer(false);
              }
            }
          }}>
          {showAnswer ? translate('Tiếp tục') : translate('Kiểm tra')}
        </Button>
      </FlexContainer>
    </ScriptWrapper>
  );
};

const mapStateToProps = (state) => {
  const {currentScriptItem} = state.script;
  const baseRes = {
    score: state.auth.user.score || 0,
    scoreCache: state.script.score || 0,
  };
  if (!currentScriptItem) {
    return baseRes;
  }
  return {
    id: currentScriptItem.id,
    title: currentScriptItem.title,
    title_vn: currentScriptItem.title_vn,
    items: currentScriptItem.items,
    attachment: currentScriptItem.attachment,
    question_type: currentScriptItem.question_type,
    ...baseRes,
  };
};

export default connect(mapStateToProps, {
  increaseScore,
  answerQuestion,
  generateNextActivity,
})(CommonHighlightOrStrikeContainer);
