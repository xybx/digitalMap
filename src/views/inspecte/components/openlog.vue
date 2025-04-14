<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/7/5
 * @LastEditors: 12390
 * @LastEditTime: 2022/7/5
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="42%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="openData" :model="openData" :rules="rules" status-icon label-width="150px">
      <template v-if="runs">
        <el-form-item label="村居名称" prop="areaid">
          <el-select v-model="openData.areaid" placeholder="请选择村居名称" clearable>
            <el-option v-for="item in villdata" :key="item.pid" :label="item.areaname" :value="item.pid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请人员" prop="employusername">
          <el-input v-model="openData.employusername" placeholder="请输入申请人员" />
        </el-form-item>
        <el-form-item label="盖章事由">
          <el-input type="textarea" :autosize="{minRows: 5}" v-model="openData.matter" placeholder="请输入盖章事由" />
        </el-form-item>
        <el-form-item label="申请时间" prop="applydate">
          <el-date-picker v-model="openData.applydate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择申请时间" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="盖章时间" prop="usedate">
          <el-date-picker v-model="openData.usedate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择盖章时间" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="盖章材料" required>
          <uploadImage :imgLists="imgLists" :petion="true" @removeSuccess="removeSuccess" @uploadSuccess="uploadSuccess" />
        </el-form-item>
      </template>
      <template v-if="drule">
        <el-form-item label="村居名称" prop="villageid">
          <el-select v-model="openData.villageid" placeholder="请选择村居名称" clearable :disabled="disabled">
            <el-option v-for="item in villdata" :key="item.pid" :label="item.areaname" :value="item.pid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年度" prop="year">
          <el-date-picker v-model="openData.year" type="year" placeholder="请选择年度" :disabled="disabled" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="推送人员" prop="userids">
          <el-cascader class="newper" :key="caindex" v-model="openData.userids" :options="options" :props="props" filterable placeholder="请选择推送人员" @change="changeUser"></el-cascader>
        </el-form-item>
      </template>
      <template v-if="dfour">
        <el-form-item label="村居名称" prop="villageid">
          <el-select v-model="openData.villageid" placeholder="请选择村居名称" clearable>
            <el-option v-for="item in villdata" :key="item.pid" :label="item.areaname" :value="item.pid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容名称" prop="content">
          <el-input v-model="openData.content" placeholder="请输入内容名称" />
        </el-form-item>
        <el-form-item label="村党组织提议">
          <uploadFourImg :imgLists="tyfile" :showtab="oneshow" @removeSuccess="removeOneSuccess" @uploadSuccess="uploadOneSuccess"/>
        </el-form-item>
        <el-form-item label="村两委商议">
          <uploadFourImg :imgLists="syfile" :showtab="twoshow" @uploadClick="uploadTwoClick" @removeSuccess="removeTwoSuccess" @uploadSuccess="uploadTwoSuccess" />
        </el-form-item>
        <el-form-item label="党员大会商议">
          <uploadFourImg :imgLists="seyfile" :showtab="thrshow" @uploadClick="uploadThrClick" @removeSuccess="removeThrSuccess" @uploadSuccess="uploadThrSuccess" />
        </el-form-item>
        <el-form-item label="村民代表会议决议">
          <uploadFourImg :imgLists="jyfile" :showtab="fourshow" @uploadClick="uploadFourClick" @removeSuccess="removeForSuccess" @uploadSuccess="uploadForSuccess" />
        </el-form-item>
        <el-form-item label="决议结果公开">
          <uploadFourImg :imgLists="openfile" :showtab="fiveshow" @uploadClick="uploadFiveClick" @removeSuccess="removeFiveSuccess" @uploadSuccess="uploadFiveSuccess" />
        </el-form-item>
        <el-form-item label="村级公开实施结果">
          <uploadFourImg :imgLists="endfile" :showtab="sixshow" @uploadClick="uploadSixClick" @removeSuccess="removeSixSuccess" @uploadSuccess="uploadSixSuccess" />
        </el-form-item>
        <el-form-item label="是否涉合同到期文件" required>
          <el-select v-model="openData.iscontract" placeholder="请选择是否涉合同到期文件" :disabled="sevenshow" clearable>
            <el-option label="否" :value="0"></el-option>
            <el-option label="是" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <template v-if="openData.iscontract == 1">
          <el-form-item label="到期提醒时间" prop="contractexpiredate">
            <el-date-picker v-model="openData.contractexpiredate" type="date" placeholder="请选择到期时间" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="到期推送人员" prop="pushuserids">
            <el-cascader class="fourper" v-model="openData.pushuserids" :disabled="userdis" :options="options" :props="props" filterable placeholder="请选择推送人员" @change="changeUser"></el-cascader>
          </el-form-item>
          <el-form-item label="上传文件" required>
            <uploadFile :fileLists="fileLists" @removeFile="removeFiles" @uploadFile="uploadFile"/>
          </el-form-item>
        </template>
      </template>
      <template v-if="topen">
        <el-form-item label="村居名称">
          <el-select v-model="openData.villageid" placeholder="请选择村居名称" clearable>
            <el-option v-for="item in villdata" :key="item.pid" :label="item.areaname" :value="item.pid"></el-option>
          </el-select>
        </el-form-item>
        <el-divider></el-divider>
        <div class="titbox">
          <i></i>
          <span>党务公开</span>
        </div>
        <el-form-item label="发展党员情况">
          <el-input type="textarea" :autosize="{minRows: 5}" v-model="openData.dymsg" placeholder="请输入发展党员情况" />
        </el-form-item>
        <el-form-item label="党费收缴情况">
          <el-input type="textarea" :autosize="{minRows: 5}" v-model="openData.dfmsg" placeholder="请输入党费收缴情况" />
        </el-form-item>
        <el-form-item label="支部活动情况">
          <el-input type="textarea" :autosize="{minRows: 5}" v-model="openData.zbactmsg" placeholder="请输入支部活动情况" />
        </el-form-item>
        <el-form-item label="支部活动图片">
          <div v-if="!zbimgs.length" class="imagebox">
            <i class="el-icon-picture-outline"></i>
            <u>暂无图片</u>
          </div>
          <template v-else>
            <el-image v-for="(item,index) in zbimgs" :key="index" :src="item" :preview-src-list="zbimgs" :z-index="2999"></el-image>
          </template>
        </el-form-item>
        <el-divider></el-divider>
        <div class="titbox">
          <i></i>
          <span>村务公开</span>
        </div>
        <el-form-item label="低保补助发放情况">
          <div v-if="!dbimgs.length" class="imagebox">
            <i class="el-icon-picture-outline"></i>
            <u>暂无图片</u>
          </div>
          <template v-else>
            <el-image v-for="(item,index) in dbimgs" :key="index" :src="item" :preview-src-list="dbimgs" :z-index="2999"></el-image>
          </template>
        </el-form-item>
        <el-form-item label="村委开展工作情况">
          <div v-if="!cwimgs.length" class="imagebox">
            <i class="el-icon-picture-outline"></i>
            <u>暂无图片</u>
          </div>
          <template v-else>
            <el-image v-for="(item,index) in cwimgs" :key="index" :src="item" :preview-src-list="cwimgs" :z-index="2999"></el-image>
          </template>
        </el-form-item>
        <el-form-item label="其他公开事项">
          <el-input type="textarea" :autosize="{minRows: 5}" v-model="openData.othermsg" placeholder="请输入盖章事由" />
        </el-form-item>
        <el-form-item label="其他公开事项图片">
          <div v-if="!otherimgs.length" class="imagebox">
            <i class="el-icon-picture-outline"></i>
            <u>暂无图片</u>
          </div>
          <template v-else>
            <el-image v-for="(item,index) in otherimgs" :key="index" :src="item" :preview-src-list="otherimgs" :z-index="2999"></el-image>
          </template>
        </el-form-item>
        <el-divider></el-divider>
        <div class="titbox">
          <i></i>
          <span>财务公开</span>
        </div>
        <el-form-item label="收入情况公开">
          <div v-if="!incomeimgs.length" class="imagebox">
            <i class="el-icon-picture-outline"></i>
            <u>暂无图片</u>
          </div>
          <template v-else>
            <el-image v-for="(item,index) in incomeimgs" :key="index" :src="item" :preview-src-list="incomeimgs" :z-index="2999"></el-image>
          </template>
        </el-form-item>
        <el-form-item label="支出情况公开">
          <div v-if="!outimgs.length" class="imagebox">
            <i class="el-icon-picture-outline"></i>
            <u>暂无图片</u>
          </div>
          <template v-else>
            <el-image v-for="(item,index) in outimgs" :key="index" :src="item" :preview-src-list="outimgs" :z-index="2999"></el-image>
          </template>
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="!dfour && keys != 2" type="primary" size="-" @click="saveData">确 定</el-button>
      <el-button v-if="dfour && keys != 2" type="primary" size="-" @click="saveFourData">确 定</el-button>
      <el-button size="-" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getareaVill,
  getDisoverId, getDisruleId,
  getFourId, getFourUser,
  getSealTail,
  putDisruleData, putFourData,
  putSealData
} from "@/views/inspecte/api/topen";
import uploadImage from "@/views/petition/components/uploadImage";
import uploadFourImg from "../components/uploadFourImg";
import {deleteimgFile} from "@/views/petition/api/petion";
import uploadFile from "@/views/petition/components/uploadFile";
import {getUserArea} from "@/views/inspecte/api/party";
export default {
  name: 'partylog',
  props:['tcard','runs','topen','drule','dfour'],
  data() {
    return {
      dialogVisible:false,
      title:'',
      openData:{},
      rules:{
        areaid:[{required: true, trigger: "change", message: "请选择村居"}],
        employusername:[{required: true, trigger: "blur", message: "请填写申请人"}],
        applydate:[{required: true, trigger: "change", message: "请选择申请时间"}],
        usedate:[{required: true, trigger: "change", message: "请选择盖章时间"}],
        villageid:[{required: true, trigger: "change", message: "请选择村居"}],
        year:[{required: true, trigger: "change", message: "请选择年度"}],
        userids:[{required: true, trigger: "change", message: "请选择推送人员"}],
        content:[{required: true, trigger: "blur", message: "请输入内容名称"}],
        contractexpiredate:[{required: true, trigger: "change", message: "请选择到期提醒时间"}],
        pushuserids:[{required: true, trigger: "change", message: "请选择到期推送人员"}],
      },
      caindex:0,
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
      pickerOptions:{
        disabledDate(time) {
          return time.getTime() <= Date.now() - (3600 * 24 * 1000);
        },
      },
      fileLists:[],
      imgLists:[],
      villdata:[],
      keys:null,
      zbimgs:[],
      dbimgs:[],
      cwimgs:[],
      otherimgs:[],
      incomeimgs:[],
      outimgs:[],
      tyfile:[],
      syfile:[],
      seyfile:[],
      jyfile:[],
      openfile:[],
      endfile:[],
      oneshow:false,
      twoshow:true,
      thrshow:true,
      fourshow:true,
      fiveshow:true,
      sixshow:true,
      sevenshow:false,
      disabled:false,
      userdis:false,
    }
  },
  components: {
    uploadImage,
    uploadFourImg,
    uploadFile
  },
  computed: {},
  created() {
  },
  mounted() {
  },
  methods: {
    async showEdit(pid,index){
      this.keys = index ? index :null
      let arr = ['新增公章使用','查看公章使用','编辑公章使用']
      this.title = arr[index-1]
      if(index != 1){
        let res = await getSealTail({pid})
        this.openData = res.data
        if(!!res.data.materials){
          this.getFiles(res.data.materials)
        }
      }
      this.getVillage()
      this.dialogVisible = true
    },
    async showRule(pid,index){
      this.keys = index ? index :null
      let arr = ['新增规则','查看规则','编辑规则']
      this.title = arr[index-1]
      if(index == 2 || index == 3){
        let res = await getDisruleId({pid})
        this.openData = res.data ? res.data : {}
        this.openData.year = res.data.year ? res.data.year.toString() : ''
      }
      this.disabled = index == 1 ? false : true
      this.getVillage()
      this.getUsers()
      this.dialogVisible = true
    },
    async showFour(pid,index){
      this.keys = index ? index :null
      let arr = ['新增任务','查看任务','编辑任务']
      this.title = arr[index-1]
      if(index == 2 || index == 3){
        let res = await getFourId({pid})
        if(res.code==200){
          this.openData = res.data
          this.getFourFiles(res.data)
        }
      }
      this.getVillage()
      this.getUsers()
      this.dialogVisible = true
    },
    async showOpen(pid,index){
      this.keys = index ? index :null
      this.title = '查看详情'
      let res = await getDisoverId({pid})
      this.openData = res.data ? res.data : {}
      if(!!res.data.zbactfile){
        this.zbimgs = res.data.zbactfile.split(',').map(item=>{
          return `${this.$baseUrl}/gridfs/image/${item}`
        })
      }else {
        this.zbimgs = []
      }
      if(!!res.data.dbbzfile){
        this.dbimgs = res.data.dbbzfile.split(',').map(item=>{
          return `${this.$baseUrl}/gridfs/image/${item}`
        })
      }else {
        this.dbimgs = []
      }
      if(!!res.data.cwworkfile){
        this.cwimgs = res.data.cwworkfile.split(',').map(item=>{
          return `${this.$baseUrl}/gridfs/image/${item}`
        })
      }else {
        this.cwimgs = []
      }
      if(!!res.data.otherfile){
        this.otherimgs = res.data.otherfile.split(',').map(item=>{
          return `${this.$baseUrl}/gridfs/image/${item}`
        })
      }else {
        this.otherimgs = []
      }
      if(!!res.data.incomefile){
        this.incomeimgs = res.data.incomefile.split(',').map(item=>{
          return `${this.$baseUrl}/gridfs/image/${item}`
        })
      }else {
        this.incomeimgs = []
      }
      if(!!res.data.outcomefile){
        this.outimgs = res.data.outcomefile.split(',').map(item=>{
          return `${this.$baseUrl}/gridfs/image/${item}`
        })
      }else {
        this.outimgs = []
      }
      this.getVillage()
      this.dialogVisible = true
    },
    getFourFiles(obj){
      let tyarr = !!obj.tyfile && obj.tyfile != '' ? obj.tyfile.split(',').map(item =>{
        return {
          fileid:item,
          url:`${this.$baseUrl}/gridfs/image/${item}`
        }
      }) : []
      this.tyfile = tyarr

      let syarr = !!obj.syfile && obj.syfile != '' ? obj.syfile.split(',').map(item =>{
        return {
          fileid:item,
          url:`${this.$baseUrl}/gridfs/image/${item}`
        }
      }) : []
      this.syfile = syarr
      this.twoshow = tyarr.length > 0 ? false : true

      let seyarr = !!obj.seyfile && obj.seyfile!= '' ? obj.seyfile.split(',').map(item =>{
        return {
          fileid:item,
          url:`${this.$baseUrl}/gridfs/image/${item}`
        }
      }) : []
      this.seyfile = seyarr
      this.thrshow = syarr.length > 0 ? false : true

      let jyarr = !!obj.jyfile && obj.jyfile!= '' ? obj.jyfile.split(',').map(item =>{
        return {
          fileid:item,
          url:`${this.$baseUrl}/gridfs/image/${item}`
        }
      }):[]
      this.jyfile = jyarr
      this.fourshow = seyarr.length > 0 ? false : true

      let openarr = !!obj.openfile && obj.openfile!= '' ? obj.openfile.split(',').map(item =>{
        return {
          fileid:item,
          url:`${this.$baseUrl}/gridfs/image/${item}`
        }
      }) :[]
      this.openfile = openarr
      this.fiveshow = jyarr.length > 0 ? false : true

      let endarr = !!obj.endingfile && obj.endingfile!= '' ? obj.endingfile.split(',').map(item =>{
        return {
          fileid:item,
          url:`${this.$baseUrl}/gridfs/image/${item}`
        }
      }):[]
      this.endfile = endarr
      this.sixshow = openarr.length > 0 ? false : true
      let filearr = obj.iscontract == 1 && obj.contractfile!='' ? obj.contractfile.split(',').map(item=> {
        return {
          fileid:item,
          url:`${this.$baseUrl}/gridfs/image/${item}`
        }
      }) : []
      this.fileLists = filearr
      this.sevenshow = endarr.length > 0 ? false : true
    },
    getFiles(str){
      let imgArr = str.split(',').map(item=>{
        return {
          fileid:item,
          url:`${this.$baseUrl}/gridfs/image/${item}`
        }
      });
      this.imgLists = imgArr
    },
    async getVillage(){
      let res = await getUserArea()
      this.villdata = res.data ? res.data : []
    },
    async getUsers(){
      let res = await getFourUser()
      ++this.caindex
      let allpot = {id:0, name:'全选', children:[{id:0, name:'全选'}]}
      this.options = res.data.map(item=>{
        return {
          id:item.pid,
          name:item.name,
          children:!!item.userList && item.userList.length > 0 ? item.userList.map(val=>{
            return {
              id:val.pid,
              name:val.username
            }
          }) : []
        }
      })
      this.options.unshift(allpot)
    },
    async removeFiles(fileId,fileList){
      let res = await deleteimgFile({fileId})
      if(res.code === 200){
        this.$message.success("删除成功")
      }
      this.fileLists = fileList;
    },
    uploadFile(fileList){
      this.fileLists = fileList
    },
    changeUser(val){
      if(val.length == 1 && val[0] === 0 && this.selectStates == 0){
        this.openData.userids = this.handleSelectAllCity()
        this.selectStates = 1
        this.scrollToBottom()
        return false
      }
      if(this.selectStates == 1){
        this.openData.userids = val.includes(0) ? val : []
        this.selectStates = this.openData.userids.length == 0 ? 0 : 1
        return false
      } else{
        this.openData.userids = val
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
    async removeOneSuccess(fileId,fileList,file){
      if(this.syfile.length > 0){
        fileList.push(file)
        this.$confirm('请先确认已删除村委商议图！','删除提示').then(()=>{
          if(this.syfile.length > 0 ){
            this.$message.error('请删除村委商议图')
            return false
          }else {
            this.deleteImg(fileId)
            this.tyfile = fileList;
            this.twoshow = fileList.length > 0 ? false : true
          }
        }).catch(()=>{
          this.$message.info('已取消删除')
        });
        return false
      }else {
        this.deleteImg(fileId)
        this.tyfile = fileList;
        this.twoshow = fileList.length > 0 ? false : true
      }
    },
    async deleteImg(fileId){
      let res = await deleteimgFile({fileId})
      if(res.code === 200){
        this.$message.success("删除成功")
      }
    },
    uploadOneSuccess(fileList){
      this.tyfile = fileList.map(item=>{
        return {
          fileid:item.response.data,
          url:item.url
        }
      })
      this.twoshow = fileList.length > 0 ? false : true
    },
    async removeTwoSuccess(fileId,fileList,file){
      console.log(this.seyfile)
      if(this.seyfile.length > 0){
        fileList.push(file)
        this.$confirm('请先确认已删除党员大会商议图！','删除提示').then(()=>{
          if(this.seyfile.length > 0 ){
            this.$message.error('请删除党员大会商议图')
            return false
          }else {
            this.deleteImg(fileId)
            this.syfile = fileList;
            this.thrshow = fileList.length > 0 ? false : true
          }
        }).catch(()=>{
          this.$message.info('已取消删除')
        });
        return false
      }else{
        this.deleteImg(fileId)
        this.syfile = fileList;
        this.thrshow = fileList.length > 0 ? false : true
      }
    },
    uploadTwoClick(){
      if(this.tyfile.length > 0){
        this.twoshow = false
      }else {
        this.$message.warning('请先上传村党组织提议！')
        this.twoshow = true
      }
    },
    uploadTwoSuccess(fileList){
      this.syfile = fileList.map(item=>{
        return {
          fileid:item.response.data,
          url:item.url
        }
      })
      this.thrshow = fileList.length > 0 ? false : true
    },
    uploadThrClick(){
      if(this.syfile.length > 0){
        this.thrshow = false
      }else {
        this.$message.warning('请先上传村委商议！')
        this.thrshow = true
      }
    },
    async removeThrSuccess(fileId,fileList,file){
      if(this.jyfile.length > 0){
        fileList.push(file)
        this.$confirm('请先确认已删除村民代表会议决议图！','删除提示').then(()=>{
          if(this.jyfile.length > 0 ){
            this.$message.error('请删除村民代表会议决议图')
            return false
          }else {
            this.deleteImg(fileId)
            this.seyfile = fileList;
            this.fourshow = fileList.length > 0 ? false : true
          }
        }).catch(()=>{
          this.$message.info('已取消删除')
        });
        return false
      }else{
        this.deleteImg(fileId)
        this.seyfile = fileList;
        this.fourshow = fileList.length > 0 ? false : true
      }
    },
    uploadThrSuccess(fileList){
      this.seyfile = fileList.map(item=>{
        return {
          fileid:item.response.data,
          url:item.url
        }
      })
      this.fourshow = fileList.length > 0 ? false : true
    },
    uploadFourClick(){
      if(this.seyfile.length > 0){
        this.fourshow = false
      }else {
        this.$message.warning('请先上传党员大会商议！')
        this.fourshow = true
      }
    },
    async removeForSuccess(fileId,fileList,file){
      if(this.openfile.length > 0){
        fileList.push(file)
        this.$confirm('请先确认已删除决议结果公开图！','删除提示').then(()=>{
          if(this.openfile.length > 0 ){
            this.$message.error('请删除村民决议结果公开图')
            return false
          }else {
            this.deleteImg(fileId)
            this.jyfile = fileList;
            this.fiveshow = fileList.length > 0 ? false : true
          }
        }).catch(()=>{
          this.$message.info('已取消删除')
        });
        return false
      }else{
        this.deleteImg(fileId)
        this.jyfile = fileList;
        this.fiveshow = fileList.length > 0 ? false : true
      }
    },
    uploadForSuccess(fileList){
      this.jyfile = fileList.map(item=>{
        return {
          fileid:item.response.data,
          url:item.url
        }
      })
      this.fiveshow = fileList.length > 0 ? false : true
    },
    uploadFiveClick(){
      if(this.jyfile.length > 0){
        this.fiveshow = false
      }else {
        this.$message.warning('请先上传村民代表会议决议！')
        this.fiveshow = true
      }
    },
    async removeFiveSuccess(fileId,fileList,file){
      if(this.endfile.length > 0){
        fileList.push(file)
        this.$confirm('请先确认已删除村级公开实施结果！','删除提示').then(()=>{
          if(this.endfile.length > 0 ){
            this.$message.error('请删除村民村级公开实施结果')
            return false
          }else {
            this.deleteImg(fileId)
            this.openfile = fileList;
            this.sixshow = fileList.length > 0 ? false : true
          }
        }).catch(()=>{
          this.$message.info('已取消删除')
        });
        return false
      }else{
        this.deleteImg(fileId)
        this.openfile = fileList;
        this.sixshow = fileList.length > 0 ? false : true
      }
    },
    uploadFiveSuccess(fileList){
      this.openfile = fileList.map(item=>{
        return {
          fileid:item.response.data,
          url:item.url
        }
      })
      this.sixshow = fileList.length > 0 ? false : true
    },
    async removeSixSuccess(fileId,fileList,file){
      if(this.openData.iscontract == 1 && this.fileLists.length > 0){
        fileList.push(file)
        this.$confirm('请先确认删除到期合同文件！','删除提示').then(()=>{
          if(this.fileLists.length > 0 ){
            this.$message.error('请删除到期合同文件')
            return false
          }else {
            this.deleteImg(fileId)
            this.endfile = fileList;
            this.sevenshow = fileList.length > 0 ? false : true
          }
        }).catch(()=>{
          this.$message.info('已取消删除')
        });
        return false
      }else{
        this.deleteImg(fileId)
        this.endfile = fileList;
        this.sevenshow = fileList.length > 0 ? false : true
      }
    },
    uploadSixClick(){
      if(this.openfile.length > 0){
        this.sixshow = false
      }else {
        this.$message.warning('请先上传决议结果公开！')
        this.sixshow = true
      }
    },
    uploadSixSuccess(fileList){
      this.endfile = fileList.map(item=>{
        return {
          fileid:item.response.data,
          url:item.url
        }
      })
      this.sevenshow = fileList.length > 0 ? false : true
    },
    saveData(){
      this.$refs.openData.validate(async (valid)=>{
        if(valid){
          if(this.drule && this.openData.userids.indexOf(0) > -1){
            this.openData.userids.shift()
          }
          if(this.runs && this.imgLists.length == 0){
            this.$message.error('请上传盖章材料图片')
            return false
          }
          let data = this.openData
          data.year = Number(new Date(this.openData.year).getFullYear())
          this.runs ? Object.assign(data,{materials:this.imgLists.length > 0 ? this.imgLists.map(item=> item.fileid).join(',') : ''}) : data
          let res = this.drule ? await putDisruleData(data) : await putSealData(data)
          if(res.code === 200){
            this.$message.success('办理成功')
            this.handleClose()
            this.$emit('getData')
          }
        }else {
          return false
        }
      })
    },
    saveFourData(){
      this.$refs.openData.validate(async (valid)=>{
        if(valid){
          let data = this.openData
          Object.assign(data,{
            tyfile:this.tyfile.length > 0 ? this.tyfile.map(item=> item.fileid).join(',') : '',
            syfile:this.syfile.length > 0 ? this.syfile.map(item=> item.fileid).join(',') : '',
            seyfile:this.seyfile.length > 0 ? this.seyfile.map(item=> item.fileid).join(',') : '',
            jyfile:this.jyfile.length > 0 ? this.jyfile.map(item=> item.fileid).join(',') : '',
            openfile:this.openfile.length > 0 ? this.openfile.map(item=> item.fileid).join(',') : '',
            endingfile:this.endfile.length > 0 ? this.endfile.map(item=> item.fileid).join(',') : '',
          })
          if(this.openData.iscontract == null){
            this.$message.error('请选择是否到期合同文件')
            return false
          }else if(this.openData.iscontract == 1){
            if(this.endfile.length > 0){
              Object.assign(data,{contractfile:this.fileLists.map(item=> item.fileid).join(',')})
            }else {
              this.$message.error('请上传合同文件')
              return false
            }
          }
          let res = await putFourData(data)
          if(res.code == 200){
            this.$message.success('办理成功')
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
      this.keys = null
      this.caindex = 0
      this.imgLists =this.zbimgs=this.dbimgs=this.cwimgs=this.otherimgs=this.incomeimgs=this.outimgs=[]
      this.tyfile=this.syfile=this.seyfile=this.jyfile=this.openfile=this.endfile=[]
      this.oneshow=false
      this.twoshow=this.thrshow=this.fourshow=this.fiveshow=this.sixshow=true
      this.$refs.openData.resetFields()
      this.openData = this.$options.data().openData
      this.dialogVisible = false
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../style/topen.scss";
</style>
