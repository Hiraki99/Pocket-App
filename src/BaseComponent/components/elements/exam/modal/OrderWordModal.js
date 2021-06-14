import React from 'react';
import ModalWrapper from 'react-native-modal-wrapper';
import PropTypes from 'prop-types';
import shuffle from 'lodash/shuffle';
import {Icon} from 'native-base';
import {View, TouchableOpacity, Dimensions} from 'react-native';

import {Text} from '~/BaseComponent';
import activityStyles from '~/BaseComponent/components/elements/script/activityStyles';
import {colors} from '~/themes';
import {playAudio} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

const {width} = Dimensions.get('window');

export default class OrderWordModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      selected: [],
      shuffleOptions: [],
    };
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.key !== this.props.key) {
      this.init();
    }
  }

  init = () => {
    const {options} = this.props;
    const shuffleOptions = shuffle(options);
    this.setState({
      shuffleOptions,
      showModal: false,
      selected: [],
    });
  };

  showModal = () => {
    this.setState({
      showModal: true,
    });
  };

  closeModal = () => {
    this.setState({
      showModal: false,
    });
  };

  onSelectItem = (item, isSelected) => {
    if (isSelected) {
      const {selected} = this.state;
      const index = selected.findIndex((o) => o.key === item.key);

      const newSelected = [...selected];
      newSelected.splice(index, 1);
      this.setState({
        selected: newSelected,
      });
    } else {
      this.setState({
        selected: [...this.state.selected, item],
      });
    }
    playAudio('selected');
  };

  removeLastItem = () => {
    if (this.state.selected.length > 0) {
      const selected = [...this.state.selected];
      selected.splice(selected.length - 1, 1);

      this.setState({
        selected,
      });
    }
  };

  checkAnswer = () => {
    const {onDone} = this.props;
    const {selected} = this.state;
    onDone(selected);
  };

  renderOptions = () => {
    const {shuffleOptions, selected} = this.state;

    return (
      <View style={activityStyles.aqOptions}>
        {shuffleOptions.map((item) => {
          const index = selected.findIndex((o) => o.key === item.key);

          return (
            <TouchableOpacity
              onPress={() => this.onSelectItem(item, index !== -1)}
              activeOpacity={0.65}
              style={activityStyles.aqOption}>
              <Text
                h5
                color={index !== -1 ? colors.helpText3 : colors.helpText}>
                {item.text}
              </Text>
            </TouchableOpacity>
          );
        })}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={this.checkAnswer}
            activeOpacity={0.65}
            style={[
              activityStyles.aqOption,
              {width: width - 24 * 2 - 90, backgroundColor: colors.primary},
            ]}>
            <Text h5 color={colors.white}>
              {translate('OK')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.removeLastItem}
            activeOpacity={0.65}
            style={[activityStyles.aqOption, {width: 70, marginRight: 0}]}>
            <Icon name="delete" type="Feather" style={{fontSize: 20}} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    const {selected} = this.state;

    const selectedText = selected.map((item) => item.text).join(' ');

    return (
      <ModalWrapper
        containerStyle={{
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}
        onRequestClose={this.closeModal}
        shouldAnimateOnRequestClose={true}
        style={{flex: 1, borderTopRightRadius: 24, borderTopLeftRadius: 24}}
        visible={this.state.showModal}>
        <View style={activityStyles.modal}>
          <Text uppercase h5 bold>
            Câu trả lời
          </Text>

          <View style={activityStyles.paragraph}>
            <Text h5>{selectedText}</Text>

            <View style={activityStyles.paragraphBg}>
              <View style={activityStyles.paragraphBgImg} />
              <View style={activityStyles.paragraphBgImg} />
              <View style={activityStyles.paragraphBgImg} />
              <View style={activityStyles.paragraphBgImg} />
              <View style={activityStyles.paragraphBgImg} />
              <View style={activityStyles.paragraphBgImg} />
            </View>
          </View>

          {this.renderOptions()}
        </View>
      </ModalWrapper>
    );
  }
}

OrderWordModal.propTypes = {
  options: PropTypes.array.isRequired,
  onDone: PropTypes.func.isRequired,
};

OrderWordModal.defaultProps = {
  options: [],
  onDone: () => {},
};
