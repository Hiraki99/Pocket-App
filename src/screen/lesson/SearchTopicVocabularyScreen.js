import React, {useEffect, useRef, useState, useCallback} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import lodash from 'lodash';
// import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  BlankHeader,
  FlexContainer,
  InputVocabulary,
  RowContainer,
  SeparatorVertical,
  Text,
} from '~/BaseComponent';
import navigator from '~/navigation/customNavigator';
import {colors} from '~/themes';
import vocabularyApi from '~/features/vocalbulary/VocabularyApi';
import {FIRST_PAGE, PAGE_SIZE} from '~/constants/query';
import {VocabularyTopicItem} from '~/BaseComponent/components/elements/vocabulary';
import {translate} from '~/utils/multilanguage';

const SearchTopicVocabularyScreen = () => {
  const [value, setValue] = useState('');
  const [page, setPage] = useState(FIRST_PAGE);
  const [maxPage, setMaxPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  const inputVocabulary = useRef(null);

  useEffect(() => {
    if (inputVocabulary && inputVocabulary.current) {
      inputVocabulary.current.focus();
    }
  }, []);

  useEffect(() => {
    setSearchResult([]);
    setPage(0);
  }, [value]);

  useEffect(() => {
    const fetchSearchRes = async (pageQuery) => {
      let res = await vocabularyApi.searchWordGroup({
        page: pageQuery,
        length: PAGE_SIZE,
        keyword: value.trim(),
      });
      if (res.ok && res.data && res.data.data) {
        if (res.data.data.length === 0) {
          setMaxPage(pageQuery);
        }
        setSearchResult((data) => {
          const listId = data.map((item) => item._id);
          if (listId.length === 0) {
            return res.data.data;
          }
          const newData = res.data.data.filter(
            (item) => listId.indexOf(item._id) === -1,
          );
          return [...data, ...newData];
        });
      }
      setRefreshing(false);
    };
    const debounceQuest = lodash.debounce(function (a) {
      fetchSearchRes(a);
    }, 50);

    if (value) {
      debounceQuest(value);
    }
  }, [page, refreshing, value]);

  const onRefresh = () => {
    setSearchResult([]);
    setPage(0);
    setRefreshing(true);
  };

  const loadMore = useCallback(() => {
    if (!refreshing && page + 1 <= maxPage) {
      setPage((p) => p + 1);
    }
  }, [page, maxPage, refreshing]);

  const viewLessonDetailVoByTopic = useCallback((item) => {
    navigator.navigate('LibraryLessonDetail', {
      params: {...item, vocabulary: true},
    });
  }, []);

  const renderItem = useCallback(
    ({item}) => {
      return (
        <VocabularyTopicItem
          item={item}
          large
          action={() => viewLessonDetailVoByTopic(item)}
        />
      );
    },
    [viewLessonDetailVoByTopic],
  );

  return (
    <FlexContainer backgroundColor={colors.white}>
      <BlankHeader />
      <RowContainer paddingHorizontal={12}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigator.back()}>
          <Ionicons name="md-arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <InputVocabulary
          ref={inputVocabulary}
          value={value}
          onChangeValue={(text) => setValue(text)}
          placeHolderText={`${translate('Tìm kiếm bộ từ...')}`}
        />
      </RowContainer>
      {value !== '' && (
        <Text
          h5
          color={colors.helpText}
          paddingHorizontal={24}
          paddingBottom={16}>
          {translate('Kết quả tìm kiếm')}
        </Text>
      )}
      <FlatList
        refreshing={refreshing}
        onRefresh={onRefresh}
        data={searchResult}
        keyExtractor={(item, index) => `${item._id}_${index}`}
        renderItem={renderItem}
        onEndReachedThreshold={0.1}
        onEndReached={loadMore}
        ItemSeparatorComponent={() => <SeparatorVertical md />}
        ListFooterComponent={() => <SeparatorVertical slg />}
        showsVerticalScrollIndicator={false}
        style={{flex: 1, paddingHorizontal: 24}}
      />
    </FlexContainer>
  );
};
SearchTopicVocabularyScreen.propTypes = {};
SearchTopicVocabularyScreen.defaultProps = {};

export default SearchTopicVocabularyScreen;
