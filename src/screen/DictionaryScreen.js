import React, {useEffect, useState, useCallback} from 'react';
import {TouchableOpacity, Image, View, ScrollView} from 'react-native';
import {useSelector, shallowEqual} from 'react-redux';
import Sound from 'react-native-sound';

import {FlexContainer, CommonHeader, RowContainer, Text} from '~/BaseComponent';
import TranslationInput from '~/BaseComponent/components/elements/input/TranslationInput';
import vocabularyApi from '~/features/vocalbulary/VocabularyApi';
import {colors, images} from '~/themes';
import {makeid} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

const DictionaryScreen = () => {
  const word = useSelector(
    (state) => state.vocabulary.wordTranslation,
    shallowEqual,
  );
  const [data, setData] = useState({});
  let sound;

  useEffect(() => {
    const loadData = async (keyword) => {
      const res = await vocabularyApi.translateVocabulary({keyword});
      if (res.ok && res.data && res.data.data) {
        setData(res.data.data);
      }
      console.log('res ', res);
    };
    if (word) {
      loadData(word);
    }
  }, [word]);

  const onPlayAudio = useCallback(() => {
    if (sound) {
      sound.play();
    } else {
      sound = new Sound(data.audio_path, '', (err) => {
        if (err) {
          return;
        }
        sound.play();
      });
    }
  }, [sound, data]);

  const renderExample = (example = []) => {
    return (
      <View key={makeid(32)}>
        {example.map((item) => {
          return (
            <View key={makeid(32)} paddingHorizontal={16} paddingVertical={4}>
              <Text h5>{item.eng}</Text>
              <Text h5 primary>
                {item.vi}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderMeaningWord = useCallback((meaning = []) => {
    return (
      <View key={makeid(32)}>
        {meaning.map((item) => {
          return (
            <View key={makeid(32)} paddingHorizontal={16} paddingVertical={8}>
              <Text h5 primary>
                {item.vi}
              </Text>
              {item.examples && item.examples.length > 0 && (
                <>
                  <Text h5 bold paddingTop={8}>
                    {`${translate('Example')}`}
                  </Text>
                  {renderExample(item.examples)}
                </>
              )}
            </View>
          );
        })}
      </View>
    );
  }, []);

  const renderIdioms = useCallback((idioms) => {
    return (
      <View key={makeid(32)} paddingTop={8}>
        {idioms.map((item) => {
          return (
            <View key={makeid(32)} paddingHorizontal={16}>
              <Text fontSize={18} medium>
                {item.eng}
              </Text>
              {renderMeaningWord(item.meanings)}
            </View>
          );
        })}
      </View>
    );
  }, []);

  // const renderMeaningIdioms = (item) => {};

  const renderExplainations = useCallback(
    (item, index) => {
      return (
        <View key={makeid(32)}>
          {item.type && (
            <View backgroundColor={colors.background2}>
              <Text fontSize={22} medium paddingTop={16}>
                {item.type}
              </Text>
            </View>
          )}
          <RowContainer alignItems={'flex-start'}>
            <Text h5 primary medium marginTop={8}>
              {index}.
            </Text>
            {renderMeaningWord(item.meanings)}
          </RowContainer>
          {item.idioms && item.idioms.length > 0 && (
            <>
              <Text h4 uppercase medium>
                {`${translate('IDIOMS')}`}
              </Text>
              {renderIdioms(item.idioms)}
            </>
          )}
        </View>
      );
    },
    [renderMeaningWord, renderIdioms],
  );

  return (
    <>
      <CommonHeader themeWhite title={`${translate('Từ điển')}`} />
      <FlexContainer backgroundColor={colors.mainBgColor}>
        <TranslationInput isFull />
        <FlexContainer paddingHorizontal={24} paddingTop={24}>
          <RowContainer justifyContent={'space-between'}>
            <Text bold h4 primary>
              {word}
            </Text>
            {data.audio_path && (
              <TouchableOpacity activeOpacity={0.67} onPress={onPlayAudio}>
                <Image
                  source={images.sound_2}
                  style={{width: 24, height: 24}}
                />
              </TouchableOpacity>
            )}
          </RowContainer>
          <Text h5 color={colors.heartDeactive}>
            {data.pronounce}
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {(data.explainations || []).map((item, index) => {
              return renderExplainations(item, index + 1);
            })}
          </ScrollView>
        </FlexContainer>
      </FlexContainer>
    </>
  );
};

export default DictionaryScreen;
