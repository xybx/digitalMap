<template>
  <el-dialog :visible.sync="indialogVisible" :title="title" width="30%" top="10%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="innerData" :model="innerData" :rules="inruels" status-icon label-width="80px">
      <el-form-item label="处理状态" prop="state">
        <el-select v-model="innerData.state" placeholder="请选择处理状态">
          <el-option :value="2" label="通过"></el-option>
          <el-option :value="3" label="未通过"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处理意见" prop="idea">
        <el-input v-model="innerData.idea" type="textarea" :rows="5" placeholder="请输入处理意见" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="-" @click="savedata">确 定</el-button>
      <el-button plain size="-" @click="handleClose">取 消</el-button>
   </span>
  </el-dialog>
</template>

<script>
import {putCheck} from "../api/environment";
export default {
  name: "indialog",
  data() {
    return {
      indialogVisible:false,
      title:'',
      innerData:{},
      inruels:{
        state:[{required: true, trigger: "change", message: "请选择处理状态"}],
        idea:[{required: true, trigger: "blur", message: "请输入处理意见"}]
      },
      fileLists:[],
      pid:null,
    }
  },
  props:['catenum'],
  components: {
  },
  computed: {},
  created() {
  },
  mounted() {
  },
  methods: {
    showData(pid){
      this.pid = pid
      this.title = '处理'
      this.indialogVisible = true
    },
    savedata(){
      this.$refs.innerData.validate(async (valid)=>{
        if(valid){
          let obj = Object.assign({},{pid:this.pid,state:this.innerData.state,idea:this.innerData.idea})
          let res = await putCheck(obj)
          if(res.code == 200){
            this.$message.success('处理成功')
            this.handleClose()
            this.$emit('getData')
          }
        }else {
          return false
        }
      })
    },
    handleClose(){
      this.title = ''
      this.pid = null
      this.$refs.innerData.resetFields()
      this.innerData = this.$options.data().innerData
      this.indialogVisible = false
    },
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__body{
  .el-select{
    width: 100%;
  }
}
</style>
