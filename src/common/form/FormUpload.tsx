import React, { useRef, useState } from 'react';
import { View, Image, TouchableOpacity, Alert, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import ActionSheet from 'react-native-actionsheet';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import apis from '../../apis';
import { post } from '../../HiNet';
import { randomId, to, togetherUrl } from '../../utils';
import config from '../../config';
import _ from 'lodash';
import ErrorMessage from './ErrorMessage';
import Label from './Label';

/**
 * 图片选择器
 * @param props
 * @returns
 */
const FormUpload = (props: any) => {
  const { count = 1, defaultValue, editable = true } = props;
  const action = useRef();
  const imgAction = useRef();
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const [fileList, setFileList] = useState(defaultValue ?? []);
  let currentImage = '';
  const operationImage = (index) => {
    if (index === 0) {
      _.remove(fileList, (item) => item === currentImage);
    }
    setFileList([...fileList]);
  };
  const choosePhoto = async (index) => {
    let res;
    let resErr;
    if (index === 0) {
      [resErr, res] = await to(launchImageLibrary());
    } else if (index === 1) {
      [resErr, res] = await to(launchCamera({ cameraType: 'back' }));
    } else {
      return;
    }
    if (resErr) {
      Alert.alert('未知错误');
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
    const asset = res?.assets?.[0] ?? {};
    const formData = new FormData();
    const file = { uri: asset.uri, name: asset.fileName, size: asset.fileSize, type: 'multipart/form-data' };
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
                  uri: togetherUrl(item),
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
              editable && action.current.show();
            }}
          >
            <Text>+</Text>
          </TouchableOpacity>
        ) : (
          <View />
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
      {props.isFieldInError && ErrorMessage(props.isFieldInError, props.getErrorsInField, props.name)}
    </View>
  );
};

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

export default FormUpload;
