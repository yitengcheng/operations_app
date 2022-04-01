import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Image, Linking, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import apis from '../../apis';
import { CustomButton, NavBar, Popup } from '../../common/Component';
import { post } from '../../HiNet';
import _ from 'lodash';
import {
  checkFileExt,
  dayFormat,
  phoneNumberEncryption,
  randomId,
  repairStatus,
  togetherUrl,
  validOption,
} from '../../utils';
import FormInput from '../../common/form/FormInput';
import FormUpload from '../../common/form/FormUpload';
import FormSelect from '../../common/form/FormSelect';
import { useValidation } from 'react-native-form-validator';
export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const [asset, setAsset] = useState('');
  const [fault, setFault] = useState('');
  const [faultOther, setFaultOther] = useState('');
  const [ccVisible, setCcVisible] = useState(false);
  const [completeVisible, setCompleteVisible] = useState(false);
  const [circulation, setCirculation] = useState(false);
  const [status, setStatus] = useState(1);
  const [dutyUser, setDutyUser] = useState([]);
  const [receiveUser, setReceiveUser] = useState('');
  const [remark, setRemark] = useState('');
  const [ccId, setCcId] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [conclusionPhoto, setConclusionPhoto] = useState('');
  const { validate, ...other } = useValidation({
    state: { circulation, remark, ccId },
    labels: {
      receiveUser: '转单接收人',
      remark: '转单备注',
      ccId: '抄送接收人',
    },
  });
  useEffect(() => {
    getRepair();
    initDutyUser();
  }, []);
  const initDutyUser = async () => {
    let result = [];
    const res = await post(apis.getDutyUser)()();
    res.map((item) => {
      result.push({ label: item.nickName, value: item._id });
    });
    setDutyUser(result);
  };
  const getRepair = () => {
    post(apis.repairDetail)({ faultId: props.route.params.faultId })().then((res) => {
      const { asset, fault } = res;
      delete asset._id;
      delete asset.__v;
      const {
        createTime,
        status,
        phoneNumber,
        assetsId,
        cc,
        oldDispose,
        dispose,
        designateTime,
        _id,
        __v,
        reportUser,
        remark,
        conclusion,
        conclusionPhoto,
        ...faultObj
      } = fault;
      setAsset(asset);
      setFault(faultObj);
      setFaultOther({ _id, createTime, status, phoneNumber, remark, conclusion, conclusionPhoto });
    });
  };
  const circulationRepair = () => {
    const res = validate({
      receiveUser: { required: true },
    });
    if (!res) {
      Alert.alert('错误', '表单尚未填写完毕');
      return;
    }
    post(apis.turnRepair)({ receiveUser, remark, id: faultOther._id })().then((res) => {
      setCirculation(false);
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
    post(apis.ccRepair)({ ccId, id: faultOther._id })().then(() => {
      setCcVisible(false);
      Alert.alert('提示', '抄送成功');
    });
  };
  const toComplete = () => {
    let url = status === 1 ? apis.conclusionRepair : apis.refuseRepair;
    post(url)({ id: faultOther._id, conclusion, conclusionPhoto })().then((res) => {
      setCompleteVisible(false);
      Alert.alert('提示', '操作成功');
    });
  };
  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar title="故障详情" {...props} />
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <View style={{ padding: 10, borderBottomColor: theme.borderColor, borderBottomWidth: 5 }}>
          <View
            style={{
              borderBottomColor: theme.borderColor,
              borderBottomWidth: 1,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 5,
            }}
          >
            <Image source={require('../../assets/image/asset.png')} style={{ width: 20, height: 20, marginRight: 5 }} />
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#000000' }}>资产详情</Text>
          </View>
          {_.toPairs(asset).map((item, index) => (
            <View style={{ flexDirection: 'row' }} key={randomId()}>
              <Text style={{ color: '#000000' }}>{item?.[0]}：</Text>
              {_.isArray(item?.[1]) && checkFileExt(item?.[1]?.[0]) ? (
                <View
                  style={{ flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap', paddingVertical: 5 }}
                >
                  {item?.[1]?.map((imgUrl) => (
                    <Image
                      source={{
                        uri: togetherUrl(imgUrl),
                      }}
                      key={randomId()}
                      style={{ width: 80, height: 80, margin: 5 }}
                      resizeMode="contain"
                    />
                  ))}
                </View>
              ) : (
                <Text style={{ color: '#000000' }}>{item?.[1]}</Text>
              )}
            </View>
          ))}
        </View>
        <View style={{ padding: 10, borderBottomColor: theme.borderColor, borderBottomWidth: 5 }}>
          <View
            style={{
              borderBottomColor: theme.borderColor,
              borderBottomWidth: 1,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 5,
            }}
          >
            <Image
              source={require('../../assets/image/fault_icon.png')}
              style={{ width: 20, height: 20, marginRight: 5 }}
            />
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#000000' }}>故障详情</Text>
          </View>
          <View style={styles.itemBox}>
            <Text style={styles.itemText}>上报时间：{dayFormat(faultOther?.createTime)}</Text>
            <Text style={styles.itemText}>状态：{repairStatus(faultOther?.status)}</Text>
          </View>
          <View style={styles.itemBox}>
            <Text style={styles.itemText}>联系方式：{phoneNumberEncryption(faultOther?.phoneNumber) ?? '暂无'}</Text>
          </View>
          {faultOther?.remark && (
            <View style={styles.itemBox}>
              <Text style={styles.itemText}>转单备注：{faultOther?.remark}</Text>
            </View>
          )}
          <View style={styles.itemBox}>
            <Text style={styles.itemText}>故障详情：</Text>
          </View>
          {_.toPairs(fault).map((item, index) => (
            <View style={{ flexDirection: 'row' }} key={index}>
              <Text style={{ color: '#000000' }}>{item?.[0]}：</Text>
              {_.isArray(item?.[1]) && checkFileExt(item?.[1]?.[0]) ? (
                <View
                  style={{ flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap', paddingVertical: 5 }}
                >
                  {item?.[1]?.map((imgUrl) => (
                    <Image
                      source={{
                        uri: togetherUrl(imgUrl),
                      }}
                      key={randomId()}
                      style={{ width: 80, height: 80, margin: 5 }}
                      resizeMode="contain"
                    />
                  ))}
                </View>
              ) : (
                <Text style={{ color: '#000000' }}>{item?.[1]}</Text>
              )}
            </View>
          ))}
          {faultOther?.conclusion && (
            <View style={styles.itemBox}>
              <Text style={styles.itemText}>处理情况：{faultOther?.conclusion}</Text>
            </View>
          )}
          {faultOther?.conclusionPhoto?.length > 0 && (
            <View style={[styles.itemBox, { flexWrap: 'wrap', justifyContent: 'flex-start' }]}>
              <Text style={styles.itemText}>现场处理图：</Text>
              {faultOther?.conclusionPhoto?.map((imgUrl) => (
                <Image
                  source={{
                    uri: togetherUrl(imgUrl),
                  }}
                  key={randomId()}
                  style={{ width: 80, height: 80, margin: 5 }}
                  resizeMode="contain"
                />
              ))}
            </View>
          )}
        </View>
        {props.route.params?.flag && (
          <View style={styles.itemBox}>
            <CustomButton
              title="抄送"
              buttonStyle={styles.buttonStyle}
              fontStyle={{ color: theme.primary }}
              onClick={() => {
                setCcVisible(true);
              }}
            />
            <CustomButton
              title="转单"
              buttonStyle={styles.buttonStyle}
              fontStyle={{ color: theme.warrning }}
              onClick={() => {
                setCirculation(true);
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
                      setStatus(1);
                    },
                  },
                  {
                    text: '拒绝处理',
                    onPress: () => {
                      setCompleteVisible(true);
                      setStatus(2);
                    },
                  },
                  {
                    text: '取消',
                  },
                ]);
              }}
            />
            <CustomButton
              title="拨打电话"
              buttonStyle={styles.buttonStyle}
              fontStyle={{ color: theme.error }}
              onClick={() => {
                if (!faultOther?.phoneNumber) {
                  return Alert.alert('提示', `该工单的上报人并未留下电话`);
                }
                Linking.openURL(`tel:${faultOther?.phoneNumber}`).then((supported) => {
                  if (!supported) {
                    return Alert.alert('提示', `您的设备不支持该功能，请手动拨打 ${faultOther?.phoneNumber}`);
                  }
                  return Linking.openURL(`tel:${faultOther?.phoneNumber}`);
                });
              }}
            />
          </View>
        )}
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
      <Popup modalVisible={completeVisible} onClose={() => setCompleteVisible(false)} type="center">
        <FormInput required={false} multiline={true} label="处理情况" onChangeText={setConclusion} />
        <FormUpload required={false} label="现场图片" count={5} onChange={setConclusionPhoto} />
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
});
