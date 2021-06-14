import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Image} from 'react-native';
import {useDispatch} from 'react-redux';

import {
  FlexContainer,
  NoFlexContainer,
  SeparatorVertical,
  Text,
} from '~/BaseComponent';
import {VocabularyTopicItem} from '~/BaseComponent/components/elements/vocabulary';
import {colors, images} from '~/themes';
import navigator from '~/navigation/customNavigator';
import {FIRST_PAGE, PAGE_SIZE} from '~/constants/query';
import grammarApi from '~/features/grammar/GrammarApi';
import {setTabActivity} from '~/features/activity/ActivityAction';
import {TAB_ACTIVITY} from '~/constants/tab';
import {translate} from '~/utils/multilanguage';

const DocsContainer = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(FIRST_PAGE);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [refreshing, setRefreshing] = useState(true);
  const [grammarData, setGrammarData] = useState([]);

  useEffect(() => {
    async function requestToServer(pageQuery) {
      let res = await grammarApi.fetchDocsHelpful({
        page: pageQuery,
        length: PAGE_SIZE,
      });
      if (res.ok && res.data && res.data.data) {
        setCanLoadMore(res.data.totalCount > (pageQuery + 1) * PAGE_SIZE);
        setGrammarData((data) =>
          pageQuery === FIRST_PAGE
            ? res.data.data
            : [...data, ...res.data.data],
        );
      }
      setRefreshing(false);
    }

    if ((refreshing && page === 0) || page > 0) {
      requestToServer(page);
      setRefreshing(false);
    }
  }, [page, refreshing]);

  const onRefresh = () => {
    setGrammarData([]);
    setPage(0);
    setRefreshing(true);
  };

  const loadMore = useCallback(() => {
    if (!refreshing && canLoadMore) {
      setPage((p) => p + 1);
    }
  }, [refreshing, canLoadMore]);

  const viewLessonDetailVoByTopic = useCallback(
    (item) => {
      dispatch(setTabActivity(TAB_ACTIVITY.grammar));
      navigator.navigate('ListDocsHelpful', {
        params: {
          ...item,
          grammar: true,
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
          source={images.grammarTeacher}
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
          {translate('Tài liệu tham khảo')}
        </Text>
        <Text
          color="rgba(31,38,49,0.54)"
          center
          style={{paddingTop: 4, paddingBottom: 24}}>
          {translate(
            'Danh sách các tài liệu tham khảo giúp bạn học tập tốt hơn',
          )}
        </Text>
      </NoFlexContainer>
    );
  }, []);

  const renderItem = useCallback(
    ({item}) => {
      return (
        <VocabularyTopicItem
          item={item}
          action={() => viewLessonDetailVoByTopic(item)}
        />
      );
    },
    [viewLessonDetailVoByTopic],
  );

  return (
    <FlexContainer backgroundColor={colors.white}>
      <FlatList
        refreshing={refreshing}
        onRefresh={onRefresh}
        data={grammarData}
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

export default DocsContainer;
