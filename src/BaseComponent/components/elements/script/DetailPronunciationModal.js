import React, {useState, useImperativeHandle, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Animated,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ModalWrapper from 'react-native-modal-wrapper';
import PropTypes from 'prop-types';

import {Loading, RowContainer} from '~/BaseComponent';
import {PronunciationWord} from '~/BaseComponent/components/elements/pronunciation/element/PronunciationWord';
import {SText} from '~/BaseComponent/components/base/CommonContainer';
import {PronunciationRow} from '~/BaseComponent/components/elements/pronunciation/element/PronunciationRow';
import EmbedAudioCustomTime from '~/BaseComponent/components/elements/result/EmbedAudioCustomTime';
import {COMMENT_PRONUNCIATION} from '~/constants/threshold';
import speakApi from '~/features/speak/SpeakApi';
import {OS} from '~/constants/os';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';

const DetailPronunciationModal = (props, modalWrapperRef) => {
  const [show, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (props.data && props.data[0]) {
        const {analysis} = props.data[0];
        const phones = analysis.map((item) => `/${item.phone_ipa}/`).join(';');
        setLoading(true);
        const res = await speakApi.infoPronunciation({
          name: phones,
        });
        if (res.ok && res.data) {
          setData(
            analysis.map((item) => {
              let tutorial = null;
              const phone =
                res.data.filter((i) => i.name === `/${item.phone_ipa}/`)[0] ||
                {};
              if (phone.audio_tutorials) {
                tutorial = phone.audio_tutorials[0];
              }
              return {
                ...item,
                info: tutorial,
                comment: getCommentItem(item),
              };
            }),
          );
        }
        setTimeout(() => {
          setLoading(false);
        }, 200);
      }
    };

    fetchData();
  }, [props.data]);
  useImperativeHandle(modalWrapperRef, () => ({
    showModal: () => {
      showModal();
    },
    closeModal: () => {
      closeModal();
    },
  }));

  const getCommentItem = (item) => {
    if (item.good) {
      return COMMENT_PRONUNCIATION.GOOD;
    }
    if (item.passable) {
      return COMMENT_PRONUNCIATION.PASSABLE;
    }
    if (item.average) {
      return COMMENT_PRONUNCIATION.AVERAGE;
    }
    return COMMENT_PRONUNCIATION.BAD;
  };

  const showModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const fSetSelectedItem = (item) => setSelectedItem(item);

  const renderHeader = () => {
    return (
      <RowContainer alignItems={'flex-start'}>
        <Animated.View
          paddingVertical={4}
          style={{
            width: 80,
            borderColor: '#E7E8EB',
            borderWidth: 0.5,
          }}>
          <SText h5 paddingHorizontal={20} bold>
            {translate('Âm')}
          </SText>
        </Animated.View>
        <Animated.View
          style={{
            paddingVertical: 4,
            flexDirection: 'row',
            width: 100,
            borderColor: '#E7E8EB',
            borderWidth: 0.5,
            alignItems: 'flex-start',
          }}>
          <SText h5 bold paddingHorizontal={20}>
            {translate('IPA')}
          </SText>
        </Animated.View>
        <View
          style={{
            paddingHorizontal: 18,
            paddingVertical: 4,
            flex: 1,
            borderColor: '#E7E8EB',
            borderWidth: 0.5,
          }}>
          <SText h5 bold>
            {translate('Đánh giá')}
          </SText>
        </View>
      </RowContainer>
    );
  };

  const renderItem = React.useCallback(
    ({item}) => {
      return (
        <PronunciationRow
          item={item}
          selectedItem={selectedItem}
          fSelectedItem={fSetSelectedItem}
        />
      );
    },
    [selectedItem],
  );

  return (
    <ModalWrapper
      containerStyle={styles.containerModalStyle}
      onRequestClose={closeModal}
      shouldAnimateOnRequestClose={true}
      style={styles.modalStyle}
      visible={show}>
      <View style={{flex: 1}}>
        <TouchableOpacity activeOpacit={0.7} onPress={closeModal}>
          <RowContainer justifyContent={'flex-end'} paddingHorizontal={24}>
            <Ionicons
              name="ios-close"
              size={40}
              style={{color: colors.primary}}
            />
          </RowContainer>
        </TouchableOpacity>
        <PronunciationWord
          data={props.data}
          containerStyle={styles.containerWordStyle}
          referAll
        />
        {props.data[0] && (
          <EmbedAudioCustomTime
            audio={props.data[0].attachment.path}
            duration={
              props.data[0].attachment.endTime -
              props.data[0].attachment.startTime
            }
            startTime={props.data[0].attachment.startTime}
            endTime={props.data[0].attachment.endTime}
            showTime={false}
            isUser
          />
        )}
        {loading ? (
          <Loading />
        ) : (
          <FlatList
            data={data}
            ListHeaderComponent={renderHeader}
            keyExtractor={(item) => `${item.key}`}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ModalWrapper>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    flex: 1,
    height: OS.HEIGHT * 0.8,
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

const DetailPronunciationModalRef = React.forwardRef(DetailPronunciationModal);

DetailPronunciationModal.propTypes = {
  word: PropTypes.string,
  sentence: PropTypes.string,
  data: PropTypes.array,
  pronunciation: PropTypes.string,
  onResult: PropTypes.func,
  speakWorstPhone: PropTypes.bool,
  infoWorstPhone: PropTypes.object,
};

DetailPronunciationModal.defaultProps = {
  word: null,
  sentence: null,
  data: [],
  pronunciation: '',
  onResult: () => {},
  speakWorstPhone: false,
  infoWorstPhone: null,
};
export default DetailPronunciationModalRef;
// export default connect(null, {pushAction}, null, {forwardRef: true})(
//   SpeakVipModalRef,
// );
