import React from 'react';
import { View, Text } from 'react-native';
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
      {required && <Text>星</Text>}
      <Text style={[labelStyle ?? { color: theme.fontColor, fontSize: theme.fontSize }]}>{`${label}：`}</Text>
    </View>
  );
};

export default Label;
