import React, {useCallback, useState, useEffect} from 'react';
import {FlatList, Image} from 'react-native';

import {
  FlexContainer,
  NoFlexContainer,
  SeparatorVertical,
  Text,
} from '~/BaseComponent';
import {VocabularyTopicItem} from '~/BaseComponent/components/elements/vocabulary';
import {colors, images} from '~/themes';
import listenApi from '~/features/listen/ListenApi';
import navigator from '~/navigation/customNavigator';
import {FIRST_PAGE, PAGE_SIZE} from '~/constants/query';
import {translate} from '~/utils/multilanguage';

const LessonMusicContainer = () => {
  const [page, setPage] = useState(FIRST_PAGE);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [refreshing, setRefreshing] = useState(true);
  const [listenData, setListenData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [pendingProcess, setPendingProcess] = useState(false);

  useEffect(() => {
    async function requestToServer(pageQuery) {
      let res = await listenApi.fetchSongLesson({
        page: pageQuery,
        length: PAGE_SIZE,
      });
      if (res.ok && res.data && res.data.data) {
        setCanLoadMore(res.data.totalCount > (pageQuery + 1) * PAGE_SIZE);
        setListenData((data) =>
          pageQuery === FIRST_PAGE
            ? res.data.data
            : [...data, ...res.data.data],
        );
      }
      setPendingProcess(false);
      setRefreshing(false);
    }

    if ((refreshing && page === 0) || page > 0) {
      setPendingProcess(true);
      requestToServer(page);
    }
  }, [page, refreshing]);

  const onRefresh = () => {
    setListenData([]);
    setPage(0);
    setRefreshing(true);
  };

  const loadMore = useCallback(() => {
    if (!refreshing && canLoadMore) {
      setPage((currentPage) => currentPage + 1);
    }
  }, [canLoadMore, refreshing]);

  const viewDetailTopic = useCallback((item) => {
    navigator.navigate('LibraryLessonDetail', {
      params: {
        ...item,
        song: true,
      },
    });
  }, []);

  const renderHeader = useCallback(() => {
    return (
      <NoFlexContainer
        justifyContent={'center'}
        alignItems={'center'}
        paddingHorizontal={24}>
        <Image
          source={images.listenTeacher}
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
          {`${translate('Bài hát')}`}
        </Text>
        <Text
          center
          color="rgba(31,38,49,0.54)"
          style={{paddingTop: 4, paddingBottom: 24}}>
          {`${translate('Học tiếng anh qua bài hát')}`}
        </Text>
      </NoFlexContainer>
    );
  }, []);

  const renderItem = useCallback(
    ({item}) => {
      return (
        <VocabularyTopicItem
          item={{
            ...item,
            name: item.name.toLowerCase(),
          }}
          action={() => viewDetailTopic(item)}
        />
      );
    },
    [viewDetailTopic],
  );

  return (
    <FlexContainer backgroundColor={colors.white}>
      <FlatList
        refreshing={refreshing}
        onRefresh={onRefresh}
        data={listenData}
        ListHeaderComponent={renderHeader}
        keyExtractor={(item, index) => `${item._id}_${index}`}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{paddingHorizontal: 24}}
        ItemSeparatorComponent={() => <SeparatorVertical lg />}
        ListFooterComponent={() => <SeparatorVertical slg />}
        onEndReachedThreshold={0.1}
        onEndReached={loadMore}
        showsVerticalScrollIndicator={false}
      />
    </FlexContainer>
  );
};

export default LessonMusicContainer;
