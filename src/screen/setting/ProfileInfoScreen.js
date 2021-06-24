import React from 'react';
import {connect} from 'react-redux';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import ImagePicker from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  View,
  StyleSheet,
  Platform,
  Alert,
  TouchableNativeFeedback,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {
  Button,
  RowContainer,
  Text,
  Avatar,
  BlankHeader,
  FlexContainer,
  Input,
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
    const {avatar} = this.state;

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
        <KeyboardAwareScrollView>
          <View style={styles.container}>
            <RowContainer justifyContent={'center'}>
              <Avatar
                size={122}
                uri={avatar}
                update
                onPressAvatar={this.chooseImage}
              />
            </RowContainer>
            <FlexContainer paddingHorizontal={24} paddingVertical={36}>
              <Input
                placeholder={translate('Họ và tên')}
                value={this.state.full_name}
                accountIcon
                onChangeText={(text) => {
                  if (this.props.errorMessage) {
                    this.props.clearForm();
                  }
                  this.setState({full_name: text});
                }}
                containerStyle={styles.inputContainerStyle}
              />
              <Input
                enableEdit={false}
                placeholder={translate('Địa chỉ email')}
                value={this.props.user.email}
                emailIcon
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
                onPress={this.onUpdateProfile}>
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
export default connect(mapStateToProps, {updateProfile})(ProfileInfoScreen);
