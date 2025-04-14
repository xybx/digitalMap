<template>
  <div class="lindex">
    <div class="infobox">
      <div class="rowflex">
        <template v-for="(item,index) in iconData">
          <div :class="fspan" @click="routerPath(item.name)">
            <el-card class="box-card animate__animated animate__zoomIn">
              <div class="text item">
                <div class="c_l fl">
                  <h3>{{ item.name }}</h3>
                  <p>{{ item.value }}</p>
                </div>
                <div class="c_r fr">
                  <el-progress
                    type="circle"
                    :percentage="item.percentage"
                    :width="100"
                    :color="item.color"
                    :stroke-width="12"
                    :show-text="false"
                  ></el-progress>
                  <i class="icon iconfont icon-tongjifenxi" :class="item.class"></i>
                </div>
              </div>
            </el-card>
          </div>
        </template>
      </div>
      <div class="infobox" style="margin-top: 20px;">
        <div class="colflex">
          <template v-for="item in listData">
            <div :class="fspan">
              <el-card class="box-card animate__animated" :class="item.animatetype">
                <div slot="header">
                  <i></i>
                  <span>{{item.title}}</span>
                </div>
                <div class="text item">
                  <ul class="itembox">
                    <template v-if="item.childlist.length > 0">
                      <li v-for="val in item.childlist" :key="val.pid" class="itemli" @click="routerPath(item.title)">
                        <span class="fl">{{ val.appeal }}</span>
                        <span class="fr">{{ val.date.substr(0, 10) }}</span>
                      </li>
                    </template>
                    <template v-else>
                      <li class="itemdis">暂无数据</li>
                    </template>
                  </ul>
                </div>
              </el-card>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {getpetionnum,getpendList,getneedtoList,getreviewList,getdoneList,getareaList} from "./api/petion";
import petdialog from "./components/petdialog";
import {mapGetters} from 'vuex'
export default {
  name: "lindex",
  data(){
    return {
      iconData:[],
      fspan:'',
      listData:[],
    }
  },
  computed:{
    ...mapGetters({
      userData:'user/userData'
    })
  },
  components:{
    petdialog
  },
  created() {
    this.getOneFlex();
  },
  mounted() {
  },
  methods:{
    routerPath(name){
      if(name == '待受理'){
        this.$router.push({
          path:'/letter/audit'
        })
      }else if(name == '待回复'){
        this.$router.push({
          path:'/letter/remain'
        })
      }else if(name == '已回待审'){
        this.$router.push({
          path:'/letter/trial'
        })
      }else if(name == '已办记录'){
        this.$router.push({
          path:'/letter/done'
        })
      }else if(name == '区域查询'){
        this.$router.push({
          path:'/letter/record'
        })
      }
    },
    async getOneFlex(){
      let colorArr = ["#f47b25","#31c92e","#4d90fe","#5d61bf","#f5619c"];
      let iconClass = ["color1", "color2", "color3", "color4","color5"];
      let res = await getpetionnum({uid:this.userData.pid})
      this.gData = res.data.map(item=>{
        return item.name
      })
      let arr = res.data
      if(arr.length == 5){
        this.fspan = 'wf5'
      } else if(arr.length == 4){
        this.fspan = 'wf4'
      }else if(arr.length == 3){
        this.fspan = 'wf3'
      }else if(arr.length == 2){
        this.fspan = 'wf2'
      }
      this.iconData = arr.map((item,index)=>{
        if(item.name == '待受理记录'){
          item.name = '待受理'
        }else if(item.name == '待办记录'){
          item.name = '待回复'
        }else if(item.name == '已办待审'){
          item.name = '已回待审'
        }else if(item.name == '已办记录'){
          item.name = '已办记录'
        }
        return {
          name:item.name,
          value:item.value,
          percentage: item.value > 100 ? 100 : item.value,
          color: colorArr[index],
          class:iconClass[index]
        }
      })
      this.getlist(arr)
    },
    async getlist(arr){
      let data = {
        pagenumber:1,
        pagesize:10
      }
      let brr = await getpendList(data)
      let crr = await getneedtoList(data)
      let drr = await getreviewList(data)
      let err = await getdoneList(data)
      let frr = await getareaList(data)
      this.listData = arr.map(item=>{
        if(item.name == '待受理'){
          return {
            title:item.name,
            animatetype:'animate__backInLeft',
            childlist:brr.data.list.map(val=>{
              return {
                pid:val.pid,
                appeal:val.appeal,
                date:val.date
              }
            })
          }
        }else if(item.name == '待回复'){
          return {
            title:item.name,
            animatetype:'animate__backInDown',
            childlist:crr.data.list.map(val=>{
              return {
                pid:val.pid,
                appeal:val.appeal,
                date:val.date
              }
            })
          }
        }else if(item.name == '已回待审'){
          return {
            title:item.name,
            animatetype:'animate__backInUp',
            childlist:drr.data.list.map(val=>{
              return {
                pid:val.pid,
                appeal:val.appeal,
                date:val.date
              }
            })
          }
        }else if(item.name == '已办记录'){
          return {
            title:item.name,
            animatetype:'animate__flipInX',
            childlist:err.data.list.map(val=>{
              return {
                pid:val.pid,
                appeal:val.appeal,
                date:val.date
              }
            })
          }
        }else if(item.name == '区域查询'){
          return {
            title:item.name,
            animatetype:'animate__backInRight',
            childlist:frr.data.list.map(val=>{
              return {
                pid:val.pid,
                appeal:val.appeal,
                date:val.date
              }
            })
          }
        }
      })
    },
    itemClick(name,pid){

    },
  },
}
</script>
<style lang="scss" scoped>
.lindex{
  width: 100%;
  background: none!important;
  width: calc(100% - 24px);
  margin: 10px auto;
  padding: 0!important;
  min-height: calc(100vh - 100px)!important;
  .infobox{
    .rowflex{
      height: 130px;
    }
    .colflex{
      ::v-deep{
        .el-card__body{
          padding-top:0!important;
          padding-bottom:0!important;
          .itembox {
            height:400px;
            list-style: none;
            padding: 0;
            .itemli {
              border-bottom: 1px dashed #dedede;
              color: #999;
              padding: 12px 0;
              overflow: hidden;
              &:last-child{
                border-bottom: none;
              }
              .fl{
                float: left;
                color: #333;
                &:hover {
                  color: #EB2520;
                }
              }
              .fr{
                float: right;
              }
              &:hover {
                color: #EB2520;
              }
            }
          }
          .itemdis {
            color: #999;
            font-size: 16px;
            padding-top: 10px;
          }
        }
      }
    }
    .rowflex,.colflex{
      .wf5{
        width:19.2%;
        float: left;
        margin-right: 1%;
        &:last-child{
          margin-right: 0;
        }
      }
      .wf4{
        width: 24.4%;
        float: left;
        margin-right: 0.8%;
        &:last-child{
          margin-right: 0;
        }
      }
      .wf3{
        width: 32.86%;
        float: left;
        margin-right: 0.7%;
        &:last-child{
          margin-right: 0;
        }
      }
      .wf2{
        width: 49.6%;
        float: left;
        margin-right: 0.8%;
        &:last-child{
          margin-right: 0;
        }
      }
    }
    .el-card {
      cursor: pointer;
      border-radius: 8px;
      margin-bottom: 0!important;
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
            background-color:#EB2520;
            display: inline-block;
            position: relative;
            top: 4px;
          }
        }
        .el-card__body {
          padding: 15px;
          overflow: hidden;
          .c_l{
            height: 100px;
            //margin-right: 50px;
            float: left;
            h3{
              color: #5c7187;
              font-size: 16px;
              margin-top: 20px;
            }
            p{
              color: #484c67;
              font-size: 26px;
              text-align: center;
              margin-top: 10px;
            }
          }
          .c_r{
            width: 100px;
            height: 100px;
            line-height: 100px;
            vertical-align: middle;
            border-radius: 50%;
            position: relative;
            float: right;
            i{
              position: absolute;
              top:-0.1vw;
              left: calc(50% - 1.4vw);
              font-size: 2.8vw;
              &.color1{
                -webkit-line-clamp: 2;
                background-image: -webkit-linear-gradient(bottom, #ff995b,#f3651f);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
              &.color2{
                -webkit-line-clamp: 2;
                background-image: -webkit-linear-gradient(bottom, #54d9ac,#35b0a2);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
              &.color3{
                -webkit-line-clamp: 2;
                background-image: -webkit-linear-gradient(bottom, #1492ea,#85efff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
              &.color4{
                -webkit-line-clamp: 2;
                background-image: -webkit-linear-gradient(bottom, #ae67d7,#6e54cf);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
              &.color5{
                -webkit-line-clamp: 2;
                background-image: -webkit-linear-gradient(bottom, #f5619c,#e03d6b);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
            }
          }
        }
      }
    }
  }
}
</style>
