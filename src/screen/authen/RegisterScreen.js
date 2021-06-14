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

import {
  Button,
  Text,
  GeneralStatusBar,
  NoFlexContainer,
  Loading,
  SeparatorVertical,
  Input,
} from '~/BaseComponent';
import {REGEX} from '~/constants/regex';
import {updateKeyboardHeight} from '~/features/config/ConfigAction';
import {
  register,
  refreshUser,
  clearForm,
} from '~/features/authentication/AuthenAction';
import {images, colors} from '~/themes';
import navigator from '~/navigation/customNavigator';
import {translate} from '~/utils/multilanguage';
const {width} = Dimensions.get('window');

class RegisterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      full_name: '',
    };
  }

  componentDidMount() {
    this.props.refreshUser();
    Keyboard.addListener('keyboardWillShow', (e) => {
      this.props.updateKeyboardHeight(e.endCoordinates.height);
    });
  }

  componentWillUnmount() {
    Keyboard.removeListener('keyboardWillShow');
  }

  register = () => {
    const {email, password, fullname} = this.state;
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
    if (!REGEX.PASSWORD.test(password.trim())) {
      Alert.alert(
        translate('Thông báo'),
        translate(
          'Mật khẩu không đúng định dạng. \n Mật khẩu phải bao gồm chữ hoa, chữ thường, số, kí tự đặc biệt và tối thiểu 8 kí tự và không quá 32 kí tự.',
        ),
        [
          {
            text: translate('Đồng ý'),
            style: 'cancel',
          },
        ],
      );
      return;
    }
    if (
      email.trim().length === 0 ||
      password.trim().length === 0 ||
      fullname.trim().length === 0
    ) {
      Alert.alert(
        translate('Thông báo'),
        translate('Bạn chưa điền đủ thông tin, mời thử lại'),
        [
          {
            text: translate('Đồng ý'),
            style: 'cancel',
          },
        ],
      );
      return;
    }

    this.props.register({
      email: email.trim(),
      password: password.trim(),
      full_name: fullname.trim(),
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

  renderLoading() {
    return (
      <Loading
        style={styles.behind}
        loadingText={translate('Đang tạo tài khoản')}
      />
    );
  }

  render() {
    const {email, password} = this.state;
    return (
      <>
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
                  {translate('Tạo tài khoản')}
                </Text>
                <Text
                  center
                  style={{
                    marginTop: 0,
                    color: colors.helpText,
                    opacity: 0.38,
                  }}>
                  {translate('Nhập thông tin bắt đầu')}
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
                  placeholder={translate('Họ và tên')}
                  value={this.state.fullname}
                  onChangeText={(text) => {
                    if (this.props.errorMessage) {
                      this.props.clearForm();
                    }
                    this.setState({fullname: text});
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
              <SeparatorVertical lg />
              <Button
                large
                primary
                rounded
                block
                uppercase
                bold
                icon
                loading={this.props.loading}
                onPress={() => this.register()}>
                {translate('Đăng ký')}
              </Button>

              <Text h5 style={{color: colors.helpText, marginTop: 36}} center>
                {translate('Bạn đã có tài khoản rồi?')}
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigator.navigate('Login')}>
                <Text
                  center
                  uppercase
                  h5
                  bold
                  style={{
                    marginBottom: 25,
                    color: colors.primary_overlay,
                    marginTop: 5,
                  }}>
                  {translate('Đăng nhập')}
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
        {this.props.loading && this.renderLoading()}
      </>
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
    position: 'relative',
    zIndex: 1,
    justifyContent: 'space-between',
  },
  shadowInput: {
    shadowColor: 'rgb(60,128,209)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.09,
    shadowRadius: 1.5,
    borderWidth: 0,
    borderRadius: 0,
    // elevation: 3,
  },
  socialBtn: {
    width: (width - 48 * 2 - 40) / 2,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    height: 100,
    justifyContent: 'center',
    zIndex: 1,
  },
  behind: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: -20,
    width: '100%',
    height: '100%',
    opacity: 0.8,
    zIndex: 100,
    backgroundColor: 'black',
  },
});

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    isProfileLoaded: state.auth.isProfileLoaded,
    fcmToken: state.auth.fcmToken,
    errorMessage: state.auth.errorMessage,
  };
};
export default connect(mapStateToProps, {
  register,
  refreshUser,
  clearForm,
  updateKeyboardHeight,
})(RegisterScreen);
