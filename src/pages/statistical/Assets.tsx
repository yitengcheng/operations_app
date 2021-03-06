import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, ScrollView, Alert, RefreshControl } from 'react-native';
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
import { CustomButton, NavBar } from '../../common/Component';
import dayjs from 'dayjs';
import NavigationUtil from '../../navigator/NavigationUtil';

export default (props: any) => {
  const { params } = props.route;
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const userInfo = useSelector((state) => {
    return state.userInfo.userInfo;
  });
  const [data, setData] = useState(params ?? {});
  const [components, setComponents] = useState([]);
  const [componentsOption, setComponentsOption] = useState({});
  const [templateId, setTemplateId] = useState('');
  const [id, setId] = useState(params?._id ?? '');
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    initTemplate();
  }, []);
  const initTemplate = () => {
    post(`${apis.templateInfo}`)({ type: 1 })().then((res) => {
      let content = isJsonString(res.content) ? JSON.parse(res.content) : undefined;
      if (content) {
        setComponentsOption(content);
        _.toPairs(content).map((item) => {
          item?.[1] && pushComponent(item?.[1]);
        });
        setComponents(_.uniqBy(components, 'label'));
        setTemplateId(res._id);
      }
    });
  };

  const pushComponent = (component: any, index?: number) => {
    const { type, label, count, maxLength, hasRequired, options, maxDate, minDate } = component;
    let com;
    switch (type) {
      case '???????????????':
        com = (
          <FormInput
            label={label}
            key={randomId()}
            maxLength={maxLength ? maxLength * 1 : 255}
            required={hasRequired}
            defaultValue={data[label]}
            onChangeText={(value) => {
              saveData(label, value);
            }}
          />
        );
        break;
      case '???????????????':
        com = (
          <FormInput
            label={label}
            key={randomId()}
            maxLength={maxLength ? maxLength * 1 : 255}
            required={hasRequired}
            defaultValue={data[label]}
            onChangeText={(value) => {
              saveData(label, value);
            }}
          />
        );
        break;
      case '?????????????????????':
        com = (
          <FormInput
            multiline
            label={label}
            key={randomId()}
            maxLength={maxLength ? maxLength * 1 : 255}
            required={hasRequired}
            defaultValue={data[label]}
            onChangeText={(value) => {
              saveData(label, value);
            }}
          />
        );
        break;
      case '?????????':
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
      case '?????????':
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
      case '?????????':
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

      case '????????????':
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
      case '????????????':
        com = (
          <FormDatePicker
            label={label}
            maxDate={maxDate ?? dayjs().format('YYYY-MM-DD')}
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
      case '??????????????????':
        com = (
          <FormDateRange
            label={label}
            maxDate={maxDate ?? dayjs().format('YYYY-MM-DD')}
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
      default:
        break;
    }
    components.push({
      label,
      com,
    });
  };
  const saveData = (label: string, value: any) => {
    setData(Object.assign(data, { [label]: value }));
  };
  const putInStorage = () => {
    let flag = false;
    _.toPairs(componentsOption).map((item) => {
      if (item[1].hasRequired && !data[item[0]]) {
        Alert.alert('??????', `${item[0]}????????????`);
        flag = true;
      }
      if (item[1].maxLength && data[item[0]]?.length > item[1].maxLength) {
        Alert.alert('??????', `${item[0]}?????????????????????${item[1].maxLength}`);
        flag = true;
      }
    });
    if (flag) {
      return;
    }
    post(apis.addAssets)({ data, templateId, id })().then((res) => {
      Alert.alert('??????', '????????????', [
        {
          text: '??????',
          onPress: () => {
            setData({});
            params?.listRef?.current?.refresh();
            NavigationUtil.goBack();
          },
        },
      ]);
    });
  };
  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar title="??????" {...props} />
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.backgroundColor }}
        refreshControl={
          <RefreshControl
            title="Loading"
            refreshing={isLoading}
            titleColor={theme.fontColor}
            colors={[theme.primary]}
            onRefresh={() => {
              initTemplate();
            }}
            tintColor={theme.primary}
          />
        }
      >
        {components.map((item, key) => (
          <View key={key}>{item?.com}</View>
        ))}
        <View>
          <CustomButton title={params._id ? '??????' : '??????'} onClick={putInStorage} />
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
