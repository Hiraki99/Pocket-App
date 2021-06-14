import React, {useCallback} from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Image,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';

import {colors, images} from '~/themes';
import {HighLightText} from '~/BaseComponent/components/elements/script/HighLightText';

const ListenAndRepeatItem = (props) => {
  const {
    item,
    showRecordModal,
    playAudio,
    isSelected,
    index,
    isLoadingSound,
  } = props;

  const showRecord = useCallback(() => {
    showRecordModal();
  }, [showRecordModal]);

  const runAudio = useCallback(() => {
    playAudio(index);
  }, [playAudio, index]);

  const textStyles = isSelected
    ? [stylesItem.text, stylesItem.textSelected]
    : stylesItem.text;
  let itemStyles = [stylesItem.item];
  let selectedStyle = isSelected ? stylesItem.itemSelected : {};
  if (isLoadingSound && isSelected) {
    itemStyles.push(stylesItem.itemWidthLoading);
  }

  const renderMicroBtn = useCallback(() => {
    if (isSelected) {
      return (
        <TouchableWithoutFeedback onPress={showRecord}>
          <View style={stylesItem.rightBtn}>
            <Image source={images.micro_record} style={stylesItem.mircoIcon} />
          </View>
        </TouchableWithoutFeedback>
      );
    }
    return <View style={stylesItem.rightBtn} />;
  }, [isSelected, showRecord]);

  const renderLoadingView = useCallback(() => {
    if (isLoadingSound && isSelected) {
      return (
        <View style={stylesItem.activityWrapper}>
          <ActivityIndicator size={'small'} color={'gray'} />
        </View>
      );
    }
    return null;
  }, [isLoadingSound, isSelected]);

  return (
    <View style={stylesItem.contentView}>
      <TouchableWithoutFeedback onPress={runAudio}>
        <View style={itemStyles}>
          <View style={selectedStyle} />
          <View style={stylesItem.textWrapper}>
            <HighLightText
              content={item.text}
              style={textStyles}
              fontSize={20}
              colorHighLight={'rgb(248, 147, 31)'}
            />
          </View>
          {renderLoadingView()}
        </View>
      </TouchableWithoutFeedback>
      {renderMicroBtn()}
    </View>
  );
};
const stylesItem = StyleSheet.create({
  contentView: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(243,245,249)',
    paddingHorizontal: 35,
    paddingVertical: 12,
    borderRadius: 25,
    marginLeft: 50,
  },
  itemWidthLoading: {
    paddingLeft: 35,
    paddingRight: 0,
  },
  activityWrapper: {
    flexDirection: 'row',
    width: 35,
    paddingLeft: 3,
  },
  itemSelected: {
    borderColor: 'rgb(74,79,241)',
    borderWidth: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    borderRadius: 25,
  },
  textWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
  },
  textSelected: {
    color: 'rgb(74,79,241)',
  },
  rightBtn: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mircoIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
});

export default ListenAndRepeatItem;

ListenAndRepeatItem.propTypes = {
  item: PropTypes.object.isRequired,
  showRecordModal: PropTypes.func,
  playAudio: PropTypes.func,
  isSelected: PropTypes.bool,
  index: PropTypes.number,
  isLoadingSound: PropTypes.bool,
};

ListenAndRepeatItem.defaultProps = {
  item: {text: ''},
  showRecordModal: () => {},
  playAudio: () => {},
  isSelected: false,
  index: 0,
  isLoadingSound: false,
};
