<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="40%" top="1%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="medium">
      <el-radio-button label="baseinfo">基本信息</el-radio-button>
      <el-radio-button label="flowover">办理流程</el-radio-button>
    </el-radio-group>
    <el-form ref="envData" :model="envData" status-icon label-width="110px">
      <template v-if="tabCard == 'baseinfo'">
        <el-form-item label="村居名称">
          <el-input v-model="envData.villagename" placeholder="请输入村居名称" disabled />
        </el-form-item>
        <el-form-item label="上报类型">
          <el-input v-model="envData.typename" placeholder="请输入上报类型" disabled />
        </el-form-item>
        <el-form-item label="上报时间">
          <el-date-picker v-model="envData.inspectdate" type="date" value-format="yyyy-MM-dd" placeholder="请选择上报时间" disabled />
        </el-form-item>
        <el-form-item label="上报人">
          <el-input v-model="envData.inspectorname" placeholder="请输入上报人" disabled />
        </el-form-item>
        <el-form-item label="上报内容">
          <el-input v-model="envData.inspectcount" type="textarea" :rows="5" placeholder="请输入上报内容" disabled />
        </el-form-item>
        <el-form-item label="巡查地址">
          <el-input v-model="envData.inspectadress" placeholder="请输入巡查地址" disabled />
        </el-form-item>
        <el-form-item label="位置描述">
          <el-input v-model="envData.addressdes" placeholder="请输入位置描述" disabled />
        </el-form-item>
        <el-form-item label="上报图片">
          <div v-if="!envData.inspectimg" class="imagebox">
            <i class="el-icon-picture-outline"></i>
            <u>暂无图片</u>
          </div>
          <div v-else v-for="item in imgdata">
            <el-image :src="item" :preview-src-list="imgdata" :z-index="2999"></el-image>
          </div>
        </el-form-item>
        <el-form-item label="回复意见" v-if="envData.ideas">
          <el-input v-model="envData.ideas.currentreplay" type="textarea" :rows="5" placeholder="请输入意见回复" disabled />
        </el-form-item>
        <el-form-item label="回复图片" v-if="envData.ideas">
          <div v-if="!envData.ideas.currentimg" class="imagebox">
            <i class="el-icon-picture-outline"></i>
            <u>暂无图片</u>
          </div>
          <div v-for="item in urldata" v-else>
            <el-image :src="item" :preview-src-list="urldata" :z-index="2999"/>
          </div>
        </el-form-item>
        <el-form-item label="巡查定位">
          <Amap :lng='envData.lng' :lat='envData.lat' />
        </el-form-item>
      </template>
    </el-form>
    <template v-if="tabCard === 'flowover'">
      <el-timeline v-if="flowData.length > 0">
        <el-timeline-item v-for="(item,index) in flowData" :key="index" placement="top" :timestamp="item.date ? item.date : ''">
          <div class='timehead'>
            <span>{{ item.name }}</span>
            <i :class='{blue:item.state==1 ||item.state==3,org:item.state == 2,red:item.state == 6,green:item.state == 4 || item.state ==5}'>{{ item.statename }}</i>
          </div>
          <div class='timebody'>
            <span>{{ item.idea ? item.idea: '暂无办理意见' }}</span>
            <el-image v-if='item.imgs && item.imgs.length >0' v-for='(val,key) in item.imgs' :key='key' :src='val' :preview-src-list="item.imgs" :z-index="2999"></el-image>
          </div>
        </el-timeline-item>
      </el-timeline>
      <template v-else>
        <span class="noflow">暂无流程</span>
      </template>
    </template>
    <span slot="footer" class="dialog-footer">
      <el-button size="-" @click="handleClose">返 回</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Amap from '@/components/Amap'
import {getidea, getTail} from "@/views/environment/api/environment";
export default {
  name: "enviroment",
  data() {
    return {
      tabCard:'baseinfo',
      dialogVisible:false,
      title:'',
      envData:{},
      imgdata:[],
      urldata:[],
      flowData:[],
    }
  },
  components: {
    Amap
  },
  computed: {},
  created() {
  },
  mounted() {
  },
  methods: {
    async showEdit(pid){
      if(pid){
        this.title = '人居环境详情'
        let res = await getTail({pid})
        this.envData = res.data ? res.data : {}
        this.imgdata = res.data.inspectimg && res.data.inspectimg != '' ? res.data.inspectimg.split(',').map(item=>{return `${this.$baseUrl}/gridfs/image/${item}`}): []
        this.urldata = res.data.ideas && res.data.ideas.currentimg ? res.data.ideas.currentimg.split(',').map(item=>{return `${this.$baseUrl}/gridfs/image/${item}`}) : []
        this.envData.lng = res.data.coordinate && res.data.coordinate!= '' ? res.data.coordinate.split(',')[0] : ''
        this.envData.lat = res.data.coordinate && res.data.coordinate!= '' ? res.data.coordinate.split(',')[1] : ''
      }
      this.getidea()
      this.dialogVisible = true
    },
    async getidea(){
      let res = await getidea({pid:this.envData.pid})
      this.flowData = res.data.length > 0 ? res.data.reverse().map(item=> {
        return {
          date:item.currentdate,
          name:item.currentuname,
          idea:item.currentreplay,
          imgs:item.currentimg && item.currentimg != '' ? item.currentimg.split(',').map(val=>{return `${this.$baseUrl}/gridfs/image/${val}`}) : '',
          state:item.currentstate,
          statename:item.currentstatename
        }
      }) : []
    },
    tabChange(val){
      this.tabCard = val;
    },
    handleClose(){
      this.title = '';
      this.tabCard = 'baseinfo';
      this.envData = this.$options.data().envData;
      this.dialogVisible = false;
    },
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__wrapper{
  background: rgba(0,0,0,.6);
  ::v-deep{
    .el-dialog{
      background: rgba(2, 30, 65, .8);
      .el-dialog__header{
        background:rgba(16, 97, 159, .6);
        border:1px solid #2F9DF2;
        .el-dialog__title{
          color: #fff;
        }
        .el-dialog__headerbtn{
          i{
            color:#fff;
          }
        }
      }
      .el-dialog__body{
        .radiogroup {
          display: block;
          text-align: center;
          margin-bottom: 25px;
          .el-radio-button{
            .el-radio-button__orig-radio:checked + .el-radio-button__inner{
              background-color: #216DA9;
              border-color: #216DA9;
              color: #fff;
            }
            .el-radio-button:first-child .el-radio-button__inner{
              border-color: #216DA9;
            }
            .el-radio-button__inner{
              background: none;
              color:#9AD2FF;
              border-color: #216DA9;
            }
          }
        }
      }
    }
  }
  .el-dialog__body{
    .el-form{
      .el-form-item{
        .el-input, .el-select,.el-textarea ,.el-cascader{
          width:100%;
        }
        ::v-deep{
          .el-form-item__label{
            color:#4997D6;
          }
          .el-textarea__inner{
            background: none;
            border-color:#216DA9;
            color: #fff;
          }
          .el-input--small .el-input__inner{
            height: 38px;
            line-height: 38px;
            background: none;
            border-color:#216DA9;
            color: #fff;
          }
          .map-show{
            width:100%;
            height:220px;
            #mapShow{
              width: 100%;
              height: 100%;
            }
          }
          .imagebox{
            width: 150px;
            height: 150px;
            background-color: #f3f3f3;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            border-radius: 5px;
            i{
              font-size: 30px;
              color: #999;
            }
            u{
              text-decoration: none;
              font-size: 15px;
              color: #999;
            }
          }
          .el-image{
            width: 150px;
            height: 150px;
            float: left;
            border-radius: 5px;
            box-shadow: 0 1px 3px 1px rgba(0,0,0,.1);
            margin-right: 10px;
            margin-bottom: 10px;
          }
        }
      }
    }
    .el-timeline{
      .el-timeline-item{
        .el-timeline-item__timestamp.is-top{
          display: inline-block;
        }
        ::v-deep{
          .el-timeline-item__node{
            background-color:#4997D6;
          }
        }
        .el-timeline-item__content{
          .timehead{
            position: absolute;
            top: -1px;
            left: 170px;
            display: flex;
            flex-direction: row;
            align-items: center;
            span{
              font-size: 16px;
              color:#4997D6;
            }
            i{
              margin-left: 20px;
              font-size: 15px;
              border:1px solid;
              border-radius: 25px;
              padding:2px 12px;
              color:#FD7837;
              font-style: inherit;
              &.blue{
                color:#2E8CFF;
                border-color: #2E8CFF;
              }
              &.org{
                color:#FD7837;
                border-color: #FD7837;
              }
              &.grey{
                color: #999999;
                border-color: #999;
              }
            }
          }
          .timebody{
            background-color:rgba(33, 109, 169, .3);
            padding: 10px 15px;
            margin-top: 15px;
            span{
              color: #fff;
              font-size: 15px;
              display: block;
              margin-bottom: 12px;
            }
            .el-image{
              width: 120px;
              height: 120px;
              margin-right: 12px;
            }
          }
        }
      }
    }
    .noflow{
      font-size: 16px;
      color: #999;
      display: block;
      text-align: center;
    }
  }
  .el-dialog__footer{
    .el-button{
      padding:11px 25px;
      font-size: 15px;
      background-color:#216DA9;
      border-color:#216DA9;
      color: #fff;
    }
  }
}
</style>
