<template>
    <div class="query-container">
      <vab-query-form>
        <vab-query-form-left-panel :span="24">
          <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
            <template v-if="record || eindex">
              <el-form-item label="上报类型">
                <el-select v-model="queryForm.typename" placeholder="请选择上报类型" clearable @change="typeChange">
                  <el-option v-for="item in cateData" :key="item.pid" :value="item.typename" :label="item.typename"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="上报内容">
                <el-input v-model="queryForm.countent" placeholder="请输入上报内容" clearable/>
              </el-form-item>
            </template>
            <template v-if="cate">
              <el-form-item label="类型名称">
                <el-input v-model="queryForm.name" placeholder="请输入类型名称" clearable/>
              </el-form-item>
            </template>
            <template v-if="eindex">
              <el-form-item label="上报人员">
                <el-input v-model="queryForm.inspectorname" placeholder="请输入上报人员" clearable/>
              </el-form-item>
              <el-form-item label="村居名称">
                <el-input v-model="queryForm.villagename" placeholder="请输入村居名称" clearable/>
              </el-form-item>
              <el-form-item label="上报时间">
                <el-date-picker v-model="queryForm.date" type="date" value-format="yyyy-MM-dd" placeholder="请选择上报时间" clearable />
              </el-form-item>
            </template>
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" size="medium" @click="queryClick">查询</el-button>
              <el-button v-if="!cate" type="primary" icon="el-icon-upload2" plain size="medium" @click="exportClick">导出</el-button>
              <el-button v-if="cate" icon="el-icon-circle-plus-outline" type="success" size="medium" @click="addcateClick">新建类型</el-button>
            </el-form-item>
          </el-form>
        </vab-query-form-left-panel>
      </vab-query-form>
    </div>
</template>

<script>
import VabQueryForm from "@/vab/components/VabQueryForm";
import VabQueryFormLeftPanel from "@/vab/components/VabQueryForm/components/VabQueryFormLeftPanel";
import {getallrule} from "@/views/environment/api/envrule";
export default {
  name: "queryForm",
  props:['record','cate','eindex'],
  data() {
      return {
        queryForm:{},
        cateData:[],
      }
  },
  components: {VabQueryFormLeftPanel, VabQueryForm},
  created() {
      this.getCate()
  },
  methods: {
      async getCate(){
        let res = await getallrule()
        this.cateData = res.data ? res.data : []
      },
      queryClick(){
        this.$emit('queryClick',this.queryForm)
      },
      exportClick(){
        this.$emit('exportClick')
      },
      addcateClick(){
        this.$emit('addcateClick')
      },
      typeChange(val){
        this.queryForm.typename = val
      },
    }
}
</script>

<style lang="scss" scoped>
.query-container{
  ::v-deep{
    .el-form{
      width:auto!important;
      .el-form-item{
        margin-left:15px!important;
        &:first-child,&:nth-child(5){
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
