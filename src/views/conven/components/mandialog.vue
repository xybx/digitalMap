<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="35%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="manData" :model="manData" :rules="rules" status-icon label-width="100px">
      <el-form-item label="类别名称" prop="name">
        <el-input v-model="manData.name" placeholder="请输入类别名称" />
      </el-form-item>
      <el-form-item label="审批人" prop="adminuserid">
        <el-select v-model="manData.adminuserid" placeholder="请选择审批人">
          <el-option-group v-for="item in cateData" :key="item.pid" :label="item.name">
            <el-option v-for="val in item.children" :key="val.pid" :label="val.name" :value="val.pid"></el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="积分" prop="integral">
        <el-input v-model="manData.integral" placeholder="请输入积分" />
      </el-form-item>
      <el-form-item label="办理时限(天)" prop="evaldate">
        <el-input v-model="manData.evaldate" placeholder="请输入办理时限" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="manData.descrip" type="textarea" :rows="5" placeholder="请输入描述"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveData">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {getarea, getCate, putCate} from "@/views/conven/api/manage";
import {mapGetters} from "vuex";
import {isNumber} from "@/utils/validate";
export default {
  name: "mandialog",
  data() {
    let numberValid = (rule, value, callback)=>{
     if(!isNumber(value)){
        return callback(new Error('积分必须是数字'))
      }else {
        callback()
      }
    }
    let dateValid = (rule, value, callback)=>{
      if(!value){
        return callback(new Error('请输入办理时限'))
      } else if(!isNumber(value)){
        return callback(new Error('办理时限必须是数字'))
      }else {
        callback()
      }
    }
    return {
      dialogVisible:false,
      title:'',
      manData:{},
      rules:{
        name:[{required: true, trigger: "blur", message: "请输入类别名称"}],
        adminuserid:[{required: true, trigger: "change", message: "请选择类别名称"}],
        integral:[{required: false, validator:numberValid, trigger: "blur"}],
        evaldate:[{required: true, validator:dateValid, trigger: "blur"}],
      },
      cateData:[]
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
  },
  methods: {
    async getUsers(){
      let res = await getarea({pid:this.userData.pid})
      this.cateData = res.data ? res.data.map(item=>{
        return {
          pid:item.pid,
          name:item.name,
          children:item.userList.length > 0 ? item.userList.map(val=>{
            return {
              pid:val.pid,
              name:val.username
            }
          }) :[]
        }
      }) :[]
    },
    async showData(pid){
      this.getUsers()
      this.title = pid ? '编辑类型': '新增类型'
      if(pid){
        let res = await getCate({pid})
        if(res.code == 200){
          this.manData = res.data
        }
      }
      this.dialogVisible = true
    },
    saveData(){
      this.$refs.manData.validate(async (valid)=>{
        if(valid){
          let data = Object.assign(this.manData,{areaid:this.userData.areaid})
          let res = await putCate(data)
          if(res.code == 200){
            this.$message.success(this.manData.pid ? '修改成功' : '添加成功')
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
      this.$refs.manData.resetFields()
      this.manData = this.$options.data().manData
      this.dialogVisible = false
    },
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__body{
  .el-form{
    .el-form-item{
      .el-input, .el-select,.el-textarea ,.el-cascader{
        width: 100%;
      }
      ::v-deep{
        .el-input--small .el-input__inner{
          height: 38px;
          line-height: 38px;
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
