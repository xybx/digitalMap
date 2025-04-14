<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/7/5
 * @LastEditors: 12390
 * @LastEditTime: 2022/7/5
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="query">
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent label-width="80px">
          <el-form-item label="姓名" label-width="60px"  v-if="!orgin&&!member">
            <el-input v-model="queryForm.username" placeholder="请输入姓名" clearable/>
          </el-form-item>
          <el-form-item label="成员名称" label-width="80px" v-if="member">
            <el-input v-model="queryForm.membername" placeholder="请输入成员名称" clearable/>
          </el-form-item>
          <el-form-item label="所属村居" v-if="!orgin">
            <el-select v-model="queryForm.villageid" placeholder="请选择所属村居" clearable>
              <el-option v-for="item in areaData" :key="item.pid" :label="item.areaname" :value="item.pid"></el-option>
            </el-select>
          </el-form-item>
          <template v-if="run">
            <el-form-item label="组织名称">
              <el-select v-model="queryForm.partyid" placeholder="请选择组织名称" clearable>
                <el-option v-for="item in orginData" :key="item.pid" :label="item.partyname" :value="item.pid"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="年度" label-width="60px">
              <el-date-picker v-model="queryForm.paymentyear" type="year" value-format="yyyy" placeholder="请选择年度" clearable></el-date-picker>
            </el-form-item>
            <el-form-item label="月份" label-width="60px">
              <el-select v-model="queryForm.paymentmonth" placeholder="请选择月份" clearable>
                <el-option v-for="(item,index) in countData" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </template>
          <el-form-item label="支部名称" v-if="meet">
            <el-input v-model="queryForm.partyname" placeholder="请输入支部名称" clearable/>
          </el-form-item>
          <template v-if="meet">
            <el-form-item label="周期" label-width="60px">
              <el-select v-model="queryForm.frequency" placeholder="请选择周期" clearable>
                <el-option v-for="(item,index) in countData" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </template>
          <el-form-item>
            <el-button v-if="!orgin" type="-" icon="el-icon-search" size="small" @click="queryClick">查询</el-button>
            <el-button v-if="member" type="danger" icon="el-icon-circle-plus-outline" size="small" @click="addClick">成员新增</el-button>
            <el-button v-if="meet&&tcard=='delay'&&backData.level!=4" type="danger" icon="el-icon-circle-plus-outline" size="small" @click="addover">创建延期提醒</el-button>
            <el-button v-if="run" type="danger" icon="el-icon-circle-plus-outline" size="small" @click="addmoney">新增缴费</el-button>
            <el-button v-if="orgin && !showbtn" type="danger" icon="el-icon-circle-plus-outline" size="small" @click="addorgin">新增组织</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>
  </div>
</template>

<script>
import VabQueryFormLeftPanel from "@/vab/components/VabQueryForm/components/VabQueryFormLeftPanel";
import VabQueryForm from "@/vab/components/VabQueryForm";
import {getOrgList, getUserArea} from "@/views/inspecte/api/party";
import {mapGetters} from "vuex";
export default {
  name: 'partyform',
  data() {
    return {
      queryForm:{},
      countData:[],
      orginData:[],
      areaData:[]
    }
  },
  props:['run','meet','tcard','orgin','member','showbtn'],
  components: {
    VabQueryFormLeftPanel, VabQueryForm
  },
  computed: {
    ...mapGetters({
      backData:'user/backData',
    })
  },
  created() {
  },
  mounted() {
    this.getCount()
    this.getOrgin()
    this.getArea()
  },
  methods: {
    async getOrgin(){
      let res = await getOrgList()
      this.orginData = res.data
    },
    async getArea(){
      let res = await getUserArea()
      this.areaData = res.data ? res.data : []
    },
    getCount(){
      let arr = [1,2,3,4,5,6,7,8,9,10,11,12]
      this.countData = arr
    },
    queryClick(){
      this.$emit('queryClick',this.queryForm)
    },
    addClick(){
      this.$emit('addClick')
    },
    addover(){
      this.$emit('addover')
    },
    addmoney(){
      this.$emit('addmoney')
    },
    addorgin(){
      this.$emit('addorgin')
    },
    exportClick(){
      this.$emit('exportClick')
    },
    clearform(){
      this.queryForm = this.$options.data().queryForm
    }
  }
}
</script>

<style lang="scss" scoped>
.query{
  ::v-deep{
    .el-form{
      .el-form-item{
        margin-left: 15px!important;
        &:first-child{
          margin-left: 0!important;
        }
      }
    }
  }
}
</style>
