import React, {useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  ImageBackground,
  StatusBar,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Button, FlexContainer, RowContainer, Text} from '~/BaseComponent';
import {fetchSectionByExam} from '~/features/exam/ExamAction';
import {colors, images} from '~/themes';
import {OS} from '~/constants/os';
import navigator from '~/navigation/customNavigator';
import {translate} from '~/utils/multilanguage';

const OnboardExamEngScreen = () => {
  const params = navigator.getParam('params', {});
  const dispatch = useDispatch();
  const infoExam = useSelector((state) => state.exam.introExam, {});

  useEffect(() => {
    if (params && params._id) {
      dispatch(
        fetchSectionByExam({
          id: params._id,
        }),
      );
    }
  }, [dispatch, params]);

  const renderTaging = useCallback(() => {
    return (
      <RowContainer>
        <Text fontSize={20} color={colors.white}>
          Tags:{'   '}
        </Text>
        <View
          style={{flexWrap: 'wrap', flexDirection: 'row'}}
          paddingVertical={24}>
          {(infoExam.tags || []).map((item) => {
            return (
              <Text
                key={item}
                accessibilityRole={'button'}
                accessible
                paddingRight={16}
                h5
                onPress={() => {
                  navigator.navigate('SearchExam', {tag: item});
                }}
                color={colors.white}>
                #{item}
              </Text>
            );
          })}
        </View>
      </RowContainer>
    );
  }, [infoExam]);

  return (
    <ImageBackground source={images.test_level} style={{flex: 1}}>
      <StatusBar barStyle={'light-content'} />
      <TouchableWithoutFeedback
        onPress={() => {
          navigator.goBack();
        }}>
        <Ionicons
          name="md-arrow-back"
          size={24}
          color={colors.white}
          style={{paddingTop: OS.headerHeight, paddingHorizontal: 24}}
        />
      </TouchableWithoutFeedback>
      <FlexContainer paddingHorizontal={40} paddingTop={60}>
        <Text fontSize={40} color={colors.white} bold accented>
          {infoExam.name || ''}
        </Text>
        <Text color={colors.white} opacity={0.6} paddingVertical={12}>
          {infoExam.description || ''}
        </Text>
        <RowContainer paddingBottom={48}>
          <View
            style={{
              backgroundColor: colors.primary_overlay,
              paddingHorizontal: 8,
              borderRadius: 8,
            }}>
            <Text fontSize={12} color={colors.white}>
              {`${infoExam ? infoExam.time || 60 : 0} phút`}
            </Text>
          </View>
          {!!infoExam.questionCount && (
            <View
              style={{
                backgroundColor: colors.primary_overlay,
                paddingHorizontal: 8,
                marginLeft: 4,
                borderRadius: 8,
              }}>
              <Text fontSize={12} color={colors.white}>
                {`${infoExam.questionCount} câu hỏi`}
              </Text>
            </View>
          )}
        </RowContainer>
        <Button
          white
          rounded
          large
          shadow={!OS.IsAndroid}
          icon
          uppercase
          bold
          onPress={() => {
            navigator.navigate('Instruction');
          }}>
          {`${translate('Tiếp tục')}`}
        </Button>
        {renderTaging()}
      </FlexContainer>
    </ImageBackground>
  );
};

export default OnboardExamEngScreen;
