import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { LocaleConfig, Calendar } from 'react-native-calendars';
import { dayFormat } from '../utils';
import _ from 'lodash';
import FormRadio from './form/FormRadio';
import { CustomButton } from './Component';
import { get } from '../HiNet';
import apis from '../apis';
import dayjs from 'dayjs';

export default (props: any) => {
  const { saveDuty } = props;
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const userInfo = useSelector((state) => {
    return state.userInfo.userInfo;
  });
  LocaleConfig.locales.cn = {
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    dayNames: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'],
    dayNamesShort: ['一', '二', '三', '四', '五', '六', '日'],
    today: '今',
  };
  LocaleConfig.defaultLocale = 'cn';
  const windowWidth = useWindowDimensions().width;
  const [marksDate, setMarksDate] = useState();
  const [items, setItems] = useState();
  const [options, setOptions] = useState([]);
  const [selectDay, setSelectDay] = useState(dayFormat());

  useEffect(() => {
    getDutyUserList();
    initDuty();
  }, []);

  let result;
  const onSave = () => {
    let res = [];
    if (dayjs().isAfter(dayjs(selectDay))) {
      Alert.alert('提示', '不能修改今天之前的排班');
      return;
    }
    _.find(options, (item) => {
      if (_.includes(result, item.value)) {
        res.push(item);
      }
    });
    if (res.length === 0) {
      return;
    }
    setMarksDate({ ...marksDate, [selectDay]: { marked: true } });
    setItems({
      ...items,
      [selectDay]: res,
    });
    saveDuty && saveDuty(_.map(res, 'value'), selectDay);
  };

  const getDutyUserList = () => {
    get(apis.getDutyUser)().then((res) => {
      res.map((item) => {
        options.push({ label: item.nick_name, value: item.user_id });
      });
      setOptions([...options]);
    });
  };

  const initDuty = (month?: string) => {
    get(apis.dutyList)({ gsId: userInfo.gsId, dutyTime: dayjs(month).format('YYYY-MM') }).then((res) => {
      let data = {};
      let marks = {};
      res.map((item) => {
        marks = { ...marks, [item.dutyTime]: { marked: true } };
        let old = data?.[item.dutyTime] ?? [];
        data = {
          ...data,
          [item.dutyTime]: _.uniqBy([...old, { label: item.username, value: item.dutyUser }], 'value'),
        };
      });
      setItems(data);
      setMarksDate(marks);
    });
  };

  return (
    <View style={[{ backgroundColor: theme }, styles.root]}>
      <Calendar
        horizontal
        pagingEnabled
        calendarWidth={windowWidth}
        markedDates={marksDate}
        onDayPress={(day) => {
          setSelectDay(day.dateString);
          let markerRes = {};
          _.map(marksDate, (item, key) => {
            if (item.marked) {
              markerRes = { [key]: item, ...markerRes };
            }
          });
          setMarksDate({ [day.dateString]: { selected: true }, ...markerRes });
        }}
        onMonthChange={(month) => {
          initDuty(`${month.year}-${month.month}`);
        }}
        hideArrows={false}
      />
      <View style={styles.dayBox}>
        <Text style={styles.dateTitle}>{selectDay}</Text>
        <Text style={styles.dateTitle}>
          {_.map(items?.[selectDay], 'value').length === 0
            ? '暂无值班人员'
            : _.map(items?.[selectDay], 'label').join(',')}
        </Text>
        <FormRadio
          label="值班人员"
          options={options}
          defaultValue={_.map(items?.[selectDay], 'value')}
          required={false}
          multiple
          onChange={(res) => {
            result = res;
          }}
        />
        <View>
          <CustomButton title="保存" onClick={onSave} />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  dayBox: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F3F3F3',
  },
  dateTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
});
