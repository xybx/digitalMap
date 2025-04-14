<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="40%" top="1%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="formData" :model="formData" :rules="rules" status-icon label-width="120px">
      <template v-if="cnews">
        <el-form-item label="资讯类别" prop="newstype">
          <el-select v-model="formData.newstype" placeholder="请选择新闻类别" :disabled="disabled">
            <el-option v-for="item in cateData" :key="item.pid" :value="item.pid" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否批量推送" prop="pushstate">
          <el-select v-model="formData.pushstate" placeholder="请选择是否批量推送" disabled>
            <el-option :value="0" label="否"></el-option>
            <el-option :value="1" label="是"></el-option>
          </el-select>
        </el-form-item>
        <template v-if="!formData.pid">
          <el-form-item label="推送区域(街道)" prop="pushusers">
            <el-cascader class="newper" v-model="formData.villageIds" :options="options" :props="props" filterable placeholder="请选择推送人员" @change="changeUser"></el-cascader>
            <span v-if="formData.villageIds" class="numper">(已选{{formData.villageIds.length}}区域(街道))</span>
          </el-form-item>
        </template>
        <el-form-item label="资讯标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入新闻标题" :disabled="disabled" />
        </el-form-item>
        <el-form-item label="资讯内容" prop="content">
          <quill-editor v-model="formData.content" ref="myQuillEditor" class="editor" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="展现形式" prop="formtype">
            <el-select v-model="formData.formtype" placeholder="请选择展现形式" disabled>
              <el-option :value="0" label="图片轮播"></el-option>
              <el-option :value="1" label="文字轮播"></el-option>
              <el-option :value="2" label="列表"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="文件附件">
          <FilesUpload :fileList="dataLists" :type="9" :showkey="showkey" :dataList="dataLists" @FileremoveSuccess="FileremoveSuccess" @FileuploadSuccess="FileuploadSuccess" @FiledownSuccess="FiledownSuccess" />
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="新闻分类" prop="name">
          <el-input v-model="formData.name" placeholder="请输入新闻分类" />
        </el-form-item>
        <el-form-item label="积分" prop="integral">
          <el-input v-model.number="formData.integral" placeholder="请输入积分" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formData.describe" type="textarea" :rows="5" placeholder="请输入描述"/>
        </el-form-item>
      </template>
    </el-form>
    <unRead ref="uread" :state="formData.pushstate" @getData="getData" />
    <span slot="footer" class="dialog-footer">
      <el-button v-if="key != 1" type="primary" @click="saveData">确 定</el-button>
      <el-button v-if="key == 1 && formData.pushstate == 1 && (formData.allpushcount != formData.readpushcount)" type="primary" @click="pushData">未阅人员推送</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import unRead from  './unread'
import {mapGetters} from 'vuex'
import {getNewsId, getNcateId, putNews, putNcate, getNcateList} from '../api/news'
import {getAreaList, imgDelete} from "@/views/conven/api/conven";
import {getLevelList} from "@/views/levelresident/api/levrest";
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor,Quill } from 'vue-quill-editor'
import {ImageExtend, QuillWatch} from 'quill-image-extend-module'
import {isNumber} from "@/utils/validate";
import FilesUpload from "@/components/FilesUpload.vue";
import {getDate} from "@/utils/timeDate";
import {delFiles} from "@/api/user";
Quill.register('modules/ImageExtend', ImageExtend)
export default {
  name: "newdialog",
  props:['cnews'],
  data() {
    let numberValid = (rule, value, callback)=>{
      if(!value){
        return callback(new Error('请输入积分'))
      } else if(!isNumber(value)){
        return callback(new Error('积分必须是数字'))
      }else {
        callback()
      }
    }
    return {
      dialogVisible:false,
      title:'',
      formData:{
        pushstate:1,
        formtype:1
      },
      cateData:[],
      options:[],
      props:{
        emitPath:false,
        multiple:true,
        expandTrigger: 'click',
        value: "id",
        label: "name",
        children: "children",
      },
      selectAllData:[],
      selectStates:0,//是否全选过
      fileLists:[],
      dataLists:[],
      disabled:false,
      type:2,
      key:null,
      showkey:true,
      rules:{
        newstype:[{required: true, trigger: "change", message: "请选择新闻类别"}],
        pushstate:[{required: true, trigger: "change", message: "请选择是否批量推送"}],
        villageIds:[{required: true, trigger: "change", message: "请选择推送区域"}],
        title:[{required: true, trigger: "blur", message: "请选择新闻标题"}],
        content:[{required: true, trigger: "blur", message: "请填写新闻内容"}],
        formtype:[{required: true, trigger: "change", message: "请选择展现形式"}],
        name:[{required: true, trigger: "blur", message: "请填写新闻分类"}],
        integral:[{required: true,validator:numberValid, trigger: "blur"}]
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
    }
  },
  components: {
    FilesUpload,
    quillEditor,
    unRead
  },
  computed: {
    ...mapGetters({
      userData:'user/userData'
    }),
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    newContent(val){
      this.$set(this.formData,"content",val);
    },
    async getUsers(){
      let res = await getLevelList()
      if(res.code == 200){
        let allpot = {
          id:0,
          name:'全选',
          children:[{id:0, name:'全选'}]
        }
        this.options = res.data.map(item=>{
          return {
            id:item.pid,
            name:item.areaname,
            children:!!item.children? item.children.map(val=>{
                return {
                  id:val.pid,
                  name:val.areaname
                }
            }) : []
          }
        })
        this.options.unshift(allpot)
      }
    },
    async showEdit(id,index,loading){
      this.key = index ? index : null
      this.showkey = this.key == 1 ? false : true
      let arr = ['查看资讯','编辑资讯','资讯添加']
      this.title = arr[index-1]
      if(id){
        let res = await getNewsId({pid:id})
        this.formData = res.data
        this.disabled = index ? true : false
        this.dataLists = res.data.documents && res.data.documents.length > 0 ? res.data.documents.map(item=>{
            return {
              filename:item.filename,
              name:item.filename,
              fileid:item.fileid,
              createTime:item.uploaddate
            }
          }):[]
      }
      if(loading){
        loading.close();
      }
      this.getUsers()
      this.getCate()
      this.dialogVisible = true
    },
    async showNate(id,index){
      this.key = index ? index : null
      let arr = ['查看资讯分类','编辑资讯分类','资讯分类添加']
      this.title = arr[index-1]
      if(id){
        let res = await getNcateId({pid:id})
        this.formData = res.data
      }
      this.dialogVisible = true
    },
    getFiles(arr){
      let fileArr = arr.map(item=>{
        return {
          fileid:item.fileid,
          url:`${this.$baseUrl}/gridfs/image/${item.fileid}`
        }
      });
      this.fileLists = fileArr
    },
    pushData(){
      this.$refs.uread.showRead(this.formData.pid)
    },
    async getCate(){
      let data = {
        pagenumber:1,
        pagesize:9000,
        uid:this.userData.pid
      }
      let res = await getNcateList(data)
      if(res.code === 200){
        this.cateData = res.data
      }
    },
    getData(){
      this.handleClose()
      this.$emit('getData')
    },
    saveData(){
      this.$refs.formData.validate(async (valid)=>{
        if(valid){
          if(this.key == 3&&this.cnews &&this.formData.pushstate == 1 &&this.formData.pushusers.indexOf(0) > -1){
            this.formData.pushusers.shift()
          }
          let data = Object.assign({},this.formData,{areaid:this.userData.areaid,areaname:this.userData.areaname})
          this.dataLists.length > 0 ? Object.assign(data,{documents:this.dataLists}) : Object.assign(data,{documents:[]})
          Object.assign(data,this.formData)
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          let res = this.cnews ? await putNews(data) : await putNcate(data)
          if(res.code === 200){
            loading.close();
            this.$message.success('发布成功')
            this.getData()
          }
        }else {
          return false
        }
      })
    },
    FileuploadSuccess(fileList){
      this.dataLists = fileList.map(item =>{
        return {
          filename:item.name ? item.name : item.filename,
          name:item.name ? item.name : item.filename,
          fileid:item.fileid ? item.fileid:item.response.data,
          createTime: item.createTime ? item.createTime : getDate('yyyy-MM-dd hh:mm:ss',new Date())
        }
      })
    },
    async FileremoveSuccess(fileid){
      let res = await delFiles({fileid})
      if(res.code == 200){
        this.dataLists = this.dataLists.filter(item=> item.fileid!=fileid)
        this.$message.success("删除成功")
      }
    },
    FiledownSuccess(fileid,name){
        let a = document.createElement('a');
        let event = new MouseEvent('click');
        a.download = name;
        a.href = `${this.$baseUrl}/gridfs/downloadFile?fileid=${fileid}`;
        a.dispatchEvent(event);
    },
    handleClose(){
      this.title = ''
      this.disabled = false
      this.fileLists = []
      this.dataLists = []
      this.options = []
      this.key = null
      this.$refs.formData.resetFields();
      this.formData = this.$options.data().formData;
      this.dialogVisible = false;
    },
    changeUser(val){
      if(val.length == 1 && val[0] === 0 && this.selectStates == 0){
        this.formData.pushusers = this.handleSelectAllCity()
        this.selectStates = 1
        this.scrollToBottom()
        return false
      }
      if(this.selectStates == 1){
        this.formData.pushusers = val.includes(0) ? val : []
        this.selectStates = this.formData.pushusers.length == 0 ? 0 : 1
        return false
      } else{
        this.formData.pushusers = val
        this.selectStates = 0
        this.scrollToBottom()
      }
    },
    handleSelectAllCity(){
      for(let i=0;i<this.options.length;i++){
        if(this.options[i].children.length >= 1){
          for(let n=0;n<this.options[i].children.length;n++){
              let str = this.options[i].children[n].id
              this.selectAllData.push(str)
          }
        }
      }
      return [...new Set(this.selectAllData)]
    },
    scrollToBottom(){
      this.$nextTick(()=>{
        setTimeout(()=>{
          let container = this.$el.querySelector(".newper > .el-cascader__tags");
          container.scrollTop = container.scrollHeight
        },100)
      })
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
