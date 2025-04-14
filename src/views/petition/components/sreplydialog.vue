<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="30%" top="10%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <div class="titflex">
      <i class="el-icon-warning"></i>
      <span>该记录已被督办，请先回复信息</span>
    </div>
    <div class="ideabox" v-if="supervise == 1">
      <div class="idealine"><span>{{sfrom.time}}</span><u>{{sfrom.username}}</u></div>
      <p>{{sfrom.idea}}</p>
    </div>
    <el-form ref="formData" :model="formData" :rules="Rules" status-icon label-width="90px">
      <el-form-item label="督办回复" prop="idea">
        <el-input v-model="formData.idea" type="textarea" :rows="5" placeholder="请输入督办回复" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" @click="saveData" size="medium">确 定</el-button>
      <el-button size="medium" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {putneedreply,getdetail} from '../api/petion'
export default {
  name: "sreplydialog",
  data() {
    return {
      dialogVisible:false,
      title: "",
      formData:{},
      Rules:{
        idea:[{required: true, trigger: "blur", message: "请填写督办回复"}]
      },
      pid:null,
      supervise:null,
      sfrom:{}
    }
  },
  methods: {
    async showreply(pid){
      this.pid = pid
      let res = await getdetail({pid:pid})
      if(res.data){
        this.supervise = res.data.supervise
        this.sfrom = res.data.superviseidea
      }
      this.title = '提示信息'
      this.dialogVisible = true
    },
    saveData(){
      this.$refs.formData.validate(async (valid)=>{
        if(valid){
          let parmas = {
            pid:this.pid,
            idea:this.formData.idea
          }
          let res = await putneedreply(parmas)
          if(res.code === 200){
            this.$message.success('督办已回复')
            this.handleClose()
            this.$emit('getData')
          }
        }else {
          return false
        }
      })
    },
    handleClose(){
      this.pid = null
      this.$refs.formData.resetFields()
      this.formData = this.$options.data().formData
      this.title = ''
      this.dialogVisible = false
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep{
  .el-dialog__body{
    padding-top: 15px;
    .titflex{
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin-bottom:40px;
      i{
        font-size:40px;
        color:#FF9351;
        margin-bottom:20px;
      }
      span{
        font-size:16px;
        color: #333;
        color:#FF9351;
      }
    }
    .ideabox{
      display: flex;
      flex-direction: column;
      padding-left: 15px;
      .idealine{
        overflow: hidden;
        span{
          color: #999;
        }
        u{
          text-decoration: none;
          margin-left: 20px;
          color: #333;
        }
      }
      p{
        padding:10px;
        color: #333;
        background-color:#f0f0f0;
      }
    }
  }
}
</style>
