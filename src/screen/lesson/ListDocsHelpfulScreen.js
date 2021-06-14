import React, {useCallback, useState, useEffect} from 'react';
import {FlatList, Image, Linking} from 'react-native';

import {colors, images} from '~/themes';
import {
  CommonHeader,
  FlexContainer,
  NoFlexContainer,
  SeparatorVertical,
  Text,
} from '~/BaseComponent';
import {VocabularyTopicItem} from '~/BaseComponent/components/elements/vocabulary';
import grammarApi from '~/features/grammar/GrammarApi';
import navigator from '~/navigation/customNavigator';
import {FIRST_PAGE, PAGE_SIZE} from '~/constants/query';

const ListDocsHelpfulScreen = () => {
  const [page, setPage] = useState(FIRST_PAGE);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [refreshing, setRefreshing] = useState(true);
  const [listenData, setListenData] = useState([]);
  const params = navigator.getParam('params', null);
  useEffect(() => {
    async function requestToServer(pageQuery) {
      let res = await grammarApi.fetchListDocsHelpful({
        page: pageQuery,
        length: PAGE_SIZE,
        helpfull_reference_category: params._id,
      });
      if (res.ok && res.data && res.data.data) {
        setCanLoadMore(res.data.totalCount > (pageQuery + 1) * PAGE_SIZE);
        setListenData((data) =>
          pageQuery === FIRST_PAGE
            ? res.data.data
            : [...data, ...res.data.data],
        );
      }
      setRefreshing(false);
    }

    if (((refreshing && page === 0) || page > 0) && params) {
      requestToServer(page);
    }
  }, [page, refreshing, params]);

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
    Linking.openURL(item.link);
  }, []);

  const renderHeader = useCallback(() => {
    return (
      <NoFlexContainer
        justifyContent={'center'}
        alignItems={'center'}
        paddingHorizontal={24}
        paddingBottom={24}>
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
          center
          uppercase
          style={{marginTop: -16}}>
          {params?.name}
        </Text>
      </NoFlexContainer>
    );
  }, [params]);

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
      <CommonHeader themeWhite title={params.name} />
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

export default ListDocsHelpfulScreen;
