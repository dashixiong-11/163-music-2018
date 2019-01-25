String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {  
  if (!RegExp.prototype.isPrototypeOf(reallyDo)) {  
    return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);  
  } else {  
    return this.replace(reallyDo, replaceWith);  
  }  
} 
{
  let view = {
    el:'#playsong',
    template:`
      <div style="background: transparent url(__cover__) no-repeat center;
display: flex; flex-direction: column; height: 100vh;
  background-size: cover;
      "  class="page">
        <div class="disc-container">
          <img class="pointer" src="//s3.music.126.net/m/s/img/needle-ip6.png?be4ebbeb6befadfcae75ce174e7db862 " alt="">
          <audio src=__url__></audio>
          <div class="disc">
            <div class="icon-wrapper">
              <svg class="icon icon-play">
                <use xlink:href="#icon-play"></use>
              </svg>
              <svg class="icon icon-pause">
                <use xlink:href="#icon-pause"></use>
              </svg>
            </div>
            <img class="ring" src="//s3.music.126.net/m/s/img/disc-ip6.png?69796123ad7cfe95781ea38aac8f2d48" alt="">
            <img class="light" src="//s3.music.126.net/m/s/img/disc_light-ip6.png?996fc8a2bc62e1ab3f51f135fc459577" alt="">
            <img src=__cover__ alt="" class="cover">
          </div>
        </div>
        <div class="song-description">
          <h1>__name__</h1>
          <div class="lyric">
            <div class="lines"style="transform: translateY(24px);">
            __lyricstext__
            </div>
          </div>
        </div>
        <div class="links">
          <a href="#">打开</a>
          <a class="main" href="#">下载</a>
        </div>
      </div>
    `,
    render(data){
      let temp = this.template
        .replace('__url__',data.song.url)
        .replace('__name__',data.song.name)
        .replace('__lyricstext__',data.lyricstext)
        .replaceAll('__cover__',data.song.cover)
      $(this.el).html(temp)
    },
    findaudio(){
      return ($(this.el).find('audio'))
    },
    roll(timedata){
      let allP = $(this.el).find('.lines>p')
      for (let i=0; i<allP.length; i++){
        let ptime = allP.eq(i).attr('data-time')
        let thistime = ptime - timedata
        if(0<thistime&&thistime<0.5){
          let p = allP[i]
          let pHeight = p.getBoundingClientRect().top
          let linesHeight = $(this.el).find('.lyric>.lines')[0].getBoundingClientRect().top
          let height = pHeight - linesHeight  - 24
          $(this.el).find('.lyric>.lines').css({
            transform:`translateY(${-height}px)`
          })
          $(p).addClass('active').siblings().removeClass('active')
        }
      }
    },
    play(){
      $(this.el).find('audio')[0].play()
      $(this.el).find('.disc-container').addClass('playing')
    },
    pause(){
      $(this.el).find('audio')[0].pause()
      $(this.el).find('.disc-container').removeClass('playing')
    }
  }
  let model = {
    data:{
      song:{
        id:'',
        url:'',
        name:'',
        lyrics:'',
        singer:''
      },
      status:'paused',
      lyricstext:''
    },
    gitId(){
      let search = window.location.search
      if(search.indexOf('?'===0)){
        search = search.substring(1)
      }
      let array = search.split('&').filter((v=>v))
      let id = ''
      array.map((e)=>{
        let kv = e.split('=')
        let key = kv[0]
        let value = kv[1]
        if(key === 'id'){
          id = value
        }
      })
      this.data.song.id = id
    },
    gitsong(){
      var query = new AV.Query('Song');
      return query.get(this.data.song.id).then((song)=> {
        // todo 就是 id 为 57328ca079bc44005c2472d0 的 Todo 对象实例
        if(song.attributes.lyrics){
          let lyrics = song.attributes.lyrics.split('\n')
          let lyricstext = ''
          lyrics.map((data)=>{
            let regex = /\[([\d:.]+)\](.+)/
            let matches = data.match(regex)
            let timing = matches[1]
            let parts = timing.split(':')
            let time = parseInt(parts[0],10)*60 + parseFloat(parts[1],10)
            let string = matches[2]
            lyricstext+=`<p data-time=${time}>${string}</p>
`
          })
          this.data.lyricstext=lyricstext
        }
        Object.assign(this.data.song,song.attributes)
      }, function (error) {
        // 异常处理
      });
    }
  }
  let controller = {
    init(view,medol){
      this.view = view
      this.model = model
      this.model.gitId()
      this.model.gitsong().then(()=>{
        this.view.render(this.model.data)

      })
      this.bindEvents()
    },
    bindEvents(){
      $(this.view.el).on('click','.icon-play',()=>{
        this.view.play()
        this.view.findaudio().on('ended',()=>{
          this.view.pause()
        })
        this.view.findaudio().on('timeupdate',(e)=>{
          this.view.roll(e.currentTarget.currentTime)
        })
      })
      $(this.view.el).on('click','.icon-pause',()=>{
        this.view.pause()
      })
    }
  }
  controller.init(view,model)
}
