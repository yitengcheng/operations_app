import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import apis from '../../apis';
import { CustomButton, NavBar, SwiperImage } from '../../common/Component';
import { get, post } from '../../HiNet';
import NavigationUtil from '../../navigator/NavigationUtil';
import ScanCode from '../../common/ScanCode';
export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const [cc, setCc] = useState(0);
  const [create, setCreate] = useState(0);
  const [handle, setHandle] = useState(0);
  const [assist, setAssist] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getMyCount();
  }, []);

  const getMyCount = () => {
    post(apis.getMyReportCount)()().then((res) => {
      setCc(res.cc);
      setCreate(res.create);
      setHandle(res.handle);
      setAssist(res.assist);
    });
  };
  const toListPage = (title: string, type: number) => {
    NavigationUtil.goPage({ title, type }, 'RepairList');
  };
  const onBarCodeRead = (e) => {
    setModalVisible(false);
    const strArray = e.data.split('/');
    const urlParams = strArray?.[strArray.length - 1]?.split('&');
    let params = {};
    urlParams.map((item) => {
      params[item.split('=')[0]] = item.split('=')[1];
    });
    if (e.data) {
      NavigationUtil.goPage({ title: '故障上报', assetsId: params.assetsId }, 'RepairDetail');
    } else {
      Alert.alert('提示', '识别失败，请重试');
    }
  };

  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar title="故障" />
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <SwiperImage
          images={[
            require('../../assets/image/banner_7.png'),
            require('../../assets/image/banner_8.png'),
            require('../../assets/image/banner_9.png'),
          ]}
        />
        <View style={{ height: 5, backgroundColor: theme.borderColor }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 }}>
          <TouchableOpacity style={styles.iconBox} onPress={() => toListPage('待我处理', 2)}>
            <Image source={require('../../assets/image/todo.png')} style={styles.imageIcon} />
            <Text style={styles.iconText}>待我处理</Text>
            <Text style={styles.iconCount}>{handle}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBox} onPress={() => toListPage('我创建的', 1)}>
            <Image source={require('../../assets/image/my_create.png')} style={styles.imageIcon} />
            <Text style={styles.iconText}>我创建的</Text>
            <Text style={styles.iconCount}>{create}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBox} onPress={() => toListPage('抄送我的', 3)}>
            <Image source={require('../../assets/image/cc.png')} style={styles.imageIcon} />
            <Text style={styles.iconText}>抄送我的</Text>
            <Text style={styles.iconCount}>{cc}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBox} onPress={() => toListPage('分享我的', 8)}>
            <Image source={require('../../assets/image/assist.png')} style={styles.imageIcon} />
            <Text style={styles.iconText}>分享我的</Text>
            <Text style={styles.iconCount}>{assist}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: theme.borderColor, flex: 1, padding: 10 }}>
          <Text style={{ fontSize: theme.fontSize, color: '#000000' }}>服务工单</Text>
          <TouchableOpacity
            style={styles.option_box}
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Text>创建工单</Text>
            <Image
              source={require('../../assets/image/repair_create.png')}
              style={styles.option_icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.option_box} onPress={() => toListPage('工单历史', 4)}>
            <Text>工单历史</Text>
            <Image
              source={require('../../assets/image/repair_history.png')}
              style={styles.option_icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
        transparent
      >
        <ScanCode onBarCodeRead={onBarCodeRead} onClose={() => setModalVisible(false)} />
        {/* <CustomButton
          title="测试"
          onClick={() => {
            NavigationUtil.goPage({ title: '故障上报', assetsId: '623c11c628726cf72be3153e' }, 'RepairDetail');
          }}
        /> */}
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  iconBox: {
    alignItems: 'center',
  },
  imageIcon: {
    width: 35,
    height: 35,
  },
  iconText: {
    fontSize: 18,
    padding: 5,
    color: '#000000',
  },
  iconCount: {
    fontSize: 16,
    color: '#000000',
  },
  option_box: {
    backgroundColor: '#FFFFFF',
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 5,
  },
  option_icon: {
    width: 25,
    height: 25,
  },
});
