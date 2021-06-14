import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import styled from 'styled-components';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import ModalWrapper from 'react-native-modal-wrapper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch} from 'react-redux';

import {
  Card,
  RowContainer,
  SeparatorVertical,
  Text,
} from '~/BaseComponent/index';
import {colors} from '~/themes';
import {OS} from '~/constants/os';
import getAllInfoExamSelector from '~/selector/examSelector';
import {STATUS_QUESTION} from '~/constants/testData';
import {selectPart} from '~/features/exam/ExamAction';
import navigator from '~/navigation/customNavigator';
import {EXAM_TYPE} from '~/constants/exam';
import {translate} from '~/utils/multilanguage';

const ListStatusQuestionModal = (props, ref) => {
  const [show, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  // const question =
  const {questions, showResult, parts} = getAllInfoExamSelector();
  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 400);
  }, []);

  const listAllQuestion = useMemo(() => {
    function compare(a, b) {
      if (a.indexQuestion < b.indexQuestion) {
        return -1;
      }
      if (a.indexQuestion >= b.indexQuestion) {
        return 1;
      }
      return 0;
    }
    let result = [];

    for (let key in questions) {
      if (
        questions[key].childIdsQuestion &&
        questions[key].type !== EXAM_TYPE.select_answer_sentence
      ) {
        questions[key].childIdsQuestion.forEach((it) => {
          result.push(questions[it]);
        });
        continue;
      }
      if (questions[key].parentId) {
        continue;
      }

      if (
        questions[key].childIdsQuestion &&
        questions[key].type === EXAM_TYPE.select_answer_sentence
      ) {
        let statusAnswerQuestion = true;
        questions[key].childIdsQuestion.forEach((it) => {
          statusAnswerQuestion =
            statusAnswerQuestion && questions[it].statusAnswerQuestion;
        });
        result.push({
          ...questions[key],
          statusAnswerQuestion,
        });
      } else {
        result.push(questions[key]);
      }
    }
    return result.sort(compare);
  }, [questions]);

  useImperativeHandle(ref, () => ({
    showModal: () => {
      showModal();
    },
    closeModal: () => {
      closeModal();
    },
  }));

  const showModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const jumpToAnswer = useCallback(
    (item) => {
      setShowModal(false);
      const partsJump = parts[item.partId];
      dispatch(
        selectPart({
          ...parts[item.partId],
          indexJump: item.indexList,
        }),
      );
      if (partsJump.attachment && partsJump.attachment.type === 'reading') {
        navigator.navigate('PartReadingExam');
        return;
      }
      navigator.navigate('PartExam');
      // props.action();
    },
    [dispatch, parts, props],
  );
  const renderItem = useCallback(
    ({item}) => {
      const isSelected = item.status === STATUS_QUESTION.CHECKED;
      const colorSelected = isSelected ? colors.primary : colors.heartDeactive;
      const colorShow = showResult
        ? item.statusAnswerQuestion
          ? colors.successChoice
          : colors.milanoRed
        : colorSelected;

      return (
        <TouchableWithoutFeedback
          onPress={() => {
            jumpToAnswer(item);
          }}>
          <SCard
            colorShow={colorShow}
            showResult={showResult}
            style={styles.answer}>
            <Text h4 color={showResult ? colors.white : colorShow}>
              {item.indexQuestion || item.index || 0}
            </Text>
          </SCard>
        </TouchableWithoutFeedback>
      );
    },
    [showResult, jumpToAnswer],
  );

  return (
    <ModalWrapper
      containerStyle={styles.containerModalStyle}
      onRequestClose={closeModal}
      shouldAnimateOnRequestClose={true}
      style={styles.modalStyle}
      visible={show}>
      <View paddingHorizontal={16}>
        {loading ? (
          <ActivityIndicator size={'large'} center />
        ) : (
          <>
            <RowContainer justifyContent={'space-between'} paddingBottom={16}>
              <Text h4 primary paddingVertical={16}>
                {translate('Danh sách câu hỏi')}
              </Text>
              <TouchableWithoutFeedback onPress={() => closeModal()}>
                <AntDesign name={'close'} size={24} color={colors.primary} />
              </TouchableWithoutFeedback>
            </RowContainer>
            <FlatList
              data={listAllQuestion}
              renderItem={renderItem}
              numColumns={6}
              ItemSeparatorComponent={() => <SeparatorVertical sm />}
              ListFooterComponent={() => <SeparatorVertical slg />}
              showsVerticalScrollIndicator={false}
              style={{flexGrow: 1, paddingBottom: 48}}
              keyExtractor={(item, index) => `${item.key || item._id}_${index}`}
            />
          </>
        )}
      </View>
    </ModalWrapper>
  );
};

const ListStatusQuestionModalRef = forwardRef(ListStatusQuestionModal);

ListStatusQuestionModalRef.propTypes = {
  data: PropTypes.object,
  action: PropTypes.func,
};

ListStatusQuestionModalRef.defaultProps = {
  data: {},
  action: () => {},
};

const styles = StyleSheet.create({
  modalStyle: {
    flex: 1,
    height: OS.HEIGHT * 0.8,
    justifyContent: 'flex-start',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingTop: 24,
    paddingBottom: 48,
  },
  containerModalStyle: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  containerWordStyle: {
    flexWrap: 'wrap',
    paddingBottom: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    backgroundColor: colors.white,
  },
  answer: {
    width: (OS.WIDTH - 96) / 6,
    height: (OS.WIDTH - 96) / 6,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const SCard = styled(Card)`
  border-color: ${(props) => props.colorShow || colors.heartDeactive};
  background-color: ${(props) => {
    if (props.showResult) {
      return props.colorShow;
    }
    return colors.white;
  }};
`;
export default ListStatusQuestionModalRef;
