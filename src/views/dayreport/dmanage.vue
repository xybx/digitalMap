<template>
  <div class="unover">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>日常上报列表管理</span>
      </div>
      <div class="text item">
        <queryForm :record="true" @queryClick="queryClick" @exportClick="exportClick" />
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark"
          :element-loading-text="loadingText" @row-click="tabRow">
          <el-table-column type="index" label="序号" align="center" width="80px"></el-table-column>
          <el-table-column label="村居名称" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{ scope.row.villagename ? scope.row.villagename : '暂无村居名称' }}
            </template>
          </el-table-column>
          <el-table-column label="上报类型" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{ scope.row.typename ? scope.row.typename : '暂无问题类别' }}
            </template>
          </el-table-column>
          <el-table-column label="上报人" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{ scope.row.inspectorname ? scope.row.inspectorname : '暂无上报人' }}
            </template>
          </el-table-column>
          <el-table-column label="上报时间" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{ scope.row.inspectdate ? scope.row.inspectdate : '暂无上报时间' }}
            </template>
          </el-table-column>
          <el-table-column label="上报内容" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{ scope.row.inspectcount ? scope.row.inspectcount : '暂无上报内容' }}
            </template>
          </el-table-column>
          <el-table-column label="处理状态" align="center" show-overflow-tooltip>
            <template #default="{row,$index}">
              <el-tag :type="row.state == 1 ? 'info': row.state == 2 ? 'success' :'danger'">{{row.state == 1 ? '待处理' : row.state == 2 ? '已通过' : '未通过'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="280px">
            <template v-slot="scope">
              <!-- <el-button type="primary" plain size="small" @click.stop="transterClick(scope.row.pid,scope.row.villageid)">转办</el-button>-->
              <el-button type="success" plain size="small" @click.stop="rejectClick(scope.row.pid)">处理</el-button>
              <el-button type="warning" plain size="small" @click.stop="lookClick(scope.row.pid)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </div>
    </el-card>
    <envdialog ref="dayreport" :need="true" @getData="getData" />
    <indialog ref="inenv" @getData="getData"/>
  </div>
</template>

<script>
import queryForm from "./components/queryForm";
import envdialog from "./components/envdialog";
import indialog from "./components/indialog";
import { geteruleListManage, geterule } from "./api/envrule";
import { mapGetters } from "vuex";
export default {
  name: "unover",
  data() {
    return {
      tableData: [],
      tabloading: true,
      loadingText: "正在加载...",
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      pageNo: 1,
      pageSize: 0,
      pageSizes: [10, 15, 20],
      formData: {},
    }
  },
  components: {
    queryForm,
    envdialog,
    indialog
  },
  computed: {
    ...mapGetters({
      userData: 'user/userData'
    })
  },
  created() {
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      let data = {
        pagenumber: this.pageNo,
        pagesize: this.pageSize
      }
      let obj = this.formData
      let arr = Object.keys(obj)
      for (let i in obj) {
        if (arr.includes(i)) {
          Object.assign(data, obj)
        }
      }
      let res = await geteruleListManage(data)
      if (res.code === 200 && res.data) {
        this.tableData = res.data.list
        this.total = res.data.total
      } else {
        this.tableData = []
      }
      setTimeout(() => {
        this.tabloading = false;
      }, 200)
    },
    transterClick(pid, vid) {
      this.$refs.inenv.showData(pid, 1, vid)
    },
    rejectClick(pid) {
      this.$refs.inenv.showData(pid)
    },
    lookClick(pid) {
      this.$refs.dayreport.showData(pid, 1)
    },
    tabRow(row, column, event) {
      this.lookClick(row.pid)
    },
    exportClick() {
      let a = document.createElement("a");
      let event = new MouseEvent("click");
      a.download = '文件下载';
      a.href = `${this.$baseUrl}/livingexcel/livingexcel?areaid=${this.userData.areaid}&uid=${this.userData.pid}&type=1`;
      a.dispatchEvent(event);
    },
    queryClick(form) {
      this.formData = form
      this.pageNo = 1
      this.getData()
    },
    SizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    CurrentChange(val) {
      this.pageNo = val;
      this.getData();
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/vab/styles/scss/record.scss';
</style>
