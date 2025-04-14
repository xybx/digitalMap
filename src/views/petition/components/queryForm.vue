<template>
  <div class="query">
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
            <el-form-item label="主要诉求">
              <el-input v-model="queryForm.appeal" placeholder="请输入主要诉求" clearable/>
            </el-form-item>
            <el-form-item label="信访人">
              <el-input v-model="queryForm.petitionername" placeholder="请输入信访人" clearable/>
            </el-form-item>
            <el-form-item label="问题属地">
              <el-input v-model="queryForm.villagename" placeholder="请输入问题属地" clearable/>
            </el-form-item>
            <el-form-item label="信访时间">
              <el-date-picker v-model="queryForm.date" type="date" value-format="yyyy-MM-dd" placeholder="请选择信访时间" :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
            <el-form-item label="信访目的">
              <el-select v-model="queryForm.goal">
                <el-option v-for="item in goalData" :key="item.pid" :label="item.typename" :value="item.pid"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" type="danger" @click="queryClick">查询</el-button>
            </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>
  </div>
</template>

<script>
import VabQueryFormLeftPanel from "@/vab/components/VabQueryForm/components/VabQueryFormLeftPanel";
import VabQueryForm from "@/vab/components/VabQueryForm";
import {getAimList} from '../api/petion'
export default {
  name: "queryForm",
  data() {
    return {
      queryForm:{
        appeal:'',
        petitionername:'',
        villagename:'',
        date:'',
      },
      goalData:[],
      pickerOptions:{
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      }
    }
  },
  components: {VabQueryFormLeftPanel, VabQueryForm},
  mounted() {
    this.getgoal()
  },
  methods: {
    async getgoal(){
      let res = await getAimList()
      if(res.code == 200){
        this.goalData = res.data
      }
    },
    queryClick(){
      this.$emit('queryClick',this.queryForm)
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
        .el-input{
          .el-input__inner:focus{
            border-color:red;
          }
        }
      }
    }
  }
}
</style>
