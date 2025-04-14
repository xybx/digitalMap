<template>
  <div class="erule">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>日常上报类型管理</span>
      </div>
      <div class="text item">
        <queryForm @queryClick="queryClick" @addcateClick="addcateClick" :cate="true" />
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark"
          :element-loading-text="loadingText">
          <el-table-column type="index" label="序号" align="center" width="80px"></el-table-column>
          <el-table-column prop="typename" label="类型名称" align="center"></el-table-column>
          <el-table-column label="类型描述" align="center">
            <template v-slot="scope">
              {{ scope.row.description ? scope.row.description : '暂无描述' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <el-button type="primary" plain @click.stop="editClick(scope.row.pid)">修改</el-button>
              <el-button type="danger" plain @click.stop="delClick(scope.row.pid)">删除</el-button>
              <el-button type="warning" plain size="small" @click.stop="lookClick(scope.row.pid)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout"
          :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </div>
    </el-card>
    <envdialog ref="dayreport" :cate="true" @getData="getData" />
  </div>
</template>

<script>
import queryForm from "./components/queryForm";
import envdialog from "./components/envdialog";
import { geteruleListType, getDruleTypeDetail, delerule, postSaveData } from "./api/envrule";
export default {
  name: "erule",
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
    envdialog
  },
  computed: {},
  created() {
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      let data = {
        name: '',
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      let obj = this.formData
      let arr = Object.keys(obj)
      for (let i in obj) {
        if (arr.includes(i)) {
          Object.assign(data, obj)
        }
      }
      let res = await geteruleListType(data)
      if (res.code === 200) {
        this.tableData = res.data.list
        this.total = res.data.total
      }
      setTimeout(() => {
        this.tabloading = false
      }, 200)
    },
    //新增类型
    addcateClick() {
      this.$refs.dayreport.showData()
    },
    //编辑
    editClick(pid) {
      this.$refs.dayreport.showData(pid, 2)
    },
    //查看
    lookClick(pid) {
      this.$refs.dayreport.showData(pid, 1)
    },
    //删除
    delClick(pid) {
      this.$baseConfirm('你确定要删除吗？', '删除提示', async () => {
        let res = await delerule({ pid })
        if (res.code == 200) {
          this.$message.success('删除成功')
          this.getData()
        } else if (res.code == 201) {
          this.$message.success(res.msg)
          this.getData()
        }
      })
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/vab/styles/scss/country.scss';
</style>
