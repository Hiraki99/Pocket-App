import React from 'react';
import {connect} from 'react-redux';
import {FlatList, Image, UIManager, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {AudioPlayer, Button, CommonAlert, Text} from '~/BaseComponent';
import ConversationActivity from '~/BaseComponent/components/elements/script/ConversationActivity';
import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import ConversationRecordActivity from '~/BaseComponent/components/elements/script/ConversationRecordActivity';
import {generateNextActivity} from '~/utils/script';
import {increaseScore, answerQuestion} from '~/features/script/ScriptAction';
import {colors, images} from '~/themes';
import {makeid} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

class ConversationScreen extends React.Component {
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

  componentDidMount() {
    this.initConversation();
    this.listenerFocus = this.props.navigation.addListener('focus', () => {
      if (this.audioPlayerRef && this.state.currentTime) {
        this.audioPlayerRef.play();
      }
    });
    this.listener = this.props.navigation.addListener('blur', () => {
      if (this.audioPlayerRef) {
        this.audioPlayerRef.pause();
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.isListAll !== nextState.isListAll ||
      this.state.listActions.length !== nextState.listActions.length ||
      this.state.conversations.length !== nextState.conversations.length ||
      this.state.playing !== nextState.playing
    ) {
      return true;
    }
    return this.state.currentTime === nextState.currentTime;
  }

  componentWillUnmount(): void {
    if (this.onEndTimeout) {
      clearTimeout(this.onEndTimeout);
    }
    this.props.navigation.removeListener(this.listener);
    this.props.navigation.removeListener(this.listenerFocus);
  }

  setStateAudio = (status) => {
    this.setState({playing: status === 'playing'});
  };

  onMoveToEnd = () => {
    setTimeout(() => {
      if (!this.state.isListAll) {
        this.flatListRef.scrollToEnd({animated: true});
      }
    }, 200);
  };

  initConversation = () => {
    const {currentScriptItem} = this.props;
    const roleUpdate = {};
    currentScriptItem.speakers.forEach((item, index) => {
      roleUpdate[item.id] = {
        ...item,
        role: index % 2 !== 0,
      };
    });
    const conversations = currentScriptItem.conversations.map((item) => {
      return {
        ...item,
        role: roleUpdate[item.speaker.id]
          ? roleUpdate[item.speaker.id].role
          : false,
      };
    });

    this.setState({conversations});
  };

  onTimeChange = (time) => {
    let removeCount = 0;
    const actions = [];

    this.setState({currentTime: time});

    this.state.conversations.every((item) => {
      if (item.start <= time) {
        const action = {
          key: makeid(),
          data: item,
        };

        actions.push(action);
        removeCount++;
      } else {
        return false;
      }
    });

    let arr = [...this.state.conversations];

    arr.splice(0, removeCount);

    this.setState(
      {
        listActions: this.state.listActions.concat(actions),
        conversations: arr,
      },
      () => {},
    );
  };

  showTranslation = (item) => {
    if (this.audioPlayerRef) {
      this.audioPlayerRef.pause();
      this.setState({isShowTranslation: true, translateItem: item});
    }
  };

  hideTranslation = () => {
    this.setState({isShowTranslation: false, translateItem: null});
  };

  showResult = () => {
    this.setState({isShowResult: true});
  };

  hideResult = (reset = false) => {
    this.setState({isShowResult: false});
    if (reset) {
      this.initConversation();
      this.setState(
        {
          listActions: [],
          isListAll: false,
        },
        () => {
          if (this.audioPlayerRef) {
            this.audioPlayerRef.play();
          }
        },
      );
    } else {
      const {currentScriptItem} = this.props;
      if (this.state.doneCount === 1) {
        this.props.increaseScore(currentScriptItem.score, 1);
      }
      generateNextActivity();
    }
  };

  onPlayEnd = () => {
    this.setState({isListAll: true, doneCount: this.state.doneCount + 1});
    this.onEndTimeout = setTimeout(() => this.showResult(), 200);
  };

  renderItem = ({item}) => {
    const {currentTime} = this.state;
    if (item.data.role) {
      return (
        <ConversationRecordActivity
          conversation={item.data}
          currentTime={currentTime}
          endActivity={false}
          playing={this.state.playing}
          translation
          onShowTranslation={() => this.showTranslation(item.data)}
        />
      );
    }
    return (
      <ConversationActivity
        conversation={item.data}
        currentTime={currentTime}
        playing={this.state.playing}
        onShowTranslation={() => this.showTranslation(item.data)}
      />
    );
  };

  renderTranslation = () => {
    const {translateItem} = this.state;

    return (
      <CommonAlert
        show={this.state.isShowTranslation}
        title={`${translate('%s đã nói', {
          s1: translateItem.speaker.name.toUpperCase(),
        })}`}
        subtitle={translateItem.content}
        titleStyle={{
          color: colors.helpText2,
          fontSize: 14,
        }}
        subtitleStyle={{
          fontSize: 17,
          color: colors.helpText,
        }}
        headerIconComponent={
          <FastImage
            source={{uri: translateItem.speaker.avatar}}
            style={styles.avatar}
          />
        }
        onRequestClose={() => {}}
        cancellable={false}>
        <Text
          center
          color={colors.helpText2}
          uppercase
          style={{marginBottom: 8}}>
          {translate('Bản dịch')}
        </Text>
        <Text h5 center>
          {translateItem.translation}
        </Text>
        <Button
          primary
          rounded
          large
          marginBottom={24}
          marginTop={24}
          shadow
          onPress={this.hideTranslation}>
          {translate('OK, ĐÃ HIỂU')}
        </Button>
      </CommonAlert>
    );
  };

  renderResult = () => {
    return (
      <CommonAlert
        show={this.state.isShowResult}
        title={translate('THẦY MIKE')}
        subtitle={translate(
          'Tốt lắm! Bạn đã nghe xong đoạn hội thoại. Bạn có thể nghe lại hoặc chuyển sang phần tiếp theo nhé!',
        )}
        titleStyle={{
          color: colors.primary,
          fontSize: 14,
          fontWeight: 'bold',
        }}
        subtitleStyle={{
          fontSize: 17,
          color: colors.helpText,
        }}
        headerIconComponent={
          <Image source={images.teacher} style={styles.avatar} />
        }
        onRequestClose={() => {}}
        cancellable={false}>
        <Button
          primary
          outline
          rounded
          large
          marginBottom={16}
          marginTop={24}
          shadow
          icon
          uppercase
          bold
          reloadIcon
          onPress={() => this.hideResult(true)}>
          {translate('Nghe lại')}
        </Button>

        <Button
          primary
          rounded
          large
          marginBottom={24}
          shadow
          icon
          uppercase
          bold
          onPress={() => this.hideResult()}>
          {translate('Tiếp tục')}
        </Button>
      </CommonAlert>
    );
  };

  render() {
    const {currentScriptItem} = this.props;
    const {listActions, translateItem} = this.state;

    return (
      <ScriptWrapper showProgress={false}>
        <FlatList
          data={listActions}
          ListFooterComponent={<View style={{height: 50}} />}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.key}
          showsVerticalScrollIndicator={false}
          style={styles.activityList}
          ref={(ref) => {
            this.flatListRef = ref;
          }}
          onContentSizeChange={this.onMoveToEnd}
          initialNumToRender={6}
        />

        {currentScriptItem && currentScriptItem.audio && (
          <AudioPlayer
            ref={(ref) => (this.audioPlayerRef = ref)}
            filePath={currentScriptItem.audio}
            getStatusAudio={this.setStateAudio}
            onTimeChange={this.onTimeChange}
            onEnd={this.onPlayEnd}
          />
        )}

        {translateItem && this.renderTranslation()}
        {this.renderResult()}
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
})(ConversationScreen);
