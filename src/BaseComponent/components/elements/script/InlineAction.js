import React from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';

import {AnimatableButton} from '~/BaseComponent';
import {playAudio} from '~/utils/utils';

export default class InlineAction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPressed: false,
      show: false,
    };

    this.handlePress = this.handlePress.bind(this);
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

  handlePress() {
    const {activity} = this.props;
    const {data} = activity;
    const {isPressed} = this.state;

    if (!isPressed) {
      this.setState({isPressed: true});
      data.action();
    }
    playAudio('selected');
  }

  render() {
    const {activity} = this.props;
    const {data} = activity;
    const {isPressed, show} = this.state;
    if (!show) {
      return null;
    }

    return (
      <View style={{alignSelf: 'flex-end', marginBottom: 16}}>
        <AnimatableButton
          rounded
          pill
          outline={!isPressed}
          primary={!activity.data.isActionSpeakVip || isPressed}
          animation="fadeInUp"
          useNativeDriver
          easing="ease-in-out"
          duration={500}
          shadow={!activity.data.isActionSpeakVip}
          action={activity.data.isActionSpeakVip}
          onPress={this.handlePress}>
          {data.content}
        </AnimatableButton>
      </View>
    );
  }
}

InlineAction.propTypes = {
  activity: PropTypes.object.isRequired,
};
