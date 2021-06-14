import React, {useState, useEffect, useCallback} from 'react';
import {FlatList, View} from 'react-native';

import {
  FlexContainer,
  RowContainer,
  Text,
  CommonHeader,
  SeparatorVertical,
  NoFlexContainer,
  CommonImage,
} from '~/BaseComponent/index';
import VocabularyTopicItem from '~/BaseComponent/components/elements/vocabulary/VocabularyTopicItem';
import InputVocabulary from '~/BaseComponent/components/elements/input/InputVocabulary';
import {OS} from '~/constants/os';
import {getDimensionVideo169} from '~/utils/utils';
import {colors} from '~/themes';
import navigator from '~/navigation/customNavigator';
import {FIRST_PAGE, PAGE_SIZE} from '~/constants/query';
import examAPI from '~/features/exam/ExamApi';
import {translate} from '~/utils/multilanguage';

const ExamCategoryScreen = () => {
  const params = navigator.getParam('params', {});
  const [query, setQuery] = useState({
    page: FIRST_PAGE,
    keyword: '',
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
        test_category: params._id,
      };
      if (query.keyword) {
        bodyQuery.keyword = query.keyword.trim();
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
  }, [params, query]);

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
      <View>
        <NoFlexContainer justifyContent={'center'} alignItems={'center'}>
          <CommonImage
            source={{uri: params.featured_image}}
            resizeMode={'cover'}
            style={{
              width: OS.WIDTH,
              height: getDimensionVideo169(OS.WIDTH),
            }}
          />
          <RowContainer
            justifyContent={'center'}
            style={{
              backgroundColor: colors.primary,
              width: 80,
              position: 'absolute',
              left: (OS.WIDTH - 80) / 2,
            }}>
            <Text
              fontSize={14}
              color={colors.white}
              bold
              uppercase
              paddingHorizontal={4}>
              {`${translate('Chủ đề')}`}
            </Text>
          </RowContainer>
          <RowContainer
            justifyContent={'center'}
            style={{
              position: 'absolute',
              top: getDimensionVideo169(OS.WIDTH) / 2 + 24,
              width: '100%',
              paddingHorizontal: 24,
            }}>
            <Text
              h4
              center
              color={colors.white}
              bold
              uppercase
              paddingHorizontal={4}>
              {params.name}
            </Text>
          </RowContainer>
        </NoFlexContainer>
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
      </View>
    );
  }, [params.featured_image, params.name, query]);

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
      <CommonHeader themeWhite title={params.name} />
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

export default ExamCategoryScreen;
