<template>
 <el-dialog :visible.sync="dialogVisible" :title="title" width="35%" top="7%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
   <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="medium">
     <el-radio-button label="baseinfo">基本信息</el-radio-button>
     <el-radio-button label="flowover">办理流程</el-radio-button>
   </el-radio-group>
    <el-form v-if="tabCard === 'baseinfo'" ref="formData" :model="formData" status-icon label-width="85px">
        <el-form-item label="选择类别">
          <el-input v-model="formData.typename" placeholder="请输入选择类别" disabled />
        </el-form-item>
        <el-form-item label="上报时间">
          <el-date-picker v-model="formData.startdate" type="date" value-format="yyyy-MM-dd" placeholder="请选择上传时间" disabled />
        </el-form-item>
        <el-form-item label="事件内容">
          <el-input v-model="formData.repconten" type="textarea" :rows="5" placeholder="请输入事件内容" disabled />
        </el-form-item>
        <el-form-item label="上传地址">
          <el-input v-model="formData.address" placeholder="请输入上传地址" disabled />
        </el-form-item>
        <el-form-item label="图片展示">
          <div v-if="!imgdata.length" class="imagebox">
            <i class="el-icon-picture-outline"></i>
            <u>暂无图片</u>
          </div>
          <div v-for="item in imgdata" v-else>
            <el-image :src="item" :preview-src-list="imgdata" :z-index="2999"></el-image>
          </div>
        </el-form-item>
        <el-form-item label="驳回意见" v-if="formData.rejection">
          <el-input v-model="formData.rejection" type="textarea" :rows="5" placeholder="请输入驳回意见" disabled />
        </el-form-item>
        <el-form-item label="回复意见" v-if="formData.admincontent">
          <el-input v-model="formData.admincontent" type="textarea" :rows="5" placeholder="请输入意见回复" disabled />
        </el-form-item>
        <el-form-item label="回复图片" v-if="formData.adminimages && formData.adminimages.length">
          <div v-if="!urldata.length" class="imagebox">
            <i class="el-icon-picture-outline"></i>
            <u>暂无图片</u>
          </div>
          <div v-for="item in urldata" v-else>
            <el-image :src="item" :preview-src-list="urldata" :z-index="2999"/>
          </div>
        </el-form-item>
        <el-form-item label="评价时间" v-if="formData.appdate">
          <el-date-picker v-model="formData.appdate" type="date" value-format="yyyy-MM-dd" placeholder="请选择评价时间" disabled />
        </el-form-item>
        <el-form-item label="评价等级" v-if="formData.apprank">
          <el-select v-model="formData.apprank" placeholder="请选择评价等级" disabled>
            <el-option :value="0" label="非常满意"></el-option>
            <el-option :value="1" label="满意"></el-option>
            <el-option :value="2" label="不满意"></el-option>
          </el-select>
        </el-form-item>
    </el-form>

   <div v-if="tabCard === 'flowover'">
     <el-timeline>
       <el-timeline-item
         v-for="(item,index) in flowData"
         :key="index"
         placement="top"
         :timestamp="item.date ? item.date : ''">
         <span class="timeuser">{{ item.username }}<u>{{item.stagename}}</u></span>
         <p class="timecont">
           <span class="timemain">{{ item.opinion ? item.opinion:'' }}</span>
         </p>
       </el-timeline-item>
     </el-timeline>
   </div>
    <el-dialog :visible.sync="indialog" :title="intitle" width="35%" top="12%" :before-close="inclose" :close-on-click-modal="false" append-to-body center>
        <el-form ref="innerData" :model="innerData" :rules="inRules" status-icon label-width="90px">
          <template v-if="intitle === '处理'">
            <el-form-item label="回复意见" prop="admincontent">
              <el-input v-model="innerData.admincontent" type="textarea" :rows="5" placeholder="请输入回复意见" />
            </el-form-item>
            <el-form-item label="图片上传">
              <UploadImg :fileLists="fileLists" :type="type" :pid="formData.pid" class="uploadBlock" @removeSuccess="removeSuccess" @uploadSuccess="uploadSuccess" />
            </el-form-item>
          </template>
          <template v-if="intitle === '驳回反馈'">
            <el-form-item label="驳回意见" prop="idea">
              <el-input v-model="innerData.idea" type="textarea" :rows="5" placeholder="请输入驳回意见" />
            </el-form-item>
          </template>
          <template v-if="intitle === '转办' || intitle === '选择待办人员'">
            <el-form-item :label="intitle==='转办'? '转办人':'待办人员'" prop="uid">
              <el-cascader v-model="innerData.uid" :options="options" :props="props" filterable placeholder="请选择人员" @change="transChange"></el-cascader>
            </el-form-item>
          </template>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveData">确 定</el-button>
          <el-button @click="inclose">取 消</el-button>
        </span>
    </el-dialog>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="dealt" type="primary" @click="handle">处 理</el-button>
      <el-button v-if="dealt" type="warning" @click="transClick">转 办</el-button>
      <template v-if="review">
        <el-button type="success" @click="examine">审 核</el-button>
        <el-button type="danger" @click="reject">驳 回</el-button>
      </template>
       <template v-if="deview">
        <el-button type="success" @click="examine">办 结</el-button>
        <el-button type="danger" @click="reject">整 改</el-button>
      </template>
      <el-button @click="handleClose">返 回</el-button>
    </span>
 </el-dialog>
</template>

<script>
import UploadImg from "@/components/UploadImg";
import {putExamine,putReject,putHandle,putTransfer,getReadData,imgDelete,getUser,putTrial,getIdea} from '../api/conven';
import {mapGetters} from 'vuex'
export default {
  name: "condialog",
  props:{
    dealt:Boolean,
    review:Boolean,
    deview:Boolean,
  },
  data() {
    return {
      dialogVisible:false,
      title: "",
      typeData:[],
      formData:{},
      fileLists:[],
      type:1,
      hclick:false,
      imgdata:[],
      urldata:[],
      indialog:false,
      intitle:'',
      innerData:{},
      inRules:{
        admincontent:[{required: true, trigger: "blur", message: "请填写回复意见"}],
        uid:[{required: true, trigger: "change", message: "请选择转办人"}],
        idea:[{required: true, trigger: "blur", message: "请填写驳回意见"}]
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
      flowData:[]
    }
  },
  components: {
    UploadImg
  },
  computed: {
    ...mapGetters({
      userData:'user/userData'
    })
  },
  created() {
  },
  mounted() {
  },
  methods: {
    async showEdit(id,index){
      if(id){
        let res = await getReadData({pid:id})
        if(res.code === 200){
          this.formData = res.data
        }else if(res.code === 500){
            this.$message.warning('没有此条数据！')
            return false
        }
        if(index === 1){
          this.title = '查看待审核详情';
        }else if(index === 2){
          this.title = '查看待办详情';
        }else if(index === 3){
          this.title = '查看已办详情';
        }else if(index === 4){
          this.title = '查看记录查询';
        }
        if(res.data.arepimages && res.data.arepimages.length){
          this.imgdata = res.data.arepimages.map(item=>{
            return `${this.$baseUrl}/gridfs/image/${item.fileid}`
          })
        }else {
          this.imgdata = []
        }
        if(res.data.adminimages && res.data.adminimages.length){
            this.urldata = res.data.adminimages.map(item=>{
              return `${this.$baseUrl}/gridfs/image/${item.fileid}`
            })
        }else{
          this.urldata = []
        }
      }
      this.getconIdea(id)
      this.dialogVisible = true
    },
    async getconIdea(id){
      let res = await getIdea({pid:id})
      this.flowData = res.data.map(item=>{
        return {
            username:item.username,
            opinion:item.opinion? item.opinion : '',
            date:item.date ? item.date : '',
            stagename:item.stagename ? item.stagename : ''
        }
      })
    },
    tabChange(val){
      this.tabCard = val;
    },
    handleClose(){
      this.dialogVisible = false;
      this.tabCard = 'baseinfo'
      // this.$refs.formData.resetFields();
      this.formData = this.$options.data().formData;
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
    async examine(){
      if(this.review){
        this.intitle = '选择待办人员'
        this.indialog = true
        this.getUserData()
      }
      if(this.deview){
        let res = await putExamine({pid:this.formData.pid})
        if(res.code === 200){
          this.$message.success('办理成功！')
          this.handleClose()
          this.$emit('getData')
        }
      }
    },
    reject(){
      this.intitle = '驳回反馈'
      this.indialog = true
    },
    handle(){
      this.intitle = '处理'
      this.indialog = true
    },
    transClick(){
      this.intitle = '转办'
      this.indialog = true
      this.getUserData()
    },
    async getUserData(){
      let params = {pid:this.userData.pid}
      let res = await getUser(params)
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
    transChange(val){
      this.innerData.uid = val
    },
    inclose(){
      this.indialog = false;
      this.intitle = '';
      this.$refs.innerData.resetFields();
      this.innerData = this.$options.data().innerData;
    },
    saveData(){
      this.$refs.innerData.validate(async (valid)=>{
          if(valid){
            let tit = this.intitle
            let params = {}
            let res
            if(tit === '处理'){
              Object.assign(params,{
                matterid:this.formData.pid,
                opinion:this.innerData.admincontent,
                uid:this.userData.pid})
              res = await putHandle(params)
            }else if(tit === '转办'){
              Object.assign(params,{
                pid:this.formData.pid,
                uid:this.innerData.uid})
              res = await putTransfer(params)
            }else if(tit === '选择待办人员'){
              Object.assign(params,{
                pid:this.formData.pid,
                uid:this.innerData.uid
              })
              res = await putTrial(params)
            }else if(tit === '驳回反馈'){
              Object.assign(params,{
                pid:this.formData.pid,
                idea:this.innerData.idea
              })
              res = await putReject(params)
            }
            if(res.code === 200){
              this.$message.success('办理成功')
              this.inclose()
              this.handleClose()
              this.$emit('getData')
            }
          }else {
            return false
          }
      })
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
          width: 150px;
          height: 150px;
          float: left;
          border-radius: 5px;
          box-shadow: 0 1px 3px 1px rgba(0,0,0,.1);
          margin-right: 10px;
          margin-bottom: 10px;
        }
      }
    }
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
        top: -1px;
        left: 170px;
        font-size: 16px;
        u{
          text-decoration: none;
          margin-left:15px;
          font-size: 13px;
          line-height:inherit;
          padding:2px 10px;
          border:1px solid #00A3EF;
          border-radius:25px;
          background-color: #0c9ed7;
          color: #fff;
          position: relative;
          top: -1px;
        }
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
