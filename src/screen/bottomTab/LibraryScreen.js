import React from 'react';
import {connect} from 'react-redux';
import {TabBar, TabView} from 'react-native-tab-view';
import {StyleSheet} from 'react-native';

import {
  FlexContainer,
  Text,
  BlankHeader,
  SeparatorVertical,
  BottomTabContainer,
} from '~/BaseComponent';
import TranslationInput from '~/BaseComponent/components/elements/input/TranslationInput';
import {colors} from '~/themes';
import VocabularyContainer from '~/features/vocalbulary/container/VocabularyContainer';
import ListenContainer from '~/features/listen/container/ListenContainer';
import CommunicationContainer from '~/features/lessons/container/CommunicationContainer';
import GrammarContainer from '~/features/grammar/container/GrammarContainer';
import {OS} from '~/constants/os';
import navigator from '~/navigation/customNavigator';
import DocsContainer from '~/features/grammar/container/DocsContainer';
import LessonMusicContainer from '~/features/listen/container/LessonMusicContainer';
import {translate} from '~/utils/multilanguage';

const equal = (prev, next) => {
  return !(prev.focused !== next.focused && next.focused);
};

const VocabularyContainerMemo = React.memo(VocabularyContainer, equal);

const ListenContainerMemo = React.memo(ListenContainer, equal);

const GrammarContainerMemo = React.memo(GrammarContainer, equal);

class LibraryScreen extends React.Component {
  constructor(props) {
    super(props);

    const routes = [
      {key: 'vocabulary', title: 'Học từ'},
      {key: 'listen', title: 'Bài nghe'},
      {key: 'grammar', title: 'Ngữ pháp'},
      {key: 'communication', title: 'Giao tiếp'},
      {key: 'music', title: 'Bài hát'},
      {key: 'document', title: 'Tài liệu'},
    ];

    this.state = {
      index: 0,
      routes,
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    navigation.addListener('focus', () => {
      const params = navigator.getParam('indexSelected', -1);
      navigator.setParams({indexSelected: -1});
      if (params > -1) {
        setTimeout(() => {
          this.setIndex(params);
        }, 100);
      }
    });
  }

  setIndex = (index) => {
    this.setState({
      index,
    });
  };

  renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: colors.primary, height: 3}}
      style={styles.tabBar}
      scrollEnabled={this.state.routes.length > 3}
      initialLayout={OS.WIDTH}
      tabStyle={this.state.routes.length > 3 ? styles.label : {}}
      renderLabel={({route, focused}) => (
        <Text
          fontSize={14}
          bold
          uppercase
          primary={focused}
          paddingHorizontal={this.state.routes.length > 3 ? 8 : null}>
          {translate(route.title)}
        </Text>
      )}
    />
  );

  renderScene = ({route}) => {
    const {index, routes} = this.state;
    const focused = index === routes.indexOf(route);

    switch (route.key) {
      case 'vocabulary':
        return <VocabularyContainerMemo focused={focused} />;
      case 'listen':
        return <ListenContainerMemo focused={focused} />;
      case 'communication':
        return <CommunicationContainer />;
      case 'document':
        return <DocsContainer focused={focused} />;
      case 'music':
        return <LessonMusicContainer focused={focused} />;
      default:
        return <GrammarContainerMemo focused={focused} />;
    }
  };

  render() {
    const {index, routes} = this.state;

    return (
      <BottomTabContainer backgroundColor={colors.white} paddingBottom={100}>
        <BlankHeader dark color={colors.white} />
        <FlexContainer backgroundColor={colors.white}>
          <SeparatorVertical md />
          <TranslationInput />
          <TabView
            navigationState={{index, routes}}
            onIndexChange={this.setIndex}
            renderScene={this.renderScene}
            renderTabBar={this.renderTabBar}
          />
        </FlexContainer>
      </BottomTabContainer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user || {},
  };
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    shadowColor: '#788db4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 1,
    borderBottomWidth: 0,
    justifyContent: 'center',
    paddingVertical: 4,
    marginTop: 4,
  },
  label: {width: 'auto', marginTop: 6},
});

export default connect(mapStateToProps)(LibraryScreen);
