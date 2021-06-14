import React from 'react';
import {View, Dimensions, TouchableOpacity, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import shuffle from 'lodash/shuffle';

import styles from './flashcardStyles';

import {Button, Text} from '~/BaseComponent';
import AnswerFlashCard from '~/BaseComponent/components/elements/result/flashcard/AnswerFlashCard';
import ScoreFlashCard from '~/BaseComponent/components/elements/result/flashcard/ScoreFlashCard';
import {colors} from '~/themes';
const {height, width} = Dimensions.get('window');
import {dispatchAnswerQuestion} from '~/utils/script';
import {playAudio, playAudioAnswer} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

export default class LearnFlashcardCharacterItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      correctAnswers: [],
      shuffleOptions: [],
      selected: [],
      isDone: false,
      showResult: false,
      isCorrect: false,
    };
  }

  componentDidMount() {
    const {item} = this.props;
    const correctAnswers = item.attachment.item.characters.filter(
      (o) => o.isAnswer,
    );

    const shuffleOptions = shuffle(item.attachment.item.characters);

    this.setState({
      correctAnswers,
      shuffleOptions,
    });
  }

  componentWillUnmount(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  renderAnswer() {
    const {correctAnswers, selected} = this.state;

    return (
      <View style={styles.wordAnswerWrap}>
        {correctAnswers.map((item, index) => {
          return (
            <View key={item.key} style={styles.wordBorderWrap}>
              <Text h4 primary bold>
                {selected[index] ? selected[index].text : ' '}
              </Text>
              <View
                style={[
                  styles.wordBorder,
                  item.text === ' ' ? styles.wordBorderSpace : null,
                ]}
              />
            </View>
          );
        })}
      </View>
    );
  }

  renderOptions() {
    const {shuffleOptions, selected} = this.state;

    return (
      <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
        <View style={styles.characterOptions}>
          {shuffleOptions.map((item) => {
            const index = selected.findIndex((o) => o.key === item.key);

            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => {
                  this.onSelectItem(item, index !== -1);
                  playAudio('selected');
                }}
                style={styles.characterOption}
                activeOpacity={0.7}>
                <Text
                  fontSize={24}
                  bold
                  color={index !== -1 ? colors.helpText3 : colors.helpText}>
                  {item.text === ' ' ? '_' : item.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  onSelectItem = (item, isSelected) => {
    if (isSelected) {
      const {selected} = this.state;
      const index = selected.findIndex((o) => o.key === item.key);

      const newSelected = [...selected];
      newSelected.splice(index, 1);
      this.setState({
        selected: newSelected,
      });
    } else {
      this.setState({
        selected: [...this.state.selected, item],
      });
    }
  };

  checkAnswer = () => {
    const {item, onNext} = this.props;

    const {correctAnswers, selected} = this.state;
    const correctStr = correctAnswers.map((item) => item.text).join('');
    const answer = selected.map((item) => item.text).join('');
    const isCorrect = correctStr === answer;

    playAudioAnswer(isCorrect);
    this.setState({showResult: true, isCorrect});

    dispatchAnswerQuestion(isCorrect, item.score, false, {word: item.mainWord});
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => onNext(isCorrect), isCorrect ? 1200 : 3000);
  };

  renderScore = () => {
    const {item} = this.props;
    const {score} = item;

    const {showResult, isCorrect} = this.state;

    if (!showResult || !isCorrect) {
      return null;
    }

    return <ScoreFlashCard score={score} />;
  };

  renderResult = () => {
    const {correctAnswers, showResult, isCorrect} = this.state;

    if (!showResult) {
      return null;
    }

    return (
      <AnswerFlashCard
        isCorrect={isCorrect}
        correctAnswers={correctAnswers.map((o) => o.text).join('')}
      />
    );
  };

  render() {
    const {item} = this.props;
    const {correctAnswers, selected, showResult} = this.state;

    return (
      <View style={styles.wrap}>
        <FastImage
          source={{
            uri: item.attachment.item.image,
          }}
          style={{width: width, height: height - 320}}
          resizeMode="cover"
        />

        {this.renderScore()}

        <View style={[styles.bottomCard, {paddingHorizontal: 0}]}>
          {this.renderResult()}

          <View style={{paddingHorizontal: 24}}>
            <Text fontSize={19} center bold>
              {translate('Điền chữ cái phù hợp')}
            </Text>

            {this.renderAnswer()}
          </View>
          {this.renderOptions()}
          <View
            style={[
              showResult
                ? {opacity: 0, paddingHorizontal: 24}
                : {paddingHorizontal: 24},
            ]}>
            <Button
              large
              primary
              rounded
              block
              uppercase
              bold
              icon
              shadow
              disabled={correctAnswers.length !== selected.length}
              onPress={this.checkAnswer}>
              {translate('Kiểm tra')}
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

LearnFlashcardCharacterItem.propTypes = {
  item: PropTypes.object.isRequired,
  onNext: PropTypes.func,
};

LearnFlashcardCharacterItem.defaultProps = {
  onNext: () => {},
};
