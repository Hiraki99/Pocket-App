import React, {useCallback} from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Image,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';

import {images} from '~/themes';
import {OS} from '~/constants/os';

const LetTalkItem = (props) => {
  const {
    items,
    selectedIndex,
    selectItem,
    isLoadingSound,
    showRecordModal,
  } = props;
  const renderLoadingView = useCallback(
    (isSelected) => {
      if (isLoadingSound && isSelected) {
        return (
          <View style={stylesItem.activityView}>
            <ActivityIndicator size={'small'} color={'gray'} center />
          </View>
        );
      }
      return null;
    },
    [isLoadingSound],
  );
  const renderMicroBtn = useCallback(
    (isSelected) => {
      if (isSelected) {
        return (
          <TouchableWithoutFeedback onPress={showRecordModal}>
            <View style={stylesItem.buttonRightBottom}>
              <Image
                source={images.micro_record}
                style={stylesItem.microIcon}
              />
            </View>
          </TouchableWithoutFeedback>
        );
      }
      return null;
    },
    [showRecordModal],
  );

  const renderChild = useCallback(
    (index) => {
      if (index < items.length) {
        const item = items[index];
        const isSelected = item.idx === selectedIndex;
        let styles = [stylesItem.childView];
        if (index === 1) {
          styles.push(stylesItem.childViewPadding);
        }
        const styleBorder = isSelected ? stylesItem.childSelected : {};
        const selectMe = () => {
          selectItem(item, item.idx);
        };
        return (
          <TouchableWithoutFeedback onPress={selectMe}>
            <View style={styles}>
              <View style={styleBorder} />
              <FastImage
                style={stylesItem.imageView}
                source={{
                  uri: item.path,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
              {renderMicroBtn(isSelected)}
              {renderLoadingView(isSelected)}
            </View>
          </TouchableWithoutFeedback>
        );
      }
      return null;
    },
    [items, selectItem, selectedIndex, renderMicroBtn, renderLoadingView],
  );
  return (
    <View style={stylesItem.contentView}>
      {renderChild(0)}
      {renderChild(1)}
    </View>
  );
};

const CALCULATED_WIDTH_ITEM = (OS.WIDTH - 20 * 2 - 10) / 2.0;
const WIDTH_ITEM = CALCULATED_WIDTH_ITEM > 180 ? 180 : CALCULATED_WIDTH_ITEM;
const stylesItem = StyleSheet.create({
  contentView: {
    flexDirection: 'row',
    marginHorizontal: (OS.WIDTH - WIDTH_ITEM * 2 - 10) / 2.0,
    marginTop: 10,
    justifyContent: 'center',
  },
  childView: {
    width: WIDTH_ITEM,
    height: WIDTH_ITEM,
    overflow: 'hidden',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  imageView: {
    width: WIDTH_ITEM - 30,
    height: WIDTH_ITEM - 30,
    position: 'absolute',
    left: 15,
    top: 15,
  },
  childViewPadding: {
    marginLeft: 10,
  },
  childSelected: {
    borderColor: 'rgb(74,79,241)',
    borderWidth: 2,
    width: WIDTH_ITEM,
    height: WIDTH_ITEM,
    position: 'absolute',
    left: 0,
    top: 0,
    borderRadius: 15,
  },
  buttonRightBottom: {
    width: 50,
    height: 50,
    right: 5,
    bottom: 5,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  microIcon: {
    width: 35,
    height: 35,
  },
  activityView: {
    width: 50,
    height: 50,
    top: (WIDTH_ITEM - 50) / 2,
    left: (WIDTH_ITEM - 50) / 2,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LetTalkItem;

LetTalkItem.propTypes = {
  items: PropTypes.array.isRequired,
  selectedIndex: PropTypes.number,
  selectItem: PropTypes.func,
  isLoadingSound: PropTypes.bool,
  showRecordModal: PropTypes.func,
};

LetTalkItem.defaultProps = {
  items: [],
  selectedIndex: -1,
  selectItem: () => {},
  isLoadingSound: false,
  showRecordModal: () => {},
};
