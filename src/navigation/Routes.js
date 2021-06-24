import * as React from 'react';
import analytics from '@react-native-firebase/analytics';
import {NavigationContainer} from '@react-navigation/native';
import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';
import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';

import navigator from './customNavigator';

import LessonDetailPrimaryScreen from '~/screen/lesson/LessonDetailPrimaryScreen';
import LessonDetailScreen from '~/screen/lesson/LessonDetailScreen';
import {OS} from '~/constants/os';
import LoginScreen from '~/screen/authen/LoginScreen';
import LoginMethodScreen from '~/screen/authen/LoginMethodScreen';
import RegisterScreen from '~/screen/authen/RegisterScreen';
import PrivacyScreen from '~/screen/authen/PrivacyScreen';
import OnBoardingScreen from '~/screen/OnBoardingScreen';
import LessonPracticeSpeakDetailScreen from '~/screen/lesson/LessonPracticeSpeakDetailScreen';
import LibraryLessonDetailScreen from '~/screen/lesson/LibraryLessonDetailScreen';
import VocabularyCategoryScreen from '~/screen/lesson/VocabularyCategoryScreen';
import ExamCategoryScreen from '~/screen/exam/ExamCategoryScreen';
import DetailLectureListenScreen from '~/screen/lesson/DetailLectureListenScreen';
import DictionaryScreen from '~/screen/DictionaryScreen';
import SplashScreen from '~/screen/SplashScreen';
import AppBottomTab from '~/navigation/BottomTabbar';
import SearchTopicVocabularyScreen from '~/screen/lesson/SearchTopicVocabularyScreen';
import MainScriptScreen from '~/screen/script/MainScriptScreen';
import SentenceScreen from '~/screen/script/SentenceScreen';
import FlashcardCollectionScreen from '~/screen/script/FlashcardCollectionScreen';
import {getActiveRouteName} from '~/navigation/navigationHelper';
import GameWaterScreen from '~/screen/script/GameWaterScreen';
import GameAchievementScreen from '~/screen/script/GameAchievementScreen';
import ActivityBoardScreen from '~/screen/ActivityBoardScreen';
import TeachingSectionDetailScreen from '~/screen/lesson/TeachingSectionDetailScreen';
import ActivityFinishedScreen from '~/screen/activity/ActivityFinishedScreen';
import ActivityScreen from '~/screen/activity/ActivityScreen';
import CommonAnswerAllQuestionScreen from '~/screen/activity/CommonAnswerAllQuestionScreen';
import CommonHighlightOrStrikeScreen from '~/screen/activity/CommonHighlightOrStrikeScreen';
import CommonHighlightOrStrikeParagraphScreen from '~/screen/activity/CommonHighlightOrStrikeParagraphScreen';
import CommonMatchExpressionWithPicturesScreen from '~/screen/activity/CommonMatchExpressionWithPicturesScreen';
import CommonMatchingScreen from '~/screen/activity/CommonMatchingScreen';
import ConversationScreen from '~/screen/activity/ConversationScreen';
import FillInBlankMultiPartScreen from '~/screen/activity/FillInBlankMultiPartScreen';
import FillInBlankParagraphChooseCorrectWordsScreen from '~/screen/activity/FillInBlankParagraphChooseCorrectWordsScreen';
import FillInBlankParagraphWithGivenWordsScreen from '~/screen/activity/FillInBlankParagraphWithGivenWordsScreen';
import FillInBlankParagraphWritingScreen from '~/screen/activity/FillInBlankParagraphWritingScreen';
import ListenAnswerQuestionWithOrdersScreen from '~/screen/activity/ListenAnswerQuestionWithOrdersScreen';
import ListenSpeakSentenceScreen from '~/screen/activity/ListenSpeakSentenceScreen';
import ListenSpeakWordScreen from '~/screen/activity/ListenSpeakWordScreen';
import PerfectScoreStreakScreen from '~/screen/activity/PerfectScoreStreakScreen';
import PronunciationScreen from '~/screen/activity/PronunciationScreen';
import PronunciationSyllableHighlightScreen from '~/screen/activity/PronunciationSyllableHighlightScreen';
import PronunciationVipScreen from '~/screen/activity/PronunciationVipScreen';
import ReadingAnswerQuestionScreen from '~/screen/activity/ReadingAnswerQuestionScreen';
import ReadingAttachmentScreen from '~/screen/activity/ReadingAttachmentScreen';
import ReadingMatchingScreen from '~/screen/activity/ReadingMatchingScreen';
import RoleplayScreen from '~/screen/activity/RoleplayScreen';
import TranscriptScreen from '~/screen/activity/TranscriptScreen';
import LookAndTraceScreen from '~/screen/activity/primary/LookAndTraceScreen';
import LookAndWriteScreen from '~/screen/activity/primary/LookAndWriteScreen';
import PrimaryListenAndRepeatScreen from '~/screen/activity/primary/PrimaryListenAndRepeatScreen';
import PrimaryLetTalkScreen from '~/screen/activity/primary/PrimaryLetTalkScreen';
import PrimaryLookListenAndRepeatSentenceScreen from '~/screen/activity/primary/PrimaryLookListenAndRepeatSentenceScreen';
import PrimaryReadAndMatchTextScreen from '~/screen/activity/primary/PrimaryReadAndMatchTextScreen';
import PrimaryWriteSomethingScreen from '~/screen/activity/primary/PrimaryWriteSomethingScreen';
import PrimaryChooseAnswerForImageScreen from '~/screen/activity/primary/PrimaryChooseAnswerForImageScreen';
import PrimaryReadAndCompleteScreen from '~/screen/activity/primary/PrimaryReadAndCompleteScreen';
import PrimaryListenAndWriteScreen from '~/screen/activity/primary/PrimaryListenAndWriteScreen';
import UpdateUserFullNameScreen from '~/screen/setting/UpdateUserFullNameScreen';
import UpLevelScreen from '~/screen/activity/UpLevelScreen';
import VideoSpeakerAnswerScreen from '~/screen/activity/VideoSpeakerAnswerScreen';
import VocabularyMatchWordsWithDefinitionScreen from '~/screen/activity/VocabularyMatchWordsWithDefinitionScreen';
import VocabularyPictureScatterScreen from '~/screen/activity/VocabularyPictureScatterScreen';
import VocabularyWordMeditationScreen from '~/screen/vocabulary/VocabularyWordMeditationScreen';
import YoutubeScreen from '~/screen/activity/YoutubeScreen';
import FillInBlankWritingScreen from '~/screen/activity/FillInBlankWritingScreen';
import ListenChoosePictureScreen from '~/screen/activity/ListenChoosePictureScreen';
import ListeningSingleChoiceScreen from '~/screen/activity/ListeningSingleChoiceScreen';
import FillInBlankWithGivenWordsScreen from '~/screen/activity/FillInBlankWithGivenWordsScreen';
import Error404Screen from '~/screen/Error404Screen';
import HomeworkScreen from '~/screen/school/HomeworkScreen';
import HomeworkDetailScreen from '~/screen/school/HomeworkDetailScreen';
import ExamResultScreen from '~/screen/exam/ExamResultScreen';
import InstructionScreen from '~/screen/exam/InstructionScreen';
import OnboardExamEngScreen from '~/screen/exam/OnboardExamEngsScreen';
import SectionExamScreen from '~/screen/exam/SectionExamScreen';
import PartReadingExamScreen from '~/screen/exam/PartReadingExamScreen';
import PartExamScreen from '~/screen/exam/PartExamScreen';
import PartSectionListExamScreen from '~/screen/exam/PartSectionListExamScreen';
import SelectClassScreen from '~/screen/setting/SelectClassScreen';
import AccessClassScreen from '~/screen/school/AccessClassScreen';
import UserClassInfoScreen from '~/screen/school/UserClassInfoScreen';
import EssayExamsScreen from '~/screen/exam/ListEssayExamScreen';
import OnboardEssayExamScreen from '~/screen/exam/OnboardEssayExamScreen';
import EditorEssayExamScreen from '~/screen/exam/EditorEssayExamScreen';
import SpeakVipLessonScreen from '~/screen/lesson/SpeakVipLessonScreen';
import AccountScreen from '~/screen/AccountScreen';
import SummaryReviewScreen from '~/screen/activity/SummaryReviewScreen';
import SummaryVocabularyScreen from '~/screen/activity/SummaryVocabularyScreen';
import ListDocsHelpfulScreen from '~/screen/lesson/ListDocsHelpfulScreen';
import SearchExamScreen from '~/screen/exam/SearchExamScreen';
import PrimaryListenAndTickScreen from '~/screen/activity/primary/PrimaryListenAndTickScreen';
import PrimaryListenAndPointScreen from '~/screen/activity/primary/PrimaryListenAndPointScreen';
import PrimaryPointAnSayScreen from '~/screen/activity/primary/PrimaryPointAndSayScreen';
import PrimaryListenAndChantScreen from '~/screen/activity/primary/PrimaryListenAndChantScreen';
import PrimaryListenAndRepeatLetterScreen from '~/screen/activity/primary/PrimaryListenAndRepeatLetterScreen';
import PrimaryLetsSingScreen from '~/screen/activity/primary/PrimaryLetsSingScreen';
import PrimaryLetTalkConversationScreen from '~/screen/activity/primary/PrimaryLetTalkConversationScreen';
import PrimaryLetsTalkWithSituationsScreen from '~/screen/activity/primary/PrimaryLetsTalkWithSituationsScreen';
import PrimaryListenAndTickOrCrossScreen from '~/screen/activity/primary/PrimaryListenAndTickOrCrossScreen';
import PrimaryFindTheWordsScreen from '~/screen/activity/primary/PrimaryFindTheWordsScreen';
import PrimaryListenAndNumberScreen from '~/screen/activity/primary/PrimaryListenAndNumberScreen';
import PrimaryLookListenAndNumberScreen from '~/screen/activity/primary/PrimaryLookListenAndNumberScreen';
import IntroduceScreen from '~/screen/IntroduceScreen';
import ChangePasswordScreen from '~/screen/setting/ChangePasswordScreen';
import ProfileInfoScreen from '~/screen/setting/ProfileInfoScreen';
import CourseScreen from '~/screen/setting/CourseScreen';
import SelectSchoolScreen from '~/screen/setting/SelectSchoolScreen';
import SettingScreen from '~/screen/bottomTab/SettingScreen';
import ActivityPrimaryScreen from '~/screen/activity/ActivityPrimaryScreen';
import UserExamDidScreen from '~/screen/exam/UserExamDidScreen';
import NotificationsScreen from '~/screen/NotificationsScreen';
import PrimaryPointAndSayBubbleScreen from '~/screen/activity/primary/PrimaryPointAndSayBubbleScreen';
import ChangeLanguageScreen from '~/screen/ChangeLanguageScreen';
import HomeScreen from '~/screen/bottomTab/HomeScreen';
import InfoAccountScreen from '~/screen/InfoAccountScreen';

let Stack;
if (!OS.IsAndroid) {
  enableScreens();
  Stack = createNativeStackNavigator();
} else {
  Stack = createStackNavigator();
}

const AuthStack = () => {
  // const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {/*<Stack.Screen name="SyncExample" component={SyncExample} />*/}
      <Stack.Screen name="LoginMethod" component={LoginMethodScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
    </Stack.Navigator>
  );
};

const AppStack = () => {
  // const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      name={'Root'}
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
      <Stack.Screen name="ChangeLanguage" component={ChangeLanguageScreen} />
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="EditorEssayExam" component={EditorEssayExamScreen} />
      <Stack.Screen name="SearchExam" component={SearchExamScreen} />
      <Stack.Screen name="SpeakVipLesson" component={SpeakVipLessonScreen} />
      <Stack.Screen name="MainStack" component={HomeScreen} />
      <Stack.Screen name="SummaryReview" component={SummaryReviewScreen} />
      <Stack.Screen name={'LessonDetail'} component={LessonDetailScreen} />
      <Stack.Screen
        name={'LessonDetailPrimary'}
        component={LessonDetailPrimaryScreen}
      />
      <Stack.Screen
        name="PrimaryListenAndTickOrCross"
        component={PrimaryListenAndTickOrCrossScreen}
      />
      <Stack.Screen
        name="SummaryVocabulary"
        component={SummaryVocabularyScreen}
      />
      {/*<Stack.Screen name="MainStack" component={ZoomViewTest} />*/}
      <Stack.Screen
        name="LessonPracticeSpeakDetail"
        component={LessonPracticeSpeakDetailScreen}
      />
      <Stack.Screen
        name="LibraryLessonDetail"
        component={LibraryLessonDetailScreen}
      />
      <Stack.Screen
        name="VocabularyCategory"
        component={VocabularyCategoryScreen}
      />
      <Stack.Screen name="ExamCategory" component={ExamCategoryScreen} />
      <Stack.Screen
        name="DetailLectureListen"
        component={DetailLectureListenScreen}
      />
      <Stack.Screen name="Dictionary" component={DictionaryScreen} />
      <Stack.Screen
        name="SearchTopicVocabulary"
        component={SearchTopicVocabularyScreen}
        options={{
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
      <Stack.Screen name="MainScript" component={MainScriptScreen} />
      <Stack.Screen name="Sentence" component={SentenceScreen} />
      <Stack.Screen name="GameWater" component={GameWaterScreen} />
      <Stack.Screen name="GameAchievement" component={GameAchievementScreen} />
      <Stack.Screen name="ActivityBoard" component={ActivityBoardScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="InfoAccount" component={InfoAccountScreen} />
      <Stack.Screen
        name="TeachingSectionDetail"
        component={TeachingSectionDetailScreen}
      />
      <Stack.Screen
        name="FlashcardCollection"
        component={FlashcardCollectionScreen}
      />
      <Stack.Screen
        name="ActivityFinished"
        component={ActivityFinishedScreen}
      />
      <Stack.Screen name="Activity" component={ActivityScreen} />
      <Stack.Screen name="ActivityPrimary" component={ActivityPrimaryScreen} />
      <Stack.Screen
        name="PrimaryListenAndTick"
        component={PrimaryListenAndTickScreen}
      />
      <Stack.Screen
        name="PrimaryListenAndNumber"
        component={PrimaryListenAndNumberScreen}
      />
      <Stack.Screen
        name="PrimaryLookListenAndNumber"
        component={PrimaryLookListenAndNumberScreen}
      />
      <Stack.Screen
        name="PrimaryListenAndPoint"
        component={PrimaryListenAndPointScreen}
      />
      <Stack.Screen
        name="PrimaryPointAnSay"
        component={PrimaryPointAnSayScreen}
      />
      <Stack.Screen
        name="PrimaryListenAndRepeatLetter"
        component={PrimaryListenAndRepeatLetterScreen}
      />
      <Stack.Screen name="PrimaryLetsSing" component={PrimaryLetsSingScreen} />
      <Stack.Screen
        name="PrimaryLetTalkConversation"
        component={PrimaryLetTalkConversationScreen}
      />
      <Stack.Screen
        name="CommonAnswerAllQuestions"
        component={CommonAnswerAllQuestionScreen}
      />
      <Stack.Screen
        name="CommonHighlightOrStrikeParagraph"
        component={CommonHighlightOrStrikeParagraphScreen}
      />
      <Stack.Screen
        name="CommonHighlightOrStrike"
        component={CommonHighlightOrStrikeScreen}
      />
      <Stack.Screen
        name="CommonMatchExpressionWithPictures"
        component={CommonMatchExpressionWithPicturesScreen}
      />
      <Stack.Screen name="CommonMatching" component={CommonMatchingScreen} />
      <Stack.Screen name="Conversation" component={ConversationScreen} />
      <Stack.Screen
        name="FillInBlankMultiPart"
        component={FillInBlankMultiPartScreen}
      />
      <Stack.Screen name="LookAndTrace" component={LookAndTraceScreen} />
      <Stack.Screen name="LookAndWrite" component={LookAndWriteScreen} />
      <Stack.Screen
        name="PrimaryListenAndRepeat"
        component={PrimaryListenAndRepeatScreen}
      />
      <Stack.Screen name="PrimaryLetTalk" component={PrimaryLetTalkScreen} />
      <Stack.Screen
        name="PrimaryLookListenAndRepeatSentence"
        component={PrimaryLookListenAndRepeatSentenceScreen}
      />
      <Stack.Screen
        name="PrimaryPointAndSayBubble"
        component={PrimaryPointAndSayBubbleScreen}
      />
      <Stack.Screen
        name="PrimaryReadAndMatchText"
        component={PrimaryReadAndMatchTextScreen}
      />
      <Stack.Screen
        name="PrimaryReadAndComplete"
        component={PrimaryReadAndCompleteScreen}
      />
      <Stack.Screen
        name="PrimaryListenAndWrite"
        component={PrimaryListenAndWriteScreen}
      />
      <Stack.Screen
        name="PrimaryWriteSomething"
        component={PrimaryWriteSomethingScreen}
      />
      <Stack.Screen
        name="PrimaryChooseAnswerForImage"
        component={PrimaryChooseAnswerForImageScreen}
      />
      <Stack.Screen
        name="FillInBlankParagraphChooseCorrectWords"
        component={FillInBlankParagraphChooseCorrectWordsScreen}
      />
      <Stack.Screen
        name="FillInBlankParagraphWithGivenWords"
        component={FillInBlankParagraphWithGivenWordsScreen}
      />
      <Stack.Screen
        name="FillInBlankParagraphWriting"
        component={FillInBlankParagraphWritingScreen}
      />
      <Stack.Screen
        name="FillInBlankWriting"
        component={FillInBlankWritingScreen}
      />
      <Stack.Screen
        name="ListenAnswerQuestionWithOrders"
        component={ListenAnswerQuestionWithOrdersScreen}
      />
      <Stack.Screen
        name="PrimaryListenAndChant"
        component={PrimaryListenAndChantScreen}
      />
      <Stack.Screen
        name="PrimaryFindTheWords"
        component={PrimaryFindTheWordsScreen}
      />
      <Stack.Screen
        name="PrimaryLetsTalkWithSituations"
        component={PrimaryLetsTalkWithSituationsScreen}
      />
      <Stack.Screen
        name="ListenChoosePicture"
        component={ListenChoosePictureScreen}
      />
      <Stack.Screen
        name="ListeningSingleChoice"
        component={ListeningSingleChoiceScreen}
      />
      <Stack.Screen
        name="ListenSpeakSentence"
        component={ListenSpeakSentenceScreen}
      />
      <Stack.Screen name="ListenSpeakWord" component={ListenSpeakWordScreen} />
      <Stack.Screen
        name="PerfectScoreStreak"
        component={PerfectScoreStreakScreen}
      />
      <Stack.Screen name="Pronunciation" component={PronunciationScreen} />
      <Stack.Screen
        name="PronunciationSyllableHighlight"
        component={PronunciationSyllableHighlightScreen}
      />
      <Stack.Screen
        name="PronunciationVip"
        component={PronunciationVipScreen}
      />
      <Stack.Screen
        name="ReadingAnswerQuestions"
        component={ReadingAnswerQuestionScreen}
      />
      <Stack.Screen
        name="ReadingAttachment"
        component={ReadingAttachmentScreen}
      />
      <Stack.Screen name="ReadingMatching" component={ReadingMatchingScreen} />
      <Stack.Screen name="Roleplay" component={RoleplayScreen} />
      <Stack.Screen name="Transcript" component={TranscriptScreen} />
      <Stack.Screen name="UpLevel" component={UpLevelScreen} />
      <Stack.Screen
        name="VideoSpeakerAnswer"
        component={VideoSpeakerAnswerScreen}
      />
      <Stack.Screen
        name="VocabularyMatchWordsWithDefinition"
        component={VocabularyMatchWordsWithDefinitionScreen}
      />
      <Stack.Screen
        name="VocabularyPictureScatter"
        component={VocabularyPictureScatterScreen}
      />
      <Stack.Screen
        name="VocabularyWordMeditation"
        component={VocabularyWordMeditationScreen}
      />
      <Stack.Screen name="Youtube" component={YoutubeScreen} />
      <Stack.Screen name="ListDocsHelpful" component={ListDocsHelpfulScreen} />
      <Stack.Screen name="EssayExams" component={EssayExamsScreen} />
      <Stack.Screen
        name="FillInBlankWithGivenWords"
        component={FillInBlankWithGivenWordsScreen}
      />
      <Stack.Screen
        name="UpdateUserFullName"
        component={UpdateUserFullNameScreen}
      />
      <Stack.Screen name="Error404" component={Error404Screen} />
      <Stack.Screen name={'ExamResult'} component={ExamResultScreen} />
      <Stack.Screen name={'Instruction'} component={InstructionScreen} />
      <Stack.Screen name={'OnboardExamEng'} component={OnboardExamEngScreen} />
      <Stack.Screen
        name={'OnboardEssayExam'}
        component={OnboardEssayExamScreen}
      />
      <Stack.Screen name={'SectionExam'} component={SectionExamScreen} />
      <Stack.Screen
        name={'PartReadingExam'}
        component={PartReadingExamScreen}
      />
      <Stack.Screen name={'PartExam'} component={PartExamScreen} />
      <Stack.Screen
        name={'PartSectionListExam'}
        component={PartSectionListExamScreen}
      />
      <Stack.Screen name={'SelectClass'} component={SelectClassScreen} />
      <Stack.Screen name={'Homework'} component={HomeworkScreen} />
      <Stack.Screen name={'HomeworkDetail'} component={HomeworkDetailScreen} />
      <Stack.Screen name={'AccessClass'} component={AccessClassScreen} />
      <Stack.Screen name={'UserClassInfo'} component={UserClassInfoScreen} />
      <Stack.Screen name={'ChangePassword'} component={ChangePasswordScreen} />
      <Stack.Screen name={'UserExamDid'} component={UserExamDidScreen} />
      <Stack.Screen name={'Profile'} component={ProfileInfoScreen} />
      <Stack.Screen name={'Course'} component={CourseScreen} />
      <Stack.Screen name={'SelectSchool'} component={SelectSchoolScreen} />
      <Stack.Screen name={'Setting'} component={SettingScreen} />
      <Stack.Screen name={'Introduce'} component={IntroduceScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
    </Stack.Navigator>
  );
};

export default function Routes() {
  const naviRef = React.useRef(null);

  return (
    <NavigationContainer
      ref={(navigationRef) => {
        if (navigationRef) {
          navigator.setContainer(navigationRef);
          naviRef.current = navigationRef;
        }
      }}
      onStateChange={(state) => {
        const previousRouteName = naviRef.current.getCurrentRoute().name;
        const currentRouteName = getActiveRouteName(state);
        if (previousRouteName !== currentRouteName) {
          analytics().setCurrentScreen(currentRouteName, currentRouteName);
        }
        console.log('currentRouteName ', currentRouteName);
      }}>
      <AppStack />
    </NavigationContainer>
  );
}
