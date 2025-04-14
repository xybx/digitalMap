<template>
  <el-dialog :visible.sync="dialogVisible" :title="headerTitle" width="42%" top="1%" :before-close="keys == 2 ? lookClose : handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <!-- 表单 -->
    <div class="btnbox">
      <el-button type="warning" size="small" @click="exportList">全部导出</el-button>
    </div>
    <el-form ref="frestData" :label-position="labelPosition" :model="frestData" status-icon label-width="150px">
      <el-form-item label="总录取人数">
        <el-input v-model="frestData.enrollsum" placeholder="" readonly />
      </el-form-item>
      <div class="line"></div>
      <el-form-item label="第一阶段录取人数">
        <el-input v-model="frestData.hasenrollsum" placeholder="" readonly />
      </el-form-item>
      <div class="start-before">
        <ul>
          <li v-for="(item, index) in OneperList" :key="index">{{ index + 1 }}、{{ item.babyname }}</li>
        </ul>
      </div>
      <div class="line"></div>
      <el-form-item label="第二阶段已通过人数">
        <el-input v-model="frestData.haspasssum" placeholder="" readonly />
      </el-form-item>
      <div class="start-before">
        <ul>
          <li v-for="(item, index) in TwoperList" :key="index">{{ index + 1 }}、{{ item.babyname }}</li>
        </ul>
      </div>
      <div class="line"></div>
      <el-form-item label="第三阶段补录人数">
        <el-input v-model="frestData.hasrepairsum" placeholder="" readonly />
      </el-form-item>
      <div class="start-before">
        <ul>
          <li v-for="(item, index) in ThdperList" :key="index">{{ index + 1 }}、{{ item.babyname }}</li>
        </ul>
      </div>
      <div class="line"></div>
      <el-form-item label="线下报名人数">
        <el-input v-model="frestData.fourSum" placeholder="" readonly />
      </el-form-item>
      <div class="start-before">
        <ul>
          <li v-for="(item, index) in forthperList" :key="index">{{ index + 1 }}、{{ item.babyname }}</li>
        </ul>
      </div>
      <div class="line"></div>
    </el-form>
    <!-- 表单 -->
    <span slot="footer" class="dialog-footer">
      <el-button size="-" @click="handleClose">返 回</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getAllDrawing, postStartDrawing } from '../api/kind'
import {mapGetters} from "vuex";
export default {
  name: 'forestdialog',
  data() {
    return {
      labelPosition: 'right', //表单label左对齐
      dialogVisible: false,
      headerTitle: '查看详情', //弹窗标题
      tabCard: 'baseinfo',
      frestData: {},
      keys: null,
      OneperList: [], //开始抽奖前所有学生名单
      TwoperList: [], //抽奖后学生名单
      ThdperList: [], //抽奖后学生名单
      forthperList:[],//线下报名学生名单
      drawingYear: '',//抽奖传参年份
      drawingId: '', //抽奖传参学校id
      drawingState: '',//当前抽奖状态
      showList: false, //默认展示抽奖前人员名单
      btnView: false,//控制开始按钮的展示
      annual: '',
      schoolid: '',
    }
  },
  props: ['tcard'],
  computed:{
    ...mapGetters({
      token:'user/token'
    })
  },
  mounted() { },
  methods: {
    async showEdit(schoolid, annual, drawingState) {
      this.dialogVisible = true
      //抽号所需参数
      this.drawingYear = annual
      this.drawingId = schoolid
      //当前抽号状态
      this.drawingState = drawingState
      this.annual = annual
      this.schoolid = schoolid
      // 默认展示全部学生名单
      this.showList = true
      let { data } = await getAllDrawing({
        schoolid: schoolid,
        annual: annual,
      })
      //表单赋值
      this.frestData = data
      this.OneperList = data.stageonechildrens
      this.TwoperList = data.stagetwochildrens
      this.ThdperList = data.stagethreechildrens
      this.forthperList = data.stagefourchildrens
    },
    exportList(){
      if(this.annual == null || this.schoolid == null){
        this.$message.error('文件下载失败，请刷新后重试！')
        return false
      }else {
        let _this = this
        const loading = _this.$loading({
            lock: true,
            text: '文件下载中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.6)'
        });
        axios({
          headers: { Authorization:this.token },
          type: 'application/ json; charset = utf-8',
          method: 'GET',
          url: `${window.apiURL}/kindnumberset/allfillexcel?annual=${_this.annual}&schoolid=${_this.schoolid}`,
          responseType: 'arraybuffer',
        }).then(function (res) {
          const fileName = '所有录取人员名单信息.xls';
          const blob = new Blob([res.data]);
          //创建一个a标签并设置href属性，之后模拟人为点击下载文件
          let link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click(); //模拟点击
          //释放资源并删除创建的a标签
          URL.revokeObjectURL(link.href);
          setTimeout(() => {
            loading.close();
            _this.$message.success('文件下载成功！')
          }, 2000);
        });
      }
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
.el-dialog__body{
  .btnbox{
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    margin-bottom: 20px;
  }
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
