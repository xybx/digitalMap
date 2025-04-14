<template>
  <div class="home">
    <el-container>
      <el-header>
        <vabHeader :pages="pages"></vabHeader>
      </el-header>
      <el-main>
        <div class="mContent">
          <el-row>
            <el-col :lg="6" :md="6" :sm="24" :xl="6" :xs="24">
              <ul class="list1">
                <li>
                  <div @click="routerMap(1,1)" class="boxflex animate__animated animate__bounceInLeft animate__delay-1s">
                    <i class="icon iconfont icon-gis_yizhangtuguanli"></i>
                    <h3>一张图</h3>
                  </div>
                </li>
                <li>
                  <div @click="routerMap(7,6)" class="boxflex animate__animated animate__flipInX animate__delay-1s">
                    <i class="icon iconfont icon-chengjizhenjumin"></i>
                    <h3>居民管理</h3>
                  </div>
                </li>
              </ul>
            </el-col>
            <el-col :lg="6" :md="6" :sm="24" :xl="6" :xs="24">
              <ul class="list1">
                <li>
                  <div @click="routerMap(2,2)" class="boxflex animate__animated animate__backInDown animate__delay-2s">
                    <i class="icon iconfont icon-suishoupai"></i>
                    <h3>随手拍</h3>
                  </div>
                </li>
                <li>
                  <div @click="routerMap(6,5)" class="boxflex animate__animated animate__flipInX animate__delay-1s">
                    <i class="icon iconfont icon-xinfangrenyuan"></i>
                    <h3>居民信访</h3>
                  </div>
                </li>
              </ul>
            </el-col>
            <el-col :lg="6" :md="6" :sm="24" :xl="6" :xs="24">
              <ul class="list1">
                <li>
                  <div @click="routerMap(3,3)" class="boxflex animate__animated animate__flipInX animate__delay-1s">
                    <i class="icon iconfont icon-anquanshengchanxitong"></i>
                    <h3>安全生产</h3>
                  </div>
                </li>
                <li>
                  <div @click="routerMap(4,4)" class="boxflex animate__animated animate__flipInY animate__delay-2s">
                    <i class="icon iconfont icon-jifenshangcheng"></i>
                    <h3>积分商城</h3>
                  </div>
                </li>
              </ul>
            </el-col>
            <el-col :lg="6" :md="6" :sm="24" :xl="6" :xs="24">
              <ul class="list1">
                <li>
                  <div @click="routerMap(5,2)" class="boxflex animate__animated animate__fadeInUp animate__delay-2s">
                    <i class="icon iconfont icon-zixunguanli"></i>
                    <h3>新闻资讯</h3>
                  </div>
                </li>
                <li>
                  <!--<div @click="routerTotal" class="boxflex animate__animated animate__fadeInDown animate__delay-2s">
                    <i class="icon iconfont icon-tongjifenxi"></i>
                    <h3>统计分析</h3>
                  </div>-->
                  <div @click="epidemic" class="boxflex animate__animated animate__fadeInDown animate__delay-2s">
                    <i class="icon iconfont icon-yiqingfuwu"></i>
                    <h3>疫情防控</h3>
                  </div>
                </li>
              </ul>
            </el-col>
          </el-row>
        </div>
      </el-main>
      <el-footer>
        Copyright
        <i class="iconfont icon-copyright"></i>
        {{ title }} {{ fullYear }}
      </el-footer>
    </el-container>
  </div>
</template>

<script>
  import vabHeader from '@/vab/components/VabHeader/index.vue';
  import vabAppMain from '@/vab/components/VabAppMain/index.vue';
  import { title  } from '@/config'
  import { mapGetters} from 'vuex'
  export default {
    name:'home',
    data(){
      return {
        pages:true,
        fullYear: new Date().getFullYear(),
        title,
      }
    },
    components:{
      vabHeader,
      vabAppMain
    },
    computed:{
      ...mapGetters({
        routers:'routes/routes',
        pathone:'routes/pathone',
        pathtwo:'routes/pathtwo'
      })
    },
    created() {
      localStorage.removeItem('showMenuIndex')
    },
    methods:{
      routerMap(key,index){
        localStorage.setItem('showMenuIndex',index)
        if(key === 1){
          let arr = this.routers.filter(item=>{
            return item.showMenuIndex === 1
          })
          if(arr[0].children && arr[0].children.length >0){
            this.$router.push({
              path:'/map',
            })
          }else {
            this.$baseConfirm('你暂无权限查看此栏目，请联系管理员！','信息提示',()=>{
              return false
            })
          }
        }else if(key === 2){
          let crr = this.routers.filter(item=>{
            return item.showMenuIndex === 2
          })
          if(crr.length > 0){
            this.$router.push({
              path:'/cindex',
            })
          }else {
            this.$baseConfirm('你暂无权限查看此栏目，请联系管理员！','信息提示',()=>{
              return false
            })
          }
        }else if(key === 3){
          let hrr = this.routers.filter(item=>{ return item.showMenuIndex === 3})
          if(hrr.length > 0){
            this.$router.push({
              path:this.pathone,
            })
          }else {
            this.$baseConfirm('你暂无权限查看此栏目，请联系管理员！','信息提示',()=>{
              return false
            })
          }
        }else if(key === 4){
          let nrr = this.routers.filter(item=>{ return item.showMenuIndex === 4})
          if(nrr.length > 0){
            this.$router.push({
              path:this.pathtwo,
            })
          }else {
            this.$baseConfirm('你暂无权限查看此栏目，请联系管理员！','信息提示',()=>{
              return false
            })
          }
        }else if(key === 5){
          let crr = this.routers.filter(item=>{
            return item.showMenuIndex === 2
          })
          if(crr.length > 0){
            this.$router.push({
              path:'/news/cnews',
            })
          }else {
            this.$baseConfirm('你暂无权限查看此栏目，请联系管理员！','信息提示',()=>{
              return false
            })
          }
        }else if(key === 6){
          let krr = this.routers.filter(item=>{
            return item.showMenuIndex === 5
          })
          if(krr.length > 0){
            this.$router.push({
              path:'/lindex',
            })
          }else {
            this.$baseConfirm('你暂无权限查看此栏目，请联系管理员！','信息提示',()=>{
              return false
            })
          }
        }else if(key === 7){
          let grr = this.routers.filter(item=>{
            return item.showMenuIndex === 6
          })
          if(grr.length > 0){
            this.$router.push({
              path:'/mindex',
            })
          }else {
            this.$baseConfirm('你暂无权限查看此栏目，请联系管理员！','信息提示',()=>{
              return false
            })
          }
        }
      },
      epidemic(){
        window.open('http://yq.dpinfo.com.cn/', '_blank')
      },

    }

  }


</script>

<style lang="scss" scoped>
.home{
  width: 100%;
  height: 100%;
  background: url(../../assets/backbg.png) top center no-repeat;
  background-size: 100% 100%;
  .el-container{
    position:absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    .el-header{
      height: 100px!important;
      padding:0;
      ::v-deep{
        .vab-header{
          background:none!important;
          height: 100px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          background: rgba(0,0,0,0.05);
          box-shadow: 0 5px 5px rgb(0 0 0 / 10%);
          .vab-main {
            width: 1400px !important;
            margin: auto;
            .logo-container-horizontal .title{
              font-size: 30px;
              text-shadow: 3px 3px 3px rgba(0,0,0,.3);
            }
          }
        }
      }
    }
    .el-main{
      .mContent{
        width: 1400px;
        height:100%;
        margin: 0 auto;
        .el-row{
          padding-top:10%;
          .el-col{
            .list1,.list{
              margin: 0;
              &.padno{
                padding: 0;
              }
              li{
                //height: 205px;
                .boxflex{
                  display: flex;
                  height:calc(100% - 2px);
                  border: 1px solid #ededed;
                  box-shadow: 0 0 5px 3px rgba(0,0,0,.1);
                  cursor: pointer;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  background: rgba(255,255,255,.3);
                  padding: 10% 0;
                  i{
                    font-size: 60px;
                  }
                  i.icon-gis_yizhangtuguanli{
                    -webkit-line-clamp: 2;
                    background-image: -webkit-linear-gradient(bottom, #1492ea,#85efff);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                  }
                  i.icon-suishoupai{
                    -webkit-line-clamp: 2;
                    background-image: -webkit-linear-gradient(bottom, #ff995b,#f3651f);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                  }
                  i.icon-anquanshengchanxitong{
                    -webkit-line-clamp: 2;
                    background-image: -webkit-linear-gradient(bottom, #1492ea,#85efff);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                  }
                  i.icon-jifenshangcheng{
                    -webkit-line-clamp: 2;
                    background-image: -webkit-linear-gradient(top, #fee121,#ffbe40);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                  }
                  i.icon-tongjifenxi{
                    -webkit-line-clamp: 2;
                    background-image: -webkit-linear-gradient(bottom, #54d9ac,#35b0a2);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                  }
                  i.icon-xinfangrenyuan{
                    -webkit-line-clamp: 2;
                    background-image: -webkit-linear-gradient(bottom, #da4210,#f02e2e);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                  }
                  i.icon-chengjizhenjumin{
                    -webkit-line-clamp: 2;
                    background-image: -webkit-linear-gradient(bottom, #ae67d7,#6e54cf);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                  }
                  i.icon-zixunguanli{
                    -webkit-line-clamp: 2;
                    background-image: -webkit-linear-gradient(bottom, #f5619c,#e03d6b);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                  }
                  i.icon-yiqingfuwu{
                    -webkit-line-clamp: 2;
                    background-image: -webkit-linear-gradient(bottom,#54d9ac,#35b0a2);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                  }
                  h3{
                    font-size:24px;
                    font-weight: normal;
                    color: #fff;
                    text-shadow: 0 1px 5px rgba(0,0,0,.3);
                  }
                }
                &:nth-child(1){
                  margin-bottom: 10px;
                }
                &:hover{
                  transform: translateY(-8px);
                  transition: all .6s linear 0s;
                }
              }
            }
            .list{
              li{
                //height: 420px;
                .boxflex{
                  padding: 45% 0;
                }
              }
            }
          }
        }
      }
    }
    .el-footer{
      text-align: center;
      line-height: 60px;
      color: #fff;
      padding: 0;
    }
  }
}
</style>
