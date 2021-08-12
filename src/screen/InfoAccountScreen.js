import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, TouchableNativeFeedback} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  RowContainer,
  Text,
  Avatar,
  BlankHeader,
  FlexContainer,
} from '~/BaseComponent';
import {OS} from '~/constants/os';
import {translate} from '~/utils/multilanguage';
import {logout} from '~/features/authentication/AuthenAction';
import {colors} from '~/themes';
import navigator from '~/navigation/customNavigator';

class InfoAccountScreen extends React.PureComponent {
  render() {
    const {user} = this.props;
    return (
      <FlexContainer backgroundColor={colors.backgroundActivity}>
        <BlankHeader color={colors.backgroundActivity} dark />
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
        <FlexContainer>
          <View style={styles.topContainer} />
          <View style={[styles.bottomContainer, styles.shadow]}>
            <FlexContainer style={styles.transform}>
              <View style={styles.profile}>
                <Avatar uri={user.avatar} size={122} />
                {user.full_name && (
                  <Text
                    h5
                    bold
                    color={colors.helpText}
                    paddingTop={16}
                    paddingBottom={4}>
                    {user.full_name}
                  </Text>
                )}
                <Text h6 color={colors.helpText2} paddingVertical={6}>
                  {user.email}
                </Text>
              </View>
              <FlexContainer paddingVertical={16}>
                <TouchableNativeFeedback
                  onPress={() => {
                    navigator.navigate('Profile');
                  }}>
                  <RowContainer
                    paddingHorizontal={16}
                    paddingVertical={12}
                    backgroundColor={'white'}
                    style={[styles.shadow, {borderRadius: 16}]}>
                    <View
                      style={[
                        styles.icon,
                        {
                          backgroundColor: colors.facebook,
                        },
                        styles.profile,
                      ]}>
                      <MaterialCommunityIcons
                        color={colors.white}
                        name={'account'}
                        size={24}
                      />
                    </View>
                    <View style={{paddingLeft: 12}}>
                      <Text
                        fontSize={14}
                        accented
                        medium
                        color={colors.helpText}
                        paddingBottom={4}>
                        {translate('Thông tin cá nhân')}
                      </Text>
                      <Text fontSize={12} accented color={colors.helpText2}>
                        {translate('Họ tên - Email')}
                      </Text>
                    </View>
                  </RowContainer>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback
                  onPress={() => {
                    navigator.navigate('ChangePassword');
                  }}>
                  <RowContainer
                    paddingHorizontal={16}
                    paddingVertical={12}
                    backgroundColor={'white'}
                    style={[styles.shadow, {borderRadius: 16, marginTop: 12}]}>
                    <View
                      style={[
                        styles.icon,
                        {
                          backgroundColor: colors.purple,
                        },
                        styles.profile,
                      ]}>
                      <Ionicons
                        color={colors.white}
                        name={'ios-key'}
                        size={20}
                      />
                    </View>
                    <View style={{paddingLeft: 12}}>
                      <Text
                        fontSize={14}
                        accented
                        medium
                        color={colors.helpText}
                        paddingBottom={4}>
                        {translate('Mật khẩu')}
                      </Text>
                      <Text fontSize={12} accented color={colors.helpText2}>
                        {translate('Đổi mật khẩu')}
                      </Text>
                    </View>
                  </RowContainer>
                </TouchableNativeFeedback>
              </FlexContainer>
            </FlexContainer>
          </View>
        </FlexContainer>
      </FlexContainer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user || {},
    fcmToken: state.auth.fcmToken,
  };
};

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
  },
  bottomContainer: {
    flex: 8,
    paddingTop: 24,
    paddingBottom: OS.hasNotch ? 24 : 36,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
  },
  shadow: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 2,
      height: 12,
    },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 2,
  },
  profile: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  transform: {
    transform: [{translateY: -81}],
  },
  icon: {width: 32, height: 32, borderRadius: 16},
});

export default connect(mapStateToProps, {logout})(InfoAccountScreen);
