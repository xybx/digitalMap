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
  <div class="pteach">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>三化建设</span>
      </div>
      <div class="text item">
        <div class="addbtn" @click="addbtn">
          <i class="el-icon-upload"></i>
          <span>新增三化建设</span>
        </div>
        <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
          <el-form-item label="标题名称">
            <el-input v-model="queryForm.title" placeholder="请输入标题名称" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="danger" size="small" @click="queryClick">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="imgwarp">
          <div v-if="!imgdata.length" class="imagebox">
            <i class="el-icon-picture-outline"></i>
            <u>暂无工作简介</u>
          </div>
          <div v-for="(item,index) in imgdata" v-else class="imgbox">
            <el-image :src="primgdata[index]" :preview-src-list="primgdata" :z-index="2999"></el-image>
            <div slot="btnbox" class="shadow">
              <span @click="lookclick(item.pid)">查看</span>
              <span @click="editclick(item.pid)">编辑</span>
              <span @click="delclick(item.pid)">删除</span>
            </div>
            <span>{{item.title}}</span>
          </div>
        </div>
        <el-pagination background class="redpage" :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
      </div>
    </el-card>
    <pubdialog ref="public" @getData="getData" :types="1"/>
  </div>
</template>

<script>
import {delPublic, getPublicList} from "@/views/inspecte/api/public";
import pubdialog from "@/views/inspecte/components/pubdialog";
export default {
  name: 'pteach',
  data() {
    return {
      imgdata:[],
      url:'',
      primgdata:[],
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      pageNo: 1,
      pageSize: 0,
      pageSizes: [10, 15, 20],
      queryForm:{},
      showIndex:localStorage.getItem('showMenuIndex')
    }
  },
  components: {
    pubdialog
  },
  computed: {},
  created() {
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
    this.getData()
  },
  watch:{
    showIndex:{
      handler(val){
        if(val != 23){
          this.$router.push({path:'/'})
        }
      },
      immediate:true
    }
  },
  methods: {
    async getData(){
      let params = {pagenum:this.pageNo,pagesize:this.pageSize,type:1}
      if(this.queryForm.title != ''){
        Object.assign(params,{title:this.queryForm.title})
      }
      let res = await getPublicList(params)
      if(res.code == 200 && res.data){
        this.imgdata = res.data.list
        this.primgdata = res.data.list.map(item =>{
          return `${this.$baseUrl}/gridfs/image/${item.fileimage}`
        })
        this.total = res.data.total
      }else {
        this.imgdata = []
      }
    },
    addbtn(){
      this.$refs.public.showEdit(null,1)
    },
    queryClick(){
      this.pageNo = 1
      this.getData()
    },
    lookclick(pid){
      this.$router.push({
        path:'/pview',
        query:{pid,type:1}
      })
    },
    editclick(pid){
      this.$refs.public.showEdit(pid,2)
    },
    delclick(pid){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let res = await delPublic({pid})
        if(res.code == 200){
          this.$message.success('删除成功')
          this.getData()
        }
      })
    },
    SizeChange(val) {
      this.pageSize = val;
      this.getUserlist(this.pid);
    },
    CurrentChange(val) {
      this.pageNo = val;
      this.getUserlist(this.pid);
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../style/public.scss";
</style>
