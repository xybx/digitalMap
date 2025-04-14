/*
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2023/4/7 17:26:25
 * @LastEditors: 12390
 * @LastEditTime: 2023/4/7 17:26:25
 * @Description: HTML Page of Javascript
 * Copyright (c) 2022 by xybx, All Rights Reserved.
*/

import {
  createGatePass
} from "@/views/forest/api/forest-api";
export default {
  name: 'gatePass',
  data() {
    return {
      videoWidth: 250,
      videoHeight: 350,
      imgSrc: '',
      thisCancas: null,
      thisContext: null,
      thisVideo: null,

      gatePassUrl: '',
      innerVisible: false,
      createVisible: false,
      dialogVisible:false,
      title:'',
      keys:null,
      image: '',
      file: null,
      pid: undefined
    }
  },
  components: {
  },
  props:['tcard'],
  computed: {},
  created() {

  },
  mounted() {

  },
  methods: {
    show(pid) {
      this.pid = pid;
      this.title ='生成人员通行证';
      this.dialogVisible = true;
      setTimeout(() => {
        this.getCompetence();
      }, 1500)
    },
    getCompetence () {
      var _this = this
      this.thisCancas = document.getElementById('canvasCamera')
      this.thisContext = this.thisCancas.getContext('2d')
      this.thisVideo = document.getElementById('videoCamera')
      // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {}
      }
      // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
      // 使用getUserMedia，因为它会覆盖现有的属性。
      // 这里，如果缺少getUserMedia属性，就添加它。
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
          // 首先获取现存的getUserMedia(如果存在)
          var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia
          // 有些浏览器不支持，会返回错误信息
          // 保持接口一致
          if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
          }
          // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject)
          })
        }
      }
      var constraints = { audio: false, video: { width: this.videoWidth, height: this.videoHeight, transform: 'scaleX(-1)' } }
      navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        // 旧的浏览器可能没有srcObject
        if ('srcObject' in _this.thisVideo) {
          _this.thisVideo.srcObject = stream
        } else {
          // 避免在新的浏览器中使用它，因为它正在被弃用。
          _this.thisVideo.src = window.URL.createObjectURL(stream)
        }
        _this.thisVideo.onloadedmetadata = function (e) {
          _this.thisVideo.play()
        }
      }).catch(err => {
        _this.$message.error("未配置摄像头或未开启浏览器摄像头权限，请联系管理员！")
        console.log(err)
      })
    },
    //  绘制图片（拍照功能）
    setImage () {
      var _this = this
      // 点击，canvas画图
      _this.thisContext.drawImage(_this.thisVideo, 0, 0, _this.videoWidth, _this.videoHeight)
      // 获取图片base64链接
      var image = this.thisCancas.toDataURL('image/png')
      _this.imgSrc = image
      this.$emit('refreshDataList', this.imgSrc)
    },
    // base64转文件
    dataURLtoFile (dataurl, filename) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },
    // 关闭摄像头
    stopNavigator () {
      this.thisVideo.srcObject.getTracks()[0].stop()
    },
    handleClose(){
      this.dialogVisible = false
      this.imgSrc = '';
      this.stopNavigator();
    },
    create() {

      const formData = new FormData();
      if (this.file != null) {
        formData.append("file", this.file);
      } else {
        let file = this.dataURLtoFile(this.imgSrc, '123.png');
        formData.append("file", file);
      }
      formData.append("pid", this.pid)
      createGatePass(formData).then(res => {
        // 将 Blob 对象转为 URL 地址
        this.gatePassUrl = window.URL.createObjectURL(res);
        this.$emit('refreshDataList', this.gatePassUrl)
      })
      this.innerVisible = true;
    },
    download() {
      let fileName = "通行证.png";
        this.downloadIamge(this.gatePassUrl, fileName);
    },
    print() {
      // // 创建 canvas 元素
      // const canvas = document.createElement('canvas');
      // // 设置 canvas 元素的宽高
      // canvas.width = this.$refs.img.naturalWidth;
      // canvas.height = this.$refs.img.naturalHeight;
      // // 获取 2D 上下文对象
      // const ctx = canvas.getContext('2d');
      // // 将图片绘制到 canvas 上
      // ctx.drawImage(this.$refs.img, 0, 0);
      // 将 canvas 转为图片链接
      // const imgURL = canvas.toDataURL('image/png');
      // 分别打印每一张图片
      const printWindow = window.open('', 'Print', 'height=1110,width=638');
      printWindow.document.write(`<img src="${this.gatePassUrl}">`);
      printWindow.print();
    },
    uploadImg() {
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      this.file = event.target.files[0];
      this.imgSrc = URL.createObjectURL(this.file);
    },
    downloadIamge (imgsrc, name) { // 下载图片地址和图片名
      var image = new Image()
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function () {
        var canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        var context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        var url = canvas.toDataURL('image/png') // 得到图片的base64编码数据
        var a = document.createElement('a') // 生成一个a元素
        var event = new MouseEvent('click') // 创建一个单击事件
        a.download = name || 'photo' // 设置图片名称
        a.href = url // 将生成的URL设置为a.href属性
        a.dispatchEvent(event) // 触发a的单击事件
      }
      image.src = imgsrc
    }
  }
}
