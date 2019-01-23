{
  let view = {
    el:'#tabs',
  }
  let model = {}
  let controller = {
    init(view){
      this.view = view
      this.bindEvents()
    },
    bindEvents(){
      $(this.view.el).on('click','.tabs-nav > li',(e)=>{
        let $li = $(e.currentTarget)
        $li.addClass('active').siblings().removeClass('active')
        let pageindex = $li.attr('page-index')
        window.eventHub.emit('clicktabs',pageindex)
      })
    }
  }
  controller.init(view)
}
