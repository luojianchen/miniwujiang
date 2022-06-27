// pages/detail-song/index.js
import {rankingStore,playStore} from "../../store/index"
import {getSongMenuDetail} from "../../service/api-music"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: "",
    rankingName: "",
    songsInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const type = options.type
    this.setData({
      type
    })
    if(type === "menu") {
      //重新请求数据
      const id = options.id
      getSongMenuDetail(id).then(res => {
        this.setData({
          songsInfo: res.playlist
        })
      })
    } else if(type === "ranking") {
      const rankingName = options.rankingName
      this.setData({
        rankingName
      })
      rankingStore.onState(rankingName,this.handleRanking)
    }
    
    
  },
  onUnload: function () {
    if(this.data.type === "ranking") {
      rankingStore.offState("",this.handleRanking)
    }
  },
  handleRanking: function(res) {
    this.setData({
      songsInfo: res
    })
  },
  handleSong: function(event) {
    const index = event.currentTarget.dataset.index
    playStore.setState("playSongsList",this.data.songsInfo.tracks)
    playStore.setState("currentSongIndex",index)
  }
})