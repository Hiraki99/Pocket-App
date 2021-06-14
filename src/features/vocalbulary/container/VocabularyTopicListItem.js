import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useDispatch} from 'react-redux';

import {RowContainer, SeparatorVertical, Text} from '~/BaseComponent/index';
import {VocabularyTopicItem} from '~/BaseComponent/components/elements/vocabulary';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';
import {setTabActivity} from '~/features/activity/ActivityAction';
import {TAB_ACTIVITY} from '~/constants/tab';
import navigator from '~/navigation/customNavigator';

const VocabularyTopicListItem = (props) => {
  const dispatch = useDispatch();
  const {data} = props;
  const viewLessonDetailVoByTopic = useCallback(
    (item) => {
      dispatch(setTabActivity(TAB_ACTIVITY.wordGroup));
      navigator.navigate('LibraryLessonDetail', {
        params: {
          ...item,
          vocabulary: true,
        },
      });
    },
    [dispatch],
  );

  const renderTopicWorld = useCallback(
    ({item}) => {
      return (
        <VocabularyTopicItem
          item={item}
          action={() => viewLessonDetailVoByTopic(item)}
          showUpLevel
        />
      );
    },
    [viewLessonDetailVoByTopic],
  );

  // if (loading) {
  //   return <InstagramLoader active />;
  // }
  return (
    <View>
      <RowContainer
        marginLeft={24}
        marginRight={4}
        justifyContent={'space-between'}>
        <View style={{flex: 1}}>
          <Text h4 color={colors.helpText} bold accented>
            {data.title}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            navigator.navigate('VocabularyCategory', {params: data.topic});
          }}>
          <Text h6 color={colors.facebook}>
            {translate('Xem tất cả')}
          </Text>
        </TouchableOpacity>
      </RowContainer>
      <FlatList
        data={data.data}
        keyExtractor={(item) => item._id}
        renderItem={renderTopicWorld}
        ItemSeparatorComponent={() => <SeparatorVertical sm />}
        horizontal
        style={stylesVocabulary.topicContainer}
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={() => <SeparatorVertical slg />}
      />
    </View>
  );
};
VocabularyTopicListItem.propTypes = {
  data: PropTypes.object,
};
VocabularyTopicListItem.defaultProps = {
  data: {},
};
const stylesVocabulary = StyleSheet.create({
  topicContainer: {paddingHorizontal: 24, paddingVertical: 16},
});
export default VocabularyTopicListItem;
