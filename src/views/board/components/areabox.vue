<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/7/31
 * @LastEditors: 12390
 * @LastEditTime: 2022/7/31
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="areabox">
    <el-button v-if="tableData.length==0" type="primary" icon="el-icon-circle-plus-outline" size="small" @click="addgird()">新增组织</el-button>
    <el-table v-loading="tabloading" :data="tableData" :row-key="row=>{return row.pid.toString()}" tooltip-effect="dark" :max-height="730" :element-loading-text="loadingText" border default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
      <el-table-column label="网格名称">
        <template v-slot="scope">
          <span v-if="!scope.row.children" class="noch">{{scope.row.gridareaname}}</span>
          <template v-else>
            {{scope.row.gridareaname}}
          </template>
        </template>
      </el-table-column>
      <el-table-column label="网格等级">
        <template v-slot="scope">
          {{scope.row.level | getLevel}}
        </template>
      </el-table-column>
      <el-table-column prop="areaname" label="所属区域"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="success" plain round size="small" @click="editClick(scope.row)">修改</el-button>
          <el-button type="danger" plain round size="small" @click="delClick(scope.row.pid)">删除</el-button>
          <el-button v-if="scope.row.level!=4" type="primary" round size="small" @click="addgird(scope.row)">新增组织</el-button>
        </template>
      </el-table-column>
    </el-table>
    <golbalog ref="golbal" :area="true" @getData="getAreaData" />
  </div>
</template>

<script>
import {delGridArea, getGridAreaList} from "../api/grid";
import golbalog from "./golbalog";
export default {
  name: 'areabox',
  data() {
    return {
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
    }
  },
  filters:{
    getLevel(val){
      let arr = ['一级网格','二级网格','三级网格','四级网格']
      return arr[val-1]
    }
  },
  components: {
    golbalog
  },
  methods: {
    async getAreaData(){
      let res = await getGridAreaList()
      if(res.code == 200 && res.data){
        this.tableData = res.data
      }else {
        this.tableData = []
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)
    },
    addgird(obj){
      this.$refs.golbal.showArea(obj ? obj : {} , 1)
    },
    editClick(obj){
      this.$refs.golbal.showArea(obj, 2)
    },
    delClick(pid){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let res = await delGridArea({pid})
        if(res.code == 200){
          this.$message.success('删除成功')
          this.getAreaData()
        }
      })
    },
  }
}
</script>
