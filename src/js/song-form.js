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
             <label>
               封面  
               <input name="cover" type="text" value="__cover__">
              </label>          
            </div>
           <div class="row">
             <label>
               歌词  
              </label>          
              <textarea cols=100 rows=10  name='lyrics'>__lyrics__</textarea>
            </div>
            <div class="row">
              <button type="submit">保存</button>
            </div>
          </form>
    `,
    render(data = {}){
      let placeholders = ['name','url','singer','id','cover','lyrics']
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
      id:'',
      cover:''
    },
    create(data){
      var Song = AV.Object.extend('Song');
      // 新建对象
      var song = new Song();
      // 设置名称
      song.set('name',data.name);
      song.set('singer',data.singer);
      song.set('url',data.url);
      song.set('cover',data.cover)
      song.set('lyrics',data.lyrics)
      return song.save().then((newsong)=> {
        let {id,attributes} = newsong
        Object.assign(this.data,{id:id,name:attributes.name,
          singer:attributes.singer,
          url:attributes.url,
          cover:attributes.cover,
          lyrics:attributes.lyrics
        })
        let string = JSON.stringify(this.data)
        let object = JSON.parse(string)
        window.eventHub.emit('create',object)
      },(error)=> {
        console.error(error);
      });
    },
    updata(data){
      var song = AV.Object.createWithoutData('Song', this.data.id);
      song.set('name',data.name);
      song.set('singer',data.singer);
      song.set('url',data.url);
      song.set('cover',data.cover)
      song.set('lyrics',data.lyrics)
      return song.save().then((res)=>{
        Object.assign(this.data,data)
        return res
      });
    },
  }
  let controller = {
    init(view,model){
      this.view = view
      this.model = model
      this.view.render()
      this.bindEvents()
      window.eventHub.on('new',(data)=>{
        this.model.data = {}
        this.view.render(this.model.data)
      })
      window.eventHub.on('uploadsong',(data)=>{
        Object.assign(this.model.data,data)
        this.view.render(this.model.data)
      })
      window.eventHub.on('select',(data)=>{
        this.model.data = data
        this.view.render(this.model.data)
      })
    },
    save(){
      let needs = 'name singer url cover lyrics'.split(' ')
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
      let needs = 'name singer url cover lyrics'.split(' ')
      let data = {}
      needs.map((string)=>{
        data[string]= $(this.view.el).find(`[name="${string}"]`).val()
      })
      this.model.updata(data).then(()=>{
        window.eventHub.emit('updata',JSON.parse(JSON.stringify(this.model.data)))
      })
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
