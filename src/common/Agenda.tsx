import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { Agenda, LocaleConfig, Calendar } from 'react-native-calendars';
import { dayFormat } from '../utils';
import _ from 'lodash';
import FormRadio from './form/FormRadio';
import { CustomButton } from './Component';

export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  LocaleConfig.locales['cn'] = {
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
  const [options, setOptions] = useState([
    { label: '张三', value: 1, duty: '值班领导' },
    { label: '李四', value: 2 },
    { label: '王五', value: 3 },
    { label: '贺六', value: 4 },
    { label: '范七', value: 5 },
  ]);
  const [selectDay, setSelectDay] = useState(dayFormat());
  let result;
  const onSave = () => {
    let res = [];
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
  };
  return (
    <View style={[{ backgroundColor: theme }, styles.root]}>
      <Calendar
        horizontal={true}
        pagingEnabled={true}
        calendarWidth={windowWidth}
        markedDates={marksDate}
        onDayPress={(day) => {
          setSelectDay(day.dateString);
          let result = {};
          _.map(marksDate, (item, key) => {
            if (item.marked) {
              result = { [key]: item, ...result };
            }
          });
          setMarksDate({ [day.dateString]: { selected: true }, ...result });
        }}
        hideArrows={false}
      />
      <View style={styles.dayBox}>
        <Text style={styles.dateTitle}>{selectDay}</Text>
        <Text>
          {_.map(items?.[selectDay], 'value').length === 0
            ? '暂无值班人员'
            : _.map(items?.[selectDay], 'label').join(',')}
        </Text>
        <FormRadio
          label="值班人员"
          options={options}
          defaultValue={_.map(items?.[selectDay], 'value')}
          required={false}
          multiple={true}
          onChange={(res) => {
            result = res;
          }}
        />
        <View style={{ marginBottom: 20 }}>
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
    justifyContent: 'space-between',
  },
  dateTitle: {
    fontSize: 18,
  },
});
