<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="75%"  custom-class="zhao"
    :before-close="keys == 2 ? lookClose : handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="frestData" :model="frestData" :rules="rules" status-icon label-width="12vmax">
      <el-form-item label="招生年度:" prop="annual">
        <el-input type="number" v-model="frestData.annual" placeholder="请输入" :disabled="disabled" style="width:130px" />
      </el-form-item>
      <el-form-item label="第一批次报名时间区间:" prop="onestarttime">
        <el-date-picker style="width:14vmax" v-model="frestData.onestarttime"  :clearable="false" type="date" format="yyyy-MM-dd"
          value-format="yyyy-MM-dd" :picker-options="pickeroptionsstart" placeholder="开始时间" @change="handlestart" :disabled="disabled"/>--
        <el-date-picker style="width:14vmax" v-model="frestData.oneendtime"   :clearable="false" type="date" format="yyyy-MM-dd"
          value-format="yyyy-MM-dd" :picker-options="pickerOptionsEnd" placeholder="截止时间" @change="handleEnd" :disabled="disabled" />
          <span style="color:red">注：开始时间的00：00到结束时间的23：59</span>
      </el-form-item>
      <el-form-item label="第二批次报名时间区间:" prop="twostarttime">
        <el-date-picker style="width:14vmax" v-model="frestData.twostarttime"  :clearable="false" type="date" format="yyyy-MM-dd"
          value-format="yyyy-MM-dd" :picker-options="pickeroptionsstart1" placeholder="开始时间" @change="handlestart"
          :disabled="disabled" />--
        <el-date-picker style="width:14vmax" v-model="frestData.twoendtime"  :clearable="false" type="date" format="yyyy-MM-dd"
          value-format="yyyy-MM-dd" :picker-options="pickerOptionsEnd1" placeholder="截止时间" @change="handleEnd"
          :disabled="disabled" /><span style="color:red">注：开始时间的00：00到结束时间的23：59</span>
      </el-form-item>
      <el-form-item label="补录阶段时间区间:" prop="threestarttime">
        <el-date-picker style="width:14vmax" v-model="frestData.threestarttime"  :clearable="false" type="date" format="yyyy-MM-dd"
          value-format="yyyy-MM-dd" :picker-options="pickeroptionsstart2" placeholder="开始时间" @change="handlestart"
          :disabled="disabled" />--
        <el-date-picker style="width:14vmax" v-model="frestData.threeendtime"  :clearable="false" type="date" format="yyyy-MM-dd"
          value-format="yyyy-MM-dd" :picker-options="pickerOptionsEnd2" placeholder="截止时间" @change="handleEnd"
          :disabled="disabled" /><span style="color:red">注：开始时间的00：00到结束时间的23：59</span>
      </el-form-item>
      <el-form-item label="移动端首页报名阶段说明:" prop="contentone">
        <quill-editor v-model="frestData.contentone" ref="myQuillEditor" class="editor" :options="editorOption" style="width:45vmax;" :disabled="disabled" ></quill-editor>
      </el-form-item>
<!--      <el-form-item label="军官证提交时间:" prop="contenttwo">-->
<!--        <el-date-picker style="width:14vmax" v-model="frestData.contenttwo"  :clearable="false" type="date" format="yyyy年MM月dd日"-->
<!--          value-format="yyyy年MM月dd日"  placeholder="开始时间" @change="handlestart"-->
<!--          :disabled="disabled" />-->
<!--        </el-form-item>-->
      <el-form-item label="公办幼儿园招生计划(人):" class="fl">
        <el-form-item class="sz" :label=gl.schoolname v-for="(gl, index) in frestData.gschools" :key="gl.pid">
          <el-input v-model="gl.enrollsum" placeholder="请输入" :disabled="disabled" style="width:6vmax;" />
        </el-form-item>
      </el-form-item>
      <el-form-item label="民办幼儿园招生计划(人):" class="fl">
        <el-form-item :label=gl.schoolname v-for="(gl, index) in frestData.sschools" :key="gl.pid">
          <el-input v-model="gl.enrollsum" placeholder="请输入" :disabled="disabled" style="width:6vmax;" />
        </el-form-item>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="-" @click="saveData(frestData)" :disabled="disabled">保 存</el-button>
      <el-button size="-" @click="handleClose">返 回</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getsyschool, getxiangqing, getzsaddedit } from "@/views/kindern/api/kind"
import { ImageExtend, QuillWatch } from 'quill-image-extend-module'
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import { Quill, quillEditor } from 'vue-quill-editor'
Quill.register('modules/ImageExtend', ImageExtend)
export default {
  name: '',
  data() {
    return {
      dialogVisible: false,
      tabCard: 'baseinfo',
      title: '',
      frestData: {
        oneendtime:'',
        onestarttime:'',
        gschools: [{
          pid: '',
          enrollsum: '',
          schoolname:''
        }],
        sschools: [{
          pid: '',
          enrollsum: '',
          schoolname:''
        }],
      },
      rules: {
        annual: [
          { required: true, trigger: 'change', message: '请输入招生年度' },
        ],
        onestarttime:[
          { required: true, trigger: 'change', message: '请选择时间区间' },
        ],
        twostarttime:[
          { required: true, trigger: 'change', message: '请选择时间区间' },
        ],
        threestarttime:[
          { required: true, trigger: 'change', message: '请选择时间区间' },
        ],
        contentone:[
          { required: true, trigger: 'change', message: '请输入阶段说明' },
        ],
        // contenttwo:[
        //   { required: true, trigger: 'change', message: '请选择时间' },
        // ],
      },
      editorOption: {
        theme: "snow",
        bounds: document.body,
        placeholder: "请输入新闻内容",
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
      keys: null,
      disabled: false,
      id:'',
      pickeroptionsstart: {
      disabledDate:time=>{
        let kai = this.frestData.oneendtime;
        if(kai){
          return time.getTime() > new Date(kai).getTime();
        }
      }
     },
     pickerOptionsEnd:{
      disabledDate:time=>{
        let jieshu = this.frestData.onestarttime;
        if(jieshu){
          return time.getTime() < new Date(jieshu).getTime() - 1 * 24 * 60 * 60 * 1000;
        }
      }
     },
     pickeroptionsstart1: {
      disabledDate:time=>{
        let kai = this.frestData.twoendtime;
        if(kai){
          return time.getTime() > new Date(kai).getTime();
        }
      }
     },
     pickerOptionsEnd1:{
      disabledDate:time=>{
        let jieshu = this.frestData.twostarttime;
        if(jieshu){
          return time.getTime() < new Date(jieshu).getTime() - 1 * 24 * 60 * 60 * 1000;
        }
      }
     },
     pickeroptionsstart2: {
      disabledDate:time=>{
        let kai = this.frestData.threeendtime;
        if(kai){
          return time.getTime() > new Date(kai).getTime();
        }
      }
     },
     pickerOptionsEnd2:{
      disabledDate:time=>{
        let jieshu = this.frestData.threestarttime;
        if(jieshu){
          return time.getTime() < new Date(jieshu).getTime() - 1 * 24 * 60 * 60 * 1000;
        }
      }
     }
    }
  },
  props: ['tcard'],
  components: {
    quillEditor
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  created() {
    this.getsy()
  },
  mounted() { },
  methods: {

    handlestart() { },
    handleEnd() { },
    getsy() {
      getsyschool({ type: 1 }).then((res) => {
        this.frestData.gschools = res.data
      })
      getsyschool({ type: 2 }).then((res) => {
        this.frestData.sschools = res.data
      })
    },
    async showEdit(pid, index) {
      if (index == 2) {
        this.disabled = true
        this.title = "查看"
      } else if (index==3) {
        this.frestData = this.$options.data().frestData
        this.title = '编辑'
    }else{
      this.title = '新增'
      this.getsy();
    }
    if(index==2||index==3){
      this.id = pid
        let res = await getxiangqing({ pid: pid })
        this.frestData = res.data ? res.data : this.$options.data.frestData;
    }
    this.dialogVisible = true

    },
    lookClose() {
      this.dialogVisible = false
      this.title = ''
      this.frestData = this.$options.data().frestData
    },
    handleClose() {
      this.dialogVisible = false
      this.disabled = false
      this.title = ''
      this.frestData ={}
      this.$refs.frestData.resetFields()
      this.frestData = this.$options.data().frestData
    },
    saveData() {
      this.$refs.frestData.validate(async (valid) => {
        if (valid) {
          let res
          res = await getzsaddedit(this.frestData)
          if (res.code == 200) {
            this.$message.success('操作成功')
            this.handleClose()
            this.$emit('getData')
          }
        } else {
          return false
        }
      })
    },
  },
}
</script>
<style lang="scss">
.fl {
  display: flex;
    flex-wrap: wrap;
  .el-form-item__content {
    display: flex;
    flex-wrap: wrap;
  }
  .el-form-item__content{
    .el-form-item__label{
      margin-left: 1vmax;
      text-align: left;
    }
  }
}
.zhao{
  margin-top: 5vh !important;
  height:80% !important;
  .el-dialog__body{
    height:65vh;
  }
}
</style>
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
