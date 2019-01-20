{
  let view = {
    el: '.page>main',
    template: `
             <form class="form">
               <div class="row">
                 <label>
                   歌名  
                   <input name="name"  type="text" value="__name__">
                 </label>          
               </div>
           <div class="row">
             <label>
               歌手  
               <input name="singer" type="text" value="__singer__">
             </label>          
           </div>
           <div class="row">
             <label>
               外链  
               <input name="url" type="text" value="__url__">
              </label>          
            </div>
            <div class="row">
              <button type="submit">保存</button>
            </div>
          </form>
    `,
    render(data = {}){
      let placeholders = ['name','url','singer','id']
      let html = this.template
      placeholders.map((string)=>{
        html = html.replace(`__${string}__`,data[string]||'')
      })
      $(this.el).html(html)
      if(data.id){
        $(this.el).prepend('<h1>编辑歌曲</h1>')
      }else{
        $(this.el).prepend('<h1>新建歌曲</h1>')
      }
    },
    reset(){
      this.render({})
    }
  }
  let model = {
    data:{
      name:'',
      singer:'',
      url:'',
      id:''
    },
    create(data){
      var Song = AV.Object.extend('Song');
      // 新建对象
      var song = new Song();
      // 设置名称
      song.set('name',data.name);
      song.set('singer',data.singer);
      song.set('url',data.url);
      return song.save().then((newsong)=> {
        let {id,attributes} = newsong
        Object.assign(this.data,{id,...attributes})
        let string = JSON.stringify(this.data)
        let object = JSON.parse(string)
        window.eventHub.emit('create',object)
      },(error)=> {
        console.error(error);
      });
    }
  }
  let controller = {
    init(view,model){
      this.view = view
      this.model = model
      this.view.render()
      this.bindEvents()
      window.eventHub.on('new',(data)=>{
        console.log(this.model.data)
        if(this.model.data.id){
          this.model.data = {}
        }else{
          Object.assign(this.model.data,data)
        }
        this.view.render(this.model.data)
      })
      window.eventHub.on('select',(data)=>{
        console.log(data)
        this.model.data = data
        this.view.render(this.model.data)
      })
    },
    save(){
        let needs = 'name singer url'.split(' ')
        let data = {}
        needs.map((string)=>{
          data[string]= $(this.view.el).find(`[name="${string}"]`).val()
        })
        this.model.create(data)
          .then(()=>{
            this.view.reset()
          })
    },
    updata(){

    },
    bindEvents(){
      $(this.view.el).on('submit','form',(e)=>{
        e.preventDefault()
        if(this.model.data.id){
          this.updata()
        }else{
          this.save()
        }
      })
    }

}

    controller.init(view,model)
}
