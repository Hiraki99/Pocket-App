import React from 'react';
import {connect} from 'react-redux';
import {FlatList, UIManager, View} from 'react-native';

import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import ConversationActivityVip from '~/BaseComponent/components/elements/speak/ConversationActivityVip';
import ConversationActivityRoleVip from '~/BaseComponent/components/elements/speak/ConversationActivityRoleVip';
import EmbedAudio from '~/BaseComponent/components/elements/script/EmbedAudio';
import {Text} from '~/BaseComponent';
import {increaseScore, answerQuestion} from '~/features/script/ScriptAction';
import {translate} from '~/utils/multilanguage';

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

class RolePlayResultVip extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      listActions: [],
      conversations: [],
      isListAll: false,
      currentTime: 0,
      isShowTranslation: false,
      isShowResult: false,
      translateItem: null,
      doneCount: 0,
      playing: false,
    };
  }

  renderItem = ({item}) => {
    return (
      <View style={{paddingHorizontal: 12}}>
        {item.data.role ? (
          <ConversationActivityRoleVip conversation={item.data} />
        ) : (
          <ConversationActivityVip conversation={item.data} />
        )}
      </View>
    );
  };

  render() {
    const {listActions, audio} = this.props;
    return (
      <ScriptWrapper showProgress={false}>
        <EmbedAudio
          audio={audio}
          isUser
          isSquare
          modalResult
          navigateOutScreen={this.state.navigateOutScreen}
        />
        <Text h5 paddingHorizontal={24} style={{paddingTop: 12}}>
          `$
          {translate(
            'Tốt lắm! Bạn đã làm xong đoạn hội thoại. Bạn có thể nghe lại thành quả hoặc tiếp tục nhé!',
          )}
          `
        </Text>
        <FlatList
          data={listActions}
          ListFooterComponent={<View style={{height: 50}} />}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.key}
          showsVerticalScrollIndicator={false}
          style={styles.activityList}
          onContentSizeChange={this.onMoveToEnd}
        />
      </ScriptWrapper>
    );
  }
}

const styles = {
  activityList: {
    paddingTop: 32,
    paddingHorizontal: 12,
  },
  avatar: {
    height: 64,
    width: 64,
    borderRadius: 32,
  },
};

const mapStateToProps = (state) => {
  return {
    currentScriptItem: state.script.currentScriptItem,
  };
};

export default connect(mapStateToProps, {
  increaseScore,
  answerQuestion,
})(RolePlayResultVip);
