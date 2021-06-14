import React, {useState, useCallback, useEffect} from 'react';
// import PropTypes from 'prop-types';
import {FlatList, ActivityIndicator} from 'react-native';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';

import {FlexContainer, SeparatorVertical} from '~/BaseComponent/index';
import HomeWorkDescription from '~/BaseComponent/components/elements/homework/HomeWorkDescription';
import {colors} from '~/themes';
import {homeworkSelector} from '~/selector/homework';
import {PAGE_SIZE} from '~/constants/query';
import {
  fetchListHomework,
  selectedHomework,
} from '~/features/homework/HomeworkAction';
import {classUserSelector} from '~/selector/user';
import navigator from '~/navigation/customNavigator';

const HomeworkContainer = () => {
  const dispatch = useDispatch();
  const {data, query} = useSelector(homeworkSelector, shallowEqual);
  const classUser = useSelector(classUserSelector, shallowEqual);
  const [page, setPage] = useState(query.page);

  useEffect(() => {
    if (classUser) {
      dispatch(
        fetchListHomework({
          class_id: classUser,
          page,
          length: PAGE_SIZE,
        }),
      );
    }
  }, [page, classUser, dispatch]);

  useEffect(() => {
    if (classUser) {
      setPage(0);
    }
  }, [classUser]);

  const onRefresh = useCallback(() => setPage(0), []);

  const loadMore = useCallback(() => {
    if (query.canLoadMore) {
      setPage((p) => p + 1);
    }
  }, [query]);

  const renderHeader = useCallback(() => {
    if (query.loading) {
      return (
        <ActivityIndicator
          size={'large'}
          color={colors.placeHolder}
          center
          paddingVertical={48}
        />
      );
    }
    return null;
  }, [query]);

  const navigateToDetail = useCallback(
    (item) => {
      return () => {
        if (item.type !== 'writing') {
          navigator.navigate('HomeworkDetail');
          // dispatch(selectedHomework(item));
          setTimeout(() => {
            dispatch(selectedHomework(item));
          }, 30);
          return;
        }
        navigator.navigate('EditorEssayExam', {params: item});
      };
    },
    [dispatch],
  );

  const renderItem = useCallback(
    ({item}) => {
      return (
        <HomeWorkDescription
          dataAction={item}
          shortDescription={item.content}
          showListActivity={item.type !== 'writing'}
          action={navigateToDetail(item)}
        />
      );
    },
    [navigateToDetail],
  );

  return (
    <FlexContainer backgroundColor={colors.mainBgColor} marginTop={4}>
      <FlatList
        refreshing={false}
        ListHeaderComponent={renderHeader}
        onRefresh={onRefresh}
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <SeparatorVertical md />}
        ListFooterComponent={() => <SeparatorVertical slg />}
        onEndReachedThreshold={0.1}
        onEndReached={loadMore}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={3}
      />
    </FlexContainer>
  );
};
HomeworkContainer.propTypes = {};
HomeworkContainer.defaultProps = {};
export default HomeworkContainer;
