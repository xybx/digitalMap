<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/6/20
 * @LastEditors: 12390
 * @LastEditTime: 2022/6/20
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="organage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>党组织管理</span>
      </div>
      <div class="text item">
        <partyform @addorgin="addorgin" :orgin="true" :showbtn="showbtn" />
        <el-table v-loading="tabloading" :data="tableData" :row-key="row=>{return row.pid.toString()}" tooltip-effect="dark" :element-loading-text="loadingText" border default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column label="组织名称">
            <template v-slot="scope">
              <span v-if="!scope.row.children" class="noch">{{scope.row.partyname}}</span>
              <template v-else>
                {{scope.row.partyname}}
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="areaname" label="所属村居"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button v-if="backData.level<4 || (backData.level == 4 && scope.row.areaid==userData.areaid&&scope.row.arealevel!=3)" type="success" plain round size="small" @click="editClick(scope.row,scope.$index)">修改</el-button>
              <el-button v-if="backData.level<4 || (backData.level == 4 && scope.row.areaid==userData.areaid&&scope.row.arealevel!=3)" type="danger" plain round size="small" @click="delClick(scope.row.pid)">删除</el-button>
              <el-button v-if="(backData.level<4 && scope.row.arealevel!=6) || (backData.level == 4 && scope.row.areaid==userData.areaid&&scope.row.arealevel!=6&&scope.row.arealevel!=3)" type="danger" round size="small" @click="addorgin(scope.row)">新增组织</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <partylog ref="party" @getData="getData" :orgin="true" :showtag="showtag" />
  </div>
</template>

<script>
import partyform from "../components/partyform";
import {delOrgin, getOrginList} from "@/views/inspecte/api/party";
import partylog from "../components/partylog";
import {mapGetters} from "vuex";
export default {
  name: 'organage',
  data() {
    return {
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      formData:{},
      showbtn:false,
      showtag:false,
      search:false,
      allshow:false,
      rowkey:['5']
    }
  },
  components: {
    partyform,
    partylog
  },
  computed: {
    ...mapGetters({
      userData:'user/backData',
      backData:'user/backData',
    })
  },
  created() {
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData(){
      let data = {}
      let obj = this.formData
      let arr = Object.keys(obj)
      for(let i in obj){
        if(arr.includes(i)){
          Object.assign(data,obj)
        }
      }
      let res = await getOrginList(data)
      if(res.code == 200 && res.data){
        this.tableData = res.data
      }else {
        this.tableData = []
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)
      this.showbtn = res.data.length > 0 || this.search ? true : false
    },
    addorgin(obj){
      this.$refs.party.showOrgin(obj ? obj : null, 1)
      this.showtag = obj ? true : false
    },
    editClick(obj,key){
      this.showtag = key == 0 ? false:true
      this.$refs.party.showOrgin(obj, 2)
    },
    delClick(pid){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let res = await delOrgin({pid})
        if(res.code == 200){
          this.$message.success('删除成功')
          this.getData()
        }
      })
    },
    queryClick(form){
      this.formData = form
      this.pageNo = 1
      this.search = true
      this.getData()
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../style/party.scss";
</style>
