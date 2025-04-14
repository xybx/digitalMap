<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="38%" top="10%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <span class="alper">已阅列表({{readlen ? readlen : 0}}人)</span>
    <el-table v-loading="tabloading" :data="readtableData" border tooltip-effect="dark" max-height="550" :element-loading-text="loadingText">
      <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
      <el-table-column prop="areaname" label="镇街名称" align="center"></el-table-column>
      <el-table-column prop="newInfoReadnum" label="数量" align="center"></el-table-column>
    </el-table>
    <el-divider v-if="state == 1"></el-divider>
    <span class="alper">未阅列表({{overlen ? overlen : 0}}人)</span>
    <el-table v-loading="tabloading" :data="overtableData" border tooltip-effect="dark" max-height="550" :element-loading-text="loadingText">
      <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
      <el-table-column prop="areaname" label="镇街名称" align="center"></el-table-column>
      <el-table-column prop="newInfoReadnum" label="数量" align="center"></el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="state != 0" type="primary" @click="saveData">未阅人员推送</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {getPushuser, getunread, sendMessage,getalread} from '../api/news'
import {getNotRead, sendnewsMessage} from '@/views/numtask/api/task'
export default {
  name: "unread",
  data() {
    return {
      dialogVisible:false,
      title:'',
      pid:null,
      typename:'',
      readtableData:[],
      overtableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      readlen:0,
      overlen:0,
    }
  },
  props:['manage','state'],
  components: {},
  computed: {},
  created() {
  },
  mounted() {
  },
  methods: {
    async getUsers(arr,drr){
      let res = await getPushuser()
      if(res.code == 200 && res.data){
        this.options = res.data.map(item=>{
          return {
            id:item.pid,
            name:item.areaname,
            disabled: drr.includes(item.pid) ? false :true,
            children:item.publicusers ? item.publicusers.map(val=>{
              return {
                id:val.pid,
                name:val.name,
                disabled: arr.includes(val.pid) ? false :true
              }
            }) : []
          }
        })
      }
    },
    async showRead(pid){
      this.pid = pid
      let res = this.manage ? await getNotRead({pid}) : await getunread({pid})
      if(res.code == 200){
        if(this.manage){
          this.typename = res.data.typename
        }
        this.overtableData = res.data ? this.manage ? res.data.map(item=> {
          return {
            areaname:item.areaname,
            newInfoReadnum:item.count
          }
        }) : res.data : []
        this.tabloading = false
        let crr = this.overtableData.map(item=>{
          return item.newInfoReadnum
        })
        this.overlen = this.getSum(crr)
        this.getalread()
        this.title = '查阅管理'
        this.dialogVisible = true
      }else if(res.code == 201){
        this.$message.error(res.msg)
        return false
      }
    },
    async getalread(){
      let res = await getalread({pid:this.pid})
      if(res.code === 200){
        this.readtableData = res.data ? res.data : []
        this.tabloading = false
      }
      let crr = this.readtableData.map(item=>{
        return item.newInfoReadnum
      })
      this.readlen = this.getSum(crr)
    },
    getSum(arr){
      return eval(arr.join('+'))
    },
    // selectChange(val){
    //   this.unData.pushusers = val
    //   this.scrollToBottom()
    // },
    // scrollToBottom(){
    //   this.$nextTick(()=>{
    //     setTimeout(()=>{
    //       let container = this.$el.querySelector(".unper > .el-cascader__tags");
    //       container.scrollTop = container.scrollHeight
    //     },100)
    //   })
    // },
    handleClose(){
      this.title = ''
      this.dialogVisible = false
    },
    async saveData(){
      let params = {pid:this.pid}
      const loading = this.$loading({
        lock: true,
        text: '推送中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      let res = this.manage ? await sendnewsMessage(params) : await sendMessage(params)
      if(res.code == 200){
        loading.close();
        this.$message.success('推送成功')
        this.handleClose()
        this.$emit('getData')
      }else if(res.code == 201){
        loading.close();
        this.$message.error(res.msg)
        return false
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.el-dialog__body{
  .alper{
    font-size: 15px;
    color:#0b87c1;
    display: block;
    margin-bottom: 10px;
  }
  .el-divider--horizontal{
    margin:20px 0;
    height:2px;
  }
  .el-form{
    .pernum{
      display: block;
      margin-bottom: 15px;
      color:#0b87c1;
      padding-left: 12px;
      font-size: 15px;
      margin-top: 15px;
    }
    .el-form-item{
      .el-input, .el-select,.el-textarea ,.el-cascader{
        width: 100%;
      }
      ::v-deep{
        .el-input--small .el-input__inner{
          height: 38px;
          line-height: 38px;
        }
        .numper{
          font-size: 15px;
          color: #0b87c1;
        }
        .el-select{
          .el-select__tags{
            flex-direction:row;
            max-height:100px;
            overflow-y:auto;
            .el-tag{
              width: 31%;
              display: inline-flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              &:first-child{
                margin-left: 10px;
              }
            }
          }
          .el-input{
            .el-input__inner{
              height: 100px!important;
            }
          }
        }
        .el-cascader{
          .el-cascader__tags{
            flex-direction: row;
            max-height: 160px;
            overflow-y: auto;
            .el-tag{
              width: 48%;
              &:first-child{
                margin-left: 10px;
              }
            }
          }
        }
      }
    }
  }
}
.el-dialog__footer{
  .el-button{
    padding:11px 25px;
    font-size: 15px;
  }
}
</style>
