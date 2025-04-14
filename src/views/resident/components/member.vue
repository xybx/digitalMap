<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/9/17
 * @LastEditors: 12390
 * @LastEditTime: 2022/9/17
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="member">
    <div id="water8">
      <canvas id="canvas"></canvas>
    </div>
      <dl v-for="(item,index) in memberData" :key="index">
        <dt>{{item.label}}</dt>
        <dd v-for="(val,keys) in item.children" :class="{active:cardid == val.memberid}" :key="keys" @click="memberClick(val.familyid,val.memberid,val.familyrelationship)">{{val.membername}}</dd>
      </dl>
    <el-button type="primary" size="medium" plain @click="goback">返回列表</el-button>
  </div>
</template>

<script>
import {getFamilyDetail} from "@/views/resident/api/resident";
import {mapGetters} from "vuex";
export default {
  name: 'member',
  data() {
    return {
      memberData:[]
    }
  },
  props:['partype','parpid','cardid','rid'],
  components: {},
  computed: {
    ...mapGetters({
      username: 'user/username',
    }),
  },
  created() {
  },
  mounted() {
    this.getWater()
  },
  methods: {
    //添加水印
    getWater() {
      const canvas = document.getElementById('canvas') //获取canvas
      canvas.width = 300 //设置画布宽度
      canvas.height = 260 //设置画布高度
      canvas.style.display = 'none' //隐藏画布本身
      const ctx = canvas.getContext('2d') //获取画笔
      ctx.font = '1.3vmax sans-serif' //设置文字大小
      ctx.fillStyle = 'rgba(0,0,0,.1)' //设置文字颜色及透明度
      ctx.rotate(-0.3) //设置文字旋转角度
      ctx.fillText(this.username, canvas.width / 6, canvas.height / 2) //设置显示文字内容
      const img = canvas.toDataURL('image/png') //参数默认为 image/png,可以是其他image/jpeg等，该方法返回值是一个url，是base64组成的图片的源数据、可以直接赋值给图片的src属性
      const style = `background-image:url(${img});` //定义样式
      water8.setAttribute('style', style) //给要添加水印的元素设置样式
    },
    async showData(){
      let {data} = await getFamilyDetail({familyId:this.parpid})
      let hrr = data?.members.filter(item => item.familyrelationship == 21)
      let crr = data?.members.filter(item => item.familyrelationship != 21)
      let nrr = ['户主','家庭成员']
      this.memberData = nrr.map((item,index)=>{
        return {
          label:item,
          children:index == 0 ? hrr : crr
        }
      })
    },
    memberClick(fid,mid,rid){
      this.cardid = mid
      this.$emit('memberClick',fid,mid,rid)
    },
    goback(){
      this.$emit('goback')
    },
  }
}
</script>

<style lang="scss" scoped>
#water8 {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  z-index: 1;
}
.member{
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  .el-button{
    width:8%;
    margin-left: 20px;
  }
  dl{
    margin:0;
    padding:20px;
    display: flex;
    flex-direction:row;
    flex-wrap:wrap;
    align-items:center;
    margin-bottom:20px;
    &:last-child{
      margin-bottom:0;
    }
    dt{
      font-size:18px;
      color: #333;
      width:6%;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    dd{
      width:100px;
      height:42px;
      border-radius: 5px;
      border:1px solid #cfcfcf;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size:15px;
      cursor: pointer;
      &.active{
        background:#0c9ed7;
        border-color:#0c9ed7;
        color: #fff;
      }
    }
  }
}
</style>
