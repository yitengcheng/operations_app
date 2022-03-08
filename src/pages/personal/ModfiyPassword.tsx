import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { CustomButton, NavBar } from '../../common/Component';
import { validOption } from '../../utils';
import { useValidation } from 'react-native-form-validator';
import FormInput from '../../common/form/FormInput';
import { post } from '../../HiNet';
import apis from '../../apis';
import NavigationUtil from '../../navigator/NavigationUtil';

export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { validate, ...other } = useValidation({
    state: { oldPassword, newPassword },
    labels: {
      oldPassword: '旧密码',
      newPassword: '新密码',
    },
  });

  const savePassword = () => {
    const res = validate({
      oldPassword: { required: true },
      newPassword: { required: true },
    });
    if (!res) {
      Alert.alert('错误', '缺少账号或密码');
      return;
    }
    post(apis.modifyPassword)()({ oldPassword, newPassword }).then((res) => {
      Alert.alert('提示', '修改成功', [
        {
          text: '确定',
          onPress: () => {
            NavigationUtil.login();
          },
        },
      ]);
    });
  };

  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar title="修改密码" {...props} />
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <FormInput
          label="旧密码"
          required={false}
          placeholder="请输入旧密码"
          secureTextEntry={true}
          value={oldPassword}
          onChangeText={setOldPassword}
          {...validOption('oldPassword', other)}
        />
        <FormInput
          label="旧密码"
          required={false}
          placeholder="请输入新密码"
          secureTextEntry={true}
          value={newPassword}
          onChangeText={setNewPassword}
          {...validOption('newPassword', other)}
        />
        <View>
          <CustomButton title="保存" onClick={savePassword} />
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
