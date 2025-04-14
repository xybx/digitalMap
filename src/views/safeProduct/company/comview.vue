<template>
  <div class="comview">
  <el-card class="box-card">
      <div slot="header">
        <i></i>
        <span>企业管理查看</span>
      </div>
      <div class="text item warpbox">
        <el-container>
          <el-aside>
            <el-tree class="filter-tree" v-loading="loading" element-loading-text="列表加载中" element-loading-spinner="el-icon-loading":data="treeData" :props="defaultProps" :highlight-current="highcurrent" default-expand-all :current-node-key="currentkey"  ref="tree" @node-click="menuClick">
                <span class="custom-tree-node" slot-scope="{ node,data }" :class="!data.children ? 'nochild': ''">
                    <span :title="node.label" class="nodeShow">
                        <i class="icon iconfont" :class="data.children ? 'icon-2': 'icon-wenjian'"></i>
                        {{node.label}}
                    </span>
                </span>
            </el-tree>
          </el-aside>
          <el-main>
            <baseInfo v-if="baseinfo" :pid="pid"/>
            <safePro v-if="safePro" :pid="pid" :dirid="dirid" />
            <device v-if="device" :pid="pid" />
            <comlocation v-if="comlocation" :pid="pid"/>
            <energy v-if="energy" :pid="pid" />
          </el-main>
        </el-container>
      </div>
  </el-card>
  </div>
</template>

<script>
import {getcatalogue} from './api/company'
import baseInfo from "./components/baseInfo"
import safePro from "./components/safePro"
import device from "./components/device";
import comlocation from "./components/comlocation";
import energy from "./components/energy";
export default {
  name: "comview",
  data() {
    return {
      pid:this.$route.query.pid || null,
      treeData:[],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      loading: true,
      highcurrent:true,
      currentkey:'',
      baseinfo:false,
      safePro:false,
      device:false,
      comlocation:false,
      energy: false,
      dirid: null,
    }
  },
  components: {
    baseInfo,
    safePro,
    device,
    comlocation,
    energy,
  },
  computed: {},
  created() {
  },
  mounted() {
    this.getTreeData()
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        if(val.path == '/comview'){
         this.getTreeData()
        }
      },
      deep: true,
    },
  },
  methods: {
    async getTreeData(){
        let res = await getcatalogue()
        let arr = ['基本信息','企业安全生产','企业环保材料','设备清单','能耗报表','企业位置']
        let crr = arr.map(item=>{
          if(item == '企业安全生产'){
            return {
                label:item,
                children:res.data.production.map(val=>{
                  return {
                    label: val.name,
                    type: val.type,
                    pid: val.pid,
                  }
                })
            }
          }else if(item == '企业环保材料'){
            return {
              label:item,
              children:res.data.protection.map(val=>{
                return {
                  label: val.name,
                  type: val.type,
                  pid: val.pid,
                }
              })
            }
          }else{
            return {
              label:item
            }
          }
        })
        this.treeData = [{label: '企业信息', children:crr}]
        this.currentkey = '基本信息'
        this.baseinfo = true
        this.loading = false
    },
    closeCom() {
      this.baseinfo = false
      this.safePro = false
      this.envmaterial = false
      this.device = false
      this.energy = false
      this.comlocation = false
    },

    menuClick(data,node){
      this.dirid = data.pid
      this.closeCom()
      if(data.label == '基本信息'){
        this.baseinfo = true
      }else if (data.type === 1 || data.type === 2) {
        this.safePro = true
      } else if (data.label == '设备清单') {
        this.device = true
      } else if (data.label == '能耗报表') {
        this.energy = true
      } else if (data.label == '企业位置') {
        this.comlocation = true
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.comview{
  width: 100%;
  background: none!important;
  padding: 0!important;
  .el-card{
    min-height: calc(100vh - 104px)!important;
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
          background-color:#0C9ED7;
          display: inline-block;
          position: relative;
          top: 4px;
        }
      }
      .el-card__body{
        padding:10px;
        height:calc(100vh - 206px);
       .warpbox{
          height:100%;
          .el-container{
            min-height:100%;
            .el-aside{
              width:266px!important;
              border: 1px solid #EBEEF5;
              .filter-tree{
                .el-tree-node__children{
                  .is-current{
                    span{
                      &.nochild{
                        color:#1296DB;
                      }
                    }
                  }
                }
                span{
                  i{
                    font-size:18px;
                    &.icon-2{
                      color:#1c94d8;
                    }
                  }
                }
              }
            }
            .el-main{
              padding: 0;
              margin-left: 10px;
            }
          }
       }
      }
    }
  }
}
</style>
