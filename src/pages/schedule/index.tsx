import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  Alert,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { CustomButton, NavBar } from '../../common/Component';
import { LocaleConfig, Calendar } from 'react-native-calendars';
import FormSelect from '../../common/form/FormSelect';
import { post } from '../../HiNet';
import apis from '../../apis';
import { dayFormat, getDateList } from '../../utils';
import _ from 'lodash';
import dayjs from 'dayjs';
import NavigationUtil from '../../navigator/NavigationUtil';
export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  LocaleConfig.locales.cn = {
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    dayNames: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'],
    dayNamesShort: ['一', '二', '三', '四', '五', '六', '日'],
    today: '今',
  };
  LocaleConfig.defaultLocale = 'cn';
  const [marksDate, setMarksDate] = useState({});
  const [options, setOptions] = useState([]);
  const [workerId, setWorderId] = useState();
  const [dutyTime, setDutyTime] = useState(dayFormat());
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingCount, setPendingCount] = useState('');
  const windowWidth = useWindowDimensions().width;
  useEffect(() => {
    initDutyUser();
    _getReportCount();
  }, []);

  useEffect(() => {
    if (dutyTime && workerId) {
      getDutyListById();
    }
  }, [workerId, dutyTime]);
  const _getReportCount = () => {
    post(apis.dutyReport)()().then((res) => {
      setPendingCount(res ?? 0);
    });
  };
  const undockSchedule = (day: string) => {
    post(apis.removeSchedule)({ workerId, dateOnDuty: day })().then((res) => {
      Alert.alert('提示', '移除成功');
      getDutyListById();
    });
  };
  const getDutyListById = () => {
    post(apis.getDutyListById)({ workerId, dutyTime })().then((res) => {
      let result = {};
      res.map((item) => {
        result[item.dateOnDuty] = { marker: true, color: theme.primary, textColor: '#FFFFFF' };
      });
      setMarksDate(result);
    });
  };
  const changeDate = (day: string) => {
    if (marksDate?.[day]) {
      if (marksDate[day]?.marker) {
        Alert.alert('提示', `是否取消${day}的值班`, [
          {
            text: '确定',
            onPress: () => {
              undockSchedule(day);
            },
          },
          { text: '取消' },
        ]);
        return;
      }
      marksDate[day] = undefined;
    } else {
      const selectArray = _.pull(_.map(marksDate, 'selected'), undefined);
      if (selectArray?.length === 0) {
        marksDate[day] = { selected: true, color: theme.success };
      } else if (selectArray?.length === 1) {
        let haveDay, start, end;
        _.map(_.toPairs(marksDate), (item) => {
          if (item[1]?.selected) {
            haveDay = item[0];
          }
        });
        if (dayjs(haveDay).isBefore(day)) {
          start = haveDay;
          end = day;
        } else {
          start = day;
          end = haveDay;
        }
        const dates = getDateList(start, end);
        _.map([start, ...dates, end], (date) => {
          marksDate[date] = { marker: true, color: theme.success };
        });
      }
    }
    setMarksDate({ ...marksDate });
  };
  const initDutyUser = () => {
    post(apis.getDutyUser)()().then((res) => {
      res.map((item) => {
        options.push({ label: item.nickName, value: item._id });
      });
      setOptions([...options]);
    });
  };
  const saveSchedule = () => {
    const flag = _.concat(
      _.pull(_.map(marksDate, 'marker'), undefined),
      _.pull(_.map(marksDate, 'selected'), undefined),
    );
    if (flag.length === 0) {
      Alert.alert('提示', '尚未选择新排班日期');
      return;
    }
    let dutyTimes = [];
    _.map(_.toPairs(marksDate), (item) => {
      if (item[1]?.marker) {
        dutyTimes.push(item[0]);
      }
      if (item[1]?.selected) {
        dutyTimes.push(item[0]);
      }
    });
    post(apis.saveSchedule)({ dutyTimes, workerId })().then((res) => {
      let msg = res?.flag ? '部分早于今日的排班无法修改' : '修改成功';
      Alert.alert('提示', msg);
      getDutyListById();
    });
  };
  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar
        title="排班"
        rightTitle="三"
        onRightClick={() => {
          setModalVisible(true);
        }}
      />
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <FormSelect label="工作人员" required={false} options={options} onChange={setWorderId} />
        <Calendar
          horizontal
          pagingEnabled
          markingType={'period'}
          calendarWidth={windowWidth}
          markedDates={marksDate}
          onDayPress={(day) => {
            changeDate(day.dateString);
          }}
          onMonthChange={(month) => {
            setDutyTime(`${month.year}-${month.month}`);
          }}
          hideArrows={false}
        />
        {workerId && (
          <View>
            <CustomButton title="保存排班" onClick={saveSchedule} />
          </View>
        )}
        <Modal
          animationType="fade"
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
          transparent
        >
          <View style={{ flex: 1, alignItems: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.65)' }}>
            <View style={{ width: windowWidth / 1.5, flex: 1, backgroundColor: theme.backgroundColor }}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ borderColor: theme.borderColor, ...styles.pendingBox }}
                onPress={() => {
                  NavigationUtil.goPage({}, 'ChangeShiftList');
                }}
              >
                <Image source={require('../../assets/image/pending.png')} style={{ width: 45, height: 45 }} />
                <Text style={{ fontSize: 18, color: '#000000' }}>待处理 {pendingCount}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ padding: 10, width: 65, alignItems: 'center' }}
                onPress={() => {
                  setModalVisible(false);
                  NavigationUtil.goPage({ title: '调班申请', type: 1, editable: true }, 'ChangeShiftDetail');
                }}
              >
                <Image source={require('../../assets/image/changeShift.png')} style={{ width: 45, height: 45 }} />
                <Text style={{ color: '#000000' }}>调班</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  closeText: {
    fontSize: 18,
    fontWeight: '700',
    padding: 5,
    textAlign: 'right',
  },
  pendingBox: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
});
