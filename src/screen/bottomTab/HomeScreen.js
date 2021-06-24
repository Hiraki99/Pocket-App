import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import {BlankHeader, FlexContainer} from '~/BaseComponent';
import HomeTabBar from '~/BaseComponent/components/elements/tabbar/HomeTabBar';
import TopUserHeader from '~/BaseComponent/components/layouts/header/TopUserHeader';
import LessonContainer from '~/features/lessons/container/LessonContainer';
import navigator from '~/navigation/customNavigator';
import {listCourseSelector} from '~/selector/lesson';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';

const HomeScreen = () => {
  const courses = useSelector(listCourseSelector);
  const renderHomeTab = React.useCallback(() => {
    return (
      <HomeTabBar
        style={[styles.tabBar, {opacity: courses.length === 0 ? 0 : 1}]}
      />
    );
  }, [courses]);
  return (
    <FlexContainer backgroundColor={colors.white}>
      <BlankHeader color={colors.white} dark />
      <View paddingHorizontal={24}>
        <TopUserHeader
          onPressAvatar={() => {
            navigator.navigate('Account');
          }}
        />
      </View>
      <ScrollableTabView
        renderTabBar={renderHomeTab}
        tabBarBackgroundColor={colors.white}
        tabBarActiveTextColor={colors.primary}
        tabBarInactiveTextColor={colors.helpText}
        prerenderingSiblingsNumber={0}
        tabBarUnderlineStyle={{backgroundColor: colors.primary}}
        tabBarTextStyle={styles.tabBarTextStyle}>
        {courses.map((item) => {
          return (
            <LessonContainer
              tabLabel={translate(item.display_name)}
              data={item}
              key={item._id}
            />
          );
        })}
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
