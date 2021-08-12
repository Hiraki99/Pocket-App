import React from 'react';
import {connect} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {View, StyleSheet, Alert, TouchableNativeFeedback} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {changePassword} from '~/features/authentication/AuthenAction';
import {
  Button,
  RowContainer,
  Text,
  BlankHeader,
  FlexContainer,
  Input,
} from '~/BaseComponent';
import {customNavigationOptions} from '~/navigation/navigationHelper';
import {colors} from '~/themes';
import navigator from '~/navigation/customNavigator';
import {translate} from '~/utils/multilanguage';

class ChangePasswordScreen extends React.Component {
  static navigationOptions = customNavigationOptions;
  constructor(props) {
    super(props);
    this.state = {
      old_password: null,
      new_password: null,
    };
  }

  changePassword = () => {
    const {old_password, new_password} = this.state;
    if (old_password.length < 6 && new_password.length < 6) {
      Alert.alert(translate('Thông báo'), translate('Mật khẩu không hợp lệ'), [
        {
          text: translate('Đồng ý'),
        },
      ]);
      return;
    }
    this.props.changePassword({
      old_password,
      new_password,
    });
  };

  render() {
    return (
      <FlexContainer backgroundColor={colors.white}>
        <BlankHeader />
        <RowContainer style={{width: '100%'}}>
          <TouchableNativeFeedback
            onPress={() => {
              navigator.goBack();
            }}>
            <RowContainer
              paddingLeft={16}
              paddingRight={24}
              paddingVertical={4}>
              <Ionicons name="md-arrow-back" size={24} />
            </RowContainer>
          </TouchableNativeFeedback>
        </RowContainer>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
          <View style={styles.container}>
            <RowContainer justifyContent={'center'}>
              <Text h5 bold>
                {translate('Đổi mật khẩu')}
              </Text>
            </RowContainer>
            <FlexContainer paddingHorizontal={24} paddingVertical={36}>
              <Input
                placeholder={translate('Mật khẩu cũ')}
                value={this.state.old_password}
                secureTextEntry
                onChangeText={(text) => {
                  this.setState({old_password: text});
                }}
                passwordIcon
                containerStyle={styles.inputContainerStyle}
              />
              <Input
                placeholder={translate('Mật khẩu mới')}
                value={this.state.new_password}
                secureTextEntry
                onChangeText={(text) => {
                  this.setState({new_password: text});
                }}
                passwordIcon
                containerStyle={[
                  styles.inputContainerStyle,
                  {marginBottom: 36},
                ]}
              />
              <Button
                large
                primary
                rounded
                block
                icon
                loading={this.props.loading}
                onPress={this.changePassword}>
                {translate('Lưu lại')}
              </Button>
              <TouchableNativeFeedback
                onPress={() => {
                  navigator.goBack();
                }}>
                <Text h5 color={colors.hoverText} center paddingVertical={16}>
                  {translate('Hủy')}
                </Text>
              </TouchableNativeFeedback>
            </FlexContainer>
          </View>
        </KeyboardAwareScrollView>
      </FlexContainer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user || {},
    loadingUpdateProfile: state.auth.loadingUpdateProfile,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 16,
    backgroundColor: colors.white,
  },
  cardContainer: {
    backgroundColor: '#fff',
    marginTop: 36,
    marginBottom: 36,
  },
  containerFirst: {
    marginHorizontal: 30,
    paddingTop: 16,
    paddingBottom: 36,
  },
  title: {width: 53},
  textInput: {
    flex: 1,
    textAlignVertical: 'top',
    borderColor: null,
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  inputContainerStyle: {
    backgroundColor: '#F5F6F9',
    borderRadius: 50,
    paddingLeft: 18,
    paddingRight: 16,
    marginBottom: 12,
  },
});
export default connect(mapStateToProps, {changePassword})(ChangePasswordScreen);
