<template>
  <div class="atotal">
    <el-row :gutter="5">
      <el-col :lg="8" :md="8" :sm="24" :xl="8" :xs="24">
        <el-card class="box-card animate__animated animate__fadeInLeft cardbox">
          <div slot="header" class="clearfix">
            <i></i>
            <span>全部统计</span>
          </div>
          <div class="text item">
            <ul class="cardlist">
              <li v-for="(item,index) in listData" :key="index" @click="cardClick(index)">
                <span>{{item.name}}</span>
                <i>{{item.value}}</i>
              </li>
            </ul>
            <div id="piechart"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="16" :md="16" :sm="24" :xl="16" :xs="24">
        <el-card class="box-card animate__animated animate__fadeInRight">
          <div slot="header" class="clearfix">
            <i></i>
            <span>统计台账</span>
          </div>
          <div class="text item">
            <queryForm :eindex="true" @queryClick="queryClick" @exportClick="exportClick"/>
            <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText" @row-click="tabRow">
              <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
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
              <el-table-column label="办理状态" align="center">
                <template v-slot="scope">
                  <span v-if="scope.row.state==4" class="org">已办结</span>
                  <span v-else-if="scope.row.state ==3" class="grey">已驳回</span>
                  <span v-else-if="scope.row.state ==1" class="red">待处理</span>
                  <span v-else-if="scope.row.state ==2" class="bule">待审核</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template v-slot="scope">
                  <el-button type="warning" plain size="small" @click.stop="lookClick(scope.row.pid)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
          </div>
        </el-card>
        <envdialog ref="envrion"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import queryForm from "@/views/environment/components/queryForm";
import envdialog from "@/views/environment/components/envdialog";
import {mapGetters} from "vuex";
import {getAllTotals, getAllist} from "@/views/environment/api/eindex";
export default {
  name: "atotal",
  data() {
    return {
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      pageNo: 1,
      pageSize: 0,
      pageSizes: [5, 8, 10],
      formData:{},
      listData:[],
      states:1,
    }
  },
  components: {
    queryForm,
    envdialog
  },
  computed: {
    ...mapGetters({
      userData:'user/userData'
    })
  },
  created() {
    this.pageSize = this.pageSizes[2];
  },
  mounted() {
    this.getcard()
    this.getData()
  },
  methods: {
    async getData(){
      let data = {
        type:this.states,
        pagenumber:this.pageNo,
        pagesize:this.pageSize
      }
      let obj = this.formData
      let arr = Object.keys(obj)
      for(let i in obj){
        if(arr.includes(i)){
          Object.assign(data,obj)
        }
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
    async getcard(){
      let arr = []
      let res = await getAllTotals()
      arr.push({
        value:res.data.all,
        name:'全部',
      },{
        value:res.data.inProcess,
        name:'办理中',
      },{
        value:res.data.completed,
        name:'已销号',
      })
      this.listData = arr
      this.getPiechart(arr)
    },
    cardClick(i){
      this.states = i == 0 ? 1 : i==1 ? 2 : 3
      this.getData()
    },
    getPiechart(arr){
      var myChart = this.$echarts.init(document.getElementById("piechart"));
      var option =  {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          bottom:'bottom',
          left: 'center',
          icon:'circle',
          itemGap:25,
          textStyle:{
            color:'#999999'
          }
        },
        grid:{
          top:0
        },
        color: ['#FD7372','#FF9F22','#1C9DFE'],//扇形区域以及列表颜色
        series: [{
          type: 'pie',
          radius: ['50%', '75%'],//两个表示环
          center: ['50%', '42%'],
          labelLine: {//设置延长线的长度
            normal: {
              length:30,//设置延长线的长度
            }
          },
          label: {
            normal: {
              formatter: '{bf|{b}} \n {per|}{cf|{c}}',//这里最后另一行设置了一个空数据是为了能让延长线与hr线对接起来
              color:'#333',
              rich: {
                bf:{
                  color: '#333',
                  padding: [0,0,0,0],
                  fontsize:18,
                  lineHeight: 20
                },
                cf:{
                  color: '#000',
                  fontsize:30,
                  lineHeight:30,//设置最后一行空数据高度，为了能让延长线与hr线对接起来
                },
                per: {//用百分比数据来调整下数字位置，显的好看些。如果不设置，formatter最后一行的空数据就不需要
                  padding: [4, 0],
                }
              }
            }
          },
          data:arr,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };
      myChart.setOption(option);
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    },
    lookClick(pid){
      this.$refs.envrion.showData(pid,this.states+4)
    },
    tabRow(row, column, event){
      this.lookClick(row.pid)
    },
    exportClick(){
      let a = document.createElement("a");
      let event = new MouseEvent("click");
      a.download = '文件下载';
      a.href = `${this.$baseUrl}/livingexcel/livingexcel?areaid=${this.userData.areaid}&uid=${this.userData.pid}&type=${Number(this.states+4)}`;
      a.dispatchEvent(event);
    },
    queryClick(form){
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
.atotal{
  width: 100%;
  background: none!important;
  width: calc(100% - 24px);
  margin: 10px auto;
  padding: 0!important;
  .el-row{
    .el-col{
      .el-card{
        min-height: calc(100vh - 100px)!important;
        border-radius: 10px;
        margin-bottom: 0;
        &.cardbox{
          ::v-deep{
            .el-card__body{
              padding:15px 20px 0;
            }
          }
        }
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
            #piechart{
              width: 100%;
              height: 320px;
              margin-top: 60px;
            }
            .cardlist{
              padding: 0;
              margin: 0;
              overflow: hidden;
              li{
                width:calc(56% - 40px);
                padding:12px 20px;
                float: left;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items:flex-start;
                align-content: flex-start;
                color: #fff;
                margin-bottom: 20px;
                border-radius: 5px;
                cursor: pointer;
                span{
                  font-size: 16px;
                }
                i{
                  display: inline-block;
                  font-size: 26px;
                  font-style: normal;
                  margin-top: 12px;
                }
                &:nth-child(3),&:nth-child(4){
                  margin-bottom: 0;
                }
                &:nth-child(2n){
                  float: right;
                }
                &:first-child{
                  background:linear-gradient(to right, #28CFB3, #72D7CC);
                  background:-webkit-linear-gradient(to right, #28CFB3, #72D7CC);
                  background:-moz-linear-gradient(to right, #28CFB3, #72D7CC);
                  background:-ms-linear-gradient(to right, #28CFB3, #72D7CC);
                }
                &:nth-child(2){
                  background:linear-gradient(to right, #FD7372, #FB6262);
                  background:-webkit-linear-gradient(to right, #FD7372, #FB6262);
                  background:-moz-linear-gradient(to right, #FD7372, #FB6262);
                  background:-ms-linear-gradient(to right, #FD7372, #FB6262);
                }
                &:nth-child(3){
                  background:linear-gradient(to right, #FF9857, #FF9F22);
                  background:-webkit-linear-gradient(to right, #FF9857, #FF9F22);
                  background:-moz-linear-gradient(to right, #FF9857, #FF9F22);
                  background:-ms-linear-gradient(to right, #FF9857, #FF9F22);
                }
                &:last-child{
                  background:linear-gradient(to right, #1C9DFE, #0085E9);
                  background:-webkit-linear-gradient(to right, #1C9DFE, #0085E9);
                  background:-moz-linear-gradient(to right, #1C9DFE, #0085E9);
                  background:-ms-linear-gradient(to right, #1C9DFE, #0085E9);
                }
              }
            }
            .el-table{
              .el-table__body{
                tr.el-table__row{
                  td{
                    padding: 6px 0;
                    .cell{
                      line-height: 24px;
                      span{
                        padding: 3px 10px;
                        border-radius: 3px;
                        &.red{
                          background-color:rgba(255, 62, 62, .2);
                          border: 1px solid #FF3E3E;
                          color:#FF3E3E;
                        }
                        &.org{
                          background-color:rgba(230, 162, 60, .2);
                          border: 1px solid #E6A23C;
                          color:#E6A23C;
                        }
                        &.bule{
                          background-color:rgba(12, 158, 215, .2);
                          border: 1px solid #0C9ED7;
                          color:#0C9ED7;
                        }
                        &.grey{
                          background-color:rgba(153, 153, 153, .2);
                          border: 1px solid #999;
                          color:#999;
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
  }
}
</style>
