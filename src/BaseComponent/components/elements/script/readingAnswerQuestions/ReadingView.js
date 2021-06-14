import React from 'react';
import {ScrollView, View} from 'react-native';
import PropTypes from 'prop-types';
import HTML from 'react-native-render-html';
import FastImage from 'react-native-fast-image';

import {Button, CommonAlert, CommonImage, Text} from '~/BaseComponent';
import EmbedAudioAnimate from '~/BaseComponent/components/elements/result/EmbedAudioAnimate';
import {OS} from '~/constants/os';
import ActivityApi from '~/features/activity/ActivityApi';
import {getDimensionVideo169} from '~/utils/utils';
import {colors, images} from '~/themes';
import {translate} from '~/utils/multilanguage';

const ReadingView = (props) => {
  const {image, title, content, onNext, activeContinue, data} = props;
  const [dataView, setDataView] = React.useState(null);
  const [translateItem, setTranslateItem] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [showTranslate, setShowTranslate] = React.useState(false);
  React.useEffect(() => {
    const fetchViewData = async () => {
      setLoading(true);
      const res = await ActivityApi.fetchReadingContent({
        _id: data?.reading_content?._id,
      });
      setLoading(false);
      if (res.data && res.ok) {
        setDataView(res.data.sentences || []);
      }
    };
    if (data?.reading_type === 'available') {
      fetchViewData();
    } else {
      setLoading(false);
    }
  }, [data]);

  const renderTranslation = React.useCallback(() => {
    if (!translateItem) {
      return null;
    }
    return (
      <CommonAlert
        show={showTranslate}
        title={''}
        html
        subtitle={translateItem?.contentOrigin}
        titleStyle={{
          color: colors.helpText2,
          fontSize: 14,
        }}
        subtitleStyle={{
          fontSize: 17,
          color: colors.helpText,
        }}
        headerIconComponent={
          <FastImage source={images.teacher} style={styles.avatar} />
        }
        onRequestClose={() => {
          setShowTranslate(false);
        }}
        cancellable={false}>
        {translateItem?.audio && (
          <EmbedAudioAnimate
            audio={translateItem?.audio}
            modalResult
            navigateOutScreen={showTranslate}
          />
        )}
        <Text
          center
          color={colors.helpText2}
          uppercase
          style={{marginBottom: 8}}>
          {translate('Bản dịch')}
        </Text>
        <HTML
          html={`${translateItem?.translation}`}
          tagsStyles={styles.tagsTranslateStyles}
        />
        <Button
          primary
          rounded
          large
          marginBottom={24}
          marginTop={24}
          shadow
          onPress={() => {
            setShowTranslate(false);
          }}>
          {translate('OK, ĐÃ HIỂU')}
        </Button>
      </CommonAlert>
    );
  }, [showTranslate, translateItem]);
  const contentHtml = (dataView || [])
    .map(
      (item) =>
        `<a
            id="${item.id}"
            audio="${item.audio}"
            translate='${item.translation}'
            >${`${item.content}`}${item.isEndParagraph ? '<br />' : ''}</a>`,
    )
    .join('');
  return (
    <>
      <ScrollView>
        <CommonImage
          source={{uri: image}}
          style={{
            marginBottom: 40,
            width: OS.WIDTH,
            height: getDimensionVideo169(OS.WIDTH),
          }}
        />
        {loading ? (
          <></>
        ) : (
          <>
            {dataView && dataView.length > 0 ? (
              <View style={{paddingHorizontal: 24}}>
                <Text fontSize={24} bold style={{marginBottom: 20}}>
                  {title}
                </Text>

                <HTML
                  // key={item.id}
                  html={`${contentHtml}`}
                  tagsStyles={styles.tagsStyles}
                  renderers={{
                    a: (
                      htmlAttribs,
                      children,
                      convertedCSSStyles,
                      passProps,
                    ) => {
                      return (
                        <Text
                          {...passProps}
                          accessibilityRole={'button'}
                          accessible
                          onPress={() => {
                            const detailItem = dataView.filter(
                              (item) => item.id === htmlAttribs.id,
                            );
                            setShowTranslate(true);
                            setTranslateItem({
                              audio: htmlAttribs.audio,
                              translation: htmlAttribs.translate,
                              contentOrigin: `<a>${detailItem[0].content}</a>`,
                            });
                          }}>
                          {children}&#160;
                        </Text>
                      );
                    },
                  }}
                />
              </View>
            ) : (
              <View style={{paddingHorizontal: 24}}>
                <Text fontSize={24} bold style={{marginBottom: 20}}>
                  {title}
                </Text>

                <HTML html={content || ''} tagsStyles={styles.tagsStyles} />
              </View>
            )}
          </>
        )}
      </ScrollView>
      {renderTranslation()}
      {activeContinue && (
        <View
          style={{
            paddingTop: 24,
            paddingBottom: OS.hasNotch ? 48 : 24,
            paddingHorizontal: 24,
          }}>
          <Button
            large
            primary
            rounded
            block
            uppercase
            bold
            icon
            onPress={onNext}>
            {translate('Tiếp tục')}
          </Button>
        </View>
      )}
    </>
  );
};

const styles = {
  tagsStyles: {
    p: {
      fontSize: 17,
      fontFamily: 'CircularStd-Book',
      color: colors.helpText,
    },
    strong: {
      fontSize: 17,
      fontFamily: 'CircularStd-Book',
      color: colors.helpText,
    },
    a: {
      fontSize: 17,
      color: colors.helpText,
      textDecorationLine: 'none',
      fontFamily: 'CircularStd-Book',
    },
    article: {
      backgroundColor: 'yellow',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  },
  tagsTranslateStyles: {
    p: {
      fontSize: 17,
      fontFamily: 'CircularStd-Book',
      textAlign: 'center',
      color: colors.helpText,
    },
    strong: {
      fontSize: 17,
      fontFamily: 'CircularStd-Book',
      color: colors.helpText,
    },
  },
  avatar: {
    height: 64,
    width: 64,
    borderRadius: 32,
  },
};

ReadingView.propTypes = {
  title: PropTypes.string,
  image: PropTypes.string,
  content: PropTypes.string,
  onNext: PropTypes.func,
  activeContinue: PropTypes.bool,
  data: PropTypes.object,
};

ReadingView.defaultProps = {
  onNext: () => {},
  activeContinue: true,
  data: {},
};

export default ReadingView;
