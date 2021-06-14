import React, {useState, useEffect, useCallback} from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

import {OS} from '~/constants/os';
import {
  FlexContainer,
  Text,
  CommonHeader,
  SeparatorVertical,
  CommonImage,
} from '~/BaseComponent/index';
import {getDimensionVideo169} from '~/utils/utils';
import {colors} from '~/themes';
import {FIRST_PAGE, PAGE_SIZE} from '~/constants/query';
import examAPI from '~/features/exam/ExamApi';
import ListStatusQuestionExamedModal from '~/BaseComponent/components/elements/exam/modal/ListStatusQuestionExamedModal';
import {translate} from '~/utils/multilanguage';

const UserExamDidScreen = () => {
  const [query, setQuery] = useState({
    page: FIRST_PAGE,
    keyword: '',
  });
  const modalRef = React.useRef(null);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [refreshing, setRefreshing] = useState(true);
  const [examData, setExamData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    async function getExamed() {
      let res;
      const bodyQuery = {
        page: query.page,
        length: PAGE_SIZE,
      };
      if (query.keyword) {
        bodyQuery.keyword = query.keyword.trim();
      }
      res = await examAPI.getTestedResult(bodyQuery);
      if (res.ok && res.data && res.data.data) {
        setCanLoadMore(res.data.totalCount > (query.page + 1) * PAGE_SIZE);
        setExamData((data) =>
          query.page === FIRST_PAGE
            ? res.data.data
            : [...data, ...res.data.data],
        );
      }
      setRefreshing(false);
    }
    getExamed();
  }, [query]);

  console.log('exam daa ', selectedItem);
  console.log('exam daa 2 ', selectedItem?.results);
  const onRefresh = useCallback(() => {
    setExamData([]);
    setQuery((oldQuery) => {
      return {
        ...oldQuery,
        page: FIRST_PAGE,
      };
    });
    setRefreshing(true);
  }, []);

  const loadMore = useCallback(() => {
    if (!refreshing && canLoadMore) {
      setQuery((oldQuery) => {
        return {
          ...oldQuery,
          page: oldQuery.page + 1,
        };
      });
    }
  }, [refreshing, canLoadMore]);

  const renderHeader = useCallback(() => {
    return <SeparatorVertical lg />;
  }, []);
  const renderItem = useCallback(({item}) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          setSelectedItem(item);
          modalRef.current.showModal();
        }}>
        <View paddingHorizontal={24}>
          <CommonImage
            style={styles.imageLarge}
            source={{uri: item?.test?.featured_image}}
            resizeMode="cover"
          />
          <View backgroundColor={colors.primary} style={styles.score}>
            <Text color={colors.white} fontSize={18} center medium>
              {Math.floor(
                (item.true_count * 100) / (item.true_count + item.false_count),
              )}
            </Text>
          </View>
          <Text style={styles.name} medium>
            {item?.test?.name}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }, []);

  return (
    <FlexContainer backgroundColor={colors.white}>
      <CommonHeader themeWhite title={`${translate('Bài kiểm tra của tôi')}`} />
      <FlexContainer backgroundColor={colors.white} marginTop={2}>
        <FlatList
          ListHeaderComponent={renderHeader}
          refreshing={refreshing}
          onRefresh={onRefresh}
          data={examData}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <SeparatorVertical lg />}
          onEndReachedThreshold={0.1}
          onEndReached={loadMore}
          showsVerticalScrollIndicator={false}
        />
        <ListStatusQuestionExamedModal
          ref={modalRef}
          title={'12cqcs'}
          data={selectedItem || {}}
          questions={selectedItem?.results || []}
        />
      </FlexContainer>
    </FlexContainer>
  );
};

export default UserExamDidScreen;

const styles = StyleSheet.create({
  wrapperLarge: {
    width: OS.WIDTH - 48,
    display: 'flex',
    marginRight: 7,
    // marginBottom: 0,
  },
  imageLarge: {
    width: OS.WIDTH - 48,
    height: getDimensionVideo169(OS.WIDTH - 48),
    borderRadius: 8,
    shadowColor: '#3C80D1',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.09,
    shadowRadius: 19,
    // elevation: 2,
    marginBottom: 8,
  },
  wrapper: {
    width: (OS.WIDTH - 48 - 7) / 2,
    display: 'flex',
    marginRight: 7,
    // marginBottom: 0,
  },
  image: {
    width: (OS.WIDTH - 48 - 7) / 2,
    height: 120,
    borderRadius: 8,
    shadowColor: '#3C80D1',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.09,
    shadowRadius: 19,
    // elevation: 2,
    marginBottom: 8,
  },
  name: {
    flexWrap: 'wrap',
    fontSize: 17,
    marginBottom: 4,
  },
  score: {
    width: 36,
    height: 36,
    borderRadius: 18,
    position: 'absolute',
    top: 5,
    right: 32,
    justifyContent: 'center',
  },
});
