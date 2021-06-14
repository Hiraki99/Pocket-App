import React from 'react';
import {Alert, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Foundation';

import {
  MainContainer,
  STextInput,
} from '~/BaseComponent/components/base/CommonContainer';
import {Button, Card, CommonAlert, Logo, Text} from '~/BaseComponent';
import {colors} from '~/themes';
import {updateProfile} from '~/features/authentication/AuthenAction';
import navigator from '~/navigation/customNavigator';
import {translate} from '~/utils/multilanguage';

class UpdateUserFullNameScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fullName: '',
      show: false,
    };

    this.updateProfile = this.updateProfile.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if (
      !this.props.updateProfileErrorMessage &&
      nextProps.updateProfileErrorMessage
    ) {
      this.setState({show: true});
    }
    return true;
  }

  componentDidUpdate(prevProps) {
    if (
      (!prevProps.user && this.props.user && this.props.user.full_name) ||
      (this.props.user &&
        prevProps.user &&
        prevProps.user.full_name !== this.props.user.full_name)
    ) {
      if (this.props.user.is_vip) {
        if (this.props.user.type === 'demo') {
          navigator.navigate('UserDemoStack');
          return;
        }
        navigator.navigate('UserVipStack');
      } else {
        navigator.navigate('UserStack');
      }
    }
  }

  updateProfile() {
    const {fullName} = this.state;

    if (fullName.trim() !== '') {
      this.props.updateProfile({
        full_name: fullName,
      });
    } else {
      Alert.alert(
        translate('Thông báo'),
        translate('Bạn vui nhập tên trước khi bắt đầu nhé!'),
        [
          {
            text: translate('Đồng ý'),
          },
        ],
      );
    }
  }

  render() {
    const {fullName} = this.state;

    return (
      <MainContainer>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{marginBottom: 20}}>
          <Logo />
          <Card
            style={{paddingVertical: 20, marginTop: 20, paddingHorizontal: 20}}
            hasArrow={true}
            arrowTranslateX={0}>
            <Text center h4 bold color={colors.helpText}>
              {translate('Cám ơn bạn')}
            </Text>
            <Text center h5 color={colors.helpText}>
              {translate('Bạn có thể giới thiệu tên bạn được không?')}
            </Text>
          </Card>

          <Text
            center
            h4
            bold
            color={colors.helpText}
            style={{marginTop: 48, marginBottom: 8}}>
            {translate('Tên bạn là')}
          </Text>

          <STextInput
            placeholder={translate('Nhập tên của bạn...')}
            autoCapitalize="none"
            value={fullName}
            onChangeText={(text) => this.setState({fullName: text})}
            placeholderTextColor={colors.normalText}
            allowFontScaling={false}
            style={styles.shadowInput}
          />

          <Button
            large
            primary
            rounded
            block
            uppercase
            bold
            icon
            onPress={this.updateProfile}>
            {translate('Tiếp tục')}
          </Button>
        </ScrollView>

        <CommonAlert
          theme="danger"
          show={this.state.show}
          title={translate('Ôi không')}
          subtitle={translate('Có lỗi xảy ra, bạn thử lại sau nhé!')}
          headerIconComponent={<Icon name="alert" color="#fff" size={54} />}
          onRequestClose={() => {}}
          cancellable={false}>
          <Button danger onPress={() => this.setState({show: false})}>
            {translate('Đóng')}
          </Button>
        </CommonAlert>
      </MainContainer>
    );
  }
}

const styles = {
  shadowInput: {
    shadowColor: 'rgb(60,128,209)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.09,
    shadowRadius: 1.5,
    elevation: 3,
    marginBottom: 24,
  },
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    loadingUpdateProfile: state.auth.loadingUpdateProfile,
    updateProfileErrorMessage: state.auth.updateProfileErrorMessage,
  };
};

export default connect(mapStateToProps, {updateProfile})(
  UpdateUserFullNameScreen,
);
