<template>
  <div class="goverinfo">
     <div id="water4">
      <canvas id="canvas"></canvas>
    </div>
    <el-form :model="goverData" :inline="true" status-icon label-width="110px">
      <div class="itembox" v-if="!showbox">
        <div class="itemtit">
          <i></i>
          <span>党员信息</span>
        </div>
        <el-form-item label="是否党员">
          <el-select v-model="goverData.party" placeholder="请选择是否党员" :disabled="partydisabled" @change="partyChange">
            <el-option :value="0" label="否"></el-option>
            <el-option :value="1" label="是"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属支部">
          <el-input v-model="goverData.department" :readonly="preadonly" placeholder="请输入所属支部" @input="inputChange"/>
        </el-form-item>
        <el-form-item label="进入党支部日期" class="overline">
          <el-date-picker v-model="goverData.joinpartmentdate" :readonly="preadonly" type="date" placeholder="请选择进入党支部日期" value-format="yyyy-MM-dd" @change="seltChange"></el-date-picker>
        </el-form-item>
        <el-form-item label="入党日期">
          <el-date-picker v-model="goverData.joindate" :readonly="preadonly" type="date" placeholder="请选择入党日期" value-format="yyyy-MM-dd" @change="seltChange"></el-date-picker>
        </el-form-item>
        <el-form-item label="入党时所在党支部" class="overline">
          <el-input v-model="goverData.olddepartment" :readonly="preadonly" placeholder="请输入入党时所在党支部" @input="inputChange"/>
        </el-form-item>
        <el-form-item label="专长">
          <el-input v-model="goverData.speciality" :readonly="preadonly" placeholder="请输入专长" @input="inputChange"/>
        </el-form-item>
        <el-form-item label="转正日期">
          <el-date-picker v-model="goverData.officialdate" :readonly="preadonly" type="date" placeholder="请选择转正日期" value-format="yyyy-MM-dd" @change="seltChange"></el-date-picker>
        </el-form-item>
        <el-form-item label="转正情况">
          <el-input v-model="goverData.officialcondition" :readonly="preadonly" placeholder="请输入转正情况" @input="inputChange"/>
        </el-form-item>
        <el-form-item label="党内职务">
          <el-input v-model="goverData.duty" :readonly="preadonly" placeholder="请输入党内职务" @input="inputChange"/>
        </el-form-item>
        <el-form-item label="党员状态">
          <el-select v-model="goverData.state" placeholder="请选择党员状态" :disabled="pdisabled" @change="seltChange">
            <el-option v-for="item in dutyData" :key="item.dicid" :value="item.dicid" :label="item.dicname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖惩情况">
          <el-input v-model="goverData.award" :readonly="preadonly" placeholder="请输入奖惩情况" @input="inputChange"/>
        </el-form-item>
        <el-form-item label="培训情况">
          <el-input v-model="goverData.train" :readonly="preadonly" placeholder="请输入培训情况" @input="inputChange"/>
        </el-form-item>
      </div>
      <div class="itembox" v-if="!showactive">
        <div class="itemtit">
          <i></i>
          <span>入党积极分子信息</span>
        </div>
        <el-form-item label="积极分子状态">
          <el-select v-model="goverData.activist" placeholder="请选择积极分子状态" :disabled="actdisabled" @change="actChange">
            <el-option v-for="item in activistData" :key="item.dicid" :value="item.dicid" :label="item.dicname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属支部">
          <el-input v-model="goverData.activistdepartment" :readonly="areadonly" placeholder="请输入所属支部" @input="inputChange"/>
        </el-form-item>
        <el-form-item label="成为积极分子年份" class="overline">
          <el-date-picker v-model="goverData.activistdate" type="year" :readonly="areadonly" value-format="yyyy" placeholder="请选择成为积极分子年份" @change="seltChange"></el-date-picker>
        </el-form-item>
        <el-form-item label="申请时间">
          <el-date-picker v-model="goverData.proposerdate" type="date" :readonly="areadonly" value-format="yyyy-MM-dd" placeholder="请选择申请时间" @change="seltChange"></el-date-picker>
        </el-form-item>
        <el-form-item label="支部通过时间">
          <el-date-picker v-model="goverData.passdate" type="date" :readonly="areadonly" value-format="yyyy-MM-dd" placeholder="请选择支部通过时间" @change="seltChange"></el-date-picker>
        </el-form-item>
        <el-form-item label="党委备案日期">
          <el-date-picker v-model="goverData.recordsdate" type="date" :readonly="areadonly" value-format="yyyy-MM-dd" placeholder="请选择党委备案日期" @change="seltChange"></el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="goverData.remark" :readonly="areadonly" placeholder="请输入备注" @input="inputChange"/>
        </el-form-item>
      </div>
      <div class="btnbox">
        <el-button v-if="partype != 2" type="primary" size="medium" :disabled="btndisabled" @click="saveGover">保 存</el-button>
        <el-button v-if="partype != 2" plain size="medium" :disabled="btndisabled" @click="resetGover">重 置</el-button>
        <el-button type="primary" size="medium" plain @click="goback">返回列表</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import {getDictionaryList,putGoverData,getGoverDetail} from "../api/levrest";
import {mapGetters} from "vuex";
export default {
  name: "goverinfo",
  data() {
    return {
      goverData:{},
      dutyData:[],
      activistData:[],
      preadonly:false,
      areadonly:false,
      pdisabled:false,
      showbox:false,
      showactive:false,
      partydisabled:false,
      actdisabled:false,
    }
  },
  props:['partype','parpid','cardid','btndisabled','isedit'],
  computed: {
    ...mapGetters({
      username: 'user/username',
    }),
  },
  created() {
    this.getduty()
    this.getactivist()
  },
  mounted() {
    this.getWater()
  },
  methods: {
    //添加水印
    getWater() {
      const canvas = document.getElementById('canvas') //获取canvas
      canvas.width = 300 //设置画布宽度
      canvas.height = 260 //设置画布高度
      canvas.style.display = 'none' //隐藏画布本身
      const ctx = canvas.getContext('2d') //获取画笔
      ctx.font = '1.3vmax sans-serif' //设置文字大小
      ctx.fillStyle = 'rgba(0,0,0,.1)' //设置文字颜色及透明度
      ctx.rotate(-0.3) //设置文字旋转角度
      ctx.fillText(this.username, canvas.width / 6, canvas.height / 2) //设置显示文字内容
      const img = canvas.toDataURL('image/png') //参数默认为 image/png,可以是其他image/jpeg等，该方法返回值是一个url，是base64组成的图片的源数据、可以直接赋值给图片的src属性
      const style = `background-image:url(${img});` //定义样式
      water4.setAttribute('style', style) //给要添加水印的元素设置样式
    },
    async getduty(){
      let res = await getDictionaryList({dictypeid:14})
      if(res.data){
        this.dutyData = res.data
      }
    },
    async getactivist(){
      let res = await getDictionaryList({dictypeid:15})
      if(res.data){
        this.activistData = res.data
      }
    },
    inputChange(val){
      this.$emit('savegover',true)
    },
    seltChange(val){
      this.$forceUpdate()
      this.$emit('savegover',true)
    },
    partyChange(val){
      if(val == 1){
        this.preadonly = false
        this.pdisabled = false
        this.$emit('savegover',true)
        this.goverData.activist = 106
        this.areadonly = true
      }else {
        this.areadonly = false
        if(this.partype == 1){
          this.$baseConfirm('该条党员数据将会清空！','提示信息',()=>{
            this.goverData.department = ''
            this.goverData.joinpartmentdate = ''
            this.goverData.joindate= ''
            this.goverData.olddepartment = ''
            this.goverData.speciality = ''
            this.goverData.officialdate = ''
            this.goverData.officialcondition = ''
            this.goverData.duty = ''
            this.goverData.state = null
            this.goverData.award = ''
            this.goverData.train = ''
            this.goverData.party = val
            this.preadonly = true
            this.pdisabled = true
            this.$emit('savegover',true)
          },()=>{
            this.goverData.party = 1
            this.preadonly = false
            this.pdisabled = false
            this.$emit('savegover',false)
          })
        }else{
          this.preadonly = true
          this.pdisabled = true
          this.$emit('savegover',true)
        }
      }
    },
    actChange(val){
      if(val == 105 || val == 107 || val == 108){
        this.areadonly = false
        this.$emit('savegover',true)
      }else if(val == 106){
        if(this.partype == 1){
          this.$baseConfirm('该条积极分子数据将会清空！','提示信息',()=>{
            this.goverData.activistdepartment = ''
            this.goverData.activistdate = ''
            this.goverData.proposerdate= ''
            this.goverData.passdate = ''
            this.goverData.recordsdate = ''
            this.goverData.remark = ''
            this.goverData.activist = val
            this.areadonly = true
            this.$emit('savegover',true)
          },()=>{
            this.goverData.activist = 1
            this.areadonly = false
            this.$emit('savegover',false)
          })
        }else {
          this.areadonly = true
          this.$emit('savegover',true)
        }
      }
    },
    async showData(){
      let res = await getGoverDetail({memberid:this.cardid})
      if(res.data){
        this.goverData = res.data
        if(this.partype == 2 && this.goverData.party == 1){
            this.showactive = true
            this.showbox = false
        }else if(this.partype == 2 && this.goverData.party == 0){
          this.showbox = true
          this.showactive = false
        }
      }else{
        this.goverData = {}
      }
      if(this.partype == 2){
        this.preadonly = true
        this.pdisabled = true
        this.areadonly = true
        this.partydisabled =true
        this.actdisabled = true
      }else {
        this.preadonly = false
        this.pdisabled = false
        this.areadonly = false
        this.partydisabled = false
        this.actdisabled = false
      }
    },
    async saveGover(){
      if(this.isedit){
        this.$baseConfirm('您已修改户信息请保存','提示',()=>{
          return false
        })
      }
      let data = Object.assign({}, this.goverData)
      let masterid = JSON.parse(sessionStorage.getItem('upform')).memberid
      Object.assign(data,{memberid:this.cardid ? this.cardid : masterid})
      let res = await putGoverData(data)
      if(res.code === 200){
        this.$message.success('保存成功')
        this.goverData = res.data
        this.$emit('savegover',false)
      }
    },
    resetGover(){
      this.goverData = this.$options.data().goverData
      if(this.partype == 1){
        this.$emit('savegover',true)
      }else if(this.partype == 3){
        this.$emit('savegover',false)
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
#water4 {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  z-index: 1;
}
.goverinfo{
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
