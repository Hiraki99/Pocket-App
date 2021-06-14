import React from 'react';
import {connect} from 'react-redux';
import {ScrollView} from 'react-native';

import {MainContainer} from '~/BaseComponent/components/base/CommonContainer';
import CommonHeader from '~/BaseComponent/components/layouts/CommonHeader';
import {colors} from '~/themes';
import {Text} from '~/BaseComponent';

class TranscriptScreen extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    const {currentActivity, currentScriptItem} = this.props;

    return (
      <MainContainer
        paddingTop={0}
        paddingHorizontal={0}
        backgroundColor={colors.white}>
        <CommonHeader title={currentActivity.name.toUpperCase()} />

        <ScrollView style={{paddingHorizontal: 24, marginTop: 20}}>
          <Text h4 bold style={{marginBottom: 10}}>
            {currentScriptItem.transcript.title}
          </Text>
          <Text h5>{currentScriptItem.transcript.content}</Text>
        </ScrollView>
      </MainContainer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentActivity: state.activity.currentActivity,
    currentScriptItem: state.script.currentScriptItem,
  };
};

export default connect(mapStateToProps, null)(TranscriptScreen);
