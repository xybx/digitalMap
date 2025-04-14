<template>
<div class="user-container">
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <i></i>
      <span>公众用户管理</span>
    </div>
    <div class="text item">
      <queryForm :userpage="userpage" @queryClick="queryClick"/>
      <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
        <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
        <el-table-column prop="name" label="用户姓名" align="center"></el-table-column>
        <el-table-column prop="memberid" label="身份证号" align="center"></el-table-column>
        <el-table-column prop="phonenum" label="手机号" align="center"></el-table-column>
        <el-table-column prop="auth" label="认证状态" align="center">
          <template v-slot="scope">
            {{scope.row.auth === 1 ? '已认证' : '未认证'}}
          </template>
        </el-table-column>
        <el-table-column label="认证时间" align="center">
          <template v-slot="scope">
            {{scope.row.authdate ? scope.row.authdate.substr(0,10) : '暂无认证时间'}}
          </template>
        </el-table-column>
        <el-table-column label="详细地址" align="center">
          <template v-slot="scope">
            {{scope.row.address ? scope.row.address : '暂无上传地址'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <el-button type="primary" plain @click="look(scope.row.pid)">查看</el-button>
            <el-button type="warning" plain @click="editClick(scope.row.pid)">编辑</el-button>
            <el-button type="danger" plain @click="deClick(scope.row.pid)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :current-page="pageNo"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :layout="layout"
        :total="total"
        @size-change="SizeChange"
        @current-change="CurrentChange"
      ></el-pagination>
    </div>
    <UserDialog ref="udialog" @getData="getData"/>
  </el-card>
</div>
</template>

<script>
import queryForm from "./components/queryForm";
import UserDialog from "./components/userdialog";
import {mapGetters} from "vuex";
import {getUserList,deleteUser} from './api/user'
export default {
  name: "cuser",
  data(){
    return {
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      pageNo: 1,
      pageSize: 0,
      pageSizes: [10, 15, 20],
      userpage:true,
      formData:{},
      showIndex:localStorage.getItem('showMenuIndex')
    }
  },
  components:{
    queryForm,
    UserDialog
  },
  computed:{
    ...mapGetters({
      userData:'user/userData'
    })
  },
  created() {
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
    this.getData()
  },
  watch:{
    showIndex:{
      handler(val){
        if(val != 2){
          this.$router.push({path:'/'})
        }
      },
      immediate:true
    }
  },
  methods:{
    async getData(form){
      let data = {
        uid:this.userData.pid,
        pagenumber:this.pageNo,
        pagesize:this.pageSize
      }
      if(form?.name || form?.areaid){
        Object.assign(data,{
          publicusername:form.name,
          areaid:form.areaid.join(',')
        })
      }
      let res = await getUserList(data)
      if(res.code === 200){
          this.tableData = res.data
          this.total = res.count
      }
      setTimeout(() => {
        this.tabloading = false;
      }, 200);
    },
    look(pid){
      // Object.assign(obj,{catetype:1})
      this.$refs.udialog.showEdit(pid,1)
    },
    editClick(pid){
      // Object.assign(obj,{catetype:2})
      this.$refs.udialog.showEdit(pid,2)
    },
    deClick(id){
      let params = {pid:id}
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let res = await deleteUser(params)
        if (res.code === 200) {
          this.$message.success("删除成功");
          this.getData()
        }
      })
    },
    queryClick(form){
      this.formData = form
      this.pageNo = 1
      this.getData(form)
    },
    SizeChange(val) {
      this.pageSize = val;
      this.getData(this.formData);
    },
    CurrentChange(val) {
      this.pageNo = val;
      this.getData(this.formData);
    },
  }
}
</script>

<style lang="scss" scoped>
.user-container{
  width: 100%;
  background: none!important;
  width: calc(100% - 24px);
  margin: 10px auto;
  padding: 0!important;
  .el-card{
    min-height: calc(100vh - 100px)!important;
    border-radius: 10px;
    margin-bottom: 0;
    ::v-deep{
      .el-card__header{
        background-color:#F5F7FA;
        color: #333;
        display: flex;
        justify-content: left;
        align-items: center;
        flex-direction: row;
        padding: 12px 20px;
        span{
          margin-left: 10px;
          line-height: 20px;
          display: inline-block;
        }
        i{
          width: 2px;
          height:20px;
          background-color:#0C9ED7;
          display: inline-block;
          position: relative;
          top: 4px;
        }
      }
      .el-card__body{
        .el-table{
          .el-table__body{
            .el-button{
              padding:9px 20px;
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>
