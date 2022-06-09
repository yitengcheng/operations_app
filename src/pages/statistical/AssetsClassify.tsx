import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Text,
  useWindowDimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import apis from '../../apis';
import { NavBar, Popup } from '../../common/Component';
import { post } from '../../HiNet';
import { loadStorage } from '../../utils/localStorage';
import Classify from './Classify';
import _ from 'lodash';
import { randomId } from '../../utils';
import { boxShadow } from '../../assets/style/styles';
import NavigationUtil from '../../navigator/NavigationUtil';

export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const [initDataModal, setInitDataModal] = useState(false);
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [classification, setClassification] = useState('');
  const [status, setStatus] = useState('');

  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  useEffect(() => {
    loadStorage('classification').then((res) => {
      if (res?.classification && res?.status) {
        setInitDataModal(false);
        setClassification(res?.classification);
        setStatus(res?.status);
        initAssetsData(res?.classification, res?.status);
      } else {
        setInitDataModal(true);
      }
    });
  }, []);

  const initAssetsData = (classification: any, status: any) => {
    post(apis.assetsByField)({ classification, status })()
      .then((res) => {
        setData(res);
        setInitDataModal(false);
      })
      .catch();
  };
  const createElement = () => {
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {_.toPairs(data).map((item) => {
          return (
            <View
              key={randomId()}
              style={[
                {
                  width: (windowWidth - 12) / 2,
                  height: (windowHeight - 12) / 3,
                  backgroundColor: theme.backgroundColor,
                  margin: 3,
                },
                boxShadow,
              ]}
            >
              <TouchableOpacity
                style={(styles.assetTitle, { flexWrap: 'wrap' })}
                onPress={() => NavigationUtil.goPage({ [classification]: item[0] }, 'AssetsClassifyList')}
              >
                <Text style={styles.assetTitleText}>{item[0]}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text>总计：</Text>
                  <Text style={[styles.assetTitleText, { color: theme.primary }]}>{item[1]?.total}</Text>
                </View>
              </TouchableOpacity>
              <ScrollView style={styles.statusList}>
                {item[1]?.status?.map((status) => (
                  <TouchableOpacity
                    key={randomId()}
                    style={styles.assetTitle}
                    onPress={() =>
                      NavigationUtil.goPage({ [classification]: item[0], [status]: status._id }, 'AssetsClassifyList')
                    }
                  >
                    <Text>{status._id}</Text>
                    <Text>数量：{status.count}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          );
        })}
      </View>
    );
  };
  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <NavBar
          title="资产分类统计"
          {...props}
          rightTitle="重置"
          onRightClick={() => {
            setInitDataModal(true);
          }}
        />
        <ScrollView
          style={{ flex: 1, backgroundColor: theme.borderColor }}
          refreshControl={
            <RefreshControl
              title="Loading"
              refreshing={isLoading}
              titleColor={theme.fontColor}
              colors={[theme.primary]}
              onRefresh={() => {
                initAssetsData();
              }}
              tintColor={theme.primary}
            />
          }
        >
          {data ? (
            createElement()
          ) : (
            <View style={{ alignItems: 'center', backgroundColor: theme.backgroundColor }}>
              <Image
                source={require('../../assets/image/empty_data.png')}
                style={{ width: windowWidth / 2, height: windowHeight / 4 }}
                resizeMode="contain"
              />
              <Text style={{ fontSize: 20, color: theme.fontColor }}>暂无数据</Text>
            </View>
          )}
        </ScrollView>
        <Popup
          type="center"
          modalVisible={initDataModal}
          onClose={() => {
            setInitDataModal(false);
          }}
        >
          <Classify initAssetsClassify={initAssetsData} />
        </Popup>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  assetTitle: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#d9d9d9',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusList: {
    padding: 10,
  },
  assetTitleText: {
    fontSize: 18,
  },
});
