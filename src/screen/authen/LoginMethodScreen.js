import React from 'react';
import {connect} from 'react-redux';
import {
  Image,
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import Config from 'react-native-config';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import Swiper from 'react-native-swiper';

import {
  Button,
  Text,
  GeneralStatusBar,
  FlexContainer,
  NoFlexContainer,
  SeparatorVertical,
  RowContainer,
} from '~/BaseComponent';
import {OS} from '~/constants/os';
import {
  loginGGAction,
  loginAppleAction,
} from '~/features/authentication/AuthenAction';
import {translate} from '~/utils/multilanguage';
import {images, colors} from '~/themes';
import navigator from '~/navigation/customNavigator';
import {changeCurrentCourse} from '~/features/course/CourseAction';

const {width} = Dimensions.get('window');

class LoginMethodScreen extends React.PureComponent {
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

  login = () => {
    navigator.navigate('Login');
  };

  signInGG = async () => {
    try {
      await GoogleSignin.configure({
        webClientId: Config.WEB_GG_ID,
      });
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const token = await GoogleSignin.getTokens();
      // console.log('token ', token);
      this.props.loginGGAction({
        id_token: token.idToken,
        // fcm_token: this.props.fcmToken,
      });
    } catch (error) {
      // Alert.alert('error ', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  signInApple = async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
      this.props.loginAppleAction({
        id_token: appleAuthRequestResponse.identityToken,
        type: 'by_mobile',
      });
    }
  };

  render() {
    return (
      <FlexContainer>
        <GeneralStatusBar backgroundColor={colors.white} />
        <View style={styles.backgroundContainer}>
          <FlexContainer>
            <Swiper
              dot={<View style={styles.dot} />}
              activeDot={<View style={styles.dotActive} />}
              // containerStyle={{height: 'auto'}}
              loop={false}>
              <NoFlexContainer style={styles.container}>
                <Image
                  source={images.onBoard.onBoard_1}
                  style={styles.image}
                  resizeMode="contain"
                />
                <Text h4 bold center color={'#1F2631'}>
                  {translate('Tiếng anh bỏ túi cho tất cả mọi người phan 2')}
                </Text>
              </NoFlexContainer>

              <NoFlexContainer style={styles.container}>
                <Image
                  source={images.onBoard.onBoard_2}
                  style={styles.image}
                  resizeMode="contain"
                />

                <Text h3 bold center color="#1F2631">
                  {translate('Nhẹ nhàng mà điểm cao')}
                </Text>
              </NoFlexContainer>

              <NoFlexContainer style={styles.container}>
                <Image
                  source={images.onBoard.onBoard_3}
                  style={styles.image}
                  resizeMode="contain"
                />
                <Text h3 bold center color="#1F2631">
                  {translate('Tiếng Anh là chuyện nhỏ')}
                </Text>
              </NoFlexContainer>
            </Swiper>
          </FlexContainer>
          <FlexContainer>
            <View style={styles.bottomContainer}>
              <NoFlexContainer justifyContent={'flex-end'}>
                <Button
                  large
                  primary
                  rounded
                  block
                  icon
                  loading={this.props.loading}
                  onPress={() => this.login()}>
                  {translate('Đăng nhập với email')}
                </Button>
                <SeparatorVertical md />
                {/*<TouchableOpacity*/}
                {/*  style={[styles.containerLoginButton, styles.borderFacebook]}>*/}
                {/*  <RowContainer justifyContent={'center'} alignItems={'center'}>*/}
                {/*    <Image*/}
                {/*      resizeMode={'contain'}*/}
                {/*      source={images.social.facebook}*/}
                {/*      style={{width: 24, height: 24, marginRight: 12}}*/}
                {/*    />*/}
                {/*    <Text h5 color={colors.facebook}>*/}
                {/*      {translate('Đăng nhập với facebook')}*/}
                {/*    </Text>*/}
                {/*  </RowContainer>*/}
                {/*</TouchableOpacity>*/}
                {/*<SeparatorVertical md />*/}
                <TouchableOpacity
                  onPress={this.signInGG}
                  style={[styles.containerLoginButton, styles.borderGoogle]}>
                  <RowContainer justifyContent={'center'} alignItems={'center'}>
                    <Image
                      resizeMode={'contain'}
                      source={images.social.google}
                      style={{width: 24, height: 24, marginRight: 12}}
                    />
                    <Text h5 color={colors.danger}>
                      {translate('Đăng nhập với google')}
                    </Text>
                  </RowContainer>
                </TouchableOpacity>
                <SeparatorVertical md />
                {!OS.IsAndroid && (
                  <TouchableOpacity
                    onPress={this.signInApple}
                    style={[styles.containerLoginButton, styles.borderApple]}>
                    <RowContainer
                      justifyContent={'center'}
                      alignItems={'center'}>
                      <AntDesign
                        color={colors.black}
                        name={'apple1'}
                        size={24}
                        style={{marginRight: 12}}
                      />
                      <Text h5 color={colors.black}>
                        {translate('Đăng nhập với apple')}
                      </Text>
                    </RowContainer>
                  </TouchableOpacity>
                )}

                <SeparatorVertical md />
              </NoFlexContainer>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.containerRegisterButton}
                onPress={() => {
                  navigator.navigate('Register');
                }}>
                <Text h5 style={{color: colors.helpText}} center>
                  Bạn chưa có tài khoản?
                </Text>
                <Text
                  center
                  uppercase
                  h5
                  bold
                  style={{
                    color: colors.primary,
                    marginTop: 5,
                  }}>
                  Đăng ký
                </Text>
              </TouchableOpacity>
            </View>
          </FlexContainer>
        </View>
      </FlexContainer>
    );
  }
}

const styles = StyleSheet.create({
  logo: {width: 70, height: 70},
  bodyWrapper: {borderRadius: 8},
  backgroundContainer: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  shadowInput: {
    shadowColor: 'rgb(60,128,209)',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 0,
  },
  socialBtn: {
    width: width - 48,
  },
  inputContainerStyle: {
    backgroundColor: '#F5F6F9',
    borderRadius: 50,
    paddingLeft: 18,
    paddingRight: 16,
    marginBottom: 12,
  },
  //
  dot: {
    backgroundColor: colors.primary,
    opacity: 0.3,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: OS.hasNotch ? 24 : 12,
    paddingBottom: OS.hasNotch ? 24 : 36,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    shadowColor: colors.black,
    shadowOffset: {
      width: 2,
      height: 12,
    },
    shadowOpacity: 0.09,
    shadowRadius: 40,
    elevation: 2,
  },
  icon: {paddingTop: 2, paddingRight: 10, opacity: 0.8},
  image: {
    width: OS.WIDTH * 0.8,
    height: OS.HEIGHT * 0.32,
  },
  container: {
    paddingHorizontal: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingRight: 15,
  },
  memo: {
    lineHeight: 22,
  },
  lastMemo: {
    marginBottom: 24,
  },
  containerLoginButton: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 50,
  },
  containerRegisterButton: {
    width: '100%',
    paddingVertical: 4,
    borderRadius: 50,
  },
  borderFacebook: {
    borderWidth: 1,
    borderColor: colors.facebook,
  },
  borderGoogle: {
    borderWidth: 1,
    borderColor: colors.danger,
  },
  borderApple: {
    borderWidth: 1,
    borderColor: colors.black,
  },
});
const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    user: state.auth.user || {},
    isProfileLoaded: state.auth.isProfileLoaded,
    fcmToken: state.auth.fcmToken,
    errorMessage: state.auth.errorMessage,
  };
};
export default connect(mapStateToProps, {
  changeCurrentCourse,
  loginGGAction,
  loginAppleAction,
})(LoginMethodScreen);
