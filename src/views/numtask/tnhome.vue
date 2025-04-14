<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2023/3/10
 * @LastEditors: 12390
 * @LastEditTime: 2023/3/10
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="tnhome">
    <el-card class="box-card">
      <div class="text item">
       <dl class="mlist">
         <div class="mbody" v-for="(item,index) in tnData" :key="index">
           <dt>{{item.title}}</dt>
           <div class="mbox">
             <dd v-for="(vals,keys) in item.children" :key="keys" @click="navClick(index,vals.values)">
               <div class="iconbg" :style="{background:vals.color ? vals.color : 'rgba(0,0,0,.3)'}"><i class="iconfont" :class="vals.icon"></i></div>
               <div class="tfont">
                 <label>{{vals.name}}</label>
                 <span :style="{color:vals.color ? vals.color : 'rgba(0,0,0,.3)'}">{{vals.nums}}</span>
               </div>
             </dd>
           </div>
         </div>
       </dl>
      </div>
    </el-card>
  </div>
</template>

<script>
import {getNewscount} from './api/task'
import {getTaskcount} from "./api/work";
import {getSpeEntryList} from "./api/spetask";
export default {
  name: 'tnhome',
  data() {
    return {
      tnData:[]
    }
  },
  created() {
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData(){
      let res1 = await getNewscount()
      let res2 = await getTaskcount()
      let { data } = await getSpeEntryList()
      let count = eval(data.map(item => item.dbcount).join('+'))
      this.tnData = [
        {title:'通知公告',children:[
          {name:'通知总数',color:'#3882B4',values:'alltotal',icon:'icon-tongzhi2',nums:res1.data.allcount},
          {name:'未查阅通知',color:'#FF7E7C',values:'noread',icon:'icon-xinfeng',nums:res1.data.noreadcount},
          {name:'已查阅通知',color:'#56AA66',values:'hasread',icon:'icon-xinfeng-kai-shi',nums:res1.data.hasreadcount}
        ]},
        {title:'个人工作任务',children:[
            {name:'待办记录',color:'#F38A4A',values:'dealt',icon:'icon-daiban_fill',nums:res2.data.mytask},
            {name:'已办记录',color:'#0B92CC',values:'done',icon:'icon-yiban',nums:res2.data.finishedtask},
            {name:'发起记录',color:'#56AA66',values:'all',icon:'icon-fabuxuqiu',nums:res2.data.alltask}
        ]},
        {title:'专题专项任务',children:[
            {name:'待办记录',color:'#FFBD41',values:'moudels',icon:'icon-daiban2-mianxing',nums:count}
          ]}
      ]
    },
    navClick(key,name){
      let urlarr = ['Notices','Worktasks','Spemodules']
      this.$router.push({
        name:urlarr[key],
        params:{tcard:name}
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import './style/tnhome.scss';
</style>
