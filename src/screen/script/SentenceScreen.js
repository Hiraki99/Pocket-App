import React from 'react';
import {connect} from 'react-redux';
import {FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';

import SentenceActivity from '~/BaseComponent/components/elements/script/SentenceActivity';
import SentenceAction from '~/BaseComponent/components/elements/script/SentenceAction';
import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import {makeid} from '~/utils/utils';
import {resetAction} from '~/features/script/ScriptAction';
import {colors} from '~/themes';

class SentenceScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      listActions: [],
      isFirst: false,
    };
  }

  componentDidMount() {
    const {currentScriptItem, currentActivity} = this.props;
    this.props.resetAction();
    const index = currentActivity.script.findIndex(
      (item) => item.id === currentScriptItem.id,
    );
    if (index === 0) {
      this.setState({
        isFirst: true,
      });
    }

    this.processSentence(currentScriptItem);
    this.preLoadMediaScriptActivity(currentActivity.script);
  }

  componentWillUnmount(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  preLoadMediaScriptActivity = (scripts) => {
    scripts.forEach((activity) => {
      if (activity.type !== 'water_up') {
        return;
      }
      const listMedia = [];
      activity.items.forEach((item) => {
        listMedia.push({uri: item.image});
      });
      FastImage.preload(listMedia);
    });
  };

  processSentence(scriptItem) {
    const action = {
      key: makeid(),
      type: 'sentence',
      data: scriptItem,
    };

    this.setState(
      {
        listActions: this.state.listActions.concat(action),
      },
      () => {
        if (scriptItem.action) {
          const sentenceAction = {
            key: makeid(),
            type: 'sentenceAction',
            data: scriptItem.action,
            delay: 1000,
          };

          this.setState({
            listActions: this.state.listActions.concat(sentenceAction),
          });
        }
      },
    );
  }

  renderItem({item}) {
    switch (item.type) {
      case 'sentence':
        return <SentenceActivity activity={item} />;
      case 'sentenceAction':
        return <SentenceAction action={item} />;
      default:
        return null;
    }
  }

  render() {
    const {listActions} = this.state;

    return (
      <ScriptWrapper
        mainBgColor={colors.mainBgColor}
        showProgress={false}
        immediate>
        <FlatList
          data={listActions}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.key}
          showsVerticalScrollIndicator={false}
          style={styles.activityList}
        />
      </ScriptWrapper>
    );
  }
}

const styles = {
  activityList: {
    paddingTop: 24,
    paddingHorizontal: 24,
  },
};

const mapStateToProps = (state) => {
  return {
    currentActivity: state.activity.currentActivity,
    currentScriptItem: state.script.currentScriptItem,
  };
};

export default connect(mapStateToProps, {
  resetAction,
})(SentenceScreen);
