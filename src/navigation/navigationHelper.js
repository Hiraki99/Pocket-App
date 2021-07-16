import {StyleSheet, StatusBar} from 'react-native';

import {colors} from '~/themes';
import {OS} from '~/constants/os';

export const styles = StyleSheet.create({
  bottomBarContainerAndroid: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    width: OS.WIDTH,
    borderTopWidth: 0.01,
    backgroundColor: colors.white,
    height: OS.hasNotch ? 100 : 70,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
    elevation: 10,
    zIndex: 100,
  },
  bottomBarContainerIOS: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: colors.white,
    height: OS.hasNotch ? 100 : 70,
    paddingHorizontal: 24,
    paddingTop: 4,
    position: 'absolute',
    bottom: 0,
    width: OS.WIDTH,
    shadowColor: 'rgb(230, 235, 243)',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.45,
    borderRadius: 16,
  },
  tabItemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  icon: {
    width: 20,
    height: 20,
    marginTop: OS.hasNotch ? 12 : 10,
  },
  wrapContainer: {flex: 1, zIndex: 11000},
});

export const tabBarOptions = {
  activeTintColor: colors.primary,
  inactiveTintColor: colors.bottomBarColor,
  labelStyle: {fontSize: 12},
  tabStyle: {borderRadius: 16},
  style: {
    backgroundColor: 'transparent',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderTopWidth: 0,
    height: 60,
    shadowColor: 'rgb(230, 235, 243)',
    shadowOffset: {
      width: 0,
      height: -6,
    },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
    paddingHorizontal: 16,
    // position: 'absolute',
    borderRadius: 16,
  },
  // tabStyle: {
  //   height: 60,
  //   paddingHorizontal: 16,
  // },
  keyboardHidesTabBar: true,
  adaptive: false,
};

export const customNavigationOptions = ({}) => {
  return {tabBarOptions};
};

// gets the current screen from navigation state
export const getActiveRouteName = (navigationState) => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.state && route.state.routes) {
    return getActiveRouteName(route.state);
  }
  return route.name;
};

export const setStatusBarColorAndroid = (color) => {
  if (OS.IsAndroid) {
    StatusBar.setBackgroundColor(color);
  }
};
