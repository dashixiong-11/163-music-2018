{
  let view = {
    el:'.songlist-container',
    template:`
          <ul class="songList">
          </ul>
    `,
    render(data){
      $(this.el).html(this.template)
      let {songs} = data
      let lilist = songs.map((song)=>{
          return $('<li></li>').text(song.name)
      })
      $(this.el).find('ul').empty()
      lilist.map((demoli)=>{
        $(this.el).find('ul').append(demoli)
      })
    },
    clearactive(){
      $(this.el).find('.active').remove('active')
    }
  }
  let model = {
    data:{
      songs:[
        
      ]
    },
    find(){
      var query = new AV.Query('Song');
      return  query.find().then(
        (songs)=>{
          this.data.songs = songs.map(
            (song)=>{return {id:song.id, ...song.attributes}}
          )
          return songs
        }
      )
    }
  }
  let controller = {
    init(view,model){
      this.view = view
      this.model = model
      this.model.find().then(() => {
        this.view.render(this.model.data)
      })
      this.view.render(this.model.data)
      window.eventHub.on('upload',()=>{
        this.view.clearactive()
      })
      window.eventHub.on('create',(data)=>{
        this.model.data.songs.push(data)
        this.view.render(this.model.data)
      })
    }
  }
  controller.init(view,model)
}
