import React from 'react';
// import PropTypes from 'prop-types';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {FlatList, TouchableWithoutFeedback} from 'react-native';
import {Icon} from 'native-base';

import {
  Button,
  Card,
  CommonHeader,
  CommonImage,
  FlexContainer,
  NoFlexContainer,
  RowContainer,
  SeparatorVertical,
  Text,
} from '~/BaseComponent/index';
import VocabularyWordSummary from '~/BaseComponent/components/elements/vocabulary/VocabularyWordSummary';
import {
  changeCurrentScriptItem,
  increaseScore,
  resetAction,
} from '~/features/script/ScriptAction';
import {forceBackActivity} from '~/utils/utils';
import {currentLessonSelector} from '~/selector/lesson';
import ActivityApi from '~/features/activity/ActivityApi';
import {colors} from '~/themes';
import {OS} from '~/constants/os';
import {generateNextActivity} from '~/utils/script';
import {translate} from '~/utils/multilanguage';

const SummaryVocabularyScreen = () => {
  const fromWordGroup = useSelector(
    (state) => state.vocabulary.fromWordGroup,
    shallowEqual,
  );
  const currentLesson = useSelector(currentLessonSelector);
  const dispatch = useDispatch();
  const onBack = React.useCallback(() => {
    const reset = () => {
      dispatch(changeCurrentScriptItem(null));
      dispatch(resetAction());
    };
    forceBackActivity(false, reset, false, fromWordGroup);
  }, [dispatch, fromWordGroup]);
  const [data, setData] = React.useState([]);
  const [itemSelected, setItemSelected] = React.useState(null);
  React.useEffect(() => {
    const fetchVocabulary = async () => {
      const res = await ActivityApi.getVocabularyAllActivity({
        lesson_id: currentLesson._id,
      });
      if (res.ok && res.data) {
        setData(res.data.data);
      }
    };
    if (currentLesson) {
      fetchVocabulary();
    }
  }, [currentLesson]);

  const renderItem = React.useCallback(({item}) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          setItemSelected(item);
        }}>
        <Card style={{flexDirection: 'row'}} borderRadius={8}>
          <RowContainer
            paddingVertical={16}
            paddingHorizontal={16}
            justifyContent={'space-between'}
            style={{flex: 1}}>
            <RowContainer style={{flex: 1}}>
              <CommonImage
                source={{uri: item.images[0]}}
                style={{width: 56, height: 56, borderRadius: 12}}
              />
              <FlexContainer paddingHorizontal={16}>
                <Text h5 bold>
                  {item.name}
                </Text>
                <Text fontSize={14} color={colors.hoverText}>
                  {item.meaning}
                </Text>
              </FlexContainer>
            </RowContainer>
            <Icon
              type="Feather"
              name="chevron-right"
              style={{
                color: colors.helpText,
                fontSize: 20,
                opacity: 0.38,
              }}
            />
          </RowContainer>
        </Card>
      </TouchableWithoutFeedback>
    );
  }, []);

  const renderHeader = React.useCallback(() => {
    return (
      <NoFlexContainer
        justifyContent={'center'}
        alignItems={'center'}
        paddingTop={32}
        paddingBottom={16}>
        <Text h4 bold>
          Vocabulary
        </Text>
        <Text paddingVertical={8} color={colors.hoverText}>
          {translate('tất cả %s từ', {
            s1: data.length,
          })}
        </Text>
      </NoFlexContainer>
    );
  }, [data]);

  const renderFooter = React.useCallback(() => {
    return (
      <>
        {data.length > 0 && (
          <>
            <SeparatorVertical lg />
            <Button
              large
              primary
              rounded
              block
              uppercase
              bold
              onPress={() => {
                dispatch(increaseScore(1, 2, 1));
                generateNextActivity();
              }}>
              {`${translate('Hoàn thành')}`}
            </Button>
          </>
        )}
        <SeparatorVertical slg={OS.hasNotch} lg={!OS.hasNotch} />
      </>
    );
  }, [data, dispatch]);

  return (
    <FlexContainer>
      <FlexContainer backgroundColor={colors.mainBgColor} marginTop={8}>
        <CommonHeader
          title={`${translate('Vocabulary')}`}
          themeWhite
          onBack={onBack}
        />
        <FlatList
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{marginHorizontal: 16}}
          data={data}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <SeparatorVertical sm />}
          showsVerticalScrollIndicator={false}
        />
      </FlexContainer>
      {itemSelected && (
        <VocabularyWordSummary
          item={itemSelected}
          onClose={() => setItemSelected(null)}
        />
      )}
    </FlexContainer>
  );
};
SummaryVocabularyScreen.propTypes = {};
SummaryVocabularyScreen.defaultProps = {};
export default SummaryVocabularyScreen;
