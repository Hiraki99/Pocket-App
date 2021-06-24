import React from 'react';

// import PropTypes from 'prop-types';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {Platform, ScrollView} from 'react-native';
import {WebView} from 'react-native-webview';

import {forceBackActivity} from '~/utils/utils';
import {
  Button,
  CommonHeader,
  FlexContainer,
  SeparatorVertical,
} from '~/BaseComponent/index';
import {
  changeCurrentScriptItem,
  resetAction,
} from '~/features/script/ScriptAction';
import {colors} from '~/themes';
import {generateNextActivity} from '~/utils/script';
import {OS} from '~/constants/os';
import {translate} from '~/utils/multilanguage';

const runFirst = `
      var elmnt = document.getElementById("myDIV");
      window.ReactNativeWebView.postMessage(elmnt.offsetHeight);
    `;

const SummaryReviewScreen = () => {
  const isActivityVip = useSelector(
    (state) => state.activity.isActivityVip,
    shallowEqual,
  );
  const fromWordGroup = useSelector(
    (state) => state.vocabulary.fromWordGroup,
    shallowEqual,
  );
  const currentScriptItem = useSelector(
    (state) => state.script.currentScriptItem,
    shallowEqual,
  );
  const dispatch = useDispatch();
  const [heightWV, setHeightWV] = React.useState(0);
  const onBack = React.useCallback(() => {
    const reset = () => {
      dispatch(changeCurrentScriptItem(null));
      dispatch(resetAction());
    };
    forceBackActivity(false, reset, isActivityVip, fromWordGroup);
  }, [dispatch, isActivityVip, fromWordGroup]);
  const onMessage = (event) => {
    const data = event.nativeEvent.data;
    setHeightWV(
      parseInt(data) < (OS.HEIGHT * 3) / 5
        ? (OS.HEIGHT * 3) / 5
        : parseInt(data),
    );
  };
  const generateAssetsFontCss = (
    fontFileName: string,
    fileFormat: fontFormats = 'otf',
  ) => {
    const fileUri = Platform.select({
      ios: `${fontFileName}.${fileFormat}`,
      android: `file:///assets/fonts/${fontFileName}.${fileFormat}`,
    });

    return `
    @font-face {
      font-family: '${fontFileName}';
      src: local('${fontFileName}'), url('${fileUri}') format('otf');
    }
	`;
  };

  return (
    <FlexContainer backgroundColor={colors.mainBgColor}>
      <CommonHeader
        title={`${translate('Lesson Review')}`}
        themeWhite
        onBack={onBack}
      />
      <ScrollView backgroundColor={colors.mainBgColor}>
        <FlexContainer
          backgroundColor={colors.mainBgColor}
          marginTop={2}
          paddingHorizontal={16}>
          <WebView
            showsVerticalScrollIndicator={false}
            injectedJavaScript={runFirst}
            onMessage={onMessage}
            originWhiteList={['*']}
            useWebKit
            onError={(e) =>
              alert(
                JSON.stringify({
                  error: e.nativeEvent,
                }),
              )
            }
            source={{
              baseUrl: null,
              html: `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
                <style media="screen" type="text/css">
                  ${generateAssetsFontCss('CircularStd-Book', 'otf')}
                  * {
                    font-family: 'Circular Std';
                    /*font-size: 17px;*/
                    /*line-height: 30px;*/
                    word-wrap: break-word;
                    text-align: justify-all;
                  }
                  p {
                    /*font-family: 'CircularStd-BookItalic';*/
                    margin-bottom: -10px;
                  }
                  body {
                    font-family: 'Circular Std';
                    font-size: 20px;
                    line-height: 28px;
                    word-wrap: break-word;
                    text-align: justify-all;
                    background: ${colors.mainBgColor};
                  }
                  pre{
                    border-radius: 4px;
                    background-color: #FFFFFF;
                    box-shadow: 0 12px 19px 0 rgba(60, 128, 209, 0.09);
                    padding: 24px;
                  }
                </style>
              </head>
              <body id="myDIV">
                ${currentScriptItem?.content}
              </body>
              </html>
              `,
            }}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            style={{
              borderRadius: 8,
              marginBottom: 24,
              height: heightWV + 200,
            }}
          />
          <SeparatorVertical lg />
          <Button
            large
            primary
            rounded
            block
            uppercase
            bold
            onPress={() => generateNextActivity()}>
            Hoàn thành
          </Button>
          <SeparatorVertical slg={OS.hasNotch} lg={!OS.hasNotch} />
        </FlexContainer>
      </ScrollView>
    </FlexContainer>
  );
};
SummaryReviewScreen.propTypes = {};
SummaryReviewScreen.defaultProps = {};
export default SummaryReviewScreen;
