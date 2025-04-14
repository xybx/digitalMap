<template>
  <div class="index-container">
    <el-container>
      <el-main>
        <oneMap ref="onemaps"/>
      </el-main>
    </el-container>
    <el-dialog
      :visible.sync="dialogVisible"
      class="arcdialog"
      v-dialog-drag="true"
      :before-close="handleClose"
      :append-to-body="true"
      :modal="false"
      :lock-scroll="false"
      center
    >
      <span slot="title" class="header-title">
        <template v-if="namelist.length > 1">
          <el-select v-model="nameTit" @change="nameClick">
            <el-option
              v-for="item in namelist"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
          {{ `(${namelist.length})` }}
        </template>
        <template v-else-if="namelist.length === 1">
          {{ namelist[0].name }}
        </template>
      </span>
      <el-table :data="tableData" border max-height="400px" tooltip-effect="dark">
        <el-table-column
          v-for="item in tableList"
          :key="item.prop"
          align="center"
          width="150px"
        >
          <template v-slot="scope">
            <el-button type="text" v-if="scope.row[item.prop] === '查看'" @click="lookClick(scope.row.type,scope.row.t_index)">查看</el-button>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <conven ref="conven"/>
    <patrol ref="patrol"/>
    <resident ref="resident"/>
    <enviroment ref="envlog"/>
  </div>
</template>

<script>
import oneMap from '../components/oneMap'
import conven from "../components/conven";
import patrol from "../components/patrol";
import resident from "../components/resident";
import enviroment from "../components/enviroment";
export default {
  name: 'Index',
  data() {
    return {
      dialogVisible:false,
      tableData: [],
      tableList: [],
      nameTit: '',
      namelist: [],
      inerdialogVisible: false,
      inertitle: '',
      formData: {},
      imgdata: [],
      urldata: [],
      objarr: [],
    }
  },
  components: {
    oneMap,
    conven,
    patrol,
    resident,
    enviroment
  },
  mounted() {
    window.mapDialog = this.mapDialog
    window.formDialog = this.formDialog
  },
  methods: {
    mapDialog(obj) {
      this.objarr = obj
      this.dialogVisible = true
      this.nameTit = obj[0].name
      this.tableList = obj[0].tableColumnList
      this.tableData = obj[0].dataList.filter(item=>{
        return item.t_index != 'Null'
      })
      this.namelist = obj.map((item) => {
        return {
          name: item.name,
          value: item.id,
        }
      })
      console.log(obj)
    },
    nameClick(val) {
      this.nameTit = val
      for (var i = 0; i < this.objarr.length; i++) {
        if (this.objarr[i].id == val) {
          this.nameTit = this.objarr[i].name
          this.tableList = this.objarr[i].tableColumnList
          this.tableData = this.objarr[i].dataList
        }
      }
    },
    lookClick(type,id) {
      let url
      if (type.indexOf('物联网') >= 0) {
        if(id){
          url = this.$router.resolve({
            path: '/sindex',
            query:{id:id} //传值
          })
          window.open(url.href, '_blank')
        }else{
          this.$message.warning('暂不能查看')
          return false;
        }
      }else if(type.indexOf('随手拍') >= 0){
          this.$refs.conven.showEdit(id)
      }else if(type.indexOf('巡查') >= 0){
          this.$refs.patrol.showEdit(id)
      }else if(type.indexOf('居民') >= 0  || type.indexOf('家庭') >= 0 || type.indexOf('农田') >= 0){
        this.$refs.resident.showEdit(id)
      }else if(type.indexOf('人居环境') >= 0){
        this.$refs.envlog.showEdit(id)
      }
    },
    formDialog(obj) {
      this.formData = obj
      this.inertitle = '随手拍详情'
      this.inerdialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleinerClose() {
      this.inerdialogVisible = false
    },
  },
}
</script>

<style lang="scss" scoped>
.index-container{
  padding: 0!important;
  min-height: calc(100vh - 80px)!important;
  .el-container{
    position: absolute;
    bottom: 0;
    top: -1px;
    left: 0;
    right: 0;
    .el-main{
      padding: 0;
      color: #333;
      background-color: #f3f3f3;
      //background: url('~@/assets/demo.jpg') no-repeat center;
      //background-size: 100% 100%;
      position: relative;
      overflow: hidden;
      //.esri-view .esri-view-surface--inset-outline::after {
      //  outline: none !important
      //}
      //.layui-nav-more {
      //  display: none;
      //}
    }
  }
}
</style>
