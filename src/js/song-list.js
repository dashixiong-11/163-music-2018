{
  let view = {
    el:'.songlist-container',
    template:`
          <ul class="songList">
          </ul>
    `,
    render(data){
      $(this.el).html(this.template)
      let {songs,selectedsongId} = data
      let lilist = songs.map((song)=>{
          let $li = $('<li></li>').text(song.name).attr('song-id',song.id)
        if(song.id === selectedsongId){
          $li.addClass('active')
        }
        return $li
      })
      $(this.el).find('ul').empty()
      lilist.map((demoli)=>{
        $(this.el).find('ul').append(demoli)
      })
    },
    clearactive(){
      $(this.el).find('.active').removeClass('active')
    },
  }
  let model = {
    data:{
      songs:[
        
      ],
      selectedsongId:undefined,
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
      this.bindEventHub()
      this.getAllSongs()
      this.bindEvents()
      this.view.render(this.model.data)
    },
    bindEventHub(){
      window.eventHub.on('create',(data)=>{
        this.model.data.songs.push(data)
        this.view.render(this.model.data)
      })
      window.eventHub.on('new',()=>{
        this.view.clearactive()
      })
      window.eventHub.on('updata',(song)=>{
        let songs = this.model.data.songs
        for(let i=0 ; i<songs.length; i++ ){
          if(songs[i].id===song.id){
            Object.assign(songs[i],song)
          }
        }
        this.view.render(this.model.data)
      })
    },
    bindEvents(){
      $(this.view.el).on('click','li',
        (x)=>{
          let songId = x.currentTarget.getAttribute('song-id')
          this.model.data.selectedsongId= songId
          this.view.render(this.model.data)
          let songs = this.model.data.songs
          let data
          for(let i=0;i<songs.length;i++){
            if(songs[i].id === songId){
              data = songs[i]
            }
          }
          window.eventHub.emit('select',JSON.parse(JSON.stringify(data)))
          }
      )
    },
    getAllSongs(){
      this.model.find().then(() => {
        this.view.render(this.model.data)
      })
    }
  }
  controller.init(view,model)
}
