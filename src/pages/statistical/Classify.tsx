import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import apis from '../../apis';
import { CustomButton } from '../../common/Component';
import FormSelect from '../../common/form/FormSelect';
import { post } from '../../HiNet';
import { useValidation } from 'react-native-form-validator';
import { saveStorage } from '../../utils/localStorage';

export default (props: any) => {
  const { initAssetsClassify } = props;
  const theme = useSelector((state) => {
    return state.theme.theme;
  });

  const [classification, setClassification] = useState('');
  const [status, setStatus] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    initTemplateKeys();
  }, []);

  const { validate, ...other } = useValidation({
    state: { classification, status },
    labels: {
      classification: '用于分类的字段',
      status: '用于状态的字段',
    },
  });
  const initTemplateKeys = () => {
    post(apis.getTemplateKeys)({ type: '1' })().then((res) => {
      res.map((item) => {
        options.push({ label: item, value: item });
      });
      setOptions([...options]);
    });
  };
  const saveField = () => {
    const res = validate({
      classification: { required: true },
      status: { required: true },
    });
    if (!res) {
      Alert.alert('错误', '请注意检查必填项');
      return;
    }
    saveStorage('classification', { classification, status });
    initAssetsClassify && initAssetsClassify(classification, status);
  };
  return (
    <View style={{ backgroundColor: theme.backgroundColor }}>
      <FormSelect label="用于分类的字段" options={options} onChange={setClassification} defaultValue={classification} />
      <FormSelect label="用于状态的字段" options={options} onChange={setStatus} defaultValue={status} />
      <View>
        <CustomButton title="确定" onClick={saveField} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
