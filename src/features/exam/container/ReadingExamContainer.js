import React from 'react';
import {Platform} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import {WebView} from 'react-native-webview';

import {NoFlexContainer, SeparatorVertical, Text} from '~/BaseComponent';
import EmbedAudio from '~/BaseComponent/components/elements/script/EmbedAudio';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';

const fileUri = Platform.select({
  ios: 'CircularStd-Book.otf',
  android: 'file:///assets/fonts/CircularStd-Book.otf',
});

export const ReadingExamContainer = () => {
  const currentSection = useSelector(
    (state) => state.exam.currentSection || {},
    shallowEqual,
  );

  const currentPart = useSelector(
    (state) => state.exam.currentPart,
    shallowEqual,
  );

  const activePartIndex = currentSection._id
    ? currentSection.partIds.indexOf(currentPart._id) > 0
      ? currentSection.partIds.indexOf(currentPart._id)
      : 0
    : 0;

  return (
    <>
      {currentPart.audio && (
        <EmbedAudio
          isUser={true}
          audio={currentPart.audio}
          isSquare={true}
          showTime={true}
        />
      )}
      <NoFlexContainer paddingTop={32} paddingHorizontal={16}>
        <Text h5 color={colors.primary} bold uppercase>
          {translate('Part %s', {
            s1: `${activePartIndex + 1}/${currentSection.partIds.length}`,
          })}
        </Text>
      </NoFlexContainer>
      <WebView
        showsVerticalScrollIndicator={false}
        originWhiteList={['*']}
        useWebKit={false}
        onError={(e) =>
          alert(
            JSON.stringify({
              error: e.nativeEvent,
            }),
          )
        }
        source={{
          html: `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
                <style>
                  @font-face {
                    font-family: 'CircularStd-Book';
                    src: local('CircularStd-Book'), url('${fileUri}') format('opentype');
                  }
                  * {
                    font-family: 'CircularStd-Book';
                    font-size: 20px;
                    line-height: 30px;
                    word-wrap: break-word;
                    text-align: justify-all;
                  }
                  p {
                    margin-bottom: -10px;
                  }
                  body {
                    font-family: 'CircularStd-Book';
                    font-size: 20px;
                    line-height: 28px;
                    word-wrap: break-word;
                    text-align: justify-all;
                  }
                </style>
              </head>
              <body>
             
                ${
                  currentPart.attachment && currentPart.attachment.item
                    ? currentPart.attachment.item.content
                    : ''
                }
              </body>
              </html>
              `,
        }}
        showsHorizontalScrollIndicator={false}
        style={{
          marginHorizontal: 8,
          flex: 1,
        }}
      />
      <SeparatorVertical lg />
    </>
  );
};
ReadingExamContainer.propTypes = {};
ReadingExamContainer.defaultProps = {};
