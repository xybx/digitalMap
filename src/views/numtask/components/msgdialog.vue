<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="40%" top="3%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="formData" :model="formData" :rules="rules" status-icon label-width="110px">
      <el-form-item label="通知类别" prop="newstype">
        <el-input v-model="formData.newstype" placeholder="请输入通知类别" :disabled="disabled" />
      </el-form-item>
      <el-form-item label="是否批量推送" prop="pushstate">
        <el-select v-model="formData.pushstate" placeholder="请选择是否批量推送" :disabled="disabled">
          <el-option :value="0" label="否"></el-option>
          <el-option :value="1" label="是"></el-option>
        </el-select>
      </el-form-item>
      <template v-if="formData.pushstate == 1 && !formData.pid">
        <el-form-item label="选择推送群组" prop="pushusertype">
          <el-select v-model="formData.pushusertype" placeholder="请选择推送群组" :disabled="disabled">
            <el-option v-for="item in typedata" :key="item.pid" :value="item.pid" :label="item.typename"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <el-form-item label="通知标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入新闻标题" :disabled="disabled" />
      </el-form-item>
      <el-form-item label="通知内容" prop="content">
        <quill-editor v-model="formData.content" ref="myQuillEditor" class="editor" :options="editorOption"></quill-editor>
      </el-form-item>
      <el-form-item v-if="manage" label="是否需要回复" prop="reply">
        <el-select v-model="formData.reply" placeholder="请选择是否需要回复" :disabled="disabled">
          <el-option :value="0" label="否"></el-option>
          <el-option :value="1" label="是"></el-option>
        </el-select>
      </el-form-item>
      <template v-if="!manage && formData.reply == 1 && keys == 2">
        <el-form-item  label="回复内容" prop="replyidea">
          <el-input v-model="formData.replyidea" type="textarea" :rows="5" placeholder="请输入回复内容"/>
        </el-form-item>
      </template>
    </el-form>
    <unRead ref="uread" :manage="true" @getData="getData"/>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="keys == 2 || keys == null" type="primary" @click="saveData">确 定</el-button>
      <el-button v-if="!manage && keys == 1 && formData.reply == 0 && rtype == 0" type="primary" @click="readData">已 阅</el-button>
      <el-button v-if="formData.pid && formData.pushstate == 1 && keys == 3 && (formData.allpushcount != formData.readpushcount)" type="primary" @click="pushData">未阅人员推送</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {putNews,getReadnews,getNewstail} from '../api/task'
import {getalltype} from "../api/person";
import unRead from "@/views/infomsg/components/unread";
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor,Quill } from 'vue-quill-editor'
import {ImageExtend, QuillWatch} from 'quill-image-extend-module'
Quill.register('modules/ImageExtend', ImageExtend)
export default {
  name: "msgdialog",
  props:['manage'],
  data() {
    return {
      dialogVisible:false,
      title:'',
      formData:{},
      typedata:[],
      keys:null,
      disabled:false,
      rtype:null,
      rules:{
        newstype:[{required: true, trigger: "change", message: "请选择新闻类别"}],
        pushstate:[{required: true, trigger: "change", message: "请选择是否批量推送"}],
        pushusertype:[{required: true, trigger: "change", message: "请选择推送群组"}],
        title:[{required: true, trigger: "blur", message: "请选择新闻标题"}],
        content:[{required: true, trigger: "blur", message: "请填写新闻内容"}],
        reply:[{required: true, trigger: "change", message: "请选择是否需要回复"}],
        replyidea:[{required: true, trigger: "blur", message: "请填写回复信息"}]
      },
      editorOption: {
        theme: "snow",
        bounds: document.body,
        placeholder: "请输入新闻内容",
        debug: 'warn',
        readOnly:false,
        modules: {
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
    quillEditor,
    unRead
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
    async getUsers(){
      let res = await getalltype()
      if(res.code == 200 && res.data){
        this.typedata = res.data
      }
    },
    async showEdit(pid,loading,index,rtype){
      this.rtype = rtype ? rtype : null
      this.getUsers()
      if(!pid && this.manage) {
        this.title = '通知公告添加'
        this.disabled = false
        this.keys = null
      }
      if(pid){
        let res = await getNewstail({pid})
        this.formData = res.data
        this.disabled = true
        this.keys = index
        this.title = this.manage ? '查看通知公告' : '查看通知'
      }
      if(loading){
        loading.close();
      }
      this.dialogVisible = true
    },
    getData(){
      this.handleClose()
      this.$emit('getData')
      // this.$emit('getMess')
    },
    readData(){
      this.$baseConfirm('你确定要已阅吗？','提示信息',async ()=>{
        let res = await getReadnews({pid:this.formData.pid})
        if(res.code == 200){
          this.$message.success('已阅')
          this.getData()
        }
      })
    },
    pushData(){
      this.$refs.uread.showRead(this.formData.pid)
    },
    saveData(){
      this.$refs.formData.validate(async (valid)=>{
        if(valid){
          let data = Object.assign({},this.formData)
          let params = Object.assign({},{pid:this.formData.pid,replayidea:this.formData.replyidea})
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          let res = this.manage ? await putNews(data) : await getReadnews(params)
          if(res.code === 200){
            loading.close();
            this.$message.success(this.manage ? '添加成功' : '回复成功')
            this.getData()
          }
        }else{
          return false
        }
      })
    },
    handleClose(){
      this.title = ''
      this.rtype = null
      this.disabled = false
      this.$refs.formData.resetFields();
      this.formData = this.$options.data().formData;
      this.dialogVisible = false;
    },
    onEditorBlur(quill){

    },
    onEditorFocus(quill){

    },
    onEditorReady(quill){

    },
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__body{
  .el-form{
    .el-form-item{
      .el-input, .el-select,.el-textarea ,.el-cascader{
        width: 100%;
      }
      ::v-deep{
        .el-input--small .el-input__inner{
          height: 38px;
          line-height: 38px;
        }
        .editor {
          line-height: normal !important;
          .ql-container{
            height: 320px;
          }
        }
        .numper{
          font-size: 15px;
          color: #0b87c1;
        }
        .el-cascader{
          .el-cascader__tags{
            flex-direction: row;
            max-height: 160px;
            overflow-y: auto;
            .el-tag{
              width: 48%;
              &:first-child{
                margin-left: 10px;
              }
            }
          }
        }
      }
    }
  }
}
.el-dialog__footer{
  .el-button{
    padding:11px 25px;
    font-size: 15px;
  }
}
</style>
