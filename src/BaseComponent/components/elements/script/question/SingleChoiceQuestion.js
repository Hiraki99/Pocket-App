import React from 'react';
import {TouchableOpacity, ScrollView} from 'react-native';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
} from 'react-native-simple-radio-button';
import PropTypes from 'prop-types';

import {Button, RowContainer, Text, BottomWrapper} from '~/BaseComponent';
import {colors} from '~/themes';
import {dispatchAnswerQuestion} from '~/utils/script';
import {playAudio, playAudioAnswer} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

export default class SingleChoiceQuestion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: -1,
      isDone: false,
      showAward: false,
    };
  }

  chosenAnswer = (index) => {
    const {isDone} = this.state;

    if (isDone) {
      return;
    }

    this.setState({
      selected: index,
    });

    playAudio('selected');
    this.props.onChooseAnswer(
      this.props.index,
      this.props.item.answers[index].isAnswer,
    );
  };

  checkResult = () => {
    const {needCheckAll, onDone, item} = this.props;
    const {selected} = this.state;

    if (!needCheckAll) {
      dispatchAnswerQuestion(item.answers[selected].isAnswer, item.score);
      this.setState({
        isDone: true,
      });
      if (item.answers[selected].isAnswer) {
        onDone(item.answers[selected].isAnswer);
      }
      playAudioAnswer(item.answers[selected].isAnswer);
    }
  };

  next = () => {
    const {onDone, item} = this.props;
    const {selected} = this.state;

    onDone(item.answers[selected].isAnswer);
  };

  render() {
    const {
      index,
      length,
      item,
      showResult,
      needCheckAll,
      containerStyle,
      buttonContainerStyle,
      showIndex,
    } = this.props;
    const {selected, isDone} = this.state;

    return (
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={[
            {
              marginBottom: 24,
              paddingHorizontal: 24,
              paddingTop: 24,
            },
            containerStyle,
          ]}>
          {showIndex && (
            <Text bold h5 paddingVertical={8}>
              {translate('Câu %s %s_reading', {
                s1: `${index + 1}`,
                s2: `${length}`,
              })}
            </Text>
          )}

          <Text h5 style={{marginBottom: 16}}>
            {item.question}
          </Text>

          <RadioForm formHorizontal={false} animation={true}>
            {item.answers.map((o, i) => {
              return (
                <RadioButton
                  labelHorizontal={true}
                  key={o.key}
                  wrapStyle={{marginBottom: 5, flex: 1}}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => this.chosenAnswer(i)}>
                    <RowContainer alignItems={'flex-start'} style={{flex: 1}}>
                      <RadioButtonInput
                        index={i}
                        obj={o}
                        isSelected={
                          selected === i ||
                          ((isDone || showResult) && o.isAnswer)
                        }
                        onPress={() => this.chosenAnswer(i)}
                        borderWidth={1}
                        buttonInnerColor={
                          isDone || showResult
                            ? o.isAnswer
                              ? colors.successChoice
                              : this.state.selected === i
                              ? colors.heartActive
                              : colors.primary
                            : colors.primary
                        }
                        buttonOuterColor={
                          isDone || showResult
                            ? o.isAnswer
                              ? colors.successChoice
                              : this.state.selected === i
                              ? colors.heartActive
                              : colors.primary
                            : colors.primary
                        }
                        buttonSize={16}
                        buttonOuterSize={24}
                        buttonWrapStyle={{marginTop: 0}}
                      />

                      <Text
                        h5
                        primary={!(isDone || showResult) && selected === i}
                        successChoice={(isDone || showResult) && o.isAnswer}
                        wrongChoice={
                          (isDone || showResult) &&
                          !o.isAnswer &&
                          selected === i
                        }
                        lineThrough={
                          selected === i &&
                          (isDone || showResult) &&
                          !o.isAnswer
                        }
                        // accented
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
          {!needCheckAll && !isDone && (
            <BottomWrapper
              paddingHorizontal={24}
              style={[buttonContainerStyle]}>
              <Button
                disabled={selected === -1}
                large
                primary
                rounded
                block
                uppercase
                bold
                icon
                onPress={this.checkResult}>
                {translate('Kiểm tra')}
              </Button>
            </BottomWrapper>
          )}

          {!needCheckAll && isDone && (
            <BottomWrapper
              paddingHorizontal={24}
              style={[buttonContainerStyle]}>
              <Button
                large
                primary
                rounded
                block
                uppercase
                bold
                icon
                onPress={this.next}>
                {translate('Tiếp tục')}
              </Button>
            </BottomWrapper>
          )}
        </ScrollView>

        {/*{!needCheckAll && !isDone && (*/}
        {/*  <BottomWrapper paddingHorizontal={24} style={[buttonContainerStyle]}>*/}
        {/*    <Button*/}
        {/*      disabled={selected === -1}*/}
        {/*      large*/}
        {/*      primary*/}
        {/*      rounded*/}
        {/*      block*/}
        {/*      uppercase*/}
        {/*      bold*/}
        {/*      icon*/}
        {/*      onPress={this.checkResult}>*/}
        {/*      Kiểm tra*/}
        {/*    </Button>*/}
        {/*  </BottomWrapper>*/}
        {/*)}*/}

        {/*{!needCheckAll && isDone && (*/}
        {/*  <BottomWrapper paddingHorizontal={24} style={[buttonContainerStyle]}>*/}
        {/*    <Button*/}
        {/*      large*/}
        {/*      primary*/}
        {/*      rounded*/}
        {/*      block*/}
        {/*      uppercase*/}
        {/*      bold*/}
        {/*      icon*/}
        {/*      onPress={this.next}>*/}
        {/*      Tiếp tục*/}
        {/*    </Button>*/}
        {/*  </BottomWrapper>*/}
        {/*)}*/}
      </>
    );
  }
}

SingleChoiceQuestion.propTypes = {
  index: PropTypes.number,
  length: PropTypes.number,
  item: PropTypes.object.isRequired,
  showResult: PropTypes.bool,
  onChooseAnswer: PropTypes.func,
  onDone: PropTypes.func,
  needCheckAll: PropTypes.bool,
  containerStyle: PropTypes.object,
  buttonContainerStyle: PropTypes.object,
  showIndex: PropTypes.bool,
};

SingleChoiceQuestion.defaultProps = {
  index: 0,
  length: 1,
  showResult: false,
  onChooseAnswer: () => {},
  needCheckAll: false,
  onDone: () => {},
  containerStyle: {},
  buttonContainerStyle: {},
  showIndex: true,
};
