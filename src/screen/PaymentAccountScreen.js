import React from 'react';
import {connect} from 'react-redux';
import {
  FlatList,
  StyleSheet,
  Platform,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as RNIap from 'react-native-iap';

import {
  RowContainer,
  Text,
  SeparatorVertical,
  FlexContainer,
  CommonHeader,
  Button,
} from '~/BaseComponent';
import Option from '~/BaseComponent/components/base/Option';
import {OS} from '~/constants/os';
import {logout} from '~/features/authentication/AuthenAction';
import {colors} from '~/themes';

const productIds = Platform.select({
  ios: ['com.dolphin.pocketapp_100', 'com.dolphin.pocketapp_365'],
  android: ['com.dolphin.pocketapp_test7'],
});

class PaymentAccountScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      selected: null,
    };
  }
  async componentDidMount() {
    try {
      await RNIap.initConnection();
      await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      // Logger.printLog('connected', result);
    } catch (error) {
      // Logger.printLog(error.code, error.message);
      // trackError(error.message);
    }
    if (!OS.IsAndroid) {
      await RNIap.clearTransactionIOS();
    }

    this.purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async (purchase) => {
        console.log('purchase ', purchase);
        // Logger.printLog('purchase', JSON.stringify(purchase));
        Alert.alert('Thông báo', 'Thành công', [{text: 'Đồng ý'}]);
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          try {
            await RNIap.finishTransaction(purchase);
          } catch (receiptErr) {}
          // purchaseConfirmed(purchase);
        }
      },
    );

    this.purchaseErrorSubscription = RNIap.purchaseErrorListener((err) => {
      console.log('error ', err);
      // LoadingHolder.stop();
      // Logger.printLog('purchaseErrorListener', err);
      Alert.alert('Thông báo', 'Thất bại', [{text: 'Đồng ý'}]);
      if (err.code !== 'E_USER_CANCELLED') {
        // DropDownHolder.alert('error', 'Lỗi hệ thống, vui lòng thử lại sau');
        // DropDownHolder.alert('error', String(err.message), '');
      }

      // Alert.alert('purchase err', JSON.stringify(err));
    });
    console.log('productIds ', productIds);
    const products = await RNIap.getSubscriptions(productIds);
    this.setState({products});
  }

  componentWillUnmount() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
  }

  requestSubscription = async () => {
    // navigation.replace('PurchaseSuccess');
    // return;
    if (!this.state.selected?.productId) {
      return;
    }
    try {
      console.log('this.state.selected ', this.state.selected);
      await RNIap.requestSubscription(this.state.selected?.productId, false);
    } catch (err) {
      console.log('errr ', err);
    } finally {
    }
  };

  renderHeader = () => {
    return (
      <View paddingBottom={24}>
        <Text h4 center bold capitalize paddingVertical={16}>
          Trở thành VIP ngay
        </Text>
      </View>
    );
  };

  renderFooter = () => {
    return (
      <View paddingHorizontal={24}>
        <Text h5 center paddingVertical={8}>
          Khi tham gia, bạn đã đồng ý với điều khoản dịch vụ và chính sách bảo
          mật của chúng tôi
        </Text>
        <Button
          large
          primary
          rounded
          block
          uppercase
          bold
          icon
          onPress={this.requestSubscription}>
          Đăng ký
        </Button>
      </View>
    );
  };

  renderItems = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          this.setState({
            selected: item,
          });
        }}>
        <RowContainer
          marginHorizontal={24}
          paddingHorizontal={16}
          paddingVertical={8}
          style={{borderRadius: 16, borderWidth: 1}}>
          <Option
            selected={this.state.selected?.productId === item.productId}
          />
          <View paddingHorizontal={16}>
            <Text h5 medium paddingBottom={4}>
              {OS.IsAndroid ? item.description : item.title || 'Gói 1 năm'}
            </Text>
            <Text h5>{item.localizedPrice}</Text>
          </View>
        </RowContainer>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <FlexContainer backgroundColor={colors.mainBgColor} paddingBottom={24}>
        <CommonHeader themeWhite title={'Nâng cấp vip'} />
        <FlatList
          keyExtractor={(item) => item.productId}
          data={this.state.products}
          renderItem={this.renderItems}
          ListHeaderComponent={this.renderHeader}
          ItemSeparatorComponent={() => <SeparatorVertical md />}
        />
        {this.renderFooter()}
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

export default connect(mapStateToProps, {logout})(PaymentAccountScreen);
