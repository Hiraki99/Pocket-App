import React from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
} from 'react-native-simple-radio-button';
import CheckBox from 'react-native-check-box';
import isEqual from 'lodash/isEqual';

import {
  BottomWrapper,
  Button,
  FlexContainer,
  RowContainer,
  Text,
  ThumbnailVideo,
} from '~/BaseComponent';
import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import CommonAttachment from '~/BaseComponent/components/elements/script/attachment/CommonAttachment';
import activityStyles from '~/BaseComponent/components/elements/script/activityStyles';
import {colors} from '~/themes';
import {
  setMaxCorrect,
  increaseScore,
  answerQuestion,
} from '~/features/script/ScriptAction';
import {playAudio, playAudioAnswer} from '~/utils/utils';
import {OS} from '~/constants/os';
import navigator from '~/navigation/customNavigator';
import {translate} from '~/utils/multilanguage';

class CommonAnswerAllQuestionScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showResult: false,
      isDone: false,
      checkArr: [],
      correctCount: 0,
    };
  }

  renderHeaderFlatList = () => {
    const {currentScriptItem} = this.props;
    const {attachment, title} = currentScriptItem;

    return (
      <>
        {attachment && attachment.type === 'video' ? (
          <>
            <ThumbnailVideo
              attachment={attachment}
              attachmentWidth={OS.WIDTH}
            />
            <Text
              h5
              style={{marginTop: 32, marginBottom: 18, paddingHorizontal: 24}}>
              {title}
            </Text>
          </>
        ) : (
          <View style={{paddingHorizontal: 24}}>
            <CommonAttachment
              textBold={false}
              textUppercase={false}
              attachment={attachment}
              text={title}
              translateText={currentScriptItem.title_vn}
            />
          </View>
        )}
      </>
    );
  };

  chosenAnswer = (questionIndex, answerIndex) => {
    const {isDone, checkArr} = this.state;

    if (isDone) {
      return;
    }

    playAudio('selected');
    const arr = [...checkArr];
    arr[questionIndex] = answerIndex;

    this.setState({
      checkArr: arr,
    });
  };

  toggleItem = (questionIndex, answerIndex) => {
    const {isDone, checkArr} = this.state;

    if (isDone) {
      return;
    }

    const arr = [...checkArr];
    if (arr[questionIndex]) {
      let selectedIndex = arr[questionIndex].findIndex(
        (o) => o === answerIndex,
      );
      if (selectedIndex !== -1) {
        arr[questionIndex].splice(selectedIndex, 1);
      } else {
        arr[questionIndex].push(answerIndex);
      }
    } else {
      arr[questionIndex] = [answerIndex];
    }

    this.setState({
      checkArr: arr,
    });
    playAudio('selected');
  };

  renderSingleChoice = (item, index) => {
    const {showResult, checkArr} = this.state;

    return (
      <RadioForm formHorizontal={false} animation={true}>
        {item.answers.map((o, i) => {
          return (
            <RadioButton
              labelHorizontal={true}
              key={o.key}
              wrapStyle={{marginBottom: 4}}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.chosenAnswer(index, i)}>
                <RowContainer style={{flex: 1}} alignItems={'flex-start'}>
                  <RadioButtonInput
                    index={i}
                    obj={o}
                    isSelected={
                      checkArr[index] === i || (showResult && o.isAnswer)
                    }
                    onPress={() => this.chosenAnswer(index, i)}
                    borderWidth={1}
                    buttonInnerColor={
                      showResult
                        ? o.isAnswer
                          ? colors.successChoice
                          : checkArr[index] === i
                          ? colors.heartActive
                          : colors.primary
                        : colors.primary
                    }
                    buttonOuterColor={
                      showResult
                        ? o.isAnswer
                          ? colors.successChoice
                          : checkArr[index] === i
                          ? colors.heartActive
                          : colors.primary
                        : colors.primary
                    }
                    buttonSize={16}
                    buttonOuterSize={24}
                    buttonWrapStyle={{marginTop: 3}}
                  />

                  <Text
                    h5
                    primary={checkArr[index] === i}
                    successChoice={showResult && o.isAnswer}
                    wrongChoice={
                      showResult && !o.isAnswer && checkArr[index] === i
                    }
                    lineThrough={
                      checkArr[index] === i && showResult && !o.isAnswer
                    }
                    style={{marginLeft: 16, marginRight: 24}}
                    key={o.key}>
                    {o.text}
                  </Text>
                </RowContainer>
              </TouchableOpacity>
            </RadioButton>
          );
        })}
      </RadioForm>
    );
  };

  renderMultiChoice = (item, index) => {
    const {showResult, checkArr} = this.state;
    return (
      <RadioForm formHorizontal={false} animation={true}>
        {item.answers.map((o, i) => {
          const checkedIndex = checkArr[index]
            ? checkArr[index].findIndex((o) => o === i)
            : -1;

          return (
            <TouchableOpacity
              activeOpacity={0.65}
              style={[
                activityStyles.inlineActionItem,
                activityStyles.inlineActionItemLast,
                {
                  flexDirection: 'row',
                },
              ]}
              key={o.key}
              onPress={() => {
                if (showResult) {
                  return;
                }

                this.toggleItem(index, i);
              }}>
              <CheckBox
                checkBoxColor={
                  showResult && o.isAnswer ? colors.success : colors.primary
                }
                style={{marginRight: 10, marginTop: 2}}
                onClick={() => {}}
                isChecked={checkedIndex !== -1 || (showResult && o.isAnswer)}
              />
              <FlexContainer marginHorizontal={24}>
                <Text
                  h5
                  lineThrough={checkedIndex !== -1 && showResult && !o.isAnswer}
                  primary={checkedIndex !== -1}
                  success={showResult && o.isAnswer}>
                  {o.text}
                </Text>
              </FlexContainer>
              <Text />
            </TouchableOpacity>
          );
        })}
      </RadioForm>
    );
  };

  renderItem = ({item, index}) => {
    const {currentScriptItem} = this.props;

    return (
      <View style={{marginBottom: 12, paddingHorizontal: 24}}>
        <Text bold h5>
          Câu {index + 1}/{currentScriptItem.items.length}
        </Text>
        <Text h5 style={{marginBottom: 10}}>
          {item.question}
        </Text>

        {(!item.type || item.type === 'single_choice') &&
          this.renderSingleChoice(item, index)}

        {item.type === 'multi_choice' && this.renderMultiChoice(item, index)}
      </View>
    );
  };

  checkAnswer = () => {
    let score = 0,
      correctCount = 0;

    const {setMaxCorrect, increaseScore, currentScriptItem} = this.props;
    const {checkArr} = this.state;

    currentScriptItem.items.forEach((item, index) => {
      let isCorrect = false;

      if (!item.type || item.type === 'single_choice') {
        const correct = item.answers.findIndex((o) => o.isAnswer);
        isCorrect = correct === checkArr[index];
      } else {
        const correct = item.answers
          .map((o, i) => {
            if (o.isAnswer) {
              return i;
            } else {
              return null;
            }
          })
          .filter((o) => o !== null);
        isCorrect = isEqual(correct, checkArr[index]);
      }

      if (isCorrect) {
        score += parseInt(item.score);
        correctCount++;
      }
    });

    setMaxCorrect(correctCount);
    increaseScore(
      score,
      correctCount,
      currentScriptItem.items.length - correctCount,
    );
    const allQuestion = currentScriptItem.items.length;
    playAudioAnswer(correctCount / allQuestion >= 0.6);

    this.setState({
      isDone: true,
      showResult: true,
      correctCount,
    });
  };

  nextActivity = () => {
    const allQuestion = this.props.currentScriptItem.items.length;

    const {correctCount} = this.state;
    navigator.navigate('GameAchievement', {
      countSuccess: correctCount,
      countAllItems: allQuestion,
      NumberQuestionOnceGame: allQuestion,
    });
  };

  renderFooterFlatList = () => {
    const {isDone, checkArr} = this.state;
    const {currentScriptItem} = this.props;
    const disabled =
      checkArr.length !== currentScriptItem.items.length ||
      checkArr.findIndex((item) => typeof item === 'undefined') !== -1;

    return (
      <BottomWrapper paddingHorizontal={24}>
        {!isDone && (
          <Button
            disabled={disabled}
            large
            primary
            rounded
            block
            uppercase
            bold
            icon
            onPress={this.checkAnswer}>
            {translate('Kiểm tra')}
          </Button>
        )}

        {isDone && (
          <Button
            large
            primary
            rounded
            block
            uppercase
            bold
            icon
            onPress={this.nextActivity}>
            {translate('Tiếp tục')}
          </Button>
        )}
      </BottomWrapper>
    );
  };

  render() {
    const {currentScriptItem} = this.props;

    if (
      !currentScriptItem ||
      currentScriptItem.type !== 'common_answer_all_questions'
    ) {
      return null;
    }

    return (
      <ScriptWrapper showProgress={false}>
        <FlatList
          ListHeaderComponent={this.renderHeaderFlatList}
          data={currentScriptItem.items}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.key}
          showsVerticalScrollIndicator
        />

        {this.renderFooterFlatList()}
      </ScriptWrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentScriptItem: state.script.currentScriptItem,
  };
};

export default connect(mapStateToProps, {
  setMaxCorrect,
  increaseScore,
  answerQuestion,
})(CommonAnswerAllQuestionScreen);
