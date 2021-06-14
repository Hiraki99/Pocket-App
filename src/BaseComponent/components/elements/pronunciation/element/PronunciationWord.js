import React, {useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {SText, RowContainer} from '../../../base/CommonContainer';

import DetailPronunciationModal from '~/BaseComponent/components/elements/script/DetailPronunciationModal';
import {colors} from '~/themes';

export const PronunciationWord = (props) => {
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

  const renderText = React.useCallback(
    (it) => {
      return (
        <SContainer
          key={it.key}
          refer={it.refer || props.referAll}
          primary={it.primary}
          good={it.good}
          passable={it.passable}
          average={it.average}
          bad={it.bad}
          style={
            it.refer || props.referAll
              ? {
                  paddingTop: 4,
                  paddingBottom: 2,
                }
              : {paddingVertical: 4}
          }>
          <SText
            fontSize={props.word || props.referAll ? 24 : 19}
            bold
            primary={it.primary}
            good={it.good}
            passable={it.passable}
            average={it.average}
            bad={it.bad}>
            {it.word}
          </SText>
        </SContainer>
      );
    },
    [props.referAll, props.word],
  );

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
              <RowContainer paddingHorizontal={2}>
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

const SContainer = styled.View`
  border-bottom-width: ${(props) => {
    if (props.refer) {
      return 2;
    }
    return 0;
  }};
  border-bottom-color: ${(props) => {
    if (props.good) {
      return colors.good;
    }
    if (props.primary) {
      return colors.primary;
    }
    if (props.passable) {
      return colors.passable;
    }
    if (props.average) {
      return colors.average;
    }
    if (props.bad) {
      return colors.bad;
    }
    return colors.helpText;
  }};
`;

PronunciationWord.propTypes = {
  data: PropTypes.array,
  containerStyle: PropTypes.any,
  word: PropTypes.bool,
  viewDetail: PropTypes.bool,
  referAll: PropTypes.bool,
  attachment: PropTypes.object,
};

PronunciationWord.defaultProps = {
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
