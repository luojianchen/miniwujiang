// pages/song-player/index.js
import {audioContext} from "../../store/index"
import {playStore} from "../../store/index"
const globalData = getApp().globalData
const playModeNames = ["order","repeat","random"];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentSong: {},
    lyricInfos: [],
    currentLyricText: "",
    currentLyricIndex: 0,
    scrollTop: 0,
    statusBarHeight: globalData.statusBarHeight,
    currentPage: 0,
    contentHeight: 0,
    isMusicLyric: true,
    durationTime: 0,
    currentTime: 0,
    //记录滑块移动的位置
    sliderValue: 0,
    //需要一个变量去记录是否在滑动,因为歌曲播放会和滑块滑动同时修改当前播放的事件和滑块进度展示
    isSliderChanging: false,
    playModeIndex: 0,
    playModeName: "order",
    isPlaying: false,
    playName: "resume"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id
    this.handleSong()
    //下面计算两个切换页面的高度
    const screenHeight = globalData.screenHeight;
    const statusBarHeight = globalData.statusBarHeight;
    const navBarHeight = globalData.navBarHeight;
    const contentHeight = screenHeight - statusBarHeight - navBarHeight;
    const deviceRadio = globalData.deviceRadio
    this.setData({
      contentHeight,
      isMusicLyric: deviceRadio >= 2
    })
    //生命周期里面只会执行一次,必须放在事件监听里面
  },
  handleSong: function() {
    playStore.onStates(["currentSong","durationTime","lyricInfos"],({currentSong,durationTime,lyricInfos}) => {
      if(currentSong) this.setData({currentSong})
      if(durationTime) this.setData({durationTime})
      if(lyricInfos) this.setData({lyricInfos})
    })
    playStore.onStates(["currentTime","currentLyricIndex","currentLyricText"],({currentTime,currentLyricIndex,currentLyricText}) => {
      if(currentTime && !this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({
          currentTime,
          sliderValue
        })
      }
      if(currentLyricIndex) {
        this.setData({
          currentLyricIndex,
          scrollTop: currentLyricIndex * 35
        })
      } 
      if(currentLyricText) {
        this.setData({
          currentLyricText
        })
      }
    })
    playStore.onStates(["playModeIndex","isPlaying"],({playModeIndex,isPlaying}) => {
      if(playModeIndex !== undefined) {
        this.setData({
          playModeIndex,
          playModeName: playModeNames[playModeIndex]
        })
      }
      if(isPlaying !== undefined) {
        this.setData({
          isPlaying,
          playName: isPlaying ? "pause" : "resume"
        })
      }
    })
  },
  handleChange: function(event) {
    this.setData({
      currentPage: event.detail.current
    })
  },
  handleSliderChanging: function(event) {
    //滑块移动的时候会出发的事件
    this.setData({
      isSliderChanging: true
    })
    const value = event.detail.value
    const currentTime = this.data.durationTime * value / 100
    this.setData({
      currentTime
    })
  },
  //拖动进度条时分两种情况
  handleSliderChange: function(event) {
    //滑块停止的时候会触发的事件
    const value = event.detail.value
    //先暂停歌曲的播放
    //这个会导致播放按钮在拖动的时出现图标的切换
    // audioContext.pause()
    const currentTime = this.data.durationTime * value / 100
    audioContext.seek(currentTime / 1000)
    this.setData({
      sliderValue: value,
      currentTime,
      isSliderChanging: false
    })
    playStore.setState("isPlaying",true)
  },
  handleBack: function() {
    wx.navigateBack()
  },
  changeMode: function() {
    //修改store中保存的值
    let playModeIndex = this.data.playModeIndex + 1
    if(playModeIndex === 3) playModeIndex = 0
    playStore.setState("playModeIndex",playModeIndex)
  },
  changePlay: function() {
    playStore.dispatch("playMusicAction",!this.data.isPlaying)
  },
  handlePreSong: function() {
    playStore.dispatch("changeSongAction",{isNext: false})
  },
  handleNextSong: function() {
    playStore.dispatch("changeSongAction",{isNext: true})
  }
})