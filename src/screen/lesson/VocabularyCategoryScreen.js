import React, {useState, useEffect, useCallback} from 'react';
import {FlatList, View} from 'react-native';
import {useDispatch} from 'react-redux';

import InputContainer from '~/BaseComponent/components/layouts/container/InputContainer';
import {
  FlexContainer,
  RowContainer,
  Text,
  CommonHeader,
  SeparatorVertical,
  NoFlexContainer,
  CommonImage,
} from '~/BaseComponent';
import VocabularyTopicItem from '~/BaseComponent/components/elements/vocabulary/VocabularyTopicItem';
import InputVocabulary from '~/BaseComponent/components/elements/input/InputVocabulary';
import {OS} from '~/constants/os';
import {getDimensionVideo169} from '~/utils/utils';
import {colors} from '~/themes';
import navigator from '~/navigation/customNavigator';
import {FIRST_PAGE, PAGE_SIZE} from '~/constants/query';
import vocabularyApi from '~/features/vocalbulary/VocabularyApi';
import {setTabActivity} from '~/features/activity/ActivityAction';
import {TAB_ACTIVITY} from '~/constants/tab';
import {translate} from '~/utils/multilanguage';

const VocabularyCategoryScreen = () => {
  const dispatch = useDispatch();
  const params = navigator.getParam('params', {});
  const [query, setQuery] = useState({
    page: FIRST_PAGE,
    length: PAGE_SIZE,
    word_category: params._id,
    keyword: '',
  });
  const [canLoadMore, setCanLoadMore] = useState(0);
  const [categoriesData, setCategoriesData] = useState([]);

  useEffect(() => {
    async function requestToServer(query) {
      let res = await vocabularyApi.searchWordGroup(query);
      if (res.ok && res.data && res.data.data) {
        setCanLoadMore(res.data.totalCount > query.page * query.length);
        setCategoriesData((data) =>
          query.page === FIRST_PAGE
            ? res.data.data
            : [...data, ...res.data.data],
        );
      }
    }
    requestToServer(query);
  }, [query]);

  const onRefresh = useCallback(() => {
    setQuery((old) => {
      return {
        ...old,
        page: FIRST_PAGE,
      };
    });
  }, []);

  const loadmore = useCallback(() => {
    if (canLoadMore) {
      setQuery((old) => {
        return {
          ...old,
          page: old.page + 1,
        };
      });
    }
  }, [canLoadMore]);

  const onChangeText = useCallback((text) => {
    setQuery((old) => {
      return {
        ...old,
        page: FIRST_PAGE,
        keyword: text,
      };
    });
  }, []);
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
              {translate('Chủ đề')}
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
          value={query.keyword}
          onChangeValue={onChangeText}
        />
      </View>
    );
  }, [params.featured_image, params.name, query, onChangeText]);

  const renderItem = React.useCallback(
    ({item}) => {
      return (
        <VocabularyTopicItem
          item={item}
          action={() => {
            dispatch(setTabActivity(TAB_ACTIVITY.wordGroup));
            navigator.navigate('LibraryLessonDetail', {
              params: {
                ...item,
                vocabulary: true,
              },
            });
          }}
        />
      );
    },
    [dispatch],
  );

  return (
    <InputContainer>
      <CommonHeader themeWhite title={params.name} />
      <FlexContainer backgroundColor={colors.white}>
        <FlatList
          refreshing={false}
          onRefresh={onRefresh}
          data={categoriesData}
          ListHeaderComponent={renderHeader}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{paddingHorizontal: 24}}
          ItemSeparatorComponent={() => <SeparatorVertical lg />}
          ListFooterComponent={() => <SeparatorVertical slg />}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.1}
          onEndReached={loadmore}
        />
      </FlexContainer>
    </InputContainer>
  );
};

export default VocabularyCategoryScreen;
