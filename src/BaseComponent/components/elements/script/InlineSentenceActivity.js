import React from 'react';
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';
import {View} from 'react-native-animatable';

import {Text} from '~/BaseComponent';
import activityStyles from '~/BaseComponent/components/elements/script/activityStyles';
import InlineActivityWrapper from '~/BaseComponent/components/elements/script/InlineActivityWrapper';
import {colors} from '~/themes';
import {playAudio} from '~/utils/utils';

export default class InlineSentenceActivity extends React.PureComponent {
  componentDidMount(): void {
    const {
      activity: {
        data: {score, delay, autoPlay},
      },
    } = this.props;
    const playSound = autoPlay !== undefined ? autoPlay : true;
    if (playSound) {
      setTimeout(() => {
        if (typeof score === 'string' || typeof score === 'number') {
          if (parseFloat(score) > 0.5) {
            playAudio('correct');
          } else {
            playAudio('wrong');
          }
        }
      }, delay + 1000);
    }
  }

  render() {
    const {activity, loadingCompleted} = this.props;
    const {data} = activity;
    const {isUser, score, delay, scoreBonus} = data;

    return (
      <InlineActivityWrapper
        loading={false}
        isUser={isUser}
        delay={delay}
        loadingCompleted={loadingCompleted}>
        <View
          style={[
            activityStyles.mainInfo,
            activityStyles.autoWidth,
            isUser ? activityStyles.userInlineSentence : null,
          ]}>
          {!isUser && (
            <Text primary uppercase bold>
              Mike
            </Text>
          )}
          <Text h5 color={isUser ? colors.white : colors.helpText}>
            {data.content}
          </Text>
        </View>

        {score > 0 && (
          <View
            animation="bounceIn"
            useNativeDriver
            easing="ease-in-out"
            duration={500}
            delay={1200}
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            {score > 0.5 && (
              <>
                <Text h5>+{scoreBonus || score || 1}</Text>
                <LottieView
                  source={require('~/assets/animate/star')}
                  autoPlay
                  loop
                  style={{width: 30}}
                />
              </>
            )}
          </View>
        )}
      </InlineActivityWrapper>
    );
  }
}

InlineSentenceActivity.propTypes = {
  activity: PropTypes.object.isRequired,
  loadingCompleted: PropTypes.func,
};

InlineSentenceActivity.defaultProps = {
  loadingCompleted: () => {},
};
