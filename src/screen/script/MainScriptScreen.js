import React, {Suspense} from 'react';
import {connect} from 'react-redux';
import {FlatList, View, ActivityIndicator} from 'react-native';

import {HighLightText} from '~/BaseComponent/components/elements/script/HighLightText';
// eslint-disable-next-line import/order
import {Text} from '~/BaseComponent/index';

const InlineSentenceActivity = React.lazy(() =>
  import('~/BaseComponent/components/elements/script/InlineSentenceActivity'),
);
const InlineAction = React.lazy(() =>
  import('~/BaseComponent/components/elements/script/InlineAction'),
);
const InlineAudioActivity = React.lazy(() =>
  import('~/BaseComponent/components/elements/script/InlineAudioActivity'),
);
const SingleChoiceInline = React.lazy(() =>
  import('~/BaseComponent/components/elements/script/SingleChoiceInline'),
);
const InlineEmotion = React.lazy(() =>
  import('~/BaseComponent/components/elements/script/InlineEmotion'),
);
const MultiChoiceInline = React.lazy(() =>
  import('~/BaseComponent/components/elements/script/MultiChoiceInline'),
);
const ListenAndSpeakActivity = React.lazy(() =>
  import('~/BaseComponent/components/elements/script/ListenAndRepeatActivity'),
);
const InlineUserAudioActivity = React.lazy(() =>
  import('~/BaseComponent/components/elements/script/InlineUserAudioActivity'),
);
const InlineAnswerQuestionGivenWords = React.lazy(() =>
  import(
    '~/BaseComponent/components/elements/script/InlineAnswerQuestionGivenWordsActivity'
  ),
);
const InlineAnswerQuestionGivenImages = React.lazy(() =>
  import(
    '~/BaseComponent/components/elements/script/InlineAnswerQuestionGivenImagesActivity'
  ),
);
const InlineImageActivity = React.lazy(() =>
  import('~/BaseComponent/components/elements/script/InlineImageActivity'),
);
const ScriptWrapper = React.lazy(() =>
  import('~/BaseComponent/components/elements/script/ScriptWrapper'),
);
const AnswerQuestionWritingActivity = React.lazy(() =>
  import(
    '~/BaseComponent/components/elements/script/answerQuestionWriting/AnswerQuestionWritingActivity'
  ),
);
const SpeakResult = React.lazy(() =>
  import('~/BaseComponent/components/elements/script/SpeakResult'),
);
const SpeakCoachPractice = React.lazy(() =>
  import('~/BaseComponent/components/elements/script/speak/SpeakCoachPractice'),
);
const SpeakCoachResult = React.lazy(() =>
  import('~/BaseComponent/components/elements/script/speak/SpeakCoachResult'),
);
const SpeakCoachIntroduction = React.lazy(() =>
  import(
    '~/BaseComponent/components/elements/script/speak/SpeakCoachIntroduction'
  ),
);
const WritingInputExam = React.lazy(() =>
  import('~/BaseComponent/components/elements/exam/modal/WritingInputExam'),
);
const SpeakStressPractice = React.lazy(() =>
  import(
    '~/BaseComponent/components/elements/script/speak/SpeakStressPractice'
  ),
);
const SpeakStressResult = React.lazy(() =>
  import('~/BaseComponent/components/elements/script/speak/SpeakStressResult'),
);
const SpeakStressResultNonAI = React.lazy(() =>
  import(
    '~/BaseComponent/components/elements/script/speak/SpeakStressResultNonAI'
  ),
);

import * as actionTypes from '~/constants/actionTypes';
import {generateNextActivity} from '~/utils/script';
import navigator from '~/navigation/customNavigator';

class MainScriptScreen extends React.Component {
  constructor(props) {
    super(props);
    let scrollToIndex = navigator.getParam('scrollToIndex', -1);
    this.state = {
      writingText: '',
      itemWritingSelected: null,
      scrollToIndex,
    };
  }

  componentDidMount() {
    generateNextActivity(...Array(2), true);
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.actions.length !== this.props.actions.length) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => this.scrollToEnd(), 200);
    }
    return true;
  }
  scrollToEnd = () => {
    setTimeout(() => {
      if (this.flatListRef) {
        if (this.state.scrollToIndex >= 0) {
          this.flatListRef.scrollToIndex({
            animated: true,
            index: this.state.scrollToIndex,
          });
        } else {
          this.flatListRef.scrollToEnd({animated: true, duration: 300});
        }
      }
    }, 300);
  };

  showWritingInput = (item) => {
    this.setState(
      {
        writingText: '',
        itemWritingSelected: item,
      },
      () => {
        if (this.writingRef) {
          this.writingRef.show();
        }
      },
    );
  };

  onWritingDone = (text) => {
    this.setState({
      writingText: text,
    });
  };

  renderItem = ({item}) => {
    const {type} = item;
    switch (type) {
      case actionTypes.INLINE_SENTENCE:
        return (
          <InlineSentenceActivity
            activity={item}
            loadingCompleted={() => this.scrollToEnd()}
          />
        );
      case actionTypes.SPEAK_COACH_INTRODUCTION:
        return (
          <SpeakCoachIntroduction
            item={item}
            loadingCompleted={() => this.scrollToEnd()}
          />
        );
      case actionTypes.SPEAK_COACH_RESULT:
        return (
          <SpeakCoachResult
            item={item}
            loadingCompleted={() => this.scrollToEnd()}
          />
        );
      case actionTypes.SPEAK_COACH_SENTENCE:
      case actionTypes.SPEAK_COACH_WORD:
        return (
          <SpeakCoachPractice
            item={item}
            loadingCompleted={() => this.scrollToEnd()}
          />
        );
      case actionTypes.INLINE_ACTION:
        return <InlineAction activity={item} />;
      case actionTypes.INLINE_AUDIO:
        return <InlineAudioActivity activity={item} />;
      case actionTypes.SINGLE_CHOICE_INLINE:
        return (
          <SingleChoiceInline
            activity={item}
            loadingCompleted={() => this.scrollToEnd()}
          />
        );
      case actionTypes.MULTI_CHOICE_INLINE:
        return (
          <MultiChoiceInline
            activity={item}
            loadingCompleted={() => this.scrollToEnd()}
          />
        );
      case actionTypes.LISTEN_AND_SPEAK:
        return (
          <ListenAndSpeakActivity
            activity={item}
            googleApiKey={this.props.stt.api_key}
          />
        );
      case actionTypes.SPEAKING_STRESS:
        return (
          <SpeakStressPractice
            loadingCompleted={() => this.scrollToEnd()}
            item={item}
          />
        );
      case actionTypes.SPEAKING_STRESS_RESULT:
        return (
          <SpeakStressResult
            loadingCompleted={() => this.scrollToEnd()}
            item={item}
          />
        );
      case actionTypes.SPEAKING_STRESS_RESULT_NON_AI:
        return (
          <SpeakStressResultNonAI
            loadingCompleted={() => this.scrollToEnd()}
            item={item}
          />
        );
      case actionTypes.INLINE_EMOTION:
        return (
          <InlineEmotion
            activity={item}
            loadingCompleted={() => this.scrollToEnd()}
          />
        );
      case actionTypes.INLINE_USER_AUDIO:
        return <InlineUserAudioActivity activity={item} />;
      case actionTypes.SPEAKER_RESULT:
        return <SpeakResult activity={item} />;
      case actionTypes.ANSWER_QUESTION_WITH_GIVEN_WORDS:
        return (
          <InlineAnswerQuestionGivenWords
            activity={item}
            loadingCompleted={() => this.scrollToEnd()}
          />
        );
      case actionTypes.ANSWER_QUESTION_WITH_GIVEN_IMAGES:
        return (
          <InlineAnswerQuestionGivenImages
            activity={item}
            loadingCompleted={() => this.scrollToEnd()}
          />
        );
      case actionTypes.INLINE_IMAGE:
        return (
          <InlineImageActivity
            activity={item}
            loadingCompleted={() => this.scrollToEnd()}
          />
        );
      case actionTypes.ANSWER_QUESTION_WRITING:
        return (
          <AnswerQuestionWritingActivity
            activity={item}
            loadingCompleted={() => this.scrollToEnd()}
            onShowWritingInput={this.showWritingInput}
            writingText={this.state.writingText}
          />
        );
      default:
        return null;
    }
  };

  renderQuestion = (item) => {
    if (!item || (item && !item.data)) {
      return null;
    }
    return (
      <View>
        <Text h5 bold>
          {item.data.title}
        </Text>
        <Text h5>
          <HighLightText content={item.data.content} />
        </Text>
      </View>
    );
  };

  keyExtractor = (item) => item.key;

  renderFooter = () => {
    return <View style={styles.footer} />;
  };

  render() {
    const {actions} = this.props;

    return (
      <Suspense
        fallback={
          <ActivityIndicator size={'large'} color={'transparent'} center />
        }>
        <ScriptWrapper>
          <FlatList
            data={actions}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            showsVerticalScrollIndicator={false}
            style={styles.activityList}
            ref={(ref) => {
              this.flatListRef = ref;
            }}
            onContentSizeChange={this.scrollToEnd}
            ListFooterComponent={this.renderFooter}
          />
          {this.state.itemWritingSelected && (
            <WritingInputExam
              ref={(ref) => (this.writingRef = ref)}
              questionComp={() =>
                this.renderQuestion(this.state.itemWritingSelected)
              }
              onSubmit={this.onWritingDone}
            />
          )}
        </ScriptWrapper>
      </Suspense>
    );
  }
}

const styles = {
  activityList: {
    paddingTop: 28,
    paddingHorizontal: 12,
    marginBottom: 24,
    marginTop: 4,
  },
  wrap: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  footer: {
    height: 48,
  },
};

const mapStateToProps = (state) => {
  return {
    currentActivity: state.activity.currentActivity,
    currentScriptItem: state.script.currentScriptItem,
    actions: state.script.actions,
    stt: state.stt.stt,
  };
};
export default connect(mapStateToProps, {})(MainScriptScreen);
