<template>
  <div class="query">
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
            <template v-if="country">
              <el-form-item label="标题">
                <el-input v-model="queryForm.name" placeholder="请输入标题" clearable/>
              </el-form-item>
              <el-form-item label="所属村居">
                <el-select v-model="queryForm.villageid" placeholder="请选择所属村居" clearable>
                  <el-option v-for="item in villData" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="类别" v-if="tabname">
                <el-select v-model="queryForm.typeid" placeholder="请选择类型" clearable>
                  <el-option v-for="item in cateData" :key="item.pid" :value="item.pid" :label="item.name"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="点赞状态" v-if="tabname == 'current'">
                <el-select v-model="queryForm.likestate" placeholder="请选择点赞状态" clearable>
                  <el-option :value="0" label="关闭"></el-option>
                  <el-option :value="1" label="开启"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="结束时间" v-if="tabname">
                <el-date-picker v-model="queryForm.enddate" type="date" value-format="yyyy-MM-dd" placeholder="请选择结束时间" clearable></el-date-picker>
              </el-form-item>
            </template>
            <template v-if="town">
              <el-form-item label="内容">
                <el-input v-model="queryForm.content" placeholder="请输入内容" clearable/>
              </el-form-item>
              <el-form-item label="所属村居">
                <el-select v-model="queryForm.villageid" placeholder="请选择所属村居" clearable>
                  <el-option v-for="item in villData" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="queryForm.name" placeholder="请输入姓名" clearable/>
              </el-form-item>
              <el-form-item label="发布时间">
                <el-date-picker v-model="queryForm.startdate" type="date" value-format="yyyy-MM-dd" placeholder="请选择发布时间" clearable></el-date-picker>
              </el-form-item>
            </template>
            <el-form-item label="榜单类别" v-if="cate">
              <el-input v-model="queryForm.name" placeholder="请输入榜单类别" clearable/>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" size="small" @click="queryClick">查询</el-button>
              <el-button v-if="country && tabname" icon="el-icon-circle-plus-outline" type="success" size="small" @click="addClick">添加乡村榜单</el-button>
              <el-button v-if="cate" icon="el-icon-circle-plus-outline" type="success" size="small" @click="addcateClick">添加榜单类别</el-button>
            </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>
  </div>
</template>
<script>
import VabQueryFormLeftPanel from "@/vab/components/VabQueryForm/components/VabQueryFormLeftPanel";
import VabQueryForm from "@/vab/components/VabQueryForm";
import {getVillage, getVillagecate} from "@/views/rural/api/country";
export default {
  name: "queryForm",
  data() {
    return {
      queryForm:{},
      cateData:[],
      villData:[]
    }
  },
  props:['country','cate','tabname','town'],
  components: {VabQueryFormLeftPanel, VabQueryForm},
  mounted() {
    this.getCate()
    this.getVillage()
  },
  methods: {
    async getCate(){
      let res = await getVillagecate()
      if(res.code === 200){
        this.cateData = res.data
      }
    },
    async getVillage(){
      let res = await getVillage()
      if(res.code === 200){
        this.villData = res.data
      }
    },
    queryClick(){
      this.$emit('queryClick',this.queryForm)
    },
    addClick(){
      this.$emit('addClick')
    },
    addcateClick(){
      this.$emit('addcateClick')
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
      width:auto!important;
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
