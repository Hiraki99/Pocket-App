import React, {useCallback, useEffect} from 'react';
import LottieView from 'lottie-react-native';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import {FlatList, Image, TouchableOpacity} from 'react-native';

import {
  FlexContainer,
  NoFlexContainer,
  RowContainer,
  SeparatorVertical,
  Text,
  ThumbnailVideo,
} from '~/BaseComponent';
import {fetchTeachingCategory} from '~/features/lessons/LessonAction';
import {colors, images} from '~/themes';
import {OS} from '~/constants/os';
import {teachingCategory} from '~/constants/demo';
import navigator from '~/navigation/customNavigator';
import {FIRST_PAGE, PAGE_SIZE} from '~/constants/query';
import {translate} from '~/utils/multilanguage';

const TeachContainer = () => {
  const dispatch = useDispatch();
  const teachCategory = useSelector(
    (state) => state.lesson.teachLessons,
    shallowEqual,
  );

  useEffect(() => {
    dispatch(fetchTeachingCategory({page: FIRST_PAGE, length: PAGE_SIZE}));
  }, [dispatch]);

  const renderHeaderSpeak = useCallback(() => {
    return (
      <>
        <NoFlexContainer
          justifyContent={'center'}
          alignItems={'center'}
          paddingVertical={32}>
          <Text h2 uppercase bold>
            {`${translate('Dạy tiếng anh')}`}
          </Text>
          <Text color="rgba(31,38,49,0.54)" paddingTop={4} paddingBottom={24}>
            {`${translate('Khoá học về phương pháp dạy tiếng Anh')}`}
          </Text>
          <ThumbnailVideo
            attachment={{
              path: {
                id: null,
                start: 0,
                end: 0,
              },
            }}
            image={require('~/assets/images/demo/nghe-1.png')}
            attachmentWidth={OS.WIDTH - 48}
            border
          />
        </NoFlexContainer>
        <>
          <Text h3 bold paddingBottom={16}>
            {`${translate('Giới thiệu')}`}
          </Text>
          <Text fontSize={14} color={colors.helpText}>
            {translate(
              'Chương trình sẽ hướng dẫn chi tiết các bước giảng dạy các kĩ năng tiếng Anh ở trên lớp như: phát âm, nghe, nói, đọc, viết,… đặc biệt là ứng dụng công nghệ media vào việc giảng dạy tiếng Anh',
            )}
          </Text>
        </>
        <SeparatorVertical lg />
        <NoFlexContainer
          backgroundColor={colors.white}
          paddingHorizontal={24}
          paddingVertical={20}
          style={{
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#F3F5F9',
          }}>
          <Text fontSize={14} color={'rgba(31, 38, 49, 0.38)'}>
            {`${translate('33 tiết học')}`}
          </Text>
          <Text uppercase primary bold fontSize={19}>
            {`${translate('Mục lục')}`}
          </Text>
          <Image
            source={images.bookmark}
            style={{
              position: 'absolute',
              top: -17,
              width: 54,
              height: 90,
              right: 0,
            }}
          />
        </NoFlexContainer>
      </>
    );
  }, []);

  const renderItemSpeak = useCallback(({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          navigator.navigate('TeachingSectionDetail', {params: item});
        }}>
        <RowContainer
          backgroundColor={colors.white}
          paddingVertical={20}
          justifyContent={'space-between'}
          style={[
            index === teachingCategory.length - 1
              ? {borderBottomRightRadius: 16, borderBottomLeftRadius: 16}
              : {},
            {paddingLeft: 24, paddingRight: 12},
          ]}>
          <NoFlexContainer>
            <Text h5 bold color={colors.helpText}>
              {item.name}
            </Text>
            <Text fontSize={14} color={'rgba(31, 38, 49, 0.38)'}>
              {item.subTitle}
            </Text>
          </NoFlexContainer>
          {index < 2 ? (
            <LottieView
              autoPlay
              loop={false}
              source={require('~/assets/animate/check_animation')}
              style={{width: 42, marginLeft: 4}}
            />
          ) : (
            <Feather
              name={'chevron-right'}
              size={24}
              color={'rgba(52,67,86,0.3)'}
            />
          )}
        </RowContainer>
      </TouchableOpacity>
    );
  }, []);

  const renderEmptyList = useCallback(() => {
    return (
      <RowContainer
        paddingHorizontal={24}
        paddingVertical={8}
        backgroundColor={colors.white}
        justifyContent={'center'}
        style={{borderRadius: 24, width: OS.WIDTH - 48}}>
        <Text h5 center accented>
          {`${translate('Chưa có bài học cho khóa này')}`}
        </Text>
      </RowContainer>
    );
  }, []);

  return (
    <FlexContainer>
      <FlatList
        data={teachCategory}
        keyExtractor={(item, index) => `${item._id}_${index}`}
        ListHeaderComponent={renderHeaderSpeak}
        ListEmptyComponent={renderEmptyList}
        renderItem={renderItemSpeak}
        style={{paddingHorizontal: 24}}
        ItemSeparatorComponent={() => <SeparatorVertical />}
        ListFooterComponent={() => <SeparatorVertical lg />}
        showsVerticalScrollIndicator={false}
      />
    </FlexContainer>
  );
};

export default TeachContainer;
