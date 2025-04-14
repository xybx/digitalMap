<template>
  <div class="manage">
    <el-row :gutter="5">
      <el-col :lg="8" :md="8" :sm="24" :xl="8" :xs="24">
          <el-card class="box-card animate__animated animate__fadeInLeft cardbox">
            <div slot="header" class="clearfix">
              <i></i>
              <span>联户统计</span>
            </div>
            <div class="text item">
              <ol class="mlist">
                <li v-for="item in overlist">
                  <h3>{{item.name}}</h3>
                  <span>{{item.value}}<u>人</u></span>
                </li>
              </ol>
              <ul class="cardlist">
                <li v-for="item in listData">
                  <span>{{item.name}}</span>
                  <i>{{item.value}}<u>人</u></i>
                </li>
              </ul>
              <div class="piebox">
                <div id="piechart"></div>
                <span class="midfont">
                  <label>{{overnumber}}%</label>
                  <u>{{level == 2 ? '干部完成率' : '完成率'}}</u>
                </span>
              </div>
              <span class="fontbox">"一户联20"联系服务群众完成率</span>
            </div>
          </el-card>
      </el-col>
      <el-col :lg="16" :md="16" :sm="24" :xl="16" :xs="24">
        <el-card class="box-card animate__animated animate__fadeInRight">
          <div slot="header" class="clearfix">
            <i></i>
            <span>联户台账</span>
          </div>
          <div class="text item">
            <queryForm ref="queryd" :tcard="tabCard" @queryClick="queryClick" @exportClick="exportClick"/>
            <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="medium">
              <el-radio-button label="mass">一联20群众列表</el-radio-button>
              <el-radio-button label="cadre">干部联户情况列表</el-radio-button>
            </el-radio-group>
            <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
              <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
              <el-table-column v-for="item in tableColumns" :key="item.prop" align="center" :width="item.prop== 'checkresult' && item.prop == 'pannierphone' ? '150px' : ''" show-overflow-tooltip :label="item.label">
                <template #default="{ row, $index }">
                  <template v-if="item.prop== 'checkresult'">
                    <!--<el-link :underline="false" :type="row[item.prop] == 0 ? 'warning' : row[item.prop] == 1 ? 'success' : row[item.prop] == 2 ? 'primary':'danger'">{{row[item.prop] == 0 ? '待审核' :row[item.prop] == 1 ? '正常' : row[item.prop] == 2 ? '新增': row[item.prop] == 3 ? '手机与姓名不一致' : '空号或外地号码'}}</el-link>-->
                    {{row[item.prop] == 0 ? '待审核' :row[item.prop] == 1 ? '正常' : row[item.prop] == 2 ? '新增': row[item.prop] == 3 ? '手机与姓名不一致' : '空号或外地号码'}}
                  </template>
                  <template v-else-if="item.prop == 'checkstate'">
                    <el-tag :type="row[item.prop] == 1 ? '' : row[item.prop] == 2 ? 'success': row[item.prop] == 3 ? 'warning':'danger'">{{row[item.prop] == 1 ? '待审' : row[item.prop] == 2 ? '已审核': row[item.prop] == 3 ? '系统自动审核' : '未通过' }}</el-tag>
                  </template>
                  <template v-else-if="item.prop == 'donestate'">
                    <el-tag :type="row[item.prop] == 0 ? 'danger' : 'success'">{{row[item.prop] == 0 ? '未完成' :'已完成'}}</el-tag>
                  </template>
                  <template v-else>
                    {{ row[item.prop] ? row[item.prop] : '暂无数据'}}
                  </template>
                </template>
              </el-table-column>
              <el-table-column v-if="level == 2&&tabCard == 'mass'" label="操作" align="center" width="150px">
                <template #default="{ row, $index }">
                  <el-button type="primary" plain size="mini" @click.stop="editClick(row)">编辑</el-button>
                  <!--<el-button type="danger" plain size="mini" @click.stop="delClick(row.pid)">删除</el-button>-->
                  <el-button v-if="userData.sitemanager == 1" type="danger" plain size="mini" @click.stop="delClick(row.pid)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <Cadredialog ref='cadre' @getData='getData'/>
  </div>
</template>
<script>
import Cadredialog from "./components/cadredialog.vue";
import queryForm from "./components/queryForm.vue";
import {delCadre, getCadreList, getCadreTotal, getCarduserList} from "@/views/cadre/api/cadre";
import {mapGetters} from "vuex";
export default {
  name: "manage",
  data(){
    return {
      tabCard:'mass',
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
      overlist:[],
      overnumber:0
    }
  },
  computed:{
    ...mapGetters({
      token:'user/token',
      level:'user/level',
      userData:'user/userData'
    })
  },
  components:{
    queryForm,
    Cadredialog
  },
  created(){
    this.pageSize = this.pageSizes[0]
  },
  mounted(){
    this.getTableFields()
    this.getData()
    this.getTotal()
  },
  methods:{
    getTableFields(){
      this.tableColumns = this.tabCard == 'mass' ? [
        {prop: 'panniername', label: '公众姓名'},
        {prop: 'pannierphone', label: '手机号'},
        {prop: 'areaname', label: '所属村居'},
        {prop: 'officename', label: '单位名称'},
        {prop: 'username', label: '干部姓名'},
        {prop: 'checkresult', label: '系统比对情况'},
        {prop: 'checkstate', label: '核验结果'},
      ] : [
        {prop: 'name', label: '姓名'},
        {prop: 'phonenum', label: '手机号'},
        {prop: 'areaname', label: '区域名称'},
        {prop: 'officename', label: '单位名称'},
        {prop: 'donestate', label: '完成情况'},
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
      let res = this.tabCard == 'mass' ? await getCadreList(data) : await getCarduserList(data)
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
    async tabChange(val){
      this.tabCard = val
      this.$refs.queryd.clearClick()
      this.formData = {}
      await this.getTableFields()
      await this.getData()
    },
    async getTotal(){
      let {data} = await getCadreTotal()
      this.listData = [
        {value:data.gblhywc, name:'联户已完成人数(干部)'},
        {value:data.lhywc, name:'联户已完成数量(群众)'},
        {value:data.gblhwwc, name:'联户未完成人数(干部)'},
        {value:data.lhwwc, name:'联户剩余数量(群众)'}
      ]
      this.overnumber = data.wanchenglv
      this.overlist = [
          {value:data.allganbu, name:'干部人员总数'},
          {value:data.allqunzhong, name:'应联户总数'},
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
          color: ['#28CFB3','#FD7372','#FF9F22','#1C9DFE'],//扇形区域以及列表颜色
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
    exportClick(){
      let params = this.formData
      const loading = this.$loading({
            lock: true,
            text: '文件下载中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.6)'
      });
      let _this = this
      axios({
          headers: { Authorization:this.token },
          type: 'application/ json; charset = utf-8',
          method: 'GET',
          url: `${window.apiURL}/pannier/countlistexport`,
          params:params,
          responseType: 'arraybuffer',
        }).then(function (res) {
          const fileName = '联户台账人员信息.xlsx';
          const blob = new Blob([res.data]);
          //创建一个a标签并设置href属性，之后模拟人为点击下载文件
          let link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click(); //模拟点击
          //释放资源并删除创建的a标签
          URL.revokeObjectURL(link.href);
          setTimeout(() => {
            loading.close();
            _this.$message.success('文件下载成功！')
          }, 2000);
        });
    },
    editClick(obj){
      this.$refs.cadre.showEdit(obj)
    },
    delClick(pid){
      this.$baseConfirm('你确定要删除吗？', '删除提示',async ()=>{
        let res = await delCadre({pid:pid})
        if(res.code == 200){
          this.$message.success('已删除')
          this.getData()
        }
      })
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
@import "./style/manage.scss";
</style>
