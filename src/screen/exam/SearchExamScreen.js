import React, {useState, useEffect, useCallback} from 'react';
import {FlatList, TouchableWithoutFeedback} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {
  FlexContainer,
  CommonHeader,
  SeparatorVertical,
  Text,
  RowContainer,
} from '~/BaseComponent/index';
import VocabularyTopicItem from '~/BaseComponent/components/elements/vocabulary/VocabularyTopicItem';
import InputVocabulary from '~/BaseComponent/components/elements/input/InputVocabulary';
import {colors} from '~/themes';
import navigator from '~/navigation/customNavigator';
import {FIRST_PAGE, PAGE_SIZE} from '~/constants/query';
import examAPI from '~/features/exam/ExamApi';
import {translate} from '~/utils/multilanguage';

const SearchExamScreen = () => {
  const tagParam = navigator.getParam('tag', null);
  const [query, setQuery] = useState({
    page: FIRST_PAGE,
    keyword: '',
    tag: tagParam,
  });
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [refreshing, setRefreshing] = useState(true);
  const [categoriesData, setCategoriesData] = useState([]);
  let onEndReachedCalledDuringMomentum = false;

  useEffect(() => {
    async function searchExamByCategory() {
      let res;
      const bodyQuery = {
        page: query.page,
        length: PAGE_SIZE,
      };
      if (query.keyword) {
        bodyQuery.keyword = query.keyword.trim();
      }
      if (query.tag) {
        bodyQuery.tag = query.tag.trim();
      }
      res = await examAPI.fetchExamByCategory(bodyQuery);
      if (res.ok && res.data && res.data.data) {
        setCanLoadMore(res.data.totalCount > (query.page + 1) * PAGE_SIZE);
        setCategoriesData((data) =>
          query.page === FIRST_PAGE
            ? res.data.data
            : [...data, ...res.data.data],
        );
      }
      setRefreshing(false);
    }
    searchExamByCategory();
  }, [query]);

  const onRefresh = useCallback(() => {
    setCategoriesData([]);
    setQuery((oldQuery) => {
      return {
        ...oldQuery,
        page: FIRST_PAGE,
      };
    });
    setRefreshing(true);
  }, []);

  const loadMore = useCallback(() => {
    if (!onEndReachedCalledDuringMomentum && !refreshing && canLoadMore) {
      setQuery((oldQuery) => {
        return {
          ...oldQuery,
          page: oldQuery.page + 1,
        };
      });
      onEndReachedCalledDuringMomentum.current = true;
    }
  }, [refreshing, canLoadMore, onEndReachedCalledDuringMomentum]);

  const renderHeader = React.useMemo(() => {
    return (
      <>
        <InputVocabulary
          primary
          placeHolderText={`${translate('Tìm kiếm đề thi')}`}
          value={query.keyword}
          onChangeValue={(key) => {
            setQuery(() => {
              return {
                keyword: key,
                page: FIRST_PAGE,
              };
            });
          }}
        />
        {query.tag && (
          <RowContainer paddingHorizontal={24} paddingBottom={16}>
            <Text bold fontSize={22}>
              Tags:{' '}
            </Text>
            <RowContainer
              style={{
                borderWidth: 1,
                borderRadius: 8,
                borderColor: colors.primary,
                paddingHorizontal: 8,
              }}>
              <TouchableWithoutFeedback
                onPress={() => {
                  setQuery((oldQuery) => {
                    return {
                      ...oldQuery,
                      page: FIRST_PAGE,
                      tag: null,
                    };
                  });
                }}>
                <AntDesign
                  size={18}
                  name="close"
                  color={colors.primary}
                  style={{paddingVertical: 8}}
                />
              </TouchableWithoutFeedback>
              <Text
                h5
                medium
                paddingHorizontal={4}
                color={colors.primary}>{`${query.tag}`}</Text>
            </RowContainer>
          </RowContainer>
        )}
      </>
    );
  }, [query]);

  const renderItem = ({item}) => {
    return (
      <VocabularyTopicItem
        item={item}
        action={() => {
          navigator.navigate('OnboardExamEng', {params: item});
        }}
      />
    );
  };

  return (
    <FlexContainer backgroundColor={colors.white}>
      <CommonHeader
        themeWhite
        title={`${translate('Tìm kiếm bài kiểm tra')}`}
      />
      <FlexContainer backgroundColor={colors.white}>
        <FlatList
          refreshing={refreshing}
          onRefresh={onRefresh}
          data={categoriesData}
          ListHeaderComponent={renderHeader}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{paddingHorizontal: 24}}
          ItemSeparatorComponent={() => <SeparatorVertical lg />}
          ListFooterComponent={() => <SeparatorVertical slg />}
          onEndReachedThreshold={0.1}
          onEndReached={loadMore}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum = false;
          }}
          showsVerticalScrollIndicator={false}
        />
      </FlexContainer>
    </FlexContainer>
  );
};

export default SearchExamScreen;
