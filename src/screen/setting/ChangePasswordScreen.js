import React from 'react';
import {connect} from 'react-redux';
import {View, Alert, StyleSheet} from 'react-native';

import {
  Button,
  Card,
  RowContainer,
  STextInput,
  Text,
  Avatar,
  CommonHeader,
  SeparatorVertical,
} from '~/BaseComponent';
import {customNavigationOptions} from '~/navigation/navigationHelper';
import {colors} from '~/themes';
import {changePassword} from '~/features/authentication/AuthenAction';
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
      Alert.alert(translate('Mật khẩu không hợp lệ'), [
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
    const {old_password, new_password} = this.state;
    const {user} = this.props;
    return (
      <>
        <CommonHeader title={translate('Đổi mật khẩu')} themeWhite />
        <View style={styles.container}>
          <Avatar uri={user.avatar} />
          <View style={styles.containerFirst}>
            <Card style={styles.cardContainer}>
              <RowContainer
                paddingVertical={8}
                paddingHorizontal={24}
                justifyContent="space-between"
                alignItem="center">
                <Text h5 color={colors.helpText2} style={styles.title}>
                  {translate('Mật khẩu cũ')}
                </Text>

                <STextInput
                  secureTextEntry
                  placeholder="_______"
                  textAlign={'right'}
                  value={old_password}
                  onChangeText={(pass) => this.setState({old_password: pass})}
                  placeholderTextColor={colors.helpText2}
                  allowFontScaling={false}
                  style={[styles.textInput]}
                />
              </RowContainer>
              <SeparatorVertical backgroundColor={colors.mainBgColor} />
              <RowContainer
                justifyContent="space-between"
                alignItem="center"
                paddingVertical={8}
                paddingHorizontal={24}>
                <Text h5 color={colors.helpText2} style={styles.title}>
                  {translate('Mật khẩu mới')}
                </Text>
                <STextInput
                  placeholder="_______"
                  secureTextEntry
                  value={new_password}
                  onChangeText={(newpass) =>
                    this.setState({new_password: newpass})
                  }
                  placeholderTextColor={colors.helpText2}
                  allowFontScaling={false}
                  textAlign={'right'}
                  style={[styles.textInput]}
                />
              </RowContainer>
            </Card>
            <Button
              large
              primary
              rounded
              block
              uppercase
              bold
              icon
              loading={this.props.loading}
              onPress={this.changePassword}>
              {translate('Đồng ý')}
            </Button>
          </View>
        </View>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    user: state.auth.user || {},
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 16,
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
  title: {width: 120},
  textInput: {
    flex: 1,
    // textAlignVertical: 'top',
    borderWidth: 0,
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
});
export default connect(mapStateToProps, {changePassword})(ChangePasswordScreen);
