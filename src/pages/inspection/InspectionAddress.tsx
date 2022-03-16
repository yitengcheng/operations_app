import React, { useState, forwardRef, useRef } from 'react';
import { Alert, SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { CustomButton, ListData, NavBar, Popup } from '../../common/Component';
import FormInput from '../../common/form/FormInput';
import { validOption } from '../../utils';
import { useValidation } from 'react-native-form-validator';
import { get, post } from '../../HiNet';
import apis from '../../apis';

export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const userInfo = useSelector((state) => {
    return state.userInfo.userInfo;
  });
  const listRef = useRef();
  const [modalVisible, setModalVisible] = useState(false);
  const [office, setOffice] = useState('');
  const [type, setType] = useState(''); // 1 添加 2修改
  const [id, setId] = useState(undefined);
  const { validate, ...other } = useValidation({
    state: { office },
    labels: {
      office: '巡检点',
    },
  });
  const addInspection = () => {
    const res = validate({
      office: { required: true },
    });
    if (!res) {
      Alert.alert('错误', '请仔细检查表单');
      return;
    }
    let url = type === 1 ? apis.addInspection : apis.updateInspection;
    post(url)({ gsId: userInfo.gsId, office, id })().then((res) => {
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
          url={`${apis.getInspectionAddress}/${userInfo.gsId}`}
          renderItem={(data) => (
            <TouchableOpacity
              onLongPress={() => {
                Alert.alert('', '请选择操作', [
                  {
                    text: '编辑',
                    onPress: () => {
                      setModalVisible(true);
                      setOffice(data.office);
                      setType(2);
                      setId(data.id);
                    },
                  },
                  {
                    text: '删除',
                    onPress: () => {
                      get(`${apis.delInspection}/${data.id}`)().then((res) => {
                        Alert.alert('提示', '删除成功', [
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
                    },
                  },
                ]);
              }}
            >
              <Text
                style={{
                  borderColor: theme.borderColor,
                  borderBottomWidth: 1,
                  textAlign: 'center',
                  padding: 10,
                  color: '#000000',
                  fontSize: theme.fontSize,
                }}
              >
                {data.office}
              </Text>
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