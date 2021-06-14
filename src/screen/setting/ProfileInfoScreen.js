import React from 'react';
import {connect} from 'react-redux';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import ImagePicker from 'react-native-image-picker';
import {View, StyleSheet, Platform, Alert} from 'react-native';

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
import {updateProfile} from '~/features/authentication/AuthenAction';
const isAndroid = Platform.OS === 'android';
import navigator from '~/navigation/customNavigator';
import {translate} from '~/utils/multilanguage';

const options = {
  title: translate('Chọn ảnh đại diện'),
  takePhotoButtonTitle: translate('Chụp ảnh'),
  chooseFromLibraryButtonTitle: translate('Chọn ảnh từ thư viện'),
  cancelButtonTitle: translate('Hủy'),
  quality: 0.4,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

class ProfileInfoScreen extends React.Component {
  static navigationOptions = customNavigationOptions;
  constructor(props) {
    super(props);
    this.state = {
      full_name: props.user.full_name || '',
      avatar: props.user.avatar,
    };
  }

  chooseImage = async () => {
    let checkPermission;
    if (isAndroid) {
      const permissions = await check(PERMISSIONS.ANDROID.CAMERA);
      if (permissions !== RESULTS.GRANTED) {
        const requestC = await request(
          Platform.select({
            android: PERMISSIONS.ANDROID.CAMERA,
          }),
        );
        checkPermission = requestC === RESULTS.GRANTED;
      }
    } else {
      await check(PERMISSIONS.IOS.CAMERA);
      const requestCamera = await request(
        Platform.select({
          ios: PERMISSIONS.IOS.CAMERA,
        }),
      );
      await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      const requestPhoto = await request(
        Platform.select({
          ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
        }),
      );
      checkPermission =
        requestCamera === RESULTS.GRANTED && requestPhoto === RESULTS.GRANTED;
    }
    if (checkPermission) {
      ImagePicker.showImagePicker(options, (response) => {
        if (response.didCancel || response.error || response.customButton) {
          return;
        }
        console.log('Profile ', response);
        this.setState({
          avatar: isAndroid
            ? response.uri
            : response.uri.replace('file://', ''),
        });
      });
      return;
    }
    Alert.alert(
      translate('Thông báo'),
      translate(
        'Mời bạn vào cài đặt cấp quyền sử dụng camera và thư viện ảnh để cập nhập avatar',
      ),
      [
        {
          text: translate('Đồng ý'),
        },
      ],
    );
  };

  onUpdateProfile = () => {
    const {full_name, avatar} = this.state;
    if (full_name && full_name.trim().length === 0) {
      Alert.alert(translate('Thông báo'), translate('Bạn chưa nhập họ tên!'), [
        {
          text: translate('Đồng ý'),
        },
      ]);
      return;
    }
    this.props.updateProfile({
      avatar,
      full_name: full_name.trim(),
    });
    navigator.back();
  };

  render() {
    const {user, loadingUpdateProfile} = this.props;
    const {full_name, avatar} = this.state;

    return (
      <>
        <CommonHeader title={translate('Thông tin')} themeWhite />
        <View style={styles.container}>
          <Avatar uri={avatar} update onPress={this.chooseImage} />
          <View style={styles.containerFirst}>
            <Card style={styles.cardContainer}>
              <RowContainer
                paddingVertical={8}
                paddingHorizontal={16}
                justifyContent="space-between"
                alignItem="center">
                <Text h5 color={colors.helpText2} style={styles.title}>
                  {translate('Họ tên')}
                </Text>
                <STextInput
                  placeholder={translate('Họ tên')}
                  value={full_name}
                  onChangeText={(text) => this.setState({full_name: text})}
                  placeholderTextColor={colors.normalText}
                  textAlign={'right'}
                  allowFontScaling={false}
                  style={styles.textInput}
                />
              </RowContainer>
              <SeparatorVertical backgroundColor={colors.mainBgColor} />
              <RowContainer
                justifyContent="space-between"
                alignItem="center"
                paddingVertical={8}
                paddingHorizontal={16}>
                <Text h5 color={colors.helpText2} style={styles.title}>
                  {translate('Email')}
                </Text>
                <RowContainer style={{flex: 1}} justifyContent="flex-end">
                  <Text h5 bold paddingVertical={13} numberOfLines={1}>
                    {user.email}
                  </Text>
                </RowContainer>
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
              loading={loadingUpdateProfile}
              onPress={() => this.onUpdateProfile()}>
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
    user: state.auth.user || {},
    loadingUpdateProfile: state.auth.loadingUpdateProfile,
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
  title: {width: 53},
  textInput: {
    flex: 1,
    textAlignVertical: 'top',
    borderColor: null,
    borderWidth: 0,
    paddingHorizontal: 0,
  },
});
export default connect(mapStateToProps, {updateProfile})(ProfileInfoScreen);
