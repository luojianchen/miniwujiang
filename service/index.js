const BASE_URL = "http://123.207.32.32:9001"
const LOGIN_BASE_URL = "http://localhost:3000"
const token = wx.getStorageSync('token')
class JCRequest {
  constructor(baseUrl,authHeader = {}) {
    this.baseUrl = baseUrl
    //这里给一个默认值是为了可以不传
    this.authHeader = authHeader
  }
  request(url,method,params,isAuth = false,header = {}) {
    const finalHeader = isAuth ? {...this.authHeader,...header} : header
    return new Promise((reslove,reject) => {
      wx.request({
        url: this.baseUrl + url,
        method,
        header: finalHeader,
        data: params,
        success: function(res) {
          reslove(res.data)
        },
        fail: reject
      })
    })
  }
  //下面两个方法不给默认值是因为本质上是调用了request这个方法,request这个方法里面已经给了默认值了
  get(url,params,isAuth,header) {
    return this.request(url,"GET",params,isAuth,header)
  }
  post(url,params,isAuth,header){
    return this.request(url,"POST",params,isAuth,header)
  }
}
const jcRequest = new JCRequest(BASE_URL)
const jcLoginRequst = new JCRequest(LOGIN_BASE_URL,{token})

export default jcRequest

export {
  jcLoginRequst
}