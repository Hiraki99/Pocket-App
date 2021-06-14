import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {View} from 'react-native-animatable';
import {TouchableOpacity} from 'react-native';

import {Text} from '~/BaseComponent';
import activityStyles from '~/BaseComponent/components/elements/script/activityStyles';
import InlineActivityWrapper from '~/BaseComponent/components/elements/script/InlineActivityWrapper';
import GivenWordModal from '~/BaseComponent/components/elements/script/GivenWordModal';
import {translate} from '~/utils/multilanguage';

class InlineAnswerQuestionGivenWords extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDone: false,
    };

    this.showModal = this.showModal.bind(this);
  }

  componentWillUnmount(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  showModal() {
    if (this.modalRef && !this.state.isDone) {
      this.modalRef.showModal();
    }
  }

  render() {
    const {activity, loadingCompleted} = this.props;
    const {data} = activity;
    const {options, delay, showResult, score} = data;
    const correctOptions = options.filter((item) => item.isAnswer);
    const correctAnswer = correctOptions.map((item) => item.text).join(' ');

    return (
      <InlineActivityWrapper delay={delay} loadingCompleted={loadingCompleted}>
        <View
          style={[activityStyles.mainInfo, activityStyles.mainInfoNoPadding]}>
          <View style={activityStyles.contentWrap}>
            <Text primary uppercase bold>
              {translate('Mike')}
            </Text>
            <Text h5 bold>
              {data.title}
            </Text>
            <Text h5>{data.content}</Text>

            {showResult && (
              <View>
                <Text h5 bold style={{marginTop: 10}}>
                  {translate('Đáp án')}
                </Text>

                <Text h5>{correctAnswer}</Text>
              </View>
            )}
          </View>

          {!showResult && (
            <TouchableOpacity
              activeOpacity={0.65}
              style={activityStyles.embedButton}
              onPress={this.showModal}>
              <Text h5>{translate('Sắp xếp từ/cụm từ')}</Text>
            </TouchableOpacity>
          )}
        </View>

        <GivenWordModal
          ref={(ref) => (this.modalRef = ref)}
          options={options}
          score={score}
          onDone={(isCorrect, answer, listSelectedKeys) => {
            this.setState({isDone: true});
          }}
        />
      </InlineActivityWrapper>
    );
  }
}

InlineAnswerQuestionGivenWords.propTypes = {
  activity: PropTypes.object.isRequired,
  loadingCompleted: PropTypes.func,
};

InlineAnswerQuestionGivenWords.defaultProps = {
  loadingCompleted: () => {},
};

export default connect(null, {})(InlineAnswerQuestionGivenWords);
