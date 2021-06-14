import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import Swiper from 'react-native-swiper';
import HTMLView from 'react-native-htmlview';
import {useDispatch} from 'react-redux';

import UserShortDesc from '~/BaseComponent/components/elements/homework/UserShortDesc';
import {
  SeparatorHorizontal,
  SeparatorVertical,
  Text,
  ThumbnailVideo,
} from '~/BaseComponent/index';
import ActivityHomework from '~/BaseComponent/components/elements/activity/ActivityHomework';
import navigator from '~/navigation/customNavigator';
import {colors} from '~/themes';
import {selectedHomework} from '~/features/homework/HomeworkAction';
import {OS} from '~/constants/os';
import {getDimensionVideo169, getRangeTime} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

const DomParser = require('react-native-html-parser').DOMParser;

const HomeWorkDescription = (props) => {
  const dispatch = useDispatch();
  const [shortContent, setShortContent] = useState('');
  useEffect(() => {
    if (props.shortDescription) {
      let doc = new DomParser().parseFromString(
        `<body>${props.shortDescription}</body>`,
        'text/html',
      );
      const paragraphs = doc.querySelect('p');
      if (paragraphs.length > 0) {
        setShortContent(doc.querySelect('p')[0].textContent);
      }
    }
  }, [props.shortDescription]);

  const renderItem = React.useCallback(({item}) => {
    return <ActivityHomework dataAction={item} />;
  }, []);

  const {dataAction} = props;

  const renderImage = React.useCallback((image) => {
    return (
      <Image
        key={image}
        source={{uri: image}}
        style={{
          width: OS.WIDTH,
          height: getDimensionVideo169(OS.WIDTH),
        }}
      />
    );
  }, []);

  return (
    <View backgroundColor={colors.white}>
      <View paddingHorizontal={16} paddingTop={16}>
        <UserShortDesc
          source={
            dataAction.teacher && dataAction.teacher.avatar
              ? {uri: dataAction.teacher.avatar}
              : null
          }
          dataAction={dataAction.teacher}
          title={dataAction.teacher ? dataAction.teacher.full_name : ''}
          sideContent={getRangeTime(dataAction.created_at)}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            dispatch(selectedHomework(dataAction));
            navigator.navigate('HomeworkDetail');
          }}>
          <>
            <Text paddingTop={16} paddingBottom={12} h5 bold>
              {props.dataAction.name}
            </Text>

            {props.shortDescription && (
              <HTMLView
                value={`<body><p>${shortContent}<bdi>&nbsp ${translate(
                  'Xem chi tiết',
                )} &gt;</bdi></p></body>`}
                stylesheet={styles}
              />
            )}
          </>
        </TouchableOpacity>
        {props.content && (
          <HTMLView
            value={`<body>${props.content}</body>`}
            stylesheet={styles}
          />
        )}
      </View>
      {dataAction.attachment && dataAction.attachment.type === 'video' && (
        <>
          <SeparatorVertical md />
          <ThumbnailVideo
            attachment={{
              path: {
                id: dataAction.attachment.items[0],
              },
            }}
          />
        </>
      )}
      {dataAction.attachment && dataAction.attachment.type === 'image' && (
        <>
          <SeparatorVertical md />
          <Swiper
            containerStyle={{
              width: OS.WIDTH,
              height: getDimensionVideo169(OS.WIDTH),
            }}
            activeDotColor={colors.white}
            buttonWrapperStyle={{color: colors.white}}
            nextButton={
              <Text fontSize={50} accented color={colors.white}>
                ›
              </Text>
            }
            prevButton={
              <Text fontSize={50} accented color={colors.white}>
                ‹
              </Text>
            }
            showsButtons={true}>
            {dataAction.attachment.items.map((item) => {
              return renderImage(item);
            })}
          </Swiper>
        </>
      )}
      {props.showListActivity && (
        <>
          <View paddingHorizontal={16}>
            <Text lineHeight={24} h5 bold paddingVertical={16}>
              {translate('Danh sách bài tập')}
            </Text>
          </View>
          <FlatList
            data={dataAction.activities}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item._id}_${index}`}
            horizontal
            paddingHorizontal={16}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <SeparatorHorizontal sm />}
            ListFooterComponent={() => <SeparatorHorizontal slg />}
          />
          <SeparatorVertical lg />
        </>
      )}
    </View>
  );
};
HomeWorkDescription.propTypes = {
  shortDescription: PropTypes.string,
  content: PropTypes.string,
  action: PropTypes.func,
  dataAction: PropTypes.object,
  showListActivity: PropTypes.bool,
};
HomeWorkDescription.defaultProps = {
  shortDescription: null,
  content: null,
  action: () => {},
  dataAction: {},
  showListActivity: true,
};
const styles = StyleSheet.create({
  p: {
    fontFamily: 'CircularStd-Book',
    color: colors.helpText,
    fontSize: 17,
    lineHeight: 22,
    paddingBottom: 0,
    marginBottom: 0,
  },
  bdi: {
    fontFamily: 'CircularStd-Book',
    color: colors.facebook,
    fontSize: 17,
    lineHeight: 22,
    paddingBottom: 0,
    marginBottom: 0,
  },
});

export default HomeWorkDescription;
