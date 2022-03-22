import React, { useEffect, useRef, useState } from 'react';
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
import { CustomButton, Popup } from '../Component';

/**
 * 图片选择器
 * @param props
 * @returns
 */
const FormUpload = (props: any) => {
  const { count = 1, defaultValue, editable = true, onChange } = props;
  const [action, setAction] = useState(false);
  const [imgAction, setImgAction] = useState(false);
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const [fileList, setFileList] = useState(defaultValue ?? []);
  const [currentImage, setCurrentImage] = useState('');
  useEffect(() => {
    onChange && onChange(fileList);
  }, [fileList]);
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
      fileList.push(result.url);
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
                setCurrentImage(item);
                setImgAction(true);
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
              editable && setAction(true);
            }}
          >
            <Image source={require('../../assets/image/imgAdd.png')} style={{ width: 50, height: 50 }} />
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
      <Popup modalVisible={action} onClose={() => setAction(false)}>
        <View style={{ height: 45 }}>
          <CustomButton
            title="相册"
            onClick={() => {
              setAction(false);
              choosePhoto(0);
            }}
            buttonStyle={{ backgroundColor: theme.backgroundColor }}
            fontStyle={{ color: theme.primary }}
          />
        </View>
        <View style={{ height: 45 }}>
          <CustomButton
            title="相机"
            onClick={() => {
              setAction(false);
              choosePhoto(1);
            }}
            buttonStyle={{ backgroundColor: theme.backgroundColor }}
            fontStyle={{ color: theme.primary }}
          />
        </View>
      </Popup>
      <Popup modalVisible={imgAction} onClose={() => setImgAction(false)}>
        <View style={{ height: 45 }}>
          <CustomButton
            title="删除"
            onClick={() => {
              setImgAction(false);
              operationImage(0);
            }}
            buttonStyle={{ backgroundColor: theme.backgroundColor }}
            fontStyle={{ color: theme.primary }}
          />
        </View>
      </Popup>
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
