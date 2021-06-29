//app.js
App({
  globalData: {
    userInfo: null,
    header: {},
    playSong: null,
    playSongId: 0,
    playSongList: [],
    playSongIndex: 0,
    annal: {}
  },

  setPlaySongId(method) {
    var obj = this.globalData;
    Object.defineProperty(obj, 'playSongId',{
      set(value){
        method()
        return value;
      }
    })
  },

  onLaunch(){
    // wx.showLoading({
    //   title: '请求数据中',
    //   mask: true
    // })
    wx.getStorage({
      key: 'playSongList',
      success: (res)=> {
        // console.log(res,2)
        this.globalData.annal = res.data
        // console.log(this.globalData.playSongList,88)
      },
    })
    var getTopHeight = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: res=>{
        this.globalData.header = {
          height: getTopHeight.height + res.safeArea.top + (getTopHeight.top - res.safeArea.top) * 2 ,
          margin: getTopHeight.top - res.safeArea.top,
          top: res.safeArea.top,
          screenHeight: res.screenHeight
        }
      }
    })

  },

  onUnload(){
    wx.setStorage({
      key: 'playSongList',
      data: this.globalData.annal
    })
  },

  onHide() {
    wx.setStorage({
      key: 'playSongList',
      data: this.globalData.annal
    })
  }

})