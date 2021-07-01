import React from 'react';
import {connect} from 'react-redux';
import {FlatList, View, Dimensions, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';

import {
  FlexContainer,
  MainContainer,
} from '~/BaseComponent/components/base/CommonContainer';
import {Button, Text, CheckBox, TutorialHeader} from '~/BaseComponent';
import navigator from '~/navigation/customNavigator';
import {
  changeCurrentScriptItem,
  resetAction,
} from '~/features/script/ScriptAction';
import {colors} from '~/themes';
import {playAudio} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

const {width} = Dimensions.get('window');

class RoleplayScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    const {currentScriptItem} = props;

    this.state = {
      speakers: currentScriptItem.speakers || [],
      selected: null,
      speaker: false,
      showRoleplay: false,
      conversations: currentScriptItem.conversations || [],
      isListAll: false,
      listActions: [],
    };

    this.goBack = this.goBack.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(this.props.currentScriptItem) !==
      JSON.stringify(prevProps.currentScriptItem)
    ) {
      this.setState({
        speakers: this.props.currentScriptItem.speakers || [],
        selected: null,
        speaker: false,
        showRoleplay: false,
        conversations: this.props.currentScriptItem.conversations || [],
      });
    }
  }

  goBack() {
    const {isActivityVip, fromWordGroup} = this.props;
    this.props.changeCurrentScriptItem(null);
    this.props.resetAction();
    if (fromWordGroup) {
      return navigator.navigate('LibraryLessonDetail');
    }
    if (isActivityVip) {
      return navigator.navigate('LessonPracticeSpeakDetail');
    }
    navigator.navigate('Activity');
    return true;
  }

  onSelect = (item) => {
    this.setState({
      selected: item,
      isChosen: true,
    });
    playAudio('selected');
  };

  renderRole = ({item, index}) => {
    const {selected, isChosen} = this.state;
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={() => this.onSelect(item)}>
        <View
          key={`${item.name}_${index}`}
          style={[
            styles.card,
            isChosen ? styles.cardUnselect : null,
            selected && selected.id === item.id ? styles.cardSelected : null,
          ]}>
          <>
            <FastImage source={{uri: item.avatar}} style={styles.avatar} />

            <Text uppercase center bold style={{paddingBottom: 8}}>
              {item.name}
            </Text>
          </>

          {selected && selected.id === item.id && (
            <View style={styles.checkbox}>
              <CheckBox checked={true} color={colors.primary} disabled={true} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  renderFooter = () => {
    const {selected} = this.state;
    const {currentScriptItem} = this.props;

    return (
      <View style={{marginTop: 40}}>
        <Button
          large
          primary
          rounded
          block
          uppercase
          bold
          icon
          disabled={selected === null}
          onPress={() => {
            this.setState({showRoleplay: true});
            if (currentScriptItem.type === 'speaking_roleplay_vip') {
              return navigator.navigate('PronunciationVip', {
                roleChoose: selected,
              });
            }
            navigator.navigate('Pronunciation', {roleChoose: selected});
          }}>
          {`${translate('Tiếp tục')}`}
        </Button>
      </View>
    );
  };

  renderHeader = () => {
    return (
      <>
        <Text h3 center bold>
          {`${translate('Chọn vai')}`}
        </Text>
        <Text
          h5
          color={colors.helpText2}
          center
          style={{paddingTop: 10, paddingBottom: 32}}>
          {`${translate('Hãy lựa chọn 1 vai để bắt đầu')}`}
        </Text>
      </>
    );
  };

  renderChooseSpeaker = () => {
    const {speakers} = this.state;

    return (
      <FlexContainer style={styles.speakers}>
        <FlatList
          data={speakers}
          keyExtractor={(item, index) => `${item.name}_${index}`}
          renderItem={this.renderRole}
          numColumns={2}
          ItemSeparatorComponent={() => <View style={{height: 24}} />}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={this.renderHeader}
          style={{flexGrow: 0}}
        />
        {this.renderFooter()}
      </FlexContainer>
    );
  };

  render() {
    const {currentActivity} = this.props;
    const {showRoleplay} = this.state;

    return (
      <MainContainer
        paddingTop={0}
        paddingHorizontal={0}
        style={showRoleplay ? styles.showRoleplay : null}>
        <TutorialHeader
          title={currentActivity ? currentActivity.name.toUpperCase() : ''}
          close
          back={false}
          onClose={this.goBack}
          themeWhite
        />

        {this.renderChooseSpeaker()}
      </MainContainer>
    );
  }
}

const styles = {
  speakers: {
    paddingTop: 64,
    paddingBottom: 48,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    backgroundColor: colors.mainBgColor,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 15,
    paddingVertical: 24,
    width: (width - 24 * 3) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginRight: 24,
  },
  cardSelected: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    // elevation: 3,
    opacity: 1,
  },
  cardUnselect: {
    opacity: 0.4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 24,
  },
  checkbox: {
    position: 'absolute',
    right: 20,
    top: 10,
  },
  showRoleplay: {
    backgroundColor: '#fff',
  },
};

const mapStateToProps = (state) => {
  return {
    currentActivity: state.activity.currentActivity,
    currentScriptItem: state.script.currentScriptItem || {},
    isActivityVip: state.activity.isActivityVip,
    fromWordGroup: state.vocabulary.fromWordGroup,
  };
};

export default connect(mapStateToProps, {changeCurrentScriptItem, resetAction})(
  RoleplayScreen,
);
