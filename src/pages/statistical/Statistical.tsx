import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { BarChart } from 'react-native-chart-kit';
import { get, post } from '../../HiNet';
import apis from '../../apis';
import _ from 'lodash';
import RNPickerSelect from 'react-native-picker-select';

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
  useEffect(() => {
    initFaultCount();
    initOptions();
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
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor, justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', borderWidth: 1, borderColor: theme.borderColor }}>
          <View
            style={[
              styles.countBox,
              styles.rightBottomBorder,
              { width: (screenWidth - 2) / 2, borderColor: theme.borderColor },
            ]}
          >
            <Text style={{ fontSize: 24, color: theme.fontColor }}>故障总数</Text>
            <Text style={[styles.countNum, { color: '#000000' }]}>{faultTotal}</Text>
          </View>
          <View style={[styles.countBox, { width: (screenWidth - 2) / 2 }]}>
            <Text style={{ fontSize: 24, color: theme.fontColor }}>已解决故障</Text>
            <Text style={[styles.countNum, { color: theme.success }]}>{faultCompleteTotal}</Text>
          </View>
          <View style={[styles.countBox, { width: (screenWidth - 2) / 2 }]}>
            <Text style={{ fontSize: 24, color: theme.fontColor }}>待处理故障</Text>
            <Text style={[styles.countNum, { color: theme.warrning }]}>{faultPendingTotal}</Text>
          </View>
          <View
            style={[
              styles.countBox,
              styles.leftTopBorder,
              { width: (screenWidth - 2) / 2, borderColor: theme.borderColor },
            ]}
          >
            <Text style={{ fontSize: 24, color: theme.fontColor }}>资产总数</Text>
            <Text style={[styles.countNum, { color: theme.error }]}>{assetCount}</Text>
          </View>
        </View>
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
          chartConfig={{
            backgroundGradientFrom: '#FFFFFF',
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: '#FFFFFF',
            backgroundGradientToOpacity: 0.5,
            color: () => theme.primary,
            strokeWidth: 2, // optional, default 3
            barPercentage: 0.5,
            useShadowColorFromDataset: false,
          }}
          fromZero={true}
          showBarTops={false}
        />
      </View>
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
  countNum: {
    fontSize: 22,
    textAlign: 'center',
    textAlignVertical: 'center',
    flex: 1,
  },
});
