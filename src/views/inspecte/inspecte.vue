<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/6/20
 * @LastEditors: 12390
 * @LastEditTime: 2022/6/20
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="inspecte animate__animated animate__fadeInDownBig">
      <div class="headerbox">
          <i class="animate__animated animate__fadeInDown animate__delay-1s"></i>
          <el-button class="animate__animated animate__bounceInDown animate__delay-1s" size="medium" type="danger" plain @click="backgo">返回主页</el-button>
      </div>
      <ul class="itemlist">
        <li v-for="(item,index) in mouData" :key="index" class="animate__animated animate__delay-2s" :class="item.class" @click="routerclick(index+1)">
          {{item.title}}
        </li>
      </ul>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
export default {
  name: 'inspecte',
  data() {
    return {
      mouData:[],
      showIndex:localStorage.getItem('showMenuIndex')
    }
  },
  components: {},
  computed: {
    ...mapGetters({
      routers:'routes/routes',
    }),
  },
  created() {
  },
  mounted() {
    this.getData()
  },
  watch:{
    showIndex:{
      handler(val){
        if(val != 23){
          this.$router.push({path:'/'})
        }
      },
      immediate:true
    }
  },
  methods: {
    getData(){
      this.mouData = [
        {class:'animate__bounceInLeft',title:'纪委公开'},
        {class:'animate__bounceInDown',title:'党组织成员监管'},
        {class:'animate__fadeInRight',title:'村集体监管'},
        {class:'animate__fadeInDown',title:'日常监管'},
        {class:'animate__backInLeft',title:'日常工作'},
        {class:'animate__backInDown',title:'清廉链接'},
        {class:'animate__fadeInRight',title:'统计大屏'},
      ]
    },
    routerclick(index){
      if(index!=5) localStorage.setItem('childMenuIndex',index)
      let arr = this.routers.filter(item=>{
        return item.showMenuIndex == this.showIndex && item.childmenuindex == index
      })
      let crr = this.routers.filter(item=> item.path == '/spemodule')
      if(arr.length > 0){
        this.$router.push({path:arr[0].path})
      }else {
        if(index == 5){
          if(crr.length > 0){
            localStorage.setItem('showMenuIndex',16)
            this.$router.push({path:'/spemodule'})
          }else {
            this.$baseConfirm('你暂无权限查看此栏目，请联系管理员！','信息提示',()=>{
              return false
            })
          }
        }else {
          this.$baseConfirm('你暂无权限查看此栏目，请联系管理员！','信息提示',()=>{
            return false
          })
        }
      }
    },
    backgo(){
      this.$router.push({path:'/'})
    },
  }
}
</script>

<style lang="scss" scoped>
@import "./style/inspecte.scss";
</style>
