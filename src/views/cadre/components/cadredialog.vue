<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="36%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="formData" :model="formData" :rules="crules" status-icon label-width="80px">
      <div class="titlebox">
          <i></i>
          <span>干部信息</span>
      </div>
      <el-form-item label="姓名">
        <el-input v-model="formData.username" placeholder="请输入姓名" readonly />
      </el-form-item>
      <el-form-item label="单位">
        <el-input v-model="formData.officename" placeholder="请输入单位" readonly />
      </el-form-item>
      <div class="titlebox">
          <i></i>
          <span>群众信息</span>
      </div>
      <el-form-item label="姓名">
        <el-input v-model="formData.panniername" placeholder="请输入姓名" readonly />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formData.pannierphone" placeholder="请输入手机号" readonly />
      </el-form-item>
      <el-form-item label="所属镇街">
        <el-input v-model="formData.areaname" placeholder="请输入所属镇街" readonly />
      </el-form-item>
      <el-form-item label="核验结果" prop="checkstate">
        <el-select v-model="formData.checkstate" placeholder="请选择核验结果" clearable>
          <el-option :value="1" label="待审" disabled></el-option>
          <el-option :value="2" label="已审核"></el-option>
          <el-option :value="3" label="系统自动审核" disabled></el-option>
          <el-option :value="4" label="未通过"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="medium" @click="saveData">保 存</el-button>
      <el-button size="medium" @click="handleClose">返 回</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {putCadreData} from "@/views/cadre/api/cadre";
  export default {
    name: 'cadredialog',
    data() {
      return {
        formData:{},
        dialogVisible:false,
        title: "",
        crules:{
          checkstate:[{required:true,trigger:'change',message:'请选择核验结果'}],
        },
      }
    },
    methods: {
      async showEdit(obj){
        this.title = '编辑台账信息'
        this.formData = obj
        this.dialogVisible = true
      },
      saveData(){
        this.$refs.formData.validate(async (valid)=>{
            if(valid){
              let obj = {pid:this.formData.pid,checkstate:this.formData.checkstate}
              let res = await putCadreData(obj)
              if(res.code == 200){
                this.$message.success('核验成功')
                this.handleClose()
                this.getData()
              }
            }else {
              return false
            }
        })
      },
      handleClose(){
        this.title = ''
        this.$refs.formData.resetFields()
        this.formData = this.$options.data().formData;
        this.dialogVisible = false;
      },
      getData(){
        this.$emit('getData')
      },
    },
  }
</script>

<style lang='scss' scoped>
  .el-dialog__body{
    .el-form{
      .titlebox{
        overflow: hidden;
        padding: 0;
        margin-bottom:20px;
        i{
          display: inline-block;
          width: 4px;
          height: 16px;
          background-color:#0C9ED7;
          position: relative;
          top: 2px;
        }
        span{
          font-size: 16px;
          color: #333;
          margin-left: 10px;
        }
      }
      .el-divider{
        margin: 10px 0;
      }
      .el-form-item{
        .el-input, .el-select,.el-textarea ,.el-cascader{
          width:100%;
        }
        ::v-deep{
          .el-input--small .el-input__inner{
            height: 38px;
            line-height: 38px;
          }
          .map-show{
            width: 100%;
            height: 210px;
            #mapShow{
              width: 100%;
              height: 100%;
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
