import React from 'react';
import {connect} from 'react-redux';
import {View, Image, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {OS} from '~/constants/os';
import {colors, images} from '~/themes';
import {configApi} from '~/utils/apisaure';
import {fetchMe} from '~/features/authentication/AuthenAction';
import {fetchListNotificationAction} from '~/features/notification/NotificationAction';
import {changeCurrentCourse} from '~/features/course/CourseAction';
import navigator from '~/navigation/customNavigator';
import {FIRST_PAGE, PAGE_SIZE} from '~/constants/query';

class SplashScreen extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    StatusBar.setBarStyle('light-content');
    if (OS.IsAndroid) {
      StatusBar.setBackgroundColor(colors.primary);
    }
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      configApi(token);
      this.props.fetchMe();
      this.props.fetchListNotificationAction({
        page: FIRST_PAGE,
        length: PAGE_SIZE,
      });
    } else {
      configApi(null);
      const firstUseApp = await AsyncStorage.getItem('firstUseApp');
      if (firstUseApp) {
        navigator.reset('AuthStack');
      } else {
        navigator.reset('OnBoarding');
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isProfileLoaded && this.props.isProfileLoaded) {
      const {current_course_obj} = this.props.user;
      if (current_course_obj) {
        this.props.changeCurrentCourse(current_course_obj);
        navigator.reset('MainStack');
      } else {
        navigator.navigate('Course');
      }
    }
  }

  render() {
    return (
      <View style={styles.wrap}>
        <View style={styles.mainContent}>
          <Image
            source={images.logoSimple}
            style={styles.img}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  }
}

const styles = {
  wrap: {
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 164,
    height: 132,
  },
};

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    user: state.auth.user || {},
    isProfileLoaded: state.auth.isProfileLoaded,
    loadProfileError: state.auth.loadProfileError,
    currentCourse: state.course.currentCourse,
  };
};

const mapDispatchToProps = {
  fetchMe,
  changeCurrentCourse,
  fetchListNotificationAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
