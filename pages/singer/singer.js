// pages/singerList/singerList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    show: []
  },

  toHot(e){
    var { id, imgsrc } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/hot/hot',
      success: res => {
        res.eventChannel.emit('fn', id, 'singer', imgsrc)
      }
    })
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载...',
      mask: true
    })
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('fn', data => {
      this.setData({
        list: data.allList
      })
      wx.hideLoading()
    })
  },
  imgLoad(e){
    var n = e.currentTarget.dataset.num;
    var a = 'show[' + n + ']'
    this.setData({
      [a]: true
    })
  }
})