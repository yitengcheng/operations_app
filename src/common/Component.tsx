import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

import AntDesign from 'react-native-vector-icons/AntDesign';

export const NavBar = (props: any) => {
  const { title, rightTitle, onRightClick, navigation } = props;
  const goBack = () => {
    navigation.goBack();
  };
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  return (
    <View style={[{ backgroundColor: theme.primary }, styles.navBar]}>
      {props.hasOwnProperty('navigation') ? (
        <TouchableOpacity onPress={goBack}>
          <AntDesign name="left" size={24} color="#FFF" />
        </TouchableOpacity>
      ) : (
        <View />
      )}
      <View style={styles.titleLayout}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <TouchableOpacity onPress={onRightClick}>
        <Text style={styles.button}>{rightTitle}</Text>
      </TouchableOpacity>
    </View>
  );
};

export const CustomButton = (props: any) => {
  const { title, onClick, buttonStyle, fontStyle, type = 'primary' } = props;
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  return (
    <TouchableOpacity
      onPress={onClick}
      style={[
        buttonStyle || {
          backgroundColor: theme[type],
          borderColor: theme.borderColor,
          ...styles.buttonStyle,
        },
      ]}
    >
      <Text
        style={[
          fontStyle || {
            fontSize: theme.fontSize,
            color: theme.fontColor,
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  titleLayout: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 40,
    right: 40,
    top: 0,
    bottom: 0,
  },
  title: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  button: {
    color: '#FFFFFF',
    paddingRight: 15,
    fontSize: 16,
  },
  buttonStyle: {
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    flex: 1,
    minHeight: 45,
    minWidth: 100,
  },
});
