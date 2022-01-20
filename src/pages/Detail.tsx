import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, Text, Modal, Alert } from "react-native";
import { ConfirmButton, NavBar } from "../common/Component";
import { useSelector } from "react-redux";
import AntDesign from "react-native-vector-icons/AntDesign";
import { FormInput, FormSelect } from "../common/form/Index";
import { useValidation } from "react-native-form-validator";

export default (props: any) => {
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const onSubmit = (data) => console.log(data);
  const [compontents, setCompontents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState("");
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const { validate, isFieldInError, getErrorsInField, getErrorMessages } = useValidation({
    state: { type, label, value },
  });

  const confirmCompontent = () => {
    const res = validate({
      type: { required: true },
      label: { required: true },
      value: { required: true },
    });
    if (!res) {
      Alert.alert("错误", "表单填写尚未完成，请核查");
      return;
    }
    setModalVisible(false);
    setCompontents(compontents.concat([<FormInput label={label} key={value} />]));
    reset();
  };
  const reset = () => {
    setLabel("");
    setType("");
    setValue("");
  };
  return (
    <SafeAreaView style={[{ backgroundColor: theme.primary }, styles.root]}>
      <NavBar title="详情" {...props} />
      <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        {compontents}
        <AntDesign.Button
          name="pluscircleo"
          size={26}
          style={{ justifyContent: "center" }}
          onPress={() => setModalVisible(true)}
        >
          添加
        </AntDesign.Button>
      </View>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <SafeAreaView style={[{ backgroundColor: theme.backgroundColor }, styles.root]}>
          <FormSelect
            label="类型"
            options={[
              { label: "文本框", value: "文本框" },
              { label: "选择器", value: "选择器" },
              { label: "文本域", value: "文本域" },
            ]}
            onChange={(value) => setType(value)}
          />
          <FormInput label="框名" value={label} name="label" onChangeText={setLabel} />
          <FormInput label="字段名" value={value} name="value" onChangeText={setValue} />
          <View style={{ flexDirection: "row" }}>
            <ConfirmButton title="保存" onClick={confirmCompontent} />
            <ConfirmButton title="取消" />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
