<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/5/7
 * @LastEditors: 12390
 * @LastEditTime: 2022/5/7
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="spetemplate">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>智能填报管理列表</span>
      </div>
      <div class="hflex">
        <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="—">
          <el-radio-button label="ovtask">已发布任务列表</el-radio-button>
          <el-radio-button label="moudle">模板列表</el-radio-button>
        </el-radio-group>
      </div>
      <div class="text item">
        <spequery ref="query" @queryClick="queryClick" @addClick="addClick" @backClick="backClick" :tabname="tabCard"/>
        <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <template v-if="tabCard == 'moudle'">
            <el-table-column label="模板名称" align="center" show-overflow-tooltip>
              <template v-slot="scope">
                <div class="iconbg"><i class="icon iconfont icon-tianbao"></i></div>
                <span class="taskbox">{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="explain" label="描述" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="creatusername" label="创建人" align="center"></el-table-column>
            <el-table-column label="最后更新时间" align="center" show-overflow-tooltip>
              <template v-slot="scope">
                {{scope.row.updatedate ? scope.row.updatedate : '暂无时间'}}
              </template>
            </el-table-column>
          </template>
          <template v-if="tabCard == 'ovtask'">
            <el-table-column label="任务名称" align="center" show-overflow-tooltip>
              <template v-slot="scope">
                <div class="iconbg"><i class="icon iconfont icon-tianbao"></i></div>
                <span class="taskbox">{{scope.row.taskname}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" align="center" show-overflow-tooltip>
              <template v-slot="scope">
                {{scope.row.description ? scope.row.description : '暂无描述' }}
              </template>
            </el-table-column>
            <el-table-column label="模板名称" align="center" show-overflow-tooltip>
              <template #default="{row}">
                <div class="iconbg"><i class="icon iconfont icon-tianbao"></i></div>
                <span class="taskbox">{{row.templatename}}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
              <template v-slot="scope">
                <el-switch :value="scope.row.endstate" :active-value="1" :inactive-value="0" :active-text="scope.row.endstate == 1 ? '进行中' : '结束'" @change="stateClick(scope.row.endstate,scope.row.pid)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="可见人员类别" align="center">
              <template v-slot="scope">
               {{scope.row.tasktype == 1 ? '工作人员' : '公众用户'}}
              </template>
            </el-table-column>
            <el-table-column label="开始时间" align="center" show-overflow-tooltip>
              <template v-slot="scope">
                {{scope.row.sponsoridtime ? scope.row.sponsoridtime : '暂无时间'}}
              </template>
            </el-table-column>
            <el-table-column label="是否多次填报" align="center" show-overflow-tooltip>
              <template v-slot="scope">
                {{scope.row.multipletimes == 0 ? '否' : '是' }}
              </template>
            </el-table-column>
            <el-table-column label="结束时间" align="center" show-overflow-tooltip>
              <template v-slot="scope">
                {{scope.row.endtime ? scope.row.endtime : '暂无时间'}}
              </template>
            </el-table-column>
            <el-table-column prop="actualfillinquantity" label="已填数量" align="center" show-overflow-tooltip></el-table-column>
          </template>
          <el-table-column label="操作" :width="tabCard == 'moudle' ? '200px' : '440px'">
            <template v-slot="scope">
              <el-button type="primary" plain @click.stop="lookClick(tabCard === 'moudle' ?  scope.row.pid : scope.row.templateid)">预览</el-button>
              <el-button v-if="tabCard === 'moudle'" type="success" plain @click.stop="addClick(scope.row.pid)">发布任务</el-button>
              <template v-if="tabCard == 'ovtask'">
                <el-button @click.stop="fillClick(scope.row.pid,scope.row.endstate,scope.row.templateid)">填报详情</el-button>
                <el-button type="danger" plain @click.stop="delClick(scope.row.pid,scope.row.templateid)">删除</el-button>
                <el-button type="warning" plain @click.stop="codeClick(scope.row.pid)">生成二维码</el-button>
                <el-button type="success" plain @click.stop="linkClick(scope.row.pid)">链接分享</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </div>
    </el-card>
    <spedialog ref="spelog" @getData="getData" :report="true" />
  </div>
</template>

<script>
import spequery from "@/views/numtask/components/spequery";
import spedialog from "@/views/numtask/components/spedialog";
import {
  delSpemantask,
  getClosetask,
  getSpemanageList,
  getSpemantaskList,
  getTemplateinfo
} from "@/views/numtask/api/spetask";
import {mapGetters} from 'vuex'
import {getServerurl} from "@/views/resident/api/resident";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Query from "@arcgis/core/rest/support/Query";
import * as query from "@arcgis/core/rest/query";
import {getPersonList} from "@/views/numtask/api/person";
export default {
  name: 'spetemplate',
  data() {
    return {
      pid:this.$route.query.pid || null,
      tabCard:this.$route.query.tcard || 'ovtask',
      mtype:this.$route.query.mtype || null,
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      pageNo: 1,
      pageSize: 0,
      pageSizes: [10, 15, 20],
      formData:{},
      logName:null,
      showIndex:localStorage.getItem('showMenuIndex'),
      usercate:[]
    }
  },
  components:{
    spequery,
    spedialog
  },
  computed: {
    ...mapGetters({
        userData:'user/userData'
    })
  },
  created() {
  },
  mounted() {
    this.pageSize = this.pageSizes[0];
    this.getData()
  },
  watch:{
    showIndex:{
      handler(val){
        if(val != 17){
          this.$router.push({path:'/'})
        }
      },
      immediate:true
    }
  },
  methods: {
    async getData(){
      let data = {moduleid:this.pid, pagenum:this.pageNo, pagesize:this.pageSize}
      let obj = this.formData
      let arr = Object.keys(obj)
      for(let i in obj){
        if(arr.includes(i)){
          Object.assign(data,obj)
        }
      }
      let res = this.tabCard == 'moudle'?  await getSpemanageList(data) : await getSpemantaskList(data)
      if(res.code == 200 && res.data){
        this.tableData = this.tabCard == 'moudle' ? res.data.list : res.data.list.filter(item=> item.tasktype==2)
        this.total = this.tabCard == 'moudle' ?  res.data.total : res.data.list.filter(item=> item.tasktype==2).length
      }else {
        this.tableData = []
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)
    },
    lookClick(pid){
      this.$refs.spelog.showEdit(pid,1)
    },
    addClick(pid){
      if(pid){
        this.$refs.spelog.showEdit(pid,2,this.pid)
      }else {
        this.$refs.spelog.showEdit(null,2,this.pid)
      }
    },
    async DeletePointSDE(pid,typeid) { //删除全部点
      let ret = false;
      let serverdata = await getServerurl({typeid:typeid});
      var featureurl = serverdata.data.replace("MapServer", "FeatureServer");
      var featurelayer1 = new FeatureLayer({
        url: featureurl,
        outFields: ["*"]
      });
      var queryObject = new Query();
      queryObject.where = '1=1 and taskid=' + pid;
      queryObject.outFields = ["*"];
      queryObject.returnGeometry = true;
      try {
        let results = await query.executeQueryJSON(featureurl,queryObject)
        if (results != null) {
          if (results.features.length > 0){
            var feature = results.features;
            let result = await featurelayer1.applyEdits({deleteFeatures: feature})
            if (result.deleteFeatureResults.length > 0) {
              ret = true;
            } else{
              ret = false;
            }
          }else {
            ret = true
          }
        }else{
          ret = true;
        }
        return ret;
      }catch (err) {
        this.$message.error('删除失败')
        return false
      }
    },
    delClick(pid,tid){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let ures = await getTemplateinfo({templateid:tid})
        if(ures.data.usemap == 1){
          let ret = await this.DeletePointSDE(pid,8)
          if(ret){
            let res = await delSpemantask({pid})
            if(res.code == 200){
              this.$message.success('删除成功')
              this.getData()
            }
          }else {
            this.$message.error('删除失败')
            return false
          }
        }else {
          let res = await delSpemantask({pid})
          if(res.code == 200){
            this.$message.success('删除成功')
            this.getData()
          }else {
            this.$message.error('删除失败')
            return false
          }
        }
      })
    },
    codeClick(pid){
      this.$refs.spelog.showEdit(pid,3)
    },
    linkClick(pid){
      this.$refs.spelog.showEdit(pid,4)
    },
    fillClick(pid,state,tid){
      let url = ''
      let params = {}
      if(this.mtype && this.mtype == 1){
        url = '/rewpefill'
        Object.assign(params,{pid,state,mid:this.pid,type:2,tcard:this.tabCard,tid,mtype:this.mtype})
      }else {
        url= '/repefill'
        Object.assign(params,{pid,state,mid:this.pid,type:2,tcard:this.tabCard,tid})
      }
      this.$router.push({
        path:url,
        query:params
      })
    },
    stateClick(state,pid){
      this.$baseConfirm(state == 1 ? '你确定要关闭任务吗？': '你确定要开启任务吗？',state == 1 ? '关闭提示':'开启提示',async ()=>{
        if(state == 1){
          let res = await getClosetask({pid})
          if(res.code == 200){
            this.$message.success('关闭成功')
            this.getData()
          }
        }else if(state == 0){
          this.$refs.spelog.showEdit(pid,5)
        }
      })
    },
    backClick(){
      this.$router.replace({
        path:'/report'
      })
    },
    tabChange(val){
      this.tabCard = val
      this.getData()
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
@import './style/spepage.scss';
</style>
