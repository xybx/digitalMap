<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="45%" top="3%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="medium">
      <el-radio-button label="baseinfo">基本信息</el-radio-button>
      <el-radio-button label="flowover">办理流程</el-radio-button>
    </el-radio-group>
    <el-form v-if="tabCard === 'baseinfo'" :inline="true" ref="formData" :model="formData" status-icon label-width="80px">
      <el-form-item label="企业名称">
        <el-input v-model="formData.company" placeholder="请输入企业名称" disabled />
      </el-form-item>
      <el-form-item label="巡查类别">
        <el-input v-model="formData.classname" placeholder="请输入巡查类别" disabled />
      </el-form-item>
      <el-form-item label="办理方式">
        <el-select v-model='formData.typeid' placeholder="请输入办理方式" disabled>
          <el-option label='企业处理' :value='0'></el-option>
          <el-option label='人员处理' :value='1'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="巡查时间">
        <el-date-picker v-model="formData.addtime" type="date" value-format="yyyy-MM-dd" placeholder="请选择巡查时间" disabled />
      </el-form-item>
      <el-form-item label="巡查人">
        <el-input v-model="formData.xcperson" placeholder="请输入巡查人" disabled />
      </el-form-item>
      <el-form-item label="巡查内容">
        <el-input v-model="formData.remark" type="textarea" :rows="5" placeholder="请输入巡查内容" disabled />
      </el-form-item>
      <el-form-item label="巡查图片">
        <div v-if="!formData.imgs" class="imagebox">
          <i class="el-icon-picture-outline"></i>
          <u>暂无图片</u>
        </div>
        <div v-else v-for="item in imgdata" style="width: 300px">
          <el-image :src="item" :preview-src-list="imgdata" :z-index="2999"></el-image>
        </div>
      </el-form-item>
      <el-form-item label="回复意见" v-if="formData.replyidea">
        <el-input v-model="formData.replyidea.examidea" type="textarea" :rows="5" placeholder="请输入意见回复" disabled />
      </el-form-item>
      <el-form-item label="回复图片" v-if="formData.replyidea">
        <div v-if="!formData.replyidea.examimg" class="imagebox">
          <i class="el-icon-picture-outline"></i>
          <u>暂无图片</u>
        </div>
        <div v-for="item in urldata" v-else style="width: 300px">
          <el-image :src="item" :preview-src-list="urldata" :z-index="2999"/>
        </div>
      </el-form-item>
      <el-form-item label="巡查定位">
        <Amap :lng='formData.lng' :lat='formData.lat' />
      </el-form-item>
    </el-form>
    <div v-if="tabCard === 'flowover'">
      <el-timeline v-if="flowData.length > 0">
        <el-timeline-item v-for="(item,index) in flowData" :key="index" placement="top" :timestamp="item.examdate ? item.examdate : ''">
          <div class='timehead'>
            <span>{{ item.username }}</span>
          </div>
          <div class='timebody'>
            <span>{{ item.examidea ? item.examidea: '暂无办理意见' }}</span>
            <el-image v-if='item.examimg && item.examimg.length >0' v-for='(val,key) in item.examimg' :key='key' :src='val' :preview-src-list="item.examimg" :z-index="2999"></el-image>
          </div>
        </el-timeline-item>
      </el-timeline>
      <template v-else>
        <span class="noflow">暂无流程</span>
      </template>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleClose">返 回</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Amap from '@/components/Amap'
import {getIdea, getpatrolTail} from "@/views/safeProduct/compatrol/api/patrol";
export default {
  name: "patrol",
  data() {
    return {
      formData:{},
      dialogVisible:false,
      title: "",
      tabCard: "baseinfo",
      flowData:[],
      imgdata:[],
      urldata:[],
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
      this.title = '巡查记录详情'
      let res = await getpatrolTail({pid:pid})
      if(res.code === 200){
        this.formData = res.data
      }
      if(res.data.imgs){
        this.imgdata = res.data.imgs.split(',').map(item=>{
          return `${this.$baseUrl}/gridfs/image/${item}`
        })
      }else {
        this.imgdata = []
      }
      if(res.data.replyidea && res.data.replyidea.examimg){
        this.urldata = res.data.replyidea.examimg.split(',').map(item=>{
          return `${this.$baseUrl}/gridfs/image/${item}`
        })
      }else{
        this.urldata = []
      }
      this.getidea(pid)
      this.dialogVisible = true
    },
    async getidea(pid){
      let res = await getIdea({pid:pid})
      if(res.data.length > 0){
        this.flowData = res.data.map(item=>{
          return {
            examdate:item.examdate,
            username:item.username,
            examidea:item.examidea,
            examimg:item.examimg ? item.examimg.split(',').map(val=>{return `${this.$baseUrl}/gridfs/image/${val}`}) : '',
            statue:item.statue,
            isblue:item.statue == 1 ? true : false,
            isorg:item.statue == 2 || item.statue == 5 ? true : false,
            isgrey:item.statue == 3 || item.statue == 4 ? true : false
          }
        })
      }else {
        this.flowData = []
      }
    },
    tabChange(val){
      this.tabCard = val;
    },
    handleClose(){
      this.dialogVisible = false;
      this.tabCard = 'baseinfo'
      this.formData = this.$options.data().formData;
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
          width:300px;
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
            width: 300px;
            height: 210px;
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
            top: 2px;
            left: 170px;
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
