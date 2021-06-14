import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
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

import {
  BlankHeader,
  Button,
  Card,
  FlexContainer,
  RowContainer,
  SeparatorVertical,
  Text,
} from '~/BaseComponent/index';
import {colors} from '~/themes';
import {OS} from '~/constants/os';
import navigator from '~/navigation/customNavigator';
import {translate} from '~/utils/multilanguage';

const ListStatusQuestionExamedModalRef = (props, ref) => {
  const [show, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const {questions, data} = props;
  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 400);
  }, []);

  useImperativeHandle(ref, () => ({
    showModal: () => {
      showModal();
    },
    closeModal: () => {
      closeModal();
    },
  }));

  const showModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const renderItem = useCallback(({item, index}) => {
    const colorShow = item.is_true ? colors.successChoice : colors.milanoRed;

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          // jumpToAnswer(item);
        }}>
        <SCard colorShow={colorShow} showResult style={styles.answer}>
          <Text h4 color={colors.white}>
            {index + 1}
          </Text>
        </SCard>
      </TouchableWithoutFeedback>
    );
  }, []);

  const renderHeader = useCallback(() => {
    return (
      <RowContainer justifyContent={'space-between'} paddingBottom={16}>
        <Text h4 color={colors.helpText} medium paddingVertical={16}>
          {translate('Điểm số %s', {
            s1: `${data.true_count} / ${
              data.true_count + data.false_count
            } (${Math.floor(
              (data.true_count * 100) / (data.true_count + data.false_count),
            )}%)`,
          })}
        </Text>
        <TouchableWithoutFeedback onPress={() => closeModal()}>
          <AntDesign name={'close'} size={24} color={colors.primary} />
        </TouchableWithoutFeedback>
      </RowContainer>
    );
  }, [data, closeModal]);

  const renderFooter = useCallback(() => {
    return (
      <View paddingTop={24}>
        <Button
          primary
          rounded
          large
          shadow={!OS.IsAndroid}
          icon
          uppercase
          bold
          onPress={() => {
            closeModal();
            navigator.navigate('OnboardExamEng', {
              params: {
                ...data,
                _id: data.test._id,
              },
            });
          }}>
          {translate('Làm lại bài kiểm tra')}
        </Button>
        <SeparatorVertical md />
        <Button
          transparent
          primary
          outline
          block
          rounded
          large
          shadow={!OS.IsAndroid}
          uppercase
          bold
          onPress={() => closeModal()}>
          {translate('Đóng')}
        </Button>
      </View>
    );
  }, [closeModal, data]);

  return (
    <ModalWrapper
      containerStyle={styles.containerModalStyle}
      onRequestClose={closeModal}
      shouldAnimateOnRequestClose={true}
      style={styles.modalStyle}
      visible={show}>
      <BlankHeader />
      <FlexContainer paddingHorizontal={16}>
        {loading ? (
          <ActivityIndicator size={'large'} center />
        ) : (
          <>
            <FlatList
              data={questions}
              renderItem={renderItem}
              numColumns={6}
              ItemSeparatorComponent={() => <SeparatorVertical sm />}
              ListHeaderComponent={renderHeader}
              ListFooterComponent={renderFooter}
              showsVerticalScrollIndicator={false}
              style={{flexGrow: 1}}
              keyExtractor={(item, index) => `${item.key || item._id}_${index}`}
            />
          </>
        )}
      </FlexContainer>
    </ModalWrapper>
  );
};

const ListStatusQuestionExamedModal = forwardRef(
  ListStatusQuestionExamedModalRef,
);

ListStatusQuestionExamedModal.propTypes = {
  data: PropTypes.object,
  questions: PropTypes.array,
  action: PropTypes.func,
};

ListStatusQuestionExamedModal.defaultProps = {
  data: {},
  questions: [],
  action: () => {},
};

const styles = StyleSheet.create({
  modalStyle: {
    flex: 1,
    height: OS.HEIGHT,
    justifyContent: 'flex-start',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingTop: 8,
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
export default ListStatusQuestionExamedModal;
