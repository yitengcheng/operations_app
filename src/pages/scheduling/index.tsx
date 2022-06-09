import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import apis from '../../apis';
import Agenda from '../../common/Agenda';
import { CustomButton, NavBar, Popup } from '../../common/Component';
import { get, post } from '../../HiNet';
import NavigationUtil from '../../navigator/NavigationUtil';

export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const userInfo = useSelector((state) => {
    return state.userInfo.userInfo;
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingCount, setPendingCount] = useState('');
  const width = useWindowDimensions().width;

  useEffect(() => {
    _getReportCount();
  }, []);

  const _getReportCount = () => {
    post(apis.dutyReport)()().then((res) => {
      setPendingCount(res ?? 0);
    });
  };

  const saveDuty = (userIds: [], day: string) => {
    post(apis.saveDuty)({ userIds, dutyTime: day })().then((res) => {
      Alert.alert('提示', '排班成功');
    });
  };

  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar
        title="排班"
        rightTitle="三"
        onRightClick={() => {
          setModalVisible(true);
        }}
      />
      <Agenda saveDuty={saveDuty} />
      <Modal
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
        transparent
      >
        <SafeAreaView style={{ flex: 1, alignItems: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.65)' }}>
          <View style={{ width: width / 1.5, flex: 1, backgroundColor: theme.backgroundColor }}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ borderColor: theme.borderColor, ...styles.pendingBox }}
              onPress={() => {
                setModalVisible(false);
                NavigationUtil.goPage({}, 'ChangeShiftList');
              }}
            >
              <Image source={require('../../assets/image/pending.png')} style={{ width: 45, height: 45 }} />
              <Text style={{ fontSize: 18, color: '#000000' }}>待处理 {pendingCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ padding: 10, width: 65, alignItems: 'center' }}
              onPress={() => {
                setModalVisible(false);
                NavigationUtil.goPage({ title: '调班申请', type: 1, editable: true }, 'ChangeShiftDetail');
              }}
            >
              <Image source={require('../../assets/image/changeShift.png')} style={{ width: 45, height: 45 }} />
              <Text style={{ color: '#000000' }}>调班</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  closeText: {
    fontSize: 18,
    fontWeight: '700',
    padding: 5,
    textAlign: 'right',
  },
  pendingBox: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
});
