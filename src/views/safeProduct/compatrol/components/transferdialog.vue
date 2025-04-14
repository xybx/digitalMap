<template>
  <el-dialog :visible.sync="transferdialogVisible" :title="title" width="30%" top="10%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="innerData" :model="innerData" :rules="inruels" status-icon label-width="80px">
      <el-form-item label="选择人员" prop="touid">
        <el-cascader v-model="innerData.touid" :options="options" :props="props" filterable placeholder="请选择人员" @change="transChange"></el-cascader>
      </el-form-item>
      <el-form-item label="办理意见" prop="idea">
        <el-input v-model="innerData.idea" type="textarea" :rows="5" placeholder="请输入办理意见" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="medium"  @click="savedata">确 定</el-button>
      <el-button plain size="medium" @click="handleClose">取 消</el-button>
   </span>
  </el-dialog>
</template>

<script>
import {getTransfer,getDepart} from '../api/patrol'
import {mapGetters} from "vuex";
export default {
  name: "transferdialog",
  data() {
    return {
      transferdialogVisible:false,
      title:'',
      innerData:{},
      inruels:{
        touid:[{required: true, trigger: "change", message: "请选择转办人"}]
      },
      options: [],
      props: {
        emitPath:false,
        expandTrigger: 'hover',
        value: "id",
        label: "name",
        children: "children",
      },
      pid:null
    }
  },
  components: {},
  computed: {
    ...mapGetters({
      userData:'user/userData'
    })
  },
  created() {
  },
  mounted() {
    this.getUserData()
  },
  methods: {
    showtransfer(pid){
      this.pid = pid
      this.title = '转办选择'
      this.transferdialogVisible = true
    },
    async getUserData(){
      let res = await getDepart()
      if(res.code === 200){
        this.options = res.data.map(item=>{
          return {
            id:item.pid,
            name:item.name,
            children:item.userList.map(val=>{
              return {
                id:val.pid,
                name:val.username,
              }
            })
          }
        })
      }
    },
    transChange(val){
      console.log(val)
      this.innerData.touid = val
    },
    savedata(){
      this.$refs.innerData.validate(async (valid)=>{
        if(valid){
          let data = {
            pid:this.pid,
            touid:this.innerData.touid,
            idea:this.innerData.idea
          }
          let res = await getTransfer(data)
          if(res.code === 200){
            this.$message.success('已转办')
            this.handleClose()
            this.$emit('transferclose')
            this.$emit('getData')
          }
        }else{
          return false
        }
      })

    },
    handleClose(){
      this.transferdialogVisible = false
      this.title = ''
      this.innerData = this.$options.data().innerData
      this.$refs.innerData.resetFields()
    },
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__body{
  .el-cascader{
    width: 100%;
  }
}
</style>
