{
  let view = {
    el:'.songlist-container',
    template:`
          <ol class='songList'>
          </ol>
            <div id="addBox">
              添加歌单
            </div>
    `,
    render(data){
      $(this.el).html(this.template)
      let $lilist = data.map((box)=>{
        let $li =  $(`<li data-id=${box.id}>${box.boxname}</li>`)
        return $li
      })
      $(this.el).find('ol').empty()
      $lilist.map((li)=>{
        $(this.el).find('ol').append(li)
      })
    },
    addbox(data){
      var $li=$(`<li data-id=${data.id}>${data.boxname}</li>`);
      $(this.el).find('.songList').append($li);
    }
  }
  let model = {
    data:{
      boxs:[]
    },
    find(){
      var query = new AV.Query('Songboxs');
      return  query.find().then(
        (songboxs)=>{
        this.data.boxs =  songboxs.map((box)=>{
        return {id:box.id,...box.attributes}
          })
          return songboxs
        }
      )
    },
  }
  let controller = {
    init(view,model){
      this.view = view
      this.model = model
      this.bindEvents()
      this.gitAllboxs()
    },
    bindEvents(){
      $(this.view.el).on('click','#addBox',()=>{
        window.eventHub.emit('addbox')
      })
      $(this.view.el).on('click','li',(e)=>{
        window.eventHub.emit('boxId',$(e.currentTarget).attr('data-id'))
        $(e.currentTarget).addClass('active').siblings().removeClass('active')
      })
      window.eventHub.on('uploadbox',(data)=>{
        this.view.addbox(data)   
        this.gitAllboxs()
      })
    },
    gitAllboxs(){
      this.model.find().then(()=>{
        this.view.render(this.model.data.boxs)
      })
    }

  }
  controller.init(view,model)
}
