// pages/index/index.js
var app = getApp().globalData;
Page({
  data: {
    newSong: {
      title: "推荐新音乐",
      color: ['#ab5dfe', '#d583e9'],
      allList: [],
      list: [],
      imgsrc: ''
    },
    singer: {
      title: '热门歌手',
      allList: [],
      list: []
    },
    songList: {
      title: "精品歌单",
      allList: [],
      list: []
    },
    ranking: [
      {
        title: "新歌榜",
        color: ['#6581ff','#d0b2fa'],
        allList: [],
        list: []
      },
      {
        title: '飙升榜',
        color: ['#ff5d95', "#fda5a1"],
        allList: [],
        list: [],
        nowPlay: false
      },
      {
        title: "华语金曲榜",
        color: ['#37a8f6','#7be8be'],
        allList: [],
        list: []
      },
    ],
    show1: [],
    show2: [],
    show3: [],
    id: -1,
    isPlay: 0,
    isShow: false,
    title: ''
  },

  sreach(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  tolyrics(e){
    var {id, imgsrc, title, index} = e.currentTarget.dataset;
    if (!app.annal[id]) {
      app.annal[id] = this.data.newSong.list[index]
    }
    app.playSongList = this.data.newSong.allList;
    app.playSongIndex = index;
    wx.navigateTo({
      url: '/pages/lyrics/lyrics',
      success: res=>{
        res.eventChannel.emit('fn', id, imgsrc, title)
      }
    })
  },

  newSongData(e){
    var {n} = e.currentTarget.dataset;
    var data = n == 3 ? this.data.newSong : this.data.ranking[n];
    app.playSongList = this.data.newSong.allList;
    wx.navigateTo({
      url: '/pages/musicList/musicList',
      success: res => {
        res.eventChannel.emit('fn', data)
      }
    })
  },

  toHot(e) {
    var {id, type, imgsrc} = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/hot/hot',
      success: res => {
        res.eventChannel.emit('fn', id, type, imgsrc)
      }
    })
  },

  singerData(){
    wx.navigateTo({
      url: '/pages/singer/singer',
      success:res=>{
        res.eventChannel.emit('fn',this.data.singer)
      }
    })
  },

  songListData() {
    wx.navigateTo({
      url: '/pages/songList/songList',
      success: res => {
        res.eventChannel.emit('fn', this.data.songList)
      }
    })
  },

  show(e){
    var {num, show} = e.currentTarget.dataset;
    var n = show + '[' +num+ ']';
    this.setData({
      [n]: true
    })
  },

  playSong(e){
    var {id, title, imgsrc, index} = e.currentTarget.dataset;

    if(!app.annal[id]){
      app.annal[id] = this.data.newSong.list[index]
    }

    if(!this.data.isShow){
      this.setData({isShow: true})
    }

    if(id == app.playSongId){
      var paused = app.playSong.paused;
      if(!this.data.isPlay){
        paused = false;
        this.setData({isPlay: 1})
      }
      if(paused){
        app.playSong.play();
        this.setData({isPlay: 0, id})
      }else{
        app.playSong.pause();
        this.setData({ id: -1})
      }
      return
    }

    app.playSongId = id;
    app.playSongList = this.data.newSong.allList;
    app.playSongIndex = this.data.newSong.index;
    this.setData({ id, isPlay: 0, imgsrc, title, nowPlay: true })

    if(!app.playSong){
      app.playSong = wx.getBackgroundAudioManager();
    }
    app.playSong.src = 'https://music.163.com/song/media/outer/url?id=' + id;
    app.playSong.title = title
    app.playSong.play()
  },

  onShow() {
    this.setData({
      id: app.playSongId
    })
    if(app.playSong){
      var  pause = app.playSong.paused;
      this.setData({nowPlay: !pause})
    }
    app.playSongIndex = 0;
  },

  onLoad(){
    wx.request({
      url: 'http://lishaokai.cn:3000/personalized/newsong',
      success: res => {
        var arr = res.data.result;
        var arrSplice = arr.slice(0,3);
        var allList = 'newSong.allList';
        var list = 'newSong.list';
        this.setData({
          [allList]: arr,
          [list]: arrSplice
        })
      }
    })

    wx.request({
      url: 'http://lishaokai.cn:3000/top/artists',
      success: res => {
        var arr = res.data.artists;
        var arrSplice = arr.slice(0, 6);
        var allList = 'singer.allList';
        var list = 'singer.list';
        this.setData({
          [allList]: arr,
          [list]: arrSplice
        })
      }
    })

    wx.request({
      url: 'http://lishaokai.cn:3000/top/playlist',
      success: res => {
        var arr = res.data.playlists;
        var arrSplice = arr.slice(0, 6);
        var allList = 'songList.allList';
        var list = 'songList.list';
        this.setData({
          [allList]: arr,
          [list]: arrSplice
        })
      }
    })

    var arr = ['http://lishaokai.cn:3000/top/list?idx=0', 'http://lishaokai.cn:3000/top/list?idx=3', 'http://lishaokai.cn:3000/top/list?idx=17'];

    for (let i = 0; i < arr.length; i++) {
      wx.request({
        url: arr[i],
        success: res => {
          var arr = res.data.playlist.tracks;
          var arrSplice = arr.slice(0, 3);
          var allList = 'ranking['+ i +'].allList';
          var list = 'ranking['+ i +'].list';
          this.setData({
            [allList]: arr,
            [list]: arrSplice
          })
          if(i == 2){
            wx.hideLoading()
          }
        }
      })
    }
  }
})