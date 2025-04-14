<template>
  <el-dialog :visible.sync="dialogVisible" :title="headerTitle" :width="keys == 2 ? '70%' : '40%'"
    :before-close="keys == 2 ? lookClose : handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <!-- 表单 -->
    <el-form ref="frestData" :label-position="labelPosition" :model="frestData" status-icon label-width="11rem">
      <el-form-item label="已提交申请人数" prop="hasfillsum">
        <el-input v-model="frestData.haspasssum" placeholder="" readonly />
      </el-form-item>
      <!-- <el-form-item label="系统随机抽取数量" prop="enrollsum">
        <el-input v-model="frestData.extractsum" placeholder="" />
      </el-form-item>
      <div class="tip">注：有效期内数据不可修改</div>
      <el-form-item label="结果有效期">
        <el-date-picker v-model="value1" type="date" placeholder="请选择日期" :picker-options="pickerOptions"
          format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" :disabled="disabledTime"></el-date-picker>
      </el-form-item> -->
    </el-form>
    <!-- 表单 -->

    <!-- 虚线 -->
    <div class="line"></div>
    <!-- 虚线 -->

    <!-- 开始前所有学生名单 -->
    <div class="start-before" v-show="showList == true">
      <ul>
        <li v-for="(item, index) in beforeList" :key="index">
          {{ index + 1 }}、{{ item.babyname }}
        </li>
      </ul>
    </div>
    <!-- 开始前所有学生名单 -->

    <!-- 抽奖完成后学生名单 -->
    <div class="start-before" v-show="showList == false">
      <ul>
        <li v-for="(item, indexs) in afterList" :key="indexs">
          {{ indexs + 1 }}、{{ item.babyname }}
        </li>
      </ul>
    </div>
    <!-- 抽奖完成后学生名单 -->

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="-" @click="start" v-show="btnView">开 始</el-button>
      <el-button size="-" @click="handleClose">返 回</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getAllDrawing, postStartDrawing } from '../api/kind'
export default {
  name: 'forestdialog',
  data() {
    return {
      labelPosition: 'left', //表单label左对齐
      dialogVisible: false,
      headerTitle: '系统随机抽号', //弹窗标题
      tabCard: 'baseinfo',
      frestData: {},
      keys: null,
      beforeList: [], //开始抽奖前所有学生名单
      afterList: [], //抽奖后学生名单
      drawingYear: '',//抽奖传参年份
      drawingId: '', //抽奖传参学校id
      drawingState: '',//当前抽奖状态
      showList: false, //默认展示抽奖前人员名单
      btnView: false,//控制开始按钮的展示
    }
  },
  props: ['tcard'],
  components: {},
  created() { },
  mounted() { },
  methods: {
    async showEdit(schoolid, annual, drawingState) {
      this.dialogVisible = true

      //抽号所需参数
      this.drawingYear = annual
      this.drawingId = schoolid

      //当前抽号状态
      this.drawingState = drawingState
      // 默认展示全部学生名单
      this.showList = true

      let { data } = await getAllDrawing({
        schoolid: schoolid,
        annual: annual,
      })
      //表单赋值
      this.frestData = data
      //抽奖前所有学生名单
      this.beforeList = data.stagetwochildrens

      //判断“开始”按钮是否展示
      this.view()
    },
    lookClose() {
      this.dialogVisible = false
      this.title = ''
      this.frestData = this.$options.data().frestData
      this.drawingYear = ''
      this.drawingId = ''
    },
    handleClose() {
      this.dialogVisible = false
      this.title = ''
      this.frestData = this.$options.data().frestData
      this.$refs.frestData.resetFields()
      this.drawingYear = ''
      this.drawingId = ''
      this.$emit('getData')
    },

    //判断“开始”按钮是否展示
    view() {
      //如果抽奖状态为已抽过，则不展示抽奖按钮  0未抽过 1已抽过
      if (this.drawingState == 1) {
        this.btnView = false
      }
      //以上条件不成立，默认展示
      else {
        this.btnView = true
      }
    },

    //抽奖开始按钮
    async start() {
      //展示抽奖后的学生名单.
      this.showList = false

      let { data } = await postStartDrawing({
        annual: this.drawingYear,
        schoolid: this.drawingId,
      })
      //抽奖后的名单
      this.afterList = data
      this.btnView = false
    },

  },
}
</script>

<style lang="scss" scoped>
.tip {
  margin: 1rem 0;
  color: red;
}

.line {
  width: 100%;
  height: 1px;
  border: 1px black dashed;
  margin: 1rem 0;
}

.start-before {
  width: 100%;
  height: 30vh;
  overflow: auto;
  background: #ffe599;
  border: 2px black solid;
  border-radius: 16px;

  ul {
    display: flex;
    flex-wrap: wrap;

    li {
      width: 20%;
      margin: 0.5rem 0;
      color: #000;
    }
  }
}
</style>
