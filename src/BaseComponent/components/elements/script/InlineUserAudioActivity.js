import React from 'react';
import {View} from 'react-native-animatable';
import PropTypes from 'prop-types';

import EmbedAudio from '~/BaseComponent/components/elements/script/EmbedAudio';
import activityStyles from '~/BaseComponent/components/elements/script/activityStyles';

export default class InlineUserAudioActivity extends React.PureComponent {
  render() {
    const {activity} = this.props;
    const {data} = activity;
    const {audio} = data;
    const autoPlay = data?.autoPlay !== undefined ? data?.autoPlay : true;
    return (
      <View
        style={[
          activityStyles.right,
          activityStyles.commonWidth,
          {marginBottom: 16},
        ]}
        animation="fadeInUp"
        useNativeDriver
        easing="ease-in-out"
        duration={500}>
        <EmbedAudio audio={audio} isUser={true} autoPlay={autoPlay} />
      </View>
    );
  }
}

InlineUserAudioActivity.propTypes = {
  activity: PropTypes.object.isRequired,
};
