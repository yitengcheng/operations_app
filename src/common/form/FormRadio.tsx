import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import ErrorMessage from './ErrorMessage';
import Label from './Label';
import _ from 'lodash';

/**
 * 单选或多选框
 * @param props
 * @returns
 */
const FormRadio = (props: any) => {
  const {
    defaultValue,
    editable = true,
    onChange,
    multiple = false,
    options = [
      { label: '是', value: 1 },
      { label: '否', value: 0 },
    ],
  } = props;
  const onChoose = (item) => {
    if (!editable) {
      return;
    }
    if (multiple) {
      if (_.includes(onSelect, item.value)) {
        _.remove(onSelect, (n) => n === item.value);
        setOnSelect([...onSelect]);
        return;
      }
      setOnSelect([item.value, ...onSelect]);
    } else {
      setOnSelect([item.value]);
    }
  };
  const [onSelect, setOnSelect] = useState(defaultValue ?? []);
  useEffect(() => {
    onChange && onChange(multiple ? onSelect : onSelect?.[0]);
  }, [onSelect]);
  useEffect(() => {
    setOnSelect(defaultValue);
  }, [defaultValue]);
  return (
    <View style={[styles.column]}>
      <Label {...props} />
      <View style={styles.checkBox}>
        {options.map((item) => (
          <TouchableOpacity key={item.value} style={styles.optionItem} onPress={() => onChoose(item)}>
            {!_.includes(onSelect, item.value) && (
              <Image source={require('./image/radio_empty.png')} style={styles.img} />
            )}
            {_.includes(onSelect, item.value) && (
              <Image style={styles.img} source={require('./image/radio_choose.png')} />
            )}
            <Text style={{ fontSize: 16 }}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {props.isFieldInError && ErrorMessage(props.isFieldInError, props.getErrorsInField, props.name)}
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    padding: 5,
    minHeight: 90,
  },
  checkBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionItem: {
    flexDirection: 'row',
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  img: {
    width: 20,
    height: 20,
  },
});

export default FormRadio;
