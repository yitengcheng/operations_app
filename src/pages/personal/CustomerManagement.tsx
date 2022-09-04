import React, { useRef, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import apis from '../../apis';
import { ListData, NavBar, Popup } from '../../common/Component';
import { post } from '../../HiNet';
import CustomerDetail from './CustomerDetail';
export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const listRef = useRef();
  const [modalVisible, setModalVisible] = useState(false);
  const [detail, setDetail] = useState({});

  const renderItem = (item) => {
    return (
      <TouchableOpacity
        style={styles.renderItemBox}
        onPress={() => {
          setModalVisible(true);
          setDetail(item);
        }}
        onLongPress={() => {
          deleteCustomer(item);
        }}
      >
        <View style={styles.renderItemRow}>
          <Text style={styles.renderItemText}>公司名：{item?.name ?? '暂无'}</Text>
          <Text style={styles.renderItemText}>负责人：{item?.headName ?? '暂无'}</Text>
        </View>
        <View style={styles.renderItemRow}>
          <Text style={styles.renderItemText}>联系方式：{item?.phone ?? '暂无'}</Text>
          <Text style={styles.renderItemText}>地址：{item?.address ?? '暂无'}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  const onClose = () => {
    listRef.current?.refresh();
    setModalVisible(false);
  };
  const deleteCustomer = (item) => {
    Alert.alert('提示', `是否删除${item?.name}`, [
      {
        text: '确认',
        onPress: () => {
          post(apis.deleteCustomer)({ id: item?._id })().then(() => {
            listRef?.current?.refresh();
          });
        },
      },
      { text: '取消' },
    ]);
  };

  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <NavBar title="客户管理" {...props} rightTitle="添加" onRightClick={() => setModalVisible(true)} />
        <ListData ref={listRef} url={apis.customerList} renderItem={renderItem} />
        <Popup
          title="客户信息"
          modalVisible={modalVisible}
          onClose={() => {
            setModalVisible(false);
          }}
          type="center"
        >
          <CustomerDetail
            detail={detail}
            onClose={() => {
              onClose();
            }}
          />
        </Popup>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  renderItemBox: {
    padding: 10,
    borderBottomColor: '#d9d9d9',
    borderBottomWidth: 1,
  },
  renderItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  renderItemText: {
    fontSize: 16,
    color: '#000',
  },
});
