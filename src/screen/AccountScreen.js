import React from 'react';
import {connect} from 'react-redux';
import {
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {
  Button,
  Card,
  NoFlexContainer,
  RowContainer,
  Text,
  Avatar,
  SeparatorVertical,
  BottomTabContainer,
  CommonHeader,
} from '~/BaseComponent';
import {customNavigationOptions} from '~/navigation/navigationHelper';
import {logout} from '~/features/authentication/AuthenAction';
import {colors} from '~/themes';
import navigator from '~/navigation/customNavigator';
import {translate} from '~/utils/multilanguage';

const filterButton = [`${translate('Hồ sơ')}`, `${translate('Thành tích')}`];

class AccountScreen extends React.PureComponent {
  static navigationOptions = customNavigationOptions;
  constructor(props) {
    super(props);
    this.state = {
      selected: filterButton[0],
    };
  }

  componentDidMount(): void {}

  logout = () => {
    const {fcmToken} = this.props;
    Alert.alert(
      `${translate('Thông báo')}`,
      `${translate('Bạn có muốn đăng xuất ra khỏi ứng dụng!')}`,
      [
        {
          text: `${translate('Đồng ý')}`,
          onPress: () => this.props.logout({fcmToken}),
        },
        {
          text: `${translate('Hủy')}`,
        },
      ],
    );
  };

  formAccount = () => {
    return (
      <Card style={styles.cardContainer}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigator.navigate('Profile')}>
          <RowContainer
            paddingVertical={16}
            paddingHorizontal={24}
            justifyContent="space-between"
            alignItem="center">
            <Text h5>{`${translate('Thông tin cá nhân')}`}</Text>
            <AntDesign size={20} name="right" color="rgba(52,67,86,0.3)" />
          </RowContainer>
        </TouchableOpacity>
        <SeparatorVertical backgroundColor={colors.mainBgColor} />
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigator.navigate('ChangePassword')}>
          <RowContainer
            justifyContent="space-between"
            alignItem="center"
            paddingVertical={16}
            paddingHorizontal={24}>
            <Text h5>{`${translate('Đổi mật khẩu')}`}</Text>
            <AntDesign size={20} name="right" color="rgba(52,67,86,0.3)" />
          </RowContainer>
        </TouchableOpacity>
        <SeparatorVertical backgroundColor={colors.mainBgColor} />
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigator.navigate('SelectSchool')}>
          <RowContainer
            justifyContent="space-between"
            alignItem="center"
            paddingVertical={16}
            paddingHorizontal={24}>
            <Text h5>{`${translate('Thay đổi trường học')}`}</Text>
            <AntDesign size={20} name="right" color="rgba(52,67,86,0.3)" />
          </RowContainer>
        </TouchableOpacity>
        <SeparatorVertical backgroundColor={colors.mainBgColor} />
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigator.navigate('Course')}>
          <RowContainer
            justifyContent="space-between"
            alignItem="center"
            paddingVertical={16}
            paddingHorizontal={24}>
            <Text h5>{`${translate('Thay đổi lớp học')}`}</Text>
            <AntDesign size={20} name="right" color="rgba(52,67,86,0.3)" />
          </RowContainer>
        </TouchableOpacity>
        <SeparatorVertical backgroundColor={colors.mainBgColor} />
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigator.navigate('SelectClass')}>
          <RowContainer
            justifyContent="space-between"
            alignItem="center"
            paddingVertical={16}
            paddingHorizontal={24}>
            <Text h5>{`${translate('Truy cập lớp học')}`}</Text>
            <AntDesign size={20} name="right" color="rgba(52,67,86,0.3)" />
          </RowContainer>
        </TouchableOpacity>
        <SeparatorVertical backgroundColor={colors.mainBgColor} />
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigator.navigate('ChangeLanguage')}>
          <RowContainer
            justifyContent="space-between"
            alignItem="center"
            paddingVertical={16}
            paddingHorizontal={24}>
            <Text h5>{`${translate('Ngôn ngữ')}`}</Text>
            <AntDesign size={20} name="right" color="rgba(52,67,86,0.3)" />
          </RowContainer>
        </TouchableOpacity>
        <SeparatorVertical backgroundColor={colors.mainBgColor} />
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigator.navigate('Introduce')}>
          <RowContainer
            justifyContent="space-between"
            alignItem="center"
            paddingVertical={16}
            paddingHorizontal={24}>
            <Text h5>{`${translate('Thông tin ứng dụng')}`}</Text>
            <AntDesign size={20} name="right" color="rgba(52,67,86,0.3)" />
          </RowContainer>
        </TouchableOpacity>
      </Card>
    );
  };

  render() {
    const {user} = this.props;
    return (
      <>
        <CommonHeader title={`${translate('Quản lý tài khoản')}`} themeWhite />
        <BottomTabContainer
          style={styles.container}
          backgroundColor={colors.mainBgColor}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={(ref) => {
              this.scrollView = ref;
            }}
            backgroundColor={colors.mainBgColor}>
            <SeparatorVertical md />
            <NoFlexContainer alignItems={'center'}>
              <Avatar uri={user.avatar} />
              {user.full_name && (
                <Text h4 bold color={colors.helpText} style={styles.name}>
                  {user.full_name}
                </Text>
              )}
              <Text h6 color={colors.helpText2} paddingVertical={4}>
                {user.email}
              </Text>
            </NoFlexContainer>
            <View style={styles.tabContainer}>{this.formAccount()}</View>
          </ScrollView>
          <View backgroundColor={colors.mainBgColor}>
            <Button
              large
              primary
              uppercase
              bold
              shadow={false}
              transparent
              onPress={() => this.logout()}>
              {`${translate('Đăng xuất')}`}
            </Button>
          </View>
        </BottomTabContainer>
      </>
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
  container: {
    flex: 1,
    // marginVertical: 16,
    // backgroundColor: 'red',
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
  tabContainer: {
    marginHorizontal: 30,
    paddingBottom: 36,
  },
  achievementsContainer: {
    backgroundColor: '#fff',
    marginTop: 16,
    marginBottom: 16,
    paddingVertical: 12,
  },
  iconBadge: {width: 30, height: 34, marginTop: 5},
  icon: {width: 34, height: 40, marginTop: 5},
  name: {paddingTop: 16, paddingBottom: 10},
  prevBtn: {
    position: 'absolute',
    left: 14,
    top: 90,
    width: 24,
    height: 24,
    borderRadius: 2,
    backgroundColor: colors.primary_overlay,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBtn: {
    position: 'absolute',
    right: 14,
    top: 90,
    width: 24,
    height: 24,
    borderRadius: 2,
    backgroundColor: colors.primary_overlay,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default connect(mapStateToProps, {logout})(AccountScreen);
