<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/8/15
 * @LastEditors: 12390
 * @LastEditTime: 2022/8/15
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="levHeader animate__animated animate__bounceInDown animate__delay-1s">
    <el-row :gutter="20">
      <el-col :span="5">
        <span>{{datefont}} {{second}}</span>
      </el-col>
      <el-col :span="14">
        <h3>{{titleName}}</h3>
      </el-col>
      <el-col :span="5">
        <vab-avatar/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {timeDate, timeSec} from "@/utils/timeDate";
import vabavatar from '@/vab/components/VabAvatar/index'
export default {
  name: 'levHeader',
  data() {
    return {
      datefont:timeDate(),
      second:'',
      titleName:''
    }
  },
  components: {
    vabavatar
  },
  computed: {},
  created() {
    this.getTime()
    this.getData()
  },
  mounted() {
  },
  methods: {
    getTime(){
      setInterval(()=>{
        this.second = timeSec()
      },1000)
    },
    getData(){
      this.titleName = '牟平区数字乡村服务平台'
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/vab/styles/home/levhead.scss";
</style>
