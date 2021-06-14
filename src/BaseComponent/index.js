import {Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {createAnimatableComponent} from 'react-native-animatable';

import Text from './components/base/Text';
import InputVocabulary from './components/elements/input/InputVocabulary';
import Autocomplete from './components/base/Autocomplete';
import Button from './components/base/Button';
import Card from './components/base/Card';
import GeneralStatusBar from './components/base/GeneralStatusBar';
import CommonAlert from './components/base/commonAlert/CommonAlert';
import Loading from './components/base/Loading';
import FilterButton from './components/base/FilterButton';
import CheckBox from './components/base/CheckBox';
import Option from './components/base/Option';
import Logo from './components/base/Logo';
import CommonImage from './components/base/Image';
import ThumbnailVideo from './components/base/ThumnailVideo';
import SpeakActivityItem from './components/elements/activity/SpeakActivityItem';
import PartTimeline from './components/elements/part/PartTimeline';
// eslint-disable-next-line import/order
import ActivityItem from './components/elements/activity/ActivityItem';

//header
import BlankHeader from './components/layouts/BlankHeader';
import CommonHeader from './components/layouts/CommonHeader';
import StarHeader from './components/layouts/StarHeader';
import AnimatedHeader from './components/layouts/AnimatedHeader';
// element
import Avatar from './components/elements/profile/Avatar';
import {
  Container,
  ColumnContainer,
  RowContainer,
  FlexContainer,
  NoFlexContainer,
  FlexRowContainer,
  StartColumnContainer,
  STextInput,
  SeparatorHorizontal,
  SeparatorVertical,
  BottomTabContainer,
  BottomWrapper,
} from './components/base/CommonContainer';
import TextBase from './components/base/text-base/TextBase';
import TutorialHeader from './components/layouts/TutorialsHeader';
import Input from './components/base/Input';
import TranscriptModalRef from './components/elements/script/TranscriptModal';
import TranslateText from './components/elements/TranslateText';
import DateRangePicker from './components/elements/DateRangePicker';
import ThumbnailImage from './components/base/ThumnailImage';
import AudioPlayer from './components/base/AudioPlayer';
const AnimatableButton = createAnimatableComponent(Button);
const AnimatableCard = createAnimatableComponent(Card, {
  transition: 'transition',
});
const AnimatableNoFlexContainer = createAnimatableComponent(NoFlexContainer);
const AnimatableText = createAnimatableComponent(Text);
const AnimatableImage = createAnimatableComponent(Image);
const AnimatableFastImage = createAnimatableComponent(FastImage);

export {
  // Base Component
  Text,
  Autocomplete,
  Button,
  GeneralStatusBar,
  Card,
  CommonAlert,
  Loading,
  FilterButton,
  CheckBox,
  Logo,
  Avatar,
  ThumbnailVideo,
  CommonImage,
  ThumbnailImage,
  AudioPlayer,
  AnimatableButton,
  AnimatableCard,
  AnimatableNoFlexContainer,
  AnimatableText,
  AnimatableImage,
  AnimatableFastImage,
  // common Container
  Container,
  ColumnContainer,
  RowContainer,
  FlexContainer,
  NoFlexContainer,
  FlexRowContainer,
  StartColumnContainer,
  BottomTabContainer,
  STextInput,
  SeparatorVertical,
  SeparatorHorizontal,
  BottomWrapper,
  //header
  BlankHeader,
  CommonHeader,
  StarHeader,
  AnimatedHeader,
  // elements
  //Activity Element
  ActivityItem,
  // Speak Element
  SpeakActivityItem,
  // Part Element
  PartTimeline,
  InputVocabulary,
  Option,
  DateRangePicker,
  TutorialHeader,
  TranslateText,
  TranscriptModalRef,
  Input,
  TextBase,
};
