import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
} from 'react';
import {StyleSheet, ScrollView, TouchableWithoutFeedback} from 'react-native';
import PropTypes from 'prop-types';
import ModalWrapper from 'react-native-modal-wrapper';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {colors} from '~/themes';
import {OS} from '~/constants/os';
import Text from '~/BaseComponent/components/base/Text';
import {RowContainer} from '~/BaseComponent/components/base/CommonContainer';
import {translate} from '~/utils/multilanguage';

const TranscriptModal = (props, ref) => {
  const [show, setShowModal] = useState(false);

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

  return (
    <ModalWrapper
      containerStyle={styles.containerModalStyle}
      onRequestClose={closeModal}
      shouldAnimateOnRequestClose={true}
      style={styles.modalStyle}
      visible={show}>
      <ScrollView paddingHorizontal={16}>
        <RowContainer justifyContent={'space-between'}>
          <Text h4 primary paddingVertical={16}>
            {translate('Transcript')}
          </Text>
          <TouchableWithoutFeedback onPress={() => closeModal()}>
            <AntDesign name={'close'} size={24} color={colors.primary} />
          </TouchableWithoutFeedback>
        </RowContainer>
        <Text h5>{props.transcript}</Text>
      </ScrollView>
    </ModalWrapper>
  );
};

const TranscriptModalRef = forwardRef(TranscriptModal);

TranscriptModalRef.propTypes = {
  transcript: PropTypes.string,
};

TranscriptModalRef.defaultProps = {
  transcript: '',
};

const styles = StyleSheet.create({
  modalStyle: {
    flex: 1,
    height: OS.HEIGHT * 0.6,
    justifyContent: 'flex-start',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingTop: 16,
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

export default TranscriptModalRef;
