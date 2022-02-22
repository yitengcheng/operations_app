import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { DatePicker } from 'react-native-common-date-picker';
import ErrorMessage from './ErrorMessage';
import Label from './Label';

/**
 * 日期选择
 * @param props
 * @returns
 */
const FormDatePicker = (props: any) => {
  const { label, placeholder, onChange, defaultValue, editable = true, ...other } = props;
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const placeholderText = placeholder ?? `请选择${label}`;
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
          <DatePicker
            cancelText="取消"
            confirmText="确定"
            yearSuffix="年"
            monthSuffix="月"
            daySuffix="日"
            titleText={label}
            cancel={() => setVisible(false)}
            confirm={(date) => {
              setText(date);
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

export default FormDatePicker;
