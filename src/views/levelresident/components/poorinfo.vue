<template>
  <div class="poorinfo">
    <div id="water2">
      <canvas id="canvas"></canvas>
    </div>
    <el-form :model="poorData" :inline="true" status-icon label-width="100px">
      <el-form-item label="是否贫困户">
        <el-select v-model="poorData.poverty" placeholder="请选择是否贫困户" :disabled="poverdisabled" @change="poverChange">
          <el-option :value="0" label="否"></el-option>
          <el-option :value="1" label="是"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="低保证号">
        <el-input v-model="poorData.cardid" :readonly="readonly" placeholder="请输入低保证号" @input="inputChange"/>
      </el-form-item>
      <el-form-item label="困难情况">
        <el-input v-model="poorData.povertysituation" :readonly="readonly" placeholder="请输入困难情况" @input="inputChange"/>
      </el-form-item>
      <el-form-item label="年收入">
        <el-select v-model="poorData.annualincome" placeholder="请选择年收入" :disabled="disabled" @change="seltChange">
          <el-option v-for="item in annuaData" :key="item.dicid" :value="item.dicid" :label="item.dicname"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="领取金额">
        <el-input v-model="poorData.amountof" :readonly="readonly" placeholder="请输入领取金额" @input="inputChange"/>
      </el-form-item>
      <el-form-item label="领取时间">
        <el-date-picker v-model="poorData.toreceivetime" type="date" :readonly="readonly" value-format="yyyy-MM-dd" placeholder="请选择领取时间" @change="seltChange"></el-date-picker>
      </el-form-item>
      <el-form-item label="享受地区">
        <el-input v-model="poorData.enjoyadress" :readonly="readonly" placeholder="请输入享受地区" @input="inputChange"/>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="poorData.notes" :readonly="readonly" placeholder="请输入备注" @input="inputChange"/>
      </el-form-item>
      <el-form-item label="在校生情况">
        <el-input v-model="poorData.studentstatus" :readonly="readonly" placeholder="请输入在校生情况" @input="inputChange"/>
      </el-form-item>
      <el-form-item label="健康状况">
        <el-input v-model="poorData.healthstatus" :readonly="readonly" placeholder="请输入健康状况" @input="inputChange"/>
      </el-form-item>
      <el-form-item label="劳动技能">
        <el-input v-model="poorData.skills" :readonly="readonly" placeholder="请输入劳动技能" @input="inputChange"/>
      </el-form-item>
      <el-form-item label="务工时间(月)">
        <el-input v-model="poorData.workerstime" :readonly="readonly" placeholder="请输入务工时间" @input="inputChange"/>
      </el-form-item>
      <el-form-item label="是否参加大病保险" class="overline">
        <el-select v-model="poorData.diseaseinsurance" placeholder="请选择是否参加大病保险" :disabled="disabled" @change="seltChange">
          <el-option :value="0" label="否"></el-option>
          <el-option :value="1" label="是"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="致贫原因">
        <el-input v-model="poorData.povertyreason" :readonly="readonly" placeholder="请输入致贫原因" @input="inputChange"/>
      </el-form-item>
      <el-form-item label="是否危房户">
        <el-select v-model="poorData.dangeroushouse" placeholder="请选择是否危房户" :disabled="disabled" @change="seltChange">
          <el-option :value="0" label="否"></el-option>
          <el-option :value="1" label="是"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="人均纯收入">
        <el-input v-model="poorData.percapitaincome" :readonly="readonly" placeholder="请输入人均纯收入" @input="inputChange"/>
      </el-form-item>
      <div class="btnbox">
        <el-button v-if="partype != 2" type="primary" size="medium" :disabled="btndisabled" @click="savePoor">保 存</el-button>
        <el-button v-if="partype != 2" plain size="medium" :disabled="btndisabled" @click="resetPoor">重 置</el-button>
        <el-button type="primary" size="medium" plain @click="goback">返回列表</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import {getDictionaryList, getPovertyDetail, putPovertyData} from '../api/levrest'
import {mapGetters} from "vuex";
export default {
  name: "poorinfo",
  data() {
    return {
      poorData:{},
      annuaData:[],
      readonly:false,
      disabled:false,
      poverdisabled:false,

    }
  },
  props:['partype','parpid','cardid','btndisabled','isedit'],
  computed: {
    ...mapGetters({
      username: 'user/username',
    }),
  },
  created() {
    this.getannualincome()
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
        water2.setAttribute('style', style) //给要添加水印的元素设置样式
      },
    async getannualincome(){
      let res = await getDictionaryList({dictypeid:19})
      if(res.data){
        this.annuaData = res.data
      }
    },
    async showData(){
      let res = await getPovertyDetail({memberid:this.cardid})
      if(res.data){
        this.poorData = res.data
      }else{
        this.poorData = {}
      }
      if(this.partype == 2){
        this.readonly = true
        this.disabled = true
        this.poverdisabled = true
      }else {
        this.readonly = false
        this.disabled = false
        this.poverdisabled = false
      }
    },
    inputChange(val){
      this.$emit('savepoor',true)
    },
    seltChange(val){
      this.$forceUpdate()
      this.$emit('savepoor',true)
    },
    poverChange(val){
     this.$forceUpdate()
      if(val === 1){
        this.readonly = false
        this.disabled = false
        this.$emit('savepoor',true)
      }else {
        if(this.partype == 1){
          this.$baseConfirm('该条扶贫数据将会清空！','提示信息',()=>{
            this.poorData = {}
            this.poorData.poverty = val
            this.readonly = true
            this.disabled = true
            this.$emit('savepoor',true)
          },()=>{
            this.poorData.poverty = 1
            this.readonly = false
            this.disabled = false
            this.$emit('savepoor',false)
          })
        }else{
          this.readonly = true
          this.disabled = true
          this.$emit('savepoor',true)
        }
      }
    },
    async savePoor(){
      if(this.isedit){
        this.$baseConfirm('您已修改户信息请保存','提示',()=>{
          return false
        })
      }
      let data = Object.assign({},this.poorData)
      let masterid = JSON.parse(sessionStorage.getItem('upform')).memberid
      Object.assign(data,{memberid:this.cardid ? this.cardid : masterid})
      let res = await putPovertyData(data)
      if(res.code == 200){
        this.$message.success('保存成功')
        this.poorData = res.data
        this.$emit('savepoor',false)
      }
    },
    resetPoor(){
      this.poorData = this.$options.data().poorData
      if(this.partype == 1){
        this.$emit('savepoor',true)
      }else if(this.partype == 3){
        this.$emit('savepoor',false)
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
  #water2 {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
    z-index: 1;
  }
.poorinfo{
  display: flex;
  flex-direction: row;
  .el-form{
    ::v-deep{
      .btnbox{
        margin-top: 20px;
      }
      .el-form-item{
        width: 33.3%;
        margin:0;
        &:nth-child(1),&:nth-child(2),&:nth-child(3){
          .el-form-item__label,.el-form-item__content{
            border-top: 1px solid #EBEEF5;
          }
          .el-form-item__label{
            height: 47px;
            line-height: 47px;
          }
        }
        &:nth-child(3n-2){
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
          width: calc(100% - 100px);
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
</style>
