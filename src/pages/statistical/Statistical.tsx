import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  ScrollView,
  TouchableOpacity,
  Modal,
  RefreshControl,
} from 'react-native';
import { useSelector } from 'react-redux';
import { BarChart } from 'react-native-chart-kit';
import { get, post } from '../../HiNet';
import apis from '../../apis';
import _ from 'lodash';
import RNPickerSelect from 'react-native-picker-select';
import NavigationUtil from '../../navigator/NavigationUtil';

export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const userInfo = useSelector((state) => {
    return state.userInfo.userInfo;
  });
  const screenWidth = useWindowDimensions().width;
  const [faultTotal, setFaultTotal] = useState(0);
  const [faultCompleteTotal, setFaultCompleteTotal] = useState(0);
  const [faultPendingTotal, setFaultPendingTotal] = useState(0);
  const [assetCount, setAssetCount] = useState(0);
  const [addressId, setAddressId] = useState(undefined);
  const [chartData, setChartData] = useState({ labels: ['测试1', '测试2'], datasets: [{ data: [1, 1] }] });
  const [items, setItems] = useState([]);
  const [assetsModal, setAssetsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    initFaultCount();
    initAssetCount();
  }, []);
  useEffect(() => {
    initInspection();
  }, [addressId]);
  const initAssetCount = () => {
    post(apis.assetCount)()().then((res) => {
      const { assetTotal } = res;
      setAssetCount(assetTotal);
    });
  };
  const initFaultCount = () => {
    post(apis.faultStatistical)()().then((res) => {
      const { faultTotal, faultCompleteTotal, faultPendingTotal } = res;
      setFaultCompleteTotal(faultCompleteTotal);
      setFaultPendingTotal(faultPendingTotal);
      setFaultTotal(faultTotal);
    });
  };
  const initInspection = () => {
    post(apis.patrolStatistical)({ addressId })().then((res) => {
      let labels = _.map(_.flatten(_.map(res, 'address')), 'office');
      let datasets = [{ data: _.map(res, 'count') }];
      setChartData({ labels, datasets });
    });
  };
  const initOptions = () => {
    post(`${apis.getInspectionAddressPage}`)()().then((res) => {
      let result = [];
      res.map((item) => {
        result.push({ label: item.office, value: item._id });
      });
      setItems(result);
    });
  };
  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.backgroundColor }}
        refreshControl={
          <RefreshControl
            title="Loading"
            titleColor={theme.fontColor}
            colors={[theme.primary]}
            onRefresh={() => {
              initFaultCount();
              initOptions();
              initAssetCount();
            }}
            tintColor={theme.primary}
            refreshing={isLoading}
          />
        }
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', borderWidth: 1, borderColor: theme.borderColor }}>
          <TouchableOpacity
            style={[
              styles.countBox,
              styles.rightBottomBorder,
              { width: (screenWidth - 2) / 2, borderColor: theme.borderColor },
            ]}
            onPress={() => {
              NavigationUtil.goPage({ title: '全部故障', type: 5 }, 'RepairList');
            }}
          >
            <Text style={{ fontSize: 24, color: theme.fontColor }}>故障总数</Text>
            <View style={styles.countNumBox}>
              <Text style={[styles.countNum, { color: '#000000' }]}>{faultTotal}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.countBox, { width: (screenWidth - 2) / 2 }]}
            onPress={() => {
              NavigationUtil.goPage({ title: '全部已解决故障', type: 7 }, 'RepairList');
            }}
          >
            <Text style={{ fontSize: 24, color: theme.fontColor }}>已解决故障</Text>
            <View style={styles.countNumBox}>
              <Text style={[styles.countNum, { color: theme.success }]}>{faultCompleteTotal}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.countBox, { width: (screenWidth - 2) / 2 }]}
            onPress={() => {
              NavigationUtil.goPage({ title: '全部待处理故障', type: 6 }, 'RepairList');
            }}
          >
            <Text style={{ fontSize: 24, color: theme.fontColor }}>待处理故障</Text>
            <View style={styles.countNumBox}>
              <Text style={[styles.countNum, { color: theme.warrning }]}>{faultPendingTotal}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.countBox,
              styles.leftTopBorder,
              { width: (screenWidth - 2) / 2, borderColor: theme.borderColor },
            ]}
            onPress={() => NavigationUtil.goPage({}, 'AssetsClassify')}
          >
            <Text style={{ fontSize: 24, color: theme.fontColor }}>资产总数</Text>
            <View style={styles.countNumBox}>
              <Text style={[styles.countNum, { color: theme.error }]}>{assetCount}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: theme.fontSize, color: theme.fontColor, margin: 10 }}>各巡检点巡检次数统计</Text>
        <RNPickerSelect
          onValueChange={(obj) => {
            setAddressId(obj);
          }}
          placeholder={{ label: '请选择巡检地点', value: null, color: '#9EA0A4' }}
          style={pickerSelectStyles}
          items={items}
        />
        <BarChart
          data={chartData}
          width={screenWidth}
          height={220}
          yAxisSuffix="次"
          chartConfig={{
            decimalPlaces: 1,
            backgroundGradientFrom: '#FFFFFF',
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: '#FFFFFF',
            backgroundGradientToOpacity: 0.5,
            color: () => theme.primary,
            barPercentage: 0.5,
            useShadowColorFromDataset: false,
          }}
          withHorizontalLabels={false}
          fromZero={true}
          showBarTops={true}
          showValuesOnTopOfBars={true}
        />
      </ScrollView>
    </SafeAreaView>
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
  root: {
    flex: 1,
  },
  rightBottomBorder: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
  leftTopBorder: {
    borderLeftWidth: 1,
    borderTopWidth: 1,
  },
  countBox: {
    height: 160,
    padding: 10,
  },
  countNumBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countNum: {
    fontSize: 22,
  },
});
