import React, {useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {SText, RowContainer} from '../../../base/CommonContainer';

import {colors} from '~/themes';
import DetailPronunciationModal from '~/BaseComponent/components/elements/script/DetailPronunciationModal';

export const PronunciationHighlightWord = (props) => {
  const {data} = props;
  const modalResultRef = useRef(null);
  const [itemSelected, setItemSelected] = useState([]);
  const renderModal = React.useCallback(() => {
    return (
      <DetailPronunciationModal ref={modalResultRef} data={itemSelected} />
    );
  }, [modalResultRef, itemSelected]);

  const showDetail = React.useCallback(
    (item) => {
      if (props.viewDetail && modalResultRef) {
        modalResultRef.current.showModal();
        setItemSelected([item]);
      }
    },
    [modalResultRef, props.viewDetail],
  );

  const renderText = React.useCallback((it) => {
    return (
      <SContainer>
        <SText
          fontSize={it.refer ? 32 : 24}
          style={it.refer ? {marginBottom: 4} : {}}
          accented
          bold
          primary={it.primary}
          good={it.good}
          bad={it.bad}>
          {it.word}
        </SText>
      </SContainer>
    );
  }, []);

  if (data.length === 0) {
    return null;
  }

  return (
    <View
      style={
        props.containerStyle ? props.containerStyle : styles.defaultContainer
      }>
      {props.viewDetail && renderModal()}
      {data.map((item) => {
        return (
          <TouchableOpacity
            key={item.key}
            activeOpacity={0.2}
            onPress={() => showDetail(item)}
            style={{marginHorizontal: 2}}>
            {item.analysis ? (
              <RowContainer>
                {item.analysis.map((it) => {
                  return renderText(it);
                })}
              </RowContainer>
            ) : (
              <SContainer
                key={item.key}
                refer={item.refer || props.referAll}
                primary={item.primary}
                good={item.good}
                passable={item.passable}
                average={item.average}
                bad={item.bad}
                style={
                  item.refer || props.referAll
                    ? {
                        paddingTop: 4,
                        paddingBottom: 2,
                      }
                    : {paddingVertical: 4}
                }>
                <SText
                  fontSize={props.word || props.referAll ? 24 : 19}
                  bold
                  primary={item.primary}
                  good={item.good}
                  passable={item.passable}
                  average={item.average}
                  bad={item.bad}>
                  {item.word}
                </SText>
              </SContainer>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const SContainer = styled.View``;

PronunciationHighlightWord.propTypes = {
  data: PropTypes.array,
  containerStyle: PropTypes.object,
  word: PropTypes.bool,
  viewDetail: PropTypes.bool,
  referAll: PropTypes.bool,
  attachment: PropTypes.object,
};

PronunciationHighlightWord.defaultProps = {
  data: [],
  containerStyle: null,
  word: false,
  viewDetail: false,
  referAll: false,
  attachment: {},
};
const styles = StyleSheet.create({
  defaultContainer: {
    flexWrap: 'wrap',
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
});
