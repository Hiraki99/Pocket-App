import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {AnimatableButton} from '~/BaseComponent';
import {OS} from '~/constants/os';
import {changeCurrentScriptItem} from '~/features/script/ScriptAction';
import {generateNextActivity} from '~/utils/script';
import {translate} from '~/utils/multilanguage';

class SentenceAction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      endAnimation: false,
      clicked: false,
    };

    this.nextAction = this.nextAction.bind(this);
  }

  componentDidMount() {
    const {action} = this.props;
    const {delay} = action;

    if (delay && delay !== 0) {
      this.timeout = setTimeout(() => {
        this.setState({
          show: true,
        });
      }, delay);
    } else {
      this.setState({
        show: true,
      });
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.setState({clicked: false});
  }

  nextAction = async () => {
    if (!this.state.clicked) {
      generateNextActivity(...Array(2), false);
      await this.setState({clicked: true});
    }
  };

  renderButton = () => {
    const {action, disabled} = this.props;
    return (
      <AnimatableButton
        rounded
        block
        uppercase
        bold
        icon
        large
        primary
        marginTop={24}
        animation={disabled ? 'slideInUp' : 'fadeInUp'}
        onAnimationEnd={() => {
          this.setState({endAnimation: true});
        }}
        useNativeDriver={true}
        easing="ease-in-out"
        duration={500}
        disabled={this.props.disabled}
        onPress={this.nextAction}>
        {translate(action.data.text)}
      </AnimatableButton>
    );
  };
  render() {
    const {show} = this.state;
    if (!show) {
      return null;
    }
    if (OS.IsAndroid) {
      return (
        <View
          style={{
            flex: 1,
            paddingBottom: this.state.endAnimation ? 0 : 300,
          }}>
          {this.renderButton()}
        </View>
      );
    }

    return this.renderButton();
  }
}

SentenceAction.propTypes = {
  action: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
};

SentenceAction.defaultProps = {
  disabled: false,
};

const mapStateToProps = (state) => {
  return {
    currentActivity: state.activity.currentActivity,
    currentScriptItem: state.script.currentScriptItem,
  };
};

export default connect(mapStateToProps, {changeCurrentScriptItem})(
  SentenceAction,
);
