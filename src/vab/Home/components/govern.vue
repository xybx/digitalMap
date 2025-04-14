<template>
  <div class="govern">
    <ul :class="classObject">
      <li v-for="(item,index) in oData" :key="index" :class="sflex == 2 ? `animate__animated ${item.classname}` : ''">
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
import {getHomelist, geturl,getModuleRecord} from "@/api/user";
export default {
  name: "govern",
  props:['sflex'],
  data() {
    return {
      oData:[]
    }
  },
  components: {},
  computed: {
    ...mapGetters({
      userData:'user/userData',
      routers:'routes/routes',
      pathone:'routes/pathone'
    }),
    classObject(){
      return {
        olist:this.sflex == 1,
        zlist:this.sflex == 2,
        ylist:this.sflex == 3,
        crlist:this.oData.length <=3
      }
    },
  },
  mounted() {
    if(this.userData.areaid) this.getGovern()
  },
  methods: {
     ...mapMutations({
      setCollapse:'settings/setCollapse'
    }),
    async getGovern(){
      let areaid = this.userData.areaid
      let params = {areaid,typeid:3}
      let res = await getHomelist(params)
      if(res.data){
        this.oData = res.data.map(item=>{
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
      let res = await geturl({typeid:14})
      let arr = this.routers.filter(item=>{
        return item.showMenuIndex === index
      })
      if(arr.length > 0){
        index == 3 ? this.$router.push({path:this.pathone}) : this.$router.push({path:arr[0].path})
      }else {
        if(index == 18){
          if(res.data != ''){
            window.open(res.data, '_blank')
          }else {
            this.$baseConfirm('请联系管理员配置此栏目链接！','信息提示',()=>{
              return false
            })
          }
        }else if(index == 19 || index == 20){
          this.$baseConfirm('此栏目正在努力开发中...，敬请期待！','信息提示',()=>{
            return false
          })
        }else {
          this.$baseConfirm('你暂无权限查看此栏目，请联系管理员！','信息提示',()=>{
            return false
          })
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/vab/styles/home/govern.scss";
</style>
