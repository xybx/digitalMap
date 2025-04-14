<template>
  <div class="country">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>乡村榜单管理</span>
      </div>
      <div class="hflex">
        <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="—">
          <el-radio-button label="current">当前显示</el-radio-button>
          <el-radio-button label="history">已结束</el-radio-button>
        </el-radio-group>
      </div>
      <div class="text item">
        <queryForm ref="query" @queryClick="queryClick" @addClick="addClick" :country="true" :tabname="tabCard"/>
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column prop="likedcount" label="获赞数量" align="center">
            <template v-slot="scope">
              {{scope.row.likedcount ? scope.row.likedcount : 0}}
            </template>
          </el-table-column>
          <el-table-column prop="villagename" label="所属村居" align="center"></el-table-column>
          <el-table-column prop="typename" label="类别" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="title" label="标题" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="发布时间" align="center">
            <template v-slot="scope">
              {{scope.row.starttime ? scope.row.starttime.substr(0,10) : '暂无时间'}}
            </template>
          </el-table-column>
          <el-table-column label="结束时间" align="center">
            <template v-slot="scope">
              {{scope.row.endtime ? scope.row.endtime.substr(0,10) : '暂无时间'}}
            </template>
          </el-table-column>
          <el-table-column label="置顶状态" align="center">
            <template v-slot="scope">
              <el-switch v-if="tabCard == 'current'" v-model="scope.row.top" :active-value="1" :inactive-value="0" :active-text="scope.row.top == 1 ? '开启置顶' : '取消置顶'" @change="topupClick(scope.row.top,scope.row.pid)"></el-switch>
              <template v-else>
                <span>--</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="点赞状态" align="center">
            <template v-slot="scope">
              <el-switch v-if="tabCard == 'current'" v-model="scope.row.likebuttonstate" :active-value="1" :inactive-value="0" :active-text="scope.row.likebuttonstate == 1 ? '开启点赞' : '取消点赞'" @change="ThumbClick(scope.row.likebuttonstate,scope.row.pid)"></el-switch>
              <template v-else>
                <span>--</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="400px">
            <template v-slot="scope">
              <el-button v-if="tabCard == 'current'" type="success" plain @click.stop="endClick(scope.row.pid)">结束</el-button>
              <el-button v-if="tabCard == 'current'" type="primary" plain @click.stop="editClick(scope.row.pid)">修改</el-button>
              <el-button type="warning" plain @click.stop="lookClick(scope.row.pid)">查看</el-button>
              <el-button type="danger" plain @click.stop="delClick(scope.row.pid)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </div>
    </el-card>
    <coudialog ref="country" :country="true" @getData="getData" />
  </div>
</template>

<script>
import queryForm from "./components/queryForm";
import {delVillage, getCountryList, gethistoryList, putOverend, putThumbsup, putTop} from "./api/country";
import coudialog from "./components/coudialog";
export default {
  name: "country",
  data() {
    return {
      tabCard:'current',
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      pageNo: 1,
      pageSize: 0,
      pageSizes: [10, 15, 20],
      formData:{},
    }
  },
  components: {
    queryForm,
    coudialog
  },
  computed: {},
  created() {
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData(){
      let data = {
        pagenum:this.pageNo,
        pagesize:this.pageSize
      }
      let obj = this.formData
      let arr = Object.keys(obj)
      for(let i in obj){
        if(arr.includes(i)){
          Object.assign(data,obj)
        }
      }
      let res
      if(this.tabCard == 'current') res = await getCountryList(data)
      if(this.tabCard == 'history') res = await gethistoryList(data)
      if(res.code ===200){
        this.tableData = res.data.list
        this.total = res.data.total
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)
    },
    tabChange(val){
      this.tabCard = val
      this.getData()
    },
    async topupClick(state,pid){
      let res = await putTop({pid,state})
      if(res.code == 200){
        this.$message.success(state == 1 ? '已置顶' : '已取消置顶')
        this.getData()
      }
    },
    async ThumbClick(state,pid){
      let res = await putThumbsup({pid,state})
      if(res.code == 200){
        this.$message.success(state == 1 ? '已开启点赞' : '已关闭点赞')
        this.getData()
      }
    },
    endClick(pid){
      this.$baseConfirm('你确定要结束吗？','结束提示',async ()=>{
        let res = await putOverend({pid})
        if(res.code == 200){
          this.$message.success('已结束')
          this.getData()
        }
      })
    },
    editClick(pid){
      this.$refs.country.showData(pid,1)
    },
    lookClick(pid){
      this.$refs.country.showData(pid,2)
    },
    delClick(pid){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let res = await delVillage({pid})
        if(res.code == 200){
          this.$message.success('删除成功')
          this.getData()
        }
      })
    },
    addClick(){
      this.$refs.country.showData()
    },
    tabRow(row, column, event){
      this.lookClick(row.pid,this.tabCard)
    },
    queryClick(form){
      this.formData = form
      this.pageNo = 1
      this.getData()
    },
    SizeChange(val){
      this.pageSize = val;
      this.getData();
    },
    CurrentChange(val){
      this.pageNo = val;
      this.getData();
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/vab/styles/scss/country.scss';
</style>
