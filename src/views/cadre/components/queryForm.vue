<template>
    <div class="query-container">
      <vab-query-form>
        <vab-query-form-left-panel :span="24">
          <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
            <el-form-item label="单位名称">
              <el-input v-model="queryForm.officename" placeholder="请输入单位名称" clearable/>
            </el-form-item>
            <el-form-item label="干部姓名">
              <el-input v-model="queryForm.panniername" placeholder="请输入干部姓名" clearable/>
            </el-form-item>
            <template v-if="tcard == 'mass'">
              <el-form-item label="系统比对情况">
                <el-select v-model="queryForm.checkresult" placeholder="请选择系统比对情况" clearable>
                  <el-option :value="0" label="待审核"></el-option>
                  <el-option :value="1" label="正常"></el-option>
                  <el-option :value="2" label="新增"></el-option>
                  <el-option :value="3" label="手机与姓名不一致"></el-option>
                  <el-option :value="4" label="空号或外地号码"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="核验结果">
                <el-select v-model="queryForm.checkstate" placeholder="请选择核验结果" clearable>
                  <el-option :value="1" label="待审"></el-option>
                  <el-option :value="2" label="已审核"></el-option>
                  <el-option :value="3" label="系统自动审核"></el-option>
                  <el-option :value="4" label="未通过"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <template v-if="tcard == 'cadre'">
              <el-form-item label="所属区域" v-if="level ==2">
                <el-select v-model="queryForm.areaid" placeholder="请选择系统比对情况" clearable>
                  <el-option v-for="item in areaData" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="完成情况">
                <el-select v-model="queryForm.donestate" placeholder="请选择完成情况" clearable>
                  <el-option :value="0" label="未完成"></el-option>
                  <el-option :value="1" label="已完成"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" size="medium" @click="queryClick">查询</el-button>
              <el-button v-if="level == 2&&tcard == 'mass'&&userData.sitemanager == 1" type="primary" plain size="medium" @click="exportClick">导出</el-button>
            </el-form-item>
          </el-form>
        </vab-query-form-left-panel>
      </vab-query-form>
    </div>
</template>

<script>
import VabQueryForm from "@/vab/components/VabQueryForm";
import VabQueryFormLeftPanel from "@/vab/components/VabQueryForm/components/VabQueryFormLeftPanel";
import {mapGetters} from "vuex";
import {getareaList} from "@/views/cadre/api/cadre";
export default {
  name: "queryForm",
  props:['tcard'],
  data() {
      return {
        queryForm:{},
        areaData:[]
      }
  },
  components: {
      VabQueryFormLeftPanel,
      VabQueryForm
  },
  computed:{
    ...mapGetters({
      level:'user/level',
      userData:'user/userData'
    })
  },
  mounted() {
    this.getArea()
  },
  methods: {
      async getArea(){
        let res = await getareaList()
        this.areaData = res.data ? res.data : []
      },
      queryClick(){
        this.$emit('queryClick',this.queryForm)
      },
      exportClick(){
        this.$emit('exportClick')
      },
      clearClick(){
        this.queryForm = this.$options.data().queryForm
      },
    }
}
</script>

<style lang="scss" scoped>
.query-container{
  ::v-deep{
    .el-form{
      .el-form-item{
        margin-left: 15px!important;
        &:first-child,&:nth-child(4){
          margin-left: 0!important;
        }
        .el-input,.el-select{
          width: 240px;
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
