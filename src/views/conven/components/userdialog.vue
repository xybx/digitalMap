<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="35%" top="7%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="formData" :model="formData" status-icon :rules="rules" label-width="85px">
      <el-form-item label="用户姓名" prop="name">
        <el-input v-model="formData.name" placeholder="请输入用户姓名" clearable/>
      </el-form-item>
      <el-form-item label="身份证号" prop="memberid">
        <el-input v-model="formData.memberid" placeholder="请输入用户姓名" clearable/>
      </el-form-item>
      <el-form-item label="手机号" prop="phonenum">
        <el-input v-model="formData.phonenum" placeholder="请输入手机号" :maxlength="11" clearable/>
      </el-form-item>
<!--      <el-form-item label="选择区域" prop="areaid">-->
<!--        <el-cascader v-model="formData.areaid" :options="options" :props="props" filterable placeholder="请选择区域" @change="selectChange"></el-cascader>-->
<!--      </el-form-item>-->
      <el-form-item label="认证状态" prop="auth">
        <el-select v-model="formData.auth" placeholder="请选择认证状态" @change="typeChange">
          <el-option label="未认证" :value="0"></el-option>
          <el-option label="已认证" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="认证时间" prop="authdate">
        <el-date-picker v-model="formData.authdate" type="date" value-format="yyyy-MM-dd" disabled placeholder="请选择认证时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="村居" prop="villageid">
        <el-select v-model="formData.villageid" placeholder="请输入所属村" @change="villClick">
            <el-option v-for="item in villData" :key="item.pid" :label="item.areaname" :value="item.pid"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="详细地址">
        <el-input v-model="formData.address" type="textarea" :rows="5" placeholder="请输入详细地址"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="index === 2" type="primary" @click="saveData">保 存</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {putUserData,getUserData,getVillage} from '../api/user'
import {mapGetters} from "vuex";
export default {
  name: "userdialog",
  data() {
    return {
      dialogVisible:false,
      title: "",
      areaData:[],
      formData:{
        name:'',
        phonenum:'',
        auth:'',
        authdate:'',
        address:'',
        areaname:'',
        villageid:null,
      },
      villData:[],
      rules:{
        name:[{required: true, trigger: "blur", message: "请填写用户姓名"}],
        phonenum:[{required: true, trigger: "blur", message: "请填写手机号"}],
        auth:[{required: true, trigger: "change", message: "请选择认证状态"}],
        authdate:[{required: true, trigger: "change", message: "请选择认证时间"}],
        villageid:[{required: true, trigger: "change", message: "请选择所属村"}],
        memberid:[{required: true, trigger: "blur", message: "请填写身份证号"}]
      },
      options:[],
      props:{
        checkStrictly: true,
        expandTrigger: 'hover',
        value: "id",
        label: "name",
        children: "child",
      },
      index:null
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
    this.getVillData()
  },
  methods: {
    async showEdit(pid,index){
      this.index = index
      if(index === 1){
        this.title = '查看用户';
      }else if(index === 2){
        this.title = '编辑用户';
      }
      let res = await getUserData({pid:pid})
      if(res.code == 200){
        this.formData = res.data
      }
      this.dialogVisible = true
    },

    async getVillData(){
      let res = await getVillage()
      this.villData = res.data
    },
    villClick(val){
      this.formData.villageid = val
    },
    saveData(){
      this.$refs.formData.validate(async (valid)=>{
        if(valid){
          if(!this.formData.pid){
            this.formData.address = `${this.formData.group}${this.formData.address}`
          }
          let data = Object.assign({},this.formData)
          Object.assign(data,{
            areaid:this.userData.areaid,
            areaname:this.userData.areaname
          })
          let res = await putUserData(data)
          if(res.code === 200){
              this.handleClose()
              this.$message.success('修改成功！')
              this.$emit('getData')
          }
        }else{
          return false
        }
      })
    },
    handleClose(){
      this.title = ''
      this.$refs.formData.resetFields();
      this.formData = this.$options.data().formData;
      this.dialogVisible = false;
    },
    typeChange(val){
      this.formData.auth = val
    },
    // selectChange(val){
    //   if(val.length > 1){
    //     this.formData.areaid = val.shift()
    //   }else{
    //     this.formData.areaid = val;
    //   }
    // },
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__body{
  .el-form{
    .el-form-item{
      .el-input, .el-select,.el-textarea,.el-cascader{
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
