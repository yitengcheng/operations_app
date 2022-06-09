import React, { useState, forwardRef, useRef, useEffect } from 'react';
import { Alert, SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { CustomButton, ListData, NavBar, Popup } from '../../common/Component';
import FormInput from '../../common/form/FormInput';
import { validOption } from '../../utils';
import { useValidation } from 'react-native-form-validator';
import { post } from '../../HiNet';
import apis from '../../apis';
import FormSelect from '../../common/form/FormSelect';

export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const listRef = useRef();
  const [modalVisible, setModalVisible] = useState(false);
  const [office, setOffice] = useState('');
  const [type, setType] = useState(''); // 1 添加 2修改
  const [id, setId] = useState(undefined);
  const [dutyUser, setDutyUser] = useState([]);
  const [headUser, setHeadUser] = useState('');

  useEffect(() => {
    initDutyUser();
  }, []);

  const { validate, ...other } = useValidation({
    state: { office, headUser },
    labels: {
      office: '巡检点',
      headUser: '负责人',
    },
  });
  const addInspection = () => {
    const res = validate({
      office: { required: true },
      headUser: { required: true },
    });
    if (!res) {
      Alert.alert('错误', '请仔细检查表单');
      return;
    }
    post(apis.addInspection)({ office, id, headUser })().then((res) => {
      Alert.alert('提示', '成功', [
        {
          text: '确定',
          onPress: () => {
            listRef.current?.refresh();
            setModalVisible(false);
            setId(undefined);
            setOffice('');
          },
        },
      ]);
    });
  };
  const initDutyUser = async () => {
    let result = [];
    const res = await post(apis.getDutyUser)()();
    res.map((item) => {
      result.push({ label: item.nickName, value: item._id });
    });
    setDutyUser(result);
  };
  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar
        title="巡检地点"
        rightTitle="添加"
        onRightClick={() => {
          setModalVisible(true);
          setType(1);
          setOffice('');
          setId(undefined);
        }}
        {...props}
      />
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <ListData
          ref={listRef}
          url={`${apis.getInspectionAddressList}`}
          renderItem={(data) => (
            <TouchableOpacity
              onPress={() => {
                Alert.alert('', '请选择操作', [
                  {
                    text: '编辑',
                    onPress: () => {
                      setModalVisible(true);
                      setOffice(data.office);
                      setHeadUser(data?.headUser ?? '');
                      setType(2);
                      setId(data._id);
                    },
                  },
                  {
                    text: '删除',
                    onPress: () => {
                      post(`${apis.delInspection}`)({ id: data._id })().then((res) => {
                        Alert.alert('提示', '删除成功', [
                          {
                            text: '确定',
                            onPress: () => {
                              listRef.current?.refresh();
                              setModalVisible(false);
                              setId(undefined);
                              setOffice('');
                              setHeadUser('');
                            },
                          },
                        ]);
                      });
                    },
                  },
                  {
                    text: '取消',
                    onPress: () => {},
                  },
                ]);
              }}
            >
              <View style={{ borderColor: theme.borderColor, borderBottomWidth: 1 }}>
                <Text
                  style={{
                    textAlign: 'center',
                    padding: 10,
                    color: '#000000',
                    fontSize: theme.fontSize,
                  }}
                >
                  {data.office}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <Popup
        modalVisible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
        type="center"
      >
        <FormInput label="巡检点" defaultValue={office} onChangeText={setOffice} {...validOption('office', other)} />
        <FormSelect
          label="负责人"
          options={dutyUser}
          defaultValue={headUser}
          onChange={setHeadUser}
          {...validOption('headUser', other)}
        />
        <View>
          <CustomButton
            title="提交"
            onClick={() => {
              addInspection();
            }}
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
});
