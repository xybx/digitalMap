<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/5/7
 * @LastEditors: 12390
 * @LastEditTime: 2022/5/7
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="spemodule">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>专题专项任务模块入口</span>
      </div>
      <div class="text item" v-loading="fullscreenLoading">
        <ul class="mlist" v-if="moudleData.length > 0">
          <li v-for="item in moudleData" @click="moudleClick(item.pid,item.moduletype)">
            <el-badge :value="item.dbcount" :max="99" class="item">
              <div class="mfont">
                <div class="iconbg" :style="{background:item.color ? item.color : 'rgba(0,0,0,.3)'}"><i class="icon iconfont" :class="item.icon"></i></div>
                <span>{{item.name}}</span>
              </div>
              <p>描述:{{item.description}}</p>
            </el-badge>
          </li>
        </ul>
        <div class="moudlebox" v-if="showface">
          <i class="iconfont icon-meiyoudingdan-01"></i>
          <span>暂无模块数据</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import {getSpeEntryList} from "./api/spetask";
export default {
  name: 'spemodule',
  data() {
    return {
      moudleData:[],
      showIndex:localStorage.getItem('showMenuIndex'),
      showface:false
    }
  },
  components: {},
  computed: {},
  created() {
  },
  mounted() {
    this.getmoudle()
  },
  watch:{
    showIndex:{
      handler(val){
        if(val != 16){
          this.$router.push({path:'/'})
        }
      },
      immediate:true
    }
  },
  methods: {
    async getmoudle(){
      let res = await getSpeEntryList()
      this.moudleData = res.data ? res.data.filter(item => item.usertype != 2) : []
      // this.moudleData = res.data ? res.data : []
      this.showface = res.data.length > 0 ? false : true
    },
    moudleClick(pid,mtype){
      this.$router.push({
        path:'/spetask',
        query:{pid,mtype}
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/views/numtask/style/spepage.scss';
</style>
