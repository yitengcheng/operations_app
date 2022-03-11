import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, ScrollView, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import apis from '../../apis';
import FormDatePicker from '../../common/form/FormDatePicker';
import FormDateRange from '../../common/form/FormDateRange';
import FormInput from '../../common/form/FormInput';
import FormRadio from '../../common/form/FormRadio';
import FormSelect from '../../common/form/FormSelect';
import FormUpload from '../../common/form/FormUpload';
import { get, post } from '../../HiNet';
import { isJsonString, randomId } from '../../utils';
import _ from 'lodash';
import { CustomButton } from '../../common/Component';

export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const userInfo = useSelector((state) => {
    return state.userInfo.userInfo;
  });
  const [data, setData] = useState({});
  const [components, setComponents] = useState([]);
  const [componentsOption, setComponentsOption] = useState({});
  const [name, setName] = useState('');
  const [refresh, setRefresh] = useState(true);
  useEffect(() => {
    initTemplate();
  }, []);

  const initTemplate = () => {
    get(`${apis.templateInfo}/${userInfo.gsId}/1`)().then((res) => {
      let content = isJsonString(res.content) ? JSON.parse(res.content) : undefined;
      if (content) {
        setComponentsOption(content);
        _.toPairs(content).map((item) => {
          item?.[1] && pushComponent(item?.[1]);
        });
        setComponents([...components]);
      }
    });
  };

  const pushComponent = (component: any, index?: number) => {
    const { type, label, count, maxLength, hasRequired, options, maxDate, minDate } = component;
    let com;
    switch (type) {
      case '文字输入框':
        com = (
          <FormInput
            label={label}
            key={randomId()}
            maxLength={maxLength * 1}
            required={hasRequired}
            defaultValue={data[label]}
            onChangeText={(value) => {
              saveData(label, value);
            }}
          />
        );
        break;
      case '数字输入框':
        com = (
          <FormInput
            label={label}
            key={randomId()}
            maxLength={maxLength * 1}
            required={hasRequired}
            defaultValue={data[label]}
            onChangeText={(value) => {
              saveData(label, value);
            }}
          />
        );
        break;
      case '多行文字输入框':
        com = (
          <FormInput
            multiline
            label={label}
            key={randomId()}
            maxLength={maxLength * 1}
            required={hasRequired}
            defaultValue={data[label]}
            onChangeText={(value) => {
              saveData(label, value);
            }}
          />
        );
        break;
      case '选择器':
        com = (
          <FormSelect
            label={label}
            key={randomId()}
            options={options}
            required={hasRequired}
            defaultValue={data[label]}
            onChange={(value) => {
              saveData(label, value);
            }}
          />
        );
        break;
      case '单选框':
        com = (
          <FormRadio
            label={label}
            key={randomId()}
            options={options}
            required={hasRequired}
            defaultValue={data[label]}
            onChange={(value) => {
              saveData(label, value);
            }}
          />
        );
        break;
      case '多选框':
        com = (
          <FormRadio
            multiple
            label={label}
            key={randomId()}
            options={options}
            required={hasRequired}
            defaultValue={data[label]}
            onChange={(value) => {
              saveData(label, value);
            }}
          />
        );
        break;

      case '图片选择':
        com = (
          <FormUpload
            label={label}
            count={count}
            key={randomId()}
            required={hasRequired}
            defaultValue={data[label]}
            onChange={(value) => {
              saveData(label, value);
            }}
          />
        );
        break;
      case '日期选择':
        com = (
          <FormDatePicker
            label={label}
            maxDate={maxDate}
            minDate={minDate ?? '2000-1-1'}
            key={randomId()}
            required={hasRequired}
            defaultValue={data[label]}
            onChange={(value) => {
              saveData(label, value);
            }}
          />
        );
        break;
      case '日期范围选择':
        com = (
          <FormDateRange
            label={label}
            maxDate={maxDate}
            minDate={minDate}
            key={randomId()}
            required={hasRequired}
            defaultValue={data[label]}
            onChange={(value) => {
              saveData(label, value);
            }}
          />
        );
        break;
      default:
        break;
    }
    typeof index === 'number'
      ? (components[index] = { label, com })
      : components.push({
          label,
          com,
        });
  };
  const saveData = (label: string, value: any) => {
    setData(Object.assign(data, { [label]: value }));
  };
  const putInStorage = () => {
    if (!name) {
      Alert.alert('提示', '资产名称不能为空');
      return;
    }
    let flag = false;
    _.toPairs(componentsOption).map((item) => {
      if (item[1].hasRequired && !data[item[0]]) {
        Alert.alert('提示', `${item[0]}不能为空`);
        flag = true;
      }
      if (item[1].maxLength && data[item[0]]?.length > item[1].maxLength) {
        Alert.alert('提示', `${item[0]}已超过最大长度${item[1].maxLength}`);
        flag = true;
      }
    });
    if (flag) {
      return;
    }
    setRefresh(false);
    post(apis.addAssets)({ content: JSON.stringify(data), gsId: userInfo.gsId, name })().then((res) => {
      Alert.alert('提示', '入库成功', [
        {
          text: '确定',
          onPress: () => {
            setData({});
            setName('');
            setRefresh(true);
          },
        },
      ]);
    });
  };
  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <ScrollView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <FormInput label="资产名称" onChangeText={setName} defaultValue={name} />
        {refresh && components.map((item, key) => <View key={key}>{item?.com}</View>)}
        <View>
          <CustomButton title="入库" onClick={putInStorage} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
