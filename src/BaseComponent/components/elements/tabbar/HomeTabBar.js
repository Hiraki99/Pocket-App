import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
// import PropTypes from 'prop-types';

import {Text} from '~/BaseComponent';
import {colors} from '~/themes';
import {translate} from '~/utils/multilanguage';

export default class HomeTabBar extends React.Component {
  render() {
    return (
      <View style={[styles.tabs, this.props.style]}>
        {this.props.tabs.map((tab, i) => {
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => this.props.goToPage(i)}
              style={[
                styles.tab,
                this.props.activeTab === i
                  ? {backgroundColor: colors.primary, borderRadius: 16}
                  : {},
              ]}>
              <Text
                fontSize={14}
                bold
                uppercase
                color={
                  this.props.activeTab === i ? colors.white : colors.normalText
                }>
                {translate(tab)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}
HomeTabBar.propTypes = {};
HomeTabBar.defaultProps = {};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#F5F6F9',
    shadowColor: '#788db4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 1,
    borderBottomWidth: 0,
    justifyContent: 'center',
    borderRadius: 16,
    marginHorizontal: 24,
    marginBottom: 8,
  },
  label: {width: 'auto', marginTop: 6},
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    height: 45,
    flexDirection: 'row',
    paddingTop: 5,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
});
