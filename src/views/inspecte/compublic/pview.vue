<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/6/27
 * @LastEditors: 12390
 * @LastEditTime: 2022/6/27
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="pview">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>{{ title }}</span>
        <el-button type="danger" plain size="small" @click="backgo">返回列表</el-button>
      </div>
      <div class="text item infobox">
        <h3>{{infodata.title}}</h3>
        <img :src="url" alt="">
        <div class="infomain" v-html="infodata.content"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import {getPublicId} from "@/views/inspecte/api/public";
export default {
  name: 'pview',
  data() {
    return {
      pid:this.$route.query.pid || null,
      type:this.$route.query.type || null,
      title:'',
      infodata:{},
      url:''
    }
  },
  components: {},
  computed: {},
  created() {
  },
  mounted() {
    this.getinfo()
  },
  methods: {
    async getinfo(){
      let arr = ['工作简介详情','廉洁教育详情','清廉微讲堂详情']
      this.title = arr[this.type]
      let res = await getPublicId({pid:this.pid})
      if(res.code == 200){
        this.infodata = res.data
        this.url = `${this.$baseUrl}/gridfs/image/${res.data.fileimage}`
      }
    },
    backgo(){
      let arr = ['/pwork','/pteach','/proom']
      this.$router.push({
        path:arr[this.type]
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../style/public.scss";
</style>
