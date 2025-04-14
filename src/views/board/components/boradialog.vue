<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/7/31
 * @LastEditors: 12390
 * @LastEditTime: 2022/7/31
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="70%" top="2%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
     <el-container>
       <el-aside>
         <ul class="alist">
            <li v-for="(item,index) in sideData" :class="{active: index+1 == sortIsActive}" @click="rClick(index+1)">{{item}}</li>
         </ul>
       </el-aside>
       <el-main>
         <titlebox ref="tbox" v-if="sortIsActive ==1" @handleClose="handleClose" />
         <areabox ref="abox" v-else-if="sortIsActive ==2" />
         <tablegrid ref="tgrid" v-else />
       </el-main>
     </el-container>
  </el-dialog>
</template>

<script>
import titlebox from "./titlebox";
import areabox from './areabox'
import tablegrid from './tablegrid'
export default {
  name: 'boradialog',
  data() {
    return {
      dialogVisible:false,
      title:'',
      sideData:[],
      sortIsActive:1,
    }
  },
  components: {
    titlebox,
    areabox,
    tablegrid,
  },
  computed: {},
  created() {
  },
  mounted() {
    this.getSide()
  },
  methods: {
    getSide(){
      this.sideData = ['标题和地图配置','网格区域配置','一级网格','二级网格','三级网格','微级网格']
    },
    rClick(i){
      this.sortIsActive = i == this.sortIsActive ? null : i
      if(i == 1){
        this.$nextTick(()=>{
          this.$refs.tbox.getInfo()
        })
      }else if(i == 2){
        this.$nextTick(()=>{
          this.$refs.abox.getAreaData()
        })
      } else {
        this.$nextTick(()=>{
          this.$refs.tgrid.getTableList(i)
        })
      }
    },
    showBopen(){
      this.title = '数据配置'
      this.dialogVisible = true
      this.$nextTick(()=>{
        this.$refs.tbox.getInfo()
      })
    },
    handleClose(){
      this.title = ''
      this.sortIsActive = 1
      this.dialogVisible = false
    },
  }
}
</script>

<style lang="scss" scoped>
@import '../style/dialog.scss';
</style>
