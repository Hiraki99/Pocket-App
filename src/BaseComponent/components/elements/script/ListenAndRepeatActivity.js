import React from 'react';
import {TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {View} from 'react-native-animatable';
import {Icon} from 'native-base';

import {Text} from '~/BaseComponent';
import {HighLightText} from '~/BaseComponent/components/elements/script/HighLightText';
import activityStyles from '~/BaseComponent/components/elements/script/activityStyles';
import EmbedAudio from '~/BaseComponent/components/elements/script/EmbedAudio';
import SpeakModal from '~/BaseComponent/components/elements/script/SpeakModal';
import InlineActivityWrapper from '~/BaseComponent/components/elements/script/InlineActivityWrapper';
import {increaseWorkSpeak} from '~/features/script/ScriptAction';
import {colors} from '~/themes';
import {makeAction} from '~/utils/action';
import * as actionTypes from '~/constants/actionTypes';
import * as emotions from '~/constants/emotions';
import {
  addAction,
  dispatchAnswerQuestion,
  generateNextActivity,
} from '~/utils/script';
import {translate} from '~/utils/multilanguage';

class ListenAndSpeakActivity extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      isDone: false,
    };

    this.showModal = this.showModal.bind(this);
  }

  componentDidMount() {
    const {activity} = this.props;
    const {delay} = activity.data;

    if (delay && delay !== 0) {
      this.timeout = setTimeout(() => {
        this.setState({
          show: true,
        });
      }, delay);
    } else {
      this.setState({
        show: true,
      });
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  showModal() {
    if (this.modalRef && !this.state.isDone) {
      this.modalRef.showModal();
    }
  }

  onRecorded = (filePath, score) => {
    const {activity} = this.props;
    const {word, sentence} = activity.data;

    this.setState({
      isDone: true,
    });
    this.props.increaseWorkSpeak();
    const action1 = makeAction(actionTypes.INLINE_USER_AUDIO, {
      audio: filePath,
    });
    let commonComment;
    const scoreGetComment = score;
    if (scoreGetComment >= 70) {
      commonComment = this.props.commonCommentSpeak.good;
    }
    if (scoreGetComment >= 30 && scoreGetComment < 70) {
      commonComment = this.props.commonCommentSpeak.avg;
    }
    if (scoreGetComment < 30) {
      commonComment = this.props.commonCommentSpeak.bad;
    }
    let image, action2;

    if (commonComment && commonComment.texts) {
      const textComment =
        commonComment.texts[
          Math.round(Math.random() * commonComment.texts.length)
        ];
      action2 = makeAction(actionTypes.INLINE_SENTENCE, {
        content: textComment.text,
        score: score / 100.0 || 0,
        scoreBonus: activity.data.score,
      });
      let count = 0;
      while (!image) {
        if (count >= textComment.emojis.length) {
          image =
            emotions.oneCorrect.image[
              Math.floor(Math.random() * emotions.oneCorrect.image.length)
            ];
        } else {
          image =
            emotions.HASH_TABLE_EMOJI[
              textComment.emojis[
                Math.floor(Math.random() * textComment.emojis.length)
              ].name.split('.')[0]
            ];
        }
        count++;
      }
    } else {
      action2 = makeAction(actionTypes.INLINE_SENTENCE, {
        content: translate('Vừa đi Mỹ về đấy à bạn =))'),
        score: activity.data.score,
      });
      image =
        emotions.oneCorrect.image[
          Math.floor(Math.random() * emotions.oneCorrect.image.length)
        ];
    }

    const action3 = makeAction(
      actionTypes.SPEAKER_RESULT,
      {
        score,
      },
      500,
    );

    const imageAction = makeAction(
      actionTypes.INLINE_EMOTION,
      {
        image,
      },
      500,
    );

    addAction(action1);
    dispatchAnswerQuestion(score > 0.5, activity.data.score);
    setTimeout(() => addAction(imageAction), 2000);
    setTimeout(() => addAction(action2), 4000);
    setTimeout(() => addAction(action3), 6000);
    setTimeout(() => generateNextActivity(0, 4000), 8000);
  };

  renderModal() {
    const {activity} = this.props;
    const {data} = activity;
    const {word, pronunciation, sentence} = data;

    return (
      <SpeakModal
        ref={(ref) => (this.modalRef = ref)}
        word={word}
        sentence={sentence}
        pronunciation={pronunciation}
        onRecorded={this.onRecorded}
        googleApiKey={this.props.googleApiKey}
      />
    );
  }

  render() {
    const {activity, loadingCompleted} = this.props;
    const {show} = this.state;
    const {data} = activity;
    const {title, word, sentence, audio, delay} = data;

    if (!show) {
      return null;
    }

    return (
      <InlineActivityWrapper delay={delay} loadingCompleted={loadingCompleted}>
        <View
          style={[activityStyles.mainInfo, activityStyles.mainInfoNoPadding]}>
          <View style={activityStyles.contentWrap}>
            <Text primary uppercase bold>
              Mike
            </Text>

            <EmbedAudio audio={audio} darker />

            <Text h5 bold>
              {title}
            </Text>
            <Text h5>
              {`${translate('Hãy nghe và nói:')} `}
              <HighLightText content={word || sentence} />
            </Text>
          </View>

          <TouchableOpacity
            style={activityStyles.embedBtn}
            activeOpacity={0.6}
            onPress={this.showModal}>
            <Text primary h5 center>
              <Icon
                name="microphone"
                style={{color: colors.primary, fontSize: 16}}
                type="FontAwesome"
              />
              {` ${translate('Bắt đầu nói')}`}
            </Text>
          </TouchableOpacity>
        </View>

        {this.renderModal()}
      </InlineActivityWrapper>
    );
  }
}

ListenAndSpeakActivity.propTypes = {
  activity: PropTypes.object.isRequired,
  loadingCompleted: PropTypes.func,
  googleApiKey: PropTypes.string,
};

ListenAndSpeakActivity.defaultProps = {
  loadingCompleted: () => {},
  googleApiKey: '',
};

const mapStateToProps = (state) => {
  return {
    commonCommentSpeak: state.course.commonCommentSpeak,
  };
};

export default connect(mapStateToProps, {increaseWorkSpeak})(
  ListenAndSpeakActivity,
);
