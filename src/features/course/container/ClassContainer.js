import React, {useCallback, useState} from 'react';
import {Image, Alert} from 'react-native';
import {useDispatch} from 'react-redux';

import {
  Button,
  FlexContainer,
  NoFlexContainer,
  SeparatorVertical,
  STextInput,
  Text,
} from '~/BaseComponent';
import {colors, images} from '~/themes';
import courseApi from '~/features/course/CourseApi';
import navigator from '~/navigation/customNavigator';
import {joinClassInSchool} from '~/features/authentication/AuthenAction';
import {translate} from '~/utils/multilanguage';

const ClassContainer = () => {
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const joinClass = useCallback(() => {
    const callToServer = async () => {
      setLoading(true);
      const res = await courseApi.joinClass({class_code: text.trim()});
      setLoading(false);
      if (res.ok && res.data && res.data.data) {
        const {data} = res.data;
        dispatch(
          joinClassInSchool({
            class: data.class,
            school: data.school,
          }),
        );
        Alert.alert(
          translate('Thông báo'),
          translate('Bạn đã tham gia lớp thành công'),
          [
            {
              text: translate('Đồng ý'),
              onPress: () => navigator.navigate('MainStack'),
            },
          ],
        );
      } else {
        setError(true);
      }
    };
    if (!text) {
      Alert.alert(translate('Thông báo'), translate('Mời bạn điền mã lớp!'), [
        {
          text: translate('Đồng ý'),
        },
      ]);
      return;
    }
    callToServer();
  }, [text, dispatch]);

  const renderHeader = useCallback(() => {
    return (
      <NoFlexContainer
        justifyContent={'center'}
        alignItems={'center'}
        paddingHorizontal={24}>
        <Image
          source={images.classImage}
          style={{
            width: 100,
            height: 100,
            marginTop: 20,
          }}
        />
        <Text h2 color={colors.helpText} bold uppercase marginTop={-16}>
          {translate('Nhập mã truy cập')}
        </Text>
        {error ? (
          <Text
            color={colors.red_brick}
            center
            h5
            style={{paddingTop: 8, paddingBottom: 24}}>
            {translate(
              'Mã truy cập không đúng. Hãy nhập mã truy cập hợp lệ để bắt đầu…',
            )}
          </Text>
        ) : (
          <Text
            color="rgba(31,38,49,0.54)"
            center
            h5
            style={{paddingTop: 8, paddingBottom: 24}}>
            {translate(
              'Hiện bạn chưa thuộc một lớp nào . Hãy nhập mã truy cập hợp lệ để bắt đầu',
            )}
          </Text>
        )}
      </NoFlexContainer>
    );
  }, [error]);

  return (
    <FlexContainer
      backgroundColor={colors.mainBgColor}
      marginTop={2}
      paddingHorizontal={24}>
      {renderHeader()}
      <STextInput
        color={error ? colors.red_brick : colors.black}
        placeholder={translate('Nhập mã truy cập')}
        value={text}
        onChangeText={(val) => {
          setText(val);
          setError(false);
        }}
      />
      <SeparatorVertical lg />
      <Button
        large
        primary
        rounded
        block
        uppercase
        bold
        icon
        disabled={!text}
        loading={loading}
        onPress={joinClass}>
        {translate('Bắt đầu')}
      </Button>
    </FlexContainer>
  );
};

export default ClassContainer;
