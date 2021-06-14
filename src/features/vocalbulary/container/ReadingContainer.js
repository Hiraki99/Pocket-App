import React, {useMemo} from 'react';
import {ScrollView} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';

import {NoFlexContainer, Text} from '~/BaseComponent';
import EmbedAudio from '~/BaseComponent/components/elements/script/EmbedAudio';
import {colors} from '~/themes';

export const ReadingContainer = () => {
  const currentSection = useSelector(
    (state) => state.exam.currentSection || {},
    shallowEqual,
  );

  const currentPart = useSelector(
    (state) => state.exam.currentPart || {},
    shallowEqual,
  );

  const activePartIndex = currentSection.id
    ? currentSection.partIds.indexOf(currentPart.id) > 0
      ? currentSection.partIds.indexOf(currentPart.id)
      : 0
    : 0;

  const renderHeader = useMemo(() => {
    return (
      <>
        {currentPart.audio && (
          <EmbedAudio
            isUser={true}
            audio={currentPart.audio}
            isSquare={true}
            showTime={true}
          />
        )}
        <NoFlexContainer paddingVertical={32} paddingHorizontal={16}>
          <Text h5 color={colors.primary} bold uppercase>
            {`Part ${activePartIndex + 1}/${currentSection.partIds.length}`}
          </Text>
          <Text h5 color={colors.helpText} paddingVertical={8}>
            {currentPart.desc}
          </Text>
        </NoFlexContainer>
      </>
    );
  }, [activePartIndex, currentPart.desc, currentSection.partIds.length]);

  return (
    <ScrollView backgroundColor={colors.white}>
      {renderHeader}
      {currentPart.reading && (
        <>
          <Text h4 color={colors.helpText} bold paddingHorizontal={16}>
            {currentPart.reading.title}
          </Text>
          <Text
            fontSize={17}
            color={colors.helpText}
            paddingVertical={16}
            paddingHorizontal={16}>
            {currentPart.reading.content}
          </Text>
        </>
      )}
    </ScrollView>
  );
};
ReadingContainer.propTypes = {};
ReadingContainer.defaultProps = {};
