import React, {useCallback, useState, useEffect} from 'react';
import {FlatList, Image, View} from 'react-native';
import {useDispatch} from 'react-redux';

import {
  Card,
  FlexContainer,
  NoFlexContainer,
  SeparatorVertical,
  Text,
} from '~/BaseComponent';
import VocabularyTopicItem from '~/BaseComponent/components/elements/vocabulary/VocabularyTopicItem';
import {colors, images} from '~/themes';
import navigator from '~/navigation/customNavigator';
import {FIRST_PAGE, PAGE_SIZE} from '~/constants/query';
import lessonApi from '~/features/lessons/LessonApi';
import {setTabActivity} from '~/features/activity/ActivityAction';
import {TAB_ACTIVITY} from '~/constants/tab';
import {translate} from '~/utils/multilanguage';

const CommunicationContainer = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(FIRST_PAGE);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [refreshing, setRefreshing] = useState(true);
  const [communicationData, setCommunicationData] = useState([]);

  useEffect(() => {
    async function requestToServer(pageQuery) {
      let res = await lessonApi.fetchCommunicationLesson({
        page: pageQuery,
        length: PAGE_SIZE,
      });
      if (res.ok && res.data && res.data.data) {
        setCanLoadMore(res.data.totalCount > (pageQuery + 1) * PAGE_SIZE);
        setCommunicationData((data) =>
          pageQuery === FIRST_PAGE
            ? res.data.data
            : [...data, ...res.data.data],
        );
      }
      setRefreshing(false);
    }

    if ((refreshing && page === 0) || page > 0) {
      requestToServer(page);
    }
  }, [page, refreshing]);

  const onRefresh = useCallback(() => {
    setCommunicationData([]);
    setPage(0);
    setRefreshing(true);
  }, []);

  const loadMore = useCallback(() => {
    if (!refreshing && canLoadMore) {
      setPage((currentPage) => currentPage + 1);
    }
  }, [canLoadMore, refreshing]);

  const viewDetailTopic = useCallback(
    (item) => {
      dispatch(setTabActivity(TAB_ACTIVITY.communication));
      navigator.navigate('LibraryLessonDetail', {
        params: {
          ...item,
          communication: true,
        },
      });
    },
    [dispatch],
  );

  const renderHeader = useCallback(() => {
    return (
      <NoFlexContainer
        justifyContent={'center'}
        alignItems={'center'}
        paddingHorizontal={24}>
        <Image
          source={images.communication}
          style={{
            width: 100,
            height: 100,
            marginTop: 20,
          }}
        />
        <Text
          h2
          color={colors.helpText}
          bold
          uppercase
          style={{marginTop: -16}}>
          {`${translate('Giao tiếp')}`}
        </Text>
        <Text
          center
          color="rgba(31,38,49,0.54)"
          style={{paddingTop: 4, paddingBottom: 24}}>
          {translate(
            'Các chủ đề tiếng Anh giao tiếp cơ bản cần thiết trong cuộc sống do thầy cô bản ngữ giảng dạy',
          )}
        </Text>
      </NoFlexContainer>
    );
  }, []);

  const renderItem = useCallback(({item}) => {
    return (
      <VocabularyTopicItem
        item={item}
        showUpLevel={false}
        action={() => viewDetailTopic(item)}
      />
    );
  }, []);

  const renderEmptyComp = useCallback(() => {
    return (
      <View paddingHorizontal={24}>
        <Card
          style={{
            borderRadius: 16,
            backgroundColor: colors.white,
            paddingHorizontal: 24,
            zIndex: 100,
          }}>
          <Text h5 paddingVertical={16} paddingHorizontal={24}>
            {`${translate('Chưa có bài học cho mục này')}`}
          </Text>
        </Card>
      </View>
    );
  }, []);

  return (
    <FlexContainer>
      <FlatList
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={renderEmptyComp}
        data={communicationData}
        ListHeaderComponent={renderHeader}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{paddingHorizontal: 24}}
        onEndReachedThreshold={0.1}
        onEndReached={loadMore}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <SeparatorVertical lg />}
        ListFooterComponent={() => <SeparatorVertical slg />}
      />
    </FlexContainer>
  );
};

export default CommunicationContainer;
