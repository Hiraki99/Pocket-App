import React from 'react';
import {connect} from 'react-redux';
import {TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {View} from 'react-native-animatable';

import {Text} from '~/BaseComponent';
import activityStyles from '~/BaseComponent/components/elements/script/activityStyles';
import InlineActivityWrapper from '~/BaseComponent/components/elements/script/InlineActivityWrapper';
import InlineAttachment from '~/BaseComponent/components/elements/script/attachment/InlineAttachment';
import {HighLightText} from '~/BaseComponent/components/elements/script/HighLightText';
import {addAction, processUserAnswer} from '~/utils/script';
import {makeAction} from '~/utils/action';
import * as actionTypes from '~/constants/actionTypes';
import {playAudio} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

class SingleChoiceInline extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDone: false,
    };
  }

  componentWillUnmount(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  renderOptions = () => {
    const {activity} = this.props;
    const {data} = activity;

    return data.options.map((item, index) => {
      return (
        <TouchableOpacity
          activeOpacity={0.65}
          style={[
            activityStyles.inlineActionItem,
            index === data.options.length - 1
              ? activityStyles.inlineActionItemLast
              : null,
          ]}
          key={item.key}
          onPress={() => this.showAnswer(item, index, data)}>
          <Text h5 center primary paddingHorizontal={16}>
            {item.text}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  showAnswer(item, index, data) {
    if (!this.state.isDone) {
      playAudio('selected');
      // todo show answer
      const action1 = makeAction(actionTypes.INLINE_SENTENCE, {
        isUser: true,
        content: item.text,
      });

      addAction(action1);
      // todo check answer and feedback
      processUserAnswer(
        item.isAnswer,
        data.score,
        data.options.length > 2,
        () => {
          const options = [].concat(data.options);
          options.splice(index, 1);

          const action = makeAction(actionTypes.SINGLE_CHOICE_INLINE, {
            ...data,
            options: options,
          });

          this.timeout = setTimeout(() => {
            addAction(action);
          }, 2500);
        },
      );
    }

    // todo done answer
    this.setState({
      isDone: true,
    });
  }

  render() {
    const {activity, loadingCompleted} = this.props;
    const {data} = activity;
    const delay = data.delay ? data.delay : 0;

    return (
      <InlineActivityWrapper loadingCompleted={loadingCompleted} delay={delay}>
        <View
          style={[activityStyles.mainInfo, activityStyles.mainInfoNoPadding]}>
          <View style={activityStyles.contentWrap}>
            <Text
              primary
              uppercase
              bold
              style={{paddingBottom: activity.data.attachment ? 8 : 0}}>
              {translate('Mike')}
            </Text>

            <InlineAttachment attachment={activity.data.attachment} darker />
            <Text h5 bold paddingVertical={8}>
              {data.title}
            </Text>
            {/*<TranslateText*/}
            {/*  textVI={data.title_vn}*/}
            {/*  textEN={data.title}*/}
            {/*  RenderComponent={(props) => (*/}
            {/*    <Text h5 bold paddingVertical={8}>*/}
            {/*      {props.content}*/}
            {/*    </Text>*/}
            {/*  )}*/}
            {/*/>*/}
            <Text h5>
              <HighLightText content={data.content} />
            </Text>
          </View>

          <View style={activityStyles.inlineActionWrap}>
            {this.renderOptions()}
          </View>
        </View>
      </InlineActivityWrapper>
    );
  }
}

SingleChoiceInline.propTypes = {
  activity: PropTypes.object.isRequired,
  loadingCompleted: PropTypes.func,
};

SingleChoiceInline.defaultProps = {
  loadingCompleted: () => {},
};

export default connect(null, {})(SingleChoiceInline);
