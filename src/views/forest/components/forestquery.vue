<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2023/4/7
 * @LastEditors: 12390
 * @LastEditTime: 2023/4/7
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="firequery">
    <vab-query-form>
      <vab-query-form-left-panel :span="24">
        <el-form :inline="true" ref="queryForm" :model="queryForm" @submit.native.prevent>
          <el-form-item label="类型名称" v-if="frule == 'codefth'">
            <el-input v-model="queryForm.keyWord" placeholder="请输入类型名称" clearable/>
          </el-form-item>
          <el-form-item label="事项名称" v-if="frule == 'codevth'">
            <el-input v-model="queryForm.mattername" placeholder="请输入事项名称" clearable/>
          </el-form-item>
          <template v-if="frule == 'codest'">
            <el-form-item label="所属镇">
              <el-select v-model="queryForm.villageId" @change="changeOption" filterable placeholder="请选择所属镇" clearable>
                <el-option v-for="item in villdata" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属村居">
              <el-select v-model="queryForm.countryId" filterable placeholder="请选择所属村居" clearable>
                <el-option v-for="item in countryList" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="场所名称">
              <el-input v-model="queryForm.keyWord" placeholder="请输入场所名称" clearable/>
            </el-form-item>
          </template>
          <template v-if="frule == 'codend'">
            <el-form-item label="所属镇">
              <el-select v-model="queryForm.areaid" @change="changeOption" filterable placeholder="请选择所属镇" clearable>
                <el-option v-for="item in villdata" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属村居">
              <el-select v-model="queryForm.countryId" filterable placeholder="请选择所属村居" clearable>
                <el-option v-for="item in countryList" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
              </el-select>
            </el-form-item>
          </template>
          <template v-if="frule == 'codeth'">
            <el-form-item label="所属镇" v-if="frule == 'codeth'">
              <el-select v-model="queryForm.areaid" @change="changeOption" filterable placeholder="请选择所属镇" clearable>
                <el-option v-for="item in villdata" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="村居" v-if="frule == 'codeth'">
              <el-select v-model="queryForm.countryId" filterable placeholder="请选择所属村居" clearable>
                <el-option v-for="item in countryList" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
              </el-select>
            </el-form-item>
          </template>
          <el-form-item :label="level == 2 ? '场所类别' :'区级场所类别'" v-if="frule == 'codeth' || frule == 'codest'">
              <el-select v-model="queryForm.typeId" filterable placeholder="请选择场所类别" clearable>
                <el-option v-for="item in typeList" :key="item.pid" :value="item.pid" :label="item.name"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="镇街场所类别" v-if="(frule == 'codeth' || frule == 'codest') && level!==2">
              <el-select v-model="queryForm.vtypeId" filterable placeholder="请选择场所类别" clearable>
                <el-option v-for="item in typeVageList" :key="item.pid" :value="item.pid" :label="item.name"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="场所名称" v-if="frule == 'codeth'">
            <el-input v-model="queryForm.placename" placeholder="请输入场所名称" clearable/>
          </el-form-item>
          <el-form-item label="姓名" v-if="frule == 'codend' ||frule == 'codeth'">
            <el-input v-model="queryForm.username" placeholder="请输入姓名" clearable/>
          </el-form-item>
          <el-form-item label="身份证号" v-if="frule == 'codend'">
            <el-input v-model="queryForm.memberid" placeholder="请输入身份证号" clearable/>
          </el-form-item>
          <el-form-item label="开始时间" v-if="frule == 'codeth'">
            <el-date-picker v-model="queryForm.starttime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" v-if="frule == 'codeth'">
            <el-date-picker v-model="queryForm.endtime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束时间" clearable></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" size="small" @click="queryClick">查询</el-button>
            <el-button v-if="frule!== 'codeth'" icon="el-icon-circle-plus-outline" type="success" plain size="small" @click="addClick">{{frule == 'codefth' ? '添加场所码类别' : frule == 'codevth' ? '添加登记事项': '新增'}}</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-left-panel>
    </vab-query-form>
  </div>
</template>

<script>
import VabQueryForm from "@/vab/components/VabQueryForm/index.vue";
import VabQueryFormLeftPanel from "@/vab/components/VabQueryForm/components/VabQueryFormLeftPanel.vue";
import {
  getArea,
  getAreaLevel,
  getAreaLevelChild,
  queryPlaceTypeList,
  queryPlaceTypeVageList
} from "@/views/forest/api/forest-api";
import {mapGetters} from "vuex";
export default {
  name: 'firequery',
  data() {
    return {
      queryForm:{},
      villdata:[],
      countryList:[],
      typeList:[],
      typeVageList:[]
    }
  },
  props:['frule'],
  components: {VabQueryFormLeftPanel, VabQueryForm},
  computed: {...mapGetters({
      userData:'user/userData',
      backData:'user/backData',
      routers:'routes/routes',
      level:'user/level'
    }),},
  created() {
  },
  mounted() {
    this.getVillageLevel();
    this.getType()
    if(this.level !== 2){
      this.getVillageType()
    }
    this.countryList = [];
  },
  methods: {
    async getVillage(){
      let res = await getArea()
      this.villdata = res.data ? res.data : []
    },
    async getType(){
      let res = await queryPlaceTypeList()
      this.typeList = res.data ? res.data : [];
    },
    async getVillageType(){
      let res = await queryPlaceTypeVageList()
      this.typeVageList = res.data ? res.data : [];
    },
    async getVillageLevel(){
      if (this.level == 2) {
        let res = await getAreaLevel({level: 3});
        if (res.code == 200) {
          this.villdata = res.data;
        }
      } else {
        let town = {
          areaname: this.userData.areaname,
          pid: this.userData.areaid
        }
        this.villdata.push(town)
        getAreaLevel({level:4}).then(res => {
          if (res.code == 200) {
            this.countryList = res.data ? res.data : []
          }
        })
      }


    },
    changeOption(val) {
      let params4 = {
        level: 4,
        parentId: val
      }
      getAreaLevelChild(params4).then(res => {
        if (res.code == 200) {
          this.countryList = res.data ? res.data : []
        }
      })
    },
    queryClick(){
      this.$emit('queryClick',this.queryForm)
    },
    addClick(){
      this.$emit('addClick')
    },
    clearform(){
      this.queryForm = this.$options.data().queryForm
    }
  }
}
</script>

<style lang="scss" scoped>
.firequery{
  ::v-deep{
    .el-form{
      .el-form-item{
        margin-left: 15px!important;
        &:first-child{
          margin-left: 0!important;
        }
        .el-input,.el-select{
          width:160px;
        }
      }
    }
  }
}
</style>
