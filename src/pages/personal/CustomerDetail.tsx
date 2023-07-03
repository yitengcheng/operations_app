import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import FormInput from '../../common/form/FormInput';
import FormSelect from '../../common/form/FormSelect';
import { validOption } from '../../utils';
import { useValidation } from 'react-native-form-validator';
import { CustomButton } from '../../common/Component';
import { post } from '../../HiNet';
import apis from '../../apis';

export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('123456');
  const [address, setAddress] = useState('');
  const [headName, setHeadName] = useState('');
  const [phone, setPhone] = useState('');
  const [repairMan, setRepairMan] = useState('');
  const [dutyUser, setDutyUser] = useState([]);
  const { validate, ...other } = useValidation({
    state: { name, username, password, address, headName, phone, repairMan },
    labels: {
      name: '公司名称',
      username: '登录账号',
      password: '登录密码',
      address: '公司地址',
      headName: '负责人',
      phone: '联系方式',
      repairMan: '运维人员',
    },
  });
  const { detail } = props;

  useEffect(() => {
    setName(detail?.name);
    setUsername(detail?.username);
    setAddress(detail?.address);
    setHeadName(detail?.headName);
    setPhone(detail?.phone);
    setRepairMan(detail?.repairMan);
  }, [detail]);
  useEffect(() => {
    initDutyUser();
  }, []);

  const submitCustomerInfo = () => {
    const res = validate({
      name: { required: true },
      username: { required: true },
    });
    if (!res) {
      Alert.alert('错误', '请仔细检查表单');
      return;
    }
    post(apis.addCustomer)({ id: detail?._id, name, username, password, address, headName, phone, repairMan })().then(
      () => {
        props?.onClose && props?.onClose();
      },
    );
  };
  const initDutyUser = async () => {
    let result = [];
    const res = await post(apis.getDutyUser)()();
    res.map((item) => {
      result.push({ label: item.nickName, value: item._id });
    });
    setDutyUser(result);
  };

  return (
    <View>
      <FormInput label="公司名称" onChangeText={setName} defaultValue={name} {...validOption('name', other)} />
      <FormInput
        label="登录账号"
        onChangeText={setUsername}
        defaultValue={username}
        {...validOption('username', other)}
      />
      {!detail?._id && (
        <FormInput
          label="登录密码（默认为123456）"
          onChangeText={setPassword}
          defaultValue={password}
          required={false}
          secureTextEntry={true}
          {...validOption('password', other)}
        />
      )}
      <FormInput
        label="公司地址"
        onChangeText={setAddress}
        defaultValue={address}
        required={false}
        {...validOption('address', other)}
      />
      <FormInput
        label="负责人姓名"
        onChangeText={setHeadName}
        defaultValue={headName}
        required={false}
        {...validOption('headName', other)}
      />
      <FormInput
        label="联系方式"
        onChangeText={setPhone}
        defaultValue={phone}
        required={false}
        {...validOption('phone', other)}
      />
      <FormSelect
        label="运维人员"
        options={dutyUser}
        defaultValue={repairMan}
        onChange={setRepairMan}
        {...validOption('repairMan', other)}
      />
      <View>
        <CustomButton title="保存" onClick={() => submitCustomerInfo()} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
