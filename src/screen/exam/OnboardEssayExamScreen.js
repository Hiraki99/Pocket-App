import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';
import HtmlDiff from 'htmldiff-js';
import moment from 'moment';
import HTMLView from 'react-native-htmlview';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import {
  Button,
  Card,
  CommonHeader,
  FlexContainer,
  RowContainer,
  Text,
} from '~/BaseComponent';
import ExamApi from '~/features/exam/ExamApi';
import {formatDuration, getColorProgressByScore} from '~/utils/utils';
import navigator from '~/navigation/customNavigator';
import {OS} from '~/constants/os';
import {colors} from '~/themes';
import {setDetailEssayExam} from '~/features/exam/ExamAction';
import {translate} from '~/utils/multilanguage';

const OnboardEssayExamScreen = () => {
  const params = navigator.getParam('params', {});
  const dispatch = useDispatch();
  const detailEssayExam = useSelector(
    (state) => state.overviewExam.detailEssayExam,
    shallowEqual,
  );
  const [time, setTime] = useState(0);
  useEffect(() => {
    const getDataDetail = async (id) => {
      const res = await ExamApi.getDetailExamEssayUser({
        writing_test_id: id,
      });
      if (res.ok) {
        let dataDetail = res.data;
        if (res.data && res.data.state === 'reviewed') {
          let outputHtml = HtmlDiff.execute(
            dataDetail.user_answer,
            dataDetail.correct_answer,
          );
          outputHtml = outputHtml.split('</del><ins').join('</del>&nbsp;<ins');
          dataDetail = {
            ...dataDetail,
            comparedHtml: outputHtml,
          };
        }
        dispatch(setDetailEssayExam(dataDetail));
      } else {
        Alert.alert(
          `${translate('Thông báo')}`,
          `${translate('Có lỗi xảy ra, Vui lòng thử lại!')}`,
          [
            {
              text: `${translate('Thử lại')}`,
              onPress: () => getDataDetail(id),
            },
            {
              text: `${translate('Bỏ qua')}`,
              onPress: () => navigator.goBack(),
            },
          ],
        );
      }
    };
    if (params._id || params.writing_test) {
      getDataDetail(params.writing_test ? params.writing_test._id : params._id);
    }
  }, [params, dispatch]);

  useEffect(() => {
    let interval;
    if (detailEssayExam && detailEssayExam.state === 'pending') {
      interval = setInterval(() => {
        setTime(moment().diff(moment(detailEssayExam.created_at), 's'));
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [detailEssayExam]);

  const renderNullStatus = useCallback(() => {
    return (
      <FlexContainer
        marginTop={2}
        paddingHorizontal={40}
        backgroundColor={colors.white}
        justifyContent={'space-between'}
        paddingVertical={48}>
        <View backgroundColor={colors.white}>
          <Text fontSize={40} color={colors.helpText} bold accented>
            {detailEssayExam.name || detailEssayExam.writing_test?.name}
          </Text>
          <Text h5 color={colors.helpText} paddingVertical={12}>
            {detailEssayExam.question || detailEssayExam.writing_test?.question}
          </Text>
        </View>
        <Button
          primary
          rounded
          large
          shadow={!OS.IsAndroid}
          icon
          uppercase
          bold
          onPress={() => {
            navigator.navigate('EditorEssayExam', {params: detailEssayExam});
          }}>
          {`${translate('Bắt đầu viết')}`}
        </Button>
      </FlexContainer>
    );
  }, [detailEssayExam]);

  const renderPendingStatus = useCallback(() => {
    const isUpdated = time <= 3600;

    return (
      <ScrollView
        marginTop={2}
        paddingHorizontal={24}
        backgroundColor={colors.white}
        showsVerticalScrollIndicator={false}
        paddingVertical={24}>
        <View>
          <Text h4 primary medium paddingBottom={8}>
            {`${translate('Đề bài')}`}
          </Text>
          <Text h5>
            {detailEssayExam.question || detailEssayExam.writing_test?.question}
          </Text>
        </View>
        <Text h4 primary medium paddingVertical={16}>
          {`${translate('Bài làm')}`}
        </Text>
        <Card style={{paddingTop: 8, paddingBottom: 16, borderRadius: 8}}>
          <RowContainer
            paddingVertical={8}
            paddingHorizontal={16}
            justifyContent={'space-between'}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: colors.floatingPlaceHolder,
            }}>
            <Text danger fontSize={16} style={{fontStyle: 'italic'}}>
              {`${translate('Bài đang chờ chấm điểm')}`}
            </Text>
            {isUpdated && time > 0 && (
              <TouchableWithoutFeedback
                onPress={() => {
                  navigator.navigate('EditorEssayExam', {
                    params: detailEssayExam,
                  });
                }}>
                <RowContainer
                  paddingHorizontal={8}
                  paddingVertical={4}
                  borderRadius={8}
                  backgroundColor={colors.floatingPlaceHolder}>
                  <Ionicons
                    name={'md-pencil'}
                    color={colors.helpText}
                    size={20}
                  />
                  <Text uppercase paddingHorizontal={4}>
                    {/* {`Sửa (${formatDuration(3600 - time, 'mm:ss')})`} */}
                    `$
                    {translate('Sửa (%s)', {
                      s1: `${formatDuration(3600 - time, 'mm:ss')}`,
                    })}
                    `
                  </Text>
                </RowContainer>
              </TouchableWithoutFeedback>
            )}
          </RowContainer>
          <View paddingHorizontal={16} paddingVertical={16}>
            <HTMLView
              value={`<body>${detailEssayExam.user_answer}</body>`}
              stylesheet={styles}
            />
          </View>
        </Card>
      </ScrollView>
    );
  }, [detailEssayExam, time]);

  const renderReviewedStatus = useCallback(() => {
    return (
      <ScrollView
        marginTop={2}
        paddingHorizontal={24}
        backgroundColor={colors.white}
        showsVerticalScrollIndicator={false}
        marginVertical={24}>
        <View paddingTop={24}>
          <Text h4 primary medium paddingBottom={8}>
            {`${translate('Đề bài')}`}
          </Text>
          <Text h5>
            {detailEssayExam.question || detailEssayExam.writing_test?.question}
          </Text>
        </View>
        <RowContainer paddingVertical={16}>
          <Card
            borderRaidus={8}
            paddingHorizontal={16}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 160,
              flex: 1,
            }}>
            <Text h4 medium>
              {`${translate('Điểm số')}`}
            </Text>
            <Text fontSize={80} accented danger medium>
              {detailEssayExam.average_score}
            </Text>
          </Card>
        </RowContainer>
        <Card
          borderRaidus={8}
          style={{
            flex: 1,
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}>
          <RowContainer>
            <Text h6 paddingVertical={16} style={{width: 140}}>
              {`${translate('Viết đúng yêu cầu')}`}
            </Text>
            <RowContainer>
              <Text h6 primary bold paddingRight={8}>
                {detailEssayExam.correct_requirement_score}
              </Text>
              <Progress.Bar
                progress={detailEssayExam.correct_requirement_score / 100}
                width={160}
                color={getColorProgressByScore(
                  detailEssayExam.correct_requirement_score,
                )}
                unfilledColor="#F3F5F9"
                height={8}
                borderColor="transparent"
                style={{borderRadius: 8}}
              />
            </RowContainer>
          </RowContainer>
          <RowContainer>
            <Text h6 paddingVertical={8} paddingRight={16} style={{width: 140}}>
              {`${translate('Tính nhất quán và gắn kết')}`}
            </Text>
            <RowContainer>
              <Text
                h6
                primary
                bold
                paddingVertical={8}
                paddingRight={8}
                marginTop={4}>
                {detailEssayExam.consistency_score}
              </Text>
              <Progress.Bar
                progress={detailEssayExam.consistency_score / 100}
                width={160}
                height={8}
                color={getColorProgressByScore(
                  detailEssayExam.consistency_score,
                )}
                borderColor="transparent"
                unfilledColor="#F3F5F9"
                style={{marginTop: 4, borderRadius: 8}}
              />
            </RowContainer>
          </RowContainer>
          <RowContainer>
            <Text h6 paddingVertical={8} paddingRight={16} style={{width: 140}}>
              {`${translate('Từ vựng và chính tả')}`}
            </Text>
            <RowContainer>
              <Text h6 primary bold paddingRight={8}>
                {detailEssayExam.vocabulary_score}
              </Text>
              <Progress.Bar
                progress={detailEssayExam.vocabulary_score / 100}
                width={160}
                height={8}
                color={getColorProgressByScore(
                  detailEssayExam.vocabulary_score,
                )}
                unfilledColor="#F3F5F9"
                borderColor="transparent"
                style={{
                  borderBottomLeftRadius: 4,
                  borderTopLeftRadius: 4,
                }}
              />
            </RowContainer>
          </RowContainer>
          <RowContainer paddingBottom={8}>
            <Text h6 paddingRight={16} paddingVertical={8} style={{width: 140}}>
              {`${translate('Sử dụng ngữ pháp')}`}
            </Text>
            <RowContainer>
              <Text
                h6
                primary
                bold
                // paddingVertical={16}
                paddingRight={8}
                marginTop={4}>
                {detailEssayExam.grammar_score}
              </Text>
              <Progress.Bar
                progress={detailEssayExam.grammar_score / 100}
                width={160}
                height={8}
                color={getColorProgressByScore(detailEssayExam.grammar_score)}
                unfilledColor="#F3F5F9"
                borderColor="transparent"
                style={{marginTop: 4, borderRadius: 8}}
              />
            </RowContainer>
          </RowContainer>
        </Card>
        <Text h4 primary medium paddingVertical={16}>
          {`${translate('Bài làm')}`}
        </Text>
        <Card style={{paddingTop: 16, paddingBottom: 16, borderRadius: 8}}>
          <View paddingHorizontal={16}>
            <HTMLView
              value={`<body>${detailEssayExam.comparedHtml}</body>`}
              stylesheet={styles}
            />
          </View>
        </Card>
        <Text h4 primary medium paddingVertical={16}>
          {`${translate('Nhận xét')}`}
        </Text>
        <Card style={{paddingTop: 16, paddingBottom: 16, borderRadius: 8}}>
          <View paddingHorizontal={16}>
            <HTMLView
              value={`<body><p>${translate(
                'Sai tên hãng công nghệ của mỹ',
              )}</p></body>`}
              stylesheet={styles}
            />
          </View>
        </Card>
      </ScrollView>
    );
  }, [detailEssayExam]);

  return (
    <FlexContainer backgroundColor={colors.mainBgColor}>
      <CommonHeader
        themeWhite
        title={detailEssayExam?.name || detailEssayExam?.writing_test?.name}
      />
      <FlexContainer backgroundColor={colors.white} marginTop={2}>
        {!detailEssayExam ? (
          <ActivityIndicator
            size={'large'}
            color={colors.floatingPlaceHolder}
          />
        ) : (
          <>
            {!detailEssayExam.state && renderNullStatus()}
            {detailEssayExam.state === 'pending' && renderPendingStatus()}
            {detailEssayExam.state === 'reviewed' && renderReviewedStatus()}
          </>
        )}
      </FlexContainer>
    </FlexContainer>
  );
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
  li: {
    fontFamily: 'CircularStd-Book',
    color: colors.helpText,
    fontSize: 17,
    lineHeight: 22,
    paddingBottom: 0,
    marginBottom: 0,
  },
  del: {
    fontFamily: 'CircularStd-Book',
    color: colors.danger,
    fontSize: 17,
    marginRight: 10,
    textDecorationLine: 'line-through',
    lineHeight: 22,
    paddingBottom: 0,
    marginBottom: 0,
  },
  ins: {
    fontFamily: 'CircularStd-Book',
    color: colors.success,
    fontSize: 17,
    paddingLeft: 4,
    lineHeight: 22,
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

export default OnboardEssayExamScreen;
