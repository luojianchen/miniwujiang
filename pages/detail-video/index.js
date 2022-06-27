// pages/detail-video/index.js
import {getMVURL,getMVDetail,getRelatedVideos} from "../../service/api-video"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvURLInfo: {},
    mvDetail: {},
    relatedVidoes: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id
    this.getPageData(id)
  },
  getPageData(id) {
    //请求页面需要的数据
    getMVURL(id).then(res => {
      this.setData({
        mvURLInfo: res.data
      })
    })
    getMVDetail(id).then(res => {
      this.setData({
        mvDetail: res.data
      })
    }) 
    getRelatedVideos(id).then(res => {
      this.setData({
        relatedVideos: res.data
      })
    })
  }
 
})