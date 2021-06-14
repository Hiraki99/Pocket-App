import React, {useCallback} from 'react';
import {connect} from 'react-redux';
import {View, ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';

import {Button, NoFlexContainer, Text} from '~/BaseComponent/index';
import {retryActionError} from '~/features/authentication/AuthenAction';
import {colors, images} from '~/themes';
import {OS} from '~/constants/os';
import {translate} from '~/utils/multilanguage';

const Error404Screen = (props) => {
  const retry = useCallback(() => {
    if (
      !props.actionError ||
      (Object.keys(props.actionError).length === 0 &&
        props.actionError.constructor === Object)
    ) {
      return;
    }
    props.retryActionError(props.actionError);
  }, [props]);

  return (
    <>
      {props.loading && (
        <View
          style={{
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0, 0.3)',
            zIndex: 1,
          }}>
          <ActivityIndicator size={'large'} color={colors.white} />
        </View>
      )}

      <NoFlexContainer
        style={{flex: 1}}
        backgroundColor={colors.mainBgColor}
        justifyContent={'center'}
        alignItems={'center'}>
        <View>
          <FastImage
            resizeMode={'contain'}
            source={images.error404}
            style={{height: 200, width: OS.WIDTH}}
          />
          <View style={{marginHorizontal: 24}}>
            <Text
              h4
              accented
              center
              color={colors.helpText}
              bold
              style={{marginTop: 26}}>
              {`${translate('OOPS! LỖI MẠNG')}`}
            </Text>
            <Text
              center
              fontSize={14}
              color={colors.placeHolder}
              paddingVertical={16}>
              {translate(
                'Có lỗi trong quá trình tải nội dung. Xin lỗi bạn vì sự bất tiện này! Hãy bấm nút tải lại để thử thêm một lần nữa bạn nhé',
              )}
            </Text>
            <View paddingHorizontal={48} paddingVertical={24}>
              <Button
                large
                primary
                rounded
                block
                uppercase
                bold
                icon
                reloadIcon
                onPress={retry}>
                {`${translate('Tải lại')}`}
              </Button>
            </View>
          </View>
        </View>
      </NoFlexContainer>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    actionError: state.error.actionError,
    loading: state.error.loading,
  };
};
export default connect(mapStateToProps, {retryActionError})(Error404Screen);
