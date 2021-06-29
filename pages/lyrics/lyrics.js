// pages/lyrics/lyrics.js
var app = getApp().globalData;
Page({

  data: {
    topHeight: '',
    imgsrc: '',
    lrc: {},
    id: '',
    title: '',
    currentLrc: 'el',
    topCurrentLrc: 'el',
    isPlay: true
  },

  pause(){
    // console.log(app)
    var paused = app.playSong.paused;
    console.log(paused)
    if(paused){
      // console.log(paused,1111)
      this.setData({isPlay: true})
      app.playSong.play()
    }else{
      this.setData({isPlay: false})
      app.playSong.pause()
    }
  },

  up(){
    // console.log(app.playSongList, app.playSongIndex)
    var index = app.playSongIndex - 1;
    if(index < 0){
      wx.showModal({
        content: '前面已经没有音乐了',
        showCancel: false
      })
      return
    }
    var id = app.playSongList[index];
    app.playSong.src = 'https://music.163.com/song/media/outer/url?id=' + id.id;
    app.playSong.title = app.playSongList[index].name;
    app.playSong.play()
    app.playSongIndex = index;
    this.setData({
      imgsrc: id.picUrl,
      title: id.name
    })
    var url = 'http://lishaokai.cn:3000/lyric?id=' + id.id;

    wx.request({
      url,
      success: res => {
        var { lyric } = res.data.lrc;
        var reg = /\[(.*?)](.*)/g;
        var obj = {};
        lyric.replace(reg, ($0, $1, $2) => {
          obj[$1.substring(0, 5)] = $2
        })
        this.setData({
          lrc: obj
        })
      }
    })
  },
  down(){
    var index = app.playSongIndex + 1;
    if (index > app.playSongList.length) {
      wx.showModal({
        content: '后面已经没有音乐了',
        showCancel: false
      })
      return
    }
    var id = app.playSongList[index];
    app.playSong.src = 'https://music.163.com/song/media/outer/url?id=' + id.id;
    app.playSong.title = app.playSongList[index].name;
    app.playSong.play()
    app.playSongIndex = index;
    this.setData({
      imgsrc: id.picUrl,
      title: id.name
    })
    var url = 'http://lishaokai.cn:3000/lyric?id=' + id.id;

    wx.request({
      url,
      success: res => {
        var { lyric } = res.data.lrc;
        var reg = /\[(.*?)](.*)/g;
        var obj = {};
        lyric.replace(reg, ($0, $1, $2) => {
          obj[$1.substring(0, 5)] = $2
        })
        this.setData({
          lrc: obj
        })
      }
    })
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('fn', (id, imgsrc, title)=>{
      // app.playSongId = id;
      console.log(id, imgsrc, title)
      this.setData({
        id,
        imgsrc,
        title,
        topHeight: app.header.height
      })
      if (!app.playSong) {
        app.playSong = wx.getBackgroundAudioManager();
      }
      if (id != app.playSongId){
        app.playSong.src = 'https://music.163.com/song/media/outer/url?id=' + id;
        app.playSong.title = title;
        app.playSong.play()
      }
      app.playSongId = id;

      var url = 'http://lishaokai.cn:3000/lyric?id=' + id;

      wx.request({
        url,
        success: res => {
          var { lyric } = res.data.lrc;
          // console.log(lyric)
          // return
          var reg = /\[(.*?)](.*)/g;
          var obj = {};
          lyric.replace(reg, ($0, $1, $2) => {
            obj[$1.substring(0, 5)] = $2
          })
          this.setData({
            lrc: obj
          })
          wx.hideLoading()
        }
      })

    })
    
    app.playSong.onTimeUpdate(()=>{
      var {currentTime} = app.playSong;
      var min = Math.floor(currentTime / 60);
      var sec = Math.floor(currentTime % 60);
      var attr = (min < 10 ? '0'+min : ''+min) + ':' +(sec < 10 ? '0'+sec : ''+sec);
      var elAttr = 'el-'+attr;
      if(attr in this.data.lrc && elAttr != this.data.currentLrc){
        this.setData({
          currentLrc: elAttr,
          topCurrentLrc: this.data.currentLrc
        })
      }
    })
    
  }
})