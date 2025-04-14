<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="42%" top="4%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <template v-if="!manage && workData.pid">
      <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="-">
        <el-radio-button label="baseinfo">基本信息</el-radio-button>
        <el-radio-button label="flowover">办理流程</el-radio-button>
      </el-radio-group>
    </template>
    <el-form ref="workData" :model="workData" :rules="rules" status-icon label-width="80px">
      <template v-if="manage">
        <el-form-item label="任务类别" prop="tasktypename">
          <el-input v-model="workData.tasktypename" placeholder="请输入任务类别" />
        </el-form-item>
      </template>
      <template v-else>
        <template v-if="tabCard == 'baseinfo'">
          <el-form-item label="任务类别" prop="typeid">
            <el-select v-model="workData.typeid" placeholder="请选择任务类别" :disabled="disabled">
              <el-option v-for="item in cateData" :key="item.pid" :label="item.name" :value="item.pid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务标题" prop="title">
            <el-input v-model="workData.title" placeholder="请输入任务标题" :disabled="disabled" />
          </el-form-item>
          <el-form-item label="任务内容" prop="content">
            <el-input v-model="workData.content" type="textarea" :rows="5" placeholder="请输入任务内容" :disabled="disabled" />
          </el-form-item>
          <el-form-item label="选择人员" prop="transactorid" v-if="userData.pid != workData.transactorid">
            <el-cascader v-model="workData.transactorid" :disabled="disabled" :options="options" :props="props" filterable placeholder="请选择人员"></el-cascader>
          </el-form-item>
          <el-form-item label="图片附件">
            <uploadImage v-if="!workData.pid" :imgLists="imgLists" @removeSuccess="removeSuccess" @uploadSuccess="uploadSuccess" />
            <template v-if="workData.pid">
              <template v-if="imgdata.length > 0">
                <el-image v-for="(item,index) in imgdata" :key="index" :src="item" :preview-src-list="imgdata" :z-index="2999"></el-image>
              </template>
              <div v-else class="imagebox">
                <i class="el-icon-picture-outline"></i>
                <u>暂无图片</u>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="文件附件">
            <FilesUpload :fileList="fileLists" :type="8" :showkey="showkey" :dataList="fileLists" @FileremoveSuccess="FileremoveSuccess" @FileuploadSuccess="FileuploadSuccess" @FiledownSuccess="FiledownSuccess" />
          </el-form-item>
          <template v-if="workData.rejectidea">
            <el-form-item label="驳回意见">
              <el-input v-model="workData.rejectidea.idea" type="textarea" :rows="5" placeholder="请输入驳回意见" disabled />
            </el-form-item>
          </template>
          <template v-if="workData.replyidea">
            <el-form-item label="事件回复" >
              <el-input v-model="workData.replyidea.idea" type="textarea" :rows="5" placeholder="请输入事件回复" disabled />
            </el-form-item>
            <el-form-item label="完成图片">
              <div v-if="!urldata.length" class="imagebox">
                <i class="el-icon-picture-outline"></i>
                <u>暂无图片</u>
              </div>
              <template v-else>
                <el-image v-for="(item,index) in urldata" :key="index" :src="item" :preview-src-list="urldata" :z-index="2999"/>
              </template>
            </el-form-item>
          </template>
        </template>
        <template v-if="tabCard == 'flowover'">
          <el-timeline>
            <span class="notime" v-if="flowData.length == 0">暂无流程,还未开始！</span>
            <el-timeline-item
              v-for="(item,index) in flowData"
              :key="index"
              placement="top"
              :timestamp="item.date ? item.date : ''">
              <span class="timeuser">{{ item.username }}</span>
              <p class="timecont">
                <span class="timemain">{{ item.idea}}</span>
                <template v-if="item.image!=''">
                  <el-image v-for="(val,key) in item.image" :key="key" :src="val" :preview-src-list="item.image" :z-index="2999"/>
                </template>
              </p>
            </el-timeline-item>
          </el-timeline>
        </template>
      </template>
    </el-form>
    <gdialog ref="global" @getData="getData"/>
    <span slot="footer" class="dialog-footer">
      <template v-if="tabname == 'dealt' && (workData.state == 1 || workData.state == 3)">
        <el-button type="primary" @click="transClick">转 办</el-button>
        <el-button type="success" @click="handle">处 理</el-button>
      </template>
      <template v-if="tabname == 'dealt' && workData.state == 2">
        <el-button type="success" @click="examine">通 过</el-button>
        <el-button type="danger" @click="reject">驳 回</el-button>
      </template>
      <el-button v-if="tabname == 'all' && workData.state == 1 && (workData.creatuserid == userData.pid)" type="danger" @click="revoke">撤 销</el-button>
      <el-button v-if="!workData.pid || manage" type="primary" @click="saveData">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {getcateTail, getworktail, putcate, putupdate, getcate, getusers,getIdeas,putfinish,getrevoke} from "@/views/numtask/api/work";
import uploadImage from '@/views/petition/components/uploadImage'
import FilesUpload from "@/components/FilesUpload.vue";
import gdialog from "./gdialog";
import {deleteimgFile} from "@/views/petition/api/petion";
import {mapGetters} from "vuex";
import {delFiles} from "@/api/user";
import {getDate} from "@/utils/timeDate";
export default {
  name: "workdialog",
  data() {
    return {
      tabCard:'baseinfo',
      dialogVisible:false,
      title:'',
      workData:{},
      keys:null,
      showkey:true,
      rules:{
        tasktypename:[{required: true, trigger: "blur", message: "请填写任务类别"}],
        typeid:[{required: true, trigger: "change", message: "请选择任务类别"}],
        title:[{required: true, trigger: "blur", message: "请填写任务标题"}],
        content:[{required: true, trigger: "blur", message: "请填写任务内容"}],
        transactorid:[{required: true, trigger: "change", message: "请选择人员"}]
      },
      options: [],
      props: {
        emitPath:false,
        expandTrigger: 'hover',
        value: "id",
        label: "name",
        children: "children",
      },
      disabled:false,
      flowData:[],
      cateData:[],
      imgLists:[],
      imgdata:[],
      urldata:[],
      fileLists:[],
      tabname:''
    }
  },
  props:['manage'],
  components: {
    uploadImage,
    FilesUpload,
    gdialog
  },
  computed: {
    ...mapGetters({
      userData:'user/userData'
    })
  },
  created() {
    if(!this.manage){
      this.getUsers()
      this.getCate()
    }
  },
  mounted() {
  },
  methods: {
    async getUsers(){
      let res = await getusers()
      this.options = res.data ? res.data.map(item=>{
        return {
          id:item.pid,
          name:item.name,
          children: item.userList && item.userList.length > 0 ? item.userList.map(val=>{
            return {
              id:val.pid,
              name:val.username
            }
          }) : []
        }
      }) : []
    },
    async getCate(){
      let res = await getcate()
      this.cateData = res.data ? res.data.map(item=>{
        return {
          pid:item.pid,
          name:item.tasktypename
        }
      }) : []
    },
    async showData(pid,name){
      this.tabname = name
      if(!pid) {
        this.title = this.manage ? '添加任务类别' : '添加任务'
        this.disabled = false
      }
      if(pid){
        this.title = this.manage ? '编辑任务类别' : '查看任务'
        let res = this.manage ? await getcateTail({pid}) : await getworktail({pid})
        this.workData = res.data ? res.data : {}

        if(!this.manage){
          this.disabled = true
          this.imgdata = res.data.image && res.data.image != '' ? res.data.image.split(',').map(item=>{
            return `${this.$baseUrl}/gridfs/image/${item}`
          }) : []
          this.urldata = res.data.replyidea && res.data.replyidea.image != '' ? res.data.replyidea.image.split(',').map(item=>{
            return `${this.$baseUrl}/gridfs/image/${item}`
          }) : []
          this.fileLists = res.data.documents && res.data.documents.length > 0 ? res.data.documents.map(item=>{
            return {
              filename:item.filename,
              name:item.filename,
              fileid:item.fileid,
              createTime:item.uploaddate
            }
          })  :[]
          this.getidea(pid)
        }
      }
      this.showkey = pid ? false:true
      this.dialogVisible = true
    },
    async getidea(pid){
      let res = await getIdeas({pid})
      this.flowData = res.data.length > 0 ? res.data.map(item=>{
        return {
          username:item.username ? item.username : '',
          date:item.ideadate ? item.ideadate : '' ,
          idea:item.idea ? item.idea : '',
          image:item.image ? item.image.split(',').map(item=>{
            return `${this.$baseUrl}/gridfs/image/${item}`
          }) : ''
        }
      }) : []
    },
    getData(){
      this.handleClose()
      this.$emit('getData')
    },
    saveData(){
      this.$refs.workData.validate(async (valid)=>{
        if(valid){
          let data = Object.assign({},this.workData)
          if(!this.manage){
            this.imgLists.length > 0 ? Object.assign(data,{image:this.imgLists.map(item=> item.fileid).join(',')}) : Object.assign(data,{image:''})
            this.fileLists.length > 0 ? Object.assign(data,{documents:this.fileLists}) : Object.assign(data,{documents:[]})
          }
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          let res = this.manage ? await putcate(data) : await putupdate(data)
          if(res.code === 200){
            loading.close();
            this.$message.success(this.manage ? '类别添加成功' : '添加并发送任务成功')
            this.getData()
          }else if(res.code == 201){
            loading.close();
            this.$message.error(res.msg)
            return false
          }
        }else {
          return false
        }
      })
    },
    transClick(){
      this.$refs.global.showEdit(this.workData.pid,1)
    },
    handle(){
      this.$refs.global.showEdit(this.workData.pid,2)
    },
    examine(){
      this.$baseConfirm('你确定要通过吗？','通过提示',async ()=>{
        const loading = this.$loading({
          lock: true,
          text: '通过中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let res = await putfinish({taskid:this.workData.pid})
        if(res.code === 200){
          loading.close();
          this.$message.success('已通过成功')
          this.getData()
        }
      })
    },
    reject(){
      this.$refs.global.showEdit(this.workData.pid,3)
    },
    revoke(){
      this.$baseConfirm('你确定要撤销吗？','撤销提示',async ()=>{
        let res = await getrevoke({pid:this.workData.pid})
        if(res.code === 200){
          this.$message.success('已撤销成功')
          this.getData()
        }
      })
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
    FileuploadSuccess(fileList){
      this.fileLists = fileList.map(item =>{
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
        this.fileLists = this.fileLists.filter(item=> item.fileid!=fileid)
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
      this.tabCard = 'baseinfo'
      this.tabname = ''
      this.imgLists = []
      this.fileLists = []
      this.disabled = false
      !this.workData.pid ? this.$refs.workData.resetFields() : ''
      this.workData = this.$options.data().workData
      this.dialogVisible = false
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
    .el-form-item{
      .el-input, .el-select,.el-textarea ,.el-cascader{
        width: 100%;
      }
      ::v-deep{
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
          border-color: #ceedea;
        }
        .el-timeline-item__node{
          background-color: #3068f5;
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
      }
      .timecont{
        background-color:#F5F7FA;
        padding: 12px 10px;
        width: calc(100% - 30px);
        span{
          &.timemain{
            color: #666;
          }
          &.timenone{
            color: #bfbfbf;
          }
        }
        .el-image{
          width: 140px;
          height: 140px;
          border-radius: 5px;
          box-shadow: 0 1px 3px 1px rgba(0,0,0,.1);
          margin-right: 10px;
          margin-bottom: 10px;
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
