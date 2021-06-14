import React, {useRef, useCallback} from 'react';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';

import {colors} from '~/themes';
import FillInBlankWord from '~/BaseComponent/components/elements/script/primary/lookAndTrace/FillInBlankWord';
import LottieViewUrl from '~/BaseComponent/components/elements/script/primary/lookAndTrace/LottieViewUrl';

const LookAndTraceItem = (props) => {
  const scrollRef = useRef(null);
  const wordRef = useRef(null);

  const {item, showCorrectModal, showInputModal, onFinishItem} = props;

  const renderImage = useCallback(() => {
    return (
      <View style={[stylesItem.imageWrapper]}>
        <FastImage
          style={[stylesItem.image]}
          source={{
            uri: item.path,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
    );
  }, [item.path]);

  const showInput = useCallback(
    (params) => {
      showInputModal(params);
    },
    [showInputModal],
  );
  const renderQuestion = useCallback(() => {
    if (!item.hasQuestion) {
      return (
        <View style={[stylesItem.imageWrapper]}>
          <LottieViewUrl url={item.lottieUrl} />
        </View>
      );
    }
    return (
      <>
        {renderImage()}
        <FillInBlankWord
          wordRef={wordRef}
          text={item.text}
          showInputModal={showInput}
          showCorrectModal={showCorrectModal}
          disable={false}
          onFinish={onFinishItem}
        />
      </>
    );
  }, [
    renderImage,
    item.text,
    item.hasQuestion,
    item.lottieUrl,
    showInput,
    showCorrectModal,
    onFinishItem,
  ]);
  return (
    <View style={stylesItem.itemWrapper} ref={scrollRef}>
      <View style={stylesItem.lottiePreview}>
        <TouchableWithoutFeedback onPress={props.openLottieModal}>
          <FastImage
            style={stylesItem.previewLottie}
            source={{
              uri: props.lottiePreviewUrl,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </TouchableWithoutFeedback>
      </View>
      {renderQuestion()}
    </View>
  );
};

const stylesItem = StyleSheet.create({
  itemWrapper: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 50,
  },
  previewLottie: {
    flex: 1,
  },
  imageWrapper: {
    backgroundColor: colors.white,
    marginHorizontal: 25,
    marginBottom: 15,
    flex: 1,
  },
  image: {
    flex: 1,
    margin: 10,
  },
  lottiePreview: {
    backgroundColor: colors.white,
    height: 154,
    marginHorizontal: 25,
    marginVertical: 12,
    borderRadius: 20,
    padding: 25,
  },
});

export default LookAndTraceItem;

LookAndTraceItem.propTypes = {
  item: PropTypes.object.isRequired,
  showInputModal: PropTypes.func,
  openLottieModal: PropTypes.func,
  lottiePreviewUrl: PropTypes.string,
  showCorrectModal: PropTypes.func,
  onFinishItem: PropTypes.func,
};
LookAndTraceItem.defaultProps = {
  item: {},
  showInputModal: () => {},
  openLottieModal: () => {},
  lottiePreviewUrl: '',
  showCorrectModal: () => {},
  onFinishItem: () => {},
};
