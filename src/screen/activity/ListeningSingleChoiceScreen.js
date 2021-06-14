import React from 'react';
import {connect} from 'react-redux';
import {View, TouchableOpacity, ScrollView} from 'react-native';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
} from 'react-native-simple-radio-button';
import CheckBox from 'react-native-check-box';
import isEqual from 'lodash/isEqual';

import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import RoundAudioPlayer from '~/BaseComponent/components/elements/script/RoundAudioPlayer';
import {Button, Text} from '~/BaseComponent';
import styles from '~/BaseComponent/components/elements/script/flashcardStyles';
import BottomResult from '~/BaseComponent/components/elements/script/FlashCard/BottomResult';
import activityStyles from '~/BaseComponent/components/elements/script/activityStyles';
import VideoPlayer from '~/BaseComponent/components/elements/script/VideoPlayer';
import {dispatchAnswerQuestion, generateNextActivity} from '~/utils/script';
import {colors} from '~/themes';
import {MAPPING_IPA} from '~/constants/ipa';
import {OS} from '~/constants/os';
import {playAudioAnswer} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

class ListeningSingleChoiceScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showResult: false,
      isCorrect: false,
      selectedIndex: -1,
      checkedArr: [],
      isDone: false,
      videoHeight: 0,
    };
  }

  checkActivityType = () => {
    const {currentScriptItem} = this.props;

    return (
      currentScriptItem &&
      (currentScriptItem.type === 'listen_single_choice' ||
        currentScriptItem.type === 'listen_multi_choice')
    );
  };

  renderAttachment = () => {
    const {currentScriptItem} = this.props;
    if (
      currentScriptItem.attachment.type !== 'audio' &&
      currentScriptItem.attachment.type !== 'video'
    ) {
      return null;
    }

    return (
      <>
        {currentScriptItem.attachment.type === 'audio' && (
          <>
            <View />
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              {currentScriptItem.attachment.type === 'audio' && (
                <RoundAudioPlayer
                  audio={currentScriptItem.attachment.path}
                  autoPlay
                  themeMode={'normal'}
                />
              )}
            </View>
          </>
        )}

        {currentScriptItem.attachment.type === 'video' && (
          <View style={{height: 250}}>
            <VideoPlayer
              videoId={currentScriptItem.attachment.item.id}
              start={currentScriptItem.attachment.item.start}
              end={currentScriptItem.attachment.item.end}
              height={this.state.videoHeight}
            />
          </View>
        )}
      </>
    );
  };

  renderShortOptions = () => {
    const {currentScriptItem} = this.props;

    return currentScriptItem.answers.map((o) => {
      return (
        <View key={o.key} style={{marginBottom: 8}}>
          {MAPPING_IPA.includes(o.text) ? (
            <Button
              shadow={false}
              rounded
              outline
              primary
              bold
              style={{paddingVertical: 3.15}}
              onPress={() => this.checkAnswer(o)}>
              <Text h4 primary medium>
                {o.text}
              </Text>
            </Button>
          ) : (
            <Button
              shadow={false}
              rounded
              outline
              uppercase
              primary
              bold
              style={{paddingVertical: 3.15}}
              onPress={() => this.checkAnswer(o)}>
              {o.text}
            </Button>
          )}
        </View>
      );
    });
  };

  renderLongOptions = () => {
    const {currentScriptItem} = this.props;
    const {showResult, isDone} = this.state;

    return (
      <RadioForm formHorizontal={false} animation={true}>
        {currentScriptItem.answers.map((o, i) => {
          return (
            <RadioButton
              labelHorizontal={true}
              key={o.key}
              wrapStyle={{marginBottom: 5}}>
              <RadioButtonInput
                index={i}
                isSelected={
                  this.state.selectedIndex === i || (showResult && o.isAnswer)
                }
                obj={o}
                onPress={() => {
                  this.setState({selectedIndex: i});
                }}
                borderWidth={1}
                buttonInnerColor={
                  showResult && o.isAnswer ? colors.success : colors.primary
                }
                buttonOuterColor={
                  showResult && o.isAnswer ? colors.success : colors.primary
                }
                buttonSize={16}
                buttonOuterSize={24}
                buttonStyle={{}}
                buttonWrapStyle={{marginLeft: 10}}
              />

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (isDone) {
                    return;
                  }

                  this.setState({selectedIndex: i});
                }}>
                <Text
                  h5
                  primary={this.state.selectedIndex === i}
                  success={showResult && o.isAnswer}
                  lineThrough={
                    this.state.selectedIndex === i && showResult && !o.isAnswer
                  }
                  style={{marginLeft: 16, marginRight: 24}}
                  key={o.key}>
                  {o.text}
                </Text>
              </TouchableOpacity>
            </RadioButton>
          );
        })}
      </RadioForm>
    );
  };

  renderCheckButton = () => {
    const {currentScriptItem} = this.props;
    let disabled = true;

    if (currentScriptItem.type === 'listen_single_choice') {
      disabled = this.state.selectedIndex === -1;
    } else {
      disabled = this.state.checkedArr.length === 0;
    }

    return (
      <View
        style={{
          marginTop: 10,
        }}>
        <Button
          disabled={disabled}
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
      </View>
    );
  };

  renderNextButton = () => {
    const {currentScriptItem} = this.props;
    let disabled = true;

    if (currentScriptItem.type === 'listen_single_choice') {
      disabled = this.state.selectedIndex === -1;
    } else {
      disabled = this.state.checkedArr.length === 0;
    }

    return (
      <View
        style={{
          marginTop: 10,
        }}>
        <Button
          disabled={disabled}
          large
          primary
          rounded
          block
          uppercase
          bold
          icon
          onPress={() => this.nextActivity()}>
          {translate('Tiếp theo')}
        </Button>
      </View>
    );
  };

  checkResult = () => {
    const {currentScriptItem} = this.props;

    if (
      currentScriptItem.type === 'listen_single_choice' &&
      currentScriptItem.answer_type === 'short'
    ) {
      this.checkAnswer(currentScriptItem.answers[this.state.selectedIndex]);
    } else {
      this.setState({
        isDone: true,
        showResult: true,
      });

      let isCorrect = false;

      if (currentScriptItem.type === 'listen_single_choice') {
        isCorrect =
          currentScriptItem.answers[this.state.selectedIndex].isAnswer;
      } else {
        const correctAnswer = [];

        currentScriptItem.answers.forEach((item, index) => {
          if (item.isAnswer) {
            correctAnswer.push(index);
          }
        });
        isCorrect = isEqual(correctAnswer.sort(), this.state.checkedArr.sort());
      }

      dispatchAnswerQuestion(isCorrect, currentScriptItem.score);
      playAudioAnswer(isCorrect);
    }
  };

  toggleItem = (item, index) => {
    if (!this.state.isDone) {
      let selectedIndex = this.state.checkedArr.findIndex((o) => o === index);
      if (selectedIndex !== -1) {
        let arr = [...this.state.checkedArr];
        arr.splice(selectedIndex, 1);

        this.setState({
          checkedArr: arr,
        });
      } else {
        this.setState({
          checkedArr: [...this.state.checkedArr, index],
        });
      }
    }
  };

  renderMultiOptions = () => {
    const {currentScriptItem} = this.props;
    const {showResult} = this.state;

    return (
      <RadioForm formHorizontal={false} animation={true}>
        {currentScriptItem.answers.map((o, i) => {
          const checkedIndex = this.state.checkedArr.findIndex((o) => o === i);

          return (
            <TouchableOpacity
              activeOpacity={0.65}
              style={[
                activityStyles.inlineActionItem,
                activityStyles.inlineActionItemLast,
                {
                  flexDirection: 'row',
                  width: '100%',
                },
              ]}
              key={o.key}
              onPress={() => {
                if (showResult) {
                  return;
                }

                this.toggleItem(o, i);
              }}>
              <CheckBox
                checkBoxColor={
                  showResult && o.isAnswer ? colors.success : colors.primary
                }
                style={{marginRight: 10}}
                onClick={() => {}}
                isChecked={checkedIndex !== -1 || (showResult && o.isAnswer)}
              />
              <Text
                h5
                center
                lineThrough={checkedIndex !== -1 && showResult && !o.isAnswer}
                primary={checkedIndex !== -1}
                success={showResult && o.isAnswer}>
                {o.text}
              </Text>
              <Text />
            </TouchableOpacity>
          );
        })}
      </RadioForm>
    );
  };

  renderOptions = () => {
    const {currentScriptItem} = this.props;
    const {showResult} = this.state;
    return (
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={[
            showResult &&
            currentScriptItem.type === 'listen_single_choice' &&
            currentScriptItem.answer_type === 'short'
              ? {opacity: 0}
              : null,
          ]}>
          <Text h5 bold center accented>
            {translate('Listen and Choice')}
          </Text>
          <Text
            h3={currentScriptItem.answer_type !== 'short'}
            h4={currentScriptItem.answer_type === 'short'}
            style={{paddingTop: 16, paddingBottom: 30}}
            center
            bold
            primary>
            {currentScriptItem.question}
          </Text>

          {currentScriptItem.type === 'listen_single_choice' &&
            currentScriptItem.answer_type === 'short' &&
            this.renderShortOptions()}

          {currentScriptItem.type === 'listen_single_choice' &&
            currentScriptItem.answer_type === 'long' &&
            this.renderLongOptions()}

          {currentScriptItem.type === 'listen_multi_choice' &&
            this.renderMultiOptions()}
        </ScrollView>

        {!showResult &&
          (currentScriptItem.answer_type === 'long' ||
            currentScriptItem.type === 'listen_multi_choice') &&
          this.renderCheckButton()}

        {showResult &&
          (currentScriptItem.answer_type === 'long' ||
            currentScriptItem.type === 'listen_multi_choice') &&
          this.renderNextButton()}
      </>
    );
  };

  renderResult = () => {
    const {currentScriptItem} = this.props;
    const {score} = currentScriptItem;
    const {showResult, isCorrect} = this.state;
    const correct = currentScriptItem.answers.find((o) => o.isAnswer);
    const correctAnswer = correct ? correct.text : null;

    if (
      !showResult ||
      (currentScriptItem.type === 'listen_single_choice' &&
        currentScriptItem.answer_type !== 'short') ||
      currentScriptItem.type === 'listen_multi_choice'
    ) {
      return null;
    } else {
      dispatchAnswerQuestion(isCorrect, score);

      this.nextActivity(2000);

      return (
        <BottomResult correctAnswer={correctAnswer} isCorrect={isCorrect} />
      );
    }
  };

  nextActivity = (delay = 0) => {
    setTimeout(() => {
      this.setState(
        {
          showResult: false,
          isCorrect: false,
          selectedIndex: -1,
          checkedArr: [],
          isDone: false,
        },
        () => generateNextActivity(),
      );
    }, delay);
  };

  checkAnswer = (item) => {
    this.setState({
      showResult: true,
      isCorrect: item.isAnswer,
    });
    playAudioAnswer(item.isAnswer);
  };

  calculateHeight = (event) => {
    const {height} = event.nativeEvent.layout;
    this.setState({
      videoHeight: Math.min(
        OS.HEIGHT - height - OS.statusBarHeight - (OS.IsAndroid ? 110 : 20),
        250,
      ),
    });
  };

  render() {
    if (!this.checkActivityType()) {
      return null;
    }

    return (
      <ScriptWrapper mainBgColor={colors.mainBgColor}>
        <View style={{justifyContent: 'space-between', flex: 1}}>
          {this.renderAttachment()}
          <View
            style={[styles.bottomCard, styles.bottomNormal, {paddingTop: 16}]}
            onLayout={this.calculateHeight}>
            {this.renderOptions()}
            {this.renderResult()}
          </View>
        </View>
      </ScriptWrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentScriptItem: state.script.currentScriptItem,
    schoolClassId: state.auth.user?.class,
  };
};

export default connect(mapStateToProps, {})(ListeningSingleChoiceScreen);
