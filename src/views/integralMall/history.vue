<template>
  <div class="history">
    <el-row :gutter="5">
      <el-col :lg="7" :md="7" :sm="24" :xl="7" :xs="24">
        <el-card class="box-card animate__animated animate__fadeInLeft cardbox">
          <div slot="header" class="clearfix">
            <i></i>
            <span>订单记录统计</span>
          </div>
          <div class="text item">
            <ul class="cardlist">
              <li v-for="(item,index) in listData" @click="cardClick(index)">
                <span>{{item.name}}</span>
                <i>{{item.value}}</i>
              </li>
            </ul>
            <div id="piechart"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="17" :md="17" :sm="24" :xl="17" :xs="24">
        <el-card class="box-card animate__animated animate__fadeInRight">
          <div slot="header" class="clearfix">
            <i></i>
            <span>订单台账</span>
          </div>
          <div class="text item">
            <queryForm :history="history" @queryClick="queryClick" @exportClick="exportClick"/>
            <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText" @row-click="tabRow">
              <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
              <el-table-column label="姓名" align="center" show-overflow-tooltip width="60px">
                <template v-slot="scope">
                  {{ scope.row.pusername ? scope.row.pusername : '暂无' }}
                </template>
              </el-table-column>
              <el-table-column label="归属地" align="center" show-overflow-tooltip>
                <template v-slot="scope">
                  {{ scope.row.villagename ? scope.row.villagename : '暂无' }}
                </template>
              </el-table-column>
              <el-table-column label="手机号" align="center" show-overflow-tooltip>
                <template v-slot="scope">
                  {{ scope.row.phone ? scope.row.phone : '暂无' }}
                </template>
              </el-table-column>
              <el-table-column label="兑换时间" align="center" show-overflow-tooltip>
                <template v-slot="scope">
                  {{ scope.row.onlinetime ? scope.row.onlinetime : '暂无' }}
                </template>
              </el-table-column>
              <el-table-column label="兑换商品名" align="center" show-overflow-tooltip>
                <template v-slot="scope">
                  {{ scope.row.goodsname ? scope.row.goodsname : '暂无' }}
                </template>
              </el-table-column>
              <el-table-column label="兑换数量" align="center" show-overflow-tooltip>
                <template v-slot="scope">
                  {{ scope.row.count ? scope.row.count : '暂无' }}
                </template>
              </el-table-column>
              <el-table-column label="消耗积分" align="center" show-overflow-tooltip>
                <template v-slot="scope">
                  {{ scope.row.consume ? scope.row.consume : '暂无' }}
                </template>
              </el-table-column>
              <el-table-column label="订单编号" align="center" show-overflow-tooltip>
                <template v-slot="scope">
                  {{ scope.row.reference ? scope.row.reference : '暂无' }}
                </template>
              </el-table-column>
              <el-table-column label="订单状态" align="center" show-overflow-tooltip>
                <template v-slot="scope">
                  <el-tag v-if="scope.row.state ==1" type="danger">待兑换</el-tag>
                  <el-tag v-if="scope.row.state ==2">已兑换</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="兑换工作人员" align="center" width="120px" show-overflow-tooltip>
                <template v-slot="scope">
                  {{ scope.row.collatorname ? scope.row.collatorname : '暂无' }}
                </template>
              </el-table-column>
              <el-table-column label="核兑时间" align="center" show-overflow-tooltip>
                <template v-slot="scope">
                  {{ scope.row.offlinetime ? scope.row.offlinetime : '暂无' }}
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
      </el-col>
    </el-row>
    <convertdialog ref="convert" :history="history" @getData="getData" />
  </div>
</template>

<script>
import queryForm from "./components/queryForm";
import convertdialog from "./components/convertdialog";
import {getorderlist,getordertotal} from './api/convert'
import {mapGetters} from "vuex";
export default {
  name: "history",
  data() {
    return {
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      pageNo: 1,
      pageSize: 0,
      pageSizes: [8,10,12],
      formData:{},
      history:true,
      listData:[],
      state:"",
    }
  },
  components: {
    queryForm,
    convertdialog
  },
  computed: {
    ...mapGetters({
      userData:'user/userData'
    })
  },
  created() {
    this.pageSize = this.pageSizes[1];
  },
  mounted() {
    this.getData()
    this.getcard()
  },
  methods: {
    async getData(form){
      let data = {
        state:this.state,
        pagenumber:this.pageNo,
        pagesize:this.pageSize
      }
      if(form?.name || form?.phoneNumber || form?.onlinetime || form?.villagename || form?.collatorname || form?.state){
        Object.assign(data,{
          name:form.name,
          phoneNumber:form.phoneNumber,
          onlinetime:form.onlinetime,
          villagename:form.villagename,
          collatorname:form.collatorname,
          state:form.state
        })
      }
      let res = await getorderlist(data)
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
      let res = await getordertotal()
      arr.push({
        value:res.data.all,
        name:'订单总数',
      },{
        value:res.data.hasbe,
        name:'已兑换数量',
      },{
        value:res.data.tobe,
        name:'待兑换数量',
      })
      this.listData = arr
      let crr = this.listData.filter(item=>{return item.name !== '订单总数'})
      this.getPiechart(crr)
    },
    getPiechart(crr){
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
        color: ['#28CFB3','#FF9F22'],//扇形区域以及列表颜色
        series: [{
          type: 'pie',
          radius: ['50%', '75%'],//两个表示环
          center: ['50%', '42%'],
          labelLine: {//设置延长线的长度
            normal: {
              length:10,//设置延长线的长度
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
          data:crr,
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
    cardClick(i){
      if(i === 0){
        this.state = ""
      }else if(i === 1){
        this.state = 2
      }else if(i === 2){
        this.state = 1
      }
      this.getData()
    },
    exportClick(form){
      let url = ''
      if(form?.name){
        url += `&name=${form.name}`
      }else if(form?.phoneNumber){
        url += `&phoneNumber=${form.phoneNumber}`
      }else if(form?.onlinetime){
        url += `&onlinetime=${form.onlinetime}`
      }else if(form?.villagename){
        url += `&villagename=${form.villagename}`
      }else if(form?.collatorname){
        url += `&collatorname=${form.collatorname}`
      }else if(form?.state){
        url += `&state=${form.state}`
      }
      let a = document.createElement("a");
      let event = new MouseEvent("click");
      a.download = '文件下载';
      a.href = `${this.$baseUrl}/export/allorder?uid=${this.userData.pid}${url}`;
      a.dispatchEvent(event);
    },
    lookClick(pid){
      this.$refs.convert.showEdit(pid)
    },
    tabRow(row, column, event){
      this.lookClick(row.pid)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.history{
  .el-row{
    .el-col{
      .el-card{
        min-height: calc(100vh - 154px)!important;
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
                &:nth-child(3){
                  margin-bottom: 0;
                }
                &:nth-child(2n){
                  float: right;
                }
                &:first-child{
                  background:linear-gradient(to right, #FD7372, #FB6262);
                  background:-webkit-linear-gradient(to right, #FD7372, #FB6262);
                  background:-moz-linear-gradient(to right, #FD7372, #FB6262);
                  background:-ms-linear-gradient(to right, #FD7372, #FB6262);
                }
                &:nth-child(2){
                  background:linear-gradient(to right, #28CFB3, #72D7CC);
                  background:-webkit-linear-gradient(to right, #28CFB3, #72D7CC);
                  background:-moz-linear-gradient(to right, #28CFB3, #72D7CC);
                  background:-ms-linear-gradient(to right, #28CFB3, #72D7CC);
                }
                &:last-child{
                  background:linear-gradient(to right, #FF9857, #FF9F22);
                  background:-webkit-linear-gradient(to right, #FF9857, #FF9F22);
                  background:-moz-linear-gradient(to right, #FF9857, #FF9F22);
                  background:-ms-linear-gradient(to right, #FF9857, #FF9F22);
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
