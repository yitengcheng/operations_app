import React, { useState, useRef, useEffect } from 'react';
import { Alert, SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import apis from '../../apis';
import { CustomButton, ListData, NavBar, Popup } from '../../common/Component';
import FormInput from '../../common/form/FormInput';
import FormSelect from '../../common/form/FormSelect';
import { get, post } from '../../HiNet';
import { useValidation } from 'react-native-form-validator';
import { validOption } from '../../utils';

export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const userInfo = useSelector((state) => {
    return state.userInfo.userInfo;
  });
  const [options, setOptions] = useState([]);
  const [inspection, setInspection] = useState(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState('');
  const [office, setOffice] = useState('');
  const [id, setId] = useState(undefined);
  const [parentId, setParentId] = useState('');
  const listRef = useRef();
  const { validate, ...other } = useValidation({
    state: { office, parentId },
    labels: {
      office: '办公点',
      parentId: '巡检点',
    },
  });
  useEffect(() => {
    initOptions();
  }, []);
  useEffect(() => {
    !!inspection && listRef.current?.refresh();
  }, [inspection]);
  const initOptions = () => {
    get(`${apis.getInspectionAddress}/${userInfo.gsId}`)({ pageSize: 10000, pageNum: 1 }).then((res) => {
      const { rows } = res;
      let result = [];
      rows.map((item) => {
        result.push({ label: item.office, value: item.id });
      });
      setOptions(result);
    });
  };
  const saveInspection = () => {
    const res = validate({
      office: { required: true },
      parentId: { required: true },
    });
    if (!res) {
      Alert.alert('错误', '请仔细检查表单');
      return;
    }
    let url = type === 1 ? apis.addInspection : apis.updateInspection;
    post(url)({ gsId: userInfo.gsId, office, parentId, id })().then((res) => {
      Alert.alert('提示', '成功', [
        {
          text: '确定',
          onPress: () => {
            setInspection(parentId);
            setModalVisible(false);
            setId(undefined);
            setOffice('');
            setParentId('');
          },
        },
      ]);
    });
  };

  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar
        title="办公点"
        {...props}
        rightTitle="添加"
        onRightClick={() => {
          setModalVisible(true);
          setType(1);
          setOffice('');
          setId(undefined);
          setParentId('');
        }}
      />
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <View style={{ borderColor: theme.borderColor, borderBottomWidth: 1 }}>
          <FormSelect
            label="巡检点"
            options={options}
            required={false}
            onChange={setInspection}
            defaultValue={inspection}
          />
        </View>

        {inspection && (
          <ListData
            ref={listRef}
            url={`${apis.getInspectionPoint}/${inspection}`}
            renderItem={(data) => (
              <TouchableOpacity
                onLongPress={() => {
                  Alert.alert('', '请选择操作', [
                    {
                      text: '编辑',
                      onPress: () => {
                        setOffice(data.office);
                        setParentId(inspection);
                        setType(2);
                        setId(data.id);
                        setModalVisible(true);
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
                                setParentId('');
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
        )}
      </View>
      <Popup
        modalVisible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
        type="center"
      >
        <FormSelect
          label="巡检点"
          options={options}
          onChange={setParentId}
          defaultValue={parentId}
          {...validOption('parentId', other)}
        />
        <FormInput label="办公点" onChangeText={setOffice} defaultValue={office} {...validOption('office', other)} />
        <View>
          <CustomButton title="提交" onClick={saveInspection} />
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
