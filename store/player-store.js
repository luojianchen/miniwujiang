import {HYEventStore} from "hy-event-store"
import {getSongDetail,getLyricsString} from "../service/api-player"
import {parseLyric} from "../utils/parse-lyric"
const audioContext = wx.getBackgroundAudioManager()
//因为用的是同一个播放器,所以给播放器添加的监听不需要每一次播放新的歌曲时都添加,只需要在第一次播放歌曲时添加监听
const playStore = new HYEventStore({
  state: {
    isFirstPlay: true,
    id: "",
    currentSong: {},
    durationTime: 0,
    lyricInfos: [],
    currentTime: 0,
    currentLyricIndex: 0,
    currentLyricText: "",
    playModeIndex: 0,
    isPlaying: false,
    playSongsList: [],
    currentSongIndex: 0,
    //用一个变量记录是否是停止播放歌曲再重新播放的
    isStoping: false
  },
  actions: {
    playMusicWithSongIdAction(ctx,{id,refresh=false}) {
      //触发这个action时歌曲已经开始播放了
      //所以此时可以修改isPlaying的值
      ctx.isPlaying = true
      if(ctx.id === id && !refresh) {
        //如果是同一首时继续原来的播放如果原来处于暂停状态时继续播放
        this.dispatch("playMusicAction")
        return
      }
      //先判断再赋值,不能一开始就赋值,这样就没法进行判断了
      ctx.id = id
      //歌曲不一样是重置所有内容
      ctx.currentSong= {}
      ctx.durationTime= 0
      ctx.lyricInfos= []
      ctx.currentTime= 0
      ctx.currentLyricIndex= 0
      ctx.currentLyricText= ""
      //分别获得歌曲信息和歌词信息
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
        audioContext.title = res.songs[0].name 
      })
      getLyricsString(id).then(res => {
        const lyricString = res.lrc.lyric;
        const lyricInfos = parseLyric(lyricString)
        ctx.lyricInfos = lyricInfos
      })
      //控制播放
      //点击歌曲就开始播放
    //进入页面时先暂停上一次歌曲的播放
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    //因为请求歌曲信息是异步的,所以在一开始就给一个默认值
    audioContext.titlt = id
    if(ctx.isFirstPlay) {
      this.dispatch("setupAudioContextListernerAction")
      ctx.isFirstPlay = false
    }
    },
    setupAudioContextListernerAction(ctx) {
      //给播放器添加三个监听
      audioContext.onCanplay(() => {
        audioContext.play();
      })
      audioContext.onTimeUpdate(() => {
        //先改变当前时间
        //再改变slider的位置
        const currentTime = audioContext.currentTime * 1000
        //这是歌曲播放时去控制时间和滑块,当手动移动滑块时停止歌曲播放时对时间和滑块的控制
        ctx.currentTime = currentTime
        //控制歌词的切换
        //避免嵌套层级太多可以把i提出来
        let i = 0
        for(; i< ctx.lyricInfos.length; i++) {
          const currentLyricInfo = ctx.lyricInfos[i]
          if(currentTime < currentLyricInfo.time) {
            //超过时间就跳出循环
            break
          }
        }
        const index = i - 1
        if(ctx.currentLyricIndex !== index) {
          ctx.currentLyricIndex = index
          ctx.currentLyricText = ctx.lyricInfos[index].text
        }
      })
      audioContext.onEnded(() => {
        this.dispatch("changeSongAction",{isNext: true})
      })
      audioContext.onPlay(() => {
        ctx.isPlaying = true
      })
      audioContext.onPause(() => {
        ctx.isPlaying = false
      })
      audioContext.onStop(() => {
        //这是在锁屏状态下停止歌曲播放会回调的函数
        //但是重新点击开始播放时原来的audioContext中的src和title等等的一些信息都会被取消掉
        ctx.isStoping =  true
      })
    },
    //写一个点击播放按钮控制播放状态并且控制歌曲播放的action
    playMusicAction(ctx,isPlaying = true) {
      ctx.isPlaying = isPlaying
      if(isPLaying && isStoping) {
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
        audioContext.title = ctx.currentSong.name
        //设置播放的时间
        audioContext.startTime = ctx.currentTime / 1000
      }
      ctx.isPlaying ? audioContext.play() : audioContext.pause()
    },
    changeSongAction(ctx,{isNext = true}) {
      //这是处理切换歌曲的逻辑
      let index = ctx.currentSongIndex
      const mode = ctx.playModeIndex
      switch(mode) {
        case 0: 
          if(isNext) {
            index = index + 1
            if(index === ctx.playSongsList.length) index = 0
          } else {
            index = index - 1
            if(index === -1) index = ctx.playSongsList.length
          }
          break
        case 1: 
          break
        case 2: 
          while(index === ctx.currentSongIndex) {
            index = Math.floor(Math.random() * ctx.playSongsList.length)
          }
      }
      const currentSong = ctx.playSongsList[index]
      if(currentSong) {
        ctx.currentSong = currentSong
        ctx.currentSongIndex = index
        this.dispatch("playMusicWithSongIdAction",{id: currentSong.id,refresh: true})
        //如果是单曲循环模式时这个action里面不会对歌曲进行重新播放
      } 
    }
  }
})
export {
  audioContext,
  playStore
}