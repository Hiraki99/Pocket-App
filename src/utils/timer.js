import BackgroundTimer from 'react-native-background-timer';

let time = 0;
let interval;

const getTimerCurrentExam = (callback) => {
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => {
    callback(time);
  }, 1000);
};

const clearIntervalTimingGlobal = () => {
  if (interval) {
    clearInterval(interval);
  }
  BackgroundTimer.stopBackgroundTimer();
  time = 0;
};

const increaseTime = () => {
  time += 1;
};

const startTimer = () => {
  BackgroundTimer.runBackgroundTimer(() => {
    increaseTime();
  }, 1000);
};

export default {
  getTimerCurrentExam,
  clearIntervalTimingGlobal,
  increaseTime,
  startTimer,
};
