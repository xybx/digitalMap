<template>
  <div class="treatinfo">
    <div id="water5">
      <canvas id="canvas"></canvas>
    </div>
    <el-form :model="treatData" :inline="true" status-icon label-width="125px">
      <div class="itembox">
        <div class="itemtit">
          <i></i>
          <span>残疾人信息</span>
        </div>
        <el-form-item label="是否残疾人">
          <el-select v-model="treatData.disability" placeholder="请选择是否残疾人" :disabled="abidisabled" @change="disChange">
            <el-option :value="0" label="否"></el-option>
            <el-option :value="1" label="是"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="残疾证号">
          <el-input v-model="treatData.disabilitynumber" :readonly="sreadonly" placeholder="请输入残疾证号"
            @input="inputChange" />
        </el-form-item>
        <el-form-item label="残疾类别">
          <el-select v-model="treatData.disabilitytype" placeholder="请选择残疾类别" :disabled="sdisabled" @change="seltChange">
            <el-option v-for="item in distypeData" :key="item.dicid" :value="item.dicid"
              :label="item.dicname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="残疾等级">
          <el-select v-model="treatData.disabilityclass" placeholder="请选择残疾等级" :disabled="sdisabled" @change="seltChange">
            <el-option v-for="item in dislevelData" :key="item.dicid" :value="item.dicid"
              :label="item.dicname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="残疾详情">
          <el-input v-model="treatData.disabilitydetails" :readonly="sreadonly" placeholder="请输入残疾详情"
            @input="inputChange" />
        </el-form-item>
        <el-form-item label="有效期开始时间">
          <el-date-picker v-model="treatData.disabilitydate" type="date" :readonly="sreadonly" placeholder="请选择有效期开始时间"
            @change="seltChange"></el-date-picker>
        </el-form-item>
        <el-form-item label="持证状态">
          <el-select v-model="treatData.disabilitystate" placeholder="请选择持证状态" :disabled="sdisabled" @change="seltChange">
            <el-option :value="0" label="非持证"></el-option>
            <el-option :value="1" label="持证"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否目测评定">
          <el-select v-model="treatData.disabilitycansee" placeholder="请选择是否目测评定" :disabled="sdisabled"
            @change="seltChange">
            <el-option :value="0" label="否"></el-option>
            <el-option :value="1" label="是"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="itembox">
        <div class="itemtit">
          <i></i>
          <span>退役军人信息</span>
        </div>
        <el-form-item label="人员类别">
          <el-select v-model="treatData.veterantype" placeholder="请选择人员类别" :disabled="vdisabled" @change="seltChange">
            <el-option v-for="item in veterperData" :key="item.dicid" :value="item.dicid"
              :label="item.dicname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否悬挂光荣牌">
          <el-select v-model="treatData.veteranhonour" placeholder="请选择是否悬挂光荣牌" :disabled="vetdisabled"
            @change="vetChange">
            <el-option :value="0" label="否"></el-option>
            <el-option :value="1" label="是"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请悬挂光荣牌时间" class="overline">
          <el-date-picker v-model="treatData.veteranhonourdate" type="date" :readonly="vetreadonly"
            placeholder="请选择申请悬挂光荣牌时间" @change="seltChange"></el-date-picker>
        </el-form-item>
        <el-form-item label="年收入">
          <el-select v-model="treatData.veteranincome" placeholder="请选择年收入" :disabled="vdisabled" @change="seltChange">
            <el-option v-for="item in veterData" :key="item.dicid" :value="item.dicid" :label="item.dicname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="现工作单位(含离退休前单位)" class="overline">
          <el-input v-model="treatData.veteranworkunit" :readonly="vreadonly" placeholder="请输入现工作单位(含离退休前单位)"
            @input="inputChange" />
        </el-form-item>
        <el-form-item label="享受国家抚恤补助金情况" class="overline">
          <el-select v-model="treatData.veteransubsidy" placeholder="请选择享受国家抚恤补助金情况" :disabled="vdisabled"
            @change="seltChange">
            <el-option :value="0" label="否"></el-option>
            <el-option :value="1" label="是"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入伍或参加工作时间" class="overline">
          <el-date-picker v-model="treatData.veterandate" type="date" :readonly="vreadonly" placeholder="请选择入伍或参加工作时间"
            @change="seltChange"></el-date-picker>
        </el-form-item>
        <el-form-item label="退役或离、退休时间" class="overline">
          <el-date-picker v-model="treatData.veteranretiredate" type="date" :readonly="vreadonly"
            placeholder="请选择退役或离退休时间" @change="seltChange"></el-date-picker>
        </el-form-item>
        <el-form-item label="部队代号">
          <el-input v-model="treatData.veterannumber" :readonly="vreadonly" placeholder="请输入部队代号" @input="inputChange" />
        </el-form-item>
        <el-form-item label="退役(退休或复员)证件号" class="overline">
          <el-input v-model="treatData.veterancardid" :readonly="vreadonly" placeholder="请输入退役(退休或复员)证件号"
            @input="inputChange" />
        </el-form-item>
        <el-form-item label="优待证发放状态">
          <el-select v-model="treatData.veteranydj" placeholder="请选择是否目测评定" :disabled="sdisabled"
            @change="seltChange">
            <el-option :value="0" label="否"></el-option>
            <el-option :value="1" label="是"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优待证发放时间">
          <el-date-picker v-model="treatData.veteranydjdate" type="date" :readonly="sreadonly" placeholder="请选择时间"
          value-format="yyyy-MM-dd" @change="seltChange"></el-date-picker>
        </el-form-item>
        <el-form-item label="荣军卡发放状态">
          <el-select v-model="treatData.veteranrjk" placeholder="请选择是否目测评定" :disabled="sdisabled"
            @change="seltChange">
            <el-option :value="0" label="否"></el-option>
            <el-option :value="1" label="是"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="荣军卡发放时间">
          <el-date-picker v-model="treatData.veteranrjkdate" type="date" :readonly="sreadonly" placeholder="请选择时间"
          value-format="yyyy-MM-dd" @change="seltChange"></el-date-picker>
        </el-form-item>
      </div>
      <div class="btnbox">
        <el-button v-if="partype != 2" type="primary" size="medium" :disabled="btndisabled" @click="saveTreat">
          保 存
        </el-button>
        <el-button v-if="partype != 2" plain size="medium" :disabled="btndisabled" @click="resetTreat">
          重 置
        </el-button>
        <el-button type="primary" size="medium" plain @click="goback">
          返回列表
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  getDictionaryList,
  putCivilData,
  getCivilDetail,
} from '../api/resident'
export default {
  name: 'treatinfo',
  data() {
    return {
      treatData: {},
      distypeData: [],
      dislevelData: [],
      veterperData: [],
      veterData: [],
      sreadonly: false,
      sdisabled: false,
      vreadonly: false,
      vdisabled: false,
      abidisabled: false,
      vetdisabled: false,
      vetreadonly: false,
    }
  },
  props: ['partype', 'parpid', 'cardid', 'btndisabled', 'isedit'],
  computed: {
    ...mapGetters({
      username: 'user/username',
    }),
  },
  created() {
    this.getdistype()
    this.getdislevel()
    this.getveterper()
    this.getveter()
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
      water5.setAttribute('style', style) //给要添加水印的元素设置样式
    },
    async getdistype() {
      let res = await getDictionaryList({ dictypeid: 16 })
      if (res.data) {
        this.distypeData = res.data
      }
    },
    async getdislevel() {
      let res = await getDictionaryList({ dictypeid: 17 })
      if (res.data) {
        this.dislevelData = res.data
      }
    },
    async getveterper() {
      let res = await getDictionaryList({ dictypeid: 18 })
      if (res.data) {
        this.veterperData = res.data
      }
    },
    async getveter() {
      let res = await getDictionaryList({ dictypeid: 19 })
      if (res.data) {
        this.veterData = res.data
      }
    },
    inputChange(val) {
      this.$forceUpdate()
      this.$emit('savetreat', true)
    },
    seltChange(val) {
      this.$forceUpdate()
      this.$emit('savetreat', true)
    },
    disChange(val) {
      this.$forceUpdate()
      if (val == 1) {
        this.sreadonly = false
        this.sdisabled = false
        this.$emit('savetreat', true)
      } else {
        if (this.partype == 1) {
          this.$baseConfirm(
            '该条党员数据将会清空！',
            '提示信息',
            () => {
              this.treatData.disabilitynumber = ''
              this.treatData.disabilitytype = null
              this.treatData.disabilityclass = null
              this.treatData.disabilitydetails = ''
              this.treatData.disabilitydate = ''
              this.treatData.disabilitystate = null
              this.treatData.disabilitycansee = null
              this.treatData.disability = val
              this.sreadonly = true
              this.sdisabled = true
              this.$emit('savetreat', true)
            },
            () => {
              this.treatData.disability = 1
              this.sreadonly = false
              this.sdisabled = false
              this.$emit('savetreat', false)
            }
          )
        } else {
          this.sreadonly = true
          this.sdisabled = true
          this.$emit('savetreat', true)
        }
      }
    },
    vetChange(val) {
      this.$forceUpdate()
      if (val == 1) {
        this.vetreadonly = false
        this.$emit('savetreat', true)
      } else {
        if (this.partype == 1) {
          this.treatData.veteranhonourdate = ''
          this.vetreadonly = true
          this.$emit('savetreat', true)
        } else {
          this.vetreadonly = true
          this.$emit('savetreat', true)
        }
      }
    },
    async showData() {
      let res = await getCivilDetail({ memberid: this.cardid })
      if (res.data) {
        this.treatData = res.data
      } else {
        this.treatData = {}
      }
      if (this.partype == 2) {
        this.sreadonly = true
        this.sdisabled = true
        this.vetdisabled = true
        this.vetreadonly = true
        this.vreadonly = true
        this.vdisabled = true
        this.abidisabled = true
      } else {
        this.sreadonly = false
        this.sdisabled = false
        this.vetdisabled = false
        this.vetreadonly = false
        this.vreadonly = false
        this.vdisabled = false
        this.abidisabled = false
      }
    },
    async saveTreat() {
      if (this.isedit) {
        this.$baseConfirm('您已修改户信息请保存', '提示', () => {
          return false
        })
      }
      let data = Object.assign({}, this.treatData)
      let masterid = JSON.parse(sessionStorage.getItem('upform')).memberid
      Object.assign(data, { memberid: this.cardid ? this.cardid : masterid })
      let res = await putCivilData(data)
      if (res.code == 200) {
        this.$message.success('保存成功')
        this.treatData = res.data
        this.$emit('savetreat', false)
      }
    },
    resetTreat() {
      this.treatData = this.$options.data().treatData
      if (this.partype == 1) {
        this.$emit('savetreat', true)
      } else if (this.partype == 3) {
        this.$emit('savetreat', false)
      }
    },
    goback() {
      sessionStorage.removeItem('upform')
      this.$emit('goback')
    },
  },
}
</script>

<style lang="scss" scoped>
#water5 {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  z-index: 1;
}

.treatinfo {
  display: flex;
  flex-direction: row;

  .el-form {
    ::v-deep {
      .btnbox {
        margin-top: 20px;
      }

      .itembox {
        margin-bottom: 20px;

        .itemtit {
          width: calc(100% - 2px);
          background-color: #f5f7fa;
          color: #333;
          display: flex;
          justify-content: left;
          align-items: center;
          flex-direction: row;
          padding: 10px;
          border: 1px solid #ebeef5;

          span {
            margin-left: 10px;
            line-height: 20px;
            display: inline-block;
            color: #05336f;
          }

          i {
            width: 3px;
            height: 16px;
            background-color: #0c9ed7;
            display: inline-block;
          }
        }

        .el-form-item {
          width: 33.3%;
          margin: 0;

          &:nth-child(3n-1) {
            .el-form-item__label {
              border-left: 1px solid #ebeef5;
            }
          }

          &.overline {
            .el-form-item__label {
              line-height: 23px;
            }
          }

          .el-form-item__label {
            background-color: #f5f7fa;
            text-align: left;
            padding-left: 8px;
            height: 46px;
            line-height: 46px;
            font-size: 15px;
            border-bottom: 1px solid #ebeef5;
          }

          .el-form-item__content {
            width: calc(100% - 125px);
            border-left: 1px solid #ebeef5;
            border-right: 1px solid #ebeef5;
            border-bottom: 1px solid #ebeef5;

            .el-input,
            .el-select {
              width: 100%;
              height: 45px;
              line-height: 45px;

              .el-input__inner {
                border: none;
                height: 45px !important;
                line-height: 45px;
                font-size: 15px;
              }
            }

            .el-form-item__error {
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
