<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="35%" top="5%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="medium">
      <el-radio-button label="baseinfo">基本信息</el-radio-button>
      <el-radio-button label="flowover">办理流程</el-radio-button>
    </el-radio-group>
    <el-form v-if="tabCard === 'baseinfo'" ref="formData" :model="formData" status-icon label-width="85px">
      <el-form-item label="选择类别">
        <el-input v-model="formData.typename" placeholder="请输入选择类别" disabled />
      </el-form-item>
      <el-form-item label="上报时间">
        <el-date-picker v-model="formData.startdate" type="date" value-format="yyyy-MM-dd" placeholder="请选择上传时间" disabled />
      </el-form-item>
      <el-form-item label="事件内容">
        <el-input v-model="formData.repconten" type="textarea" :rows="5" placeholder="请输入事件内容" disabled />
      </el-form-item>
      <el-form-item label="上传地址">
        <el-input v-model="formData.address" placeholder="请输入上传地址" disabled />
      </el-form-item>
      <el-form-item label="图片展示">
        <div v-if="!imgdata.length" class="imagebox">
          <i class="el-icon-picture-outline"></i>
          <u>暂无图片</u>
        </div>
        <div v-for="item in imgdata" v-else>
          <el-image :src="item" :preview-src-list="imgdata" :z-index="2999"></el-image>
        </div>
      </el-form-item>
      <el-form-item label="驳回意见" v-if="formData.rejection">
        <el-input v-model="formData.rejection" type="textarea" :rows="5" placeholder="请输入驳回意见" disabled />
      </el-form-item>
      <el-form-item label="回复意见" v-if="formData.admincontent">
        <el-input v-model="formData.admincontent" type="textarea" :rows="5" placeholder="请输入意见回复" disabled />
      </el-form-item>
      <el-form-item label="回复图片" v-if="formData.adminimages && formData.adminimages.length">
        <div v-if="!urldata.length" class="imagebox">
          <i class="el-icon-picture-outline"></i>
          <u>暂无图片</u>
        </div>
        <div v-for="item in urldata" v-else>
          <el-image :src="item" :preview-src-list="urldata" :z-index="2999"/>
        </div>
      </el-form-item>
      <el-form-item label="评价时间" v-if="formData.appdate">
        <el-date-picker v-model="formData.appdate" type="date" value-format="yyyy-MM-dd" placeholder="请选择评价时间" disabled />
      </el-form-item>
      <el-form-item label="评价等级" v-if="formData.apprank">
        <el-select v-model="formData.apprank" placeholder="请选择评价等级" disabled>
          <el-option :value="0" label="非常满意"></el-option>
          <el-option :value="1" label="满意"></el-option>
          <el-option :value="2" label="不满意"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div v-if="tabCard === 'flowover'">
      <el-timeline v-if="flowData.length > 0">
        <el-timeline-item
          v-for="(item,index) in flowData"
          :key="index"
          placement="top"
          :timestamp="item.date ? item.date : ''">
          <div class='timehead'>
            <span>{{ item.username }}</span>
          </div>
          <div class='timebody'>
            <span>{{ item.opinion ? item.opinion:'' }}</span>
          </div>
        </el-timeline-item>
      </el-timeline>
      <template v-else>
        <span class="noflow">暂无流程</span>
      </template>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">返 回</el-button>
    </span>
  </el-dialog>
</template>

<script>
import UploadImg from "@/components/UploadImg";
import {mapGetters} from 'vuex'
import {getIdea, getReadData} from "@/views/conven/api/conven";
export default {
  name: "conven",
  data() {
    return {
      dialogVisible:false,
      title: "",
      typeData:[],
      formData:{},
      fileLists:[],
      type:1,
      hclick:false,
      imgdata:[],
      urldata:[],
      tabCard: "baseinfo",
      flowData:[]
    }
  },
  components: {
    UploadImg
  },
  computed: {
    ...mapGetters({
      userData:'user/userData'
    })
  },
  created() {
  },
  mounted() {
  },
  methods: {
    async showEdit(id){
        this.title = '查看记录查询';
        let res = await getReadData({pid:id})
        if(res.code === 200){
          this.formData = res.data
        }else if(res.code === 500){
          this.$message.warning('没有此条数据！')
          return false
        }
        if(res.data.arepimages && res.data.arepimages.length){
          this.imgdata = res.data.arepimages.map(item=>{
            return `${this.$baseUrl}/gridfs/image/${item.fileid}`
          })
        }else {
          this.imgdata = []
        }
        if(res.data.adminimages && res.data.adminimages.length){
          this.urldata = res.data.adminimages.map(item=>{
            return `${this.$baseUrl}/gridfs/image/${item.fileid}`
          })
        }else{
          this.urldata = []
        }
        this.getconIdea(id)
        this.dialogVisible = true
    },
    async getconIdea(id){
      let res = await getIdea({pid:id})
      this.flowData = res.data.map(item=>{
        return {
          username:item.username,
          opinion:item.opinion? item.opinion : '',
          date:item.date ? item.date : ''
        }
      })
    },
    tabChange(val){
      this.tabCard = val;
    },
    handleClose(){
      this.dialogVisible = false;
      this.tabCard = 'baseinfo'
      // this.$refs.formData.resetFields();
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
}
.el-dialog__body{
  .el-form{
    .el-form-item{
      .el-input, .el-select,.el-textarea ,.el-cascader{
        width: 100%;
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
        overflow: hidden;
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
</style>
