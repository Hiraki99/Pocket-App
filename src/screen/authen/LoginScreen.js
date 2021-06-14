import React from 'react';
import {connect} from 'react-redux';
import {
  Image,
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
  View,
  Alert,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Config from 'react-native-config';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {appleAuth} from '@invertase/react-native-apple-authentication';

import {
  Button,
  Text,
  GeneralStatusBar,
  NoFlexContainer,
  Input,
  FlexContainer,
  RowContainer,
} from '~/BaseComponent';
import {REGEX} from '~/constants/regex';
import {OS} from '~/constants/os';
import {
  login,
  refreshUser,
  clearForm,
  loginGGAction,
  loginAppleAction,
} from '~/features/authentication/AuthenAction';
import {translate} from '~/utils/multilanguage';
import {updateKeyboardHeight} from '~/features/config/ConfigAction';
import {images, colors} from '~/themes';
import navigator from '~/navigation/customNavigator';
import {changeCurrentCourse} from '~/features/course/CourseAction';

const {width} = Dimensions.get('window');

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  componentDidMount() {
    Keyboard.addListener('keyboardWillShow', (e) => {
      this.props.updateKeyboardHeight(e.endCoordinates.height);
    });
  }

  componentWillUnmount() {
    Keyboard.removeListener('keyboardWillShow');
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

  login = () => {
    const {email, password} = this.state;
    const {fcmToken} = this.props;
    if (!REGEX.MAIL.test(email.trim())) {
      Alert.alert(
        translate('Thông báo'),
        translate('Email chưa đúng định dạng'),
        [
          {
            text: translate('Đồng ý'),
            style: 'cancel',
          },
        ],
      );
      return;
    }
    if (email.trim().length === 0 || password.trim().length === 0) {
      Alert.alert(
        translate('Thông báo'),
        translate('Email hoặc mật khẩu không được bỏ trống'),
        [
          {
            text: translate('Đồng ý'),
            style: 'cancel',
          },
        ],
      );
      return;
    }
    this.props.login({
      email: email.trim(),
      password: password.trim(),
      notification_token: fcmToken,
    });
  };

  renderErrorMessage() {
    const {errorMessage} = this.props;

    return (
      <Text
        center
        style={{
          marginTop: 0,
          marginBottom: 10,
          color: colors.danger,
          opacity: 1,
        }}>
        {errorMessage}
      </Text>
    );
  }

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
    const {email, password} = this.state;
    return (
      <FlexContainer>
        <GeneralStatusBar backgroundColor={colors.mainBgColor} />
        <View style={styles.backgroundContainer}>
          <KeyboardAvoidingView behavior="position" keyboardVerticalOffset="50">
            <View
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingHorizontal: 24,
              }}>
              <NoFlexContainer
                justifyContent="center"
                alignItems="center"
                marginBottom={15}>
                <Image
                  source={images.logoSimple}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text h4 bold style={{marginTop: 8}}>
                  Đăng nhập
                </Text>
                <Text
                  center
                  style={{
                    marginTop: 0,
                    color: colors.helpText,
                    opacity: 0.38,
                  }}>
                  {translate('Nhập thông tin để đăng nhập')}
                </Text>
                {this.props.errorMessage && this.renderErrorMessage()}
              </NoFlexContainer>
              <View
                backgroundColor={colors.white}
                style={{
                  borderRadius: 12,
                  backgroundColor: colors.white,
                  overflow: 'hidden',
                  width: '100%',
                }}>
                <Input
                  placeholder={translate('Địa chỉ email')}
                  value={email}
                  onChangeText={(text) => {
                    if (this.props.errorMessage) {
                      this.props.clearForm();
                    }
                    this.setState({email: text});
                  }}
                />
                <View
                  style={{height: 1, backgroundColor: colors.mainBgColor}}
                />
                <Input
                  placeholder={translate('Mật khẩu')}
                  value={password}
                  onChangeText={(text) => {
                    if (this.props.errorMessage) {
                      this.props.clearForm();
                    }
                    this.setState({password: text});
                  }}
                  secureTextEntry
                />
              </View>
              <View style={{height: 24}} />
              <Button
                large
                primary
                rounded
                block
                uppercase
                bold
                icon
                loading={this.props.loading}
                onPress={() => this.login()}>
                {translate('Đăng nhập')}
              </Button>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={this.signInGG}
                style={{marginVertical: 8}}
                justifyContent={'space-between'}>
                <RowContainer
                  justifyContent={'space-between'}
                  style={styles.socialBtn}
                  backgroundColor={colors.white}
                  borderRadius={15}
                  paddingHorizontal={16}
                  paddingVertical={12}>
                  <MaterialCommunityIcons
                    name={'gmail'}
                    color={colors.milanoRed}
                    size={24}
                  />
                  <FlexContainer>
                    <Text
                      fontSize={18}
                      color={colors.helpText}
                      center
                      medium
                      uppercase>
                      {translate('Đăng nhập qua Google')}
                    </Text>
                  </FlexContainer>
                </RowContainer>
              </TouchableOpacity>
              {!OS.IsAndroid && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  justifyContent={'space-between'}
                  onPress={this.signInApple}>
                  <RowContainer
                    backgroundColor={colors.black}
                    style={styles.socialBtn}
                    borderRadius={15}
                    paddingVertical={12}
                    paddingHorizontal={16}>
                    <MaterialCommunityIcons
                      name={'apple'}
                      color={colors.white}
                      size={22}
                    />
                    <FlexContainer>
                      <Text
                        h5
                        color={colors.white}
                        fontSize={18}
                        center
                        medium
                        uppercase>
                        {translate('Đăng nhập qua Apple')}
                      </Text>
                    </FlexContainer>
                  </RowContainer>
                </TouchableOpacity>
              )}
              <Text h5 style={{color: colors.helpText, marginTop: 36}} center>
                Bạn chưa có tài khoản?
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  navigator.navigate('Register');
                  // this.props.refreshUser();
                }}>
                <Text
                  center
                  uppercase
                  h5
                  bold
                  style={{
                    marginBottom: 25,
                    color: colors.denim,
                    marginTop: 5,
                  }}>
                  Đăng ký
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>

          <View style={{paddingHorizontal: 24, marginBottom: 12}}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigator.navigate('Privacy')}>
              <Text
                center
                style={{
                  marginTop: 10,
                  color: colors.interactionText,
                  paddingBottom: 48,
                }}
                info>
                {translate('Bằng việc đăng nhập bạn đã đồng ý với &nbsp;')}
                <Text color={colors.normalText}>
                  {translate('Quy định bảo mật ứng dụng')}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </FlexContainer>
    );
  }
}

const styles = StyleSheet.create({
  logo: {width: 98, height: 63},
  bodyWrapper: {borderRadius: 8},
  backgroundContainer: {
    paddingTop: 80,
    flex: 1,
    height: '100%',
    backgroundColor: colors.mainBgColor,
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
});
const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    user: state.auth.user || {},
    isProfileLoaded: state.auth.isProfileLoaded,
    fcmToken: state.auth.fcmToken,
    errorMessage: state.auth.errorMessage,
    // currentCourse: state.course.currentCourse,
  };
};
export default connect(mapStateToProps, {
  login,
  refreshUser,
  clearForm,
  updateKeyboardHeight,
  changeCurrentCourse,
  loginGGAction,
  loginAppleAction,
})(LoginScreen);
