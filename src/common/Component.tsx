import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, PixelRatio, Image, useWindowDimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NavigationUtil from '../navigator/NavigationUtil';
import _ from 'lodash';

const Px2dp = (px) => PixelRatio.roundToNearestPixel(px);

/**
 * 顶部导航
 * @param props
 * @returns
 */
export const NavBar = (props: any) => {
  const { title, rightTitle, onRightClick, navigation } = props;
  const goBack = () => {
    NavigationUtil.goBack(navigation);
  };
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  return (
    <View style={[{ backgroundColor: theme.primary }, styles.navBar]}>
      {_.has(props, 'navigation') ? (
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

/**
 * 自定义按钮
 * @param props
 * @param type
 * @returns
 */
export const CustomButton = (props: any) => {
  const { title, onClick, buttonStyle, fontStyle, type = 'primary' } = props;
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  return (
    <TouchableOpacity
      onPress={onClick}
      style={{
        backgroundColor: theme[type],
        borderColor: theme.borderColor,
        ...styles.buttonStyle,
        ...buttonStyle,
      }}
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

/**
 * 进度条
 * @param props
 * @returns
 */
export const LineProgress = (props: any) => {
  const { value } = props;
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  return (
    <View style={{ flex: 1, backgroundColor: theme.primary, paddingLeft: 1 }}>
      <View style={[styles.pre, { borderColor: theme.primary }]}>
        <View style={[styles.preOisn, { width: Px2dp(213) * (value / 100), backgroundColor: theme.primary }]} />
        <View style={[styles.preMain, { justifyContent: 'flex-end' }]}>
          <Text style={{ color: theme.fontColor, fontSize: Px2dp(14) }}>{value}%</Text>
        </View>
      </View>
    </View>
  );
};

/**
 * 菜单宫格
 * @param props
 * @returns
 */
export const MenuGrid = (props: any) => {
  const { menus = [], segmentation = 3 } = props;
  const windowWidth = useWindowDimensions().width - 20;
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 10, backgroundColor: '#F3F3F3' }}>
      {menus.map((item) => (
        <TouchableOpacity
          key={item.text}
          style={{
            width: windowWidth / segmentation,
            height: 80,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={item?.func}
        >
          <Image source={item?.icon} style={{ width: 25, height: 25 }} />
          <Text style={{ fontSize: 16 }}>{item?.text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export const SwiperImage = (props: any) => {
  const { images, width, height, showPagination = true, autoplayDelay = 5, resizeMode = 'contain' } = props;
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  return (
    <View>
      {images?.length > 0 ? (
        <SwiperFlatList
          autoplay
          autoplayDelay={autoplayDelay}
          autoplayLoop
          index={0}
          showPagination={showPagination}
          data={images}
          renderItem={({ item }) => (
            <Image
              resizeMode={resizeMode}
              source={item}
              style={{ width: width ?? windowWidth, height: height ?? windowHeight / 4 }}
            />
          )}
        />
      ) : (
        <Text
          style={{
            width: width ?? windowWidth - 10,
            height: height ?? windowHeight / 4,
            backgroundColor: '#FFFFFF',
            borderColor: theme.borderColor,
            borderWidth: 1,
            textAlign: 'center',
            fontSize: 28,
            lineHeight: height ?? windowHeight / 4,
            margin: 5,
          }}
        >
          暂无图片
        </Text>
      )}
    </View>
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
    justifyContent: 'center',
    borderWidth: 1,
    flex: 1,
    minHeight: 45,
    minWidth: 100,
  },
  pre: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    width: Px2dp(213),
    height: Px2dp(20),
    borderRadius: Px2dp(20),
    paddingLeft: Px2dp(10),
    paddingRight: Px2dp(10),
    marginBottom: Px2dp(10),
    marginTop: Px2dp(10),
    position: 'relative',
    overflow: 'hidden',
  },
  preMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: Px2dp(20),
    position: 'relative',
    flex: 1,
    zIndex: 9,
  },
  preOisn: {
    position: 'absolute',
    height: Px2dp(20),
    borderBottomLeftRadius: Px2dp(2000),
    borderTopLeftRadius: Px2dp(2000),
    zIndex: 8,
  },
});
