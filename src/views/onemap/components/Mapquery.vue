<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/7/20
 * @LastEditors: 12390
 * @LastEditTime: 2022/7/20
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="mapquery">
    <el-dialog :visible.sync="dialogVisible" title="查询定位" top="0" :modal="false" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
      <el-form :model="searchForm" ref="searchForm">
        <el-form-item label="图层选择" prop="region" label-width="80px" :rules="{required: true,message: '选择不能为空',trigger: 'change',type:'number'}">
          <el-select v-model="searchForm.region" placeholder="请选择图层" @change="layerChange">
            <el-option v-for="item in layData" :key="item.layername" :label="item.layername" :value="item.pid"></el-option>
          </el-select>
        </el-form-item>
        <template v-if="searchForm.region">
          <div v-for="(item,index) in searchForm.mainData" :key="index" class="linebox">
            <el-form-item label="属性选择" :prop="'mainData.' + index + '.selVal'" :rules="{required: true,message: '选择不能为空',trigger: 'change'}" label-width="80px">
              <el-select v-model="item.selVal" collapse-tags placeholder="请选择" @change="typeChange">
                <el-option v-for="val in attrData" :key="val.fieldname" :label="val.displayname" :value="val.fieldname"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :prop="'mainData.' + index + '.conVal'" :rules="{required: true,message: '选择不能为空',trigger: 'change'}">
              <el-select v-model="item.conVal" collapse-tags placeholder="请选择">
                <el-option v-for="(val,key) in tagData" :key="key" :label="val.label" :value="val.tags"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :prop="'mainData.' + index + '.value'" :rules="{required: true,message: '输入不能为空',trigger: 'blur'}">
              <el-input v-model="item.value" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item>
              <i v-if="searchForm.mainData.length==(index+1)" class="el-icon-circle-plus icon_add" @click="pushClick(searchForm.mainData)"></i>
              <i v-if="index==0 ? false:searchForm.mainData.length == (index+1)" class="el-icon-remove icon_remove" @click="delClick(searchForm.mainData)"></i>
            </el-form-item>
          </div>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveData">查询</el-button>
        <el-button type="-" @click="resetForm">重置</el-button>
      </span>
    </el-dialog>
    <!-- 结果弹出框 -->
    <el-drawer ref="drawer" :visible.sync="drawer" title="查询结果" direction="btt" :modal="false" :wrapperClosable="false">
        <el-table :data="tableData" border highlight-current-row @row-click="CurrentTabChange">
          <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
          <el-table-column v-for="item in resCols" :key="item.pid" :prop="item.fieldname" :label="item.fielddesc" align="center"></el-table-column>
        </el-table>
        <el-pagination :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
    </el-drawer>
  </div>
</template>

<script>
import * as query from "@arcgis/core/rest/query";
import Query from "@arcgis/core/rest/support/Query";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import WebTileLayer from "@arcgis/core/layers/WebTileLayer";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import * as projection from "@arcgis/core/geometry/projection";
import {getLayersOption} from '../api/mapApi'
import userconfig from '@/utils/userconfig.js'
import {getlayers} from "@/utils/arcgis_map";
export default {
  name: 'Mapquery',
  props:['dialogVisible'],
  data() {
    return {
      searchForm:{
        mainData:[{selVal: '',conVal: '',value: ''}]
      },
      layData:[],
      attrData:[],
      tagData:[],
      tableData:[],
      resultData:[],
      resCols:[],
      layout: "total, sizes, prev, pager, next",
      total: 0,
      pageNo:1,
      pageSize: 0,
      pageSizes: [3, 5, 8],
      drawer:false,
      Turl:'',
      currentRow: null,
    }
  },
  components: {},
  computed: {},
  created() {
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
    this.getTuCeng()
    // this.getCondition()
  },
  methods: {
    getCondition(str){
      let arr = str == 'string' ?  [{label:'包含',tags:'like'},{label:'不包含',tags:'not like'}] :[{label:'等于',tags:'='}, {label:'不等于',tags:'!='}, {label:'大于',tags:'>'}, {label:'小于',tags:'<'}]
      this.tagData = arr
    },
    //获取选择条件
    async getTuCeng() {
      let { data } = await getLayersOption({ type: 0 })
      this.layData = data ? data : []
    },
    layerChange(val){
      this.searchForm.region = val
      this.attrData = this.layData.filter(item => item.pid == val)[0].fields
      this.Turl = this.layData.filter(item => item.pid == val)[0].layerurl
      this.resCols = this.layData.filter(item => item.pid == val)[0].resultfields.map(val => {
        val.fieldname = val.fieldname.toUpperCase()
        return val
      })
    },
    typeChange(val){
      let type = this.attrData.filter(item=> item.fieldname == val)[0].fieldtype
      this.getCondition(type)
    },
    pushClick(arr){
      arr.push({})
      this.$forceUpdate()
    },
    delClick(arr){
      arr.pop({})
      this.$forceUpdate()
    },
    saveData() {
      let app = this
      let arr = this.searchForm.mainData
      this.$refs.searchForm.validate(async (valid)=>{
        if (valid) {
          let queryParams = new Query({
            where: '1=1',
            outFields: ['*'],
            returnGeometry: true,
          })
          arr.map((item) => {
            queryParams.where += item.conVal == 'like' ? ` and ${item.selVal} ${item.conVal} '%${item.value}%'` : ` and not ${item.selVal} like '${item.value}'`
          })
          const res = await query.executeQueryJSON(app.Turl, queryParams)
          app.drawer = true
          app.resultData = res.features.length > 0 ? res.features.map((item) => {return item.attributes}) : []
          app.total = app.resultData.length
          app.tableData = app.resultData.slice(0, app.pageSize)
          if (res.features.length == 0) app.$message.warning('没有查询到数据')
        } else {
          return false
        }
      })
    },
    resetForm(){
      this.searchForm = this.$options.data().searchForm
      this.$refs.searchForm.resetFields()
      this.drawer = false
    },
    handleClose(){
      this.$emit('handleClose')
    },
    closeClick(){
      this.searchForm = this.$options.data().searchForm
      this.drawer = false
    },
    SizeChange(val) {
      console.log(val)
      this.pageSize = val;
      this.tableData = this.resultData.slice((this.pageNo - 1) * val,this.pageNo * val)
    },
    CurrentChange(val) {
      this.pageNo = val;
      this.tableData = this.resultData.slice((val - 1) * this.pageSize,val * this.pageSize)
    },
    // 搜索框获取内容
    async CurrentTabChange(val) {
      this.currentRow = val
      var app = this
      let queryParams = new Query({
        where: '1=1',
        outFields: ['*'],
        returnGeometry: true,
      })
      queryParams.where += ` and OBJECTID = ${app.currentRow.OBJECTID}`
      const res = await query.executeQueryJSON(app.Turl, queryParams)

      let geo = res.features[0].geometry
      let symbols =
        geo.type == 'point'
          ? Object.assign(
            {},
            {
              type: 'simple-marker',
              color: 'red',
              size: 25,
              outline: { width: 0.5, color: 'darkblue' },
            }
          )
          : Object.assign(
            {},
            {
              type: 'simple-fill',
              color: [255, 255, 0, 0.2],
              style: 'solid',
              outline: { color: 'red', width: 2 },
            }
          )
      let graphic = new Graphic({
        geometry: geo,
        symbol: symbols,
      })
      userconfig.view.graphics.removeAll()
      userconfig.view.graphics.add(graphic)

      if (
        geo.spatialReference.wkid == 102100 ||
        geo.spatialReference.wkid == 3857
      ) {
        res.features[0].geometry.type == 'point'
          ? (userconfig.view.center = geo)
          : (userconfig.view.extent = res.features[0].geometry.extent)
        userconfig.view.scale = 5000
      } else {
        if (!geo.spatialReference.isGeographic) {
          let outSpatialReference = new SpatialReference({
            wkid: 4490,
          })
          projection.load().then(function () {
            geo = projection.project(geo, outSpatialReference)
            let center = geo.type == 'point' ? geo : geo.centrid
            userconfig.view.center = [center.longitude, center.latitude]
            userconfig.view.scale = 5000
          })
        } else {
          let center = geo.type == 'point' ? geo : geo.centrid
          userconfig.view.center = [center.longitude, center.latitude]
          userconfig.view.scale = 5000
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.mapquery{
  ::v-deep{
    .el-drawer__wrapper{
      position: absolute;
      top: inherit;
      height:34%;
      z-index: 1999!important;
      .el-drawer__container{
        background: rgba(0,0,0,.5);
        .el-drawer{
          height:100%!important;
          background: rgba(2, 30, 65, .8);
          .el-drawer__header{
            margin-bottom:0;
            padding:10px;
            font-size:16px;
            background:rgba(16, 97, 159, .6);
            color: #fff;
          }
          .el-drawer__body{
            padding:10px 15px;

            .el-table--border:after,
            .el-table--group:after,
            .el-table:before {
              background-color: #309ef3;
            }
            .el-table--border,
            .el-table--group {
              border-color: #309ef3;
            }
            .el-table{
              background:none;
              border-color: #309ef3;
              .el-table__header-wrapper th{
                background:rgba(16, 97, 159, .8);
                border-color:#309ef3;
                .cell{
                  color: #fff;
                }
              }
              .el-table__body-wrapper{
                border-color:#309ef3;
                tr{
                  background:none;
                  cursor: pointer;
                  td{
                    border-color: #309ef3;

                    .cell{
                      color: #5399ef;
                    }
                  }
                }
              }
            }
            .el-pagination{
              .el-pagination__total{
                color: #fff;
              }
              .el-pagination__sizes{
                .el-input .el-input__inner{
                  background:none;
                  color: #fff;
                }
              }
              .btn-prev,.btn-next{
                background:none;
                color: #fff;
              }
              .el-pager{
                li{
                  background:none;
                  color: #fff;
                  &.active{
                    color: #1890ff;
                  }
                }

              }
            }
          }
        }
      }
    }
  }
}
.el-dialog__wrapper{
  position:absolute;
  top:90px;
  width:30%;
  left:19%;
  right:inherit;
  bottom:inherit;
  background: rgba(0,0,0,.6);
  //z-index:2009!important;
  ::v-deep{
    .el-dialog{
      margin:0;
      width:auto;
      background: rgba(2, 30, 65, .8);
      .el-dialog__header{
        background:rgba(16, 97, 159, .6);
        .el-dialog__title{
          color: #fff;
        }
        .el-dialog__headerbtn .el-dialog__close{
          color:#fff;
        }
      }
      .el-dialog__body{
        padding:10px 15px;
        .el-form{
          .el-form-item{
            .el-form-item__label{
              color: #4997D6;
            }
            .el-input, .el-select,.el-textarea ,.el-cascader{
              width:100%;
              .el-input--small .el-input__inner{
                height: 38px;
                line-height: 38px;
                background: none;
                border-color:#216DA9;
                color: #fff;
              }
            }
          }
          .linebox{
            display: flex;
            flex-direction: row;
            align-items: center;
            .el-form-item{
              &:nth-child(1){
                width:38%;
              }
              &:nth-child(2){
                width:20%;
                margin-left:10px;
              }
              &:nth-child(3){
                width:22%;
                margin-left:10px;
                .el-input--small .el-input__inner{
                  height: 38px;
                  line-height: 38px;
                  background: none;
                  border-color:#216DA9;
                  color: #fff;
                }
              }
              &:nth-child(4){
                margin-bottom:0;
                .el-form-item__content{
                  i{
                    color: #fff;
                    font-size:30px;
                    cursor:pointer;
                    margin-left:10px;
                    position: relative;
                    top:-3px;
                  }
                }
              }
              .el-input,.el-select{
                width:100%;
              }
            }
          }
        }
      }
      .el-dialog__footer{
        padding:10px;
        .el-button{
          padding:10px 20px;
          font-size: 15px;
          background-color:#216DA9;
          border-color:#216DA9;
          color: #fff;
        }
      }
    }
  }

}
</style>
