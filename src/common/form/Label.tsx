import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';

/**
 * 表单标题
 * @param props
 * @returns
 */
const Label = (props: any) => {
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

export default Label;
