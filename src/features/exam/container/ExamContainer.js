import React, {useMemo, useCallback, useState, useEffect} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {
  FlatList,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import HottestExam from '~/BaseComponent/components/elements/exam/HottestExam';
import {
  NoFlexContainer,
  Text,
  InputVocabulary,
  SeparatorVertical,
  SeparatorHorizontal,
  RowContainer,
} from '~/BaseComponent';
import {
  VocabularyTopicItem,
  VocabularyCard,
} from '~/BaseComponent/components/elements/vocabulary';
import {colors} from '~/themes';
import {OS} from '~/constants/os';
import navigator from '~/navigation/customNavigator';
import {
  fetchExamFeature,
  fetchCategoryExam,
  fetchEssayExamList,
} from '~/features/exam/ExamAction';
import {FIRST_PAGE, PAGE_SIZE} from '~/constants/query';
import {translate} from '~/utils/multilanguage';

const ExamContainer = () => {
  const refSearch = React.useRef(null);
  const dispatch = useDispatch();
  const examsAttention = useSelector(
    (state) => state.overviewExam.examsAttention,
    shallowEqual,
  );
  const categoriesExam = useSelector(
    (state) => state.overviewExam.categoriesExam,
    shallowEqual,
  );

  const categoryMostExam = useSelector(
    (state) => state.overviewExam.categoryMostExam,
    shallowEqual,
  );

  const [index, setIndex] = useState(0);

  useEffect(() => {
    // setTimeout(() => {
    //   setLoading(false);
    // }, 100);
    dispatch(fetchExamFeature({page: FIRST_PAGE, length: PAGE_SIZE}));
    // dispatch(fetchEssayExamList({page: FIRST_PAGE, length: PAGE_SIZE}));
    dispatch(fetchCategoryExam({page: FIRST_PAGE, length: PAGE_SIZE}));
  }, [dispatch]);

  const listCategory = useMemo(() => {
    const list = [];
    categoriesExam.forEach((item, index) => {
      if (index % 2 === 0) {
        const res = {
          key: item._id,
          first: item,
          second: categoriesExam[index + 1] || null,
        };
        list.push(res);
      }
    });
    return list;
  }, [categoriesExam]);

  const viewDetailTopic = useCallback((item) => {
    navigator.navigate('ExamCategory', {params: item});
  }, []);

  const viewLessonDetailVoByTopic = useCallback((item) => {
    if (item.type === 'essay_exam') {
      navigator.navigate('OnboardEssayExam', {params: item});
    } else {
      navigator.navigate('OnboardExamEng', {params: item});
    }
  }, []);

  const renderExamHottestItem = useCallback(({item}) => {
    return (
      <HottestExam
        image={item.featured_image}
        content={item.name}
        action={() => {
          navigator.navigate('OnboardExamEng', {params: item});
        }}
      />
    );
  }, []);

  const onSearch = useCallback(() => {
    navigator.navigate('SearchExam');
    refSearch.current.blur();
  }, []);

  const pagination = useCallback(() => {
    return (
      <Pagination
        dotsLength={examsAttention.length > 5 ? 5 : examsAttention.length}
        activeDotIndex={examsAttention.length > 5 ? index % 5 : index}
        containerStyle={{
          width: 10,
          paddingHorizontal: 10,
          paddingVertical: 10,
          alignSelf: 'center',
        }}
        dotStyle={{
          width: 12,
          height: 6,
          borderRadius: 3,
          backgroundColor: colors.primary,
        }}
        inactiveDotStyle={{
          width: 6,
          height: 6,
          borderRadius: 3,
        }}
        inactiveDotOpacity={0.7}
        inactiveDotScale={0.8}
      />
    );
  }, [index, examsAttention]);

  const renderTopicVocabularyItem = useCallback(
    ({item}) => {
      return (
        <NoFlexContainer>
          <VocabularyCard
            size="sm"
            image={item.first.featured_image}
            title={item.first.name}
            action={() => viewDetailTopic(item.first)}
          />
          {item.second && (
            <>
              <View style={{height: 2}} />
              <VocabularyCard
                size="sm"
                image={item.second.featured_image}
                title={item.second.name}
                action={() => viewDetailTopic(item.second)}
              />
            </>
          )}
        </NoFlexContainer>
      );
    },
    [viewDetailTopic],
  );

  const renderTopicWorld = useCallback(
    ({item}) => {
      return (
        <VocabularyTopicItem
          item={item}
          action={() => viewLessonDetailVoByTopic(item)}
          showUpLevel
        />
      );
    },
    [viewLessonDetailVoByTopic],
  );

  return (
    <ScrollView
      backgroundColor={colors.mainBgColor}
      // style={{backgroundColor: colors.mainBgColor}}
      showsVerticalScrollIndicator={false}>
      <Carousel
        data={examsAttention}
        renderItem={renderExamHottestItem}
        sliderWidth={OS.WIDTH}
        itemWidth={OS.WIDTH - 48}
        firstItem={index}
        inactiveSlideScale={0.9}
        inactiveSlideOpacity={0.7}
        containerCustomStyle={styles.slider}
        contentContainerCustomStyle={[
          styles.sliderContentContainer,
          {paddingTop: 24},
        ]}
        loopClonesPerSide={3}
        lockScrollTimeoutDuration={3000}
        autoplayDelay={5000}
        swipeThreshold={20}
        overScrollMode={'never'}
        maxToRenderPerBatch={1}
        onSnapToItem={(index) => setIndex(index)}
      />
      {pagination()}

      <InputVocabulary
        ref={refSearch}
        primary
        white
        placeHolderText={translate('Tìm bài kiểm tra...')}
        onFocus={onSearch}
        onSearch={onSearch}
      />
      <Text
        h4
        color={colors.helpText}
        bold
        paddingHorizontal={24}
        paddingTop={40}>
        {translate('Danh mục đề thi')}
      </Text>

      <FlatList
        data={listCategory}
        keyExtractor={(item) => item.key}
        renderItem={renderTopicVocabularyItem}
        ItemSeparatorComponent={() => <SeparatorHorizontal sm />}
        horizontal
        style={stylesVocabulary.topicContainer}
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={() => <SeparatorVertical slg />}
      />
      <SeparatorVertical md />
      <FlatList
        keyExtractor={(item) => item.id}
        data={categoryMostExam}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => {
          if (item.data.length === 0) {
            return null;
          }
          return (
            <>
              <RowContainer
                justifyContent={'space-between'}
                paddingHorizontal={24}>
                <Text h4 color={colors.helpText} bold>
                  {item.title}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    navigator.navigate('ExamCategory', {params: item});
                  }}>
                  <Text h5 color={colors.facebook}>
                    {translate('Xem tất cả')}
                  </Text>
                </TouchableOpacity>
              </RowContainer>
              <FlatList
                data={item.data}
                keyExtractor={(item) => item._id}
                renderItem={renderTopicWorld}
                ItemSeparatorComponent={() => <SeparatorVertical sm />}
                horizontal
                style={stylesVocabulary.topicContainer}
                showsHorizontalScrollIndicator={false}
                ListFooterComponent={() => <SeparatorVertical md />}
              />
            </>
          );
        }}
      />
      {/*<RowContainer justifyContent={'space-between'}>*/}
      {/*  <Text h4 color={colors.helpText} bold paddingHorizontal={24}>*/}
      {/*    Kiểm tra tự luận*/}
      {/*  </Text>*/}
      {/*  <TouchableOpacity*/}
      {/*    onPress={() => {*/}
      {/*      navigator.navigate('EssayExams');*/}
      {/*    }}>*/}
      {/*    <Text*/}
      {/*      fontSize={17}*/}
      {/*      lineHeight={22}*/}
      {/*      primary*/}
      {/*      bold*/}
      {/*      paddingHorizontal={24}>*/}
      {/*      Tất cả*/}
      {/*    </Text>*/}
      {/*  </TouchableOpacity>*/}
      {/*</RowContainer>*/}
      {/*<FlatList*/}
      {/*  data={essayExamList}*/}
      {/*  keyExtractor={(item) => item._id}*/}
      {/*  renderItem={renderTopicWorld}*/}
      {/*  ItemSeparatorComponent={() => <SeparatorHorizontal sm />}*/}
      {/*  horizontal*/}
      {/*  style={stylesVocabulary.topicContainer}*/}
      {/*  showsHorizontalScrollIndicator={false}*/}
      {/*  ListFooterComponent={() => <SeparatorVertical slg />}*/}
      {/*/>*/}
    </ScrollView>
  );
};

const stylesVocabulary = StyleSheet.create({
  topicContainer: {paddingHorizontal: 24, paddingVertical: 16},
});

export default ExamContainer;

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 90,
  },
  slider: {
    marginTop: 15 * OS.scaleYByDesign,
    overflow: 'visible',
  },
  sliderContentContainer: {
    paddingVertical: 0,
  },
  paginationContainer: {
    paddingVertical: 8,
  },
  lessonInfoTeacher: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 16,
    marginTop: 32,
  },
});
