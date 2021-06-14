/* eslint-disable react-hooks/rules-of-hooks */
import {shallowEqual, useSelector} from 'react-redux';

const getAllInfoExamSelector = () => {
  const currentSection = useSelector(
    (state) => state.exam.currentSection || {},
    shallowEqual,
  );

  const introExam = useSelector(
    (state) => state.exam.introExam || {},
    shallowEqual,
  );

  const showResult = useSelector(
    (state) => state.exam.showResult,
    shallowEqual,
  );

  const parts = useSelector((state) => state.exam.parts || {}, shallowEqual);
  const sections = useSelector(
    (state) => state.exam.sections || [],
    shallowEqual,
  );

  const currentPart = useSelector(
    (state) => state.exam.currentPart || {},
    shallowEqual,
  );

  const questions = useSelector(
    (state) => state.exam.questions || {},
    shallowEqual,
  );

  return {
    currentSection,
    showResult,
    parts,
    sections,
    currentPart,
    questions,
    introExam,
  };
};

export default getAllInfoExamSelector;
