<template>
  <div class="leader">
    <ul :class="classObject">
      <li v-for="(item,index) in titbox" :key="index" :class="sflex == 2 ? `animate__animated ${item.classname} ${titbox.length ==2 ? 'w2' : titbox.length ==3 ?'w3':''}` : `${titbox.length ==2 ? 'w2' : titbox.length ==3 ?'w3':''}`">
        <i v-if="sflex == 2" class="fbg"></i>
        <div class="boxflex" :class="sflex != 2 ? `animate__animated ${item.classname}`:''" @click="routerScreen(item.rindex)">
          <template v-if="sflex == 2">
            <div class="iconbox">
              <i :class="index == 0 ? `iconfont ${item.iconame}` : `icon iconfont ${item.iconame}`"></i>
            </div>
            <div class="fbtn"><i class="icon iconfont icon-WBS-jinru"></i><span>{{item.title}}</span></div>
          </template>
          <template v-else-if="sflex == 3">
            <div class="iconbg">
              <i :class="index == 0 ? `iconfont ${item.iconame}` : `icon iconfont ${item.iconame}`"></i>
            </div>
          </template>
          <template v-else>
            <i :class="index == 0 ? `iconfont ${item.iconame}` : `icon iconfont ${item.iconame}`"></i>
            <h3>{{item.title}}</h3>
          </template>
        </div>
        <h3 v-if="sflex == 3">{{item.title}}</h3>
      </li>
    </ul>
  </div>
</template>

<script>
import {getHomelist,getModuleRecord} from "@/api/user";
import {mapGetters} from "vuex";
export default {
  name: "leader",
  props:['sflex'],
  data() {
    return {
      titbox:[]
    }
  },
  components: {},
  computed: {
    classObject(){
      return {
        elist:this.sflex == 1,
        clist:this.sflex == 2,
        alist:this.sflex == 3
      }
    },
    ...mapGetters({
      userData:'user/userData',
      routers:'routes/routes',
    }),
  },
  mounted() {
    if(this.userData.areaid) this.getTitle()
  },
  methods: {
    async getTitle(){
      let areaid = this.userData.areaid
      let params = {areaid,typeid:4}
      let res = await getHomelist(params)
      this.titbox = res.data ? res.data.map(item => {
        return {
          title:item.newtitle ? item.newtitle : item.title,
          classname:item.classname,
          iconame:item.iconame,
          rindex:item.rindex
        }
      }) : []
    },
    async routerScreen(index){
      localStorage.setItem('showMenuIndex',index)
      await getModuleRecord({plantform:2,moduletype:index})
      let arr = this.routers.filter(item=>{
        return item.showMenuIndex === index
      })
      if(arr.length > 0){
        this.$router.push(arr[0].path)
        // window.open(this.$router.resolve({path:arr[0].path}).href, '_blank')
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
@import "@/vab/styles/home/leader.scss";
</style>
