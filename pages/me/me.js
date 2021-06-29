// pages/me/me.js
var app = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj: [],
    id: ''
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
      obj: Object.values(app.annal),
      id: app.playSongId
    })

  },

  onShow() {
    this.setData({
      obj: Object.values(app.annal),
      id: app.playSongId
    })
    app.playSongList = this.data.obj;
    app.playSongIndex = 0;
  },

  tolyrics(e) {
    var { id, imgsrc, title } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/lyrics/lyrics',
      success: res => {
        res.eventChannel.emit('fn', id, imgsrc, title)
      }
    })
  },

  playSong(e) {
    var { id, title } = e.currentTarget.dataset;

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
      isPlay: 0
    })
    if (!app.playSong) {
      app.playSong = wx.getBackgroundAudioManager();
    }
    app.playSong.src = 'https://music.163.com/song/media/outer/url?id=' + id;
    app.playSong.title = title
    app.playSong.play()
  }
})
