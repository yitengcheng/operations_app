import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { dayFormat } from '../../utils';
import { CalendarList } from 'react-native-common-date-picker';
import dayjs from 'dayjs';
import ErrorMessage from './ErrorMessage';
import Label from './Label';

/**
 * 日期范围选择
 * @param props
 * @returns
 */

const FormDateRange = (props: any) => {
  const { label, placeholder, onChange, maxDate, minDate, editable = true, defaultValue, ...other } = props;
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const placeholderText = placeholder ?? '请选择 开始日期 - 结束日期';
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState(defaultValue ?? '');
  return (
    <View style={styles.column}>
      <Label {...props} />
      <TouchableOpacity style={[{ borderColor: theme.borderColor }, styles.borderBox]} onPress={() => setVisible(true)}>
        {text ? (
          <Text style={{ color: theme.fontColor, fontSize: theme.fontSize }}>{text}</Text>
        ) : (
          <Text style={{ color: '#9EA0A4', fontSize: theme.fontSize }}>{placeholderText}</Text>
        )}
      </TouchableOpacity>
      {props.isFieldInError && ErrorMessage(props.isFieldInError, props.getErrorsInField, props.name)}
      <Modal animationType={'slide'} visible={editable && visible} transparent>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.65)' }}>
          <CalendarList
            cancelText="取消"
            confirmText="确定"
            titleText={label}
            weeksChineseType
            headerTitleType={1}
            horizontal
            minDate={minDate ?? dayFormat(dayjs().subtract(3, 'month'))}
            maxDate={maxDate ?? dayFormat(dayjs().add(3, 'month'))}
            selectedDateMarkType={'circle'}
            cancel={() => setVisible(false)}
            confirm={(date) => {
              setText(`${dayFormat(date[0])}至${dayFormat(date[1])}`);
              onChange && onChange(date);
              setVisible(false);
            }}
            {...other}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    padding: 5,
    minHeight: 90,
  },
  borderBox: {
    borderWidth: 1,
    padding: 10,
  },
});

export default FormDateRange;
