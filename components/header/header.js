var app = getApp();
Component({
  data: {
    header: {}
  },
  lifetimes: {
    attached(){
      this.setData({
        header: app.globalData.header
      })
    }
  },
  properties:{
    opacity: String,
    bg: String
  },
  methods: {
    backTo(){
      wx.navigateBack()
    }
  }
})