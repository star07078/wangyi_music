// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    history: ['风中有朵雨做的云','萍聚','爱你'],
    // history: new Set([]),
    hot: [],
    searchList: [],
    obj: {}
  },

  bindKeyInput(e){
    var {value} = e.detail;
    this.setData({
      value
    })
    wx.request({
      url: 'http://lishaokai.cn:3000/search?keywords=' + value,
      success: res => {
        var searchList = res.data.result.songs;
        this.setData({
          searchList
        })
      }
    })
  },

  clear(){
    this.setData({
      history: []
    })
    wx.setStorage({
      key: 'history',
      data: []
    })
  },

  clearValue(){
    this.setData({
      value: ''
    })
  },

  tolyrics(e){
    var {id, imgsrc, title} = e.currentTarget.dataset;
    var arr = this.data.history;
    var sure = arr.some(item=>{
      return item == title;
    })
    if(!sure){
      arr.push(title);
      this.setData({
        history: arr
      })
    }
    this.setData({
      value: ''
    })
    wx.navigateTo({
      url: '/pages/lyrics/lyrics',
      success: res=>{
        res.eventChannel.emit('fn', id, imgsrc, title)
      }
    })
  },

  onHide(){
    wx.setStorage({
      key: 'history',
      data: this.data.history
    })
  },

  changValue(e){
    var value = e.currentTarget.dataset.value;
    this.setData({
      value
    })
    wx.request({
      url: 'http://lishaokai.cn:3000/search?keywords=' + value,
      success: res => {
        var searchList = res.data.result.songs;
        this.setData({
          searchList
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'history',
      success: res=>{
        // var history = 
        console.log(res)
        this.setData({
          history: res.data
        })
      },
    })
    wx.request({
      url: 'http://lishaokai.cn:3000/search/hot/detail',
      success: res=>{
        this.setData({
          hot: res.data.data
        })
      }
    })
  }

})