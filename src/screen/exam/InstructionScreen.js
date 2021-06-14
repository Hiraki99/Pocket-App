import React, {useEffect} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {View, ScrollView} from 'react-native';
import HTML from 'react-native-render-html';

import {
  Button,
  FlexContainer,
  RowContainer,
  Text,
  CommonHeader,
  SeparatorVertical,
} from '~/BaseComponent';
import {colors} from '~/themes';
import {setCurrentSection} from '~/features/exam/ExamAction';
import {OS} from '~/constants/os';
import navigator from '~/navigation/customNavigator';
import {makeid} from '~/utils/utils';
import timer from '~/utils/timer';
import {translate} from '~/utils/multilanguage';

const InstructionScreen = () => {
  const dispatch = useDispatch();
  const instructions = useSelector(
    (state) => state.exam.introExam.instructions || '',
    shallowEqual,
  );
  const sections = useSelector(
    (state) => state.exam.sections || [],
    shallowEqual,
  );

  useEffect(() => {
    if (sections[0]) {
      dispatch(setCurrentSection(sections[0]));
    }
  }, [dispatch, sections]);

  return (
    <FlexContainer backgroundColor={colors.white}>
      <CommonHeader title={`${translate('Intructions')}`} themeWhite />
      <FlexContainer
        paddingHorizontal={24}
        backgroundColor={colors.white}
        style={{marginTop: 12}}>
        <Text h2 color={colors.helpText} bold paddingVertical={16}>
          {`${translate('Instructions')}`}
        </Text>
        <ScrollView>
          <HTML
            html={instructions || ''}
            allowFontScaling={false}
            containerStyle={{
              marginHorizontal: -16,
            }}
            listsPrefixesRenderers={{
              ul: () => {
                return null;
              },
            }}
            tagsStyles={{
              li: {
                fontSize: 16,
                color: colors.helpText,
                lineHeight: 24,
                fontFamily: 'CircularStd-Book',
              },
            }}
            renderers={{
              li: (htmlAttribs, children) => {
                return (
                  <RowContainer
                    style={{flex: 1}}
                    key={makeid(16)}
                    paddingHorizontal={16}
                    alignItems={'flex-start'}>
                    <View
                      style={{
                        width: 6,
                        height: 6,
                        backgroundColor: colors.primary,
                        marginTop: 10,
                      }}
                    />
                    <View paddingHorizontal={12}>{children}</View>
                  </RowContainer>
                );
              },
            }}
          />
        </ScrollView>
        <Button
          primary
          rounded
          large
          shadow={!OS.IsAndroid}
          icon
          uppercase
          bold
          onPress={() => {
            navigator.navigate('SectionExam');
            timer.startTimer();
          }}>
          {`${translate('OK')}`}
        </Button>
        <SeparatorVertical slg={OS.hasNotch} lg={!OS.hasNotch} />
      </FlexContainer>
    </FlexContainer>
  );
};

export default InstructionScreen;
