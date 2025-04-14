<template>
  <el-dialog :visible.sync="rejectdialogVisible" :title="title" width="30%" top="10%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="innerData" :model="innerData" :rules="inruels" status-icon label-width="80px">
      <el-form-item label="驳回意见" prop="idea">
        <el-input v-model="innerData.idea" type="textarea" :rows="5" placeholder="请输入驳回意见" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="medium"  @click="savedata">确 定</el-button>
      <el-button plain size="medium" @click="handleClose">取 消</el-button>
   </span>
  </el-dialog>
</template>

<script>
import {getReject} from '../api/patrol'
export default {
  name: "rejectdialog",
  data() {
    return {
      rejectdialogVisible:false,
      title:'',
      innerData:{},
      inruels:{
        idea:[{required: true, trigger: "blur", message: "请输入驳回意见"}]
      },
      pid:null
    }
  },
  components: {},
  computed: {},
  created() {
  },
  mounted() {
  },
  methods: {
    showreject(pid){
      this.pid = pid
      this.title = '驳回反馈'
      this.rejectdialogVisible = true
    },
    handleClose(){
      this.rejectdialogVisible = false
      this.title = ''
      this.innerData = this.$options.data().innerData
      this.$refs.innerData.resetFields()
    },
    savedata(){
      this.$refs.innerData.validate(async (valid)=>{
        if(valid){
          let data = {
            pid:this.pid,
            idea:this.innerData.idea
          }
          let res = await getReject(data)
          if(res.code === 200){
            this.$message.success('已驳回')
            this.handleClose()
            this.$emit('rejectclose')
            this.$emit('getData')
          }
        }else{
          return false
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
