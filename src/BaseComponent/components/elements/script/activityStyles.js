import {Dimensions} from 'react-native';

import {colors} from '~/themes';

const {width} = Dimensions.get('window');
// const infoWidth = width - 24 * 2 - 24 * 2 - 8 * 2 - 30;
const infoWidth = width - 96 - 16;
export const attachmentWidth = infoWidth - 16 * 2;

export default {
  commonWidth: {
    width: infoWidth,
  },
  wrap: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  col: {
    flexDirection: 'column',
  },
  right: {
    alignSelf: 'flex-end',
  },
  autoWidth: {
    width: 'auto',
    maxWidth: infoWidth,
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
  mainInfoNoPadding: {
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  contentWrap: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  userInlineSentence: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 24,
    width: 'auto',
    marginHorizontal: 0,
  },
  inlineActionWrap: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#E7E8EB',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  inlineActionItem: {
    paddingVertical: 10,
    borderBottomColor: '#E7E8EB',
    borderBottomWidth: 1,
  },
  selfCenter: {},
  inlineActionItemLast: {
    borderBottomWidth: 0,
  },
  loading: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  embedBtn: {
    textAlign: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderColor: '#E7E8EB',
    borderWidth: 1,
    borderTopWidth: 0,
  },
  embedBtnNoBorder: {
    textAlign: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderColor: '#E7E8EB',
    borderWidth: 1,
    borderTopWidth: 0,
  },
  modal: {
    backgroundColor: '#F3F5F9',
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
  },
  paragraph: {
    marginTop: 10,
    minHeight: 150,
    position: 'relative',
  },
  paragraphBg: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  paragraphBgImg: {
    marginTop: 22,
    width: '100%',
    borderWidth: 0.5,
    borderColor: '#D3D8DF',
    borderStyle: 'dashed',
  },
  aqOptions: {
    backgroundColor: '#E2E6EF',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -24,
    marginRight: -24,
    marginBottom: -24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
  },
  aqOption: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 9,
    paddingHorizontal: 11,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 1.5,
    elevation: 3,
  },
  embedButton: {
    borderWidth: 1,
    borderColor: '#E7E8EB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingVertical: 10,
  },
  embedButtonRound: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 20,
  },
};
