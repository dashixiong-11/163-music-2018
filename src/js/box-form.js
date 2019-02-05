{
  let view = {
    el:'.boxform',
    template:`
      <div class="creatbox" id="creatbox">
        <form class="boxform">
          <div class="row">
            <label>
              歌单名  
              <input name="boxname"  type="text" value="__boxname__">
            </label>          
          </div>
          <div class="row">
            <label>
              封面  
              <input name="boxcover" type="text" value="__boxcover__">
            </label>          
          </div>
          <div class="row">
            <label>
              简介  
            </label>          
            <textarea cols=30 rows=3  name='boxsynopsis'>__boxsynopsis__</textarea>
          </div>
          <div class="row">
            <button type="submit">保存</button>
          </div>
        </form>
      </div>
    `,
    render(data={}){
      let placeholders = ['boxname','boxcover','boxsynopsis']
      let html = this.template
      placeholders.map((string)=>{
        html = html.replace(`__${string}__`,data[string]||'')
      })
      $(this.el).html(html)
    },
  }
  let model = {
    data:{
      boxname:'',
      boxsynopsis:'',
      boxcover:'',
      id:''
    },
    updata(data){
      if(data.boxname){
        var newsongbox = new AV.Object('Songboxs')
        newsongbox.set('boxname',data.boxname)
        newsongbox.set('boxsynopsis',data.boxsynopsis)
        newsongbox.set('boxcover',data.boxcover)
        return newsongbox.save().then((x)=>{
          return Object.assign(this.data,{id:x.id,...x.attributes})
        })
      }    }
  }
  let controller = {
    init(view,model){
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()
    },
    bindEvents(){
      window.eventHub.on('addbox',()=>{
        $(this.view.el).find('#creatbox').addClass('active')
      })
      $(this.view.el).on('submit','.boxform',(e)=>{
        e.preventDefault()
        this.updata()
        $(this.view.el).find('.creatbox').removeClass('active')
        this.view.render({})
      })
    },
    updata(){
      let needs = 'boxname boxsynopsis boxcover id'.split(' ')
      let data = {}
      needs.map((string)=>{
        data[string] = $(this.view.el).find(`[name="${string}"]`).val()
      })
      if(data.boxname){
      this.model.updata(data).then(()=>{
        window.eventHub.emit('uploadbox',JSON.parse(JSON.stringify(this.model.data)))
      })
      }else{
        $(this.view.el).find('.creatbox').removeClass('active')
      }
    },
  }
  controller.init(view,model)
}
