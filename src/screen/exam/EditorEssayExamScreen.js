import React from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Animated,
  Alert,
} from 'react-native';
import * as Progress from 'react-native-progress';
import HTMLView from 'react-native-htmlview';
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import {connect} from 'react-redux';
import moment from 'moment';

import {
  Card,
  CommonHeader,
  FlexContainer,
  RowContainer,
  Text,
} from '~/BaseComponent';
import {colors} from '~/themes';
import {OS} from '~/constants/os';
import navigator from '~/navigation/customNavigator';
import HomeworkApi from '~/features/homework/HomeworkApi';
import {
  formatsMinuteOptions,
  getColorProgressByScore,
  showResponse,
} from '~/utils/utils';
import {setDetailEssayExam} from '~/features/exam/ExamAction';
import {translate} from '~/utils/multilanguage';

class EditorEssayExamScreen extends React.PureComponent {
  richText = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      value: new Animated.Value(0),
      loadingEditorDone: false,
      loadingApi: true,
      content: '',
      detailWritingHomework: null,
      disableEditor: false,
      timeEditor: 0,
    };
    this.keyboardEventListeners = [];
    this.scrollView = null;
  }

  async componentDidMount() {
    if (OS.IsAndroid) {
      this.keyboardEventListeners = [
        Keyboard.addListener('keyboardWillShow', this.onKeyboardWillShow),
        Keyboard.addListener('keyboardWillHide', this.onKeyboardWillHide),
      ];
    } else {
      this.keyboardEventListeners = [
        Keyboard.addListener('keyboardDidShow', this.onKeyboardWillShow),
        Keyboard.addListener('keyboardDidHide', this.onKeyboardWillHide),
      ];
    }
    const params = navigator.getParam('params', {});

    HomeworkApi.fetchDetailHomework({
      id: params.id,
    }).then((detailHomework) => {
      if (detailHomework.ok && detailHomework.data) {
        this.setState({
          detailWritingHomework: detailHomework.data.data,
          content:
            detailHomework?.data?.data?.exercise_writing_user?.user_answer ||
            '',
          loadingApi: false,
        });
        const diff = moment().diff(moment(detailHomework.data.updated_at), 's');
        if (diff > 3600) {
          this.setState({disableEditor: true});
        } else {
          this.interval = setInterval(() => {
            const diffCurrent = moment().diff(
              moment(detailHomework.data.updated_at),
              's',
            );
            if (diffCurrent > 3600) {
              this.setState({disableEditor: true});
              clearInterval(this.interval);
            } else {
              this.setState({
                timeEditor: 3600 - diffCurrent,
                disableEditor: false,
              });
            }
          });
        }
        this.setState({loadingEditorDone: true});
      }
    });
  }

  componentWillUnmount() {
    this.keyboardEventListeners.forEach((eventListener) =>
      eventListener.remove(),
    );
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  onKeyboardWillShow = () => {
    Animated.timing(this.state.value, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    if (this.scrollView) {
      this.scrollView.scrollToEnd();
    }
  };

  onKeyboardWillHide = () => {
    Animated.timing(this.state.value, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    if (this.scrollView) {
      this.scrollView.scrollTo({x: 0, y: 0, animated: true});
    }
  };

  onKeyBoard = () => {
    TextInput.State.currentlyFocusedField();
  };

  editorInitializedCallback = () => {
    this.richText.current?.registerToolbar(function (items) {
      console.log(
        'Toolbar click, selected items (insert end callback):',
        items,
      );
    });
  };

  handleChange = (html) => {
    this.setState({content: html});
  };

  handleHeightChange = () => {
    // console.log('editor height change:', height);
  };

  saveContent = async () => {
    const params = navigator.getParam('params', {});
    if (this.state.content.length === 0) {
      Alert.alert(
        `${translate('Thông báo')}`,
        `${translate('Câu trả lời không được để trống')}`,
        [{text: `${translate('Đồng ý')}`}],
      );
      return;
    }
    Keyboard.dismiss();
    const res = await HomeworkApi.saveWritingHomework({
      exercise_id: params.id,
      user_answer: this.state.content,
    });
    console.log('saveContent ', res);
    if (res.ok) {
      navigator.goBack();
      showResponse(true, `${translate('Đã nộp bài kiểm tra')}`);
    } else {
      Alert.alert(
        `${translate('Thông báo')}`,
        res.data?.message ||
          `${translate('Có lỗi xảy ra, vui lòng thử lại sau!')}`,
        [
          {
            text: `${translate('Đồng ý')}`,
          },
        ],
      );
    }
  };

  onLayout = (e) => {
    const {
      nativeEvent: {
        layout: {height},
      },
    } = e;
    this.setState({heightTitle: height});
  };

  renderExamPending = () => {
    const params = navigator.getParam('params', {});
    const {detailWritingHomework} = this.state;

    return (
      <ScrollView
        ref={(refs) => {
          this.scrollView = refs;
        }}
        showsVerticalScrollIndicator={false}
        style={{flex: 1}}>
        <View paddingHorizontal={16} onLayout={this.onLayout}>
          <Text h4 primary medium paddingBottom={8}>
            {`${translate('Đề bài')}`}
          </Text>
          <HTMLView
            value={`<body>${
              params.content || detailWritingHomework?.content || ''
            }</body>`}
            stylesheet={stylesHtml}
          />
        </View>
        <RowContainer
          justifyContent={'space-between'}
          paddingHorizontal={16}
          paddingVertical={8}>
          <Text h4 primary medium paddingVertical={8}>
            {`${translate('Bài làm')}`}
          </Text>
          {!detailWritingHomework ? (
            <></>
          ) : (
            <>
              {detailWritingHomework.state === 'pending' && (
                <>
                  {this.state.disableEditor ? (
                    <View
                      borderRadius={8}
                      backgroundColor={colors.milanoRed}
                      paddingHorizontal={16}
                      width={100}
                      paddingVertical={8}>
                      <Text h5 color={colors.white} medium center>
                        {`${translate('Quá hạn')}`}
                      </Text>
                    </View>
                  ) : (
                    <>
                      {this.state.timeEditor > 0 && (
                        <View
                          borderRadius={8}
                          backgroundColor={colors.success}
                          paddingHorizontal={16}
                          width={100}
                          paddingVertical={8}>
                          <Text h5 color={colors.white} medium center>
                            {formatsMinuteOptions(this.state.timeEditor)}
                          </Text>
                        </View>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </RowContainer>
        {!this.state.loadingApi && (
          <>
            {this.state.loadingEditorDone && (
              <RichToolbar
                style={[styles.richBar]}
                editor={this.richText}
                disabled={false}
                iconTint={colors.placeHolder}
                selectedIconTint={colors.black}
                disabledIconTint={colors.placeHolder}
                onPressAddImage={this.onPressAddImage}
                onInsertLink={this.onInsertLink}
                iconSize={24} // default 50
                actions={[
                  actions.setBold,
                  actions.setItalic,
                  actions.insertOrderedList,
                  actions.insertBulletsList,
                  actions.heading1,
                  actions.heading3,
                  'saveContent',
                ]}
                iconMap={{
                  [actions.setBold]: ({tintColor}) => (
                    <Text
                      fontSize={24}
                      style={[styles.tib, {color: tintColor}]}>
                      B
                    </Text>
                  ),
                  [actions.setItalic]: ({tintColor}) => (
                    <Text
                      fontSize={24}
                      style={[styles.tib, {color: tintColor}]}>
                      I
                    </Text>
                  ),
                  [actions.heading1]: ({tintColor}) => (
                    <Text
                      fontSize={21}
                      style={[styles.tib, {color: tintColor}]}>
                      H1
                    </Text>
                  ),
                  [actions.heading3]: ({tintColor}) => (
                    <Text
                      fontSize={21}
                      style={[styles.tib, {color: tintColor}]}>
                      H3
                    </Text>
                  ),
                  ['saveContent']: ({tintColor}) => (
                    <>
                      {!this.state.disableEditor && (
                        <Text
                          fontSize={21}
                          style={[styles.tib, {color: tintColor}]}>
                          {`${translate('Lưu')}`}
                        </Text>
                      )}
                    </>
                  ),
                }}
                saveContent={this.saveContent}
              />
            )}
            <RichEditor
              initialFocus={false}
              disabled={false}
              editorStyle={{
                backgroundColor: colors.white,
                color: colors.helpText,
                placeholderColor: 'gray',
                cssText: `#editor {background-color: ${colors.white} }`,
                contentCSSText: `font-size: 18px; min-height: ${
                  OS.HEIGHT - 200
                }px`,
              }}
              containerStyle={{
                paddingHorizontal: 8,
                backgroundColor: colors.white,
                paddingTop: 8,
                borderRadius: 8,
              }}
              ref={this.richText}
              style={[styles.rich]}
              placeholder={`${translate('Bài trả lời ...')}`}
              initialContentHTML={`${this.state.content}`}
              value={this.state.content}
              editorInitializedCallback={this.editorInitializedCallback}
              onChange={this.handleChange}
              onHeightChange={this.handleHeightChange}
              useContainer
              scrollEnabled={true}
            />
          </>
        )}
      </ScrollView>
    );
  };

  renderReviewedStatus = () => {
    const params = navigator.getParam('params', {});
    const detailEssayExam = this.state.detailWritingHomework;

    return (
      <ScrollView
        paddingHorizontal={24}
        backgroundColor={colors.white}
        showsVerticalScrollIndicator={false}>
        <View paddingTop={24}>
          <Text h4 primary medium paddingBottom={8}>
            {`${translate('Đề bài')}`}
          </Text>
          <HTMLView
            value={`<body>${params.content}</body>`}
            stylesheet={stylesHtml}
          />
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
              `${translate('Điểm số')}`
            </Text>
            <Text fontSize={80} accented danger medium>
              {detailEssayExam?.exercise_writing_user?.average_score || 0}
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
                {
                  detailEssayExam?.exercise_writing_user
                    ?.correct_requirement_score
                }
              </Text>
              <Progress.Bar
                progress={
                  detailEssayExam?.exercise_writing_user
                    ?.correct_requirement_score / 100
                }
                width={160}
                color={getColorProgressByScore(
                  detailEssayExam?.exercise_writing_user
                    ?.correct_requirement_score,
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
                {detailEssayExam?.exercise_writing_user?.consistency_score}
              </Text>
              <Progress.Bar
                progress={
                  detailEssayExam?.exercise_writing_user?.consistency_score /
                  100
                }
                width={160}
                height={8}
                color={getColorProgressByScore(
                  detailEssayExam?.exercise_writing_user?.consistency_score,
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
                {detailEssayExam?.exercise_writing_user?.vocabulary_score}
              </Text>
              <Progress.Bar
                progress={
                  detailEssayExam?.exercise_writing_user?.vocabulary_score / 100
                }
                width={160}
                height={8}
                color={getColorProgressByScore(
                  detailEssayExam?.exercise_writing_user?.vocabulary_score,
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
                {detailEssayExam?.exercise_writing_user?.grammar_score}
              </Text>
              <Progress.Bar
                progress={
                  detailEssayExam?.exercise_writing_user?.grammar_score / 100
                }
                width={160}
                height={8}
                color={getColorProgressByScore(
                  detailEssayExam?.exercise_writing_user?.grammar_score,
                )}
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
              value={`<body>${detailEssayExam?.exercise_writing_user?.user_answer}</body>`}
              stylesheet={stylesHtml}
            />
          </View>
        </Card>
        <Text h4 primary medium paddingVertical={16}>
          {`${translate('Bài chữa')}`}
        </Text>
        <Card style={{paddingTop: 16, paddingBottom: 16, borderRadius: 8}}>
          <View paddingHorizontal={16}>
            <HTMLView
              value={`<body>${detailEssayExam?.exercise_writing_user?.correct_answer}</body>`}
              stylesheet={stylesHtml}
            />
          </View>
        </Card>
        <Text h4 primary medium paddingVertical={16}>
          {`${translate('Nhận xét')}`}
        </Text>
        <Card
          style={{
            paddingTop: 16,
            paddingBottom: 16,
            borderRadius: 8,
            marginBottom: OS.hasNotch ? 48 : 24,
          }}>
          <View paddingHorizontal={16}>
            <HTMLView
              value={`<body>${detailEssayExam?.exercise_writing_user?.review}</body>`}
              stylesheet={styles}
            />
          </View>
        </Card>
      </ScrollView>
    );
  };

  render() {
    const params = navigator.getParam('params', {});
    const {detailWritingHomework} = this.state;

    return (
      <FlexContainer>
        <CommonHeader
          themeWhite
          title={
            detailWritingHomework ? detailWritingHomework?.name : params.name
          }
        />
        <FlexContainer
          backgroundColor={colors.mainBgColor}
          style={{overflow: 'hidden'}}
          marginTop={2}>
          {detailWritingHomework &&
          detailWritingHomework.exercise_writing_user &&
          detailWritingHomework.exercise_writing_user.state === 'reviewed'
            ? this.renderReviewedStatus()
            : this.renderExamPending()}
        </FlexContainer>
      </FlexContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainBgColor,
    paddingBottom: 24,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
  },
  rich: {
    // height: 500,
    // flex: 1,
  },
  richBar: {
    height: 50,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: colors.floatingPlaceHolder,
    borderBottomColor: colors.floatingPlaceHolder,
  },
  scroll: {
    backgroundColor: '#ffffff',
  },
  item: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e8e8e8',
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  input: {
    flex: 1,
  },

  tib: {
    textAlign: 'center',
    color: '#515156',
  },
});

const stylesHtml = StyleSheet.create({
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
  // p: {
  //   fontFamily: 'CircularStd-Book',
  //   color: colors.helpText,
  //   fontSize: 17,
  //   lineHeight: 22,
  //   paddingBottom: 0,
  //   marginBottom: 0,
  // },
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
  // bdi: {
  //   fontFamily: 'CircularStd-Book',
  //   color: colors.facebook,
  //   fontSize: 17,
  //   lineHeight: 22,
  //   paddingBottom: 0,
  //   marginBottom: 0,
  // },
});

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

export default connect(mapStateToProps, {setDetailEssayExam})(
  EditorEssayExamScreen,
);
