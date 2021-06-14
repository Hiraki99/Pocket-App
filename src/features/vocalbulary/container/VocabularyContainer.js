import React, {useMemo, useCallback, useState, useEffect} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {FlatList, View, StyleSheet} from 'react-native';
import {InstagramLoader} from 'react-native-easy-content-loader';

import {
  NoFlexContainer,
  Text,
  InputVocabulary,
  SeparatorVertical,
  SeparatorHorizontal,
} from '~/BaseComponent';
import {VocabularyCard} from '~/BaseComponent/components/elements/vocabulary';
import {colors} from '~/themes';
import {OS} from '~/constants/os';
import navigator from '~/navigation/customNavigator';
import VocabularyTopicListItem from '~/features/vocalbulary/container/VocabularyTopicListItem';
import {
  fetchTopicVocabulary,
  fetchVocabularyFeature,
} from '~/features/vocalbulary/VocabularyAction';
import {setTabActivity} from '~/features/activity/ActivityAction';
import {TAB_ACTIVITY} from '~/constants/tab';
import {translate} from '~/utils/multilanguage';

const VocabularyContainer = (props) => {
  const dispatch = useDispatch();
  const vocabularyFeatures = useSelector(
    (state) => state.vocabulary.vocabularyFeatures,
    shallowEqual,
  );
  const topicsVocabulary = useSelector(
    (state) => state.vocabulary.topicsVocabulary,
    shallowEqual,
  );

  const topicsMostAttention = useSelector(
    (state) => state.vocabulary.topicsMostAttention,
    shallowEqual,
  );

  const [index, setIndex] = useState(0);
  const [firstFocus, setFirstFocus] = useState(props.focused ? 1 : 0);
  const [loading, setLoading] = useState(true);
  const [loadingContainer, setLoadingContainer] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoadingContainer(false);
      setTimeout(() => {
        setLoading(false);
      }, 100);
    }, 200);
  }, []);

  useEffect(() => {
    if (props.focused && firstFocus === 0) {
      setFirstFocus(firstFocus + 1);
    }
  }, [firstFocus, props.focused]);

  useEffect(() => {
    if (firstFocus === 1) {
      dispatch(fetchTopicVocabulary());
      dispatch(fetchVocabularyFeature());
      setFirstFocus(firstFocus + 1);
    }
  }, [firstFocus, dispatch]);

  const vocabularyHottest = useMemo(() => {
    const list = [];
    topicsVocabulary.forEach((item, index) => {
      if (index % 2 === 0) {
        const res = {
          key: item._id,
          first: item,
          second: topicsVocabulary[index + 1] || null,
        };
        list.push(res);
      }
    });
    return list;
  }, [topicsVocabulary]);

  const viewDetailTopic = useCallback((item) => {
    navigator.navigate('VocabularyCategory', {params: item});
  }, []);

  const viewLessonDetailVoByTopic = useCallback(
    (item) => {
      dispatch(setTabActivity(TAB_ACTIVITY.wordGroup));
      navigator.navigate('LibraryLessonDetail', {
        params: {
          ...item,
          vocabulary: true,
        },
      });
    },
    [dispatch],
  );

  const renderItemLesson = useCallback(
    ({item}) => {
      return (
        <VocabularyCard
          size="lg"
          image={item.featured_image}
          title={item.name}
          subTitle={item.desc}
          action={() => viewLessonDetailVoByTopic(item)}
        />
      );
    },
    [viewLessonDetailVoByTopic],
  );

  const pagination = useCallback(() => {
    return (
      <Pagination
        dotsLength={
          vocabularyFeatures.length > 5 ? 5 : vocabularyFeatures.length
        }
        activeDotIndex={vocabularyFeatures.length > 5 ? index % 5 : index}
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
  }, [index, vocabularyFeatures.length]);

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

  const onSearch = useCallback(() => {
    navigator.navigate('SearchTopicVocabulary');
  }, []);

  const renderMostAttention = useCallback(({item}) => {
    return <VocabularyTopicListItem data={item} />;
  }, []);
  if (!props.focused) {
    return null;
  }

  if (loadingContainer) {
    return <InstagramLoader active />;
  }

  return (
    <ScrollView
      style={{backgroundColor: colors.white, flex: 1}}
      showsVerticalScrollIndicator={false}>
      <Carousel
        data={loading ? [{}, {}] : vocabularyFeatures}
        renderItem={renderItemLesson}
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
        primary
        placeHolderText={`${translate('Tìm kiếm bộ từ...')}`}
        onFocus={onSearch}
        onSearch={onSearch}
      />
      <Text
        h4
        color={colors.helpText}
        bold
        paddingHorizontal={24}
        paddingTop={40}>
        {`${translate('Chủ đề từ vựng')}`}
      </Text>

      <FlatList
        data={vocabularyHottest}
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
        data={topicsMostAttention}
        showsVerticalScrollIndicator={false}
        renderItem={renderMostAttention}
      />
      <SeparatorVertical slg />
    </ScrollView>
  );
};

const stylesVocabulary = StyleSheet.create({
  topicContainer: {paddingHorizontal: 24, paddingVertical: 16},
});

export default VocabularyContainer;

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
