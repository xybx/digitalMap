<template>
  <div class="precord">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>企业巡查全部记录</span>
      </div>
      <div class="text item">
        <queryForm @queryClick="queryClick"  @exportClick="exportClick"/>
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText" @row-click="tabRow">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column label="企业名称" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{ scope.row.company ? scope.row.company : '暂无企业名称' }}
            </template>
          </el-table-column>
          <el-table-column label="问题类别" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{ scope.row.classname ? scope.row.classname : '暂无问题类别' }}
            </template>
          </el-table-column>
          <el-table-column label="巡查人" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{ scope.row.xcperson ? scope.row.xcperson : '暂无巡查人' }}
            </template>
          </el-table-column>
          <el-table-column label="巡查时间" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{ scope.row.addtime ? scope.row.addtime : '暂无巡查时间' }}
            </template>
          </el-table-column>
          <el-table-column label="巡查内容" align="center" show-overflow-tooltip>
            <template v-slot="scope">
              {{ scope.row.remark ? scope.row.remark : '暂无巡查内容' }}
            </template>
          </el-table-column>
          <el-table-column label="办理状态" align="center">
            <template v-slot="scope">
              <span class="org" v-if="scope.row.state ==1 || scope.row.state ==2 || scope.row.state ==3">办理中</span>
              <span v-else-if="scope.row.state ==4" class="grey">已撤销</span>
              <span v-else-if="scope.row.state ==5" class="green">已办结</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center"  width="280px">
            <template v-slot="scope">
              <el-button type="warning" plain size="small" @click.stop="lookClick(scope.row.pid)">查看</el-button>
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
    </el-card>
  </div>
</template>

<script>
import queryForm from "./components/queryForm";
import {getAllist} from './api/patrol'
import {mapGetters} from "vuex";
export default {
  name: "precord",
  data() {
    return {
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
    queryForm
  },
  computed: {
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
  watch: {
		$route: {
			handler: function (val, oldVal) {
				if(val.name == 'Precord'){
					this.getData()
				}
			},
			deep: true,
		},
  },
  methods: {
    async getData(form){
      let data = {
        pagenumber:this.pageNo,
        pagesize:this.pageSize
      }
      if(form?.name){
        Object.assign(data,{
          name:form.name,
        })
      }
      let res = await getAllist(data)
      if(res.code === 200 && res.data){
        this.tableData = res.data.list
        this.total = res.data.total
      }else{
        this.tableData = []
      }
      setTimeout(() => {
        this.tabloading = false;
      }, 200)
    },
    lookClick(pid){
      this.$router.push({
        path:'cordEdit',
        query:{pid,type:4}
      })
    },
    tabRow(row, column, event){
      this.lookClick(row.pid)
    },
    exportClick(){
      let a = document.createElement("a");
      let event = new MouseEvent("click");
      a.download = '文件下载';
      a.href = `${this.$baseUrl}/export/list?uid=${this.userData.pid}`;
      a.dispatchEvent(event);
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
.precord{
  width: 100%;
  background: none!important;
  padding: 0!important;
  .el-card{
    min-height: calc(100vh - 104px)!important;
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
            tr.el-table__row{
              td{
                .cell{
                  line-height: 26px;
                  span{
                    padding: 3px 10px;
                    border-radius: 3px;
                    &.grey{
                      background-color:rgba(153, 153, 153, .2);
                      border: 1px solid #999;
                      color:#999;
                    }
                    &.org{
                      background-color:rgba(230, 162, 60, .2);
                      border: 1px solid #E6A23C;
                      color:#E6A23C;
                    }
                    &.green{
                      background-color:rgba(103, 194, 58, .2);
                      border: 1px solid #67C23A;
                      color:#67C23A;
                    }
                  }
                }
              }
            }
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
