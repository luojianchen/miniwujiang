// app.js
import {handleLogin,getToken,checkToken,checkSessionkey} from "./utils/api_login"
App({
  globalData: {
      screenWidth: 0,
      screenHeight: 0,
      statusBarHeight: 0,
      navBarHeight: 44,
      deviceRadio: 0
  },
  onLaunch() {
    const info = wx.getSystemInfoSync();
    this.globalData.screenWidth = info.screenWidth;
    this.globalData.screenHeight = info.screenHeight;
    this.globalData.deviceRadio = this.globalData.screenHeight / this.globalData.screenWidth
    this.handleLogin()
  },
  async handleLogin() {
    //下面是登录的逻辑
    const token = wx.getStorageSync('token')
    //当token不存在或者token过期或者session_key过期
    const res = await checkToken()
    console.log(res)
    const errorCode = res.errorCoder
    const checkSessionResult = await checkSessionkey()
    if(!token || errorCode || !checkSessionResult) {
      this.userLogin()
    }
  },
  userLogin: async function() {
    const res = await handleLogin()
    const code = res.code
    const res1 = await getToken(code)
    const token = res1.token
    // 保存token
    wx.setStorageSync('token', token)
  },
})
