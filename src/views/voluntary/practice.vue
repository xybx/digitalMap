<template>
  <div class="practice">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>志愿活动管理</span>
      </div>
      <div class="hflex">
        <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="—">
          <el-radio-button label="current">招募中</el-radio-button>
          <el-radio-button label="history">已结束</el-radio-button>
        </el-radio-group>
      </div>
      <div class="text item">
        <queryForm ref="query" @queryClick="queryClick" @addClick="addClick" :civil="true" :tabname="tabCard"/>
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column prop="activityname" label="活动名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="typename" label="活动类型" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="numberofrecruits" label="招募人数" align="center"></el-table-column>
          <template v-if="tabCard == 'current'">
            <el-table-column label="活动状态" align="center">
                <template v-slot="scope">
                  <el-tag v-if="scope.row.volunteerstate == 1">即将开始</el-tag>
                  <el-tag v-if="scope.row.volunteerstate == 2" type="warning">报名中</el-tag>
                  <el-tag v-if="scope.row.volunteerstate == 3" type="success">活动中</el-tag>
                </template>
            </el-table-column>
          </template>
          <template v-if="tabCard == 'history'">
            <el-table-column label="核验状态" align="center">
              <template v-slot="scope">
                <el-tag :type="scope.row.verificationstate == 0 ? 'warning' :'success'">{{scope.row.verificationstate == 0 ? '未核验' : '已核验'}}</el-tag>
              </template>
            </el-table-column>
          </template>
          <el-table-column label="报名开始时间" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{scope.row.registrationstarttime ? scope.row.registrationstarttime : '暂无时间'}}
            </template>
          </el-table-column>
          <el-table-column label="报名结束时间" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{scope.row.registrationendtime ? scope.row.registrationendtime : '暂无时间'}}
            </template>
          </el-table-column>
          <el-table-column label="活动开始时间" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{scope.row.eventstarttime ? scope.row.eventstarttime : '暂无时间'}}
            </template>
          </el-table-column>
          <el-table-column label="活动结束时间" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{scope.row.eventendtime ? scope.row.eventendtime : '暂无时间'}}
            </template>
          </el-table-column>
          <el-table-column prop="address" label="活动地址" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="contact" label="联系人" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="260px">
            <template v-slot="scope">
              <el-button v-if="tabCard === 'current'" type="primary" plain @click.stop="editClick(scope.row.pid)">修改</el-button>
              <el-button v-if="tabCard === 'history' && scope.row.verificationstate == 0" type="primary" plain @click.stop="CheckClick(scope.row.pid)">核验</el-button>
              <el-button type="warning" plain @click.stop="lookClick(scope.row.pid)">查看</el-button>
              <el-button v-if="tabCard == 'current'" type="danger" plain @click.stop="delClick(scope.row.pid)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </div>
    </el-card>
    <civildialog ref="civil" :civil="true" :tabname="tabCard" @getData="getData"/>
    <verifdialog ref="verifiy" @getData="getData"/>
  </div>
</template>
<script>
import queryForm from "@/views/voluntary/components/queryForm";
import civildialog from "@/views/voluntary/components/civildialog";
import verifdialog from "@/views/voluntary/components/verifdialog";
import {delactive, getactiveList, getoverList} from "@/views/voluntary/api/pracrice";
export default {
  name: "practice",
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
    civildialog,
    verifdialog
  },
  computed: {},
  created() {
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData(name){
      if(name){
        this.tabCard = name
      }
      let data = {
        pagenum:this.pageNo,
        pagesize:this.pageSize,
      }
      let obj = this.formData
      let arr = Object.keys(obj)
      for(let i in obj){
        if(arr.includes(i)){
          Object.assign(data,obj)
        }
      }
      let res
      if(this.tabCard == 'current') res = await getactiveList(data)
      if(this.tabCard == 'history') res = await getoverList(data)
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
    editClick(pid){
      this.$refs.civil.showData(pid,1)
    },
    lookClick(pid){
      this.$refs.civil.showData(pid,2)
    },
    CheckClick(pid){
      this.$refs.verifiy.showData(pid)
    },
    delClick(pid){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let res = await delactive({pid})
        if(res.code == 200){
          this.$message.success('删除成功')
          this.getData()
        }
      })
    },
    addClick(){
      this.$refs.civil.showData()
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
