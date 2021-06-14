import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import ModalWrapper from 'react-native-modal-wrapper';

import {SeparatorVertical, Text} from '~/BaseComponent/index';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';

const SelectAnswerQuestionParagraphModal = (props, ref) => {
  const [show, setShowModal] = useState(false);
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

  const renderItem = useCallback(
    ({item}) => {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            closeModal();
            props.action(props.data, item);
          }}>
          <View
            paddingVertical={16}
            paddingHorizontal={16}
            style={{
              borderWidth: 1,
              borderColor: colors.greenLight,
              borderRadius: 8,
            }}>
            <Text fontSize={20}>
              {item.label ? `${item.label}. ${item.text}` : item.text}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      );
    },
    [props],
  );

  return (
    <ModalWrapper
      containerStyle={styles.containerModalStyle}
      onRequestClose={closeModal}
      shouldAnimateOnRequestClose={true}
      style={styles.modalStyle}
      visible={show}>
      <View paddingHorizontal={16}>
        <Text h4 paddingBottom={16}>
          {translate('Lựa chọn đáp án đúng')}
        </Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={props.data.answers}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <SeparatorVertical md />}
          keyExtractor={(item, index) => `${item.key}_${index}`}
        />
      </View>
    </ModalWrapper>
  );
};

const SelectAnswerQuestionParagraphRef = forwardRef(
  SelectAnswerQuestionParagraphModal,
);

SelectAnswerQuestionParagraphRef.propTypes = {
  data: PropTypes.object,
  action: PropTypes.func,
};

SelectAnswerQuestionParagraphRef.defaultProps = {
  data: {},
  action: () => {},
};

const styles = StyleSheet.create({
  modalStyle: {
    flex: 1,
    // height: OS.HEIGHT * 0.8,
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
});

export default SelectAnswerQuestionParagraphRef;
