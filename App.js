/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, } from 'react-native';
import RefreshListView, { RefreshState } from './src/RefreshListView';
import Cell from './Cell'
import testData from './data'

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      dataList: [],
      refreshState: RefreshState.Idle,
    }
  }

  componentDidMount() {
    this.onHeaderRefresh()
  }

  _onHeaderRefresh = () => {
    this.setState({ 
      refreshState: RefreshState.HeaderRefreshing 
    })

    // 模拟网络请求
    setTimeout(() => {
      // 模拟网络加载失败的情况
      if (Math.random() < 0.3) {
        this.setState({ refreshState: RefreshState.Failure })
        return
      }

      //获取测试数据
      const dataList = this._getTestList(true)

      this.setState({
        dataList: dataList,
        refreshState: dataList.length < 1 ? RefreshState.EmptyData : RefreshState.Idle,
      })
    }, 2000)
  }

  _onFooterRefresh = () => {
    this.setState({ 
      refreshState: RefreshState.FooterRefreshing 
    })

    // 模拟网络请求
    setTimeout(() => {
      // 模拟网络加载失败的情况
      if (Math.random() < 0.2) {
        this.setState({ refreshState: RefreshState.Failure })
        return
      }

      //获取测试数据
      const dataList = this._getTestList(false)

      this.setState({
        dataList: dataList,
        refreshState: dataList.length > 50 ? RefreshState.NoMoreData : RefreshState.Idle,
      })
    }, 2000)
  }



  _getTestList(isReload){
    const newList = testData.map((data) => {
      return {
        imageUrl: data.squareimgurl,
        title: data.mname,
        subtitle: `[${data.range}]${data.title}`,
        price: data.price,
      }
    })
    return isReload ? (Math.random() < 0.2 ? [] : newList) : [...this.state.dataList, ...newList]
  }
  render() {
    const {dataList, refreshState} = this.state;
    return (
      <View style={styles.container}>
        <RefreshListView
            data={dataList}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            refreshState={refreshState}
            onHeaderRefresh={this._onHeaderRefresh}
            onFooterRefresh={this._onFooterRefresh}

            // 可选
            // footerRefreshingText='玩命加载中 >.<'
            // footerFailureText='我擦嘞，居然失败了 =.=!'
            // footerNoMoreDataText='-我是有底线的-'
            // footerEmptyDataText='-好像什么东西都没有-'
          />
      </View>
    );
  }

  _renderItem=(info)=>(<Cell info={info.item} />)

  _keyExtractor = (item, index) => {
    return index
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS == 'ios' ? 20 : 0,
  },
  title: {
    fontSize: 18,
    height: 84,
    textAlign: 'center'
  }
});
