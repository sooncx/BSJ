class AudioPlay {
  private audio: any;
  private timer: any;
  private animate: any;
  private useParams: any;
  private duration: any;

  constructor(params: any) {
    this.audio = null;
    this.animate = false;
    this.timer = null;
    this.useParams = params;
    this.init();
  }
  init() {
    if (!(window as any).audioPlayList) {
      (window as any).audioPlayList = []
    }

    this.audio = new Audio()
    this.audio.src = this.useParams.src
    this.audio.addEventListener('canplaythrough', () => {
      this.duration = this.format(this.audio.duration)
    })
    this.audio.onplay = () => {
      this.animate = true
      this.timer = setInterval(() => {
        this.animate = false
        setTimeout(() => {
          this.animate = true
        }, 50)
      }, 1250);
    }
    this.audio.onpause = () => {
      this.animate = false
      this.timer && clearInterval(this.timer)
    }
    this.audio.onended = () => {
      this.animate = false
      this.timer && clearInterval(this.timer);
      if (typeof this.useParams.playEnd === "function") {
        this.useParams.playEnd()
      }
    }
    (window as any).audioPlayList.push(this.audio)//所有实例加入全局变量
  }
  format(s: any) {
    var t = '';
    if (s > -1) {
      var min = Math.floor(s / 60) % 60;
      var sec = s % 60;
      if (min < 10) { t += "0"; }
      t += min + "'";
      if (sec < 10) { t += "0"; }
      t += sec.toFixed(2);
    }
    t = t.replace('.', '\"')
    return t;
  }
  play(isReset = false) { //isReset是否从0开始播放
    this.audio.currentTime = 0
    if (this.audio.paused) {
      (window as any).audioPlayList.forEach((audio: any) => {//开始前先关闭所有可能正在运行的实例
        audio.pause()
      })
      if (this.audio.paused) {
        this.audio.play()
      }
    }
  }

  pause() {
    this.audio.pause()
  }
}
(window as any).AudioPlay = AudioPlay;
export default AudioPlay;
