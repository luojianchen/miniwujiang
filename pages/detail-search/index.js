// pages/detail-search/index.js
import {getHotSearch,getSearchSuggest,getResultSongs} from "../../service/api-search"
import {stringToNodes} from "../../utils/string2nodes"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotSearch: [],
    searchKeywords: "",
    suggestSongs: [],
    suggestSongsNodes: [],
    resultSongs: [],
    historySearch: wx.getStorageSync('historySearch') || []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData()
  },
  getPageData: function() {
    getHotSearch().then(res => {
      this.setData({
        hotSearch: res.result.hots
      })
    })
  },
  handleSearchChange: function(event) {
    const keywords = event.detail
    this.setData({
      searchKeywords: keywords 
    })
    if(!keywords) {
      this.setData({
        suggestSongs: [],
        resultSongs: []
      })
      return
    }
    getSearchSuggest(keywords).then(res => {
      this.setData({
        suggestSongs: res.result.allMatch
      })
      const keywordsList = res.result.allMatch.map(item => item.keyword)
      const suggestSongsNodes = []
      for(const keyword of keywordsList) {
        const nodes = stringToNodes(keywords,keyword)
        suggestSongsNodes.push(nodes)
      }
      this.setData({
        suggestSongsNodes
      })
    })
  },
  handleSearchResult: function() {
    //这是直接点击搜索的情况
    const keywords = this.data.searchKeywords
    if(!keywords) return
    const historySearch = wx.getStorageSync('historySearch')
    if(historySearch) {
      const index = historySearch.indexOf(keywords)
      if(index === -1) {
        //当没有搜索过时
        historySearch.unshift(keywords)
        wx.setStorageSync('historySearch', historySearch)
      } else {
        historySearch.splice(index,1)
        historySearch.unshift(keywords)
        wx.setStorageSync('historySearch', historySearch)
      }
      this.setData({
        historySearch
      })
    } else {
      wx.setStorageSync('historySearch', [keywords])
    }
    getResultSongs(keywords).then(res => {
      this.setData({
        resultSongs: res.result.songs
      })
    })
  },
  //下面是点击某个搜索建议的情况
  handleSuggestClick: function(event) {
    const keywords = event.currentTarget.dataset.keywords
    this.setData({
      searchKeywords: keywords
    })
    this.handleSearchResult()
  }
})