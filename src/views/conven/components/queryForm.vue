<template>
    <div class="query-container">
      <vab-query-form>
        <vab-query-form-left-panel :span="24">
          <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
            <template v-if="userpage">
              <el-form-item label="用户姓名">
                <el-input v-model="queryForm.name" placeholder="请输入用户姓名" clearable/>
              </el-form-item>
            </template>
            <template v-if="manage">
              <el-form-item label="类型名称">
                <el-input v-model="queryForm.name" placeholder="请输入类型名称" clearable/>
              </el-form-item>
            </template>
            <template v-if="!userpage && !manage">
              <el-form-item label="事件描述">
                <el-input v-model="queryForm.repconten" placeholder="请输入事件描述" clearable/>
              </el-form-item>
              <el-form-item label="上传时间">
                <el-date-picker v-model="queryForm.startdate" type="date" value-format="yyyy-MM-dd" placeholder="请选择上传时间" :picker-options="pickerOptions"></el-date-picker>
              </el-form-item>
              <template v-if="done">
                <el-form-item label="状态">
                  <el-select v-model="queryForm.type" placeholder="请选择状态">
                    <el-option :value="1" label="办理中"></el-option>
                    <el-option :value="2" label="已办理"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </template>
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" @click="queryClick">查询</el-button>
              <el-button v-if="manage" icon="el-icon-circle-plus" type="success" @click="addClick">添加</el-button>
            </el-form-item>
          </el-form>
        </vab-query-form-left-panel>
      </vab-query-form>
    </div>
</template>

<script>
import VabQueryForm from "@/vab/components/VabQueryForm";
import VabQueryFormLeftPanel from "@/vab/components/VabQueryForm/components/VabQueryFormLeftPanel";
import {getAreaList} from '../api/conven';
import { mapGetters} from 'vuex';
export default {
    name: "queryForm",
    props:{
      userpage:Boolean,
      record:Boolean,
      done:Boolean,
      manage:Boolean
    },
    data() {
        return {
          queryForm:{},
          options:[],
          props:{
            checkStrictly: true,
            expandTrigger: 'hover',
            value: "id",
            label: "name",
            children: "child",
          },
          pickerOptions:{
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
          }
        }
    },
    components: {VabQueryFormLeftPanel, VabQueryForm},
    computed: {
      ...mapGetters({
        userData:'user/userData'
      })
    },
    created() {
    },
    mounted() {
      // this.getAreaList()
    },
    methods: {
      async getAreaList(){
        let params = {uid:this.userData.pid}
        let res = await getAreaList(params)
        this.options = res.data?.map(item=>{
          return {
            id:item.pid,
            name:item.areaname,
            child: item.children.map(val=>{
              return {
                id:val.pid,
                name:val.areaname,
                child:val.children ? val.children.map(v=>{
                  return {
                    id:v.pid,
                    name:v.areaname,
                  }
                }): ''
              }
            })
          }
        })
      },
      queryClick(){
        this.$emit('queryClick',this.queryForm)
      },
      addClick(){
        this.$emit('addClick')
      },
      selectChange(val){
        if(val.length > 1){
          this.queryForm.areaid = val.shift()
        }else{
          this.queryForm.areaid = val;
        }
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
        &:first-child{
          margin-left: 0!important;
        }
      }
    }
  }
}
</style>
