import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';

import {
  FlexContainer,
  NoFlexContainer,
  Text,
  CommonHeader,
  ThumbnailImage,
  SeparatorVertical,
  Card,
} from '~/BaseComponent';
import VideoListItem from '~/BaseComponent/components/elements/vocabulary/VideoListItem';
import {colors} from '~/themes';
import navigator from '~/navigation/customNavigator';
import {FIRST_PAGE, PAGE_SIZE} from '~/constants/query';
import lessonApi from '~/features/lessons/LessonApi';
import {translate} from '~/utils/multilanguage';

const defaultDesc = translate(
  'Các kỹ thuật dạy nghe nhằm hỗ trợ cho người học khả năng nghe hiểu\ntiếng Anh, đồng thời phát triển các kỹ thuật rèn luyện người học khả\nnăng tư duy và diễn đạt bằng tiếng Anh (kỹ năng nói).',
);

const TeachingSectionDetailScreen = () => {
  const [page, setPage] = useState(FIRST_PAGE);
  const [maxPage, setMaxPage] = useState(1);
  const [refreshing, setRefreshing] = useState(true);
  const [detailData, setDetailData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [pendingProcess, setPendingProcess] = useState(false);
  let onEndReachedCalledDuringMomentum = false;

  const params = navigator.getParam('params', {});

  useEffect(() => {
    async function requestToServer(pageQuery) {
      let res = await lessonApi.fetchTeachingCategoryDetail({
        page: pageQuery,
        length: PAGE_SIZE,
        teaching_category: params._id,
      });
      if (res.ok && res.data && res.data.data) {
        if (res.data.data.length === 0) {
          setMaxPage(pageQuery);
        } else {
          setDetailData((data) =>
            pageQuery === FIRST_PAGE
              ? res.data.data
              : [...data, ...res.data.data],
          );
        }
      }
      setPendingProcess(false);
      setRefreshing(false);
    }

    if ((refreshing && page === 0) || page > 0) {
      setPendingProcess(true);
      requestToServer(page);
    }
  }, [page, refreshing, params]);

  const onRefresh = () => {
    setDetailData([]);
    setPage(0);
    setRefreshing(true);
  };

  const loadMore = useCallback(() => {
    if (
      !onEndReachedCalledDuringMomentum &&
      !refreshing &&
      page + 1 <= maxPage
    ) {
      setPage((currentPage) => currentPage + 1);
      onEndReachedCalledDuringMomentum.current = true;
    }
  }, [refreshing, page, maxPage, onEndReachedCalledDuringMomentum]);
  const renderHeader = useCallback(() => {
    return (
      <>
        <ThumbnailImage
          source={{uri: params.featured_image}}
          showButton={false}
        />
        <NoFlexContainer paddingVertical={32} paddingHorizontal={24}>
          <Text h3 bold style={{paddingBottom: 16}}>
            {params.name || translate('Giới thiệu')}
          </Text>
          <Text fontSize={14} color={'rgba(31, 38, 49, 0.38)'}>
            {params.desc || defaultDesc}
          </Text>
        </NoFlexContainer>
      </>
    );
  }, []);

  const renderItem = useCallback(({item, index}) => {
    return <VideoListItem index={index} item={item} />;
  }, []);

  const renderEmpty = useCallback(() => {
    return (
      <View marginHorizontal={16}>
        <Card
          paddingHorizontal={16}
          paddingVertical={8}
          style={{width: '100%'}}>
          <Text h5 center>
            {translate('Chưa có bài học cho bộ từ này')}
          </Text>
        </Card>
      </View>
    );
  }, []);
  return (
    <>
      <CommonHeader themeWhite title={params.name} />
      <FlexContainer backgroundColor={colors.white}>
        <FlatList
          refreshing={refreshing}
          onRefresh={onRefresh}
          data={detailData}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          ListFooterComponent={() => <SeparatorVertical slg />}
          onEndReachedThreshold={0.1}
          onEndReached={loadMore}
          onMomentumScrollBegin={() => {
            if (onEndReachedCalledDuringMomentum) {
              onEndReachedCalledDuringMomentum.current = false;
            }
          }}
          showsVerticalScrollIndicator={false}
        />
      </FlexContainer>
    </>
  );
};

export default TeachingSectionDetailScreen;
