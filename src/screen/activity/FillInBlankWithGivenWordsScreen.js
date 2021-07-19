import React from 'react';
import {connect} from 'react-redux';
import {
  FlatList,
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';

import {Button, CommonAlert, RowContainer, Text} from '~/BaseComponent';
import FillInBlankItem from '~/BaseComponent/components/elements/script/fillInBlank/FillInBlankItem';
import FillInBlankModal from '~/BaseComponent/components/elements/script/fillInBlank/FillInBlankModal';
import VideoPlayer from '~/BaseComponent/components/elements/script/VideoPlayer';
import EmbedAudio from '~/BaseComponent/components/elements/script/EmbedAudio';
import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import {generateNextActivity} from '~/utils/script';
import {setMaxCorrect, increaseScore} from '~/features/script/ScriptAction';
import {colors, images} from '~/themes';
import {OS} from '~/constants/os';
import {LANGUAGE, LANGUAGE_MAPPING} from '~/constants/lang';
import {translate} from '~/utils/multilanguage';

class FillInBlankWithGivenWordsScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      questions: [],
      currentQuestion: null,
      questionIndex: -1,
      blankIndex: -1,
      answers: [],
      userAnswers: [],
      isDone: false,
      attachment: null,
      isShowAlert: false,
      lang: LANGUAGE.VI,
    };
  }

  componentDidMount() {
    const {currentScriptItem} = this.props;

    this.setState({
      questions: currentScriptItem.items,
      answers: currentScriptItem.items.map(() => {
        return {};
      }),
      userAnswers: currentScriptItem.items.map(() => {
        return null;
      }),
      attachment: currentScriptItem.attachment,
    });
  }

  onSelected = (item, questionIndex, blankIndex) => {
    if (this.modalRef) {
      this.setState({
        currentQuestion: item,
        questionIndex: questionIndex,
        blankIndex: blankIndex,
      });

      this.modalRef.showModal();
    }
  };

  onAnswer = (answer) => {
    const {answers, questionIndex, blankIndex, userAnswers} = this.state;
    const cloneAnswers = [...answers];
    const cloneUserAnswers = [...userAnswers];

    cloneAnswers[questionIndex]['blank_' + blankIndex] = answer;
    cloneUserAnswers[questionIndex] = answer;

    this.setState({
      answers: cloneAnswers,
      userAnswers: cloneUserAnswers,
    });
  };

  changeText = () => {
    this.setState((old) => {
      return {
        lang: old.lang === LANGUAGE.VI ? LANGUAGE.EN : LANGUAGE.VI,
      };
    });
  };

  renderHeaderFlatList = () => {
    const {attachment} = this.state;

    return (
      <View>
        {attachment && attachment.type === 'image' && (
          <AutoHeightImage
            source={{uri: attachment.path}}
            width={OS.WIDTH}
            style={{marginHorizontal: -24}}
          />
        )}

        {attachment && attachment.type === 'video' && (
          <View style={{marginHorizontal: -24, width: OS.WIDTH}}>
            <VideoPlayer
              videoId={attachment.path.id}
              start={attachment.path.start}
              end={attachment.path.end}
              height={275}
            />
          </View>
        )}

        {attachment && attachment.type === 'audio_background' && (
          <View
            style={{
              marginHorizontal: -24,
              width: OS.WIDTH,
              marginTop: OS.IsAndroid ? -8 : 0,
            }}>
            <EmbedAudio
              ref={(ref) => (this.audioRef = ref)}
              isUser={true}
              audio={attachment.item.audio}
              isSquare={true}
            />
          </View>
        )}
        <RowContainer paddingTop={32} paddingBottom={18}>
          <Text h5 bold uppercase>
            {LANGUAGE_MAPPING[this.state.lang].fill_in_blank_suitable}
          </Text>
          <TouchableOpacity
            style={styles.translateWrap}
            onPress={this.changeText}>
            <Image source={images.translate} style={styles.translate} />
          </TouchableOpacity>
        </RowContainer>
      </View>
    );
  };

  renderItem = ({item, index}) => {
    const {answers, isDone} = this.state;

    return (
      <FillInBlankItem
        key={item.key}
        item={item}
        index={index}
        onSelected={(k) => this.onSelected(item, index, k)}
        answers={answers[index]}
        showCorrectAnswer={isDone}
      />
    );
  };

  renderFooterFlatList = () => {
    const {isDone} = this.state;

    return (
      <View style={{paddingHorizontal: 24, marginBottom: 48, paddingTop: 20}}>
        {!isDone && (
          <Button
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
      </View>
    );
  };

  renderAlert = () => {
    return (
      <CommonAlert
        show={this.state.isShowAlert}
        title={translate('THẦY MIKE')}
        subtitle={translate('Ôi không, vẫn còn câu hỏi chưa được trả lời kìa!')}
        titleStyle={{
          color: colors.primary,
          fontSize: 14,
          fontWeight: 'bold',
        }}
        subtitleStyle={{
          fontSize: 17,
          color: colors.helpText,
        }}
        headerIconComponent={
          <Image
            source={images.teacher}
            style={{height: 64, width: 64, borderRadius: 32}}
          />
        }
        onRequestClose={() => {}}
        cancellable={false}>
        <Button
          primary
          rounded
          large
          marginBottom={24}
          shadow
          icon
          uppercase
          bold
          onPress={() => this.hideAlert()}>
          {translate('Tiếp tục')}
        </Button>
      </CommonAlert>
    );
  };

  hideAlert = () => {
    this.setState({isShowAlert: false});
  };

  checkAnswer = () => {
    let score = 0,
      correctCount = 0;

    const {questions, userAnswers} = this.state;
    const {currentScriptItem, setMaxCorrect, increaseScore} = this.props;

    //todo check answer all questions
    const notAnswer = userAnswers.findIndex((item) => item === null);

    if (this.audioRef) {
      this.audioRef.pause();
    }

    if (notAnswer !== -1) {
      this.setState({
        isShowAlert: true,
      });
    } else {
      questions.forEach((item, index) => {
        const correctAnswer = item.answers.find((o) => o.isAnswer);
        const correct = correctAnswer ? correctAnswer.text : '';
        if (
          userAnswers[index] &&
          userAnswers[index].text &&
          correct.trim() === userAnswers[index].text.trim()
        ) {
          score += parseInt(item.score || 1);
          correctCount++;
        }
      });

      setMaxCorrect(correctCount);
      increaseScore(score, correctCount, questions.length - correctCount);
      this.setState({
        isDone: true,
      });
    }
  };

  nextActivity = () => {
    generateNextActivity();
  };

  render() {
    const {questions, currentQuestion, questionIndex, blankIndex} = this.state;

    return (
      <ScriptWrapper showProgress={false}>
        <FlatList
          ListHeaderComponent={this.renderHeaderFlatList}
          data={questions}
          renderItem={this.renderItem}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator
          extraData={this.props}
          style={{paddingHorizontal: 24}}
        />

        {this.renderFooterFlatList()}
        {this.renderAlert()}

        <FillInBlankModal
          ref={(ref) => (this.modalRef = ref)}
          item={currentQuestion}
          questionIndex={questionIndex}
          blankIndex={blankIndex}
          onAnswer={this.onAnswer}
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
  translateWrap: {
    alignSelf: 'center',
    paddingHorizontal: 8,
  },
  translate: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});
export default connect(mapStateToProps, {
  setMaxCorrect,
  increaseScore,
})(FillInBlankWithGivenWordsScreen);
