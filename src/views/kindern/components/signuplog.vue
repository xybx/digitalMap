<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="60%" top="5vh" custom-class="shen" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="frestData" :model="frestData" :rules="rules" status-icon label-width="9vmax">
      <el-form-item label="适龄儿童报名情况" prop="policytype"><br>
        <el-radio-group v-model="frestData.policytype">
          <el-radio label="1">配套幼儿园业主子女</el-radio><br>
          <el-radio label="2">幼随长入学</el-radio><br>
          <el-radio label="3">高层次人才或企业家子女</el-radio><br>
          <el-radio label="4">军人子女(现役军人子女、烈士子女、因公牺牲 和病故军人子女)；符合条件的公安英烈和因公牺牲伤残公安民警子女;综合性消防救援队伍子女</el-radio><br>
          <el-radio label="0">以上情况都不是</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="适龄幼儿新信息录入"><el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="addBaby">添加多胞胎信息</el-button><br/>
        <div class="babyform" v-for="(item,index) in frestData.babyList" :key="index">
          <el-form-item :prop="'babyList.' + index + '.babyname'" :rules="{required: true, message: '请输入幼儿姓名', trigger: 'blur'}">
            <span class="spany"><i>*</i>幼儿姓名</span><el-input v-model="item.babyname" placeholder="请输入幼儿姓名" style="width:10vmax"/>
          </el-form-item>
          <el-form-item :prop="'babyList.' + index + '.babygender'" :rules="{required: true, message: '请选择幼儿性别', trigger: 'change'}">
            <span class="spany"><i>*</i>幼儿性别</span>
            <el-select v-model="item.babygender" placeholder="请选择幼儿性别" style="width:10vmax">
              <el-option :value="0" label="男"></el-option>
              <el-option :value="1" label="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :prop="'babyList.' + index + '.babycard'" :rules="{required: true, message: '请输入幼儿身份证号', trigger: 'blur'}" :style="index === 0 ? 'margin-bottom: 15px' :' '">
            <span class="spany"><i>*</i>幼儿身份证号</span><el-input v-model="item.babycard" placeholder="请输入幼儿身份证号" maxlength="18" style="width:10vmax" />
          </el-form-item>
          <el-button v-if="index !== 0" :style="index !== 0 ? 'margin-bottom: 15px' :' '" type="danger" size="mini" @click="delbaby(index)">删除当前幼儿信息</el-button>
        </div>
      </el-form-item>
      <el-form-item label="适龄幼儿监护人信息录入"><el-button v-if="manlen!==2" type="primary" size="small" icon="el-icon-circle-plus-outline" @click="addTutor">添加监护人信息</el-button><br/>
        <div class="manform">
            <el-form-item prop="guardiansname1">
              <span class="spany"><i>*</i>监护人1姓名</span><el-input v-model="frestData.guardiansname1" placeholder="请输入监护人1姓名" style="width:10vmax"/>
            </el-form-item>
            <el-form-item prop="guardianscard1">
              <span class="spany"><i>*</i>监护人1身份证号</span><el-input v-model="frestData.guardianscard1" placeholder="请输入监护人1身份证号" maxlength="18" style="width:10vmax" /><br>
            </el-form-item>
            <el-form-item prop="guardiansmobile1">
              <span class="spany"><i>*</i>监护人1手机号</span><el-input v-model="frestData.guardiansmobile1" placeholder="请输入监护人1手机号" maxlength="11" style="width:10vmax"/>
            </el-form-item>
            <el-form-item prop="guardiansship1" style="margin-bottom: 5px">
              <span class="spany"><i>*</i>监护人1与幼儿关系</span><el-input v-model="frestData.guardiansship1" placeholder="请输入监护人1与幼儿关系" style="width:10vmax;"/>
            </el-form-item>
            <!--<el-button v-if="manlen === 1" type="danger" size="mini" @click="delone">删除当前监护人</el-button>-->
          <template v-if="manlen == 2">
            <el-form-item prop="guardiansname2">
              <span class="spany"><i>*</i>监护人2姓名</span><el-input v-model="frestData.guardiansname2" placeholder="请输入监护人2姓名" style="width:10vmax"/>
            </el-form-item>
            <el-form-item prop="guardianscard2">
              <span class="spany"><i>*</i>监护人2身份证号</span><el-input v-model="frestData.guardianscard2" placeholder="请输入监护人2身份证号" maxlength="18" style="width:10vmax" />
            </el-form-item>
            <el-form-item prop="guardiansmobile2">
              <span class="spany"><i>*</i>监护人2手机号</span><el-input v-model="frestData.guardiansmobile2" placeholder="请输入监护人2手机号" maxlength="11" style="width:10vmax"/>
            </el-form-item>
            <el-form-item prop="guardiansship2" style="margin-bottom: 5px">
              <span class="spany"><i>*</i>监护人2与幼儿关系</span><el-input v-model="frestData.guardiansship2" placeholder="请输入监护人2与幼儿关系" style="width:10vmax"/>
            </el-form-item>
            <el-button v-if="manlen == 2" type="danger" size="mini" @click="deltwo">删除当前监护人</el-button>
          </template>
        </div>
      </el-form-item>
      <el-form-item prop="schoolid">
        <span class="spany"><i>*</i>入学幼儿园</span>
        <el-select v-model="frestData.schoolid" placeholder="请选择入学幼儿园" style="width:10vmax">
          <el-option v-for="(item,index) in schoolData" :key="index" :value="item.pid" :label="item.schoolname"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="-" @click="saveData">保 存</el-button>
        <el-button size="-" @click="handleClose">取 消</el-button>
    </span>
    </el-dialog>
</template>

<script>
import {getSchoolList,putSignUp} from '../api/kind'
export default {
  name: "signuplog",
  data(){
    return {
      dialogVisible: false,
      title: '',
      frestData: {
        babyList:[
          {babyname:'',babygender:'',babycard:''}
        ],
        policytypeName:''
      },
      rules:{
        policytype:[{ required: true, trigger: 'change', message: '请选择报名情况' }],
        schoolid:[{ required: true, trigger: 'change', message: '请选择入学幼儿园' }],
        guardiansname1:[{required: true, trigger: 'blur', message: '请输入监护人1姓名' }],
        guardianscard1:[{required: true, trigger: 'blur', message: '请输入监护人1身份证号' }],
        guardiansmobile1:[{required: true, trigger: 'blur', message: '请输入监护人1手机号' }],
        guardiansship1:[{required: true, trigger: 'blur', message: '请输入监护人1与幼儿关系' }],
        guardiansname2:[{required: true, trigger: 'blur', message: '请输入监护人2姓名' }],
        guardianscard2:[{required: true, trigger: 'blur', message: '请输入监护人2身份证号' }],
        guardiansmobile2:[{required: true, trigger: 'blur', message: '请输入监护人2手机号' }],
        guardiansship2:[{required: true, trigger: 'blur', message: '请输入监护人2与幼儿关系' }],
        communityid:[{ required: true, trigger: 'change', message: '请选择小区名称'}],
        samename:[{required: true, trigger: 'blur', message: '请输入兄姐姓名' }],
        samecard:[{required: true, trigger: 'blur', message: '请输入兄姐身份证号' }],
        address:[{required: true, trigger: 'blur', message: '请输入家庭地址' }]
      },
      badyarr:[],
      manlen:1,
      schoolData:[],
      communityData:[],
      type:null,
      disabled:true
    }
  },
  created() {
  },
  mounted() {
  },
  methods:{
    showEdit(){
      this.title = '新增报名信息'
      this.dialogVisible = true
      this.getSchool()
    },
    addBaby(){
      this.frestData.babyList.push({
        babyname:'',babygender:'',babycard:''
      })
    },
    addTutor(){
      if(this.manlen < 2){
        this.manlen++
      }
    },
    deltwo(){
      this.manlen--
      this.frestData.guardiansname2 = ''
      this.frestData.guardianscard2 = ''
      this.frestData.guardiansmobile2 = ''
      this.frestData.guardiansship2 = ''
    },
    delbaby(i){
      this.frestData.babyList.splice(i,1)
    },
    async getSchool(){
      let res = await getSchoolList({type:0})
      this.schoolData = res.data.length > 0 ? res.data : []
    },

    saveData(){
      this.$refs.frestData.validate(async (valid)=>{
        if(valid){
          if(this.frestData.babyList.length == 1){
            this.frestData.babyList[0].type = 1
          }else if(this.frestData.babyList.length > 1){
            this.frestData.babyList.forEach((item,index)=>{
              item.type = index == 0 ? 1 : 2
              return item
            })
          }
          const loading = this.$loading({
            lock: true,
            text: '保存中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          let data = this.frestData
          Object.assign(data,{policytype:Number(this.frestData.policytype)})
          if(!this.frestData.guardiansname2){
            this.$delete(data,'guardiansname2')
            this.$delete(data,'guardianscard2')
            this.$delete(data,'guardiansmobile2')
            this.$delete(data,'guardiansship2')
          }
          this.$delete(data,'policytypeName')
          let res = await putSignUp(data)
          if(res.code == 200){
            loading.close();
            this.$message.success('保存成功')
            this.handleClose()
            this.$emit('getData')
          }else {
            loading.close();
            this.$message.error(res.msg)
            return false
          }
        } else {
          return false
        }
      })

    },
    handleClose(){
      this.title = ''
      this.manlen = 1
      this.frestData = this.$options.data().frestData
      this.$refs.frestData.resetFields()
      this.dialogVisible = false
    },

  },
}
</script>

<style scoped lang="scss">
.shen{
  height:80% !important;
  .el-dialog__body{
    overflow: scroll;
    .spany{
      display: inline-block;
      width: 5vmax;
      i{
        color: red;
        margin-right: 5px;
      }
      &.marp{
        position:relative;
        top:-80px;
      }
    }
    .babyform{
      margin-top: 10px;
      .el-form-item--small.el-form-item{
        margin-bottom:15px;
      }
    }
    .manform{
      margin-top: 10px;
      .el-input{
        margin-bottom: 15px;
      }
      .spany{
        width: 6.8vmax;
      }
    }
    .el-button--danger{
      width: 140px;
      margin-left:7.5vw;
    }
  }
}

</style>
