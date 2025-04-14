<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="40%" top="0%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
      <el-form ref="stemData" :model="stemData" status-icon label-width="150px">
        <div class="titlebox">
          <i></i>
          <span>报名信息</span>
        </div>
        <el-form-item label="报名年份">
          <el-input v-model="stemData.year" placeholder="报名年份" readonly />
        </el-form-item>
        <el-form-item label="报名类型">
          <el-input v-model="stemData.typeText" placeholder="报名类型" readonly />
        </el-form-item>
        <el-form-item label="学校类型">
          <el-input v-model="stemData.stypeText" placeholder="学校类型" readonly />
        </el-form-item>
        <el-form-item label="区域类型">
          <el-input v-model="stemData.swText" placeholder="区域类型" readonly />
        </el-form-item>
        <div class="titlebox">
          <i></i>
          <span>学生信息</span>
        </div>
        <el-form-item label="学生姓名">
          <el-input v-model="stemData.babyName" placeholder="请输入类别名称" readonly />
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="stemData.babyIdcard" placeholder="请输入类别名称" readonly />
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="stemData.babyXb" placeholder="请输入类别名称" readonly />
        </el-form-item>
        <el-form-item label="学生出生日期">
          <el-input v-model="stemData.babyCsrq" placeholder="请输入类别名称" readonly />
        </el-form-item>
        <template v-if="stemData.zxxGuardianList && stemData.zxxGuardianList.length > 0">
          <div class="titlebox">
            <i></i>
            <span>监护人信息</span>
          </div>
          <template v-for="(item,index) in stemData.zxxGuardianList">
            <el-form-item :label="`监护人${index+1}姓名`">
              <el-input v-model="item.name" placeholder="监护人姓名" readonly />
            </el-form-item>
            <el-form-item :label="`监护人${index+1}身份证号`">
              <el-input v-model="item.idcard" placeholder="监护人身份证号" readonly />
            </el-form-item>
            <el-form-item :label="`监护人${index+1}手机号`">
              <el-input v-model="item.phone" placeholder="监护人手机号" readonly />
            </el-form-item>
            <el-form-item :label="`监护人${index+1}称谓`">
              <el-input v-model="item.relationship" placeholder="监护人称谓" readonly />
            </el-form-item>
          </template>
        </template>
        <template v-if="stemData.sw == 0">
          <div class="titlebox">
            <i></i>
            <span>户籍信息</span>
          </div>
          <el-form-item label="户籍类别">
            <el-input v-model="stemData.residentText" placeholder="户籍类别" readonly />
          </el-form-item>
          <el-form-item label="户籍地址">
            <el-input v-model="stemData.babyHjd" placeholder="户籍地址" readonly />
          </el-form-item>
          <template v-if="stemData.type == 1">
            <el-form-item label="入学依据">
              <el-input v-model="stemData.entranceText" placeholder="入学依据" readonly />
            </el-form-item>
            <template v-if="stemData.entranceType == 1">
              <el-form-item label="是否出生落户">
                <el-input v-model="stemData.isCsText" placeholder="是否出生落户" readonly />
              </el-form-item>
              <el-form-item label="迁入时间">
                <el-input v-model="stemData.lhTime" placeholder="迁入时间" readonly />
              </el-form-item>
            </template>
          </template>
          <template v-if="stemData.type == 2">
            <el-form-item label="家庭地址">
              <el-input v-model="stemData.address" type="textarea" :rows="5" readonly placeholder="家庭地址"></el-input>
            </el-form-item>
          </template>
        </template>
        <template v-if="stemData.entranceType!=1 &&stemData.zxxRealEstate">
          <div class="titlebox">
            <i></i>
            <span>房产信息</span>
          </div>
          <el-form-item label="报名的房产">
            <el-input v-model="stemData.houseText" placeholder="报名的房产" readonly />
          </el-form-item>
          <el-form-item label="房产证编号">
            <el-input v-model="stemData.bdcqzh" placeholder="房产证编号" readonly />
          </el-form-item>
          <el-form-item label="房屋所有人">
            <el-input v-model="stemData.qlrmc" placeholder="房屋所有人" readonly />
          </el-form-item>
          <el-form-item label="房产地址">
            <el-input v-model="stemData.houseades" placeholder="房产地址" readonly />
          </el-form-item>
        </template>
        <template v-if="stemData.residentType && stemData.residentType == 2 && stemData.jhIdcard && stemData.zxxGuardianList && stemData.zxxGuardianList.length > 0">
          <div class="titlebox">
            <i></i>
            <span>选择的监护人</span>
          </div>
          <el-form-item label="选择的监护人">
            <el-input v-model="stemData.guarder" placeholder="选择的监护人" readonly />
          </el-form-item>
        </template>
        <template v-if="stemData.residentType && stemData.residentType == 2 && stemData.zxxJzz">
          <div class="titlebox">
            <i></i>
            <span>居住证信息</span>
          </div>
          <el-form-item label="居住证登记时间">
            <el-input v-model="stemData.livetime" placeholder="监护人工作类型" readonly />
          </el-form-item>
          <el-form-item label="居住证地址">
            <el-input v-model="stemData.liveadres" placeholder="监护人工作类型" readonly />
          </el-form-item>
        </template>
        <template v-if="stemData.residentType && stemData.residentType == 2 && (stemData.zxxWork || stemData.zxxEnterprise)">
          <div class="titlebox">
            <i></i>
            <span>工作信息</span>
          </div>
          <el-form-item label="监护人工作类型">
            <el-input v-model="stemData.workText" placeholder="监护人工作类型" readonly />
          </el-form-item>
          <template v-if="stemData.zxxWork && stemData.workType == 1">
            <el-form-item label="务工单位">
              <el-input v-model="stemData.workDepart" placeholder="务工单位" readonly />
            </el-form-item>
            <el-form-item label="务工开始时间">
              <el-input v-model="stemData.workTime" placeholder="务工开始时间" readonly />
            </el-form-item>
            <el-form-item label="务工状态">
              <el-input v-model="stemData.workStatus" placeholder="务工状态" readonly />
            </el-form-item>
          </template>
          <template v-if="stemData.zxxEnterprise &&stemData.workType == 2">
            <el-form-item label="企业名称">
              <el-input v-model="stemData.bussName" placeholder="企业名称" readonly />
            </el-form-item>
            <el-form-item label="营业证编号(社会统一信用代码)">
              <el-input v-model="stemData.uniscid" placeholder="营业证编号" readonly />
            </el-form-item>
            <el-form-item label="企业运营时间">
              <el-input v-model="stemData.bussTime" placeholder="企业运营时间" readonly />
            </el-form-item>
            <el-form-item label="企业地址">
              <el-input v-model="stemData.bussAdres" placeholder="企业地址" readonly />
            </el-form-item>
          </template>
        </template>
        <template v-if="stemData.sw == 1">
          <div class="titlebox">
            <i></i>
            <span>户籍信息</span>
          </div>
          <el-form-item label="户籍类别">
            <el-input v-model="stemData.residentText" placeholder="户籍类别" readonly />
          </el-form-item>
          <el-form-item label="居住地址">
            <el-input v-model="stemData.babyHjd" placeholder="户籍地址" readonly />
          </el-form-item>
        </template>
        <div class="titlebox">
          <i></i>
          <span>其他信息</span>
        </div>
        <el-form-item label="是否为特殊人员">
          <el-input v-model="stemData.isSpecialText" placeholder="是否为特殊人员" readonly />
        </el-form-item>
        <el-form-item label="特殊人员类型" v-if="stemData.specialType !=0">
          <el-input v-model="stemData.specialText" placeholder="特殊人员类型" readonly />
        </el-form-item>
      </el-form>
      <el-dialog :visible.sync="innerdialogVisible" :title="innertitle" width="36%" :before-close="innerClose" :append-to-body="true" :close-on-click-modal="false" center>
        <el-form ref="innerData" :model="innerData" :rules="inrules" status-icon label-width="60px">
          <el-form-item label="意见" prop="opinion">
            <el-input v-model="innerData.opinion" type="textarea" :rows="5" placeholder="请输入意见"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="-" @click="saveData">确 定</el-button>
          <el-button size="-" @click="innerClose">返 回</el-button>
         </span>
      </el-dialog>
      <span slot="footer" class="dialog-footer">
        <template v-if="keys == 2">
          <el-button type="success" size="-" @click="passData">通 过</el-button>
          <el-button type="danger" size="-" @click="failData">不通过</el-button>
        </template>
        <el-button size="-" @click="handleClose">返 回</el-button>
      </span>
  </el-dialog>
</template>

<script>
import {getSignupApi, putExamineApi} from "@/views/educate/api/eduapi";
export default {
  name: "StemDialog",
  data(){
    return {
      dialogVisible:false,
      title:'',
      stemData:{},
      keys:null,
      pid:null,
      innerdialogVisible:false,
      innertitle:'',
      innerData:{},
      inrules:{
        opinion:[{required:true,trigger:'blur',message:'请输入意见'}]
      }
    }
  },
  created() {

  },
  mounted() {

  },
  methods:{
    async showEdit(pid,index){
      this.keys = index
      this.pid = pid ? pid : null
      this.title = index == 3 ? '查看详情' : '审核信息'
      if(pid){
        let {data} = await getSignupApi({pid})
        if(data.code == 200){
          let nrr = ['现役军人','公安英烈','高层次人才','援鄂一线医护人员']
          this.stemData = data.data
          this.stemData.typeText = data.data.type == 1 ? '公办' : '民办'
          this.stemData.stypeText = data.data.stype == 1 ? '小学' : '初中'
          this.stemData.swText = data.data.sw == 0 ? '市内' : '市外'
          this.stemData.isCsText = data.data.isCs ? data.data.isCs === 0 ? '否' : '是' : '否'
          this.stemData.residentText = data.data.residentType == 1 ? '博山本地户籍' : '非博山户籍'
          this.stemData.entranceText = data.data.entranceType ? data.data.entranceType === 1 ? '依据户籍入学' : '依据房产入学' : ''
          if(data.data.zxxGuardianList && data.data.zxxGuardianList.length > 0){
            this.stemData.guarder = data.data.jhIdcard ? data.data.zxxGuardianList.find(item=> item.idcard == data.data.jhIdcard)?.name : ''
          }
          if(data.data.zxxJzz){
            this.stemData.livetime = data.data.zxxJzz?.djsj
            this.stemData.liveadres = data.data.zxxJzz?.jzzdz
          }
          this.stemData.houseText = data.data.zxxRealEstate?.fdzl
          this.stemData.bdcqzh = data.data.zxxRealEstate?.bdcqzh
          this.stemData.houseades = data.data.zxxRealEstate?.fdzl
          this.stemData.qlrmc = data.data.zxxRealEstate?.qlrmc
          this.stemData.workText = data.data.workType ? data.data.workType === 1 ? '务工' : '自主经商' : ''
          if(data.data.workType === 1){
            this.stemData.workDepart = data.data.zxxWork?.dwmc
            this.stemData.workTime = data.data.zxxWork?.cjgzrq
            this.stemData.workStatus = data.data.zxxWork?.rysczt
          }else {
            this.stemData.bussTime = data.data.zxxEnterprise?.esdate
            this.stemData.uniscid = data.data.zxxEnterprise?.uniscid
            this.stemData.bussName = data.data.zxxEnterprise?.name
            this.stemData.bussAdres = data.data.zxxEnterprise?.loc
          }
          this.stemData.isSpecialText = data.data.specialType!==0 ? '是' : '否'
          this.stemData.specialText = nrr[data.data.specialType-1]
        }
      }
      this.dialogVisible = true
    },
    async passData(){
      let params = {type:1,pid:this.pid}
      let {data} = await putExamineApi(params)
      if(data.code == 200){
        this.$message.success('已审核通过')
        this.handleClose()
        this.$emit('getData')
      }else {
        this.$message.error(res.msg)
        return false
      }
    },
    failData(){
      this.innertitle = '意见'
      this.innerdialogVisible = true
    },
    handleClose(){
      this.title = ''
      this.keys = null
      this.pid = null
      this.stemData = this.$options.data().stemData
      this.dialogVisible = false
    },
    saveData(){
      this.$refs.innerData.validate(async (valid)=>{
        if(valid){
          let params = {type:2,pid:this.pid,opinion:this.innerData.opinion}
          let {data} = await putExamineApi(params)
          if(data.code == 200){
            this.$message.success('已办理成功')
            this.innerClose()
            this.handleClose()
            this.$emit('getData')
          }else {
            this.$message.error(data.msg)
            return false
          }
        }else {
          return false
        }
      })
    },
    innerClose(){
      this.innertitle = ''
      this.$refs.innerData.resetFields()
      this.innerData = this.$options.data().innerData
      this.innerdialogVisible = false
    },

  }
}
</script>
<style scoped lang="scss">
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
        width: 100%;
      }
    }
    .vercail{
      display: flex;
      label{
        width:120px;
        &::before{
          content: "*";
          color: #ff4d4f;
          margin-right: 4px;
        }
      }
      ::v-deep{
        .el-form-item{
          width:39.2%;
          float:left;
          .el-form-item__content{
            margin-left: 0!important;
          }
          &:last-child{
            .el-form-item__content{
              margin-left:10px!important;
            }
          }
        }
      }
    }
  }
}
</style>
