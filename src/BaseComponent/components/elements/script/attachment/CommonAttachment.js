import React from 'react';
import {Image, TouchableOpacity, View, StyleSheet} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import {useIsFocused} from '@react-navigation/native';
import PropTypes from 'prop-types';

import VideoPlayer from '~/BaseComponent/components/elements/script/VideoPlayer';
import EmbedAudio from '~/BaseComponent/components/elements/script/EmbedAudio';
import {RowContainer, Text} from '~/BaseComponent';
import {OS} from '~/constants/os';
import {getDimensionVideo169} from '~/utils/utils';
import {LANGUAGE} from '~/constants/lang';
import {images} from '~/themes';

const CommonAttachment = (props) => {
  const isFocused = useIsFocused();
  const audioRef = React.useRef(null);
  const [lang, setLang] = React.useState(LANGUAGE.EN);

  React.useEffect(() => {
    if (!isFocused) {
      if (audioRef && audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [isFocused]);
  const changeText = React.useCallback(() => {
    setLang((old) => {
      return old.lang === LANGUAGE.VI ? LANGUAGE.EN : LANGUAGE.VI;
    });
  }, []);

  const {
    attachment,
    textUppercase,
    textBold,
    showText,
    customMarginHorizontal,
  } = props;

  return (
    <View>
      {attachment && attachment.type === 'image' && (
        <AutoHeightImage
          source={{uri: attachment.path}}
          width={OS.WIDTH}
          style={{marginHorizontal: -24}}
        />
      )}

      {attachment && attachment.type === 'video' && (
        <View
          style={{
            marginHorizontal:
              customMarginHorizontal !== 0 ? customMarginHorizontal : -24,
            width: OS.WIDTH,
          }}>
          <VideoPlayer
            videoId={attachment.path.id}
            start={attachment.path.start}
            end={attachment.path.end}
            height={getDimensionVideo169(OS.WIDTH)}
          />
        </View>
      )}

      {attachment &&
        (attachment.type === 'audio_background' ||
          attachment.type === 'audio') && (
          <View
            style={{
              marginHorizontal: -24,
              width: OS.WIDTH - props.customPadding,
              // marginTop: -8,
              height: 48,
            }}
            {...props}>
            <EmbedAudio
              ref={audioRef}
              isUser={true}
              audio={attachment.path || attachment.item.audio}
              transcript={attachment.transcript}
              isSquare={true}
              showTime={props.showTime}
            />
          </View>
        )}

      {showText && (
        <RowContainer
          paddingTop={32}
          paddingBottom={18}
          alignItems={'flex-start'}>
          <Text h5 bold={textBold} uppercase={textUppercase}>
            {lang === LANGUAGE.EN ? props.text : props.translateText}
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.translateWrap}
            onPress={changeText}>
            <Image source={images.translate} style={styles.translate} />
          </TouchableOpacity>
        </RowContainer>
      )}
    </View>
  );
};

CommonAttachment.propTypes = {
  attachment: PropTypes.object,
  text: PropTypes.string,
  translateText: PropTypes.string,
  textUppercase: PropTypes.bool,
  textBold: PropTypes.bool,
  showText: PropTypes.bool,
  showTime: PropTypes.bool,
  customPadding: PropTypes.number,
  customMarginHorizontal: PropTypes.number,
};

CommonAttachment.defaultProps = {
  text: '',
  translateText: '',
  textUppercase: true,
  textBold: true,
  showText: true,
  showTime: true,
  customPadding: 0,
  customMarginHorizontal: 0,
};

const styles = StyleSheet.create({
  translateWrap: {
    paddingHorizontal: 8,
  },
  translate: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginTop: 4,
  },
});

export default CommonAttachment;
