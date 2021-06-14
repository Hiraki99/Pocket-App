import React from 'react';
import {connect} from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import {Alert, Dimensions, View} from 'react-native';
import RNFS from 'react-native-fs';

import FlashcardItem from '~/BaseComponent/components/elements/script/FlashcardItem';
import LearnFlashcardCharacterItem from '~/BaseComponent/components/elements/script/LearnFlashcardCharacterItem';
import LearnFlashcardListenAndAnswerItem from '~/BaseComponent/components/elements/script/LearnFlashcardListenAndAnswerItem';
import LearnFlashcardVideoAndAnswerItem from '~/BaseComponent/components/elements/script/LearnFlashcardVideoAndAnswerItem';
import LearnFlashcardQuizAndAnswerItem from '~/BaseComponent/components/elements/script/LearnFlashcardQuizAndAnswerItem';
import LearnFlashcardCharacterVideoItem from '~/BaseComponent/components/elements/script/LearnFlashcardCharacterVideoItem';
import LearnFlashcardPictureAndAnswerItem from '~/BaseComponent/components/elements/script/LearnFlashcardPictureAndAnswerItem';
import LearnFlashcardSelectPictureItem from '~/BaseComponent/components/elements/script/LearnFlashcardSelectPictureItem';
import LearnFlashcardSelectPictureListeningItem from '~/BaseComponent/components/elements/script/LearnFlashcardSelectPictureListeningItem';
import LearnFlashcardSpeakWordItem from '~/BaseComponent/components/elements/script/LearnFlashcardSpeakWordItem';
import LearnFlashcardSpeakSentenceItem from '~/BaseComponent/components/elements/script/LearnFlashcardSpeakSentenceItem';
import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import {FlexContainer, Loading} from '~/BaseComponent';
import navigator from '~/navigation/customNavigator';
import {generateAllWordData} from '~/utils/flashcard';
import {generateNextActivity} from '~/utils/script';
import {incrementQuestion} from '~/features/activity/ActivityAction';
import {
  changeCurrentScriptItem,
  increaseScore,
} from '~/features/script/ScriptAction';
import {translate} from '~/utils/multilanguage';

const {width: viewportWidth} = Dimensions.get('window');

class FlashcardCollectionScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cards: [],
      activeSlide: 0,
    };

    this.renderItem = this.renderItem.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if (
      (this.props.words.length !== nextProps.words.length &&
        nextProps.words.length > 0) ||
      this.props.errorGame !== nextProps.errorGame
    ) {
      this.initData(nextProps.words, nextProps.errorGame);
    }
    return true;
  }

  initData = async (words, errorGame) => {
    if (!errorGame) {
      const flashcards = generateAllWordData(words);

      this.props.incrementQuestion(flashcards.length);
      setTimeout(() => {
        this.setState({
          cards: flashcards,
        });
      }, 500);
    } else {
      Alert.alert(
        `${translate('Thông báo')}`,
        `${translate('Có lỗi xảy ra, Vui lòng thử lại sau!')}`,
        [
          {
            text: `${translate('Đồng ý')}`,
          },
        ],
      );
      navigator.navigate('Activity');
    }
  };

  async componentDidMount() {
    if (this.props.words.length > 0) {
      this.initData(this.props.words, this.props.errorGame);
    }

    const checkExistedFolder = await RNFS.exists(
      RNFS.DocumentDirectoryPath + '/rolePlayRecorder',
    );
    if (!checkExistedFolder) {
      RNFS.mkdir(RNFS.DocumentDirectoryPath + '/rolePlayRecorder');
    }
  }

  componentWillUnmount() {
    RNFS.unlink(
      `${RNFS.DocumentDirectoryPath}/rolePlayRecorder`,
    ).then(() => {});
  }

  renderItem = ({item, index}) => {
    const {activeSlide} = this.state;
    if (this._carousel.currentIndex === index) {
      console.log('activeItem ', item);
    }
    switch (item.type) {
      case 'flashcard':
        return (
          <FlashcardItem
            key={item.id}
            item={item}
            activeScreen={this._carousel.currentIndex === index}
            onNext={() => this.nextCard()}
          />
        );
      case 'learn_word_by_flashcard':
        switch (item.attachment.type) {
          case 'word_character_image':
            return (
              <LearnFlashcardCharacterItem
                item={item}
                key={item.id}
                onNext={(isAnswer) => this.nextCard(isAnswer)}
              />
            );
          case 'word_character_video':
            return (
              <LearnFlashcardCharacterVideoItem
                item={item}
                key={item.id}
                activeVideo={activeSlide === index}
                onNext={(isAnswer) => this.nextCard(isAnswer)}
              />
            );
          case 'picture_and_answer':
            return (
              <LearnFlashcardPictureAndAnswerItem
                item={item}
                key={item.id}
                onNext={(isAnswer) => this.nextCard(isAnswer)}
              />
            );
          case 'listen_and_answer':
            return (
              <LearnFlashcardListenAndAnswerItem
                item={item}
                key={item.id}
                onNext={(isAnswer) => this.nextCard(isAnswer)}
              />
            );
          case 'video_and_answer':
            return (
              <LearnFlashcardVideoAndAnswerItem
                item={item}
                key={item.id}
                activeVideo={activeSlide === index}
                onNext={(isAnswer) => this.nextCard(isAnswer)}
              />
            );
          case 'quiz_and_answer':
            return (
              <LearnFlashcardQuizAndAnswerItem
                item={item}
                key={item.id}
                onNext={(isAnswer) => this.nextCard(isAnswer)}
              />
            );
          case 'select_picture':
            return (
              <LearnFlashcardSelectPictureItem
                item={item}
                key={item.id}
                onNext={(isAnswer) => this.nextCard(isAnswer)}
              />
            );
          case 'select_picture_listening':
            return (
              <LearnFlashcardSelectPictureListeningItem
                item={item}
                key={item.id}
                onNext={(isAnswer) => this.nextCard(isAnswer)}
              />
            );
          case 'speak_word':
            return (
              <LearnFlashcardSpeakWordItem
                item={item}
                key={item.id}
                googleApiKey={this.props.googleApiKey}
                activeScreen={this._carousel.currentIndex === index}
                onNext={(isAnswer) => this.nextCard(isAnswer)}
              />
            );
          case 'speak_sentence':
            return (
              <LearnFlashcardSpeakSentenceItem
                item={item}
                key={item.id}
                googleApiKey={this.props.googleApiKey}
                activeScreen={this._carousel.currentIndex === index}
                onNext={(isAnswer) => this.nextCard(isAnswer)}
              />
            );
          default:
            return null;
        }
      default:
        return null;
    }
  };

  nextCard = async (isAnswer) => {
    if (this._carousel) {
      const {cards} = this.state;
      const {incrementQuestion} = this.props;

      const currentCard = {...cards[this._carousel.currentIndex]};
      const cloneCards = [...cards];

      if (isAnswer === false && !currentCard.isRetry) {
        currentCard.isRetry = true;
        currentCard.id = currentCard.id + '_retry';

        const nextOne = cards.findIndex((item, index) => {
          return (
            item.mainWord !== currentCard.mainWord &&
            index > this._carousel.currentIndex
          );
        });

        if (nextOne !== -1) {
          const nextTwo = cards.findIndex((item, index) => {
            return item.mainWord !== cards[nextOne].mainWord && index > nextOne;
          });

          if (nextTwo !== -1) {
            cloneCards.splice(nextTwo, 0, currentCard);
            incrementQuestion(1);
          } else {
            cloneCards.splice(nextOne, 0, currentCard);
            incrementQuestion(1);
          }
        } else {
          cloneCards.push(currentCard);
          incrementQuestion(1);
        }

        await this.setState({
          cards: cloneCards,
        });
      }

      if (this._carousel.currentIndex === cards.length - 1) {
        generateNextActivity(500);
      } else {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          this._carousel.snapToNext();
        }, 250);
      }
    }
  };

  render() {
    const {cards} = this.state;

    return (
      <ScriptWrapper>
        {cards.length > 0 ? (
          <View>
            <Carousel
              ref={(c) => {
                this._carousel = c;
              }}
              onSnapToItem={(index) => {
                this.setState({activeSlide: index});
              }}
              useScrollView={true}
              data={cards}
              renderItem={this.renderItem}
              sliderWidth={viewportWidth}
              itemWidth={viewportWidth}
              firstItem={0}
              inactiveSlideScale={0.9}
              inactiveSlideOpacity={0.7}
              initialNumToRender={1}
              scrollEnabled={false}
            />
          </View>
        ) : (
          <FlexContainer justifyContent={'center'} alignItems={'center'}>
            <Loading />
          </FlexContainer>
        )}
      </ScriptWrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    words: state.vocabulary.wordGroup,
    errorGame: false,
    currentActivity: state.activity.currentActivity,
    currentScriptItem: state.script.currentScriptItem,
    googleApiKey: state.stt.stt.api_key,
  };
};

export default connect(mapStateToProps, {
  increaseScore,
  changeCurrentScriptItem,
  incrementQuestion,
})(FlashcardCollectionScreen);
