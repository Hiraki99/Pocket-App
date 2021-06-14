import React from 'react';
import {connect} from 'react-redux';
import {TouchableOpacity, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {
  RowContainer,
  CommonHeader,
  FlexContainer,
  Text,
  SeparatorVertical,
  Logo,
} from '~/BaseComponent';
import {customNavigationOptions} from '~/navigation/navigationHelper';
import {colors, images} from '~/themes';
import {updateProfile} from '~/features/authentication/AuthenAction';
import {
  setStatusUserUpdateApp,
  checkVersionApp,
} from '~/features/config/ConfigAction';
import navigator from '~/navigation/customNavigator';
import {translate} from '~/utils/multilanguage';

class IntroduceScreen extends React.Component {
  static navigationOptions = customNavigationOptions;
  constructor(props) {
    super(props);
    this.state = {
      full_name: props.user.full_name || '',
      avatar: props.user.avatar,
    };
  }

  checkVersion = () => {
    const bundleId = DeviceInfo.getBundleId();
    const version = DeviceInfo.getVersion();
    this.props.setStatusUserUpdateApp(false);
    this.props.checkVersionApp({
      // bundleId: 'org.aic.group.englishforschool',
      bundleId,
      version,
      manually: true,
    });
  };

  render() {
    return (
      <>
        <CommonHeader title={`${translate('Thông tin ứng dụng')}`} themeWhite />
        <FlexContainer paddingTop={2}>
          <FlexContainer
            backgroundColor={colors.mainBgColor}
            paddingHorizontal={24}
            paddingVertical={16}>
            <View paddingVertical={32}>
              <Logo images={images.logoSimple} />
            </View>
            <View
              backgroundColor={colors.white}
              paddingHorizontal={16}
              borderRadius={8}>
              <SeparatorVertical sm />
              <RowContainer
                justifyContent={'space-between'}
                paddingVertical={16}>
                <Text fontSize={19}>Tổ chức</Text>
                <Text fontSize={19} color={colors.helpText} medium>
                  AIC
                </Text>
              </RowContainer>
              <SeparatorVertical backgroundColor={'rgba(52,67,86,0.3)'} />
              <RowContainer justifyContent={'space-between'}>
                <Text fontSize={19} paddingVertical={16}>
                  {`${translate('Phiên bản')}`}
                </Text>
                <Text
                  fontSize={19}
                  paddingVertical={16}
                  color={colors.helpText}
                  medium>
                  {DeviceInfo.getVersion()}
                </Text>
              </RowContainer>
              <SeparatorVertical backgroundColor={'rgba(52,67,86,0.3)'} />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  navigator.navigate('Privacy');
                }}>
                <RowContainer justifyContent={'space-between'}>
                  <Text fontSize={19} paddingVertical={16}>
                    {`${translate('Điều khoản bảo mật')}`}
                  </Text>
                  <AntDesign
                    size={20}
                    name="right"
                    color="rgba(52,67,86,0.3)"
                  />
                </RowContainer>
              </TouchableOpacity>
              <SeparatorVertical backgroundColor={'rgba(52,67,86,0.3)'} />
              <TouchableOpacity onPress={() => this.checkVersion()}>
                <RowContainer justifyContent={'space-between'}>
                  <Text fontSize={19} paddingVertical={16}>
                    {`${translate('Cập nhật ứng dụng')}`}
                  </Text>
                  <AntDesign
                    size={20}
                    name="right"
                    color="rgba(52,67,86,0.3)"
                  />
                </RowContainer>
              </TouchableOpacity>
              <SeparatorVertical sm />
            </View>
          </FlexContainer>
        </FlexContainer>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user || {},
    loadingUpdateProfile: state.auth.loadingUpdateProfile,
  };
};
export default connect(mapStateToProps, {
  updateProfile,
  setStatusUserUpdateApp,
  checkVersionApp,
})(IntroduceScreen);
