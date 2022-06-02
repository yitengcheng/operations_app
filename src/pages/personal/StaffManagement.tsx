import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Modal, Alert, Image } from 'react-native';
import { useSelector } from 'react-redux';
import apis from '../../apis';
import { CustomButton, ListData, NavBar, Popup } from '../../common/Component';
import FormDatePicker from '../../common/form/FormDatePicker';
import { get, post } from '../../HiNet';
import NavigationUtil from '../../navigator/NavigationUtil';
import { dayFormat, gender, hasStatus, togetherUrl } from '../../utils';
export default (props: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectItem, setSelectItem] = useState({});
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const userInfo = useSelector((state) => {
    return state.userInfo.userInfo;
  });
  const renderItem = (item) => {
    const { username, sex, nickName, status, phonenumber, loginDate } = item;
    return (
      <TouchableOpacity
        style={{ borderBottomWidth: 1, borderColor: theme.borderColor, padding: 10, flexDirection: 'row' }}
        onPress={() => {
          setModalVisible(true);
          setSelectItem(item);
        }}
      >
        <Image
          source={
            userInfo?.avatar ? { uri: togetherUrl(userInfo.avatar) } : require('../../assets/image/default_head.png')
          }
          style={{ width: 65, height: 65 }}
          resizeMode="contain"
        />
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: theme.fontSize, color: theme.fontColor }}>姓名：{nickName ?? '暂无'}</Text>
            <Text style={{ fontSize: theme.fontSize, color: theme.fontColor }}>性别：{gender(sex)}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: theme.fontSize, color: theme.fontColor }}>状态：{hasStatus(status)}</Text>
            <Text style={{ fontSize: theme.fontSize, color: theme.fontColor }}>电话：{phonenumber ?? '暂无'}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: theme.fontSize, color: theme.fontColor }}>账号：{username ?? '暂无'}</Text>
            <Text style={{ fontSize: theme.fontSize, color: theme.fontColor }}>
              上次登录：{loginDate ? dayFormat(loginDate) : '暂无'}
            </Text>
          </View>
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
        <ListData url={apis.staffList} renderItem={renderItem} />
      </View>
      <Popup modalVisible={modalVisible} onClose={() => setModalVisible(false)}>
        <View style={{ height: 45 }}>
          <CustomButton
            title="编辑"
            onClick={() => {
              setModalVisible(false);
              NavigationUtil.goPage({ title: '编辑员工', ...selectItem }, 'AddStaff');
            }}
            buttonStyle={{ backgroundColor: theme.backgroundColor }}
            fontStyle={{ color: theme.primary }}
          />
        </View>
        <View style={{ height: 45 }}>
          <CustomButton
            title="删除"
            onClick={() => {
              post(apis.deleteStaff)({ id: selectItem?._id })().then(() => {
                Alert.alert('提示', '删除成功', [
                  {
                    text: '确定',
                    onPress: () => {
                      listRef.current?.refresh();
                    },
                  },
                ]);
              });
            }}
            buttonStyle={{ backgroundColor: theme.backgroundColor }}
            fontStyle={{ color: theme.error }}
          />
        </View>
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
