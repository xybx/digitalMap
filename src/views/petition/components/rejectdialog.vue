<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="30%" top="10%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="formData" :model="formData" :rules="Rules" status-icon label-width="90px">
        <el-form-item label="不受理原因" prop="idea">
          <el-input v-model="formData.idea" type="textarea" :rows="5" placeholder="请输入不受理原因" />
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" @click="saveData" size="medium">确 定</el-button>
      <el-button size="medium" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {deleteReject,deletereviewReject} from '../api/petion'
export default {
  name: "rejectdialog",
  data(){
    return {
      dialogVisible:false,
      title: "",
      formData:{},
      Rules:{
        idea:[{required: true, trigger: "blur", message: "请填写驳回意见"}]
      },
      pid:null
    }
  },
  props:{
    trial:Boolean
  },
  methods:{
    showreject(pid){
      this.pid = pid
      this.title = '驳回'
      this.dialogVisible = true
    },
    saveData(){
      this.$refs.formData.validate(async (valid)=>{
        if(valid){
          let params = {
            pid:this.pid,
            idea:this.formData.idea
          }
          let res = this.trial ? await deletereviewReject(params) : await deleteReject(params)
          if(res.code === 200){
            this.$message.success('驳回成功')
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
