import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from '~/screen/bottomTab/HomeScreen';
import {
  setStatusBarColorAndroid,
  tabBarOptions,
} from '~/navigation/navigationHelper';
import BottomTabBarContainer from '~/navigation/component/BottomTabBarContainer';
import AccountScreen from '~/screen/AccountScreen';
import StudyScreen from '~/screen/bottomTab/StudyScreen';
import LessonDetailScreen from '~/screen/lesson/LessonDetailScreen';
import LessonDetailPrimaryScreen from '~/screen/lesson/LessonDetailPrimaryScreen';
import LibraryScreen from '~/screen/bottomTab/LibraryScreen';
import TeacherExamScreen from '~/screen/bottomTab/TeacherExamScreen';
import navigator from '~/navigation/customNavigator';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';

const Stack = createStackNavigator();

const ExamStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={'TeacherExam'} component={TeacherExamScreen} />
    </Stack.Navigator>
  );
};

const StudyStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={'Study'} component={StudyScreen} />
      <Stack.Screen name={'LessonDetail'} component={LessonDetailScreen} />
      <Stack.Screen
        name={'LessonDetailPrimary'}
        component={LessonDetailPrimaryScreen}
      />
    </Stack.Navigator>
  );
};

const LibraryStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={'Library'} component={LibraryScreen} />
    </Stack.Navigator>
  );
};

const SettingStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={'Account'} component={AccountScreen} />
    </Stack.Navigator>
  );
};

const BottomTab = createBottomTabNavigator();

const AppBottomTab = () => {
  return (
    <BottomTab.Navigator
      lazy
      tabBarOptions={tabBarOptions}
      tabBar={(props) => <BottomTabBarContainer {...props} />}
      style={{marginTop: 100}}>
      <BottomTab.Screen
        tabBarOptions={tabBarOptions}
        name="BottomTabHome"
        component={HomeScreen}
        options={{
          title: `${translate('Trang chủ')}`,
        }}
        listeners={{
          focus: () => setStatusBarColorAndroid(colors.primary),
        }}
      />
      <BottomTab.Screen
        tabBarOptions={tabBarOptions}
        name="BottomTabStudy"
        component={StudyStack}
        options={{
          title: `${translate('Học tập')}`,
        }}
      />
      <BottomTab.Screen
        tabBarOptions={tabBarOptions}
        name="BottomTabExam"
        component={ExamStack}
        options={{
          title: `${translate('Kiểm tra_header')}`,
        }}
      />
      <BottomTab.Screen
        tabBarOptions={tabBarOptions}
        name="BottomTabLibrary"
        component={LibraryStack}
        options={{
          title: `${translate('Thư viện')}`,
        }}
      />
      <BottomTab.Screen
        tabBarOptions={tabBarOptions}
        name="BottomTabSetting"
        component={SettingStack}
        tabPress={() => {
          navigator.navigate('MainStack', {
            screen: 'BottomTabSetting',
            params: {
              screen: 'Setting',
            },
          });
        }}
        tabLongPress={() => {
          navigator.navigate('MainStack', {
            screen: 'BottomTabSetting',
            params: {
              screen: 'Setting',
            },
          });
        }}
        options={{
          title: `${translate('Tài khoản')}`,
        }}
      />
    </BottomTab.Navigator>
  );
};

export default AppBottomTab;
