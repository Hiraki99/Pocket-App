import React from 'react';
import {connect} from 'react-redux';
import {FlatList, View} from 'react-native';

import {HighLightText} from '~/BaseComponent/components/elements/script/HighLightText';
import InlineSentenceActivity from '~/BaseComponent/components/elements/script/InlineSentenceActivity';
import InlineAction from '~/BaseComponent/components/elements/script/InlineAction';
import InlineAudioActivity from '~/BaseComponent/components/elements/script/InlineAudioActivity';
import SingleChoiceInline from '~/BaseComponent/components/elements/script/SingleChoiceInline';
import InlineEmotion from '~/BaseComponent/components/elements/script/InlineEmotion';
import MultiChoiceInline from '~/BaseComponent/components/elements/script/MultiChoiceInline';
import ListenAndSpeakActivity from '~/BaseComponent/components/elements/script/ListenAndRepeatActivity';
import InlineUserAudioActivity from '~/BaseComponent/components/elements/script/InlineUserAudioActivity';
import InlineAnswerQuestionGivenWords from '~/BaseComponent/components/elements/script/InlineAnswerQuestionGivenWordsActivity';
import InlineAnswerQuestionGivenImages from '~/BaseComponent/components/elements/script/InlineAnswerQuestionGivenImagesActivity';
import InlineImageActivity from '~/BaseComponent/components/elements/script/InlineImageActivity';
import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import AnswerQuestionWritingActivity from '~/BaseComponent/components/elements/script/answerQuestionWriting/AnswerQuestionWritingActivity';
import SpeakResult from '~/BaseComponent/components/elements/script/SpeakResult';
import SpeakCoachPractice from '~/BaseComponent/components/elements/script/speak/SpeakCoachPractice';
import SpeakCoachResult from '~/BaseComponent/components/elements/script/speak/SpeakCoachResult';
import SpeakCoachIntroduction from '~/BaseComponent/components/elements/script/speak/SpeakCoachIntroduction';
import WritingInputExam from '~/BaseComponent/components/elements/exam/modal/WritingInputExam';
import {Text} from '~/BaseComponent/index';
import SpeakStressPractice from '~/BaseComponent/components/elements/script/speak/SpeakStressPractice';
import SpeakStressResult from '~/BaseComponent/components/elements/script/speak/SpeakStressResult';
import SpeakStressResultNonAI from '~/BaseComponent/components/elements/script/speak/SpeakStressResultNonAI';
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
    this.listLoaded = new Map();
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

  renderFooter = () => {
    return <View style={styles.footer} />;
  };

  render() {
    const {actions} = this.props;

    return (
      <ScriptWrapper>
        <FlatList
          data={actions}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.key}
          showsVerticalScrollIndicator={false}
          style={styles.activityList}
          ref={(ref) => {
            this.flatListRef = ref;
          }}
          onContentSizeChange={this.scrollToEnd}
          ListFooterComponent={this.renderFooter}
          onScrollToIndexFailed={() => {}}
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
