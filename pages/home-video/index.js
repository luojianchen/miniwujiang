// pages/home-video/index.js
import {getTopMVs} from "../../service/api-video"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topMVs: [],
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    this.getTopMVData(0)
  },
  //定义一个请求数据的方法
  getTopMVData: async function (offset) {
    //当hasMore为false时并且offset不为0时就不再请求数据
    if(!this.data.hasMore && offset !== 0) return
    wx.showNavigationBarLoading()
    //下面开始请求数据
    //一种是添加数据一种是覆盖原来的数据
    //添加请求数据的动画
    const res = await getTopMVs(offset)
    wx.hideNavigationBarLoading()
    let newTopMVs = this.data.topMVs
    if(offset === 0) {
      //因为只有第一次请求时才需要取消下拉刷新的动画
      wx.stopPullDownRefresh()
      newTopMVs = res.data
    } else {
      newTopMVs = newTopMVs.concat(res.data)
    }
    this.setData({
      topMVs: newTopMVs,
      hasMore: res.hasMore
    })
  },
  onReachBottom: function (options) {
    this.getTopMVData(this.data.topMVs.length)
  },
  onPullDownRefresh: function(options) {
    this.getTopMVData(0)
  },
  handleVideoItem: function(event) {
    const id = event.currentTarget.dataset.item.id
    wx.navigateTo({
      url: `/pages/detail-video/index?id=${id}`
    })
  }
})