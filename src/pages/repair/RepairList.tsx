import React, { useEffect, useRef, useState } from 'react';
import { Alert, Linking, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import apis from '../../apis';
import { CustomButton, ListData, NavBar, Popup } from '../../common/Component';
import FormInput from '../../common/form/FormInput';
import FormSelect from '../../common/form/FormSelect';
import { get, post } from '../../HiNet';
import { dayFormat, phoneNumberEncryption, repairStatus, validOption } from '../../utils';
import { useValidation } from 'react-native-form-validator';
import FormUpload from '../../common/form/FormUpload';

export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const userInfo = useSelector((state) => {
    return state.userInfo.userInfo;
  });
  const { title, type } = props.route.params;
  const [dutyUser, setDutyUser] = useState([]);
  const [circulation, setCirculation] = useState(false);
  const [receiveUser, setReceiveUser] = useState('');
  const [remark, setRemark] = useState('');
  const [id, setId] = useState('');
  const [ccVisible, setCcVisible] = useState(false);
  const [completeVisible, setCompleteVisible] = useState(false);
  const [ccId, setCcId] = useState('');
  const [problem, setProblem] = useState('');
  const [problemUrl, setProblemUrl] = useState('');
  const [status, setStatus] = useState(1);
  const listRef = useRef();
  const { validate, ...other } = useValidation({
    state: { circulation, remark, ccId },
    labels: {
      receiveUser: '转单接收人',
      remark: '转单备注',
      ccId: '抄送接收人',
    },
  });
  useEffect(() => {
    initDutyUser();
  }, []);
  const initDutyUser = async () => {
    let result = [];
    const res = await get(apis.getDutyUser)();
    res.map((item) => {
      result.push({ label: item.nick_name, value: item.user_id });
    });
    setDutyUser(result);
  };
  const reset = () => {
    setReceiveUser('');
    setRemark('');
    setId('');
    setCcId('');
    setProblem('');
    setProblemUrl('');
  };
  const renderItem = (data) => {
    const { createTime, status, phoneNumber } = data;
    return (
      <View style={{ borderBottomWidth: 1, borderColor: theme.borderColor, padding: 10 }}>
        <View style={styles.itemBox}>
          <Text style={styles.itemText}>上报时间：{dayFormat(createTime)}</Text>
          <Text style={styles.itemText}>状态：{repairStatus(status)}</Text>
        </View>
        <View style={styles.itemBox}>
          <Text style={styles.itemText}>联系方式：{phoneNumberEncryption(phoneNumber) ?? '暂无'}</Text>
        </View>
        {type !== 3 && (
          <View style={styles.itemBox}>
            <CustomButton
              title="抄送"
              buttonStyle={styles.buttonStyle}
              fontStyle={{ color: theme.primary }}
              onClick={() => {
                setCcVisible(true);
                setId(data.id);
              }}
            />
            <CustomButton
              title="转单"
              buttonStyle={styles.buttonStyle}
              fontStyle={{ color: theme.warrning }}
              onClick={() => {
                setCirculation(true);
                setId(data.id);
              }}
            />
            <CustomButton
              title="完成"
              buttonStyle={styles.buttonStyle}
              fontStyle={{ color: theme.success }}
              onClick={() => {
                Alert.alert('提示', '请选择处理状态', [
                  {
                    text: '处理完成',
                    onPress: () => {
                      setCompleteVisible(true);
                      setId(data.id);
                      setStatus(1);
                    },
                  },
                  {
                    text: '拒绝处理',
                    onPress: () => {
                      setCompleteVisible(true);
                      setId(data.id);
                      setStatus(2);
                    },
                  },
                ]);
              }}
            />
            <CustomButton
              title="拨打电话"
              buttonStyle={styles.buttonStyle}
              fontStyle={{ color: theme.error }}
              onClick={() => {
                if (!phoneNumber) {
                  return Alert.alert('提示', `该工单的上报人并未留下电话`);
                }
                Linking.openURL(`tel:${phoneNumber}`).then((supported) => {
                  if (!supported) {
                    return Alert.alert('提示', `您的设备不支持该功能，请手动拨打 ${phoneNumber}`);
                  }
                  return Linking.openURL(`tel:${phoneNumber}`);
                });
              }}
            />
          </View>
        )}
      </View>
    );
  };
  const circulationRepair = () => {
    const res = validate({
      receiveUser: { required: true },
    });
    if (!res) {
      Alert.alert('错误', '表单尚未填写完毕');
      return;
    }
    post(apis.turnRepair)({ receiveUser, remark, id })().then((res) => {
      listRef.current?.refresh();
      setCirculation(false);
      reset();
      Alert.alert('提示', '转单成功');
    });
  };
  const ccRepair = () => {
    const res = validate({
      ccId: { required: true },
    });
    if (!res) {
      Alert.alert('错误', '表单尚未填写完毕');
      return;
    }
    post(apis.ccRepair)({ ccId, id })().then(() => {
      listRef.current?.refresh();
      setCcVisible(false);
      reset();
      Alert.alert('提示', '抄送成功');
    });
  };
  const toComplete = () => {
    post(apis.updateRepair)({ id, problem, problemUrl: problemUrl?.toString(','), status })().then((res) => {
      setCompleteVisible(false);
      reset();
      Alert.alert('提示', '操作成功');
    });
  };
  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar title={title} {...props} />
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <ListData ref={listRef} url={apis.getRepairs} renderItem={renderItem} params={{ type, gsId: userInfo.gsId }} />
      </View>
      <Popup modalVisible={circulation} onClose={() => setCirculation(false)} type="center">
        <FormSelect
          label="转单给"
          options={dutyUser}
          onChange={setReceiveUser}
          {...validOption('receiveUser', other)}
        />
        <FormInput
          required={false}
          multiline={true}
          label="备注"
          onChangeText={setRemark}
          {...validOption('remark', other)}
        />
        <View>
          <CustomButton
            title="确定"
            onClick={() => {
              circulationRepair();
            }}
          />
        </View>
      </Popup>
      <Popup modalVisible={ccVisible} onClose={() => setCcVisible(false)} type="center">
        <FormSelect label="抄送给" options={dutyUser} onChange={setCcId} {...validOption('ccId', other)} />
        <View>
          <CustomButton
            title="确定"
            onClick={() => {
              ccRepair();
            }}
          />
        </View>
      </Popup>
      <Popup modalVisible={completeVisible} onClose={() => setCcVisible(false)} type="center">
        <FormInput required={false} multiline={true} label="处理情况" onChangeText={setProblem} />
        <FormUpload required={false} label="现场图片" count={5} onChange={setProblemUrl} />
        <CustomButton title="确定" onClick={toComplete} />
      </Popup>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  itemBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  itemText: {
    fontSize: 16,
    color: '#000000',
  },
  buttonStyle: {
    backgroundColor: '#FFFFFF',
    padding: 0,
    minWidth: 0,
    minHeight: 0,
    flex: 1,
  },
  fontStyle: {},
});