import React, {useImperativeHandle, forwardRef, useState} from 'react';
import {StyleSheet, View, ActivityIndicator, Image} from 'react-native';
import PropTypes from 'prop-types';
import ModalWrapper from 'react-native-modal-wrapper';

import {
  Button,
  FlexContainer,
  SeparatorVertical,
  Text,
} from '~/BaseComponent/index';
import {colors, images} from '~/themes';
import {OS} from '~/constants/os';
import {translate} from '~/utils/multilanguage';

const ActivityLevelModal = (props, ref) => {
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

  return (
    <ModalWrapper
      containerStyle={styles.containerModalStyle}
      onRequestClose={closeModal}
      shouldAnimateOnRequestClose={true}
      style={styles.modalStyle}
      visible={show}>
      <>
        {!props.data ? (
          <ActivityIndicator size={'large'} center />
        ) : (
          <>
            <FlexContainer paddingHorizontal={24}>
              <Text h4 bold center paddingTop={8}>
                {props.data.name}
              </Text>
              <Text h6 color={colors.helpText2} center paddingVertical={16}>
                {props.data.display_name}
              </Text>
              <View
                justifyContent={'center'}
                alignItems={'center'}
                paddingVertical={24}>
                <Image
                  source={images.hard.level_1_lg}
                  style={{width: 66, height: 42}}
                />
              </View>
              <View>
                <Text h5 paddingVertical={16}>
                  {translate(
                    'Có thể bạn đang quên dần các từ vựng trong bài này. Để nhớ lâu\nhơn những từng từ đã học, bạn chỉ cần dành 1 chút thời gian để\nôn tập lại.',
                  )}
                </Text>
                <Text h5 paddingVertical={16}>
                  {translate(
                    'Khoa học đã chỉ ra rằng, việc xem lại thường xuyên và đúng\nthời điểm sẽ giúp bạn củng cố lại trí nhớ và làm chủ những\ntừ đã học mãi mãi.',
                  )}
                </Text>
              </View>

              <View paddingTop={48}>
                <Button
                  large
                  rounded
                  block
                  uppercase
                  bold
                  icon
                  primary
                  onPress={() => {
                    props.action(props.data);
                  }}>
                  {translate('Tiếp tục')}
                </Button>
                <SeparatorVertical sm />
                <Button
                  large
                  rounded
                  block
                  uppercase
                  bold
                  transparent
                  onPress={closeModal}>
                  {translate('Quay lại')}
                </Button>
              </View>
            </FlexContainer>
          </>
        )}
      </>
    </ModalWrapper>
  );
};

const ActivityLevelModalRef = forwardRef(ActivityLevelModal);

ActivityLevelModalRef.propTypes = {
  data: PropTypes.object,
  action: PropTypes.func,
};

ActivityLevelModalRef.defaultProps = {
  data: {},
  action: () => {},
};

const styles = StyleSheet.create({
  modalStyle: {
    flex: 1,
    height: OS.HEIGHT - OS.headerHeight - 40,
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

export default ActivityLevelModalRef;
