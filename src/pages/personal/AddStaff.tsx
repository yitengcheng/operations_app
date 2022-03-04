import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { CustomButton, NavBar } from '../../common/Component';
import FormInput from '../../common/form/FormInput';
import FormSelect from '../../common/form/FormSelect';
import { useValidation } from 'react-native-form-validator';
import { post } from '../../HiNet';
import apis from '../../apis';
import { validOption } from '../../utils';
import NavigationUtil from '../../navigator/NavigationUtil';

export default (props: any) => {
  const { title, ...params } = props.route.params;
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const userInfo = useSelector((state) => {
    return state.userInfo.userInfo;
  });
  const [nickName, setNickName] = useState(params?.nickName ?? '');
  const [sex, setSex] = useState(params?.sex ?? '');
  const [userName, setUserName] = useState(params?.userName ?? '');
  const [phonenumber, setPhonenumber] = useState(params?.phonenumber ?? '');
  const [status, setStatus] = useState(params?.status ?? '');

  const { validate, ...other } = useValidation({
    state: { nickName, sex, userName, phonenumber, status },
    labels: {
      nickName: '姓名',
      sex: '性别',
      userName: '账号',
      phonenumber: '电话',
      status: '状态',
    },
  });

  const addSatff = () => {
    const res = validate({
      nickName: { required: true },
      sex: { required: true },
      userName: { required: true },
      phonenumber: { required: true, phone: true },
      status: { required: true },
    });
    if (!res) {
      Alert.alert('错误', '表单还未填写完毕');
      return;
    }
    post(apis.addStaff)({ nickName, sex, userName, phonenumber, status, gsId: userInfo.gsId })().then((res) => {
      Alert.alert('成功', '注册成功', [
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
      <NavBar title={title} {...props} />
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <FormInput label="姓名" value={nickName} onChangeText={setNickName} {...validOption('nickName', other)} />
        <FormSelect
          label="性别"
          options={[
            { label: '男', value: 0 },
            { label: '女', value: 1 },
          ]}
          defaultValue={sex}
          onChange={setSex}
          {...validOption('sex', other)}
        />
        <FormInput label="账号" value={userName} onChangeText={setUserName} {...validOption('userName', other)} />
        <FormInput
          label="电话"
          value={phonenumber}
          onChangeText={setPhonenumber}
          {...validOption('phonenumber', other)}
        />
        <FormSelect
          label="状态"
          options={[
            { label: '启用', value: 0 },
            { label: '未启用', value: 1 },
          ]}
          defaultValue={status}
          onChange={setStatus}
          {...validOption('status', other)}
        />
        <View style={{ marginHorizontal: 20 }}>
          <CustomButton title="保存" type="primary" onClick={addSatff} />
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
