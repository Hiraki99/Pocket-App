import React from 'react';
import styled from 'styled-components';
import {Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import {View} from 'react-native-animatable';
import FastImage from 'react-native-fast-image';

import {
  AnimatableNoFlexContainer,
  FlexContainer,
  RowContainer,
  Text,
  ThumbnailVideo,
} from '~/BaseComponent';
import {colors, images} from '~/themes';
import {OS} from '~/constants/os';
import {translate} from '~/utils/multilanguage';

const {width} = Dimensions.get('window');
const infoWidth = width - 96;

class PronunciationHeader extends React.PureComponent {
  render() {
    return (
      <View stylr={{paddingBottom: 16}}>
        <AnimatableNoFlexContainer
          style={styles.wrapVideo}
          animation={'fadeInUp'}
          useNativeDriver={true}
          easing="ease-in-out"
          duration={500}
          delay={500}>
          <ThumbnailVideo
            attachment={this.props.attachment}
            attachmentWidth={OS.WIDTH}
          />
        </AnimatableNoFlexContainer>

        <AnimatableNoFlexContainer
          style={styles.wrap}
          animation={'fadeInUp'}
          useNativeDriver={true}
          easing="ease-in-out"
          duration={1000}
          delay={500}>
          <FastImage source={images.teacher} style={styles.avatar} />
          <View style={styles.mainInfo}>
            <Text color={colors.primary} uppercase bold>
              `${translate('Mike')}`
            </Text>
            <Text h5 color={colors.helpText}>
              {translate(
                'Good! Bạn hãy xem video phía trên. Khi nào sẵn sàng đóng vai thì bấm nút dưới nhé!',
              )}
            </Text>
          </View>
        </AnimatableNoFlexContainer>

        <AnimatableNoFlexContainer
          style={styles.wrapRecorder}
          animation={'fadeInUp'}
          useNativeDriver={true}
          easing="ease-in-out"
          duration={1500}
          delay={500}>
          <TouchableOpacity activeOpacity={0.7} onPress={this.props.setAlready}>
            <SReadyView
              ready={this.props.already}
              style={styles.mainInfoRecorder}>
              <SReadyText h5 ready={this.props.already}>
                {translate('OK, mình sẵn sàng!')}
              </SReadyText>
            </SReadyView>
          </TouchableOpacity>
        </AnimatableNoFlexContainer>
        {this.props.already && (
          <AnimatableNoFlexContainer
            animation={'fadeInUp'}
            useNativeDriver={true}
            easing="ease-in-out"
            duration={500}
            delay={500}>
            <RowContainer marginHorizontal={-24} style={{marginBottom: 16}}>
              <FlexContainer style={{height: 1}} backgroundColor={'#E1E5EB'} />
              <Text
                h5
                bold
                color={colors.helpText}
                center
                paddingHorizontal={2}>
                {translate('BẮT ĐẦU HỘI THOẠI')}
              </Text>
              <FlexContainer style={{height: 1}} backgroundColor={'#E1E5EB'} />
            </RowContainer>
          </AnimatableNoFlexContainer>
        )}
      </View>
    );
  }
}

const SReadyView = styled.View`
  background-color: ${(props) => {
    if (props.ready) {
      return colors.primary;
    }
    return colors.white;
  }};
  border-width: ${(props) => {
    if (props.ready) {
      return 0;
    }
    return 1;
  }};
  border-color: #e1e5eb;
`;

const SReadyText = styled(Text)`
  color: ${(props) => {
    if (props.ready) {
      return colors.white;
    }
    return colors.helpText;
  }};
`;

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  wrapVideo: {},
  wrapRecorder: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  mainInfo: {
    position: 'relative',
    borderRadius: 20,
    backgroundColor: '#F3F5F9',
    paddingVertical: 16,
    paddingHorizontal: 16,
    width: infoWidth,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  mainInfoRecorder: {
    position: 'relative',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
});

export default PronunciationHeader;
