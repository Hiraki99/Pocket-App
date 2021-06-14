import React, {useState, useCallback, useEffect} from 'react';
import {FlatList, View} from 'react-native';

import {
  FlexContainer,
  NoFlexContainer,
  Text,
  CommonHeader,
  SeparatorVertical,
  Card,
  ThumbnailImage,
} from '~/BaseComponent';
import VideoListItem from '~/BaseComponent/components/elements/vocabulary/VideoListItem';
import {OS} from '~/constants/os';
import {colors} from '~/themes';
import navigator from '~/navigation/customNavigator';
import listenApi from '~/features/listen/ListenApi';
import {FIRST_PAGE, PAGE_SIZE} from '~/constants/query';
import {translate} from '~/utils/multilanguage';

const defaultDesc = translate(
  'Các kỹ thuật dạy nghe nhằm hỗ trợ cho người học khả năng nghe hiểu tiếng Anh, đồng thời phát triển các kỹ thuật rèn luyện người học khả năng tư duy và diễn đạt bằng tiếng Anh (kỹ năng nói).',
);

const DetailLectureListenScreen = () => {
  const params = navigator.getParam('params', {});

  const [page, setPage] = useState(FIRST_PAGE);
  const [maxPage, setMaxPage] = useState(1);
  const [refreshing, setRefreshing] = useState(true);
  const [listenData, setListenData] = useState([]);

  useEffect(() => {
    async function requestToServer(pageQuery) {
      let res = await listenApi.fetchLectureListen({
        category: params._id,
        page: pageQuery,
        length: PAGE_SIZE,
      });

      if (res.ok && res.data && res.data.data) {
        const {totalCount} = res.data;
        setMaxPage(Math.ceil(totalCount / PAGE_SIZE));
        if (pageQuery === FIRST_PAGE) {
          setListenData(res.data.data);
        } else {
          setListenData((data) =>
            pageQuery === FIRST_PAGE
              ? res.data.data
              : [...data, ...res.data.data],
          );
        }
      }
      setRefreshing(false);
    }
    if ((refreshing && page === FIRST_PAGE) || page > FIRST_PAGE) {
      requestToServer(page);
      setRefreshing(false);
    }
  }, [refreshing, params, page]);

  const onRefresh = useCallback(() => {
    setListenData([]);
    setRefreshing(true);
    setPage(0);
  }, []);

  const loadMore = useCallback(() => {
    if (!refreshing && page <= maxPage) {
      setPage((currentPage) => currentPage + 1);
    }
  }, [refreshing, page, maxPage]);

  const onSelect = useCallback((item) => {
    navigator.navigate('Youtube', {video: {videoId: item.video_id}});
  }, []);

  const renderHeader = useCallback(() => {
    return (
      <>
        <ThumbnailImage
          source={{uri: params.featured_image}}
          showButton={false}
          attachmentWidth={OS.WIDTH}
        />
        <NoFlexContainer paddingVertical={32} paddingHorizontal={24}>
          <Text h3 bold style={{paddingBottom: 16}}>
            {params.name || translate('Giới thiệu')}
          </Text>
          <Text fontSize={14} color={'rgba(31, 38, 49, 0.38)'}>
            {params.descript || defaultDesc}
          </Text>
        </NoFlexContainer>
      </>
    );
  }, [params]);

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <VideoListItem
          index={index}
          item={item}
          action={() => onSelect(item)}
        />
      );
    },
    [onSelect],
  );

  const renderEmptyComp = useCallback(() => {
    return (
      <View paddingHorizontal={24}>
        <Card
          style={{
            borderRadius: 16,
            backgroundColor: colors.white,
          }}>
          <Text h5 center paddingVertical={16} paddingHorizontal={24}>
            {translate('Chưa có bài nghe cho cấp độ này')}
          </Text>
        </Card>
      </View>
    );
  }, []);

  return (
    <FlexContainer>
      <CommonHeader themeWhite title={params.name} />
      <FlexContainer backgroundColor={colors.white}>
        <FlatList
          refreshing={refreshing}
          onRefresh={onRefresh}
          data={listenData}
          ListEmptyComponent={renderEmptyComp}
          ListHeaderComponent={renderHeader}
          keyExtractor={(item, index) => `${item._id}_${index}`}
          renderItem={renderItem}
          ListFooterComponent={() => <SeparatorVertical slg />}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.1}
          onEndReached={loadMore}
        />
      </FlexContainer>
    </FlexContainer>
  );
};

export default DetailLectureListenScreen;
