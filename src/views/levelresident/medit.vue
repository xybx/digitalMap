<template>
  <div class="medit">
    <el-row :gutter="10">
      <el-col :span="5">
        <el-card class="box-card animate__animated animate__backInLeft leftbox">
          <div slot="header">
            <i></i>
            <span>户信息</span>
          </div>
          <div class="text item">
              <owner ref="owner" :partype="type" :parpid="fid" :rid="rid" @updatebtn="updatebtn" @editdata="editdata"/>
          </div>
        </el-card>
      </el-col>
      <el-col :span="19">
        <el-card class="box-card animate__animated animate__backInRight tails">
          <div class="text item">
            <el-tabs v-model="activeName" type="border-card" @tab-click="tabChange">
              <el-tab-pane label="基本信息" name="base">
                <baseinfo ref="base" :partype="type" :parpid="fid" :cardid="mid" :rid="rid" :btndisabled="btndisabled" :isedit="isedit" @savebase="savebase" @goback="goback" />
              </el-tab-pane>
              <el-tab-pane label="扶贫信息" name="poor">
                <poorinfo ref="poor" :partype="type" :parpid="fid" :cardid="mid" :btndisabled="btndisabled" :isedit="isedit" @savepoor="savepoor" @goback="goback" />
              </el-tab-pane>
              <el-tab-pane label="医疗健康" name="heal">
                <healinfo ref="heal" :partype="type" :parpid="fid" :cardid="mid" :btndisabled="btndisabled" :isedit="isedit" @saveheal="saveheal" @goback="goback" />
              </el-tab-pane>
              <el-tab-pane label="党政信息" name="gover">
                <goverinfo ref="gover" :partype="type" :parpid="fid" :cardid="mid" :btndisabled="btndisabled" :isedit="isedit" @savegover="savegover" @goback="goback" />
              </el-tab-pane>
              <el-tab-pane label="民政优抚" name="treat">
                <treatinfo ref="treat" :partype="type" :parpid="fid" :cardid="mid" :btndisabled="btndisabled" :isedit="isedit" @savetreat="savetreat" @goback="goback"/>
              </el-tab-pane>
              <el-tab-pane label="就业技能" name="employ">
                <employinfo ref="employ" :partype="type" :parpid="fid" :cardid="mid" :btndisabled="btndisabled" :isedit="isedit" @saveskill="saveskill" @goback="goback" />
              </el-tab-pane>
              <el-tab-pane label="信访" name="letter">
                <letterinfo ref="letter" :partype="type" :parpid="fid" :cardid="mid" :btndisabled="btndisabled" :isedit="isedit" @saveletter="saveletter" @goback="goback" />
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import owner from "./components/owner";
import baseinfo from "./components/baseinfo";
import poorinfo from "./components/poorinfo";
import healinfo from "./components/healinfo";
import goverinfo from "./components/goverinfo";
import treatinfo from "./components/treatinfo";
import employinfo from "./components/employinfo";
import letterinfo from "./components/letterinfo";
export default {
  name: "medit",
  data() {
    return {
      activeName:'base',
      type:this.$route.query.type || null,
      fid:this.$route.query.fid || null,
      mid:this.$route.query.mid || null,
      rid:this.$route.query.rid || null,
      base:false,
      poor:false,
      heal:false,
      gover:false,
      treat:false,
      skill:false,
      letter:false,
      bData:{},
      btndisabled:false,
      isedit:false
    }
  },
  components: {
    owner,
    baseinfo,
    poorinfo,
    healinfo,
    goverinfo,
    treatinfo,
    employinfo,
    letterinfo,
  },
  mounted() {
    if(!this.fid && !this.mid && !this.type){
      this.btndisabled = true
    }else {
      this.btndisabled = false
    }
    if(this.fid){
      this.$refs.owner.showData()
    }
    if(this.mid){
      this.$refs.base.showData()
    }
  },
  methods: {
    tabChange(val){
      if(this.type == 1 || this.type == 2){
        this.$forceUpdate()
        this.$refs[val.name].showData()
      }
      let content = '' , aname = ''
      if(this.isedit){
        content = '您已修改户信息请保存'
        aname = this.activeName
      }else if(this.base){
        content = '请保存基本信息'
        aname = 'base'
      }else if(this.poor){
        content = '请保存扶贫信息'
        aname = 'poor'
      }else if(this.heal){
        content = '请保存医疗健康'
        aname = 'heal'
      }else if(this.gover){
        content = '请保存党政信息'
        aname = 'gover'
      }else if(this.treat){
        content = '请保存民政优抚'
        aname = 'treat'
      }else if(this.employ){
        content = '请保存就业技能'
        aname = 'employ'
      }else if(this.letter){
        content = '请保存信访'
        aname = 'letter'
      }
      if(this.base || this.poor || this.heal || this.gover || this.treat || this.employ || this.letter){
        if(!this.btndisabled){
          this.$confirm(content,'提示信息',{
            type:'warning',
            confirmButtonText:'去保存',
            showCancelButton:false,
            closeOnClickModal: false,
            lockScroll:false
          }).then(()=>{
            this.activeName = aname
          })
        }
      }
    },
    updatebtn(val){
      this.btndisabled = val
    },
    editdata(val){
      this.isedit = val
    },
    savebase(val){
      this.base = val
    },
    savepoor(val){
      this.poor = val
    },
    saveheal(val){
      this.heal = val
    },
    savegover(val){
      this.gover = val
    },
    savetreat(val){
      this.treat = val
    },
    saveskill(val){
      this.skill = val
    },
    saveletter(val){
      this.letter = val
    },
    goback(){
      this.$router.replace({
        path:'/levpeo'
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.medit{
  padding: 10px;
  .el-row{
    .el-col{
      .el-card{
        min-height: calc(100vh - 100px)!important;
        margin-bottom: 0;
        &.tails{
          background:none;
          ::v-deep{
            .el-card__body{
              padding: 0;
              background:none;
              .el-tabs{
                min-height: calc(100vh - 102px);
                border:none;
                .el-tabs__header{
                  .el-tabs__nav-scroll{
                    .el-tabs__item{
                      height: 47px;
                      line-height: 47px;
                      font-size: 15px;
                    }
                  }
                }
              }
            }
          }
        }
        &.leftbox{
          ::v-deep{
            .el-card__body{
              padding:8px 12px;
            }
          }
        }
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
              height:16px;
              background-color:#0C9ED7;
              display: inline-block;
              position: relative;
              top: 3px;
            }
          }
          .el-card__body{

          }
        }
      }
    }
  }
}
</style>
