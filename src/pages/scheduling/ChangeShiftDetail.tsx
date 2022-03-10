import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import apis from '../../apis';
import { CustomButton, NavBar, Popup } from '../../common/Component';
import FormInput from '../../common/form/FormInput';
import FormSelect from '../../common/form/FormSelect';
import { get, post } from '../../HiNet';
import { useValidation } from 'react-native-form-validator';
import { validOption } from '../../utils';
import NavigationUtil from '../../navigator/NavigationUtil';

export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const userInfo = useSelector((state) => {
    return state.userInfo.userInfo;
  });
  const [dutyTime, setDutyTime] = useState('');
  const [mixUser, setMixUser] = useState('');
  const [mixRemark, setMixRemark] = useState('');
  const [dutyDate, setDutyDate] = useState([]);
  const [dutyUser, setDutyUser] = useState([]);
  const [username, setUsername] = useState('');
  const [reason, setReason] = useState('');
  const [visible, setVisible] = useState(false);

  const { title, editable, type, data } = props.route.params; // type 1 新增 2 修改 3 领导 4 查看
  useEffect(() => {
    initDutyDate();
    initDutyUser();
    setMixUser(data.mixUser);
    setDutyTime(data.dutyTime);
    setMixRemark(data.mixRemark);
    setUsername(data.username);
  }, []);
  const { validate, ...other } = useValidation({
    state: { dutyTime, mixUser },
    labels: {
      dutyTime: '申请换班日期',
      mixUser: '调换值班人员',
    },
  });
  const initDutyDate = () => {
    let result = [];
    get(apis.dutyReport)().then((res) => {
      res.times.map((item) => {
        result.push({ label: item, value: item });
      });
    });
    console.log(result);

    setDutyDate(result);
  };
  const initDutyUser = async () => {
    let result = [];
    const res = await get(apis.getDutyUser)();
    res.map((item) => {
      result.push({ label: item.nick_name, value: item.user_id });
    });
    setDutyUser(result);
  };
  const applyChangeDuty = () => {
    const res = validate({
      dutyTime: { required: true },
      mixUser: { required: true },
    });
    if (!res) {
      Alert.alert('错误', '表单尚未填写完毕');
      return;
    }
    post(apis.applyChangeDuty)({ id: userInfo.userId, dutyTime, mixUser, mixRemark })().then((res) => {
      Alert.alert('提示', '申请成功，请等待上级审核', [
        {
          text: '确定',
          onPress: () => {
            NavigationUtil.goBack();
          },
        },
      ]);
    });
  };
  const toAudit = (mixStatus: number) => {
    post(apis.auditChangeDuty)({ mixStatus, id: data.id, reason })();
  };
  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar title={title} {...props} />
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <FormInput label="申请人" defaultValue={username ?? userInfo.nickName} editable={false} />
        <FormSelect
          label="申请调班日期"
          defaultValue={dutyTime}
          onChange={setDutyTime}
          options={dutyDate}
          editable={editable}
          {...validOption('dutyTime', other)}
        />
        <FormSelect
          label="调换值班人员"
          defaultValue={mixUser}
          onChange={setMixUser}
          options={dutyUser}
          editable={editable}
          {...validOption('mixUser', other)}
        />
        <FormInput
          label="备注"
          required={false}
          defaultValue={mixRemark}
          onChange={setMixRemark}
          multiline={true}
          editable={editable}
        />
        <View style={{ flexDirection: 'row' }}>
          {type == 1 && <CustomButton title="申请" onClick={applyChangeDuty} />}
          {/* {type == 2 && <CustomButton title="保存" onClick={applyChangeDuty} />} */}
          {type == 3 && <CustomButton title="同意" onClick={() => toAudit(1)} />}
          {type == 3 && (
            <CustomButton
              title="拒绝"
              type="warrning"
              onClick={() => {
                setVisible(true);
              }}
            />
          )}
        </View>
      </View>
      <Popup modalVisible={visible} onClose={() => setVisible(false)} type="center">
        <FormInput label="拒绝原因" onChange={setReason} multiline={true} />
        <View>
          <CustomButton title="确定" onClick={() => toAudit(2)} />
        </View>
      </Popup>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
