<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="40%" top="2%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-radio-group v-if="civilData.pid && showkey == 2 && !cate" v-model="tabCard" class="radiogroup" @change="tabChange" size="-">
      <el-radio-button label="baseinfo">基本信息</el-radio-button>
      <el-radio-button label="flowover">
        <template v-if="tabname == 'current'">报名列表</template>
        <template v-if="tabname == 'history' && civilData.verificationstate == 0">待核验</template>
        <template v-if="tabname == 'history' && civilData.verificationstate == 1">已核验</template>
      </el-radio-button>
    </el-radio-group>
    <el-form ref="civilData" :model="civilData" :rules="rules" status-icon label-width="110px">
      <template v-if="cate">
        <el-form-item label="活动类型" prop="typename" label-width="80px">
          <el-input v-model="civilData.typename" placeholder="请输入活动类型"/>
        </el-form-item>
        <el-form-item label="发放积分" prop="numberofpoints" label-width="80px">
          <el-input v-model="civilData.numberofpoints" placeholder="请输入发放积分"/>
        </el-form-item>
        <el-form-item label="类别描述" prop="typedescripetion" label-width="80px">
          <el-input type="textarea" :rows="5" v-model="civilData.typedescripetion" placeholder="请输入类别描述"/>
        </el-form-item>
      </template>
      <template v-if="civil || vindex">
        <template v-if="tabCard == 'baseinfo'">
          <el-form-item label="活动名称" prop="activityname">
            <el-input v-model="civilData.activityname" :disabled="disabled" placeholder="请输入活动名称"/>
          </el-form-item>
          <el-form-item label="活动类别" prop="typeid">
            <el-select v-model="civilData.typeid" placeholder="请选择活动类别" @visible-change="visibleChange" :disabled="disabled">
              <el-option v-for="item in cateData" :key="item.pid" :label="item.name + ' ('+ item.nums +'积分)'" :value="item.pid"></el-option>
            </el-select>
          </el-form-item>
<!--          <el-form-item label="针对人群" prop="typeid">-->
<!--            <el-select v-model="civilData.typeid" placeholder="请选择针对人群" @visible-change="visibleChange" :disabled="disabled">-->
<!--              <el-option label="全部" :value="0"></el-option>-->
<!--              <el-option label="党员" :value="1"></el-option>-->
<!--              <el-option label="群众" :value="2"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="积分到账规则" prop="typeid">-->
<!--            <el-select v-model="civilData.typeid" placeholder="请选择积分到账规则" @visible-change="visibleChange" :disabled="disabled">-->
<!--              <el-option label="自动到账无需审核" :value="0"></el-option>-->
<!--              <el-option label="需人工审核" :value="1"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
          <el-form-item label="招募人数" prop="numberofrecruits">
            <el-input v-model="civilData.numberofrecruits" :disabled="disabled" placeholder="请输入招募人数" />
          </el-form-item>
          <el-form-item label="报名开始时间" prop="registrationstarttime">
            <el-date-picker v-model="civilData.registrationstarttime" popper-class="no-atTheMoment" :disabled="disabled" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" placeholder="请选择报名开始时间" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="报名结束时间" prop="registrationendtime">
            <el-date-picker v-model="civilData.registrationendtime" popper-class="no-atTheMoment" :disabled="disabled" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" placeholder="请选择报名结束时间" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="活动开始时间" prop="eventstarttime">
            <el-date-picker v-model="civilData.eventstarttime" popper-class="no-atTheMoment" :disabled="disabled" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" placeholder="请选择活动开始时间" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="活动结束时间" prop="eventendtime">
            <el-date-picker v-model="civilData.eventendtime" popper-class="no-atTheMoment" :disabled="disabled" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" placeholder="请选择活动结束时间" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="活动地点" prop="address">
            <el-input v-model="civilData.address" :disabled="disabled" placeholder="请输入活动地点" />
          </el-form-item>
          <el-form-item label="联系人" prop="contact">
            <el-input v-model="civilData.contact" placeholder="请输入联系人" />
          </el-form-item>
          <el-form-item label="联系方式" prop="contactphone">
            <el-input v-model="civilData.contactphone" placeholder="请输入联系方式" maxlength="11" />
          </el-form-item>
          <el-form-item label="封面图片" required>
            <div class="imgbox" v-if="showimg">
              <span v-if="showicon" @click="imgdel"><i class="el-icon-delete"></i></span>
              <el-image v-for="(item,index) in imgdata" :key="index" :src="item" :preview-src-list="imgdata" :z-index="2999" @click.native.stop></el-image>
            </div>
            <template v-if="!showimg">
              <coverload :imgLists="imgLists" @removeSuccess="removeSuccess" @uploadSuccess="uploadSuccess"/>
            </template>
          </el-form-item>
          <el-form-item label="活动内容" prop="content">
            <quill-editor v-model="civilData.content" ref="myQuillEditor" class="editor" :options="editorOption"></quill-editor>
          </el-form-item>
        </template>
        <template v-if="tabCard == 'flowover'">
          <template v-if="tabname == 'current'">
            <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" max-height="680" :element-loading-text="loadingText">
              <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
              <el-table-column prop="username" label="姓名" align="center"></el-table-column>
              <el-table-column prop="registrationtime" label="报名时间" align="center"></el-table-column>
            </el-table>
          </template>
          <template v-if="tabname == 'history'">
            <template v-if="userjson.length > 0">
              <el-checkbox v-model="checkedAll" class="alllist" :indeterminate="isIndeterminate" :disabled="dischecked" @change="handleAllChange">全选</el-checkbox>
              <el-checkbox-group v-model="checkedList" class="listcheck" @change="handleChange" :disabled="dischecked">
                <el-checkbox v-for="item in userjson" :key="item.pid" :label="item.pid">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </template>
            <template v-else>
              <span>暂无核验人员</span>
            </template>
          </template>
        </template>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="showkey == 1 ||!showkey" type="primary" size="-" @click="saveData">确 定</el-button>
      <el-button v-if="showkey == 2 && tabname == 'history' && civilData.verificationstate == 0 && !vindex" type="primary" size="-" @click="checkData">核 验</el-button>
      <el-button size="-" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor,Quill } from 'vue-quill-editor'
import {ImageExtend, QuillWatch} from 'quill-image-extend-module'
Quill.register('modules/ImageExtend', ImageExtend)
import {isNumber,isPhone} from "@/utils/validate";
import coverload from "@/views/voluntary/components/coverload";
import {
  deleteimgs,
  getactiveTail,
  getalllist,
  getNamelist,
  gettypeTail, getverifier,
  putactiveData,
  puttypeData, putverData
} from "@/views/voluntary/api/pracrice";
export default {
  name: "civildialog",
  data() {
    let numvalid = (rule, value, callback)=>{
      if(!value){
        return callback(new Error('请填写发放积分'))
      }else if(!isNumber(value)){
        return callback(new Error('请输入数字'))
      }else{
        callback()
      }
    }
    let numvalid0 = (rule, value, callback)=>{
      if(!value){
        return callback(new Error('请填写招募人数'))
      }else if(!isNumber(value)){
        return callback(new Error('请输入数字'))
      }else{
        callback()
      }
    }
    let phoneval = (rule, value, callback)=>{
      if(!value){
        return callback(new Error('请填写联系方式'))
      }else if(!isPhone(value)){
        return callback(new Error('请输入正确的联系方式'))
      }else{
        callback()
      }
    }
    return {
      tabCard:'baseinfo',
      dialogVisible:false,
      title:'',
      civilData:{},
      rules:{
        typename:[{required: true, trigger: "blur", message: "请填写活动类型"}],
        numberofpoints:[{required: true,validator:numvalid, trigger: "blur"}],
        typedescripetion:[{required: true, trigger: "blur", message: "请填写类别描述"}],
        activityname:[{required: true, trigger: "blur", message: "请填写活动名称"}],
        typeid:[{required: true, trigger: "change", message: "请选择活动类别"}],
        numberofrecruits:[{required: true,validator:numvalid0, trigger: "blur"}],
        registrationstarttime:[{required: true, trigger: "change", message: "请选择报名开始时间"}],
        registrationendtime:[{required: true, trigger: "change", message: "请选择报名结束时间"}],
        eventstarttime:[{required: true, trigger: "change", message: "请选择活动开始时间"}],
        eventendtime:[{required: true, trigger: "change", message: "请选择活动结束时间"}],
        address:[{required: true, trigger: "blur", message: "请填写活动地点"}],
        contact:[{required: true, trigger: "blur", message: "请填写联系人"}],
        contactphone:[{required: true,validator:phoneval, trigger: "blur"}],
        content:[{required: true, trigger: "blur", message: "请填写活动内容"}],
      },
      pickerOptions:{
        disabledDate(time) {
          return time.getTime() < Date.now() - (24*3600*1000);
        },
      },
      cateData:[],
      disabled:false,
      imgLists:[],
      imgdata:[],
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      editorOption: {
        theme: "snow",
        bounds: document.body,
        placeholder: "请输入活动内容",
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
      showkey:null,
      showimg:true,
      showicon:true,
      checkedAll:false,
      isIndeterminate:false,
      checkedList:[],
      userjson:[],
      dischecked:false
    }
  },
  props:['civil','cate','tabname','vindex'],
  components: {
    quillEditor,
    coverload
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
    async getCate(){
      let res = await getalllist()
      this.cateData = res.data ? res.data.map(item=>{
        return {
          pid:item.pid,
          name:item.typename,
          nums:item.numberofpoints
        }
      }) : []
    },
    async showData(pid,index){
      this.getCate()
      this.showimg = true
      if(!pid) {
        this.title = !this.cate ? '新建活动' : '新建活动类别'
        this.showkey = null
        this.showicon = true
        this.disabled = false
        let url = require('@/assets/mr.png')
        this.imgdata = [url]
      }
      if(pid){
        let res
        this.showkey = index
        if(this.cate){
          this.title = '编辑活动类别'
          res = await gettypeTail({pid})
          this.civilData = res.data
        }else if(this.civil || this.vindex){
          this.title = index == 1 ? '编辑活动' : '查看活动'
          this.disabled = true
          this.showicon = false
          res = await getactiveTail({pid})
          this.civilData = res.data
          this.imgdata = res.data.coverpicture ? res.data.coverpicture.split(',').map(item=>{
              return `${this.$baseUrl}/gridfs/image/${item}`
          }) : []
          this.dischecked = this.civilData.verificationstate == 0 ?  false : true
          this.getregisList()
        }
      }
      this.dialogVisible = true
    },
    async getregisList(){
      let res = await getNamelist({pid:this.civilData.pid})
      this.tableData = res.data
      this.tabloading = false
      this.userjson = res.data.length > 0 ? res.data.map(item=>{
        return {
          pid:item.pid,
          name:item.username
        }
      }) : []
      let json = await getverifier({pid:this.civilData.pid})
      this.checkedList = json.data.length > 0 ? json.data.map(item=> item.toString()) : []
      this.checkedAll = json.data.length == this.userjson.length
      this.isIndeterminate = json.data.length > 0 && json.data.length < this.userjson.length
    },
    tabChange(val){
      this.tabCard = val
    },
    handleClose(){
      this.title = ''
      this.imgLists = []
      this.imgdata = []
      this.checkedAll = false
      this.isIndeterminate = false
      this.checkedList = []
      this.tabCard = 'baseinfo'
      this.$refs.civilData.resetFields()
      this.civilData = this.$options.data().civilData
      this.dialogVisible = false
    },
    visibleChange(e){
      if(e){
        this.cateData.length == 0 ? this.$message.warning('请先在类型规则中添加活动类别') : ''
      }
    },
    saveData(){
      this.$refs.civilData.validate(async (valid)=>{
        if(valid){
          let data = Object.assign({},this.civilData)
          let time = new Date().getTime()
          let time1 = new Date(data.registrationstarttime).getTime()
          let time2 = new Date(data.registrationendtime).getTime()
          let time3 = new Date(data.eventstarttime).getTime()
          let time4 = new Date(data.eventendtime).getTime()
          if(this.civil){
            if(!this.civilData.pid){
              let str = '';
              if(time1 <= time){
                str = '报名开始时间应大于当前时间'
              }else if(time2 <= time1){
                str = '报名开始时间应小于报名结束时间'
              }else if(time3 <= time2){
                str = '活动开始时间应大于报名结束时间'
              }else if(time4 <= time3){
                str = '活动结束时间应大于活动开始时间'
              }
              if(str != ''){
                this.$message.error(str)
                return false
              }
            }
            if(this.showimg){
              Object.assign(data,{coverpicture:'61f1046f711c2a3d88d1c192'})
            }else{
              if(this.imgLists.length > 0){
                Object.assign(data,{coverpicture:this.imgLists.map(item=> item.fileid).join(',')})
              }else{
                this.$message.error('请上传封面图片')
                return false
              }
            }
          }
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          let res = this.cate ? await puttypeData(data) : await putactiveData(data)
          if(res.code == 200){
            loading.close();
            this.$message.success(this.cate ? this.showkey&&this.showkey == 1 ? '活动类别修改成功': '活动类别添加成功' : this.showkey&&this.showkey == 1 ? '活动修改成功':'活动添加成功')
            this.handleClose()
            this.$emit('getData','current')
          }
        }else{
          return false
        }
      })
    },
    async checkData(){
      if(this.checkedList.length == 0){
        this.$message.error('请勾选核验人！')
        return false
      }else {
        let data = {
          pid:this.civilData.pid,
          users:this.checkedList
        }
        let res = await putverData(data)
        if(res.code = 200){
          this.$message.success('核验成功')
          this.handleClose()
          this.$emit('getData','history')
        }else {
          this.$message.error(res.msg)
          return
        }
      }
    },
    handleAllChange(val){
      this.checkedList = val ? this.userjson.map(item=> item.pid) : []
      this.isIndeterminate = false
    },
    handleChange(val){
      let count = val.length
      this.checkedList = val
      this.checkedAll = count === this.userjson.length
      this.isIndeterminate = count > 0 && count < this.userjson.length
    },
    handleCustomMatcher(node, Delta) {
      let ops = []
      Delta.ops.forEach(op => {
        // 如果粘贴了图片，这里会是一个对象，所以可以这样处理
        if (op.insert && (op.insert.image.indexOf('47.104.12.127') > -1 || typeof op.insert.image == 'string')) {
          ops.push({
            insert: op.insert,
          })
        }else{
          this.$message.error('不允许粘贴图片,请手动上传')
          return false
        }
      })
      Delta.ops = ops
      return Delta
    },
    onEditorBlur(quill){

    },
    onEditorFocus(quill){

    },
    onEditorChange(quill){

    },
    imgdel(){
      this.$message.success('删除成功')
      this.showimg = false
      this.showicon = false
    },
    async removeSuccess(fileId,fileList){
      let res = await deleteimgs({fileId})
      if(res.code === 200){
        this.$message.success("删除成功")
      }
      this.imgLists = fileList;
    },
    uploadSuccess(str){
      this.imgLists = [{fileid:str, url:`${this.$baseUrl}/gridfs/image/${str}`}]
    },
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__body{
  .radiogroup {
    display: block;
    text-align: center;
    margin-bottom: 15px;
  }
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
            height: 300px;
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
        .imagebox{
          width: 150px;
          height: 150px;
          background-color: #f3f3f3;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          border-radius: 5px;
          i{
            font-size: 30px;
            color: #999;
          }
          u{
            text-decoration: none;
            font-size: 15px;
            color: #999;
          }
        }
        .imgbox{
          width: 148px;
          height: 148px;
          position:relative;
          span{
            width:40px;
            height:30px;
            background-color:rgba(0,0,0,.5);
            display:flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position:absolute;
            right:0;
            z-index: 10;
            border-top-right-radius:5px;
            border-bottom-left-radius:50px;
            cursor: pointer;
            i{
              font-size:20px;
              color:#fff;
              padding-left:8px;
            }
          }
          .el-image{
            width:100%;
            height:100%;
            float: left;
            border-radius: 5px;
            box-shadow: 0 1px 3px 1px rgba(0,0,0,.1);
            margin-right: 10px;
            margin-bottom: 10px;
            z-index: 9;
          }
        }
      }
    }
    .alllist{
      width:10%;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 10px;
    }
    .listcheck{
      overflow: hidden;
      .el-checkbox{
        float: left;
        width:14%;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-right:0;
        margin-bottom:15px;
      }
    }
    span{
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 18px;
      color: #999;
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
