import React from 'react';
import {connect} from 'react-redux';
import {TouchableOpacity, View, Alert} from 'react-native';
import RNRestart from 'react-native-restart';

import {
  RowContainer,
  CommonHeader,
  FlexContainer,
  Text,
  SeparatorVertical,
  Logo,
  Option,
} from '~/BaseComponent';
import {colors, images} from '~/themes';
import {setLanguageApp} from '~/features/config/ConfigAction';
import {setI18nConfig, translate} from '~/utils/multilanguage';

class ChangeLanguageScreen extends React.Component {
  changeLanguage = (value) => {
    const {language} = this.props;
    if (language === value) {
      return;
    }
    Alert.alert(
      `${translate('Thông báo')}`,
      `${translate('Bạn muốn đổi ngôn ngữ sang', {
        s1: language === 'vi' ? 'Tiếng Anh' : 'Vietnamese',
      })}`,
      [
        {
          text: translate('OK'),
          onPress: () => {
            this.props.setLanguageApp(value);
            setI18nConfig(value);
            setTimeout(() => {
              RNRestart.Restart();
            }, 500);
          },
        },
        {
          text: translate('Hủy'),
          onPress: () => {},
        },
      ],
    );
  };

  render() {
    const {language} = this.props;
    return (
      <>
        <CommonHeader title={translate('setting')} themeWhite />
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
              <TouchableOpacity
                onPress={() => {
                  this.changeLanguage('vi');
                }}>
                <RowContainer justifyContent={'space-between'}>
                  <Text fontSize={19} paddingVertical={16}>
                    {translate('Tiếng Việt')}
                  </Text>
                  <Option selected={language === 'vi'} />
                </RowContainer>
              </TouchableOpacity>
              <SeparatorVertical backgroundColor={'rgba(52,67,86,0.3)'} />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  this.changeLanguage('en');
                }}>
                <RowContainer justifyContent={'space-between'}>
                  <Text fontSize={19} paddingVertical={16}>
                    {translate('Tiếng Anh')}
                  </Text>
                  <Option selected={language === 'en'} />
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
    language: state.config.language,
  };
};
export default connect(mapStateToProps, {
  setLanguageApp,
})(ChangeLanguageScreen);
