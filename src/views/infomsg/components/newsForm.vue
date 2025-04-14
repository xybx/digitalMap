<template>
  <div class="query-container">
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
          <template v-if="cnews">
            <el-form-item label="资讯标题">
              <el-input v-model="queryForm.newsname" placeholder="请输入新闻标题" clearable/>
            </el-form-item>
            <el-form-item label="资讯类别">
              <el-select v-model="queryForm.typeid" placeholder="请选择新闻类别" clearable @change="typeChange">
                <el-option v-for="item in cateData" :key="item.pid" :value="item.pid" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="类别名称">
              <el-input v-model="queryForm.newsname" placeholder="请输入类别名称" clearable/>
            </el-form-item>
          </template>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="queryClick">查询</el-button>
            <el-button v-if="!look" icon="el-icon-plus" type="success" @click="addClick">添加</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>
  </div>
</template>

<script>
import VabQueryForm from "@/vab/components/VabQueryForm";
import VabQueryFormLeftPanel from "@/vab/components/VabQueryForm/components/VabQueryFormLeftPanel";
import { mapGetters} from 'vuex';
import {getNcateList} from '../api/news'
export default {
  name: "newsForm",
  props:['cnews','look'],
  data() {
    return {
      queryForm:{},
      cateData:[],
    }
  },
  components: {
    VabQueryFormLeftPanel, VabQueryForm
  },
  computed: {
    ...mapGetters({
      userData:'user/userData'
    })
  },
  created() {
  },
  mounted() {
    this.getCate()
  },
  methods: {
    async getCate(){
      let data = {
        pagenumber:1,
        pagesize:9000,
        uid:this.userData.pid
      }
      let res = await getNcateList(data)
      if(res.code === 200){
        this.cateData = res.data
      }
    },
    queryClick(){
      this.$emit('queryClick',this.queryForm)
    },
    addClick(){
      this.$emit('addClick')
    },
    typeChange(val){
      this.queryForm.typeid = val
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
