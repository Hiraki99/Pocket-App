import React from 'react';
import {
  View,
  SectionList,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';

import Text from '~/BaseComponent/components/base/Text';
import colors from '~/themes/colors';
import testData from '~/constants/testData';
import images from '~/themes/images';
import {OS} from '~/constants/os';

export default class TestPartModal extends React.Component {
  render() {
    const {show, onClose} = this.props;

    const data = testData.sections.map((item) => {
      return {
        ...item,
        data: item.parts,
      };
    });

    return (
      <Modal isVisible={show} style={styles.modal}>
        <View style={styles.content}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Image source={images.close} style={styles.closeBtnImg} />
          </TouchableOpacity>

          <Text fontSize={24} accented bold>
            Questions
          </Text>

          <SectionList
            sections={data}
            keyExtractor={(item, index) => `section-${index}`}
            renderItem={this.renderItem}
            renderSectionHeader={this.renderSectionHeader}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    );
  }

  renderItem = ({item, index: sectionIndex}) => {
    return (
      <>
        <Text fontSize={17} bold style={{marginBottom: 5}}>
          {item.name}
        </Text>
        <FlatList
          data={item.questions}
          showsVerticalScrollIndicator={false}
          renderItem={this.renderListItem}
          keyExtractor={({item, index}) => `question-${sectionIndex}-${index}`}
        />
      </>
    );
  };

  renderSectionHeader = ({section: {name}}) => (
    <Text primary uppercase fontSize={17} bold style={styles.header}>
      {name}
    </Text>
  );

  renderListItem = ({item, index}) => (
    <View style={styles.question}>
      <View style={styles.questionDot} />
      <Text fontSize={17}>Question {index + 1}</Text>
    </View>
  );
}

TestPartModal.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
};

TestPartModal.defaultProps = {
  show: false,
  onClose: () => {},
};

const styles = {
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    height: OS.HEIGHT - 83,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 50,
  },
  header: {
    paddingVertical: 16,
    backgroundColor: colors.white,
  },
  question: {
    marginLeft: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  questionDot: {
    height: 6,
    width: 6,
    backgroundColor: colors.primary,
    marginRight: 11,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  closeBtnImg: {
    width: 13,
    height: 13,
  },
};
