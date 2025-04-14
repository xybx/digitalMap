<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="35%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="comData" :model="comData" :rules="rules" status-icon label-width="80px">
      <el-form-item label="类别名称" prop="name">
        <el-input v-model="comData.name" placeholder="请输入类别名称" />
      </el-form-item>
      <template v-if="info">
        <el-form-item label="分类" prop="type">
          <el-select v-model="comData.type" placeholder="请选择分类">
            <el-option :value="1" label="企业安全生产"></el-option>
            <el-option :value="2" label="企业环保资料"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="comData.sort" placeholder="请输入排序" />
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="keys" type="primary" size="-" @click="saveData">确 定</el-button>
      <el-button size="-" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {isNumber} from "@/utils/validate";
import {getcominfo, getpatrol, putcominfo, putpatrol} from "@/views/safeProduct/manage/api/comage";
export default {
  name: "comdialog",
  data() {
    let numberValid = (rule, value, callback)=>{
      if(!isNumber(value)){
        return callback(new Error('排序必须是数字'))
      }else {
        callback()
      }
    }
    return {
      dialogVisible:false,
      title:'',
      comData:{},
      rules:{
        name:[{required: true, trigger: "blur", message: "请输入类别名称"}],
        type:[{required: true, trigger: "change", message: "请选择分类"}],
        sort:[{required: false, validator:numberValid, trigger: "blur"}],
      },
      keys:true
    }
  },
  props:['info'],
  components: {},
  computed: {},
  created() {
  },
  mounted() {
  },
  methods: {
   async showData(pid,index){
      if(!pid){
        this.title = this.info ? '新增企业信息目录':'新增巡查类型'
      }else {
        this.keys = index ==1 ? false : true
        this.title = this.info ?  index ==1 ? '查看企业信息目录':'编辑企业信息目录' : index ==1 ? '查看巡查类型':'编辑巡查类型'
        let res = this.info ? await getcominfo({pid}) : await getpatrol({pid})
        if(res.code == 200){
          this.comData = res.data
        }
      }
      this.dialogVisible = true
    },
    saveData(){
      this.$refs.comData.validate(async (valid)=>{
        if(valid){
          let res = this.info ? await putcominfo(this.comData) : await putpatrol(this.comData)
          if(res.code === 200){
            this.$message.success(this.comData.pid ? '修改成功' : '添加成功')
            this.handleClose()
            this.$emit('getData')
          }
        }else{
          return false
        }
      })
    },
    handleClose(){
      this.title = ''
      this.keys = true
      this.$refs.comData.resetFields()
      this.comData = this.$options.data().comData
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
