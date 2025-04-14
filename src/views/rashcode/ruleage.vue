<template>
  <div class="ruleage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>数据规则设置</span>
      </div>
      <div class="text item">
        <ul class="listbox">
          <li v-for="(item,index) in listData">
              <span class="fbox">{{item}}</span>
              <div class="btnbox">
                <el-button plain size="mini" @click="handleclick(index+1)">点击进入</el-button>
              </div>
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "ruleage",
  data(){
    return {
      listData:[],
    }
  },
  mounted(){
    this.getData()
  },
  methods:{
    getData(){
      let data = ['颜小青人员数据','行政审批局人员数据']
      this.listData = data
    },
    handleclick(index){
      if(index == 1)
        this.$router.push('/talentage')
      else
        this.$router.push('/canteenage')
    },
  }
}
</script>
<style scoped lang="scss">
@import "./style/ruleage.scss";
</style>
