<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="38%" top="10%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <span class="alper">已阅列表({{tableData.length}}人)</span>
    <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" max-height="550" :element-loading-text="loadingText">
      <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
      <el-table-column prop="name" label="姓名" align="center"></el-table-column>
      <el-table-column prop="villname" label="所属村" align="center"></el-table-column>
    </el-table>
    <el-divider v-if="state == 1"></el-divider>
    <el-form ref="unData" :model="unData" :rules="rules" status-icon label-width="110px">
      <template v-if="manage">
        <span class="pernum">当前分类：{{typename}}  (总共{{unData.pushusers.length}}人)</span>
        <el-form-item label="未阅推送人员" prop="pushusers">
          <el-select v-model="unData.pushusers" multiple placeholder="请选择人员" @change="selectChange">
            <el-option v-for="item in userdata" :key="item.pid" :value="item.pid" :label="item.username"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template v-if="!manage && state == 1">
        <el-form-item label="未阅推送人员" prop="pushusers">
          <el-cascader class="unper" v-model="unData.pushusers" :options="options" :props="props" filterable placeholder="请选择推送人员"></el-cascader>
          <span class="numper">(未阅人员总共{{unData.pushusers.length}}人)</span>
        </el-form-item>
      </template>
    </el-form>
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
      unData:{
        pushusers:[]
      },
      rules:{
        pushusers:[{required: true, trigger: "blur", message: "请选择推送人员"}]
      },
      userdata:[],
      options:[],
      props:{
        emitPath:false,
        multiple:true,
        expandTrigger: 'click',
        value: "id",
        label: "name",
        children: "children",
      },
      pid:null,
      typename:'',
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
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
        this.unData.pushusers = this.manage ? res.data.list.map(item=> item.pid) : res.data.map(item=> item.pid)
        if(this.manage){
          this.typename = res.data.typename
          this.userdata = res.data.list.map(item=>{
            return {
              pid:item.pid,
              username:item.username
            }
          })
        }else{
          let drr = res.data.map(item => item.villageid)
          this.$nextTick(()=>{
            this.getUsers(this.unData.pushusers,[...new Set(drr)])
          })
          this.scrollToBottom()
        }
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
        this.tableData = res.data ? res.data : []
        this.tabloading = false
      }
    },
    selectChange(val){
      this.unData.pushusers = val
      this.scrollToBottom()
    },
    scrollToBottom(){
      this.$nextTick(()=>{
        setTimeout(()=>{
          let container = this.$el.querySelector(".unper > .el-cascader__tags");
          container.scrollTop = container.scrollHeight
        },100)
      })
    },
    handleClose(){
      this.title = ''
      this.dialogVisible = false
      this.$refs.unData.resetFields();
      this.unData = this.$options.data().unData;
    },
    saveData(){
      this.$refs.unData.validate(async (valid)=>{
        if(valid){
          let params = {pid:this.pid,userIds:this.unData.pushusers}
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
        }else {
          return false
        }
      })
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
