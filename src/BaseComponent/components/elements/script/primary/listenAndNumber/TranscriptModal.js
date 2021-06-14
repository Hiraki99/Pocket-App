import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {View as AnimateView} from 'react-native-animatable';

import Text from '~/BaseComponent/components/base/Text';
import {colors} from '~/themes';
import {OS} from '~/constants/os';

const TranscriptModal = (props) => {
  const content = props.content;
  return (
    <View style={stylesModal.modalWrapper}>
      <TouchableWithoutFeedback onPress={props.closeTranscriptModal}>
        <View style={stylesModal.backgroundModal} />
      </TouchableWithoutFeedback>
      <AnimateView
        animation="fadeInUp"
        useNativeDriver={true}
        easing="ease-in-out"
        duration={300}>
        <View style={stylesTranscript.card}>
          <ScrollView style={stylesTranscript.scrollView}>
            <View style={stylesTranscript.contentView}>
              <Text style={stylesTranscript.textContent}>{content}</Text>
            </View>
          </ScrollView>
          <TouchableWithoutFeedback onPress={props.closeTranscriptModal}>
            <View style={stylesTranscript.closeBtn}>
              <Text style={stylesTranscript.textCloseBtn}>OK</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </AnimateView>
    </View>
  );
};
const stylesModal = StyleSheet.create({
  modalWrapper: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    overflow: 'visible',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  backgroundModal: {
    overflow: 'visible',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
});

const stylesTranscript = StyleSheet.create({
  card: {
    width: 327,
    height: 332,
    borderRadius: 16,
    backgroundColor: colors.white,
    position: 'absolute',
    left: (OS.WIDTH - 327) / 2.0,
    top: (OS.HEIGHT - 332) / 2.0,
  },
  scrollView: {
    flex: 1,
  },
  contentView: {
    paddingHorizontal: 25,
    paddingVertical: 25,
  },
  textContent: {
    fontSize: 17,
    color: colors.black,
  },
  closeBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCloseBtn: {
    fontSize: 16,
    color: 'rgb(74,80,241)',
  },
});
export default TranscriptModal;
