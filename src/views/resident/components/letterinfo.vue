<template>
  <div class="letterinfo">
    <div id="water7">
      <canvas id="canvas"></canvas>
    </div>
    <el-form ref="letterData" :model="letterData" :rules="rules" status-icon>
      <el-form-item label="是否信访重点关注人员" prop="attention">
        <el-select
          v-model="letterData.attention"
          placeholder="请选择是否信访重点关注人员"
          :disabled="disabled"
          @change="seltChange"
        >
          <el-option :value="0" label="否"></el-option>
          <el-option :value="1" label="是"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="partype != 2"
          type="primary"
          size="medium"
          :disabled="btndisabled"
          @click="saveLetter"
        >
          保 存
        </el-button>
        <el-button
          v-if="partype != 2"
          plain
          size="medium"
          :disabled="btndisabled"
          @click="resetLetter"
        >
          重 置
        </el-button>
        <el-button type="primary" size="medium" plain @click="goback">
          返回列表
        </el-button>
      </el-form-item>
    </el-form>
    <div class="listbox" v-if="partype === 2">
      <ul class="letterlist">
        <li v-for="item in listData" :key="item.id">
          <span>
            <label>信访诉求：</label>
            {{ item }}
          </span>
          <span><label>信访目的：</label></span>
          <span><label>信访状态：</label></span>
          <span><label>信访备注：</label></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { getLetterDetail, putLetterData } from '../api/resident'
  export default {
    name: 'letterinfo',
    data() {
      return {
        letterData: {
          attention: null,
        },
        rules: {
          attention: [
            {
              required: true,
              trigger: 'change',
              message: '请选择是否信访重点关注人员',
            },
          ],
        },
        listData: [],
        disabled: false,
        familydata: {},
      }
    },
    props: ['partype', 'parpid', 'cardid', 'btndisabled', 'isedit'],
    computed: {
      ...mapGetters({
        username: 'user/username',
      }),
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
        water7.setAttribute('style', style) //给要添加水印的元素设置样式
      },
      seltChange(val) {
        this.$emit('saveletter', true)
      },
      async showData() {
        let res = await getLetterDetail({ memberid: this.cardid })
        if (res.data) {
          this.listData = res.data.letters
          this.letterData.attention = Number(res.data.attention)
        } else {
          this.listData = []
          this.letterData.attention = null
        }
        if (this.partype == 2) {
          this.disabled = true
        } else {
          this.disabled = false
        }
      },
      saveLetter() {
        if (this.isedit) {
          this.$baseConfirm('您已修改户信息请保存', '提示', () => {
            return false
          })
        }
        this.$refs.letterData.validate(async (valid) => {
          if (valid) {
            let params = Object.assign({}, this.letterData)
            let masterid = JSON.parse(sessionStorage.getItem('upform')).memberid
            Object.assign(params, {
              memberid: this.cardid ? this.cardid : masterid,
            })
            let res = await putLetterData(params)
            if (res.code == 200) {
              this.$message.success('保存成功')
              this.letterData.attention = res.data
              this.$emit('saveletter', false)
            }
          } else {
            return false
          }
        })
      },
      resetLetter() {
        this.letterData = this.$options.data().letterData
        this.$refs.letterData.resetFields()
        if (this.partype == 1) {
          this.$emit('saveletter', true)
        } else if (this.partype == 3) {
          this.$emit('saveletter', false)
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
  #water7 {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
    z-index: 1;
  }
  .letterinfo {
    .listbox {
      .letterlist {
        overflow: hidden;
        li {
          float: left;
          width: calc(25% - 24px);
          background-color: #f9f9f9;
          border-top: 2px solid #0b87c1;
          padding: 15px 12px;
          span {
            color: #333;
            font-size: 14px;
            label {
              color: #999;
            }
          }
        }
      }
    }
  }
</style>
