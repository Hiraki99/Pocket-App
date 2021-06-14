import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, View, StyleSheet} from 'react-native';

import {NoFlexContainer, RowContainer, Text} from '~/BaseComponent';
import activityStyles from '~/BaseComponent/components/elements/script/activityStyles';
import OrderWordModal from '~/BaseComponent/components/elements/exam/modal/OrderWordModal';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';

class QuestionWithOrder extends React.PureComponent {
  showModal = () => {
    if (this.modalRef) {
      this.modalRef.showModal();
    }
  };

  onDone = (selectedOrder) => {
    this.modalRef.closeModal();
    this.props.action(this.props.data, selectedOrder);
  };

  render() {
    const {data} = this.props;
    return (
      <>
        <View paddingHorizontal={24}>
          <RowContainer paddingVertical={8} alignItems={'flex-start'}>
            <RowContainer
              justifyContent={'center'}
              alignItems={'center'}
              style={styles.index}>
              <Text
                fontSize={10}
                style={{lineHeight: 12}}
                bold
                color={colors.white}>
                {data.indexQuestion || 0}
              </Text>
            </RowContainer>
            <NoFlexContainer paddingHorizontal={16}>
              <Text h5 bold>{`Question ${data.indexQuestion}`}</Text>
              <Text h5 paddingTop={8}>
                {data.question}
              </Text>
            </NoFlexContainer>
          </RowContainer>
          <>
            {data.userTextAnswer ? (
              <>
                <Text h5 paddingTop={8}>
                  {translate('Câu trả lời')}
                </Text>
                <Text
                  h5
                  paddingTop={8}
                  paddingHorizontal={40}
                  style={{
                    fontStyle: 'italic',
                  }}>
                  {data.userTextAnswer}
                </Text>
              </>
            ) : (
              <>
                <View style={activityStyles.paragraphBgImg} />
                <View style={activityStyles.paragraphBgImg} />
                <View style={activityStyles.paragraphBgImg} />
                <View style={activityStyles.paragraphBgImg} />
              </>
            )}
          </>
          {this.props.showResult && !data.statusAnswerQuestion && (
            <View paddingVertical={8} paddingHorizontal={40}>
              <Text h5 bold paddingBottom={8}>
                {translate('Đáp án')}{' '}
              </Text>
              <Text h4 color={colors.helpText} paddingHorizontal={4}>
                {data.correctAnswer.trim()}
              </Text>
            </View>
          )}
          {!this.props.showResult && (
            <TouchableOpacity
              activeOpacity={0.65}
              style={[
                activityStyles.embedButton,
                activityStyles.embedButtonRound,
              ]}
              onPress={this.showModal}>
              <Text h5>{translate('Sắp xếp từ/cụm từ để trả lời')}</Text>
            </TouchableOpacity>
          )}
        </View>

        <OrderWordModal
          ref={(refs) => (this.modalRef = refs)}
          options={data.answers}
          onDone={this.onDone}
          key={data._id}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  index: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
});

QuestionWithOrder.propTypes = {
  data: PropTypes.object,
  action: PropTypes.func,
  showResult: PropTypes.bool,
};
QuestionWithOrder.defaultProps = {
  action: () => {},
  data: {},
  showResult: true,
};

export default QuestionWithOrder;
