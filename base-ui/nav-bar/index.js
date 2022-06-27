// base-ui/nav-bar/index.js
const globalData = getApp().globalData
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true
  },
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    navBarHeight: globalData.navBarHeight
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleBack: function() {
      this.triggerEvent("click")
    }
  },
  lifetimes: {
    
  }
})
