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
  <el-dialog :visible.sync="dialogVisible" :title="title" width="42%" :before-close="tcard&&tcard != 'delay' ? globalClose:handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="partyData" :model="partyData" :rules="rules" status-icon label-width="140px">
      <template v-if="tcard">
        <template v-if="tcard == 'delay'">
          <el-form-item label="组织名称" prop="partyid">
            <el-select v-model="partyData.partyid" placeholder="请选择组织名称" clearable @change="orginClick">
              <el-option v-for="item in orginData" :key="item.pid" :label="item.partyname" :value="item.pid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属村居">
            <el-input v-model="partyData.villagename" disabled placeholder="请输入所属村居" />
          </el-form-item>
          <el-form-item label="延期内容" prop="meetingtype">
            <el-select v-model="partyData.meetingtype" placeholder="请选择延期内容" clearable @change="contentClick">
              <el-option :value="1" label="支部党员大会"></el-option>
              <el-option :value="2" label="支部委员会"></el-option>
              <el-option :value="3" label="党小组会"></el-option>
              <el-option :value="4" label="党课"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="延期年度" prop="annual">
            <el-date-picker v-model="partyData.annual" type="year" value-format="yyyy" placeholder="请选择延期年度" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="延期周期" prop="monthly" v-if="partyData.meetingtype">
            <el-select v-model="partyData.monthly" placeholder="请选择延期周期" clearable>
              <el-option v-for="(item,index) in countData" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择推送人员" prop="userids">
            <el-cascader class="newper" :key="caindex" v-model="partyData.userids" :disabled="disabled" :options="options" :props="props" filterable placeholder="请选择推送人员" @change="changeUser"></el-cascader>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="内容类型">
            <el-select v-model="partyData.meetingtype" placeholder="请选择内容类型" clearable @change="contentClick">
              <el-option :value="1" label="支部党员大会"></el-option>
              <el-option :value="2" label="支部委员会"></el-option>
              <el-option :value="3" label="党小组会"></el-option>
              <el-option :value="4" label="党课"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="组织名称">
            <el-select v-model="partyData.partyid" placeholder="请选择组织名称" clearable @change="orginClick">
              <el-option v-for="item in orginData" :key="item.pid" :label="item.partyname" :value="item.pid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支部党大会年度">
            <el-date-picker v-model="partyData.annual" type="year" value-format="yyyy" placeholder="请选择支部党大会年度" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="支部党大会周期">
            <el-select v-model="partyData.monthly" placeholder="请选择支部党大会周期" clearable>
              <el-option v-for="(item,index) in countData" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="召开时间">
            <el-date-picker v-model="partyData.starttime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择召开时间" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="上传人">
            <el-input v-model="partyData.upusername" placeholder="请输入上传人" />
          </el-form-item>
          <el-form-item label="现场图片">
            <div v-if="!imgData.length" class="imagebox">
              <i class="el-icon-picture-outline"></i>
              <u>暂无图片</u>
            </div>
            <template v-else>
              <el-image v-for="(item,index) in imgData" :key="index" :src="item" :preview-src-list="imgData" :z-index="2999"></el-image>
            </template>
          </el-form-item>
<!--          <el-form-item label="现场视频">-->
<!--            <video-player ref="videoPlayer" :playsinline="true" :options="playerOptions" />-->
<!--          </el-form-item>-->
        </template>
      </template>
      <template v-if="orgin">
        <el-form-item label="组织名称" prop="partyname">
          <el-input v-model="partyData.partyname" placeholder="请输入组织名称" />
        </el-form-item>
        <el-form-item label="所属村居" prop="areaid" v-if="showtag">
          <el-select v-model="partyData.areaid" :disabled="villdisabled" placeholder="请选择所属村居" clearable>
            <el-option v-for="item in villdata" :key="item.pid" :label="item.areaname" :value="item.pid"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template v-if="runs">
        <el-form-item label="成员姓名" prop="membertid">
          <el-select v-model="partyData.membertid" placeholder="请选择成员姓名" clearable @change="memberClick">
            <el-option v-for="item in memberData" :key="item.pid" :label="item.membername" :value="item.pid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属支部" prop="partyid">
          <el-select v-model="partyData.partyid" placeholder="请选择所属支部" disabled clearable>
            <el-option v-for="item in orginData" :key="item.pid" :label="item.partyname" :value="item.pid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属村居">
          <el-input v-model="partyData.villagename" disabled placeholder="请输入所属村居" />
        </el-form-item>
        <el-form-item label="缴费年度" prop="paymentyear">
          <el-date-picker v-model="partyData.paymentyear" type="year" value-format="yyyy" placeholder="请选择缴费年度" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="缴费月份" prop="paymentmonth">
          <el-select v-model="partyData.paymentmonth" placeholder="请选择缴费月份" clearable>
            <el-option v-for="(item,index) in countData" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缴费金额" prop="premiumreceived">
          <el-input v-model.number="partyData.premiumreceived" placeholder="请输入缴费金额" />
        </el-form-item>
      </template>
      <template v-if="member">
        <el-form-item label="姓名" prop="membername">
          <el-input v-model="partyData.membername" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="电话" prop="phonenum">
          <el-input v-model="partyData.phonenum" placeholder="请输入电话" maxlength="11" />
        </el-form-item>
        <el-form-item label="身份证号" prop="memberid">
          <el-input v-model="partyData.memberid" placeholder="请输入身份证号" maxlength="18" />
        </el-form-item>
        <el-form-item label="所属支部" prop="partyid">
          <el-select v-model="partyData.partyid" placeholder="请选择所属支部" clearable>
            <el-option v-for="item in orginData" :key="item.pid" :label="item.partyname" :value="item.pid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人员状态" prop="condition">
          <el-select v-model="partyData.condition" placeholder="请选择人员状态" clearable>
            <el-option :value="1" label="提交申请人员"></el-option>
            <el-option :value="2" label="入党积极分子"></el-option>
            <el-option :value="3" label="发展对象"></el-option>
            <el-option :value="4" label="预备党员"></el-option>
            <el-option :value="5" label="正式党员"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="党内职务" prop="duty">
          <el-input v-model="partyData.duty" placeholder="请输入党内职务" />
        </el-form-item>
        <el-form-item label="当前考察到期时间" prop="expiretime">
          <el-date-picker v-model="partyData.expiretime" type="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions" placeholder="请选择当前考察到期时间" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="到期是否推送提醒" prop="remind">
          <el-select v-model="partyData.remind" placeholder="请选择是否推送提醒" clearable>
            <el-option :value="0" label="否"></el-option>
            <el-option :value="1" label="是"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="partyData.remind == 1" label="选择推送人员" prop="userids">
          <el-cascader class="newper" :key="caindex" v-model="partyData.userids" :disabled="disabled" :options="options" :props="props" filterable placeholder="请选择推送人员" @change="changeUser"></el-cascader>
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="keys != 3" type="primary" size="-" @click="saveData">{{tcard == 'delay' ? '发 送' : '确 定'}}</el-button>
      <template>
        <el-button v-if="tcard&&tcard != 'delay'" size="-" @click="globalClose">取 消</el-button>
        <el-button v-else size="-" @click="handleClose">取 消</el-button>
      </template>
    </span>
  </el-dialog>
</template>

<script>
import {
  getMeetId, getMemberId,
  getMemberList,
  getOrgList,
  getOrgUserList,
  getRunsId,
  putdelay, putMember, putOrgin,
  putRunsData
} from "@/views/inspecte/api/party";
import {deleteimgFile} from "@/views/petition/api/petion";
// import {videoPlayer} from 'vue-video-player'
// import 'video.js/dist/video-js.css'
// import 'vue-video-player/src/custom-theme.css'
import {getareaVill} from "@/views/inspecte/api/topen";
export default {
  name: 'partylog',
  props:['tcard','runs','orgin','member','showtag'],
  data() {
    return {
      dialogVisible:false,
      title:'',
      partyData:{},
      villdata:[],
      rules:{
        partyid:[{required: true, trigger: "change", message: "请选择组织名称"}],
        villageid:[{required: true, trigger: "change", message: "请选择所属村居"}],
        meetingtype:[{required: true, trigger: "change", message: "请选择延期内容"}],
        annual:[{required: true, trigger: "change", message: "请选择延期年度"}],
        monthly:[{required: true, trigger: "change", message: "请选择延期周期"}],
        userids:[{type:'array',required: true, trigger: "change", message: "请选择推送人员"}],
        membertid:[{required: true, trigger: "change", message: "请选择成员"}],
        paymentyear:[{required: true, trigger: "change", message: "请选择缴费年度"}],
        paymentmonth:[{required: true, trigger: "change", message: "请选择缴费月份"}],
        premiumreceived:[{type: 'number',required: true, trigger: "blur", message: "请输入缴费金额且为数字值"}],
        membername:[{required: true, trigger: "blur", message: "请输入姓名"}],
        phonenum:[{required: true, trigger: "blur", message: "请输入电话"}],
        memberid:[{required: true, trigger: "blur", message: "请输入身份证号"}],
        condition:[{required: true, trigger: "change", message: "请选择人员状态"}],
        duty:[{required: true, trigger: "blur", message: "请输入党内职务"}],
        expiretime:[{required: true, trigger: "blur", message: "请输入当前考察到期时间"}],
        remind:[{required: true, trigger: "change", message: "请选择到期是否推送提醒"}],
        partyname:[{required: true, trigger: "blur", message: "请输入组织名称"}],
        areaid:[{required: true, trigger: "change", message: "请选择所属村居"}],
      },
      pickerOptions:{
        // disabledDate(time) {
        //   return time.getTime() <= Date.now() - (3600 * 24 * 1000);
        // },
      },
      villdisabled:false,
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
      disabled:false,
      keys:null,
      countData:[],
      orginData:[],
      departData:[],
      stateData:[],
      imgData:[],
      // playerOptions:{
      //   playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
      //   autoplay: false, // 如果为true,浏览器准备好时开始回放。
      //   muted: false, // 默认情况下将会消除任何音频。
      //   loop: false, // 是否视频一结束就重新开始。
      //   preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
      //   language: 'zh-CN',
      //   aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
      //   fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
      //   sources: [{
      //     type: "video/mp4", // 类型
      //     src: '' // url地址
      //   }],
      //   poster: '', // 封面地址
      //   notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
      //   controlBar: {
      //     timeDivider: true, // 当前时间和持续时间的分隔符
      //     durationDisplay: true, // 显示持续时间
      //     remainingTimeDisplay: false, // 是否显示剩余时间功能
      //     fullscreenToggle: true // 是否显示全屏按钮
      //   }
      // },
      memberData:[],
      ordata:{}
    }
  },
  components: {
    // videoPlayer
  },
  computed: {
    // player() {
    //   return this.$refs.videoPlayer.player
    // }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    async showEdit(pid,index){
      this.keys = index ? index : null
      let arr = ['新增','编辑','查看']
      this.title = arr[index-1]
      if(index != 1){
        let res = await getMemberId({pid})
        this.partyData = res.data
      }
      this.getUsers()
      this.getOrgin()
      this.dialogVisible = true
    },
    async showRuns(pid,index){
      this.keys = index ? index : null
      let arr = ['新增缴费','编辑缴费']
      this.title = arr[index-1]
      if(index == 2){
        let res = await getRunsId({pid})
        this.partyData = res.data
        this.partyData.villagename = res.data.areaname
        this.partyData.paymentyear = res.data.paymentyear.toString()
      }
      this.getMember()
      this.getCount()
      this.getOrgin()
      this.dialogVisible = true
    },
    async showOrgin(obj,index){
      this.keys = index ? index : null
      this.ordata = obj ? obj : {}
      let arr = ['新增组织','修改组织']
      this.title = arr[index-1]
      if(index == 2){
        this.partyData = obj
      }
      this.villdisabled = index == 2 ? true : false
      this.getVillage()
      this.dialogVisible = true
    },
    async getVillage(){
      let res = await getareaVill()
      this.villdata = res.data
    },
    async showDelay(pid,index){
      this.keys = index ? index : null
      this.title = this.tcard == 'delay' && index == 1 ?  '创建延期提醒' : '查看详情'
      if(index == 3){
        let res = await getMeetId({pid})
        this.partyData = res.data
        this.partyData.annual = res.data.annual.toString()
        if(this.tcard == 'delay'){
          this.getCount(res.data.meetingtype)
        }else{
          if(!!res.data.meetingfile){
            this.imgData = res.data.meetingfile.split(',').map(item=>{
              return `${this.$baseUrl}/gridfs/image/${item}`
            })
          }else {
            this.imgData = []
          }
          this.playerOptions.sources[0].src = res.data.meetingvideo ? res.data.meetingvideo : ''
        }
      }
      this.getOrgin()
      this.getUsers()
      this.dialogVisible = true
    },
    memberClick(val){
      let str = this.memberData.filter(item=> item.pid == val)[0].areaname
      let ptid = this.memberData.filter(item=> item.pid == val)[0].partyid
      this.partyData.partyid = ptid
      this.partyData.villagename = str
    },
    orginClick(val){
      this.$forceUpdate()
      let str = this.orginData.filter(item=> item.pid == val)[0].areaname
      this.partyData.villagename = str
    },
    async getMember(){
      let res = await getMemberList()
      this.memberData = res.data
    },
    async getOrgin(){
      let res = await getOrgList()
      this.orginData = res.data
    },
    async getUsers(){
      let res = await getOrgUserList()
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
    changeUser(val){
      if(val.length == 1 && val[0] === 0 && this.selectStates == 0){
        this.partyData.userids = this.handleSelectAllCity()
        this.selectStates = 1
        this.scrollToBottom()
        return false
      }
      if(this.selectStates == 1){
        this.partyData.userids = val.includes(0) ? val : []
        this.selectStates = this.partyData.userids.length == 0 ? 0 : 1
        return false
      } else{
        this.partyData.userids = val
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
    getCount(val){
      let arr = [1,2,3,4,5,6,7,8,9,10,11,12]
      if(val){
        if(val == 1 || val == 4){
          this.countData = arr.slice(0,4)
        }else if(val == 2 || val == 3){
          this.countData = arr
        }
      }else {
        this.countData = arr
      }
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
    contentClick(val){
      this.getCount(val)
    },
    saveData(){
      this.$refs.partyData.validate(async (valid)=>{
        if(valid){
          let data = {}
          if(this.orgin){
            Object.assign(data, {partyname:this.partyData.partyname, areaid:this.partyData.areaid},this.keys == 1 ? {parentpartid:this.ordata.pid} : {pid:this.partyData.pid})
          }else {
            Object.assign(data,this.partyData)
            this.$delete(data,'villagename')
          }
          let res = this.tcard&&this.tcard == 'delay' ? await putdelay(data) : this.runs ? await putRunsData(data) : this.orgin ? await putOrgin(data) :await putMember(data)
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
    globalClose(){
      this.title = ''
      this.disabled = false
      this.partyData = this.$options.data().partyData
      this.dialogVisible = false
    },
    handleClose(){
      this.title = ''
      this.disabled = this.villdisabled = false
      this.caindex = 0
      this.$refs.partyData.resetFields()
      this.partyData = this.$options.data().partyData
      if(this.orgin) this.$emit('getData')
      this.dialogVisible = false
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../style/party.scss";
</style>
