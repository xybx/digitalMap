<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="30%"  custom-class="you" :before-close="keys == 2 ? lookClose : handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="frestData" :model="frestData" :rules="rules" status-icon label-width="7.5vmax">
        <el-form-item label="幼儿园名称:" prop="schoolname">
          <el-input v-model="frestData.schoolname" placeholder="请输入幼儿园名称" :disabled="disabled" style=""/>
        </el-form-item>
        <el-form-item label="地址:" prop="address">
          <el-input v-model="frestData.address" placeholder="请输入地址" :disabled="disabled"/>
        </el-form-item>
        <el-form-item label="联系电话:" prop="phonenumber" width="5vmax">
          <el-input v-model="frestData.phonenumber" placeholder="请输入联系电话" :disabled="disabled"/>
        </el-form-item>
        <el-form-item label="办学性质:" prop="type" >
        <el-select @change="yincang" v-model="frestData.type" placeholder="请选择" clearable :disabled="disabled">
          <el-option v-for="item in countryList" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="配套小区名称:" >
          <el-select v-model="frestData.communityids" multiple placeholder="请选择" clearable :disabled="disabled">
          <el-option v-for="item in communityids" :key="item.pid" :value="item.pid" :label="item.communityname"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="社区名称:">
          <el-input v-model="frestData.shequname" placeholder="请输入" :disabled="disabled"/>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button  type="primary" size="-" @click="saveData" :disabled="disabled">保 存</el-button>
      <el-button  size="-" @click="handleClose">返 回</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getkinderadd,getDetail,getshequlist } from "@/views/kindern/api/kind";
export default {
  name: 'youerdialog',
  data() {
    return {
      dialogVisible:false,
      sl:false,
      tabCard:'codest',
      title:'',
      frestData:{},
      rules:{
        schoolname:[{required:true,trigger:'change',message:'请输入幼儿园名称'}],
        address:[{required:true,trigger:'change',message:'请输入地址'}],
        type:[{required:true,trigger:'change',message:'请选择办学性质'}],

      },
      keys:null,
      disabled:false,
      countryList:[
        {
          pid:1,
          areaname:'公办',
        },
        {
          pid:2,
          areaname:'民办',
        }
      ],
      communityids:[],
      id:'',
    }
  },
  props:['tcard'],
  components: {},
  created() {
  },
  mounted() {
  },
  methods: {

    yincang(){
      if(this.frestData.type==2){
        this.sl=true
      }else{
        this.sl=false
      }
    },
    async showEdit(pid,index){
      if(index==2){
        this.disabled=true
        this.title="查看"
      }else if(index==3){
          this.title='编辑'
        }
        else{
          this.title='新增'
        }
        if(index==2 || index==3){
          this.id=pid
          let res = await getDetail({pid: pid})
        this.frestData = res.data ? res.data : this.$options.data.frestData
        }
        let shequ = await getshequlist()
        this.communityids = shequ.data
        this.dialogVisible = true
    },
    lookClose(){
      this.dialogVisible = false
      this.title = ''
      this.frestData = this.$options.data().frestData
    },
    handleClose(){
      this.dialogVisible = false
      this.disabled = false
      this.title = ''
      this.frestData = this.$options.data().frestData
      this.$refs.frestData.resetFields()
    },
    saveData(){
      this.$refs.frestData.validate(async (valid)=>{
        if(valid){
          let res;
            res = await getkinderadd(this.frestData);
          debugger
          if(res.code == 200){
            this.$message.success("操作成功")
            this.handleClose()
            this.$emit('getData')
          }
        }else {
          return false
        }
      })
    },
  }
}
</script>

<style lang="scss">
.you{
  height:50% !important;
  .el-input--small{
  width:80%
}
}

</style>
