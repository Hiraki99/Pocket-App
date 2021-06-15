import React from 'react';
import {StyleSheet, View} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import {BlankHeader, FlexContainer} from '~/BaseComponent';
import HomeTabBar from '~/BaseComponent/components/elements/tabbar/HomeTabBar';
import TopUserHeader from '~/BaseComponent/components/layouts/header/TopUserHeader';
import LessonContainer from '~/features/lessons/container/LessonContainer';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';

const HomeScreen = () => {
  return (
    <FlexContainer backgroundColor={colors.white}>
      <BlankHeader color={colors.white} dark />
      <View paddingHorizontal={24}>
        <TopUserHeader />
      </View>
      <ScrollableTabView
        renderTabBar={() => <HomeTabBar style={styles.tabBar} />}
        tabBarBackgroundColor={colors.white}
        tabBarActiveTextColor={colors.primary}
        tabBarInactiveTextColor={colors.helpText}
        prerenderingSiblingsNumber={0}
        tabBarUnderlineStyle={{backgroundColor: colors.primary}}
        tabBarTextStyle={styles.tabBarTextStyle}>
        <LessonContainer tabLabel={translate('Dễ')} />
        <LessonContainer tabLabel={translate('Trung bình')} />
        <LessonContainer tabLabel={translate('Khó')} />
      </ScrollableTabView>
    </FlexContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#F5F6F9',
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
    borderRadius: 16,
    marginHorizontal: 24,
    marginBottom: 8,
  },
  label: {width: 'auto', marginTop: 6},
});

export default HomeScreen;
