{
  let view = {
    el:'#pages',
    show(linode){
      $(this.el).find(linode).addClass('active').siblings().removeClass('active')
    }
  }
  let model = {}
  let controller = {
    init(view,model){
      this.view = view
      this.model = model
      this.bindEventHub()
    },
    bindEventHub(){
      window.eventHub.on('clicktabs',(e)=>{
        this.view.show(e)
      })
    }
  }
  controller.init(view,model)
}
