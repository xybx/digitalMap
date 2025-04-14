<template>
   <div class="canteen">
    <el-row :gutter="5">
      <el-col :lg="8" :md="8" :sm="24" :xl="8" :xs="24">
          <el-card class="box-card animate__animated animate__fadeInLeft cardbox">
            <div slot="header" class="clearfix">
              <i></i>
              <span>鲁通码机关食堂统计</span>
            </div>
            <div class="text item">
              <ul class="cardlist">
                <li v-for="item in listData">
                  <span>{{item.name}}</span>
                  <i>{{item.value}}<u>人</u></i>
                </li>
              </ul>
              <div class="piebox">
                <div id="piechart"></div>
              </div>
            </div>
          </el-card>
      </el-col>
      <el-col :lg="16" :md="16" :sm="24" :xl="16" :xs="24">
        <el-card class="box-card animate__animated animate__fadeInRight">
          <div slot="header" class="clearfix">
            <i></i>
            <span>鲁通码机关食堂台账</span>
          </div>
          <div class="text item">
            <queryForm :talent="true" @queryClick="queryClick"/>
            <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
              <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
              <el-table-column v-for="item in tableColumns" :key="item.prop" align="center" :width="item.prop== 'checkresult' && item.prop == 'pannierphone' ? '150px' : ''" show-overflow-tooltip :label="item.label">
                <template #default="{ row, $index }">
                  <template v-if="item.prop == 'result'">
                    <el-tag :type="row[item.prop] == 1 ? 'success' : 'danger'">{{row[item.prop] == 1 ? '通过' :'未通过'}}</el-tag>
                  </template>
                  <template v-else>
                    {{ row[item.prop] ? row[item.prop] : '暂无数据'}}
                  </template>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import queryForm from "@/views/rashcode/components/queryForm.vue";
import {getCanteenTotal, getCanteenList} from "@/views/rashcode/api/rcode";
export default {
  name: "canteen",
  data(){
    return {
      tableColumns:[],
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      pageNo: 1,
      pageSize: 0,
      pageSizes: [10, 15, 20],
      formData:{},
      listData:[],
    }
  },
  components: {queryForm},
  created(){
      this.pageSize = this.pageSizes[0]
  },
  mounted() {
    this.getTableFields()
    this.getData()
    this.getTotal()
  },
  methods:{
    getTableFields(){
      this.tableColumns = [
        {prop: 'pname', label: '姓名'},
        {prop: 'phone', label: '手机号'},
        {prop: 'cardid', label: '身份证号'},
        {prop: 'areaname', label: '所属站点'},
        {prop: 'username', label: '核验人'},
        {prop: 'result', label: '识别结果'},
        {prop: 'addtime', label: '核验时间'},
      ]
    },
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
      let res = await getCanteenList(data)
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
    async getTotal(){
      let {data} = await getCanteenTotal()
      this.listData = [
        {value:data.all, name:'总数'},
        {value:data.shi, name:'今天机关食堂'},
        {value:data.bushi, name:'历史机关食堂'},
      ]
      await this.getPiechart()
    },
    getPiechart(){
      var myChart = this.$echarts.init(document.getElementById("piechart"));
      var option =  {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          bottom:'bottom',
          left: 'center',
          icon:'circle',
          itemGap:12,
          textStyle:{
            color:'#999999'
          }
        },
        grid:{
          top:0,
        },
        color: ['#28CFB3','#FD7372','#FF9F22'],//扇形区域以及列表颜色
        series: [{
          type: 'pie',
          radius: ['50%', '70%'],//两个表示环
          center: ['50%', '37%'],
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
          data:this.listData,
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
<style scoped lang="scss">
@import './style/canteen.scss';
</style>
