import authReducer, {
  sttReducer,
  errorReducer,
} from '~/features/authentication/AuthenReducer';
import courseReducer from '~/features/course/CourseReducer';
import lessonReducer from '~/features/lessons/LessonReducer';
import partReducer from '~/features/part/PartReducer';
import activityReducer from '~/features/activity/ActivityReducer';
import scriptReducer from '~/features/script/ScriptReducer';
import vocabularyReducer from '~/features/vocalbulary/VocabularyReducer';
import progressReducer from '~/features/progress/ProgressReducer';
import homeworkReducer from '~/features/homework/HomeworkReducer';
import classReducer from '~/features/class/ClassReducer';
import configReducer from '~/features/config/ConfigReducer';
import notification from '~/features/notification/NotificationReducer';
import {detailExam, overViewExam} from '~/features/exam/ExamReducer';

export default {
  auth: authReducer,
  course: courseReducer,
  lesson: lessonReducer,
  part: partReducer,
  activity: activityReducer,
  script: scriptReducer,
  vocabulary: vocabularyReducer,
  progress: progressReducer,
  stt: sttReducer,
  error: errorReducer,
  exam: detailExam,
  overviewExam: overViewExam,
  homework: homeworkReducer,
  classInfo: classReducer,
  config: configReducer,
  notification,
};
