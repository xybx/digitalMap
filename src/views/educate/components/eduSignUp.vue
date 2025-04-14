<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="42%" top="3%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="signData" :model="signData" :rules="rules" status-icon label-width="150px" :disabled="disabled">
      <el-form-item label="招生年度" prop="year">
        <el-date-picker v-model="signData.year" type="year" value-format="yyyy" placeholder="选择招生年度" clearable  @change="yearChange"/>
      </el-form-item>
      <el-form-item label="报名开始时间" prop="startTime">
        <el-date-picker v-model="signData.startTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择报名开始时间" clearable @change="signChange"></el-date-picker>
      </el-form-item>
      <el-form-item label="报名结束时间" prop="endTime">
        <el-date-picker v-model="signData.endTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择报名结束时间"  clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="小学年龄开始时间" prop="xxstartTime">
        <el-date-picker v-model="signData.xxstartTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择小学年龄开始时间" clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="小学年龄结束时间" prop="xxendTime">
        <el-date-picker v-model="signData.xxendTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择小学年龄结束时间"  clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="初中年龄开始时间" prop="czstartTime">
        <el-date-picker v-model="signData.czstartTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择初中年龄开始时间" clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="初中年龄结束时间" prop="czendTime">
        <el-date-picker v-model="signData.czendTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择初中年龄结束时间" clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="特殊情况报名时间" prop="offlineTime">
        <el-date-picker v-model="signData.offlineTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择线下特殊情况报名时间" clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="报名结果公布时间" prop="lqdate">
        <el-date-picker v-model="signData.lqdate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择报名结果公布时间" clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="报名须知" prop="announcement">
        <quill-editor v-model="signData.announcement" ref="myQuillEditor" class="editor" :options="editorOption" :disabled="disabled"></quill-editor>
      </el-form-item>
      <el-form-item label="录取通知" prop="schoolNotice">
        <quill-editor v-model="signData.schoolNotice" ref="myQuillEditor" class="editor" :options="editorOption" :disabled="disabled"></quill-editor>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="keys != 3" type="primary" size="-" @click="saveData">保 存</el-button>
      <el-button size="-" @click="handleClose">返 回</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {getSignTailApi, putSignUpApi} from "@/views/educate/api/eduapi";
import { ImageExtend, QuillWatch } from 'quill-image-extend-module'
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import { Quill, quillEditor } from 'vue-quill-editor'
Quill.register('modules/ImageExtend', ImageExtend)
export default {
  name: "eduSignUp",
  data(){
    return {
      dialogVisible:false,
      title:'',
      signData:{},
      rules:{
        year:[{required:true,trigger:'change',message:'请选择招生年度'}],
        startTime:[{required:true,trigger:'change',message:'请选择报名开始时间'}],
        endTime:[{required:true,trigger:'change',message:'请选择报名结束时间'}],
        xxstartTime:[{required:true,trigger:'change',message:'请选择小学年龄开始时间'}],
        xxendTime:[{required:true,trigger:'change',message:'请选择小学年龄结束时间'}],
        czstartTime:[{required:true,trigger:'change',message:'请选择初中年龄开始时间'}],
        czendTime:[{required:true,trigger:'change',message:'请选择初中年龄结束时间'}],
        offlineTime:[{required:true,trigger:'change',message:'请选择特殊情况报名时间'}],
        lqdate:[{required:true,trigger:'change',message:'请选择报名结果公布时间'}],
        announcement:[{required:true,trigger:'blur',message:'请输入报名须知'}],
        schoolNotice:[{required:true,trigger:'blur',message:'请输入录取通知'}]
      },
      keys:null,
      pid:null,
      disabled:false,
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
              [{ color: [] } ], // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
              [{ font: [] }], // 字体种类-----[{ font: [] }]
              [{ align: [] }], // 对齐方式-----[{ align: [] }]
              ["clean"], // 清除文本格式-----['clean']
              // ["link","image"] // 链接、图片、视频-----['link', 'image', 'video']
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
  props:['tcard'],
  components:{
    quillEditor
  },
  computed:{
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  created() {

  },
  mounted() {

  },
  methods:{
    async showEdit(pid,index){
      this.keys = index
      this.pid = pid ? pid : null
      this.disabled = index == 3 ? true : false
      this.title = index == 1 ? '添加信息' : index == 2 ? '编辑信息' : '查看信息'
      if(pid){
        let {data} = await getSignTailApi({pid})
        if(data.code == 200){
          this.signData = data.data ? data.data : {}
          this.signData.year = String(data.data.year)
        }else {
          this.$message.error(res.msg)
          return false
        }
      }
      this.dialogVisible = true
    },
    yearChange(val){
      console.log(val)
    },
    signChange(val){
      console.log(val)
      this.$forceUpdate()
      this.signData.signTime = val
    },
    saveData(){
       this.$refs.signData.validate(async (valid)=>{
         if(valid){
          let obj = Object.assign({},this.signData)
          if(this.pid){
            Object.assign(obj,{pid:this.pid})
          }
          let { data } = await putSignUpApi(obj)
           if(data.code == 200){
             this.$message.success('保存成功')
             this.handleClose()
             this.$emit('getData')
           }else {
             this.$message.error(data.msg)
             return false
           }
         }else {
           return false
         }
       })
    },
    handleClose(){
      this.keys = null
      this.title = ''
      this.pid = null
      this.$refs.signData.resetFields()
      this.signData = this.$options.data().signData
      this.dialogVisible = false
    },
    handleCustomMatcher(node, Delta) {
      let ops = []
      Delta.ops.forEach(op => {
        // 如果粘贴了图片，这里会是一个对象，所以可以这样处理
        console.log(op)
        if (op.insert && (op.insert.image.indexOf('39.75.167.89') > -1 || typeof op.insert.image == 'string')) {
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
<style scoped lang="scss">
.el-dialog__body{
  .el-form{
    .titlebox{
      overflow: hidden;
      padding: 0;
      margin-bottom:20px;
      i{
        display: inline-block;
        width: 4px;
        height: 16px;
        background-color:#0C9ED7;
        position: relative;
        top: 2px;
      }
      span{
        font-size: 16px;
        color: #333;
        margin-left: 10px;
      }
    }
    .el-divider{
      margin: 10px 0;
    }
    .el-form-item{
      .el-input, .el-select,.el-textarea ,.el-cascader,.el-date-editor{
        width: 100%;
      }
      ::v-deep{
        .editor {
          line-height: normal !important;
          .ql-container{
            height:260px;
          }
        }
      }
    }
  }
}
</style>
