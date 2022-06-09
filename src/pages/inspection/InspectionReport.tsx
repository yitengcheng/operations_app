import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, View, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { CustomButton, NavBar } from '../../common/Component';
import FormInput from '../../common/form/FormInput';
import FormSelect from '../../common/form/FormSelect';
import { useValidation } from 'react-native-form-validator';
import { get, post } from '../../HiNet';
import apis from '../../apis';
import { validOption } from '../../utils';
import NavigationUtil from '../../navigator/NavigationUtil';
import FormUpload from '../../common/form/FormUpload';

export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const userInfo = useSelector((state) => {
    return state.userInfo.userInfo;
  });
  const [parentId, setParentId] = useState('');
  const [childrenId, setChildrenId] = useState('');
  const [remark, setRemark] = useState('');
  const [parentOptions, setParentOptions] = useState([]);
  const [childrenOptions, setChildrenOptions] = useState([]);
  const [remarkPhoto, setRemarkPhoto] = useState([]);
  const [status, setStatus] = useState('');

  const { validate, ...other } = useValidation({
    state: { parentId, childrenId, remark },
    labels: {
      parentId: '巡检点',
      childrenId: '办公点',
      remark: '巡检情况',
      status: '状态',
    },
  });
  useEffect(() => {
    initParentOptions();
  }, []);
  useEffect(() => {
    setChildrenId('');
    !!parentId && initChildrenOptions();
  }, [parentId]);
  const initParentOptions = () => {
    post(`${apis.getInspectionAddressPage}`)()().then((res) => {
      let result = [];
      res.map((item) => {
        result.push({ label: item.office, value: item._id });
      });
      setParentOptions(result);
    });
  };
  const initChildrenOptions = () => {
    post(`${apis.getInspectionAddressPage}`)({ parentId })().then((res) => {
      let result = [];
      res.map((item) => {
        result.push({ label: item.office, value: item._id });
      });
      setChildrenOptions(result);
    });
  };
  const report = () => {
    const res = validate({
      childrenId: { required: true },
      parentId: { required: true },
      remark: { required: true },
      status: { required: true },
    });
    if (!res) {
      Alert.alert('错误', '请仔细检查表单');
      return;
    }
    if (remarkPhoto.length < 1) {
      Alert.alert('错误', '请最少上传一张现场照片');
      return;
    }
    post(apis.reportInspection)({ childrenId, parentId, remark, status, remarkPhoto })().then((res) => {
      Alert.alert('提示', '提交成功', [
        {
          text: '确定',
          onPress: () => {
            NavigationUtil.goBack();
          },
        },
      ]);
    });
  };

  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar title="巡检上报" {...props} />
      <ScrollView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <FormSelect label="巡检点" options={parentOptions} onChange={setParentId} {...validOption('parentId', other)} />
        <FormSelect
          label="办公点"
          options={childrenOptions}
          onChange={setChildrenId}
          {...validOption('childrenId', other)}
        />
        <FormSelect
          label="巡检状态"
          options={[
            { label: '正常', value: 1 },
            { label: '故障', value: 2 },
          ]}
          onChange={setStatus}
          {...validOption('status', other)}
        />
        <FormUpload label="现场图片" count={5} onChange={setRemarkPhoto} />
        <FormInput label="巡检情况" onChangeText={setRemark} multiline={true} {...validOption('remark', other)} />
        <View>
          <CustomButton title="提交" onClick={report} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
