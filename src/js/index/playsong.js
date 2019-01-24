{
  let view = {
    el:'#playsong',
    template:`
      <audio src={{url}}></audio>
      <button class='play'>播放</button>
      <button class='pause'>暂停</button>
    `,
    render(data){
      $(this.el).html(this.template.replace('{{url}}',data.url))
    },
    play(){
      $(this.el).find('audio')[0].play()
    },
    pause(){
      $(this.el).find('audio')[0].pause()
    }
  }
  let model = {
    data:{
      id:'',
      url:'',
      name:'',
      singer:''
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
      this.data.id = id
    },
    gitsong(){
      var query = new AV.Query('Song');
      return query.get(this.data.id).then((song)=> {
        // todo 就是 id 为 57328ca079bc44005c2472d0 的 Todo 对象实例
      Object.assign(this.data,song.attributes)
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
      this.bindEvents()
      this.model.gitsong().then(()=>{
        console.log(this.model.data)
        this.view.render(this.model.data)
      })
    },
    bindEvents(){
      $(this.view.el).on('click','.play',()=>{
        this.view.play()
      })
      $(this.view.el).on('click','.pause',()=>{
        this.view.pause()
      })
    }
  }
  controller.init(view,model)
}
