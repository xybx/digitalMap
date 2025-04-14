<template>
  <div class="employinfo">
    <div id="water6">
      <canvas id="canvas"></canvas>
    </div>
    <el-form :model="employData" :inline="true" status-icon label-width="110px">
      <el-form-item label="就业状况">
        <el-select
          v-model="employData.jobstate"
          placeholder="请选择就业状况"
          :disabled="disabled"
          @change="seltChange"
        >
          <el-option
            v-for="item in jobData"
            :key="item.dicid"
            :value="item.dicid"
            :label="item.dicname"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单位性质">
        <el-select
          v-model="employData.companytype"
          placeholder="请选择单位性质"
          :disabled="disabled"
          @change="seltChange"
        >
          <el-option
            v-for="item in comData"
            :key="item.dicid"
            :value="item.dicid"
            :label="item.dicname"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单位名称">
        <el-input
          v-model="employData.companyname"
          :readonly="readonly"
          placeholder="请输入单位名称"
          @input="inputChange"
        />
      </el-form-item>
      <el-form-item label="就业扶持情况">
        <el-input
          v-model="employData.support"
          :readonly="readonly"
          placeholder="请输入就业扶持情况"
          @input="inputChange"
        />
      </el-form-item>
      <el-form-item label="就业培训情况">
        <el-input
          v-model="employData.train"
          :readonly="readonly"
          placeholder="请输入就业培训情况"
          @input="inputChange"
        />
      </el-form-item>
      <el-form-item label="帮扶情况">
        <el-input
          v-model="employData.help"
          :readonly="readonly"
          placeholder="请输入帮扶情况"
          @input="inputChange"
        />
      </el-form-item>
      <el-form-item label="未就业原因">
        <el-input
          v-model="employData.reasons"
          :readonly="readonly"
          placeholder="请输入未就业原因"
          @input="inputChange"
        />
      </el-form-item>
      <el-form-item label="享受政策">
        <el-input
          v-model="employData.enjoypolicy"
          :readonly="readonly"
          placeholder="请输入享受政策"
          @input="inputChange"
        />
      </el-form-item>
      <el-form-item label="贷款金额">
        <el-input
          v-model="employData.loans"
          :readonly="readonly"
          placeholder="请输入贷款金额"
          @input="inputChange"
        />
      </el-form-item>
      <el-form-item label="办理时间（贷款）" class="overline">
        <el-date-picker
          v-model="employData.loansdate"
          type="date"
          :readonly="readonly"
          value-format="yyyy-MM-dd"
          placeholder="请选择办理时间（贷款）"
          @change="seltChange"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="技能特长">
        <el-input
          v-model="employData.skill"
          :readonly="readonly"
          placeholder="请输入技能特长"
          @input="inputChange"
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="employData.remark"
          :readonly="readonly"
          placeholder="请输入备注"
          @input="inputChange"
        />
      </el-form-item>
      <div class="btnbox">
        <el-button
          v-if="partype != 2"
          type="primary"
          size="medium"
          :disabled="btndisabled"
          @click="saveEmploy"
        >
          保 存
        </el-button>
        <el-button
          v-if="partype != 2"
          plain
          size="medium"
          :disabled="btndisabled"
          @click="resetEmploy"
        >
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
    putSkillData,
    getSkillDetail,
  } from '../api/resident'
  export default {
    name: 'employinfo',
    data() {
      return {
        employData: {},
        comData: [],
        jobData: [],
        readonly: false,
        disabled: false,
      }
    },
    props: ['partype', 'parpid', 'cardid', 'btndisabled', 'isedit'],
    computed: {
      ...mapGetters({
        username: 'user/username',
      }),
    },
    created() {
      this.getcompany()
      this.getjob()
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
        water6.setAttribute('style', style) //给要添加水印的元素设置样式
      },
      async getjob() {
        let res = await getDictionaryList({ dictypeid: 20 })
        if (res.data) {
          this.jobData = res.data
        }
      },
      async getcompany() {
        let res = await getDictionaryList({ dictypeid: 21 })
        if (res.data) {
          this.comData = res.data
        }
      },
      inputChange(val) {
        this.$emit('saveskill', true)
      },
      seltChange(val) {
        this.$forceUpdate()
        this.$emit('saveskill', true)
      },
      async showData() {
        let res = await getSkillDetail({ memberid: this.cardid })
        if (res.data) {
          this.employData = res.data
        } else {
          this.employData = {}
        }
        if (this.partype == 2) {
          this.readonly = true
          this.disabled = true
        } else {
          this.readonly = false
          this.disabled = false
        }
      },
      async saveEmploy() {
        if (this.isedit) {
          this.$baseConfirm('您已修改户信息请保存', '提示', () => {
            return false
          })
        }
        let data = Object.assign({}, this.employData)
        let masterid = JSON.parse(sessionStorage.getItem('upform')).memberid
        Object.assign(data, { memberid: this.cardid ? this.cardid : masterid })
        let res = await putSkillData(data)
        if (res.code == 200) {
          this.$message.success('保存成功')
          this.employData = res.data
          this.$emit('saveskill', false)
        }
      },
      resetEmploy() {
        this.employData = this.$options.data().employData
        if (this.partype == 1) {
          this.$emit('saveskill', true)
        } else if (this.partype == 3) {
          this.$emit('saveskill', false)
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
  #water6 {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
    z-index: 1;
  }
  .employinfo {
    display: flex;
    flex-direction: row;
    .el-form {
      ::v-deep {
        .btnbox {
          margin-top: 20px;
        }
        .el-form-item {
          width: 33.3%;
          margin: 0;
          &:nth-child(1),
          &:nth-child(2),
          &:nth-child(3) {
            .el-form-item__label,
            .el-form-item__content {
              border-top: 1px solid #ebeef5;
            }
            .el-form-item__label {
              height: 47px;
              line-height: 47px;
            }
          }
          &:nth-child(3n-2) {
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
            width: calc(100% - 110px);
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
</style>
