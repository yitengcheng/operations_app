import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PixelRatio,
  Image,
  useWindowDimensions,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
} from 'react-native';
import { useSelector } from 'react-redux';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import NavigationUtil from '../navigator/NavigationUtil';
import _ from 'lodash';
import { get, post } from '../HiNet';

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
          <Image
            source={require('../assets/image/back.png')}
            style={{ marginLeft: 10, width: 15, height: 15 }}
            resizeMode="contain"
          />
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
  const { title, onClick, buttonStyle, fontStyle, type = 'primary', source } = props;
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
      {source && <Image source={source} style={{ width: 15, height: 15, marginRight: 5 }} />}
      <Text
        style={{
          fontSize: theme.fontSize,
          color: theme.fontColor,
          ...fontStyle,
        }}
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
          <Image source={item?.icon} style={{ width: 25, height: 25, margin: 5 }} />
          <Text style={{ fontSize: 16 }}>{item?.text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

/**
 * 轮播图
 * @param props
 * @returns
 */
export const SwiperImage = (props: any) => {
  const { images, width, height, showPagination = true, autoplayDelay = 5, resizeMode = 'contain' } = props;
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  return (
    <View style={{ borderWidth: 1, borderColor: theme.borderColor }}>
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

/**
 * 列表组件
 * @param props
 * @returns
 */
const List = (props: any, ref: any) => {
  const { url, renderItem, params = {}, keyId } = props;
  const [data, setData] = useState([]);
  const [noMore, setNoMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNo, setpageNo] = useState(1);
  const [total, setTotal] = useState(0);
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  const listRef = useRef();
  useImperativeHandle(ref, () => ({
    refresh: () => {
      refresh();
    },
  }));
  const refresh = () => {
    setpageNo(1);
    setNoMore(false);
    getData(pageNo);
  };
  useEffect(() => {
    setpageNo(1);
    setNoMore(false);
    getData(pageNo);
  }, []);
  const getData = (pageNo: number) => {
    post(url)({ pageNum: pageNo, pageSize: 10, ...params })()
      .then((res) => {
        setIsLoading(false);
        if (res.total === 0) {
          setData([]);
          return;
        }
        setTotal(res.total);
        if (pageNo === 1) {
          setData(_.uniqBy([...res.list], keyId ?? '_id'));
        } else {
          setData(_.uniqBy([...res.list, ...data], keyId ?? '_id'));
        }
        setpageNo(pageNo + 1);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };
  useEffect(() => {
    if (data.length === total) {
      setNoMore(true);
    }
  }, [data]);
  const getIndicator = () => {
    return (
      <View style={{ alignItems: 'center' }}>
        {noMore ? (
          <Text>没有更多了</Text>
        ) : (
          <View>
            <ActivityIndicator color={theme.primary} style={{ margin: 10, color: theme.backgroundColor }} animating />
            <Text>正在加载更多</Text>
          </View>
        )}
      </View>
    );
  };
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={listRef}
        data={data}
        renderItem={(data) => renderItem(data.item)}
        keyExtractor={(item, index) => {
          return item?.id ?? index;
        }}
        onEndReached={() => {
          data.length !== total && getData(pageNo);
        }}
        refreshControl={
          <RefreshControl
            title="Loading"
            titleColor={theme.fontColor}
            colors={[theme.primary]}
            refreshing={isLoading}
            onRefresh={() => {
              setpageNo(1);
              getData(pageNo);
            }}
            tintColor={theme.primary}
          />
        }
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', backgroundColor: theme.backgroundColor }}>
            <Image
              source={require('../assets/image/empty_data.png')}
              style={{ width: windowWidth / 2, height: windowHeight / 4 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 20, color: theme.fontColor }}>暂无数据</Text>
          </View>
        )}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => data?.length > 0 && getIndicator()}
      />
    </View>
  );
};
export const ListData = forwardRef(List);

/**
 * 自定义弹窗
 * @param props
 * @returns
 */
export const Popup = (props: any) => {
  const { modalVisible, onClose, children, title, type = 'bottom' } = props;
  const theme = useSelector((state) => {
    return state.theme.theme;
  });
  let posit = 'flex-end';
  if (type === 'top') {
    posit = 'flex-start';
  } else if (type === 'center') {
    posit = 'center';
  }
  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => {
        onClose && onClose();
      }}
      transparent
    >
      <View style={{ flex: 1, justifyContent: posit, backgroundColor: 'rgba(0, 0, 0, 0.65)' }}>
        <View style={{ backgroundColor: theme.backgroundColor }}>
          <View
            style={{
              flexDirection: 'row',
              padding: 8,
              borderBottomWidth: 1,
              borderColor: theme.borderColor,
            }}
          >
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text>{title}</Text>
            </View>
            <TouchableOpacity onPress={() => onClose && onClose()}>
              <Image source={require('../assets/image/close.png')} style={{ width: 15, height: 15 }} />
            </TouchableOpacity>
          </View>
          {children}
        </View>
      </View>
    </Modal>
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
    flexDirection: 'row',
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
