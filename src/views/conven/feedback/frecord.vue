<template>
  <div class="record-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>区域查询</span>
      </div>
      <div class="text item">
        <queryForm :record="record" @queryClick="queryClick"/>
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column prop="typename" label="事件类型" align="center"></el-table-column>
          <el-table-column label="事件描述" align="center">
            <template v-slot="scope">
              {{scope.row.repconten ? scope.row.repconten : '暂无事件描述'}}
            </template>
          </el-table-column>
          <el-table-column label="上报时间" align="center">
            <template v-slot="scope">
              {{scope.row.startdate.substr(0,10)}}
            </template>
          </el-table-column>
          <el-table-column label="上传地址" align="center">
            <template v-slot="scope">
              {{scope.row.address ? scope.row.address : '暂无上传地址'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template v-slot="scope">
              <el-button type="primary" plain @click="look(scope.row.pid)">查看详情</el-button>
              <el-button type="danger" plain @click="delclick(scope.row.pid)">删除</el-button>
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
      <codelog ref="cdialog" @getData="getData"/>
    </el-card>
  </div>
</template>

<script>
import queryForm from "../components/queryForm";
import {getRecordList,delarea} from '../api/feedcode';
import codelog from "../components/codedialog";
import { mapGetters} from 'vuex';
import {getServerurl} from "@/views/resident/api/resident";
import esriLoader from "esri-loader";
let app;
export default {
  name: "record",
  data(){
    return {
      option:{
       url: '/arcgis_js_api/library/4.22/init.js',
        css: '/arcgis_js_api/library/4.22/esri/css/main.css',
      },
      tableData:[],
      pid:this.$route.query.pid || null,
      tabloading:true,
      loadingText: "正在加载...",
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      pageNo: 1,
      pageSize: 0,
      pageSizes: [10, 15, 20],
      formData:{},
      record:true
    }
  },
  computed:{
    ...mapGetters({
      userData:'user/userData'
    })
  },
  components:{
    queryForm,
    codelog
  },
  created() {
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
    app=this;
    this.getData()
    if(this.pid){
      this.look(this.pid)
    }
  },
  methods:{
    async getData(){
      let data = {
        uid:this.userData.pid,
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
      let res = await getRecordList(data)
      if(res.code === 200){
        this.tableData = res.data
        this.total = res.count
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)
    },
    queryClick(form){
      this.formData = form
      this.pageNo = 1
      this.getData()
    },
    look(id){
      this.$refs.cdialog.showEdit(id,4)
    },
    async DeletePointSDE(id,typeid) {
      var ret = false;
      let serverdata = await getServerurl({typeid:typeid});
      var featureurl = serverdata.data.replace("MapServer", "FeatureServer");
      const [FeatureLayer,Graphic,QueryTask, Query]=await esriLoader.loadModules(["esri/layers/FeatureLayer", "esri/Graphic", "esri/tasks/QueryTask", "esri/tasks/support/Query"]);
      var featurelayer1 = new FeatureLayer({
        url: featureurl,
        outFields: ["*"]
      });
        var querytask = new QueryTask(featureurl);
        var query = new Query();
        query.where = `hbh = '${id}'`;
        query.outFields = ["*"];
        query.returnGeometry = true;
        let results = await querytask.execute(query)
        if (results != null) {
          if (results.features.length > 0){
            var feature = results.features[0];
            let result = await featurelayer1.applyEdits({deleteFeatures: [feature]})
            if (result.deleteFeatureResults.length > 0) {
              ret = true;
            } else{
              ret = false;
            }
          }
        }else{
          ret = true;
        }
        return ret;
    },
    delclick(pid){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let ret= await this.DeletePointSDE(pid,1);
        if(ret){
          let res = await delarea({pid})
          if (res.code === 200) {
            this.$message.success("删除成功");
            this.getData()
          }
        }else{
          this.$message.error('删除失败')
          return false
        }
      })
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
.record-container{
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
