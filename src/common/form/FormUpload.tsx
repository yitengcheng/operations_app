import React, { useEffect, useRef, useState } from 'react';
import { View, Image, TouchableOpacity, Alert, StyleSheet, Text, SafeAreaView, Modal } from 'react-native';
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
import { CustomButton, NavBar, Popup } from '../Component';
import { RNCamera } from 'react-native-camera';

/**
 * 图片选择器
 * @param props
 * @returns
 */
const FormUpload = (props: any) => {
  const { count = 1, defaultValue, editable = true, onChange } = props;
  const [action, setAction] = useState(false);
  const [imgAction, setImgAction] = useState(false);
  const [cameraModal, setCameraModal] = useState(false);
  const camera = useRef();
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
      uploadImg(res?.assets?.[0] ?? {});
    } else if (index === 1) {
      // [resErr, res] = await to(launchCamera({ cameraType: 'back' }));
      setCameraModal(true);
    } else {
      return;
    }
  };
  const uploadImg = (asset: any) => {
    const formData = new FormData();
    const file = { uri: asset?.uri, name: asset?.fileName, size: asset?.fileSize, type: 'multipart/form-data' };
    formData.append('file', file);
    post(apis.uploadImg)(formData)().then((result) => {
      fileList.push(result.url);
      setFileList([...fileList]);
    });
  };
  const takePicture = async () => {
    if (camera) {
      const option = { quality: 0.5 };
      const file = await camera.current?.takePictureAsync(option);
      if (file) {
        uploadImg({ uri: file.uri, fileName: file.uri.substring(file.uri.lastIndexOf('/') + 1) });
        setCameraModal(false);
      } else {
        Alert.alert('失败', '拍照失败，请重新拍照');
      }
    }
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
            <Image
              source={require('../../assets/image/imgAdd.png')}
              style={{ width: 50, height: 50 }}
              resizeMode="contain"
            />
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
      <Modal
        animationType="slide"
        visible={cameraModal}
        onRequestClose={() => {
          setCameraModal(false);
        }}
        transparent
      >
        <SafeAreaView style={{ flex: 1 }}>
          <NavBar
            title="拍照"
            rightTitle="关闭"
            onRightClick={() => {
              setCameraModal(false);
            }}
          />
          <RNCamera style={{ flex: 1 }} ref={camera}>
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
              <TouchableOpacity
                onPress={takePicture}
                style={{
                  width: 90,
                  height: 90,
                  backgroundColor: '#ffffff',
                  borderRadius: 45,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                <Image
                  source={require('../../assets/image/camera.png')}
                  resizeMode="contain"
                  style={{ width: 50, height: 50 }}
                />
              </TouchableOpacity>
            </View>
          </RNCamera>
        </SafeAreaView>
      </Modal>
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
