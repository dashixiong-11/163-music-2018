{
  let view = {
    el:'.Boxsongform',
    template:`
             <form class="songform">
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
    render(data={}){
      let placeholders = ['name','url','singer','id','cover','lyrics']
      let html = this.template
      placeholders.map((string)=>{
        html = html.replace(`__${string}__`,data[string]||'')
      })
      $(this.el).html(html)
    }
  }
  let model = {
    data:{
    song:{
      name:'',
      singer:'',
      url:'',
      id:'',
      cover:''
    },
    boxId:''
    },
    getboxId(){
      window.eventHub.on('boxId',(boxId)=>{
        console.log('-----')
        this.data.boxId = boxId
        console.log(this.data.boxId)
      })
    },
    upload(data){
      console.log(this.data.boxId)
      var Songbox = AV.Object.createWithoutData('Songboxs',this.data.boxId);
      var song = new AV.Object('Songboxs_songs') 
      song.set('name',data.name);
      song.set('singer',data.singer);
      song.set('url',data.url);
      song.set('cover',data.cover)
      song.set('lyrics',data.lyrics)
      song.set('dependent',Songbox)
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
        window.eventHub.emit('addsonglist',object)
      },(error)=> {
        console.error(error);
      });
    }
  }
  
  let controller = {
    init(view,model){
      this.view = view
      this.model = model
      this.model.getboxId()
      this.bindEvents()
      this.view.render(this.model.data.song)
    },
    uploadsong(){
      let needs = 'name singer url cover lyrics'.split(' ')
      let data = {}
      needs.map((string)=>{
        data[string]= $(this.view.el).find(`[name="${string}"]`).val()
      })
      if(!data.name&&!data.singer&&!data.url&&!data.cover&&!data.lyrics){
        $(this.view.el).removeClass('active')
      }else(
      this.model.upload(data)  
      )
    },
    bindEvents(){
      window.eventHub.on('form',(songdata)=>{
        this.view.render(songdata)
        $(this.view.el).addClass('active')
      })
      $(this.view.el).on('submit','form',(e)=>{
        e.preventDefault()
        this.uploadsong()
        $(this.view.el).removeClass('active')
        this.view.render({})
      })
    }
  }
  controller.init(view,model)
}
