import {jcLoginRequst} from "../service/index"

export function handleLogin () {
  return new Promise((resolve,reject) => {
    wx.login({
      timeout: 1000,
      success: resolve,
      reject
    })
  })
}
export function getToken (code) {
  return jcLoginRequst.post("/login",{code})
} 
export function checkToken() {
  return jcLoginRequst.post("/auth",{},true)
}

export function checkSessionkey() {
  return new Promise((resolve) => {
    wx.checkSession({
      success: (res) => {
        resolve(true)
      },
      fail: (err) => {
        resolve(false)
      }
    })
  })
}

export function getUserInfoByProfile() {
  return new Promise((resolve,reject) => {
    //这个api必须是在出发了什么事件才能被调用
    wx.getUserProfile({
      desc: '你好啊',
      success: resolve,
      fail: reject
    })
  })
}