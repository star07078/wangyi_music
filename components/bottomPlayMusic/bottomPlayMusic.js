var app = getApp().globalData;
Component({
  data: {
    isPlay: true
  },
  properties: {
    imgsrc: String,
    title: String
  },
  attached() {
    // console.log(app)
  },
  methods: {
    pause(){
      // console.log(app.playSong.paused)
      app.playSongId = -1;
      if(app.playSong.paused){
        this.setData({isPlay: true})
        console.log(app.playSong.paused, 1111)
        app.playSong.play()
      }else{
        this.setData({isPlay: false})
        console.log(app.playSong.paused, 2222)
        app.playSong.pause()
      }
    }
  }
})