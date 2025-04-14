<!--
 * @Author: xybx
 * @Date: 2022-08-13 17:28:06
 * @LastEditTime: 2022-08-13 18:40:52
 * @LastEditors: xybx
 * @Description: WEB OR VUE Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
<div class="gridlog">
  <el-dialog :visible.sync="dialogGrid" title="选择网格区域" top="0" :modal="false" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form :model="gridForm" ref="gridForm" :rules="gridrule">
      <el-form-item label="网格等级" prop="WGDJ">
        <el-select v-model="gridForm.WGDJ" placeholder="请选择网格等级" clearable @change="villClick">
          <el-option label="一级网格" :value="1"></el-option>
          <el-option label="二级网格" :value="2"></el-option>
          <el-option label="三级网格" :value="3"></el-option>
          <el-option label="微级网格" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="网格名称" prop="WGMC" v-if="gridForm.WGDJ">
        <el-select v-model="gridForm.WGMC" placeholder="请选择网格名称" clearable>
          <el-option v-for="item in villdata" :key="item.pid" :label="item.areaname" :value="item.areaname"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveData">确定</el-button>
        <el-button type="-" @click="handleclose">取消</el-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
import {getLevelList} from "@/views/board/api/grid";
import {getMenuUrl} from "@/views/numtask/api/spetask";
import { mapGetters } from 'vuex'
import userconfig from '@/utils/userconfig.js'
import { DrawGrid } from '@/utils/arcgis_map'
export default {
  data(){
    return {
      gridForm:{},
      villdata:[],
      gridrule: {
        WGDJ:[],
        WGMC:[]
      },
      furl: '',
      dialogGrid:false
    }
  },
  components:{},
  computed:{
    ...mapGetters({
      userData: 'user/userData',
    }),
  },
  created(){},
  mounted(){
    this.getGridUrl()
  },
  methods:{
    showEdit(val){
      this.dialogGrid = val
    },
    async getGridUrl() {
      let json = await getMenuUrl({ typeid: 10 })
      this.furl = json.data
    },
    async getVillage(val){
      let {data} = await getLevelList({level: val, pagenumber: 1, pagesize: 9000})
      this.villdata =  data.list.length > 0 ? data.list.map((item) => {
          return {
            pid: item.pid,
            areaname: item.gridareaname,
          }
        }) : []
    },
    villClick(val){
      this.getVillage(val)
    },
    closeClick(){
      this.gridForm = this.$options.data().gridForm
    },
    saveData(){
      this.$refs.gridForm.validate((valid)=>{
        if(valid){
          userconfig.wg = {WGDJ: this.gridForm.WGDJ, wgmc: this.gridForm.WGMC}
          this.handleclose()
          DrawGrid(this.furl, this.userData.username, this.userData.areaname)
        }else {
          return false
        }
      })
    },
    handleclose(){
      this.dialogGrid = false
      this.gridForm = this.$options.data().gridForm
      this.$emit('gridClose')
    },
  }
}
</script>
<style lang="scss" scoped>
.el-dialog__wrapper {
  position: absolute;
  top: 90px;
  width: 30%;
  left: 19%;
  right: inherit;
  bottom: inherit;
  background: rgba(0, 0, 0, 0.6);
  //z-index:2009!important;
  ::v-deep {
    .el-dialog {
      margin: 0;
      width: auto;
      background: rgba(2, 30, 65, 0.8);
      .el-dialog__header {
        background: rgba(16, 97, 159, 0.6);
        .el-dialog__title {
          color: #fff;
        }
        .el-dialog__headerbtn .el-dialog__close {
          color: #fff;
        }
      }
      .el-dialog__body {
        padding: 10px 15px;
        .el-form {
          .el-form-item {
            .el-form-item__label {
              color: #4997d6;
            }
            .el-input,
            .el-select,
            .el-textarea,
            .el-cascader {
              width: 100%;
              .el-input--small .el-input__inner {
                height: 38px;
                line-height: 38px;
                background: none;
                border-color: #216da9;
                color: #fff;
              }
            }
          }
          .linebox {
            display: flex;
            flex-direction: row;
            align-items: center;
            .el-form-item {
              &:nth-child(1) {
                width: 38%;
              }
              &:nth-child(2) {
                width: 20%;
                margin-left: 10px;
              }
              &:nth-child(3) {
                width: 22%;
                margin-left: 10px;
                .el-input--small .el-input__inner {
                  height: 38px;
                  line-height: 38px;
                  background: none;
                  border-color: #216da9;
                  color: #fff;
                }
              }
              &:nth-child(4) {
                margin-bottom: 0;
                .el-form-item__content {
                  i {
                    color: #fff;
                    font-size: 30px;
                    cursor: pointer;
                    margin-left: 10px;
                    position: relative;
                    top: -3px;
                  }
                }
              }
              .el-input,
              .el-select {
                width: 100%;
              }
            }
          }
        }
      }
      .el-dialog__footer {
        padding: 10px;
        .el-button {
          padding: 10px 20px;
          font-size: 15px;
          background-color: #216da9;
          border-color: #216da9;
          color: #fff;
        }
      }
    }
  }
}
</style>
