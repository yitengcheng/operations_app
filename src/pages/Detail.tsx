import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Modal, Alert, Text } from 'react-native';
import { CustomButton, NavBar } from '../common/Component';
import { useSelector } from 'react-redux';
import FormDatePicker from '../common/form/FormDatePicker';
import FormUpload from '../common/form/FormUpload';
import FormSelect from '../common/form/FormSelect';
import FormDateRange from '../common/form/FormDateRange';
import FormInput from '../common/form/FormInput';
import { useValidation } from 'react-native-form-validator';
import { validOption, randomId } from '../utils';

export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const [compontents, setCompontents] = useState([]);
  const [compontentsOption, setCompontentsOption] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState('');
  const [label, setLabel] = useState('');
  const [hasRequired, setHasRequired] = useState('');
  const [options, setOptions] = useState([{ label: '选项1', value: '' }]);
  const [maxLength, setMaxLength] = useState('');
  const [count, setCount] = useState('');
  const [minDate, setMinDate] = useState(undefined);
  const [maxDate, setMaxDate] = useState(undefined);

  const { validate, ...other } = useValidation({
    state: { type, label, maxLength, hasRequired, count, minDate, maxDate },
    labels: {
      type: '类型',
      label: '框名',
      maxLength: '最大长度',
      hasRequired: '是否为必选项',
      count: '可上传图片数',
      minDate: '可选最小日期',
      maxDate: '可选最大日期',
    },
  });

  const selectOptions = () => {
    return (
      <View>
        {options.map((item, key) => (
          <FormInput
            label={item.label}
            value={item.value}
            key={item.value}
            onChangeText={(value) => {
              options[key] = { label: item.label, value };
              setOptions([...options]);
            }}
          />
        ))}
        <Text>加选项</Text>
      </View>
    );
  };

  const confirmCompontent = () => {
    const otherValidate = type === '图片选择' ? { count: { required: true, numbers: true } } : {};
    const res = validate({
      type: { required: true },
      label: { required: true },
      maxLength: { numbers: true },
      hasRequired: { required: true },
      maxDate: { date: 'YYYY-MM-DD' },
      minDate: { date: 'YYYY-MM-DD' },
      ...otherValidate,
    });
    if (!res) {
      Alert.alert('错误', '表单填写尚未完成，请核查');
      return;
    }
    setModalVisible(false);
    const length = maxLength ?? 255;
    switch (type) {
      case '文字输入框':
        compontentsOption.push({
          type,
          label,
          maxLength,
          rule: { required: hasRequired },
        });
        compontents.push(<FormInput label={label} key={randomId()} maxLength={length * 1} required={hasRequired} />);
        break;
      case '数字输入框':
        compontentsOption.push({
          type,
          label,
          maxLength,
          rule: { required: hasRequired, numbers: true },
        });
        compontents.push(<FormInput label={label} key={randomId()} maxLength={length * 1} required={hasRequired} />);
        break;
      case '多行文字输入框':
        compontentsOption.push({
          type,
          label,
          maxLength,
          rule: { required: hasRequired },
        });
        compontents.push(
          <FormInput multiline label={label} key={randomId()} maxLength={length * 1} required={hasRequired} />,
        );
        break;
      case '选择器': {
        const tmp = [];
        options.map((item) => item.value && tmp.push({ label: item.value, value: item.value }));
        compontentsOption.push({
          type,
          label,
          maxLength,
          rule: { required: hasRequired },
          options: tmp,
        });
        compontents.push(
          <FormSelect label={label} key={randomId()} options={tmp} required={hasRequired} onChange={() => {}} />,
        );
        break;
      }
      case '图片选择':
        compontentsOption.push({
          type,
          label,
          count,
          rule: { required: hasRequired },
        });
        compontents.push(<FormUpload label={label} count={count} key={randomId()} required={hasRequired} />);
        break;
      case '日期选择':
        compontentsOption.push({
          type,
          label,
          maxDate,
          minDate,
          rule: { required: hasRequired },
        });
        compontents.push(
          <FormDatePicker
            label={label}
            maxDate={maxDate}
            minDate={minDate ?? '2000-1-1'}
            key={randomId()}
            required={hasRequired}
          />,
        );
        break;
      case '日期范围选择':
        compontentsOption.push({
          type,
          label,
          maxDate,
          minDate,
          rule: { required: hasRequired },
        });
        compontents.push(
          <FormDateRange label={label} maxDate={maxDate} minDate={minDate} key={randomId()} required={hasRequired} />,
        );
        break;
      default:
        break;
    }
    setCompontents([...compontents]);
    setCompontentsOption([...compontentsOption]);
    reset();
  };

  const reset = () => {
    setLabel('');
    setType('');
    setCount('');
    setMaxLength('');
    setOptions([{ label: '选项1', value: '' }]);
    setHasRequired('');
    setMinDate('');
    setMaxDate('');
  };

  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar title="详情" {...props} />
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        {compontents}
        <Text>加</Text>
      </View>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <SafeAreaView style={[{ backgroundColor: theme.backgroundColor }, styles.root]}>
          <FormSelect
            label="类型"
            options={[
              { label: '文字输入框', value: '文字输入框' },
              { label: '数字输入框', value: '数字输入框' },
              { label: '选择器', value: '选择器' },
              { label: '多行文字输入框', value: '多行文字输入框' },
              { label: '图片选择', value: '图片选择' },
              { label: '日期选择', value: '日期选择' },
              { label: '日期范围选择', value: '日期范围选择' },
            ]}
            {...validOption('type', other)}
            onChange={(value) => setType(value)}
          />
          <FormSelect
            label="是否为必选"
            options={[
              { label: '是', value: true },
              { label: '否', value: false },
            ]}
            {...validOption('hasRequired', other)}
            onChange={(value) => setHasRequired(value)}
          />
          <FormInput label="框名" value={label} onChangeText={setLabel} {...validOption('label', other)} />
          {(type === '文字输入框' || type === '多行文字输入框') && (
            <FormInput
              label="最大长度"
              value={maxLength}
              onChangeText={setMaxLength}
              {...validOption('maxLength', other)}
              required={false}
            />
          )}
          {type === '图片选择' && (
            <FormInput
              label="可上传图片数"
              value={count}
              onChangeText={setCount}
              {...validOption('count', other)}
              required
            />
          )}
          {(type === '日期选择' || type === '日期范围选择') && (
            <FormInput
              label="可选最小日期"
              value={minDate}
              onChangeText={setMinDate}
              {...validOption('minDate', other)}
              required={false}
            />
          )}
          {(type === '日期选择' || type === '日期范围选择') && (
            <FormInput
              label="可选最大日期"
              value={maxDate}
              onChangeText={setMaxDate}
              {...validOption('maxDate', other)}
              required={false}
            />
          )}
          {type === '选择器' && selectOptions()}
          <View style={{ flexDirection: 'row' }}>
            <CustomButton title="保存" onClick={confirmCompontent} />
            <CustomButton title="取消" onClick={() => setModalVisible(false)} />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
