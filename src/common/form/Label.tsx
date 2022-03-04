import React from 'react';
import { View, Text, Image } from 'react-native';
import { useSelector } from 'react-redux';

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
      {required && (
        <Image source={require('../../assets/image/required.png')} style={{ width: 10, height: 10, marginRight: 5 }} />
      )}
      <Text style={[labelStyle ?? { color: theme.fontColor, fontSize: theme.fontSize }]}>{`${label}：`}</Text>
    </View>
  );
};

export default Label;
