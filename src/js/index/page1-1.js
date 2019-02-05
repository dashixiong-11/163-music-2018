{
  let view = {
    el:'.playlists',
    template:`
          <h2 class="sectionTitle">推荐歌单</h2>
          <ol class="songs">
          </ol>
    `,
    render(data){
      console.log(data)
      $(this.el).html(this.template)
      let $lilist = data.map((box)=>{
        let $li =  $(`
            <li box-id=${box.id}>
              <div class="cover">
                <a  href="./playsongs.html?id=${box.id}">
                <img width=105 src="https://i.loli.net/2017/08/22/599ba7a0aea8b.jpg" alt="封面">
              </div>
              <p>${box.boxname}</p>
            </li>
        `)
        return $li
      })
      $(this.el).find('.songs').empty()
      $lilist.map((li)=>{
        $(this.el).find('.songs').append(li)
      })
    }
  }
  let model = {
    data:{
      boxs:[]
    },
    find(){
      var query = new AV.Query('Songboxs');
      query.limit(6)
      return  query.find().then(
        (songboxs)=>{
          console.log(songboxs)
          this.data.boxs =  songboxs.map((box)=>{
            return {id:box.id,...box.attributes}
          })
          console.log(this.data.boxs)
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
    },
    bindEvents(){
      this.model.find().then(()=>{
        console.log(this.model.data.boxs)
        this.view.render(this.model.data.boxs)
      })
    }
  }
  controller.init(view,model)
}
