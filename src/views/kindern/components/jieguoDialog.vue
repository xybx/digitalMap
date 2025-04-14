<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" :append-to-body="true" :close-on-click-modal="false" center>
    <div class="btn">
      <div>列表生成时间：</div>
      <el-button type="primary" size="small" @click="exportList">导出表格</el-button>
    </div>
    <el-table ref="singleTable" :data="tableData" highlight-current-row @current-change="handleCurrentChange" style="width: 100%" height="550">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column property="babyname" label="学生姓名" width="120" align="center"></el-table-column>
      <el-table-column property="babycard" label="身份证号" align="center"></el-table-column>
      <el-table-column property="createttime" label="资料提交时间" align="center"></el-table-column>
      <el-table-column property="typename" label="政策优待类型" align="center"></el-table-column>
    </el-table>

    <!-- 页码 -->
    <el-pagination background :current-page="pageNum" :page-size="pageSize" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
    <!-- 页码 -->

    <span slot="footer" class="dialog-footer">
      <el-button size="-" @click="handleClose">返 回</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getAfterDrawing } from '@/views/kindern/api/kind'
import {mapGetters} from "vuex";

export default {
  name: 'forestdialog',
  data() {
    return {
      dialogVisible: false,
      tabCard: 'baseinfo',
      title: '抽奖结果',
      frestData: {},
      keys: null,
      disabled: false,
      tableData: [],
      //年份
      annual: '',
      //学校id
      schoolid: '',
      //总条数
      total: 0,
      //当前页数
      pageNum: 1,
      //一页多少行
      pageSize: 10,
      //页码工具栏
      layout: 'total, prev, pager, next, jumper',
      //导出列表所需token
    }
  },
  props: ['tcard'],
  computed:{
    ...mapGetters({
      token:'user/token'
    })
  },
  methods: {
    //获取抽奖结果
    async getData() {
      let res = await getAfterDrawing({
        annual: this.annual,
        schoolid: this.schoolid,
        pagenum: this.pageNum,
        pagesize: this.pageSize
      })
      if (res.code == 200) {
        this.tableData = res.data.list
        this.total = res.data.total
      }
    },

    //查看抽奖结果
    showEdit(schoolid, annual) {
      this.dialogVisible = true
      this.annual = annual
      this.schoolid = schoolid
      //调用列表
      this.getData()
    },
    handleClose() {
      this.dialogVisible = false
      this.disabled = false
      this.title = ''
      this.frestData = this.$options.data().frestData
    },

    //导出列表
    exportList() {
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
          url: `${window.apiURL}/kindnumberset/filllist?annual=${_this.annual}&schoolid=${_this.schoolid}`,
          responseType: 'arraybuffer',
        }).then(function (res) {
          const fileName = '抽号结果人员名单.xls';
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

    handleCurrentChange() { },
    //切换当前页数
    SizeChange(val) {
      this.pageSize = val
      //调用列表
      this.getData()
    },
    //切换当前一页多少行
    CurrentChange(val) {
      this.pageNum = val
      //调用列表
      this.getData()
    },
  },
}
</script>

<style lang="scss" scoped>
.btn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
</style>
