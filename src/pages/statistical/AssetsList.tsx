import React, { useState, useRef, useEffect } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import apis from '../../apis';
import { CustomButton, ListData, NavBar, Popup } from '../../common/Component';
import _ from 'lodash';
import NavigationUtil from '../../navigator/NavigationUtil';
import { post } from '../../HiNet';
import FormSelect from '../../common/form/FormSelect';
export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const listRef = useRef();
  const [assetId, setAssetId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [imgVisible, setImgVisible] = useState(false);
  const [key, setKey] = useState('');
  const [options, setOptions] = useState([]);
  const [baseUrl, setBaseUrl] = useState('');
  const width = useWindowDimensions().width;
  const height = useWindowDimensions().height;
  useEffect(() => {
    initTemplateKeys();
  }, []);
  const initTemplateKeys = () => {
    post(apis.getTemplateKeys)({ type: '1' })().then((res) => {
      res.map((item) => {
        options.push({ label: item, value: item });
      });
      setOptions([...options]);
    });
  };
  const delAsset = (id) => {
    Alert.alert('提示', '请选择操作', [
      {
        text: '删除',
        onPress: () => {
          post(apis.delAssets)({ id })().then((res) => {
            listRef.current?.refresh();
          });
        },
      },
      {
        text: '下载二维码',
        onPress: () => {
          setAssetId(id);
          setModalVisible(true);
        },
      },
      {
        text: '取消',
      },
    ]);
  };
  const renderItem = (data) => {
    let res = _.toPairs(data);
    return (
      <TouchableOpacity
        onPress={() => NavigationUtil.goPage({ listRef, ...data }, 'Assets')}
        onLongPress={() => delAsset(data._id)}
        style={{ padding: 10, borderBottomWidth: 1, borderColor: theme.borderColor }}
      >
        {res.map((item, index) => (
          <View style={{ flexDirection: 'row' }} key={index}>
            <Text style={{ fontSize: 16, color: '#000000' }}>{item?.[0]}：</Text>
            <Text style={{ fontSize: 16, color: '#000000' }}>{item?.[1]}</Text>
          </View>
        ))}
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <View style={{ height: 45 }}>
        <CustomButton title="录入资产" onClick={() => NavigationUtil.goPage({}, 'Assets')} />
      </View>
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <ListData url={apis.assetList} renderItem={renderItem} ref={listRef} />
      </View>
      <Popup
        modalVisible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
        type="center"
      >
        <FormSelect label="二维码展示文字" options={options} required={false} onChange={setKey} />
        <View>
          <CustomButton
            title="下载"
            onClick={() => {
              post(apis.downQr)({ id: assetId, key })().then((res) => {
                setBaseUrl(res.imgBase64);
                setModalVisible(false);
                setImgVisible(true);
              });
            }}
          />
        </View>
      </Popup>
      <Popup
        modalVisible={imgVisible}
        onClose={() => {
          setImgVisible(false);
        }}
        title="请截图保存二维码到手机"
        type="center"
      >
        <Image
          source={{ uri: baseUrl }}
          style={{ width: width, height: height - 120, alignItems: 'center', justifyContent: 'center' }}
        />
      </Popup>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
