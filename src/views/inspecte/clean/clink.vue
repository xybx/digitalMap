<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/7/17
 * @LastEditors: 12390
 * @LastEditTime: 2022/7/17
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="clink">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>清廉链接</span>
      </div>
      <div class="text item">
        <ul class="clist">
          <li v-for="item in cleanData" @click.prevent="navClick(item.url)">
              <i class="icon iconfont" :class="item.icon"></i>
              <el-link :href="item.url" target="_blank">{{item.name}}</el-link>
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
import {getCleanList} from "../api/clean";
export default {
  name: 'clink',
  data() {
    return {
      cleanData:[]
    }
  },
  components: {},
  computed: {},
  created() {
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData(){
      let res = await getCleanList()
      let icon = ['icon-jingcha','icon-jianguanfengkong1','icon-jieguojiancha','icon-chouchajiancha']
      let arr = [res.data.address1,res.data.address2,res.data.address3,res.data.address4]
      this.cleanData = arr.map((item,index)=>{
        item.icon = icon[index]
        return item
      })
    },
    navClick(url){
      window.open(url,'_blank')
    },
  }
}
</script>

<style lang="scss" scoped>
.clink{
  width: 100%;
  background: none!important;
  width: calc(100% - 24px);
  margin: 10px auto;
  padding: 0!important;
  .el-card{
    min-height: calc(100vh - 100px)!important;
    border-radius: 10px;
    margin-bottom: 0;
    ::v-deep{
      .el-card__header{
        background-color:#F5F7FA;
        color: #333;
        display: flex;
        justify-content: left;
        align-items: center;
        flex-direction: row;
        padding: 12px 20px;
        span{
          margin-left: 10px;
          line-height: 20px;
          display: inline-block;
        }
        i{
          width: 3px;
          height:20px;
          background-color:#E93326;
          display: inline-block;
          position: relative;
          top: 4px;
        }
        .el-button{
          margin-left: 20px;
          span{
            margin-left: 0;
            line-height: inherit;
          }
        }
      }
      .el-card__body{
        .clist{
          display: flex;
          flex-direction: row;
          align-items: center;
          margin: 0;
          padding: 0;
          li{
            width:10%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            i{
              padding:18px 20px;
              border-radius:25px;
              font-size:30px;
              color: #fff;
              background: linear-gradient(bottom,rgba(242, 61, 61, 1),rgba(220, 57, 57, 1));
              background: -webkit-linear-gradient(bottom,rgba(242, 61, 61, 1),rgba(220, 57, 57, 1));
              background: -moz-linear-gradient(bottom,rgba(242, 61, 61, 1),rgba(220, 57, 57, 1));
              background: -o-linear-gradient(bottom,rgba(242, 61, 61, 1),rgba(220, 57, 57, 1));
              background: -ms-linear-gradient(bottom,rgba(242, 61, 61, 1),rgba(220, 57, 57, 1));
            }
            &:nth-child(2) i{
              font-size: 32px;
            }
            .el-link{
              margin-top:15px;
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>
