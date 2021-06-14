import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View} from 'react-native-animatable';

import activityStyles from '~/BaseComponent/components/elements/script/activityStyles';
import {Text} from '~/BaseComponent';
import InlineActivityWrapper from '~/BaseComponent/components/elements/script/InlineActivityWrapper';
import InlineAttachment from '~/BaseComponent/components/elements/script/attachment/InlineAttachment';
import {pushScriptItemSpeak, pushAction} from '~/features/script/ScriptAction';
import {makeAction} from '~/utils/action';
import * as actionTypes from '~/constants/actionTypes';
import {generateNextActivity} from '~/utils/script';
import {translate} from '~/utils/multilanguage';

const SpeakCoachIntroduction = (props) => {
  const {delay, loadingCompleted, item} = props;

  useEffect(() => {
    const insertInlineAction = () => {
      const action2 = makeAction(
        actionTypes.INLINE_ACTION,
        {
          content: translate('OK, Mình đã sẵn sàng!'),
          action: () => {
            generateNextActivity();
          },
          isActionSpeakVip: true,
        },
        4000,
      );
      setTimeout(() => {
        props.pushAction(action2);
      }, delay);
    };
    insertInlineAction();
  }, []);

  return (
    <InlineActivityWrapper delay={delay} loadingCompleted={loadingCompleted}>
      <View style={[activityStyles.mainInfo, activityStyles.mainInfoNoPadding]}>
        <View style={activityStyles.contentWrap}>
          <Text primary uppercase bold>
            Mike
          </Text>
          <InlineAttachment
            attachment={item.data.attachment}
            darker
            autoPlay={false}
            styleThumbnail={{paddingVertical: 8}}
          />
          <Text h5>{item.data ? item.data.content : ''}</Text>
        </View>
      </View>
    </InlineActivityWrapper>
  );
};

SpeakCoachIntroduction.propTypes = {
  item: PropTypes.object,
  delay: PropTypes.number,
};

SpeakCoachIntroduction.defaultProps = {
  item: {},
  delay: 0,
};

const mapStateToProps = (state) => {
  return {
    speakScriptVipCurrent: state.script.speakScriptVipCurrent,
  };
};

export default connect(mapStateToProps, {pushAction, pushScriptItemSpeak})(
  SpeakCoachIntroduction,
);
