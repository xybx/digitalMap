<template>
  <div class="nation">
    <ul :class="classObject">
      <li v-for="(item,index) in nData" :key="index" :class="sflex == 2 ? `animate__animated ${item.classname}` : ''">
        <i v-if="sflex == 2" class="fbg"></i>
        <div class="boxflex" :class="sflex != 2 ? `animate__animated ${item.classname}`:''" @click="routerClick(item.rindex)">
          <template v-if="sflex == 2">
            <div class="iconbox"><i class="icon iconfont" :class="item.iconame"></i></div>
            <div class="fbtn"><i class="icon iconfont icon-WBS-jinru"></i><span>{{item.title}}</span></div>
          </template>
          <template v-else-if="sflex == 3">
            <div class="iconbg"><i class="icon iconfont" :class="item.iconame"></i></div>
          </template>
          <template v-else>
            <i class="icon iconfont" :class="item.iconame"></i>
            <h3>{{item.title}}</h3>
          </template>
        </div>
        <h3 v-if="sflex == 3">{{item.title}}</h3>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import {getHomelist,getModuleRecord} from '@/api/user'
export default {
  name: "nation",
  props:['sflex'],
  data() {
    return {
      nData:[],
    }
  },
  computed: {
    ...mapGetters({
      userData:'user/userData',
      routers:'routes/routes',
      pathtwo:'routes/pathtwo'
    }),
    classObject(){
      return {
        nlist:this.sflex == 1,
        slist:this.sflex == 2,
        mlist:this.sflex == 3,
        crlist:this.nData.length <=4
      }
    },
  },
  mounted() {
    if(this.userData.areaid) this.getNation()
  },
  methods: {
     ...mapMutations({
      setCollapse:'settings/setCollapse'
    }),
    async getNation(){
      let areaid = this.userData.areaid
      let params = {areaid,typeid:2}
      let res = await getHomelist(params)
      if(res.data){
        this.nData = res.data.map(item=>{
          return {
            title:item.newtitle ? item.newtitle : item.title,
            classname:item.classname,
            iconame:item.iconame,
            rindex:item.rindex
          }
        })
      }
    },
   async routerClick(index){
      localStorage.setItem('showMenuIndex',index)
      if(index ==40) this.setCollapse(true)
      else this.setCollapse(false)
      await getModuleRecord({plantform:2,moduletype:index})
      let arr = this.routers.filter(item=>{
        return item.showMenuIndex === index
      })
      if(arr.length > 0){
        index == 4 ? this.$router.push({path:this.pathtwo}) : this.$router.push({path:arr[0].path})
      }else if(index == 13 || index == 14 || index == 15){
        this.$baseConfirm('此栏目正在努力开发中...，敬请期待！','信息提示',()=>{
          return false
        })
      }else{
        this.$baseConfirm('你暂无权限查看此栏目，请联系管理员！','信息提示',()=>{
          return false
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/vab/styles/home/nation.scss";
</style>
