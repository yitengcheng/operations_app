import React, { useEffect, useState } from 'react';
import { Modal, SafeAreaView, StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { CustomButton, NavBar } from '../../common/Component';
import FormInput from '../../common/form/FormInput';
import FormSelect from '../../common/form/FormSelect';
import FormUpload from '../../common/form/FormUpload';
import FormDatePicker from '../../common/form/FormDatePicker';
import FormDateRange from '../../common/form/FormDateRange';
import { useValidation } from 'react-native-form-validator';
import { isJsonString, randomId, validOption } from '../../utils';
import FormRadio from '../../common/form/FormRadio';
import { get, post } from '../../HiNet';
import NavigationUtil from '../../navigator/NavigationUtil';
import apis from '../../apis';
import _ from 'lodash';
import dayjs from 'dayjs';
import { NestableScrollContainer, NestableDraggableFlatList, ScaleDecorator } from 'react-native-draggable-flatlist';

export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const userInfo = useSelector((state) => {
    return state.userInfo.userInfo;
  });

  const { title, ...params } = props.route.params;
  const [components, setComponents] = useState([]);
  const [componentsOption, setComponentsOption] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState('');
  const [label, setLabel] = useState('');
  const [hasRequired, setHasRequired] = useState('');
  const [options, setOptions] = useState([{ label: '选项1', value: '' }]);
  const [maxLength, setMaxLength] = useState('');
  const [count, setCount] = useState('');
  const [minDate, setMinDate] = useState(undefined);
  const [maxDate, setMaxDate] = useState(undefined);
  const [index, setIndex] = useState('');
  const [templateId, setTemplateId] = useState('');

  useEffect(() => {
    initTemplate();
  }, []);

  const initTemplate = () => {
    post(`${apis.templateInfo}`)({ type: params.type })().then((res) => {
      let content = isJsonString(res.content) ? JSON.parse(res.content) : undefined;
      if (content) {
        setComponentsOption(content);
        _.toPairs(content).map((item) => {
          item?.[1] && pushComponent(item?.[1]);
        });
        setComponents([...components]);
        setTemplateId(res._id);
      }
    });
  };

  const { validate, ...other } = useValidation({
    state: { type, label, maxLength, hasRequired, count, minDate, maxDate },
    labels: {
      type: '类型',
      label: '框名',
      maxLength: '最大长度',
      hasRequired: '是否为必选项',
      count: '可上传图片数',
      minDate: '可选最小日期',
      maxDate: '可选最大日期',
    },
  });

  const confirmCompontent = () => {
    const otherValidate = type === '图片选择' ? { count: { required: true, numbers: true } } : {};
    const res = validate({
      type: { required: true },
      label: { required: true },
      maxLength: { numbers: true },
      hasRequired: { required: true },
      maxDate: { date: 'YYYY-MM-DD' },
      minDate: { date: 'YYYY-MM-DD' },
      ...otherValidate,
    });
    if (!res) {
      Alert.alert('错误', '表单填写尚未完成，请核查');
      return;
    }
    setModalVisible(false);
    const length = maxLength ?? 255;
    let tmpOption = [];
    options.map((item) => item.value && tmpOption.push({ label: item.value, value: item.value }));
    pushComponent(
      {
        type,
        label,
        maxDate,
        minDate,
        hasRequired,
        maxLength,
        options: tmpOption,
        count,
      },
      index,
    );
    setComponents([...components]);
    setComponentsOption(
      Object.assign(componentsOption, {
        [label]: {
          type,
          label,
          maxDate,
          minDate,
          hasRequired,
          maxLength,
          options: tmpOption,
          count,
        },
      }),
    );
    reset();
  };

  const pushComponent = (component: any, index?: number) => {
    const { type, label, count, maxLength, hasRequired, options, maxDate, minDate } = component;
    let com;
    switch (type) {
      case '文字输入框':
        com = <FormInput label={label} key={randomId()} maxLength={maxLength * 1} required={hasRequired} />;
        break;
      case '数字输入框':
        com = <FormInput label={label} key={randomId()} maxLength={maxLength * 1} required={hasRequired} />;
        break;
      case '多行文字输入框':
        com = <FormInput multiline label={label} key={randomId()} maxLength={maxLength * 1} required={hasRequired} />;
        break;
      case '选择器':
        com = (
          <FormSelect label={label} key={randomId()} options={options} required={hasRequired} onChange={() => {}} />
        );
        break;
      case '单选框':
        com = <FormRadio label={label} key={randomId()} options={options} required={hasRequired} onChange={() => {}} />;
        break;
      case '多选框':
        com = (
          <FormRadio
            multiple
            label={label}
            key={randomId()}
            options={options}
            required={hasRequired}
            onChange={() => {}}
          />
        );
        break;

      case '图片选择':
        com = <FormUpload label={label} count={count} key={randomId()} required={hasRequired} />;
        break;
      case '日期选择':
        com = (
          <FormDatePicker
            label={label}
            maxDate={maxDate ?? dayjs().format('YYYY-MM-DD')}
            minDate={minDate ?? '2000-1-1'}
            key={randomId()}
            required={hasRequired}
          />
        );
        break;
      case '日期范围选择':
        com = (
          <FormDateRange
            label={label}
            maxDate={maxDate ?? dayjs().format('YYYY-MM-DD')}
            minDate={minDate ?? '2000-1-1'}
            key={randomId()}
            required={hasRequired}
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

  const reset = () => {
    setLabel('');
    setType('');
    setCount('');
    setMaxLength('');
    setOptions([{ label: '选项1', value: '' }]);
    setHasRequired('');
    setMinDate('');
    setMaxDate('');
    setIndex('');
  };

  const selectOptions = () => {
    return (
      <View>
        {options.map((item, key) => (
          <FormInput
            label={item.label}
            value={item.value}
            key={item.value}
            onChangeText={(value) => {
              options[key] = { label: item.label, value };
              setOptions([...options]);
            }}
          />
        ))}
        <View style={{ height: 45 }}>
          <CustomButton
            source={require('../../assets/image/add.png')}
            onClick={() => {
              options.push({ label: `选项${options.length + 1}`, value: '' });
              setOptions([...options]);
            }}
          />
        </View>
      </View>
    );
  };

  const saveTemplate = () => {
    let result = {};
    components.map((item) => {
      result[item?.label] = componentsOption[item?.label];
    });
    post(apis.saveTemplate)({
      type: params.type,
      content: JSON.stringify(result),
      id: templateId,
    })().then((res) => {
      Alert.alert('提示', '保存成功', [
        {
          text: '确定',
          onPress: () => {
            NavigationUtil.goBack();
          },
        },
      ]);
    });
  };

  const delComponent = (label: string) => {
    let index = _.findIndex(components, (item) => item.label === label);
    delete componentsOption[label];
    delete components[index];
    setComponentsOption({ ...componentsOption });
    setComponents([...components]);
  };

  const editComponent = (label: string) => {
    setModalVisible(true);
    let index = _.findIndex(components, (item) => item.label === label);
    let tmp = [];
    componentsOption[label]?.options?.map((item, index) => {
      tmp.push({ label: `选项${index + 1}`, value: item.value });
    });
    setLabel(componentsOption[label]?.label);
    setType(componentsOption[label]?.type);
    setCount(componentsOption[label]?.count);
    setMaxLength(componentsOption[label]?.maxLength);
    setOptions(tmp);
    setHasRequired(componentsOption[label]?.hasRequired);
    setMinDate(componentsOption[label]?.minDate);
    setMaxDate(componentsOption[label]?.maxDate);
    setIndex(index);
  };
  const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onPress={() => {
            Alert.alert('提示', '请选择操作', [
              {
                text: '删除',
                onPress: () => {
                  delComponent(item.label);
                },
              },
              {
                text: '编辑',
                onPress: () => {
                  editComponent(item.label);
                },
              },
              { text: '取消', onPress: () => {} },
            ]);
          }}
          onLongPress={drag}
          disabled={isActive}
        >
          {item?.com}
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar
        title={title}
        {...props}
        rightTitle="保存"
        onRightClick={() => {
          saveTemplate();
        }}
      />
      <ScrollView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <NestableScrollContainer>
          <NestableDraggableFlatList
            data={components}
            onDragEnd={({ data }) => setComponents(data)}
            keyExtractor={(item) => item?.com?.key}
            renderItem={renderItem}
          />
        </NestableScrollContainer>
        <NestableScrollContainer>
          <CustomButton
            title="添加"
            source={require('../../assets/image/addOption.png')}
            type="primary"
            onClick={() => {
              setModalVisible(true);
            }}
          />
        </NestableScrollContainer>
      </ScrollView>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <SafeAreaView style={[{ backgroundColor: theme.backgroundColor }, styles.root]}>
          <ScrollView>
            <FormSelect
              label="模板项的类型"
              options={[
                { label: '文字', value: '文字输入框' },
                { label: '数字', value: '数字输入框' },
                { label: '类目', value: '选择器' },
                { label: '备注', value: '多行文字输入框' },
                { label: '上传图片或照片', value: '图片选择' },
                { label: '日期', value: '日期选择' },
                { label: '单选', value: '单选框' },
                { label: '多选', value: '多选框' },
              ]}
              {...validOption('type', other)}
              defaultValue={type}
              onChange={(value) => setType(value)}
            />
            <FormSelect
              label="模板项是否为必选"
              options={[
                { label: '是', value: true },
                { label: '否', value: false },
              ]}
              {...validOption('hasRequired', other)}
              defaultValue={hasRequired}
              onChange={(value) => setHasRequired(value)}
            />
            <FormInput label="模板项名称" value={label} onChangeText={setLabel} {...validOption('label', other)} />
            {(type === '文字输入框' || type === '多行文字输入框') && (
              <FormInput
                label="最大长度"
                value={maxLength}
                onChangeText={setMaxLength}
                {...validOption('maxLength', other)}
                required={false}
              />
            )}
            {type === '图片选择' && (
              <FormInput
                label="可上传图片数"
                value={count}
                onChangeText={setCount}
                {...validOption('count', other)}
                required
              />
            )}
            {(type === '日期选择' || type === '日期范围选择') && (
              <FormInput
                label="可选最小日期"
                value={minDate}
                onChangeText={setMinDate}
                {...validOption('minDate', other)}
                required={false}
              />
            )}
            {(type === '日期选择' || type === '日期范围选择') && (
              <FormInput
                label="可选最大日期"
                value={maxDate}
                onChangeText={setMaxDate}
                {...validOption('maxDate', other)}
                required={false}
              />
            )}
            {(type === '选择器' || type === '单选框' || type === '多选框') && selectOptions()}
            <View style={{ flexDirection: 'row' }}>
              <CustomButton title="保存" onClick={confirmCompontent} />
              <CustomButton title="取消" onClick={() => setModalVisible(false)} />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
