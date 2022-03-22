import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { CustomButton, NavBar } from '../../common/Component';
import { useValidation } from 'react-native-form-validator';
import FormInput from '../../common/form/FormInput';
import { validOption } from '../../utils';
import FormSelect from '../../common/form/FormSelect';
import FormUpload from '../../common/form/FormUpload';
import { post } from '../../HiNet';
import apis from '../../apis';
import NavigationUtil from '../../navigator/NavigationUtil';
import { saveUserInfo } from '../../action/userInfo';

export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const userInfo = useSelector((state) => {
    return state.userInfo.userInfo;
  });
  const dispatch = useDispatch();
  const [nickName, setNickName] = useState(userInfo.nickName);
  const [phonenumber, setPhonenumber] = useState(userInfo.phonenumber);
  const [sex, setSex] = useState(userInfo.sex);
  const [username, setUsername] = useState(userInfo.username);
  const [avatar, setAvatar] = useState(userInfo.avatar);

  const { validate, ...other } = useValidation({
    state: { nickName, phonenumber, sex, username, avatar },
    labels: {
      nickName: '姓名',
      phonenumber: '电话',
      sex: '性别',
      username: '登录账号',
      avatar: '头像',
    },
  });
  const tosave = () => {
    const res = validate({
      nickName: { required: true },
      sex: { required: true },
      username: { required: true },
      phonenumber: { required: true, phone: true },
      avatar: { required: true },
    });
    if (!res) {
      Alert.alert('错误', '表单还未填写完毕');
      return;
    }
    post(apis.modifyUserInfo)({ nickName, sex, username, phonenumber, avatar })().then(() => {
      Alert.alert('提示', '修改成功', [
        {
          text: '确定',
          onPress: () => {
            dispatch(saveUserInfo({ ...userInfo, nickName, sex, username, phonenumber, avatar }));
            NavigationUtil.goBack();
          },
        },
      ]);
    });
  };
  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar title="用户信息" {...props} />
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <FormUpload
          label="头像"
          onChange={(fileList) => {
            setAvatar(fileList[0]);
          }}
          defaultValue={avatar ? [avatar] : undefined}
          {...validOption('avatar', other)}
        />
        <FormInput
          label="姓名"
          placeholder="请输入姓名"
          value={nickName}
          onChangeText={setNickName}
          {...validOption('nickName', other)}
        />
        <FormSelect
          label="性别"
          options={[
            { label: '男', value: 0 },
            { label: '女', value: 1 },
          ]}
          defaultValue={sex * 1}
          onChange={setSex}
          {...validOption('sex', other)}
        />
        <FormInput
          label="电话"
          placeholder="请输入电话"
          value={phonenumber}
          onChangeText={setPhonenumber}
          {...validOption('phonenumber', other)}
        />
        <FormInput
          label="登录账号"
          placeholder="请输入登录账号"
          value={username}
          onChangeText={setUsername}
          {...validOption('username', other)}
        />
        <View>
          <CustomButton title="保存" onClick={tosave} />
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
