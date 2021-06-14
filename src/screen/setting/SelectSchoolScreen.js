import React, {
  useCallback,
  useState,
  useMemo,
  useRef,
  useImperativeHandle,
} from 'react';
import {FlatList, View, TouchableOpacity, StyleSheet} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Toast} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Button from '~/BaseComponent/components/base/Button';
import {
  BlankHeader,
  Card,
  FlexContainer,
  InputVocabulary,
  Logo,
  Text,
} from '~/BaseComponent';
import navigator from '~/navigation/customNavigator';
import {colors, images} from '~/themes';
import {PAGE_SIZE} from '~/constants/query';
import classApi from '~/features/class/ClassApi';
import {OS} from '~/constants/os';
import {removeVietnameseTones} from '~/utils/utils';
import {translate} from '~/utils/multilanguage';

const SelectSchoolScreen = () => {
  const [listData] = useState([
    {
      title: translate('Bạn học cấp mấy'),
      _id: '0',
      type: 'grade',
      requireType: '',
    },
    {
      title: translate('Chọn tỉnh/thành phố'),
      _id: '1',
      type: 'city',
      requireType: 'grade',
    },
    {
      title: translate('Chọn quận/huyện'),
      _id: '2',
      type: 'district',
      requireType: 'city',
    },
    {
      title: translate('Chọn trường'),
      _id: '3',
      type: 'school',
      requireType: 'district',
    },
  ]);
  const bottomSheetRef = useRef(null);
  const selectedRow = useRef(null);
  const selectedValuesRef = useRef({});
  const [selectedValues, setSelectedValues] = useState({});

  const onPressItem = useCallback((item) => {
    selectedRow.current = item.type;
    let params = {};
    if (item.type === 'district') {
      const city = selectedValuesRef.current.city;
      params = {provincial: city._id};
    } else if (item.type === 'school') {
      const city = selectedValuesRef.current.city;
      const district = selectedValuesRef.current.district;
      const grade = selectedValuesRef.current.grade;
      if (grade.name === 'Cấp 3') {
        params = {provincial: city._id, school_level: grade._id};
      } else {
        params = {district: district?._id || '', school_level: grade._id};
      }
    }
    setTimeout(() => {
      bottomSheetRef.current.showModal(item.type, params);
    }, 100);
  }, []);

  const selectedValue = useCallback((item) => {
    const currentValue = selectedValuesRef.current[selectedRow.current];
    if (currentValue && currentValue._id !== item._id) {
      if (selectedRow.current === 'city') {
        delete selectedValuesRef.current.district;
        delete selectedValuesRef.current.school;
      } else if (selectedRow.current === 'district') {
        delete selectedValuesRef.current.school;
      } else if (selectedRow.current === 'grade') {
        delete selectedValuesRef.current.school;
        if (item.name === 'Cấp 3') {
          delete selectedValuesRef.current.district;
        }
      }
    }
    selectedValuesRef.current[selectedRow.current] = item;
    setSelectedValues({...selectedValuesRef.current});
    bottomSheetRef.current.closeModal();
  }, []);

  const renderItem = useCallback(
    ({item}) => {
      let isEnable =
        item.requireType.length > 0 ? selectedValues[item.requireType] : true;
      const isGrade3 = selectedValues?.grade?.name === 'Cấp 3';
      if (isGrade3) {
        if (item.type === 'district') {
          isEnable = false;
        }
        if (item.type === 'school') {
          isEnable = selectedValues.city ? true : false;
        }
      }
      const value = selectedValues[item.type];
      return (
        <TouchableOpacity
          onPress={() => {
            if (isEnable) {
              onPressItem(item);
            }
          }}>
          <View style={[styles.item, isEnable ? {} : styles.itemDisable]}>
            <FlexContainer>
              <Text
                fontSize={17}
                color={isEnable ? colors.black : 'rgb(179,183,188)'}>
                {value?.short_name || value?.name || item?.title}
              </Text>
            </FlexContainer>
            <AntDesign
              size={15}
              name="down"
              color={isEnable ? 'rgb(52, 67, 86)' : 'rgb(179,183,188)'}
            />
          </View>
        </TouchableOpacity>
      );
    },
    [onPressItem, selectedValues],
  );

  const renderHeaderList = useCallback(() => {
    return (
      <View style={styles.header}>
        <Logo images={images.logoSimple} />
        <Card
          style={{
            paddingVertical: 20,
            marginTop: 32,
            paddingHorizontal: 20,
            borderRadius: 16,
          }}
          arrowTranslateX={6}
          hasArrow={true}>
          <Text center h4 bold color={colors.helpText}>
            {translate('Bạn đang học trường nào?')}
          </Text>
          <Text center h5 color={colors.helpText}>
            {translate('Hãy chọn trường của bạn nhé')}
          </Text>
        </Card>
      </View>
    );
  }, []);

  const closeScreen = useCallback(() => {
    navigator.goBack();
  }, []);

  const updateUserSchool = useCallback(async () => {
    const city = selectedValuesRef.current.city;
    const district = selectedValuesRef.current.district;
    const grade = selectedValuesRef.current.grade;
    const school = selectedValuesRef.current.school;
    const params = district
      ? {
          provincial_department_of_education: city._id,
          district_department_of_education: district._id,
          school_level: grade._id,
          school: school._id,
        }
      : {
          provincial_department_of_education: city._id,
          school_level: grade._id,
          school: school._id,
        };
    const res = await classApi.updateSchool(params);
    if (res.ok) {
      Toast.show({
        text: translate('Đã cập nhật thông tin thành công!'),
        buttonText: '',
        duration: 3000,
      });
      navigator.goBack();
    }
  }, []);

  return (
    <View style={styles.container}>
      <BlankHeader dark />
      <View style={styles.navigationBar}>
        <TouchableOpacity style={styles.cancelBtn} onPress={closeScreen}>
          <Text primary fontSize={18}>
            {translate('Bỏ qua')}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        ListHeaderComponent={renderHeaderList}
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.continueBtn}>
        <Button
          large
          primary
          rounded
          block
          uppercase
          bold
          icon
          disabled={!selectedValuesRef.current.school}
          onPress={updateUserSchool}>
          {translate('Tiếp tục')}
        </Button>
      </View>
      <BottomSheetModal ref={bottomSheetRef} selectedValue={selectedValue} />
    </View>
  );
};

const BottomSheetModalRef = (props, ref) => {
  const {selectedValue} = props;

  const sheetRef = useRef(null);
  const currentType = useRef(null);
  const paramsRef = useRef(null);

  const currentPage = useRef(-1);
  const canLoadMore = useRef(false);
  const refreshing = useRef(false);

  const searchValueRef = useRef('');
  const [searchValue, setSearchValue] = useState('');
  const [showDimBg, setShowDimBg] = useState(false);
  const snapPoints = useMemo(() => ['30%', '50%', '65%'], []);

  const [listChoices, setListChoices] = useState([]);

  useImperativeHandle(ref, () => ({
    showModal: (type, params) => {
      paramsRef.current = params;
      showModal(type);
    },
    closeModal: () => {
      closeModal();
    },
  }));

  const closeModal = useCallback(() => {
    setShowDimBg(false);
    sheetRef.current.close();
    setListChoices([]);
    currentPage.current = -1;
    canLoadMore.current = false;
    currentType.current = null;
  }, []);

  const loadPage = useCallback(
    (pageIndex) => {
      if (pageIndex >= 0) {
        async function requestToServer(pageQuery) {
          let res;
          if (currentType.current === 'city') {
            res = await classApi.getListProvinces({
              page: pageQuery,
              length: -1,
            });
          } else if (currentType.current === 'district') {
            res = await classApi.getListDistricts({
              page: pageQuery,
              length: -1,
              ...paramsRef.current,
            });
          } else if (currentType.current === 'grade') {
            res = await classApi.getListSchoolLevels({
              page: pageQuery,
              length: -1,
            });
          } else if (currentType.current === 'school') {
            res = await classApi.getListSchools({
              page: pageQuery,
              length: PAGE_SIZE,
              ...paramsRef.current,
              keyword: searchValueRef.current,
            });
          }
          if (res.ok && res.data && res.data.data) {
            if (currentType.current === 'school') {
              canLoadMore.current = res.data.data.length === PAGE_SIZE;
            }
            const filterList = res.data.data.filter((it) => {
              if (
                currentType.current === 'school' ||
                searchValueRef.current.length === 0
              ) {
                return true;
              }
              return (
                removeVietnameseTones(it?.short_name || it?.name).indexOf(
                  removeVietnameseTones(searchValueRef.current),
                ) !== -1
              );
            });
            if (pageQuery === 0) {
              refreshing.current = false;
              setListChoices(filterList);
            } else {
              setListChoices([...listChoices, ...filterList]);
            }
          } else {
            if (refreshing.current) {
              refreshing.current = false;
              setListChoices([]);
            }
            canLoadMore.current = false;
          }
        }
        requestToServer(pageIndex);
      }
    },
    [listChoices],
  );

  const onRefresh = useCallback(() => {
    canLoadMore.current = false;
    currentPage.current = 0;
    loadPage(0);
    refreshing.current = true;
    setListChoices([]);
  }, [loadPage]);

  const loadMore = useCallback(() => {
    if (canLoadMore.current && listChoices.length > 0) {
      currentPage.current = currentPage.current + 1;
      loadPage(currentPage.current);
    }
  }, [listChoices]);

  const showModal = useCallback(
    (type) => {
      if (type !== currentType.current) {
        currentType.current = type;
        if (currentType.current.length > 0) {
          setSearchValue('');
          searchValueRef.current = '';
          setShowDimBg(true);
          sheetRef.current.snapTo(2);
          onRefresh();
        } else {
          closeModal();
        }
      }
    },
    [closeModal, onRefresh],
  );

  const renderListEmpty = useCallback(() => {
    return (
      <View style={styles.emptyView}>
        <Text fontSize={18} color={colors.helpText}>
          {refreshing.current ? '' : translate('Chưa có dữ liệu')}
        </Text>
      </View>
    );
  }, []);

  const renderItemSheet = useCallback(
    ({item}) => {
      return (
        <TouchableOpacity onPress={() => selectedValue(item)}>
          <View style={styles.choiceItem}>
            <Text fontSize={18}>{item?.short_name || item?.name}</Text>
            <View style={styles.choiceItemBottomLine} />
          </View>
        </TouchableOpacity>
      );
    },
    [selectedValue],
  );

  return (
    <>
      {showDimBg && (
        <TouchableOpacity style={styles.dimBg} onPress={closeModal} />
      )}
      <BottomSheet
        style={{backgroundColor: colors.white}}
        index={-1}
        ref={sheetRef}
        snapPoints={snapPoints}
        onAnimate={(fromIndex, toIndex) => {
          if (toIndex < fromIndex && toIndex < 2) {
            closeModal();
          }
        }}>
        <InputVocabulary
          backgroundColor={'rgb(245,243,249)'}
          primary
          placeHolderText={translate('Tìm kiếm...')}
          value={searchValue}
          onChangeValue={(key) => {
            setSearchValue(key);
            searchValueRef.current = key;
            onRefresh();
          }}
        />
        <KeyboardAwareScrollView>
          <FlatList
            style={{backgroundColor: colors.white}}
            contentContainerStyle={{paddingBottom: 44}}
            data={listChoices}
            keyExtractor={(i) => i._id}
            renderItem={renderItemSheet}
            refreshing={false}
            onRefresh={onRefresh}
            onEndReachedThreshold={0.1}
            onEndReached={loadMore}
            ListEmptyComponent={renderListEmpty}
          />
        </KeyboardAwareScrollView>
      </BottomSheet>
    </>
  );
};

const BottomSheetModal = React.forwardRef(BottomSheetModalRef);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(245,243,249)',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  navigationBar: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    height: 44,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  continueBtn: {
    paddingHorizontal: 25,
    marginBottom: OS.hasNotch ? 48 : 24,
  },
  dimBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  item: {
    paddingVertical: 15,
    marginTop: 24,
    marginHorizontal: 24,
    borderRadius: 16,
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: 'rgb(150,150,150)',
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemDisable: {
    backgroundColor: 'rgb(246,248,250)',
  },
  choiceItem: {
    paddingVertical: 15,
    paddingHorizontal: 24,
    backgroundColor: colors.white,
  },
  choiceItemBottomLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: 'rgba(52,67,86,0.15)',
  },
  emptyView: {
    marginHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
  },
});
export default SelectSchoolScreen;
