// pages/musicList/musicList.js
var app = getApp().globalData;
var a = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    opacity: 0,
    screenHeight: 0,
    list: {},
    items: [],
    n: 10,
    // id: -1,
    id: -1,
    isPlay: 0,
    nowPlay: false,
  },

  playAll() {
    if (!app.playSong) {
      app.playSong = wx.getBackgroundAudioManager();
    }
    var id = app.playSongList[app.playSongIndex].id;
    app.playSong.src = 'https://music.163.com/song/media/outer/url?id=' + id;
    app.playSong.title = app.playSongList[app.playSongIndex].name
    app.playSong.play();
    app.playSongId = id;
    this.setData({
      id
    })
  },

  onShow() {
    this.setData({
      id: app.playSongId
    })
    if (app.playSong) {
      var pause = app.playSong.paused;
      console.log(123,pause)
      this.setData({ nowPlay: !pause })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: app.playSongId
    })
    const eventChannel = this.getOpenerEventChannel()
    var screenHeight = Math.floor(app.header.screenHeight * 0.4);
    eventChannel.on('fn', data => {
      this.setData({
        screenHeight,
        list: data,
        items: data.allList.slice(0,10)
      })
    })
  },

  bottomfn(){
    var arr = this.data.list.allList;
    if(this.data.n >= arr.length){
      return
    }else{
      var n = this.data.n + 10;
      var items = arr.slice(0, n)
      this.setData({
        n,
        items
      })
    }
  },
  
  pagescroll(e){
    var o = e.detail.scrollTop / this.data.screenHeight;
    if(o > 1){
      o = 1;
      return;
    }
    this.setData({
      opacity: o
    })
  },

  tolyrics(e) {
    var { id, imgsrc, title, index } = e.currentTarget.dataset;
    if (!app.annal[id]) {
      app.annal[id] = this.data.items[index]
    }
    wx.navigateTo({
      url: '/pages/lyrics/lyrics',
      success: res => {
        res.eventChannel.emit('fn', id, imgsrc, title)
      }
    })
  },

  playSong(e){
    var {id, title, index} = e.currentTarget.dataset;

    if (!app.annal[id]) {
      app.annal[id] = this.data.items[index]
    }

    if (id == app.playSongId) {
      var paused = app.playSong.paused;
      if (!this.data.isPlay) {
        paused = false;
        this.setData({ isPlay: 1 })
      }
      if (paused) {
        app.playSong.play();
        this.setData({ isPlay: 0, id })
      } else {
        app.playSong.pause();
        this.setData({ id: -1 })
      }
      return
    }

    app.playSongId = id;
    this.setData({
      id,
      isPlay: 0,
      nowPlay: true
    })
    if (!app.playSong) {
      app.playSong = wx.getBackgroundAudioManager();
    }
    app.playSong.src = 'https://music.163.com/song/media/outer/url?id=' + id;
    app.playSong.title = title
    app.playSong.play()
  }
})