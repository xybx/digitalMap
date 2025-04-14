<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/7/22
 * @LastEditors: xybx
 * @LastEditTime: 2022-08-13 19:35:44
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="gridIndex">
    <el-container>
      <el-main>
        <div class="header">
          <el-row>
            <el-col :span="9">
              <h3>{{ message }}</h3>
              <el-button type="primary" class="menubtn animate__animated animate__bounceInDown" @click="backClick">返回主菜单</el-button>
            </el-col>
            <el-col :span="15">
              <ul class="gblist">
                <li v-for="(item, index) in navData" :key="index" :class="{active: index + 1 == sortIsActive }" @click="showborad(index + 1)">
                  <i class="icon iconfont icon-shujudaping"></i>
                  <span>{{ item }}</span>
                </li>
              </ul>
              <div class="dropbox" @click="dropClick">
                <i class="icon iconfont icon-yonghu"></i>
                <span>管理</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="leftmain">
          <personType :showset="showset"/>
          <personTotal :showset="showset"/>
          <personAge :showset="showset"/>
          <genderOver :showset="showset"/>
          <eventView :showset="showset"/>
        </div>
        <div class="rightmain">
            <div class="rtitbox">网格治理情况</div>
            <overInfo ref="overinfo" :showsort="sortIsActive"  v-if="sortIsActive" />
            <accountInfo ref="acountinfo" :showsort="sortIsActive" v-if="sortIsActive !=1" />
            <gridPower ref="gridpower" v-if="sortIsActive == 3 || sortIsActive == 4" />
        </div>
        <BoardMap />
      </el-main>
    </el-container>
    <boradialog ref="borad" />
  </div>
</template>

<script>
import BoardMap from '@/components/BoardMap';
import personType from './components/personType';
import personTotal from './components/personTotal';
import personAge from './components/personAge';
import genderOver from './components/genderOver';
import eventView from './components/eventView';
import overInfo from "./components/overInfo";
import accountInfo from "./components/accountInfo";
import gridPower from './components/gridPower';
import boradialog from "./components/boradialog";
import {getByArea, getlayers,getLevelinfo} from "./api/grid";
import userconfig from '@/utils/userconfig'
export default {
  name: 'gridIndex',
  data() {
    return {
      message: '兴隆镇网格化综合治理看板',
      navData:[],
      sortIsActive:1,
      showset:{},
    }
  },
  components: {
    BoardMap,
    personType,
    personTotal,
    personAge,
    genderOver,
    eventView,
    overInfo,
    accountInfo,
    gridPower,
    boradialog
  },
  computed: {},
  created() {
  },
  mounted() {
    this.getnav()
    window.getinfo = this.getmapInfo
  },
  methods: {
    async getnav(){
      let res = await getByArea()
      this.showset = res.data
      this.navData = ['一级网格','二级网格','三级网格','微级网格']
      this.getmapInfo(1,1)
    },
    async showborad(index) {
      this.sortIsActive = index == this.sortIsActive ? null : index
      let Murl = await getlayers({typeid:10+index})
      userconfig.wgid = Murl.data.url.slice(-1)
      const XLmapserver = userconfig.view.map.findLayerById('XLmapserver')
      const loadXLMap = await XLmapserver.loadAll()
      loadXLMap.sublayers.map((item) => {
        item.visible = item.id == userconfig.wgid ? true : false
      })
      let prr = [1,57,5,11]
      this.getmapInfo(prr[index-1],index)
    },
    async getmapInfo(pid,key){
      let res = await getLevelinfo({pid})
      if(key == 1){
        this.$nextTick(()=>{
          this.$refs.overinfo.getData(res.data?res.data:null)
        })
      }else if(key == 2){
        this.$nextTick(()=>{
          this.$refs.overinfo.getData(res.data?res.data:null)
          this.$refs.acountinfo.getData(res.data?res.data:null)
        })
      }else {
        this.$nextTick(()=>{
          this.$refs.overinfo.getData(res.data?res.data:null)
          this.$refs.acountinfo.getData(res.data?res.data:null)
          this.$refs.gridpower.getData(res.data?res.data:null)
        })
      }
    },
    backClick(){
      this.$router.push('/')
    },
    dropClick(){
      this.$refs.borad.showBopen()
    },
  },
}
</script>

<style lang="scss" scoped>
@import './style/grid.scss';
</style>
