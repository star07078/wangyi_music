// pages/hot/hot.js
var app = getApp().globalData;
Page({

  data: {
    imgsrc: '',
    msg: '',
    title: '',
    allList: [],
    list: [],
    n: 10,
    id: -1,
    isPlay: 0
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

  showToast(){
    wx.showModal({
      content: this.data.msg,
      showCancel: false
    })
  },

  bottomfn() {
    var arr = this.data.allList;
    if (this.data.n >= arr.length) {
      return
    } else {
      var n = this.data.n + 10;
      var list = arr.slice(0, n)
      this.setData({
        n,
        list
      })
    }
  },

  onShow() {
    this.setData({
      id: app.playSongId
    })
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载数据',
    })
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('fn', (id,type,imgsrc) => {
      this.setData({imgsrc})
    var url = type == 'singer' ? `http://lishaokai.cn:3000/artists?id=${id}` : `http://lishaokai.cn:3000/playlist/detail?id=${id}`
      wx.request({
        url,
        success: res=>{
          var title, msg, allList, list;
          if(type == 'singer'){
            title = res.data.artist.name;
            msg = res.data.artist.briefDesc;
            allList = res.data.hotSongs;
            list = res.data.hotSongs.slice(0,10);
          }else{
            title = res.data.playlist.name;
            msg = res.data.playlist.description;
            allList = res.data.playlist.tracks;
            list = res.data.playlist.tracks.slice(0,10);
          }
          this.setData({
            title,
            msg,
            allList,
            list
          })
          wx.hideLoading()
          app.playSongList = this.data.list;
          app.playSongId = 0;
        }
      })
    })
  },

  tolyrics(e) {
    var { id, imgsrc, title, index } = e.currentTarget.dataset;
    if (!app.annal[id]) {
      app.annal[id] = this.data.list[index]
    }
    app.playSongIndex = index;
    wx.navigateTo({
      url: '/pages/lyrics/lyrics',
      success: res => {
        res.eventChannel.emit('fn', id, imgsrc, title)
      }
    })
  },

  playSong(e) {
    var { id, title, index } = e.currentTarget.dataset;

    if (!app.annal[id]) {
      app.annal[id] = this.data.list[index]
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