<template>
  <div class="super">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>督办记录</span>
      </div>
      <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="medium">
        <el-radio-button label="unsuper">未督办</el-radio-button>
        <el-radio-button label="ovsuper">已督办</el-radio-button>
        <el-radio-button label="nosuper">未解决</el-radio-button>
      </el-radio-group>
      <div class="text item">
        <queryForm ref="query" @queryClick="queryClick"/>
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column prop="appeal" label="主要诉求" align="center">
            <template v-slot="scope">
              {{scope.row.appeal ? scope.row.appeal : '暂无主要诉求'}}
            </template>
          </el-table-column>
          <el-table-column label="问题属地" align="center">
            <template v-slot="scope">
              {{scope.row.villagename ? scope.row.villagename : '暂无事件描述'}}
            </template>
          </el-table-column>
          <el-table-column label="信访目的" align="center">
            <template v-slot="scope">
              {{scope.row.typename ? scope.row.typename : '暂无信访目的'}}
            </template>
          </el-table-column>
          <el-table-column label="信访人" align="center">
            <template v-slot="scope">
              {{scope.row.petitionername ? scope.row.petitionername : '暂无信访人'}}
            </template>
          </el-table-column>
          <el-table-column label="信访人手机号" align="center">
            <template v-slot="scope">
              {{scope.row.petitionerphone ? scope.row.petitionerphone : '暂无信访人手机号'}}
            </template>
          </el-table-column>
          <el-table-column label="信访人身份证号" align="center">
            <template v-slot="scope">
              {{scope.row.petitioneridcard ? scope.row.petitioneridcard : '暂无信访人身份证号'}}
            </template>
          </el-table-column>
          <el-table-column label="信访人联系地址" align="center">
            <template v-slot="scope">
              {{scope.row.petitioneradress ? scope.row.petitioneradress : '暂无信访人联系地址'}}
            </template>
          </el-table-column>
          <el-table-column label="上报时间" align="center">
            <template v-slot="scope">
              {{scope.row.date ? scope.row.date.substr(0,10) : '暂无上报时间'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <template v-if="tabCard == 'unsuper'">
                <el-button type="danger" @click="superClick(scope.row.pid)">督办</el-button>
              </template>
              <el-button v-if="tabCard == 'ovsuper' || tabCard == 'nosuper'" type="danger" @click="lookClick(scope.row.pid)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          class="redpage"
          :current-page="pageNo"
          :page-size="pageSize"
          :page-sizes="pageSizes"
          :layout="layout"
          :total="total"
          @size-change="SizeChange"
          @current-change="CurrentChange"
        ></el-pagination>
      </div>
      <petdialog :supers="true" :scard="tabCard" ref="pdialog" @getData="getData"/>
    </el-card>
  </div>
</template>

<script>
import queryForm from "./components/queryForm";
import petdialog from "./components/petdialog";
import {getunsuperList,getovsuperList,getnosuperList} from "./api/petion";
export default {
  name: "super",
  data() {
    return {
      tabCard:'unsuper',
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
    petdialog
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
        pagenumber:this.pageNo,
        pagesize:this.pageSize
      }
      let formdata = this.formData
      if(formdata?.appeal || formdata?.petitionername || formdata?.villagename || formdata?.date || formdata?.goal){
        Object.assign(data,{
          appeal:formdata.appeal,
          date:formdata.date,
          petitionername:formdata.petitionername,
          villagename:formdata.villagename,
          goal:formdata.goal
        })
      }
      let res
      if(this.tabCard === 'unsuper'){
        res = await getunsuperList(data)
      }else if(this.tabCard === 'ovsuper'){
        res = await getovsuperList(data)
      }else if(this.tabCard === 'nosuper'){
        res = await getnosuperList(data)
      }
      if(res.code ===200){
        this.tableData = res.data.list
        this.total = res.data.total
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)
    },
    superClick(pid){
      this.$refs.pdialog.showEdit(pid,6)
    },
    lookClick(pid){
      if(this.tabCard === 'ovsuper'){
        this.$refs.pdialog.showEdit(pid,7)
      }else if(this.tabCard === 'nosuper'){
        this.$refs.pdialog.showEdit(pid,8)
      }
    },
    tabChange(val){
      this.tabCard = val
      this.formData = {}
      this.$refs.query.clearform()
      this.getData()
    },
    queryClick(form){
      this.formData = form
      this.pageNo = 1
      this.getData()
    },
    SizeChange(val){
      this.pageSize = val;
      this.getData(this.formData);
    },
    CurrentChange(val){
      this.pageNo = val;
      this.getData(this.formData);
    },
  }
}
</script>

<style lang="scss" scoped>
.super{
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
          width: 3px;
          height:16px;
          background-color:red;
          display: inline-block;
          position: relative;
          top: 3px;
        }
      }
      .el-card__body{
        .radiogroup{
          margin-bottom: 20px;
          .el-radio-button--medium{
            .el-radio-button__inner:hover{
              color:red;
            }
            &.is-active{
              .el-radio-button__inner:hover{
                color:#fff;
              }
            }
          }
          .el-radio-button__orig-radio:checked + .el-radio-button__inner{
            background-color:red;
            border-color: red;
            box-shadow: -1px 0 0 0 red;
          }
        }
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
