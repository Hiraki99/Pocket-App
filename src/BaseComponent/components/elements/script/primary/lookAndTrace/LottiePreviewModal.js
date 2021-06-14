import React, {useCallback} from 'react';
import {View, TouchableOpacity} from 'react-native';

import {OS} from '~/constants/os';
import LottieViewUrl from '~/BaseComponent/components/elements/script/primary/lookAndTrace/LottieViewUrl';

const WIDTH_CONTENT_LOTTIE_MODAL = 325;

const LottiePreviewModal = (props) => {
  const dismissProps = props.dismiss;
  const dismiss = useCallback(() => {
    dismissProps();
  }, [dismissProps]);

  return (
    <View style={styles.wrap}>
      <TouchableOpacity style={styles.overlay} onPress={dismiss} />
      <View style={styles.contentView}>
        <LottieViewUrl url={props.url} />
      </View>
    </View>
  );
};

const styles = {
  wrap: {
    height: OS.HEIGHT,
    width: OS.WIDTH,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999999,
    opacity: 1,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
  },
  contentView: {
    backgroundColor: 'white',
    height: WIDTH_CONTENT_LOTTIE_MODAL,
    width: WIDTH_CONTENT_LOTTIE_MODAL,
    position: 'absolute',
    top: (OS.HEIGHT - WIDTH_CONTENT_LOTTIE_MODAL) / 2.0,
    left: (OS.WIDTH - WIDTH_CONTENT_LOTTIE_MODAL) / 2.0,
  },
};

export default LottiePreviewModal;
