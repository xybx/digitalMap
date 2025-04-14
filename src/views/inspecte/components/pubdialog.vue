<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/6/27
 * @LastEditors: 12390
 * @LastEditTime: 2022/6/27
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="42%" top="2%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="pubData" :model="pubData" :rules="rules" status-icon label-width="110px">
      <el-form-item label="标题名称" prop="title">
        <el-input v-model="pubData.title" placeholder="请输入标题名称" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <quill-editor v-model="pubData.content" ref="myQuillEditor" class="editor" :options="editorOption"></quill-editor>
      </el-form-item>
      <el-form-item label="上传封面图片" required>
        <UploadNew :fileLists="fileLists" :type="type" :limit="1" @removeSuccess="removeSuccess" @uploadSuccess="uploadSuccess"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="-" @click="saveData">确 定</el-button>
      <el-button size="-" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import UploadNew from "@/components/UploadNew";
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor,Quill } from 'vue-quill-editor'
import {ImageExtend, QuillWatch } from 'quill-image-extend-module'
import {imgDelete} from "@/views/conven/api/conven";
import {getPublicId, putPublicData} from "@/views/inspecte/api/public";
Quill.register('modules/ImageExtend', ImageExtend)
export default {
  name: 'pubdialog',
  props:['types'],
  data() {
    return {
      dialogVisible:false,
      title:'',
      pubData:{},
      rules:{
        title:[{required: true, trigger: "blur", message: "请填写标题名称"}],
        content:[{required: true, trigger: "blur", message: "请填写内容"}],
      },
      type:6,
      fileLists:[],
      editorOption: {
        theme: "snow",
        bounds: document.body,
        placeholder: "请输入内容",
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
          }
        }
      },
    }
  },
  components: {
    UploadNew,
    quillEditor,
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    async showEdit(pid,index){
      let arr = ['新增','编辑']
      this.title = arr[index-1]
      if(pid) {
        let res = await getPublicId({pid})
        if(res.code == 200){
          this.pubData = res.data
          this.getFiles(res.data.fileimage)
        }
      }
      this.dialogVisible = true
    },
    getFiles(str){
      let arr = []
      let fileArr = {
        fileid:str ? str : '',
        url:`${this.$baseUrl}/gridfs/image/${str ? str : ''}`
      }
      arr.push(fileArr)
      this.fileLists = arr
    },
    uploadSuccess(fileData) {
      this.fileLists = fileData;
    },
    async removeSuccess(fileId,fileData) {
      let res = await imgDelete({ fileId: fileId});
      if (res.code === 200) {
        this.$message.success("删除成功");
      }
      this.fileLists = fileData;
    },
    saveData(){
      this.$refs.pubData.validate(async (valid)=>{
        if(valid){
          if(this.fileLists.length == 0){
            this.$message.error('请上传图片')
            return false
          }else {
            this.pubData.fileimage = this.fileLists.map(item=>{ return item.fileid}).join(',')
          }
          let data = Object.assign({},this.pubData,{type:Number(this.types)})
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          let res = await putPublicData(data)
          if(res.code == 200){
            loading.close();
            this.$message.success('保存成功')
            this.handleClose()
            this.$emit('getData')
          }
        }else {
          return false
        }
      })
    },
    handleClose(){
      this.title = ''
      this.fileLists = []
      this.$refs.pubData.resetFields();
      this.pubData = this.$options.data().pubData;
      this.dialogVisible = false;
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../style/public.scss";
</style>
