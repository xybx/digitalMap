<template>
  <div class="queryForm">
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent label-width="80px">
          <el-form-item label="姓名">
            <el-input v-model="queryForm.username" placeholder="请输入姓名"/>
          </el-form-item>
          <el-form-item label="身份证">
            <el-input v-model="queryForm.cardid" placeholder="请输入身份证" maxlength="18"/>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="queryForm.phone" placeholder="请输入手机号" maxlength="11"/>
          </el-form-item>
          <el-form-item label="是否党员">
            <el-select v-model="queryForm.party" placeholder="请选择是否党员">
              <el-option :value="0" label="否"></el-option>
              <el-option :value="1" label="是"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否贫困户">
            <el-select v-model="queryForm.poverty" placeholder="请选择是否贫困户">
              <el-option :value="0" label="否"></el-option>
              <el-option :value="1" label="是"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出生年月">
            <el-date-picker v-model="queryForm.date" type="date" value-format="yyyy-MM-dd" placeholder="请选择出生年月" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="查询类型">
            <el-select v-model="queryForm.searchtype" placeholder="请选择查询类型">
              <el-option :value="1" label="按人查询" checked></el-option>
              <el-option :value="2" label="按户查询"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="户编号">
            <el-input v-model="queryForm.familyid" placeholder="请输入户编号"/>
          </el-form-item>
          <el-form-item label="文化程度">
            <el-select v-model="queryForm.educationlevel" placeholder="请选择文化程度">
              <el-option v-for="item in eduData" :key="item.dicid" :value="item.dicid" :label="item.dicname"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" size="medium" @click="queryClick">查询</el-button>
            <el-button icon="el-icon-refresh-left" type="danger" plain size="medium" @click="resetClick">重置</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>
  </div>
</template>

<script>
import VabQueryFormLeftPanel from "@/vab/components/VabQueryForm/components/VabQueryFormLeftPanel";
import VabQueryForm from "@/vab/components/VabQueryForm";
import {getDictionaryList} from '../api/levrest'
export default {
  name: "queryForm",
  data() {
    return {
      queryForm:{
        searchtype:1,
      },
      eduData:[]
    }
  },
  components: {VabQueryFormLeftPanel, VabQueryForm},
  computed: {},
  created() {
  },
  mounted() {
    this.geteducate()
  },
  methods: {
    async geteducate(){
      let res = await getDictionaryList({dictypeid:2})
      if(res.code == 200){
        this.eduData = res.data
      }
    },
    queryClick(){
      this.$emit('queryClick',this.queryForm)
    },
    resetClick(){
      this.queryForm = this.$options.data().queryForm
      this.$emit('resetClick',this.$options.data().queryForm)
    },
  }
}
</script>

<style lang="scss" scoped>
.queryForm{
  ::v-deep{
    .el-form{
      .el-form-item{
        margin-left: 15px!important;
        margin-bottom: 15px!important;
        &:first-child,&:nth-child(6){
          margin-left: 0!important;
        }
        .el-input,.el-select{
          width: 220px;
        }
        .el-input--small .el-input__inner{
          height:36px;
          line-height:36px;
        }
      }
    }
  }
}
</style>
