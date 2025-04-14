<template>
  <div class="rules">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>规则相关设置</span>
      </div>
      <div class="text item">
        <ul class="listbox">
          <li v-for="item in listData">
              <span class="fbox">{{item}}</span>
              <div class="btnbox">
                <el-button plain size="mini" @click="lookclick">查看</el-button>
                <el-button plain size="mini" @click="editclick">编辑</el-button>
              </div>
          </li>
        </ul>
      </div>
    </el-card>
    <el-dialog :visible.sync="dialogVisible" :title="title" width="24%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
        <el-form ref="formdata" :model="formdata" :rules="drules" status-icon label-width="120px">
            <el-form-item label="可挂包人员数量" prop="sum">
              <el-input-number v-model="formdata.sum" placeholder="请输入可挂包人员数量" :min="0" />
            </el-form-item>
            <el-form-item label="开放开始时间" prop="startdate">
              <el-date-picker v-model="formdata.startdate" type="datetime" placeholder="请选择开放开始时间" format="yyyy 年 MM 月 dd 日 HH 时 mm 分 ss 秒" value-format="yyyy-MM-dd HH:mm:ss" clearable></el-date-picker>
            </el-form-item>
            <el-form-item label="开放结束时间" prop="enddate">
              <el-date-picker v-model="formdata.enddate" type="datetime" placeholder="请选择开放结束时间" format="yyyy 年 MM 月 dd 日 HH 时 mm 分 ss 秒" value-format="yyyy-MM-dd HH:mm:ss" clearable></el-date-picker>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button v-if="keys == 2" type="primary" size="medium" @click="saveData">确 认</el-button>
          <el-button size="medium" @click="handleClose">取 消</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import {getRulesData, putRulesData} from "@/views/cadre/api/cadre";
export default {
  name: "rules",
  data(){
    return {
      listData:[],
      dialogVisible:false,
      title:'',
      formdata:{
        sum:20,
        startdate:'',
        enddate:''
      },
      drules:{
        sum:[{required:true,trigger:'blur',message:'请填写可挂包人员数量'}],
        startdate:[{required:true,trigger:'blur',message:'请选择开放开始时间'}],
        enddate:[{required:true,trigger:'blur',message:'请选择开放结束时间'}]
      },
      keys:null
    }
  },
  mounted(){
    this.getData()
  },
  methods:{
    getData(){
      let data = ['规则与时间设置']
      this.listData = data
    },
    async getShow(){
      let arr = ['查看规则与时间设置','编辑规则与时间设置']
      this.title = arr[this.keys - 1]
      let res = await getRulesData()
      if(res.code == 200){
        this.formdata.sum = res.data.sum
        this.formdata.startdate = res.data.startdate ? res.data.startdate : ''
        this.formdata.enddate = res.data.enddate ? res.data.enddate : ''
      }
      this.dialogVisible = true
    },
    lookclick(){
      this.keys = 1
      this.getShow()
    },
    editclick(){
     this.keys = 2
     this.getShow()
    },
    saveData(){
      this.$refs.formdata.validate(async (valid)=>{
          if(valid){
            let obj = this.formdata
            let res = await putRulesData(obj)
            if(res.code == 200){
              this.$message.success('设置成功')
              this.handleClose()
            }
          }else {
            return false
          }
      })
    },
    handleClose(){
      this.title = ''
      this.keys = null
      this.$refs.formdata.resetFields()
      this.formdata = this.$options.data().formdata
      this.dialogVisible = false
    },
  }
}
</script>
<style scoped lang="scss">
@import "./style/rules.scss";
</style>
