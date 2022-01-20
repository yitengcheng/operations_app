import React from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import AntDesign from "react-native-vector-icons/AntDesign";
import RNPickerSelect from "react-native-picker-select";

export const Label = (props: any) => {
  const { label, labelStyle, required = true } = props;
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  return (
    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", minHeight: 35, padding: 5 }}>
      {required && <AntDesign name="star" size={8} style={{ color: theme.error }} />}
      <Text style={[labelStyle ?? { color: theme.fontColor, fontSize: theme.fontSize }]}>{`${label}：`}</Text>
    </View>
  );
};

export const FormInput = (props: any) => {
  const { label, inputStyle, placeholder, ...other } = props;
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  let placeholderText = placeholder ?? `请输入${label}`;
  return (
    <View style={styles.row}>
      <Label {...props} />
      <TextInput
        style={[inputStyle ?? { minHeight: 35, flex: 1, borderWidth: 1, borderColor: theme.borderColor }]}
        placeholder={placeholderText}
        {...other}
      />
    </View>
  );
};

export const FormSelect = (props: any) => {
  const { label, placeholder, options, onChange } = props;
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  let placeholderText = placeholder ?? `请选择${label}`;
  return (
    <View style={styles.row}>
      <Label {...props} />
      <RNPickerSelect
        onValueChange={onChange}
        placeholder={{ label: placeholderText, value: null, color: "#9EA0A4" }}
        style={pickerSelectStyles}
        items={options}
      />
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 2,
    color: "rgba(0, 0, 0, 0.65)",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 2,
    color: "rgba(0, 0, 0, 0.65)",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const styles = StyleSheet.create({
  row: {
    flexDirection: "column",
    padding: 5,
    minHeight: 90,
  },
});
