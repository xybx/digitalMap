<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="35%" top="10%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="formdata" :model="formdata" status-icon :label-width="labelwidth">
      <template v-if="index == 0">
        <el-form-item label="积分规则" required>
          <quill-editor v-if="dialogVisible" v-model="formdata.des" ref="myQuillEditor" class="editor" :options="editorOption" @change="onEditorChange($event)"></quill-editor>
          <div style="text-align:right">
            {{TiLength}}/800
          </div>
        </el-form-item>
      </template>
      <template v-else-if="index == 1">
        <el-form-item label="签到是否送积分">
          <el-switch v-model="formdata.state" :active-value="1" :inactive-value="0" :disabled="type == 2 ? false : true" @change="switchClick"></el-switch>
        </el-form-item>
        <el-form-item label="每次签到积分值" :required="formdata.state == 1 ? true : false">
          <el-input v-model="formdata.quantity" placeholder="请输入签到积分值" :disabled="disabled" />
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="type == 2" type="primary" size="medium" @click="saveData">确 认</el-button>
      <el-button size="medium" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {getinteList,putintel,getinteset,putinteset} from '../api/integral'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  name: "intedialog",
  data() {
    return {
      dialogVisible:false,
      title:'',
      formdata:{},
      index:'',
      type:'',
      labelwidth:'',
      disabled:false,
      TiLength:0,
      editorOption: {
        theme: "snow",
        bounds: document.body,
        placeholder: "请输入积分规则",
        debug: 'warn',
        readOnly:false,
        modules: {
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
              ["link"] // 链接、图片、视频-----['link', 'image', 'video']
            ],
          }
        }
      },
    }
  },
  components: {
    quillEditor,
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  created() {
    this.formdata.state = 0
  },
  mounted() {
  },
  methods: {
    async showEdit(index,type){
      this.type = type
      this.index = index
      if(index == 0){
        this.labelwidth = '80px'
        if(type == 1){
          this.title = '查看积分规则'
        }else {
          this.title = '编辑积分规则'
        }
      }else if(index == 1){
        this.labelwidth = '120px'
        if(type == 1){
          this.title = '查看签到积分设置'
        }else {
          this.title = '编辑签到积分设置'
        }
      }
      let res = index === 0 ? await getinteList() : await getinteset()
      if(res.code == 200){
        if(index === 0){
          this.formdata.des = res.data ? res.data : ''
          this.TiLength = this.formdata.des.length
        }else {
          this.formdata = res.data ? res.data : {}
          if(res.data.state == 0){
            this.disabled = true
          }else {
            this.disabled = false
          }
        }
      }
      this.dialogVisible = true
    },
    onEditorChange(event){
      event.quill.deleteText(800,1);
      if(this.formdata?.des.length === 0){
        this.TiLength = 0
      }else{
        this.TiLength = this.formdata?.des.length
      }
    },
    switchClick(val){
      if(val == 0){
        this.disabled = true
      }else {
        this.disabled = false
      }
    },
    async saveData(){
      let data = this.formdata
      if(this.index == 0){
        if(!this.formdata.des || this.formdata.des == ''){
          this.$message.error('请填写积分规则')
          return false
        }
      }
      if(this.index == 1 && this.formdata.state == 1){
        if(this.formdata.quality == '' || !this.formdata.quantity){
          this.$message.error('请填写签到积分值')
          return false
        }
      }
      let res = this.index == 0 ? await putintel(data) :await putinteset(data)
      if(res.code == 200){
        this.$message.success('修改成功')
        this.handleClose()
      }
    },
    handleClose(){
      this.title = ''
      this.TiLength = 0
      this.disabled = false
      this.$refs.formdata.resetFields()
      this.formdata = this.$options.data().formdata
      this.dialogVisible = false
    },
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__body{
  .el-form{
    .el-form-item{
      .el-input, .el-select{
        width: 100%;
      }
      &:last-child{
        margin-bottom: 0;
      }
      ::v-deep{
        .el-input--small .el-input__inner{
          height: 38px;
          line-height: 38px;
        }
        .editor {
          line-height: normal !important;
          .ql-container{
            height:420px;
          }
        }
      }
    }
  }
}
</style>
