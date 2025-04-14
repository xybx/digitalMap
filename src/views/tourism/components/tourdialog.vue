<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/9/20
 * @LastEditors: 12390
 * @LastEditTime: 2022/9/20
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="42%" top="2%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="tourData" :model="tourData" :rules="rules" status-icon label-width="110px">
      <el-form-item label="归属类别" prop="type">
        <el-select v-model="tourData.type" placeholder="请选择归属类别">
          <el-option v-for="item in cateData" :key="item.pid" :value="item.pid" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题名称" prop="title">
        <el-input v-model="tourData.title" placeholder="请输入标题名称" />
      </el-form-item>
      <el-form-item label="景点介绍" prop="content">
        <quill-editor v-model="tourData.content" ref="myQuillEditor" class="editor" :options="editorOption"></quill-editor>
      </el-form-item>
      <el-form-item label="景点咨询" prop="phone">
        <el-input v-model="tourData.phone" placeholder="请输入景点咨询联系电话或手机" maxlength="11" />
      </el-form-item>
      <el-form-item label="选择景点位置" required>
        <el-input v-model="tourData.address" readonly placeholder="请选择景点位置" @click.native="nativeClick" />
      </el-form-item>
      <el-form-item label="封面图片" required>
        <uploadImage :imgLists="imgLists" @removeSuccess="removeSuccess" @uploadSuccess="uploadSuccess" />
      </el-form-item>
    </el-form>
    <tourmap ref="tourmap" @exportAttr="exportAttr"/>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="keys!=2" type="primary" @click="saveData">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import uploadImage from "@/views/petition/components/uploadImage";
import tourmap from "./tourmap";
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor,Quill } from 'vue-quill-editor'
import {ImageExtend, QuillWatch} from 'quill-image-extend-module'
import {deleteimgFile} from "@/views/petition/api/petion";
import {getTourId, putTour} from "@/views/tourism/api/tour";
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
Quill.register('modules/ImageExtend', ImageExtend)
export default {
  name: 'tourdialog',
  data() {
    return {
      dialogVisible:false,
      title:'',
      type:2,
      keys:null,
      tourData:{},
      rules:{
        type:[{required: true, trigger: "change", message: "请选择归属类别"}],
        title:[{required: true, trigger: "blur", message: "请填写标题名称"}],
        content:[{required: true, trigger: "blur", message: "请填写景点介绍"}],
        phone:[{required: true, trigger: "blur", message: "请选择景点咨询"}],
      },
      cateData:[],
      imgLists:[],
      graphic:null,
      editorOption: {
        theme: "snow",
        bounds: document.body,
        placeholder: "请输入景点介绍",
        debug: 'warn',
        readOnly:false,
        modules: {
          clipboard: {
            // 粘贴版，处理粘贴时候带图片
            // matchers: [[Node.ELEMENT_NODE, this.handleCustomMatcher]],
            matchers: [['img', this.handleCustomMatcher]],
          },
          ImageExtend: {
            loading: true,
            name: 'files',
            action: `${this.$baseUrl}/gridfs/richtextimgupload`,
            response: (res) => {
              if(res.code == 200){
                return `${this.$baseUrl}/gridfs/image/${res.data[0]}`
              }else {
                this.$message.error('图片你上传失败')
              }
            }
          },
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
              ["blockquote", "code-block"], // 引用  代码块-----['blockquote', 'code-block']
              [{ header: 1 }, { header: 2 }], // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
              [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
              [{ script: "sub" }, { script: "super" }], // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
              [{ indent: "-1" }, { indent: "+1" }], // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
              [{ direction: "rtl" }], // 文本方向-----[{'direction': 'rtl'}]
              [{ size: ["small", false, "large", "huge"] }], // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
              [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
              [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
              [{ font: [] }], // 字体种类-----[{ font: [] }]
              [{ align: [] }], // 对齐方式-----[{ align: [] }]
              ["clean"], // 清除文本格式-----['clean']
              ["link","image"] // 链接、图片、视频-----['link', 'image', 'video']
            ],
            handlers:{
              image:()=>{
                QuillWatch.emit(this.$refs.myQuillEditor.quill.id)
              }
            }
          },
        }
      },
    }
  },
  components: {
    uploadImage,
    quillEditor,
    tourmap
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  created() {
  },
  mounted() {
    this.getCateData()
  },
  methods: {
    getCateData(){
      this.cateData = [
        {pid:1,name:'自然风光'},
        {pid:2,name:'亲子陪伴'},
        {pid:3,name:'健康养生'},
        {pid:4,name:'休闲度假'},
        {pid:5,name:'采摘体验'},
        {pid:6,name:'特色民宿'},
        {pid:7,name:'春观花'},
        {pid:8,name:'夏纳凉'},
        {pid:9,name:'秋采摘'},
        {pid:10,name:'冬农趣'}
      ]
    },
    async showEdit(pid,index){
      this.keys = index ? index :null
      let arr = ['新增旅游内容','查看旅游内容','编辑旅游内容']
      this.title = arr[index-1]
      if(pid){
        let {data} = await getTourId({pid})
        this.tourData = data
        this.tourData.address = `${this.tourData.longitude},${this.tourData.latitude}`
        this.getImage(this.tourData.fileid)
        this.$refs.tourmap?.showPoint(data.pid)
      }
      this.dialogVisible = true
    },
    getImage(str){
      this.imgLists = str ? str.split(',').map(item => {
        return {
          fileid:item,
          url:`${this.$baseUrl}/gridfs/image/${item}`
        }
      }): []
    },
    getGraphic(data){
      let app = this
      let pt = new Point({
        x:data.longitude,
        y:data.latitude
      })
      var graphic = new Graphic({
        geometry: pt,
        symbol: {
          type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
          url: require("@/assets/Marker.png"),
          width: '30px',
          height: '30px',
        },
      })
      app.graphic = graphic
    },
    saveData(){
      this.$refs.tourData.validate(async (valid)=>{
        if(valid) {
          let data = Object.assign({},this.tourData)
          if(this.tourData.address){
            Object.assign(data,{longitude:this.tourData.address.split(',')[0],latitude:this.tourData.address.split(',')[1]})
          } else {
            this.$message.error('请选择景点位置！')
            return false
          }
          this.getGraphic(data)
          if(this.imgLists.length > 0){
            Object.assign(data,{fileid:this.imgLists.map(item=>item.fileid).join(',')})
          }else {
            this.$message.error('请上传封面图片！')
            return false
          }
          this.$delete(data,'address')
          let res = await putTour(data)
          if(res.code === 200){
            debugger
            console.log(this)
            console.log(this.graphic)
            this.$refs.tourmap.mapData(this.graphic,res.data)
            this.$message.success('添加成功')
            this.handleClose()
            this.$emit('getData')
          }
        } else {
          return false
        }
      })
    },
    nativeClick(){
      this.$refs.tourmap.showland()
    },
    exportAttr(arr){
      this.$forceUpdate()
      this.tourData.address = arr.join(',')
    },
    handleClose(){
      this.title = ''
      this.imgLists = []
      this.options = []
      this.$refs.tourData.resetFields();
      this.tourData = this.$options.data().tourData;
      this.dialogVisible = false;
    },
    uploadSuccess(fileList){
      this.imgLists = fileList.map(item=>{
        return {
          fileid:item.fileid ? item.fileid : item.response?.data,
          url:item.url
        }
      })
    },
    async removeSuccess(fileId,fileList) {
      let res = await deleteimgFile({ fileId: fileId});
      if (res.code === 200) {
        this.$message.success("删除成功");
      }
      this.imgLists = fileList;
    },
    handleCustomMatcher(node, Delta) {
      let ops = []
      Delta.ops.forEach(op => {
        // 如果粘贴了图片，这里会是一个对象，所以可以这样处理
        console.log(op)
        if (op.insert && (op.insert.image.indexOf('47.104.12.127') > -1 || typeof op.insert.image == 'string')) {
          ops.push({
            insert: op.insert,
          })
        }else{
          setTimeout(()=>{
            this.$message.error('不允许粘贴图片,请手动上传')
            return false
          },500)
        }
      })
      Delta.ops = ops
      return Delta
    },
  }
}
</script>

<style lang="scss" scoped>
@import '../style/rural.scss';
</style>
