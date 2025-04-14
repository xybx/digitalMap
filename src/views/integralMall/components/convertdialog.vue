<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="32%" top="6%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="formdata" :model="formdata" :rules="Rules" status-icon label-width="100px">
      <el-form-item label="姓名">
        <el-input v-model="formdata.pusername" placeholder="请输入姓名" disabled />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formdata.phone" placeholder="请输入手机号" disabled />
      </el-form-item>
      <el-form-item label="兑换商品">
        <el-input v-model="formdata.goodsname" placeholder="请输入兑换商品" disabled />
      </el-form-item>
      <el-form-item label="兑换数量">
        <el-input v-model="formdata.count" placeholder="请输入兑换数量" disabled />
      </el-form-item>
      <el-form-item label="消耗积分">
        <el-input v-model="formdata.consume" placeholder="请输入消耗积分" disabled />
      </el-form-item>
      <el-form-item label="订单编号">
        <el-input v-model="formdata.reference" placeholder="请输入订单编号" disabled />
      </el-form-item>
      <template v-if="!history">
        <el-form-item label="验证码" prop="code">
          <el-input v-model="formdata.code" placeholder="请输入验证码" class="codeinput" />
          <el-button :type="!disabled ? 'primary': 'info'" size="medium" class="codebtn" :disabled="disabled" @click="senCode(formdata.pid)">{{text}}</el-button>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="归属地">
          <el-input v-model="formdata.villagename" placeholder="请输入归属地" disabled />
        </el-form-item>
        <el-form-item label="兑换时间">
          <el-input v-model="formdata.onlinetime" placeholder="请输入兑换时间" disabled />
        </el-form-item>
        <el-form-item label="兑换工作人员">
          <el-input v-model="formdata.collatorname" placeholder="请输入兑换工作人员" disabled />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-input v-model="formdata.statename" placeholder="请输入订单状态" disabled />
        </el-form-item>
        <el-form-item label="核兑时间">
          <el-input v-model="formdata.offlinetime" placeholder="请输入核兑时间" disabled />
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <template v-if="!history">
        <el-button type="primary" size="medium" @click="saveData">确 认</el-button>
        <el-button size="medium" @click="handleClose">取 消</el-button>
      </template>
      <template v-else>
        <el-button size="medium" @click="handleClose">返 回</el-button>
      </template>
    </span>
  </el-dialog>
</template>

<script>
import {getconTail,putconvert,sendcode,getordertail} from '../api/convert'
export default {
  name: "convertdialog",
  data() {
    return {
      dialogVisible:false,
      title:'',
      formdata:{
        code:'',
      },
      Rules:{
        code:[{required: true, trigger: "blur", message: "请输入验证码"}]
      },
      disabled:false,
      text:'发送验证码',
      timer:null,
      count:null
    }
  },
  props:{
    history:Boolean,
  },
  components: {},
  computed: {},
  created() {
  },
  mounted() {
  },
  methods: {
    //父级调用弹出框方法
    async showEdit(pid){
        if(this.history){
          this.title = '订单记录详情'
        }else {
          this.title = '核对信息'
        }
        let params = {pid:pid}
        let res = this.history ? await getordertail(params) : await getconTail(params)
        if(res.code == 200){
          this.formdata = res.data
          if(this.formdata.state == 1){
            this.formdata.statename = '待兑换'
          }else if(this.formdata.state == 2){
            this.formdata.statename = '已兑换'
          }
        }
        this.dialogVisible = true
    },
    //发送验证码
    async senCode(pid){
      let res = await sendcode({pid:pid})
      if(res.msg == '成功'){
        this.getTime()
        this.$message.success('已发送成功')
      }else{
        let str = res.msg.split(',')[0].replace('S','')
        this.getTime(str)
        this.$message.error(`${res.msg}`)
      }
    },
    //倒计时方法
    getTime(sec){
      let TIME_COUNT = sec ? sec : 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.disabled = true;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.text = `重新发送(${this.count}s)`
            this.count--;
          } else {
            this.disabled = false;
            this.text = '发送验证码'
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 2000)
      }
    },
    //保存
    saveData(){
      this.$refs.formdata.validate(async (valid)=>{
        if(valid){
          let params = {
            pid:this.formdata.pid,
            code:this.formdata.code
          }
          let res = await putconvert(params)
          if(res.code == 200){
              this.$message.success('核兑成功')
              this.handleClose()
              this.$emit('getData')
          }
        }else {
          return false
        }
      })
    },
    //关闭弹窗
    handleClose(){
      this.title = ''
      this.timer = null
      this.count = null
      this.disabled = false
      clearInterval(this.timer);
      this.text = this.$options.data().text
      this.$refs.formdata.resetFields()
      this.formdata = this.$options.data().formdata
      this.dialogVisible = false
    },
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__body{
  .el-form{
    .el-form-item{
      .el-input, .el-select{
        width: 100%;
      }
      .codeinput{
        width: 65%;
        margin-right: 10px;
      }
      .codebtn{
        padding: 11px 20px;
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
</style>
