// pages/home/index.js
import {getBanners,getSongMenu} from "../../service/api-music"
import {queryRect} from "../../utils/query-rect"
import {rankingStore,rankingMap,playStore} from "../../store/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    swiperHeight: 0,
    recommendSongs: [],
    hotSongMenu: [],
    recommendMenu: [],
    ranking: {0: {},2: {},3: {}},
    currentSong: {},
    isPlaying: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    playStore.dispatch("playMusicWithSongIdAction",{id: 1842025914})
    this.getPageData()
    //下面请求其他的歌曲数据
    rankingStore.dispatch("getRankingAction")
    rankingStore.onState("hotRanking",res => {
      if(!res.tracks) return;
      const recommendSongs = res.tracks.slice(0,6)
      this.setData({
        recommendSongs
      })
    })
    //监听其他排行数据
    rankingStore.onState("newRanking",this.handleRankingChange(0))
    rankingStore.onState("originRanking",this.handleRankingChange(2))
    rankingStore.onState("upRanking",this.handleRankingChange(3))
    playStore.onStates(["currentSong","isPlaying"],({currentSong,isPlaying}) => {
      if(currentSong) {
        this.setData({currentSong})
      }
      if(isPlaying !== undefined) {
        this.setData({
          isPlaying
        })
      }
    })
  },
  handleSearch() {
    wx.navigateTo({
      url: "/pages/detail-search/index"
    })
  },
  getPageData() {
    getBanners().then(res => {
      this.setData({
        banners: res.banners
      })
    })
    //获取歌单
    getSongMenu().then(res => {
      this.setData({
        hotSongMenu: res.playlists
      })
    })
    getSongMenu("华语").then(res => {
      this.setData({
        recommendMenu: res.playlists
      })
    })
  },
  handleImageLoad() {
    //这是获取某个元素的高度以及其他位置信息
    queryRect('.image').then(res => {
      this.setData({
        swiperHeight: res[0].height
      })
    })
  },
  //返回一个函数
  handleRankingChange(idx) {
    return res => {
      if(Object.keys(res).length === 0) return
      const name = res.name
      const coverImgUrl = res.coverImgUrl
      const playCount = res.playCount
      const songs = res.tracks.slice(0,3)
      const newRanking = {...this.data.ranking,[idx]: {name,coverImgUrl,playCount,songs}}
      this.setData({
        ranking: newRanking
      })
    }
  },
  handleTapMore: function() {
    wx.navigateTo({
      url: "/pages/detail-song/index?rankingName=hotRanking&type=ranking"
    })
  },
  //处理排行榜跳转的逻辑
  handleRankingNavigate: function(event) {
    const idx = event.currentTarget.dataset.idx
    const rankingName = rankingMap[idx]
    wx.navigateTo({
      url: `/pages/detail-song/index?rankingName=${rankingName}&type=ranking`
    })
  },
  handlePlaySongs: function(event) {
    const index = event.currentTarget.dataset.index
    //下面开始修改playStore里面保存的歌曲列表和索引
    playStore.setState("currentSongIndex",index)
    playStore.setState("playSongsList",this.data.recommendSongs)
  },
  handlePlay: function() {
    playStore.dispatch("playMusicAction",!this.data.isPlaying)
  },
  handleNavigate: function() {
    wx.navigateTo({
      url: '/pages/song-player/index',
    })
  }
})