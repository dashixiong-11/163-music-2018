{
  let view = {
    el:'.uploadArea',
    find(selector){
      console.log($(this.el).find(seletor)[0])
      return $(this.el).find(selector)[0]
    }
  }
  let model = {}
  let controller = {
    init(view,model){
      this.view = view
      this.model = model
      this.initqiniu()
    },
    initqiniu(){
      console.log(this.view.find('#xxx'))
      var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',    //上传模式,依次退化
        browse_button:this.view.find('#xxx'),       //上传选择的点选按钮，**必需**
        uptoken_url: 'http://localhost:8888/uptoken',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
        // uptoken : '', //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        // unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
        domain: 'plthbagry.bkt.clouddn.com',   //bucket 域名，下载资源时用到，**必需**
        get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
        container: this.view.find('#yyy'),           //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '100mb',           //最大文件体积限制
        flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
        dragdrop: true,                   //开启可拖曳上传
        drop_element:'yyy',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb',                //分块上传时，每片的体积
        auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        init: {
          'FilesAdded': function(up, files) {
            plupload.each(files, function(file) {
              // 文件添加进队列后,处理相关的事情
            });
          },
          'BeforeUpload': function(up, file) {
            // 每个文件上传前,处理相关的事情
            window.eventHub.emit('beforeloading')
            window.eventHub.emit('new')
          },
          'UploadProgress': function(up, file) {
            // 每个文件上传时,处理相关的事情
          },
          'FileUploaded': function(up, file, info) {
            window.eventHub.emit('afterloading')
            // var sourceLink = domain + res.key; 获取上传成功后的文件的Url
            upload.textContent='上传完成'
            var domain = up.getOption('domain')
            var response = JSON.parse(info.response)
            var sourceLink = 'http://' + domain + '/' + encodeURIComponent(response.key);
            window.eventHub.emit('uploadsong',{
              url:sourceLink,
              name:response.key
            })
          },
          'Error': function(up, err, errTip) {
            //上传出错时,处理相关的事情
          },
          'UploadComplete': function() {
            //队列文件处理完毕后,处理相关的事情
            window.eventHub.emit('clearliactive')
          }  
        }
      });
    }
  }
  controller.init(view,model)
}
