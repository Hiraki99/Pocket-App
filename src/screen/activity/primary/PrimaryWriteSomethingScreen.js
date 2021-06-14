import React from 'react';
import {connect} from 'react-redux';
import split from 'lodash/split';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TouchableOpacity, View, StyleSheet, findNodeHandle} from 'react-native';

import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import {Button, Text} from '~/BaseComponent';
import GivenWordModal from '~/BaseComponent/components/elements/script/GivenWordModal';
import {setMaxCorrect, increaseScore} from '~/features/script/ScriptAction';
import {setTotalQuestion} from '~/features/activity/ActivityAction';
import {generateNextActivity} from '~/utils/script';
import {makeid, matchAllRegex, playAudio, playAudioAnswer} from '~/utils/utils';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';

class PrimaryWriteSomethingScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isDone: false,
      answers: [],
      correctAnswers: [],
      showCorrectAnswer: false,
      currentIndex: -1,
    };
  }
  componentDidMount(): void {
    if (this.checkScriptType()) {
      const {currentScriptItem} = this.props;
      const question = currentScriptItem.text;

      const findRegex = /\[.*?\]/g;
      const corrects = question.match(findRegex);
      const correctAnswers = [];

      if (corrects) {
        corrects.forEach((item) => {
          const matchesScore = item.match(/\{(\d)\}/);
          const splits = item.replace('[', '').replace(']', '').split('/');
          const listWords = [];
          splits.map((it) => {
            listWords.push({isAnswer: true, key: makeid(8), text: it});
          });
          correctAnswers.push({
            text: splits.join(' '),
            score: matchesScore ? matchesScore[1] : 1,
            listWords: listWords,
          });
        });
      }
      this.setState({
        correctAnswers,
        answers: correctAnswers.map(() => null),
      });
      setTotalQuestion(correctAnswers.length);
    }
  }

  checkScriptType = () => {
    const {currentScriptItem} = this.props;

    if (currentScriptItem && currentScriptItem.type === 'write_something') {
      return true;
    }

    return false;
  };

  onSelected = (index) => {
    if (this.writingRef) {
      this.setState({
        currentIndex: index,
      });
      setTimeout(() => {
        if (this.writingRef) {
          this.writingRef.showModal();
        }
      }, 250);
    }
    playAudio('selected');
  };

  onAnswer = (isCorrect, text) => {
    if (this.writingRef) {
      this.writingRef.closeModal();
    }
    const arr = [...this.state.answers];
    arr[this.state.currentIndex] = text;

    this.setState({
      answers: arr,
    });
  };

  checkAnswer = () => {
    this.setState({
      isDone: true,
    });
    const data = this.getCount();
    playAudioAnswer(data.numPercent >= 0.6);
  };

  getCount = () => {
    const {answers, correctAnswers} = this.state;

    let score = 0,
      maxCorrect = 0;

    correctAnswers.forEach((item, index) => {
      if (item.text === answers[index]) {
        score += parseInt(item.score);
        maxCorrect++;
      }
    });
    const numPercent = answers.length > 0 ? score / answers.length : 0;
    return {
      maxCorrect,
      score,
      numPercent,
    };
  };

  next = () => {
    const {correctAnswers} = this.state;
    const data = this.getCount();
    this.props.increaseScore(
      data.score,
      data.maxCorrect,
      correctAnswers.length - data.maxCorrect,
    );
    generateNextActivity();
  };

  renderMetaWord = (item) => {
    return (
      <>
        {split(item, ' ').map((o) => {
          if (o.indexOf('\n') !== -1) {
            const breakLineArr = split(o, '\n');
            return breakLineArr.map((breakLine, breakIndex) => {
              return (
                <>
                  <Text key={`${breakLine}_${breakLine}`} h5>
                    {breakLine}{' '}
                  </Text>

                  {breakIndex < breakLineArr.length - 1 && (
                    <View key={makeid(8)} style={{width: '100%', height: 10}} />
                  )}
                </>
              );
            });
          } else {
            return (
              <Text key={makeid(8)} h5>
                {o}{' '}
              </Text>
            );
          }
        })}
      </>
    );
  };

  renderItem = (item) => {
    const mainKeyRegex = /\<.*?\>/g;
    const regexReplace = /<|>/g;
    // const y = [...item.matchAll(mainKeyRegex)];
    const y = matchAllRegex(mainKeyRegex, item);
    return (
      <>
        {mainKeyRegex.test(item) &&
          y.map((it, index) => {
            let content;
            if (index === y.length - 1) {
              content = it.input.slice(it[0].length + it.index).trim();
            } else {
              content = it.input.slice(
                it.index + it[0].length,
                y[index + 1].index,
              );
            }
            return (
              <>
                <Text key={makeid(8)} h5 primary bold>
                  {it[0].replace(regexReplace, '')}
                </Text>
                {index === y.length - 1 && (
                  <View key={makeid(8)} style={{width: '100%', height: 20}} />
                )}
                {this.renderMetaWord(content)}
              </>
            );
          })}
        {!mainKeyRegex.test(item) && this.renderMetaWord(item)}
      </>
    );
  };

  _scrollToInput(reactNode: any) {
    if (this.scroll) {
      this.scroll.scrollToFocusedInput(reactNode, 300);
    }
  }

  renderFillInBlank = () => {
    const {answers, isDone, correctAnswers} = this.state;
    const {currentScriptItem} = this.props;
    const question = currentScriptItem.text;

    const splitRegex = /\[.*?\]/g;

    const parts = split(question, splitRegex);
    return (
      <>
        <View style={{flexDirection: 'row', marginBottom: 22, marginTop: 22}}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {parts.map((item, k) => {
              const correct = correctAnswers[k] ? correctAnswers[k].text : '';

              return (
                <>
                  {this.renderItem(item)}
                  {k <= parts.length - 1 &&
                    answers &&
                    typeof answers[k] !== 'undefined' &&
                    answers[k] !== null &&
                    !isDone && (
                      <TouchableOpacity
                        activeOpacity={0.75}
                        key={`${answers[k]}_${k}`}
                        onPress={() => this.onSelected(k)}>
                        <Text h5 bold primary>
                          {answers[k]}
                        </Text>
                      </TouchableOpacity>
                    )}

                  {k <= parts.length - 1 &&
                    (!answers || answers[k] === null) &&
                    !isDone && (
                      <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={(event: Event) => {
                          this.onSelected(k);
                          this._scrollToInput(findNodeHandle(event.target));
                        }}
                        key={`${answers[k]}_${k}_${k}`}
                        style={styles.question}
                      />
                    )}

                  {k <= parts.length - 1 && isDone && (
                    // <View >
                    <>
                      {answers &&
                        typeof answers[k] !== 'undefined' &&
                        answers[k] !== null &&
                        answers[k] !== correct && (
                          <Text h5 bold wrongChoice lineThrough>
                            {answers[k]}{' '}
                          </Text>
                        )}
                      <Text h5 bold successChoice>
                        {correct}
                      </Text>
                    </>
                    // </View>
                  )}
                </>
              );
            })}
          </View>
        </View>
      </>
    );
  };

  renderCheckBtn = () => {
    const {answers, isDone} = this.state;
    let disabled = true;

    if (
      answers.length > 0 &&
      answers.findIndex((item) => item === null) === -1
    ) {
      disabled = false;
    }

    return (
      <View style={styles.containerFooter}>
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
            shadow
            onPress={this.checkAnswer}>
            {`${translate('Kiểm tra')}`}
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
            shadow
            onPress={this.next}>
            {`${translate('Tiếp tục')}`}
          </Button>
        )}
      </View>
    );
  };
  render() {
    // const {currentScriptItem} = this.props;
    if (!this.checkScriptType()) {
      return null;
    }
    const listWords =
      this.state.currentIndex >= 0
        ? this.state.correctAnswers[this.state.currentIndex].listWords
        : [];
    return (
      <ScriptWrapper showProgress={false}>
        <KeyboardAwareScrollView
          ref={(refs) => {
            this.scroll = refs;
          }}
          style={{marginTop: 2, flex: 1}}>
          <View paddingHorizontal={24}>
            {/*<CommonAttachment*/}
            {/*  attachment={currentScriptItem.attachment}*/}
            {/*  key={currentScriptItem.key}*/}
            {/*  text={LANGUAGE_MAPPING.vi.fill_in_blank}*/}
            {/*  translateText={LANGUAGE_MAPPING.en.fill_in_blank}*/}
            {/*/>*/}

            {this.renderFillInBlank()}
          </View>
        </KeyboardAwareScrollView>

        {this.renderCheckBtn()}

        {/*<WritingInput*/}
        {/*  ref={(ref) => (this.writingRef = ref)}*/}
        {/*  onSubmit={this.onAnswer}*/}
        {/*/>*/}
        <GivenWordModal
          ref={(ref) => (this.writingRef = ref)}
          options={listWords}
          score={1}
          onDone={this.onAnswer}
          usingStore={false}
          key={this.state.currentIndex}
        />
      </ScriptWrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentScriptItem: state.script.currentScriptItem,
  };
};

const styles = StyleSheet.create({
  containerFooter: {
    marginBottom: 48,
    marginTop: 24,
    paddingHorizontal: 24,
    zIndex: -1,
  },
  question: {
    backgroundColor: 'rgba(89, 95, 255, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: colors.helpText,
    width: 80,
    height: 22,
    marginRight: 4,
  },
});

export default connect(mapStateToProps, {
  setTotalQuestion,
  setMaxCorrect,
  increaseScore,
})(PrimaryWriteSomethingScreen);
