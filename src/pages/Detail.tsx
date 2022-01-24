import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Modal, Alert } from 'react-native';
import { ConfirmButton, NavBar } from '../common/Component';
import { useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { FormInput, FormSelect, FormInputField } from '../common/form/Index';
import { useValidation } from 'react-native-form-validator';
import { validOption } from '../utils';

export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const [compontents, setCompontents] = useState([]);
  const [compontentsOption, setCompontentsOption] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState('');
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [hasRequired, setHasRequired] = useState('');
  const [options, setOptions] = useState([{ label: '选项1', value: '' }]);
  const [maxLength, setMaxLength] = useState('');

  const { validate, ...other } = useValidation({
    state: { type, label, value, maxLength, hasRequired },
    labels: {
      type: '类型',
      label: '框名',
      value: '字段名',
      maxLength: '最大长度',
      hasRequired: '是否为必选项',
    },
  });

  const selectOptions = () => {
    return (
      <View>
        {Object.entries(options).map((item) => (
          <FormInput
            label={item[1].label}
            value={item[1].value}
            key={item[0]}
            onChangeText={(value) => {
              options[item[0]] = { label: item[1].label, value };
              setOptions([...options]);
            }}
          />
        ))}
        <AntDesign
          name="pluscircleo"
          style={{ color: theme.primary, alignSelf: 'center', margin: 5 }}
          size={40}
          onPress={() => setOptions(options.concat([{ label: `选项${options.length + 1}`, value: '' }]))}
        />
      </View>
    );
  };

  const confirmCompontent = () => {
    const res = validate({
      type: { required: true },
      label: { required: true },
      value: { required: true },
      maxLength: { numbers: true },
      hasRequired: { required: true },
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
          value,
          maxLength,
          rule: { required: hasRequired },
        });
        compontents.push(<FormInput label={label} key={value} maxLength={length * 1} required={hasRequired} />);
        break;
      case '数字输入框':
        compontentsOption.push({
          type,
          label,
          value,
          maxLength,
          rule: { required: hasRequired, numbers: true },
        });
        compontents.push(<FormInput label={label} key={value} maxLength={length * 1} required={hasRequired} />);
        break;
      case '多行文字输入框':
        compontentsOption.push({
          type,
          label,
          value,
          maxLength,
          rule: { required: hasRequired },
        });
        compontents.push(<FormInput multiline={true} label={label} key={value} maxLength={length * 1} required={hasRequired} />);
        break;
      case '选择器':
        const tmp = [];
        options.map((item) => item.value && tmp.push({ label: item.value, value: item.value }));
        compontentsOption.push({
          type,
          label,
          value,
          maxLength,
          rule: { required: hasRequired },
          options: tmp,
        });
        compontents.push(
          <FormSelect label={label} key={value} options={tmp} required={hasRequired} onChange={() => console.log()} />,
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
    setValue('');
    setMaxLength('');
    setOptions([{ label: '选项1', value: '' }]);
    setHasRequired('');
  };

  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar title="详情" {...props} />
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        {compontents}
        <AntDesign.Button
          name="pluscircleo"
          size={26}
          style={{ justifyContent: 'center' }}
          onPress={() => setModalVisible(true)}
        >
          添加
        </AntDesign.Button>
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
          <FormInput label="字段名" value={value} onChangeText={setValue} {...validOption('value', other)} />
          {type !== '选择器' && (
            <FormInput
              label="最大长度"
              value={maxLength}
              onChangeText={setMaxLength}
              {...validOption('maxLength', other)}
              required={false}
            />
          )}
          {type === '选择器' && selectOptions()}
          <View style={{ flexDirection: 'row' }}>
            <ConfirmButton title="保存" onClick={confirmCompontent} />
            <ConfirmButton title="取消" onClick={() => setModalVisible(false)} />
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
