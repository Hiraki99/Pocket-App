import React, {useState, useEffect} from 'react';
import LottieView from 'lottie-react-native';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import {StyleSheet, View, ActivityIndicator} from 'react-native';

const LottieViewUrl = (props) => {
  const [lottieJson, setLottieJson] = useState({});

  useEffect(() => {
    RNFetchBlob.config({
      fileCache: true,
    })
      .fetch('GET', props.url, {})
      .then((res) => {
        RNFS.readFile(res.path()).then((data) => {
          setLottieJson(JSON.parse(data));
        });
      });
  }, [props.url]);

  if (Object.keys(lottieJson).length === 0) {
    return (
      <View style={styles.contentView}>
        <ActivityIndicator size={'large'} color={'gray'} center />
      </View>
    );
  }

  return (
    <View style={styles.contentView}>
      <LottieView autoPlay loop source={lottieJson} />
    </View>
  );
};

const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
});

export default LottieViewUrl;
