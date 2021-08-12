import React from 'react';
import {connect} from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  Alert,
  TouchableNativeFeedback,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  RowContainer,
  Text,
  Avatar,
  SeparatorVertical,
  BlankHeader,
  FlexContainer,
} from '~/BaseComponent';
import {logout} from '~/features/authentication/AuthenAction';
import {colors, images} from '~/themes';
import navigator from '~/navigation/customNavigator';
import {translate} from '~/utils/multilanguage';

class AccountScreen extends React.PureComponent {
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

  render() {
    const {user} = this.props;
    return (
      <FlexContainer backgroundColor={colors.white}>
        <BlankHeader color={colors.white} dark />
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
          <RowContainer>
            <Avatar uri={user.avatar} />
            <FlexContainer paddingHorizontal={12} paddingTop={8}>
              {user.full_name && (
                <Text h5 bold color={colors.helpText}>
                  {user.full_name}
                </Text>
              )}
              <Text h6 color={colors.helpText2} paddingVertical={6}>
                {user.email}
              </Text>
            </FlexContainer>
          </RowContainer>
        </RowContainer>
        <ScrollView
          showsVerticalScrollIndicator={false}
          backgroundColor={colors.white}
          style={{paddingHorizontal: 24}}>
          <SeparatorVertical sm />
          <TouchableNativeFeedback
            onPress={() => {
              navigator.navigate('InfoAccount');
            }}>
            <RowContainer style={styles.itemSetting}>
              <Image
                resizeMode={'contain'}
                source={images.icon_account.account}
                style={styles.imageIconSetting}
              />
              <Text h5>{translate('Tài khoản')}</Text>
            </RowContainer>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback>
            <RowContainer style={styles.itemSetting}>
              <Image
                resizeMode={'contain'}
                source={images.icon_account.video}
                style={styles.imageIconSetting}
              />
              <Text h5>{translate('Bài học')}</Text>
            </RowContainer>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback>
            <RowContainer style={styles.itemSetting}>
              <Image
                resizeMode={'contain'}
                source={images.icon_account.upgrade}
                style={styles.imageIconSetting}
              />
              <Text h5>{translate('Nâng cấp VIP')}</Text>
            </RowContainer>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback>
            <RowContainer style={styles.itemSetting}>
              <Image
                resizeMode={'contain'}
                source={images.icon_account.update}
                style={styles.imageIconSetting}
              />
              <Text h5>{translate('Cập nhật')}</Text>
            </RowContainer>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback>
            <RowContainer style={styles.itemSetting}>
              <Image
                resizeMode={'contain'}
                source={images.icon_account.setting}
                style={styles.imageIconSetting}
              />
              <Text h5>{translate('Cài đặt')}</Text>
            </RowContainer>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={this.logout}>
            <RowContainer style={styles.itemSetting}>
              <Image
                resizeMode={'contain'}
                source={images.icon_account.logout}
                style={styles.imageIconSetting}
              />
              <Text h5>{translate('Đăng xuất')}</Text>
            </RowContainer>
          </TouchableNativeFeedback>
        </ScrollView>
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
  container: {
    flex: 1,
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
  itemSetting: {
    borderBottomWidth: 1,
    borderBottomColor: colors.black_007,
    paddingVertical: 16,
  },
  imageIconSetting: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
});

export default connect(mapStateToProps, {logout})(AccountScreen);
