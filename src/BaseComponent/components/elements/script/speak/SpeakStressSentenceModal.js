import React, {useCallback, useMemo} from 'react';
import {TouchableOpacity, Image, View, FlatList} from 'react-native';
import ModalWrapper from 'react-native-modal-wrapper';

import StressSentence from '~/BaseComponent/components/elements/script/speak/StressSentence';
import EmbedAudioAnimate from '~/BaseComponent/components/elements/result/EmbedAudioAnimate';
import Text from '~/BaseComponent/components/base/Text';
import images from '~/themes/images';
import {colors} from '~/themes';
import {matchAllRegex} from '~/utils/utils';
import {OS} from '~/constants/os';
import {translate} from '~/utils/multilanguage';

const SpeakStressSentenceModal = (props) => {
  const dismissProps = props.dismiss;
  const {data, resultStressSentence} = props;
  const {sentence, audioRecorded} = data;

  const rows = useMemo(() => {
    return [
      {
        isHeader: true,
        titles: [translate('Từ'), translate('Bạn nói'), translate('Đánh giá')],
      },
      ...(resultStressSentence || []),
    ];
  }, [resultStressSentence]);

  const listWords = useMemo(() => {
    const regex = /<s>.*?<\/s>/g;
    const listMatchAll = matchAllRegex(regex, sentence);
    let cursorIndex = 0;
    let displaySentence = '';

    listMatchAll.map((it) => {
      const itemLength = it[0].length;
      const indexItem = it.index;

      const stringValue = it[0].replace('<s>', '').replace('</s>', '');

      if (cursorIndex < indexItem) {
        const subString = sentence.substr(cursorIndex, indexItem - cursorIndex);
        displaySentence += subString;
      }
      displaySentence += stringValue;
      cursorIndex = indexItem + itemLength;
    });

    if (cursorIndex <= sentence.length - 1) {
      const subString = sentence.substr(
        cursorIndex,
        sentence.length - 1 - cursorIndex + 1,
      );
      displaySentence += subString;
    }
    return displaySentence.split(' ') || [];
  }, [sentence]);

  const renderItem = useCallback(
    ({item}) => {
      return <CommentItem data={item} wordCompare={''} />;
    },
    [listWords],
  );

  const dismiss = useCallback(() => {
    dismissProps();
  }, [dismissProps]);

  return (
    <ModalWrapper
      style={styles.modalWrapper}
      containerStyle={styles.containerModal}
      onRequestClose={dismiss}
      shouldAnimateOnRequestClose={true}
      visible={true}>
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={dismiss} style={styles.closeBtn}>
            <Image source={images.close} style={styles.closeBtnImg} />
          </TouchableOpacity>
        </View>
        <StressSentence
          sentence={sentence}
          resultStressSentence={resultStressSentence}
        />
        <EmbedAudioAnimate
          autoPlay={true}
          audio={audioRecorded}
          isUser
          isSquare
          fullWidth
        />
        <FlatList
          data={rows}
          keyExtractor={(item, index) => `${index}`}
          renderItem={renderItem}
          style={styles.flatList}
        />
      </View>
    </ModalWrapper>
  );
};
const CommentItem = (props) => {
  const {data, wordCompare} = props;
  const {isHeader, titles} = data;

  const renderHeader = useCallback(() => {
    return (
      <View style={stylesItem.row}>
        <View style={stylesItem.column1}>
          <Text style={stylesItem.textTitle}>{titles[0] || ''}</Text>
        </View>
        <View style={stylesItem.column2}>
          <Text style={stylesItem.textTitle}>{titles[1] || ''}</Text>
        </View>
        <View style={stylesItem.column3}>
          <Text style={stylesItem.textTitle}>{titles[2] || ''}</Text>
        </View>
      </View>
    );
  }, [titles]);

  const renderComment = useCallback((isCorrect, isStress, isActualStress) => {
    if (isStress) {
      if (isCorrect) {
        return (
          <Text
            style={[
              stylesItem.textRow,
              stylesItem.textCorrect,
              stylesItem.textStress,
            ]}>
            OK
          </Text>
        );
      } else {
        const textComment = isActualStress
          ? translate('Hơi mạnh')
          : translate('Hơi nhẹ');
        const detailComment = isActualStress
          ? translate(
              'Phần này bạn đang nói hơi mạnh, cần nói nhẹ hơn một chút',
            )
          : translate(
              'Phần này bạn đang nói hơi nhẹ, cần nói mạnh hơn một chút',
            );
        return (
          <>
            <Text
              style={[
                stylesItem.textRow,
                stylesItem.textWrong,
                stylesItem.textStress,
              ]}>
              {textComment}
            </Text>
            <Text style={stylesItem.textDetailComment}>{detailComment}</Text>
          </>
        );
      }
    }
    return null;
  }, []);

  const renderRow = useCallback(() => {
    const {isCorrect, isStress, isActualStress} = data;
    const word = data.word;
    return (
      <View style={stylesItem.row}>
        <View style={stylesItem.column1}>
          <Text
            style={[stylesItem.textRow, isStress ? stylesItem.textStress : {}]}>
            {word}
          </Text>
        </View>
        <View style={stylesItem.column2}>
          <Text
            style={[
              stylesItem.textRow,
              isStress ? stylesItem.textStress : {},
              isStress
                ? isCorrect
                  ? stylesItem.textCorrect
                  : stylesItem.textWrong
                : {},
            ]}>
            {word}
          </Text>
        </View>
        <View style={stylesItem.column3}>
          {renderComment(isCorrect, isStress, isActualStress)}
        </View>
      </View>
    );
  }, [data, wordCompare, renderComment]);

  const renderContent = useCallback(() => {
    if (isHeader) {
      return renderHeader();
    } else {
      return renderRow();
    }
  }, [isHeader, renderRow, renderHeader]);

  return renderContent();
};

const styles = {
  modalWrapper: {
    flex: 1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  containerModal: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  mainContent: {
    marginBottom: 40,
  },
  header: {
    height: 50,
  },
  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 15,
    padding: 8,
  },
  closeBtnImg: {
    width: 13,
    height: 13,
  },
  flatList: {
    maxHeight: OS.HEIGHT - 300,
  },
};
const stylesItem = {
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(216,216,216)',
  },
  column1: {
    flex: 0.25,
    padding: 15,
    borderRightColor: 'rgb(216,216,216)',
    borderRightWidth: 1,
  },
  column2: {
    flex: 0.25,
    padding: 15,
    borderRightColor: 'rgb(216,216,216)',
    borderRightWidth: 1,
  },
  column3: {
    flex: 0.5,
    padding: 15,
  },
  textTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  textRow: {
    fontSize: 18,
  },
  textStress: {
    fontWeight: 'bold',
  },
  textWrong: {
    fontSize: 18,
    color: colors.bad,
  },
  textCorrect: {
    fontSize: 18,
    color: colors.good,
  },
  textDetailComment: {
    fontSize: 16,
  },
};
export default SpeakStressSentenceModal;
