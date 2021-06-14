import React, {useState, useEffect, useCallback} from 'react';
import {TouchableOpacity, View, Image, Keyboard} from 'react-native';
import PropTypes from 'prop-types';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import {setTranslation} from '~/features/vocalbulary/VocabularyAction';
import {Text, Autocomplete, RowContainer} from '~/BaseComponent';
import {OS} from '~/constants/os';
import images from '~/themes/images';
import vocabularyApi from '~/features/vocalbulary/VocabularyApi';
import navigator from '~/navigation/customNavigator';
import {makeid} from '~/utils/utils';
import {colors} from '~/themes';

const TranslationInput = (props) => {
  const dispatch = useDispatch();
  const {isFull} = props;
  const word = useSelector(
    (state) => state.vocabulary.wordTranslation,
    shallowEqual,
  );

  const [query, setQuery] = useState(word);
  const [data, setData] = useState([]);
  const [allowQuery, setAllowQuery] = useState(false);

  useEffect(() => {
    const getData = async (keyword) => {
      const res = await vocabularyApi.searchVocabulary({keyword});
      if (res.ok && res.data && res.data.data) {
        setData(res.data.data);
      }
    };
    if (query && allowQuery) {
      getData(query);
    }
  }, [allowQuery, query]);

  const setTranslateWord = useCallback(
    (item) => {
      setQuery(item.title);
      setAllowQuery(false);
      setData([]);
      Keyboard.dismiss();
      dispatch(setTranslation(item.title));
      navigator.navigate('Dictionary');
    },
    [dispatch],
  );

  return (
    <View
      style={[styles.autocompleteContainer, isFull ? styles.fullWrap : null]}>
      <Autocomplete
        data={query ? data : []}
        defaultValue={query}
        onChangeText={(text) => {
          setQuery(text);
          setAllowQuery(true);
        }}
        keyExtractor={({item}) => (item ? item._id : makeid(8))}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => setTranslateWord(item)}>
            {item.title.startsWith(query) && (
              <RowContainer paddingVertical={4}>
                <Text primary bold fontSize={15}>
                  {query}
                </Text>
                <Text fontSize={15}>
                  {item.title.substring(query.length, item.title.length)}
                </Text>
              </RowContainer>
            )}
            {!item.title.startsWith(query) && (
              <Text fontSize={15}>{item.word}</Text>
            )}
          </TouchableOpacity>
        )}
      />

      {query !== '' && (
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.closeBtn, isFull ? styles.closeBtnFull : null]}
          onPress={() => {
            setQuery('');
            setAllowQuery(true);
            setData([]);
          }}>
          <Image source={images.close} style={styles.closeImg} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = {
  autocompleteContainer: {
    paddingHorizontal: 24,
    zIndex: 1,
    position: 'relative',
    paddingBottom: 8,
  },
  fullWrap: {
    width: OS.WIDTH,
    shadowColor: colors.denim_medium,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.09,
    shadowRadius: 4,
    backgroundColor: '#fff',
    top: 0,
    left: 0,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  item: {
    paddingVertical: 3,
    paddingHorizontal: 15,
  },
  closeBtn: {
    position: 'absolute',
    top: 0,
    right: 20,
    zIndex: 9999,
    padding: 14,
  },
  closeBtnFull: {
    right: 26,
    top: 12,
  },
  closeImg: {
    width: 13,
    height: 13,
  },
};

TranslationInput.propTypes = {
  isFull: PropTypes.bool,
  word: PropTypes.string,
  onSetTranslation: PropTypes.func,
};

TranslationInput.defaultProps = {
  isFull: false,
  word: null,
  onSetTranslation: () => {},
};

export default TranslationInput;
