<template>
    <el-dialog :visible.sync="dialogVisible" width="45%" top="1%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
      <div slot="title" class="dialogheader">
        <span>{{title}}</span>
        <el-radio-group  v-model="tabCard" class="radiogroup" @change="tabChange" size="medium">
          <el-radio-button label="baseinfo">基本信息</el-radio-button>
          <el-radio-button label="flowover">办理流程</el-radio-button>
        </el-radio-group>
      </div>
      <template v-if="tabCard === 'baseinfo'">
      <div class="infobox">
        <div class="titbox">
          <i></i>
          <span>信访信息</span>
        </div>
        <el-form :inline="true" :model="readData" status-icon label-width="80px">
          <el-form-item label="问题属地">
            <el-input v-model="readData.villagename" placeholder="请输入问题属地" disabled />
          </el-form-item>
          <el-form-item label="主要诉求">
            <el-input v-model="readData.appeal" placeholder="请输入主要诉求" disabled />
          </el-form-item>
          <el-form-item label="主要事实">
            <el-input v-model="readData.fact" type="textarea" :rows="5" placeholder="请输入主要事实" disabled />
          </el-form-item>
          <el-form-item label="信访目的">
            <el-input v-model="readData.typename" placeholder="请输入信访目的" disabled />
          </el-form-item>
          <el-form-item label="信访图片">
            <div v-if="!imgdata.length" class="imagebox">
              <i class="el-icon-picture-outline"></i>
              <u>暂无图片</u>
            </div>
            <template v-else>
              <el-image v-for="(item,index) in imgdata" :key="index" :src="item" :preview-src-list="imgdata" :z-index="2999"></el-image>
            </template>
          </el-form-item>
        </el-form>
      </div>
      <div class="infobox" v-if="!remain && scard !== 'unsuper'">
        <div class="titbox">
          <i></i>
          <span>信访人信息</span>
        </div>
        <el-form :inline="true" :model="readData" status-icon label-width="80px">
          <el-form-item label="姓名">
            <el-input v-model="readData.petitionername" placeholder="请输入姓名" disabled />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="readData.petitionerphone" placeholder="请输入手机号" disabled />
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="readData.petitioneridcard" placeholder="请输入身份证号" disabled />
          </el-form-item>
          <el-form-item label="联系地址">
            <el-input v-model="readData.petitioneradress" placeholder="请输入联系地址" disabled />
          </el-form-item>
        </el-form>
      </div>
      <div class="infobox" v-if="remain">
        <div class="titbox">
          <i></i>
          <span>信访回复信息</span>
        </div>
        <el-form ref="formData" :model="formData" :rules="frules" class="formdata" status-icon label-width="80px">
          <el-form-item label="回复意见" prop="idea">
            <el-input v-model="formData.idea" type="textarea" :rows="5" placeholder="请输入回复意见" />
          </el-form-item>
          <el-form-item label="回复图片">
            <uploadImage :imgLists="imgLists" :petion="true" @removeSuccess="removeSuccess" @uploadSuccess="uploadSuccess" />
          </el-form-item>
          <el-form-item label="上传附件">
            <uploadFile :fileLists="fileLists" @removeFile="removeFile" @uploadFile="uploadFile" />
          </el-form-item>
        </el-form>
      </div>
      <div class="infobox" v-if="!audit && !remain && readData.letteridea">
        <div class="titbox">
          <i></i>
          <span>信访回复信息</span>
        </div>
        <el-form :inline="true" :model="readData" status-icon label-width="80px">
          <el-form-item label="回复意见">
            <el-input v-model="readData.letteridea.idea" type="textarea" :rows="5" placeholder="请输入主要事实" disabled />
          </el-form-item>
          <el-form-item label="上传附件">
              <a style="font-size: 18px;" v-if="fileName&&fileName!== ''" download :href="fileurl">{{fileName}}</a>
              <span style="color:#999;font-size: 16px" v-else>暂无附件</span>
          </el-form-item>
          <el-form-item label="回复图片" style="width: 100%">
            <div v-if="!urldata.length" class="imagebox">
              <i class="el-icon-picture-outline"></i>
              <u>暂无图片</u>
            </div>
            <div v-for="item in urldata" v-else>
              <el-image :src="item" :preview-src-list="urldata" :z-index="2999"/>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="infobox" v-if="supers&&scard === 'unsuper'">
        <div class="titbox">
          <i></i>
          <span>督办信息</span>
        </div>
        <el-form ref="superdata" :model="superdata" :rules="srules" class="formdata" status-icon label-width="90px">
          <el-form-item label="督办意见" prop="idea">
            <el-input v-model="superdata.idea" type="textarea" :rows="5" placeholder="请输入督办意见"/>
          </el-form-item>
        </el-form>
      </div>
    </template>
      <template v-if="tabCard === 'flowover'">
      <el-timeline>
        <span class="notime" v-if="flowData.length === 0">暂无流程,还未开始！</span>
        <el-timeline-item
          v-for="(item,index) in flowData"
          :key="index"
          placement="top"
          :timestamp="item.date ? item.date : ''">
          <span class="timeuser">{{ item.username }}</span>
          <span class="timemain">{{ item.opinion ? item.opinion:'' }}</span>
          <span class="nextman" v-if="item.nextusername!=''"><label>下阶段办理人:</label>{{item.nextusername}}</span>
        </el-timeline-item>
      </el-timeline>
    </template>
      <el-dialog :visible.sync="indialog" :title="intitle" width="32%" top="12%" :before-close="inclose" :close-on-click-modal="false" append-to-body center>
      <el-form ref="innerData" :model="innerData" :rules="inRules" status-icon label-width="90px" style="padding:15px 25px 0">
        <template v-if="intitle === '驳回'">
          <el-form-item label="不受理原因" prop="idea" style="width: 100%">
            <el-input v-model="innerData.idea" type="textarea" :rows="5" placeholder="请输入不受理原因" />
          </el-form-item>
        </template>
        <template v-if="intitle === '选择受理人员'">
          <el-form-item label="受理人员" prop="uid" style="width: 100%">
            <el-cascader v-model="innerData.uid" :options="options" :props="props" filterable placeholder="请选择人员" @change="transChange"></el-cascader>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="saveinData">确 定</el-button>
          <el-button @click="inclose">取 消</el-button>
        </span>
    </el-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="audit" type="danger" @click="saveaccept">受 理</el-button>
        <el-button v-if="trial" type="danger" @click="saveaccess">通 过</el-button>
        <el-button v-if="remain" type="danger" @click="savedata">确认</el-button>
        <el-button v-if="supers && scard === 'unsuper'" type="danger" @click="savesuper">确认</el-button>
        <el-button v-if="audit || trial" type="danger" plain @click="savereject">驳 回</el-button>
        <el-button v-if="!audit && !trial && !remain && scard !== 'unsuper'" @click="handleClose">取 消</el-button>
        <el-button v-if="supers && scard === 'unsuper'" @click="handleSuperClose">取 消</el-button>
        <el-button v-if="remain" @click="handleremianClose">取 消</el-button>
      </span>
  </el-dialog>
</template>

<script>
import rejectdialog from "./rejectdialog";
import uploadImage from "./uploadImage";
import uploadFile from "./uploadFile";
import {
  deleteReject,
  deletereviewReject,
  getdetail,
  getofficeuserList,
  putaudit,
  deleteimgFile,
  putreviewaudit,
  putneedtobe,
  getidea,
  putsupereply,
  getFile
} from '../api/petion'
export default {
  name: "petdialog",
  components: {
    rejectdialog,
    uploadImage,
    uploadFile
  },
  data(){
    return {
      dialogVisible:false,
      title: "",
      readData:{},
      formData:{},
      superdata:{},
      imgdata:[],
      urldata:[],
      indialog:false,
      intitle:'',
      innerData:{},
      inRules:{
        uid:[{required: true, trigger: "change", message: "请选择受理人员"}],
        idea:[{required: true, trigger: "blur", message: "请填写驳回意见"}]
      },
      frules:{
        idea:[{required: true, trigger: "blur", message: "请填写回复意见"}]
      },
      srules:{
        idea:[{required: true, trigger: "blur", message: "请填写督办意见"}]
      },
      options: [],
      props: {
        emitPath:false,
        expandTrigger: 'hover',
        value: "id",
        label: "name",
        children: "children",
      },
      tabCard: "baseinfo",
      flowData:[],
      imgLists:[],
      fileLists:[],
      filesList:[],
      fileName:'',
      fileurl:''
    }
  },
  props:{
    audit:Boolean,
    remain:Boolean,
    trial:Boolean,
    done:Boolean,
    record:Boolean,
    supers:Boolean,
    scard:String
  },
  methods:{
    async showEdit(pid,index){
      if(pid){
        let res = await getdetail({pid})
        if(res.code === 200){
          this.readData = res.data
        }
        let obj = {
          1:'待受理详情',
          2:'待办详情',
          3:'已办待审详情',
          4:'已办详情',
          5:'区域查询详情',
          6:'未督办详情',
          7:'已督办详情',
          8:'未解决详情'
        }
        let arr = Object.keys(obj).map(item=> Number(item))
        if(arr.includes(index)){
          this.title = obj[index]
        }
        if(res.data.images && res.data.images !== ''){
            this.imgdata = res.data.images.split(',').map(item=>{
              return `${this.$baseUrl}/gridfs/image/${item}`
            })
        }else {
          this.imgdata = []
        }
        if(res.data.letteridea && res.data.letteridea.images && res.data.letteridea.images !== ''){
          this.urldata = res.data.letteridea.images.split(',').map(item=>{
            return `${this.$baseUrl}/gridfs/image/${item}`
          })
        }else {
          this.urldata = []
        }
        if(res.data.letteridea && res.data.letteridea.file && res.data.letteridea.file !== ''){
          let fes = await getFile({fileid:res.data.letteridea.file})
          if(fes.code == 200){
            this.fileName = fes.data
            this.fileurl = `${this.$baseUrl}/gridfs/downloadFile?fileid=${res.data.letteridea.file}`
          }
        }else {
          this.fileName = ''
          this.fileurl = ''
        }
      }
      this.getpeidea(pid)
      this.dialogVisible = true
    },
    async getpeidea(pid){
      let res = await getidea({pid})
      if(res.code === 200){
        this.flowData = res.data.reverse().map(item=>{
          return {
            username:item.username,
            opinion:item.idea? item.idea : '',
            date:item.time ? item.time : '',
            nextusername: item.nextstatue && item.nextstatue !==0 ? item.nextusername : ''
          }
        })
      }
    },
    saveaccept(){
      this.intitle = '选择受理人员'
      this.indialog = true
      this.getUserData()
    },
    transChange(val){
      this.innerData.uid = val
    },
    async getUserData(){
      let res = await getofficeuserList()
      if(res.code === 200){
        this.options = res.data.map(item=>{
          return {
            id:item.pid,
            name:item.name,
            children:item.userList.map(val=>{
              return {
                id:val.pid,
                name:val.username,
              }
            })
          }
        })
      }
    },
    tabChange(val){
      this.tabCard = val
    },
    async removeSuccess(fileId,fileList){
      let res = await deleteimgFile({fileId})
      if(res.code === 200){
        this.$message.success("删除成功")
      }
      this.imgLists = fileList;
    },
    uploadSuccess(fileList){
      this.imgLists = fileList.map(item=>{
        return {
          fileid:item.response.data,
          url:item.url
        }
      })
    },
    async removeFile(fileId,fileList){
      let res = await deleteimgFile({fileId})
      if(res.code === 200){
        this.$message.success("删除成功")
      }
      this.fileLists = fileList;
    },
    uploadFile(fileList){
      this.fileLists = fileList
    },
    saveaccess(){
      this.$baseConfirm('你确定要通过吗？','通过提示',async ()=>{
        let res = await putreviewaudit({pid:this.readData.pid})
        if(res.code === 200){
          this.$message.success('已通过成功')
          this.handleClose()
          this.$emit('getData')
        }
      })
    },
    savedata(){
      this.$refs.formData.validate(async (valid)=>{
        if(valid){
          console.log(this.fileLists)
          let data = {
            idea:this.formData.idea,
            fileid:this.fileLists.length > 0 ? this.fileLists.map(item=>{
              return item.response.data
            }).join(',') :'',
            imgeids:this.imgLists.length > 0 ? this.imgLists.map(item=>{
              return item.fileid
            }).join(',') : '',
            letterid:this.readData.pid
          }
          let res = await putneedtobe(data)
          if(res.code === 200){
            this.$message.success('办理成功')
            this.handleClose()
            this.$emit('getData')
          }
        }else{
          return false
        }
      })
    },
    savesuper(){
      this.$refs.superdata.validate(async (valid)=>{
        if(valid){
          let params = {
            pid:this.readData.pid,
            idea:this.superdata.idea
          }
          let res = await putsupereply(params)
          if(res.code === 200){
            this.$message.success('督办成功')
            this.handleSuperClose()
            this.$emit('getData')
          }
        }else{
          return false
        }
      })
    },
    savereject(){
      this.intitle = '驳回'
      this.indialog = true
    },
    saveinData(){
      this.$refs.innerData.validate(async (valid)=>{
         if(valid){
           let params = {},res,txt = ''
           if(this.intitle == '选择受理人员'){
             Object.assign(params,{
               pid:this.readData.pid,
               uid:this.innerData.uid
             })
             res = await putaudit(params)
             txt = '办理成功'
           }else if(this.intitle === '驳回'){
             Object.assign(params,{
               pid:this.readData.pid,
               idea:this.innerData.idea
             })
             res = this.trial ?  await deletereviewReject(params) : await deleteReject(params)
             txt = '已驳回'
           }
           if(res.code == 200){
             this.$message.success(txt)
             this.inclose()
             this.handleClose()
             this.$emit('getData')
           }
         }else {
            return false
         }
      })
    },
    inclose(){
      this.indialog = false;
      this.intitle = '';
      this.$refs.innerData.resetFields();
      this.innerData = this.$options.data().innerData;
    },
    handleClose(){
      this.dialogVisible = false
      this.title = ''
      this.tabCard = 'baseinfo'
      this.readData = this.$options.data().readData
    },
    handleremianClose(){
      this.dialogVisible = false
      this.title = ''
      this.tabCard = 'baseinfo'
      // this.$refs.formData.resetFields()
      this.formData = this.$options.data().formData
      this.readData = this.$options.data().readData
    },
    handleSuperClose(){
      this.dialogVisible = false
      this.title = ''
      this.tabCard = 'baseinfo'
      // this.$refs.superdata.resetFields()
      this.superdata = this.$options.data().superdata
      this.readData = this.$options.data().readData
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep{
  .el-dialog__header{
    .dialogheader{
      display: flex;
      align-items: center;
      flex-direction: column;
      & > span{
        font-size:18px;
        margin-bottom:15px;
      }
      .radiogroup {
        display: block;
        text-align: center;
        margin-bottom: 15px;
        .el-radio-button--medium{
          .el-radio-button__inner:hover{
            color:red;
          }
          &.is-active{
            .el-radio-button__inner:hover{
              color:#fff;
            }
          }
        }
        .el-radio-button__orig-radio:checked + .el-radio-button__inner{
          background-color:red!important;
          border-color: red!important;
          box-shadow: -1px 0 0 0 red!important;
        }
      }
    }
  }
  .el-dialog__body{
    padding: 0;
    padding-bottom:25px;
    .infobox{
      border-bottom: 1px dashed #ccc;
      padding:0 25px ;
      margin-top: 20px;
      &:first-child{
        margin-top: 0;
      }
      .titbox{
        display: flex;
        justify-content: left;
        align-items: center;
        flex-direction: row;
        height: auto;
        margin-bottom: 20px;
        span{
          margin-left: 10px;
          font-size:15px;
          line-height: 20px;
          display: inline-block;
        }
        i{
          width: 4px;
          height:16px;
          background-color:red;
          display: inline-block;
          position: relative;
          top: 0;
        }
      }
    }
  }
}
.el-dialog__body{
  .el-form{
    &.formdata{
      .el-form-item{
        width: 100%;
      }
    }
    .el-form-item{
      width: 49%;
      &:nth-child(2n){
        margin-right: 0;
      }
      .el-input, .el-select,.el-textarea ,.el-cascader{
        width: 100%;
      }
      ::v-deep{
        .el-form-item__content{
          width:calc(100% - 90px);
          .el-textarea__inner:focus{
            border-color:red;
          }
        }
        .el-input--small .el-input__inner{
          height: 38px;
          line-height: 38px;
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
        .el-image{
          width: 140px;
          height: 140px;
          float: left;
          border-radius: 5px;
          box-shadow: 0 1px 3px 1px rgba(0,0,0,.1);
          margin-right: 10px;
          margin-bottom: 10px;
        }
      }
    }
  }
  .el-timeline{
    .notime{
      display: block;
      font-size: 16px;
      color: #999;
      padding: 20px;
    }
    .el-timeline-item{
      ::v-deep{
        .el-timeline-item__tail{
          border-color:#edcece;
        }
        .el-timeline-item__node{
          background-color:#f53030;
        }
      }
      span{
        display:block;
        line-height:24px;
        &.timeuser{
          position: absolute;
          top: -2px;
          left: 170px;
          font-size: 16px;
        }
        &.timemain{
          width: calc(100% - 30px);
          background-color:#F5F7FA;
          padding: 12px 10px;
          color: #666;
        }
        &.nextman{
          width:100%;
          margin-top:15px;
          color: #666;
          label{
            font-weight: bold;
            color: #333;
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
