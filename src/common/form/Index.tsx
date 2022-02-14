import React, { useRef, useState } from 'react';
import { TextInput, View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RNPickerSelect from 'react-native-picker-select';
import ActionSheet from 'react-native-actionsheet';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import apis from '../../apis';
import { get, post } from '../../HiNet';
import { randomId } from '../../utils';
import config from '../../config';
import _ from 'lodash';

export const Label = (props: any) => {
  const { label, labelStyle, required = true } = props;
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 35, padding: 5 }}>
      {required && <AntDesign name="star" size={8} style={{ color: theme.error }} />}
      <Text style={[labelStyle ?? { color: theme.fontColor, fontSize: theme.fontSize }]}>{`${label}：`}</Text>
    </View>
  );
};

export const ErrorMessage = (isFieldInError: Function, getErrorsInField: Function, name: string) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  return (
    isFieldInError(name) &&
    getErrorsInField(name).map((errorMessage) => (
      <Text key={errorMessage} style={{ color: theme.error }}>
        {errorMessage}
      </Text>
    ))
  );
};

export const FormSelect = (props: any) => {
  const { label, placeholder, options, onChange } = props;
  const placeholderText = placeholder ?? `请选择${label}`;
  return (
    <View style={styles.column}>
      <Label {...props} />
      <RNPickerSelect
        onValueChange={onChange}
        placeholder={{ label: placeholderText, value: null, color: '#9EA0A4' }}
        style={pickerSelectStyles}
        items={options}
      />
      {props.isFieldInError && ErrorMessage(props.isFieldInError, props.getErrorsInField, props.name)}
    </View>
  );
};

export const FormInput = (props: any) => {
  const { label, inputStyle, placeholder, multiline, ...other } = props;
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const placeholderText = placeholder ?? `请输入${label}`;
  const heightNum = multiline ? 90 : 35;
  return (
    <View style={[styles.column, multiline && { height: 150 }]}>
      <Label {...props} />
      <TextInput
        style={[
          inputStyle ?? {
            height: heightNum,
            borderWidth: 1,
            borderColor: theme.borderColor,
            fontSize: theme.fontSize,
            padding: 5,
          },
        ]}
        placeholder={placeholderText}
        multiline
        {...other}
      />
      {props.isFieldInError && ErrorMessage(props.isFieldInError, props.getErrorsInField, props.name)}
    </View>
  );
};

export const FormUpload = (props: any) => {
  const { count = 1 } = props;
  const action = useRef();
  const imgAction = useRef();
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const [fileList, setFileList] = useState([]);
  let currentImage = '';
  const operationImage = (index) => {
    if (index === 0) {
      _.remove(fileList, (item) => item === currentImage);
    }
    setFileList([...fileList]);
  };
  const choosePhoto = async (index) => {
    let res;
    if (index === 0) {
      res = await launchImageLibrary();
    } else if (index === 1) {
      res = await launchCamera();
    } else {
      return;
    }
    if (res?.errorCode) {
      switch (res?.errorCode) {
        case 'camera_unavailable':
          Alert.alert('失败', '没有找到摄像头');
          break;
        case 'permission':
          Alert.alert('失败', '没有相机权限');
          break;
        default:
          Alert.alert('失败', '调用相机失败');
          break;
      }
      return;
    }
    let asset = res?.assets?.[0] ?? {};
    let formData = new FormData();
    let file = { uri: asset.uri, name: asset.fileName, size: asset.fileSize, type: 'multipart/form-data' };
    formData.append('file', file);
    post(apis.uploadImg)(formData)().then((result) => {
      fileList.push(result.data);
      setFileList([...fileList]);
    });
  };
  return (
    <View style={styles.column}>
      <Label {...props} />
      <View style={styles.imageBox}>
        {fileList.length > 0 &&
          fileList.map((item) => (
            <TouchableOpacity
              key={randomId()}
              onPress={() => {
                currentImage = item;
                imgAction.current.show();
              }}
            >
              <Image
                style={styles.imageAdd}
                source={{
                  uri: config.IMG_URL + item,
                }}
              />
            </TouchableOpacity>
          ))}
        {fileList.length < count ? (
          <TouchableOpacity
            style={{
              borderColor: theme.borderColor,
              padding: 10,
              ...styles.imageAdd,
            }}
            onPress={() => {
              action.current.show();
            }}
          >
            <AntDesign name="plus" size={40} />
          </TouchableOpacity>
        ) : (
          <View></View>
        )}
      </View>
      <ActionSheet
        ref={action}
        title={'选择'}
        options={['相册', '相机', '取消']}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
        onPress={choosePhoto}
      />
      <ActionSheet
        ref={imgAction}
        title={'操作'}
        options={['删除', '取消']}
        cancelButtonIndex={1}
        destructiveButtonIndex={1}
        onPress={operationImage}
      />
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 2,
    color: 'rgba(0, 0, 0, 0.65)',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 2,
    color: 'rgba(0, 0, 0, 0.65)',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    padding: 5,
    minHeight: 90,
  },
  imageAdd: {
    height: 125,
    width: 125,
    borderWidth: 1,
    marginRight: 5,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
