import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {View} from 'react-native-animatable';
import {StyleSheet, TouchableOpacity} from 'react-native';

import {Text} from '~/BaseComponent';
import activityStyles from '~/BaseComponent/components/elements/script/activityStyles';
import InlineActivityWrapper from '~/BaseComponent/components/elements/script/InlineActivityWrapper';
import GivenImageModal from '~/BaseComponent/components/elements/script/GivenImageModal';
import {playAudio} from '~/utils/utils';
import {LANGUAGE, LANGUAGE_MAPPING} from '~/constants/lang';
import {translate} from '~/utils/multilanguage';

class InlineAnswerQuestionGivenImages extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isDone: false,
      language: LANGUAGE.VI,
      content: LANGUAGE_MAPPING.vi.choose_the_correct_picture,
    };

    this.showModal = this.showModal.bind(this);
  }

  componentWillUnmount(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  changeText = () => {
    if (this.state.language === LANGUAGE.VI) {
      this.setState({
        language: LANGUAGE.EN,
        content: LANGUAGE_MAPPING[LANGUAGE.EN].choose_the_correct_picture,
      });
    }
    if (this.state.language === LANGUAGE.EN) {
      this.setState({
        language: LANGUAGE.VI,
        content: LANGUAGE_MAPPING[LANGUAGE.VI].choose_the_correct_picture,
      });
    }
  };

  showModal() {
    if (this.modalRef && !this.state.isDone) {
      this.modalRef.showModal();
    }
    playAudio('selected');
  }

  render() {
    const {activity, loadingCompleted} = this.props;
    const {data} = activity;
    const {answers, delay, score} = data;

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
          </View>
          <View style={[{flexDirection: 'row'}, activityStyles.embedButton]}>
            <TouchableOpacity
              activeOpacity={0.65}
              onPress={this.showModal}
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text h5>{this.state.content}</Text>
            </TouchableOpacity>
            {/*<TouchableOpacity*/}
            {/*  style={styles.translateWrap}*/}
            {/*  onPress={this.changeText}>*/}
            {/*  <Image source={images.translate} style={styles.translate} />*/}
            {/*</TouchableOpacity>*/}
          </View>
        </View>

        <GivenImageModal
          ref={(ref) => (this.modalRef = ref)}
          options={answers}
          onDone={(item) => {
            this.setState({isDone: true});
          }}
          score={parseInt(score)}
        />
      </InlineActivityWrapper>
    );
  }
}

InlineAnswerQuestionGivenImages.propTypes = {
  activity: PropTypes.object.isRequired,
  loadingCompleted: PropTypes.func,
};

InlineAnswerQuestionGivenImages.defaultProps = {
  loadingCompleted: () => {},
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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

export default connect(null, {})(InlineAnswerQuestionGivenImages);
