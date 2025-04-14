<template>
  <div class="healinfo">
    <div id="water3">
      <canvas id="canvas"></canvas>
    </div>
    <el-form ref="healData" :model="healData" :inline="true" status-icon label-width="110px">
      <div class="itembox">
        <div class="itemtit">
          <i></i>
          <span>医疗征缴</span>
        </div>
        <el-form-item label="是否缴纳医保">
          <el-select v-model="healData.medicalpayment" placeholder="请选择是否缴纳医保" :disabled="paydisabled" @change="payChange">
            <el-option :value="0" label="否"></el-option>
            <el-option :value="1" label="是"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="社会保障号码" required>
          <el-input v-model="healData.medicalnumber" :readonly="mreadonly" placeholder="请输入社会保障号码" @input="inputChange"/>
        </el-form-item>
        <el-form-item label="参保群体">
          <el-select v-model="healData.medicalinsurancegroup" placeholder="请选择参保群体" :disabled="mdisabled" @change="seltChange">
            <el-option v-for="item in mecgroupData" :key="item.dicid" :value="item.dicid" :label="item.dicname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="社区名称">
          <el-input v-model="healData.medicalcommunity" :readonly="mreadonly" placeholder="请输入社区名称" @input="inputChange"/>
<!--          <el-select v-model="healData.medicalcommunity" placeholder="请选择社区名称" :disabled="disabled" @change="seltChange">-->
<!--            <el-option v-for="item in communData" :key="item.dicid" :value="item.dicid" :label="item.dicname"></el-option>-->
<!--          </el-select>-->
        </el-form-item>
        <el-form-item label="缴费人员类别">
          <el-select v-model="healData.medicalpersonnelcategory" placeholder="请选择缴费人员类别" :disabled="mdisabled" @change="seltChange">
            <el-option v-for="item in medicalperData" :key="item.dicid" :value="item.dicid" :label="item.dicname"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="itembox">
        <div class="itemtit">
          <i></i>
          <span>养老保险</span>
        </div>
        <el-form-item label="是否参加养老保险" class="overline">
          <el-select v-model="healData.endowmentpayment" placeholder="请选择是否参加养老保险" :disabled="enddisabled" @change="endChange">
            <el-option :value="0" label="否"></el-option>
            <el-option :value="1" label="是"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="社会保障号码" required>
          <el-input v-model="healData.endowmentnumber" :readonly="ereadonly" placeholder="请输入社会保障号码" @input="inputChange"/>
        </el-form-item>
        <el-form-item label="参保日期">
          <el-date-picker v-model="healData.endowmentdate" type="date" :readonly="ereadonly" value-format="yyyy-MM-dd" placeholder="请选择参保日期" @change="seltChange"></el-date-picker>
        </el-form-item>
        <el-form-item label="参保状态">
          <el-select v-model="healData.endowmentstate" placeholder="请选择参保状态" :disabled="edisabled" @change="seltChange">
            <el-option v-for="item in endstateData" :key="item.dicid" :value="item.dicid" :label="item.dicname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参保群体">
          <el-select v-model="healData.endowmentgroup" placeholder="请选择参保群体" :disabled="edisabled" @change="seltChange">
            <el-option v-for="item in groupData" :key="item.dicid" :value="item.dicid" :label="item.dicname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缴费人员类别">
          <el-select v-model="healData.endowmentpersonnelcategory" placeholder="请选择缴费人员类别" :disabled="edisabled" @change="seltChange">
            <el-option v-for="item in endperData" :key="item.dicid" :value="item.dicid" :label="item.dicname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代扣银行名称">
          <el-input v-model="healData.endowmentwithholdingbank" :readonly="ereadonly" placeholder="请输入代扣银行名称" @input="inputChange"/>
        </el-form-item>
        <el-form-item label="发放银行名称">
          <el-input v-model="healData.endowmentissuingbank" :readonly="ereadonly" placeholder="请输入发放银行名称" @input="inputChange"/>
        </el-form-item>
      </div>
      <div class="itembox">
        <div class="itemtit">
          <i></i>
          <span>新冠疫苗接种</span>
        </div>
        <el-form-item label="是否接种疫苗">
          <el-select v-model="healData.vaccinepayment" placeholder="请选择是否接种疫苗" :disabled="vacdisabled" @change="vacChange">
            <el-option :value="0" label="否"></el-option>
            <el-option :value="1" label="是"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="疫苗接种编号">
          <el-input v-model="healData.vaccinenumber" :readonly="vreadonly" placeholder="请输入疫苗接种编号" @input="inputChange"/>
        </el-form-item>
        <el-form-item label="移动电话">
          <el-input v-model="healData.vaccinephone" :readonly="vreadonly" maxlength="11" placeholder="请输入移动电话" @input="inputChange"/>
        </el-form-item>
        <el-form-item label="工作单位名称">
          <el-input v-model="healData.vaccinecompany" :readonly="vreadonly" placeholder="请输入工作单位名称" @input="inputChange"/>
        </el-form-item>
        <el-form-item label="第一针疫苗接种时间" class="overline">
          <el-date-picker v-model="healData.vaccineonedate" type="datetime" :readonly="vreadonly" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择第一针疫苗接种时间" @change="seltChange"></el-date-picker>
        </el-form-item>
        <el-form-item label="第一针疫苗接种门诊" class="overline">
          <el-input v-model="healData.vaccineonename" :readonly="vreadonly" placeholder="请输入第一针疫苗接种门诊" @input="inputChange"/>
        </el-form-item>
        <el-form-item label="第二针疫苗接种时间" class="overline">
          <el-date-picker v-model="healData.vaccinetwodate" type="datetime" :readonly="vreadonly" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择第二针疫苗接种时间" @change="seltChange"></el-date-picker>
        </el-form-item>
        <el-form-item label="第二针疫苗接种门诊" class="overline">
          <el-input v-model="healData.vaccinetwoname" :readonly="vreadonly" placeholder="请输入第二针疫苗接种门诊" @input="inputChange"/>
        </el-form-item>
        <el-form-item label="第三针疫苗接种时间" class="overline">
          <el-date-picker v-model="healData.vaccinethreedate" type="datetime" :readonly="vreadonly" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择第三针疫苗接种时间" @change="seltChange"></el-date-picker>
        </el-form-item>
        <el-form-item label="第三针疫苗接种门诊" class="overline">
          <el-input v-model="healData.vaccinethreename" :readonly="vreadonly" placeholder="请输入第三针疫苗接种门诊" @input="inputChange"/>
        </el-form-item>
        <el-form-item label="备注（其他）">
          <el-input v-model="healData.vaccineother" :readonly="vreadonly" placeholder="请输入备注" @input="inputChange"/>
        </el-form-item>
      </div>
      <div class="btnbox">
        <el-button v-if="partype != 2" type="primary" size="medium" :disabled="btndisabled" @click="saveHeal">保 存</el-button>
        <el-button v-if="partype != 2" plain size="medium" :disabled="btndisabled" @click="resetHeal">重 置</el-button>
        <el-button type="primary" size="medium" plain @click="goback">返回列表</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import {getDictionaryList, getMedicalDetail,putMedicalData} from "../api/levrest";
import bus from "@/utils/eventbus";
import {mapGetters} from "vuex";
export default {
  name: "healinfo",
  data() {
    return {
      healData:{},
      mecgroupData:[],
      communData:[],
      medicalperData:[],
      endperData:[],
      endstateData:[],
      groupData:[],
      mreadonly:false,
      mdisabled:false,
      ereadonly:false,
      edisabled:false,
      vreadonly:false,
      paydisabled:false,
      enddisabled:false,
      vacdisabled:false,
      pickerOptions:{
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    }
  },
  props:['partype','parpid','cardid','btndisabled','isedit'],
  computed: {
    ...mapGetters({
        username: 'user/username',
      }),
  },
  created() {
    this.getmecgroup()
    this.getcommunity()
    this.getmecper()
    this.getendstate()
    this.getendgroup()
    this.getendper()
  },
  mounted() {
    this.getWater()
  },
  methods: {
    //添加水印
    getWater() {
      const canvas = document.getElementById("canvas");//获取canvas
      canvas.width = 300;//设置画布宽度
      canvas.height = 260;//设置画布高度
      canvas.style.display = "none";//隐藏画布本身
      const ctx = canvas.getContext("2d");//获取画笔
      ctx.font = "1.3vmax sans-serif";//设置文字大小
      ctx.fillStyle = "rgba(0,0,0,.1)";//设置文字颜色及透明度
      ctx.rotate(-0.3);//设置文字旋转角度
      ctx.fillText(this.username, canvas.width / 6, canvas.height / 2);//设置显示文字内容
      const img = canvas.toDataURL("image/png");//参数默认为 image/png,可以是其他image/jpeg等，该方法返回值是一个url，是base64组成的图片的源数据、可以直接赋值给图片的src属性
      const style = `background-image:url(${img});`;//定义样式
      water3.setAttribute("style", style);//给要添加水印的元素设置样式
    },
    async getmecgroup(){
      let res = await getDictionaryList({dictypeid:8})
      if(res.data){
        this.mecgroupData = res.data
      }
    },
    async getcommunity(){
      let res = await getDictionaryList({dictypeid:9})
      if(res.data){
        this.communData = res.data
      }
    },
    async getmecper(){
      let res = await getDictionaryList({dictypeid:10})
      if(res.data){
        this.medicalperData = res.data
      }
    },
    async getendstate(){
      let res = await getDictionaryList({dictypeid:11})
      if(res.data){
        this.endstateData = res.data
      }
    },
    async getendgroup(){
      let res = await getDictionaryList({dictypeid:12})
      if(res.data){
        this.groupData = res.data
      }
    },
    async getendper(){
      let res = await getDictionaryList({dictypeid:13})
      if(res.data){
        this.endperData = res.data
      }
    },
    inputChange(val){
      this.$forceUpdate()
      this.$emit('saveheal',true)
    },
    seltChange(val){
      this.$forceUpdate()
      this.$emit('saveheal',true)
    },
    payChange(val){
      this.$forceUpdate()
      if(val == 1){
        this.mreadonly = false
        this.mdisabled = false
        this.$emit('saveheal',true)
      }else {
        if(this.partype == 1){
          this.$baseConfirm('该条医疗数据将会清空！','提示信息',()=>{
            this.healData.medicalnumber = ''
            this.healData.medicalinsurancegroup = null
            this.healData.medicalcommunity= ''
            this.healData.medicalpersonnelcategory = null
            this.healData.medicalpayment = val
            this.mreadonly = true
            this.mdisabled = true
            this.$emit('saveheal',true)
          },()=>{
            this.healData.medicalpayment = 1
            this.mreadonly = false
            this.mdisabled = false
            this.$emit('saveheal',false)
          })
        }else{
          this.mreadonly = true
          this.mdisabled = true
          this.$emit('saveheal',true)
        }
      }
    },
    endChange(val){
      this.$forceUpdate()
      if(val == 1){
        this.ereadonly = false
        this.edisabled = false
        this.$emit('saveheal',true)
      }else {
        if(this.partype == 1){
          this.$baseConfirm('该条养老数据将会清空！','提示信息',()=>{
            this.healData.endowmentnumber = ''
            this.healData.endowmentgroup = null
            this.healData.endowmentdate = ''
            this.healData.endowmentstate = null
            this.healData.endowmentwithholdingbank= ''
            this.healData.endowmentissuingbank = ''
            this.healData.endowmentpersonnelcategory = null
            this.healData.endowmentpayment = val
            this.ereadonly = true
            this.edisabled = true
            this.$emit('saveheal',true)
          },()=>{
            this.healData.endowmentpayment = 1
            this.ereadonly = false
            this.edisabled = false
            this.$emit('saveheal',false)
          })
        }else{
          this.ereadonly = true
          this.edisabled = true
          this.$emit('saveheal',true)
        }
      }
    },
    vacChange(val){
      this.$forceUpdate()
      if(val == 1){
        this.vreadonly = false
        this.$emit('saveheal',true)
      }else {
        if(this.partype == 1){
          this.$baseConfirm('该条疫苗数据将会清空！','提示信息',()=>{
            this.healData.vaccinenumber = ''
            this.healData.vaccinephone = ''
            this.healData.vaccinecompany= ''
            this.healData.vaccineonedate= ''
            this.healData.vaccineonename= ''
            this.healData.vaccinetwodate= ''
            this.healData.vaccinetwoname= ''
            this.healData.vaccinethreedate= ''
            this.healData.vaccinethreename= ''
            this.healData.vaccineother= ''
            this.healData.vaccinepayment = val
            this.vreadonly = true
            this.$emit('saveheal',true)
          },()=>{
            this.healData.vaccinepayment = 1
            this.vreadonly = false
            this.$emit('saveheal',false)
          })
        }else{
          this.vreadonly = true
          this.$emit('saveheal',true)
        }
      }
    },
    async showData(){
      let res = await getMedicalDetail({memberid:this.cardid})
      if(res.data){
        this.healData = res.data
      }else{
        this.healData = {}
      }
      if(this.partype == 2){
        this.mreadonly = true
        this.mdisabled = true
        this.ereadonly = true
        this.edisabled = true
        this.vreadonly = true
        this.paydisabled = true
        this.enddisabled = true
        this.vacdisabled = true
      }else {
        this.mreadonly = false
        this.mdisabled = false
        this.ereadonly = false
        this.edisabled = false
        this.vreadonly = false
        this.paydisabled = false
        this.enddisabled = false
        this.vacdisabled = false
      }
    },
    async saveHeal(){
      if(this.isedit){
        this.$baseConfirm('您已修改户信息请保存','提示',()=>{
          return false
        })
      }
      if(this.healData.medicalpayment == 1 && this.healData.medicalnumber == ''){
          this.$message.error('请填写医疗社会保障号码')
          return false
      }
      if(this.healData.endowmentpayment == 1 && this.healData.endowmentnumber == ''){
          this.$message.error('请填写养老社会保障号码')
          return false
      }
      let data = Object.assign({}, this.healData)
      let masterid = JSON.parse(sessionStorage.getItem('upform')).memberid
      Object.assign(data,{memberid:this.cardid ? this.cardid : masterid})
      let res = await putMedicalData(data)
      if(res.code === 200){
        this.$message.success('保存成功')
        this.healData = res.data
        this.$emit('saveheal',false)
      }
    },
    resetHeal(){
      this.healData = this.$options.data().healData
      this.$refs.healData.resetFields()
      if(this.partype == 1){
        this.$emit('saveheal',true)
      }else if(this.partype == 3){
        this.$emit('saveheal',false)
      }
    },
    goback(){
      sessionStorage.removeItem('upform')
      this.$emit('goback')
    },
  }
}
</script>

<style lang="scss" scoped>
#water3{
    width: 100%;
    height: 100%;
    position: absolute;
    left:0;
    top:0;
    pointer-events: none;
    z-index:1;
}
.healinfo{
  display: flex;
  flex-direction: row;
  .el-form{
    ::v-deep{
      .btnbox{
        margin-top: 20px;
      }
      .itembox{
        margin-bottom: 20px;
        .itemtit{
          width: calc(100% - 2px);
          background-color:#F5F7FA;
          color: #333;
          display: flex;
          justify-content: left;
          align-items: center;
          flex-direction: row;
          padding: 10px;
          border:1px solid #EBEEF5;
          span{
            margin-left: 10px;
            line-height: 20px;
            display: inline-block;
            color:#05336F;
          }
          i{
            width: 3px;
            height:16px;
            background-color:#0C9ED7;
            display: inline-block;
          }
        }

        .el-form-item{
          width: 33.3%;
          margin:0;
          &:nth-child(3n-1){
            .el-form-item__label{
              border-left: 1px solid #EBEEF5;
            }
          }
          &.overline{
            .el-form-item__label{
              line-height: 23px;
            }
          }
          .el-form-item__label{
            background-color:#F5F7FA;
            text-align: left;
            padding-left:8px;
            height: 46px;
            line-height: 46px;
            font-size: 15px;
            border-bottom: 1px solid #EBEEF5;
          }
          .el-form-item__content{
            width: calc(100% - 110px);
            border-left:1px solid #EBEEF5;
            border-right:1px solid #EBEEF5;
            border-bottom: 1px solid #EBEEF5;
            .el-input,.el-select{
              width: 100%;
              height: 45px;
              line-height: 45px;
              .el-input__inner{
                border: none;
                height: 45px!important;
                line-height: 45px;
                font-size: 15px;
              }
            }
            .el-form-item__error{
              top: 35%;
              right: 10%;
              left: inherit;
            }
          }
        }
      }
    }
  }
}
</style>
