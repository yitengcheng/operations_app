import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import apis from '../../apis';
import { ListData, NavBar, Popup } from '../../common/Component';
import FormDatePicker from '../../common/form/FormDatePicker';
import NavigationUtil from '../../navigator/NavigationUtil';
import { dayFormat, gender, hasStatus } from '../../utils';
export default (props: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const userInfo = useSelector((state) => {
    return state.userInfo.userInfo;
  });
  const renderItem = (item) => {
    const {
      userName = 'admin',
      sex = 0,
      nickName = '测试',
      status = 0,
      phonenumber = '13984387205',
      loginDate = '2022-03-03',
    } = item;
    return (
      <TouchableOpacity
        style={{ borderBottomWidth: 1, borderColor: theme.borderColor, padding: 10 }}
        onLongPress={() => setModalVisible(true)}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: theme.fontSize, color: theme.fontColor }}>姓名：{nickName}</Text>
          <Text style={{ fontSize: theme.fontSize, color: theme.fontColor }}>性别：{gender(sex)}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: theme.fontSize, color: theme.fontColor }}>状态：{hasStatus(status)}</Text>
          <Text style={{ fontSize: theme.fontSize, color: theme.fontColor }}>电话：{phonenumber}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: theme.fontSize, color: theme.fontColor }}>账号：{userName}</Text>
          <Text style={{ fontSize: theme.fontSize, color: theme.fontColor }}>上次登录时间：{dayFormat(loginDate)}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  const addStaff = () => {
    NavigationUtil.goPage({ title: '添加员工' }, 'AddStaff');
  };
  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar title="员工管理" rightTitle="添加员工" onRightClick={addStaff} {...props} />
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <ListData url={apis.staffList} params={{ gsId: userInfo.gsId }} keyId="userId" renderItem={renderItem} />
      </View>
      <Popup modalVisible={modalVisible} onClose={() => setModalVisible(false)}>
        <TouchableOpacity>
          <Text>123</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>123</Text>
        </TouchableOpacity>
      </Popup>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  itemBox: {},
});
