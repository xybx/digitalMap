<template>
  <div class="vindex">
    <div class="infobox">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-card class="box-card animate__animated animate__fadeInLeft">
            <div slot="header">
              <i></i>
              <span>活动类型统计</span>
            </div>
            <div class="text item">
              <ul class="slist">
                <li v-for="(item,index) in sortData" :key="index" @click="navClick(index+1)" class="animate__animated animate__zoomIn animate__delay-1s">
                  <div class="sfont">
                    <span>{{item.title}}</span>
                    <u>{{item.nums}}</u>
                  </div>
                  <div class="iconbg"><i class="icon iconfont" :class="item.classname"></i></div>
                </li>
              </ul>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card animate__animated animate__fadeInRight">
            <div slot="header">
              <i></i>
              <span>活动统计</span>
            </div>
            <div class="text item">
              <div class="actbox">
                <ul class="rlist">
                  <li v-for="(item,index) in totalData" :key="index" class="animate__animated animate__fadeInLeft animate__delay-1s">
                    <div class="rfont">
                      <span>{{item.title}}</span>
                      <u>{{item.nums}}</u>
                    </div>
                    <div class="iconbg"><i class="icon iconfont" :class="item.classname"></i></div>
                  </li>
                </ul>
                <div class="piebox">
                  <div id="pies"></div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="infobox">
      <el-row>
        <el-col :span="24">
          <el-card class="box-card animate__animated animate__fadeInUp">
            <div slot="header">
              <i></i>
              <span>活动台账</span>
            </div>
            <div class="text item">
                <inquery ref="inquery" @queryClick="queryClick"/>
                <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
                  <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
                  <el-table-column prop="activityname" label="活动名称" align="center" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="typename" label="活动类型" align="center" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="numberofrecruits" label="招募人数" align="center"></el-table-column>
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
                  <template v-if="showkeys != 1">
                    <el-table-column label="操作" align="center" width="100px">
                      <template v-slot="scope">
                        <el-button type="warning" plain @click.stop="lookClick(scope.row.pid)">查看</el-button>
                      </template>
                    </el-table-column>
                  </template>
                </el-table>
                <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <civildialog ref="civil" :vindex="true" :tabname="tabnums"/>
    </div>
  </div>
</template>
<script>
import inquery from "@/views/voluntary/components/inquery";
import civildialog from "@/views/voluntary/components/civildialog";
import {getactiveList, getAllList, getcount, getoverList, getTypecount} from "@/views/voluntary/api/pracrice";
export default {
  name: "vindex",
  data() {
    return {
      sortData:[],
      totalData:[],
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      pageNo: 1,
      pageSize: 0,
      pageSizes: [6],
      formData:{},
      showkeys:1,
      tabnums:''
    }
  },
  components: {
    inquery,
    civildialog
  },
  computed: {},
  created() {
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
    this.getTotal()
    this.getTypeList()
    this.getTable()
  },
  methods: {
    async getTotal(){
      let res = await getcount()
      let arr = [
        {title:'已发起总数',nums:res.data.initiated,classname:'icon-faqiyanshou'},
        {title:'招募中',nums:res.data.inProgress,classname:'icon-jinxingzhong'},
        {title:'已完结',nums:res.data.finished,classname:'icon-wancheng1'},
        {title:'已发放积分',nums:res.data.issued,classname:'icon-jifen'},
        {title:'参与总人数',nums:res.data.participate,classname:'icon-renshu'},
      ]
      this.sortData = arr.slice(0,3)
      this.totalData = arr.slice(3)
    },
    async getTypeList(){
      let res = await getTypecount()
      let arr = res.data.map(item=>{
        return {
          name: item.typename,
          value:item.count
        }
      })
      var myChart = this.$echarts.init(document.getElementById("pies"));
      var option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient:'vertical',
          top:'center',
          right:'0%',
          icon: 'circle',
          itemGap:8,
          textStyle: {
            color: '#999999'
          }
        },
        grid: {
          top: 0
        },
        color: ['#1975EF', '#FF9F24', '#14C78B', '#E83933', '#EFC238','','','','',''], //扇形区域以及列表颜色
        series: [{
          type: 'pie',
          // radius: ['45%', '70%'], //两个表示环
          center: ['40%', '50%'],
          labelLine: { //设置延长线的长度
            length:20, //设置延长线的长度
          },
          label: {
            formatter: '{bf|{b}} \n {per|}{cf|{c}}', //这里最后另一行设置了一个空数据是为了能让延长线与hr线对接起来
            color: '#333',
            rich: {
              bf: {
                color: '#333',
                padding: [0, 0, 0, 0],
                fontsize: 18,
                lineHeight: 20
              },
              cf: {
                color: '#000',
                fontsize: 30,
                lineHeight: 30, //设置最后一行空数据高度，为了能让延长线与hr线对接起来
              },
              per: { //用百分比数据来调整下数字位置，显的好看些。如果不设置，formatter最后一行的空数据就不需要
                padding: [4, 0],
              }
            }
          },
          data:arr,
          emphasis: {
            itemStyle: {
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
    navClick(i){
      this.showkeys = i
      if(i == 1){
        this.tabnums = ''
      }else if(i == 2){
        this.tabnums = 'current'
      }else if(i == 3){
        this.tabnums = 'history'
      }
      this.getTable()
    },
    async getTable(){
      this.$refs.inquery.getCate()
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
      if(this.showkeys == 1) res = await getAllList(data)
      if(this.showkeys == 2) res = await getactiveList(data)
      if(this.showkeys == 3) res =await getoverList(data)
      if(res.code === 200){
        this.tableData = res.data.list
        this.total = res.data.total
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)
    },
    lookClick(pid){
      this.$refs.civil.showData(pid,2)
    },
    queryClick(form){
      this.formData = form
      this.pageNo = 1
      this.getTable()
    },
    SizeChange(val){
      this.pageSize = val;
      this.getTable();
    },
    CurrentChange(val){
      this.pageNo = val;
      this.getTable();
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/vab/styles/scss/vindex.scss';
</style>
