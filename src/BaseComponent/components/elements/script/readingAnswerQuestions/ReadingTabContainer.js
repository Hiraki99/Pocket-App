import React from 'react';
import {View} from 'react-native';
import {TabBar, TabView} from 'react-native-tab-view';
import PropTypes from 'prop-types';

import {FlexContainer, Text} from '~/BaseComponent';
import ReadingView from '~/BaseComponent/components/elements/script/readingAnswerQuestions/ReadingView';
import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';

export default class ReadingTabContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      routes: [
        {key: 'reading', title: translate('Bài đọc')},
        {key: 'exercise', title: translate('Bài tập')},
      ],
    };
  }

  setIndex = (index) => {
    this.setState({
      index: index,
    });
  };

  renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: colors.primary, height: 4}}
      style={{
        backgroundColor: colors.white,
        shadowColor: '#788db4',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.12,
        shadowRadius: 3,
        elevation: 3,
        borderBottomWidth: 0,
      }}
      renderLabel={({route, focused}) => (
        <Text h5 bold uppercase primary={focused}>
          {route.title}
        </Text>
      )}
    />
  );

  renderScene = ({route, jumpTo}) => {
    const {currentScriptItem, exerciseComponent} = this.props;
    switch (route.key) {
      case 'reading':
        return (
          <ReadingView
            image={currentScriptItem.image}
            title={currentScriptItem.title}
            content={currentScriptItem.content}
            data={currentScriptItem}
            onNext={() => jumpTo('exercise')}
          />
        );
      case 'exercise':
        return exerciseComponent;
      default:
        return null;
    }
  };

  render() {
    const {index, routes} = this.state;

    return (
      <ScriptWrapper>
        <FlexContainer marginTop={1}>
          <TabView
            navigationState={{index, routes}}
            onIndexChange={this.setIndex}
            renderScene={this.renderScene}
            renderTabBar={this.renderTabBar}
          />
        </FlexContainer>
      </ScriptWrapper>
    );
  }
}

ReadingTabContainer.propTypes = {
  currentScriptItem: PropTypes.object.isRequired,
  exerciseComponent: PropTypes.elementType.isRequired,
};
