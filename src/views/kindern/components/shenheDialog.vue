<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="60%" custom-class="shen"
    :before-close="keys == 2 ? lookClose : handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="frestData" :model="frestData" :rules="rules" status-icon label-width="9vmax">
      <el-form-item label="审核结果" prop="status">
        <el-select v-model="frestData.status" placeholder="请选择" clearable :disabled="disabled">
          <el-option v-for="item in countryList" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="原因描述" prop="content">
        <el-input v-model="frestData.content" placeholder="请输入原因描述" :disabled="disabled" />
      </el-form-item>
      <el-form-item label="适龄儿童报名情况" prop="policytype"><br>
        <el-radio-group v-model="peitao" :disabled="true">
          <el-radio label="1">配套幼儿园业主子女</el-radio><br>
          <el-radio label="2">幼随长入学</el-radio><br>
          <el-radio label="3">高层次人才或企业家子女</el-radio><br>
          <el-radio label="4">军人子女(现役军人子女、烈士子女、因公牺牲 和病故军人子女)；符合条件的公安英烈和因公牺牲伤残公安民警子女;综合性消防救援队伍子女</el-radio><br>
          <el-radio label="0">以上情况都不是</el-radio>
         </el-radio-group>
      </el-form-item>

      <el-form-item  label="适龄幼儿新信息录入" ><br>
        <el-form-item v-for="(item,index) in this.badyarr" :key="index">
          <span class="spany">幼儿姓名</span><el-input v-model="item.babyname" placeholder="" :readonly="true" style="width:10vmax"/><br>
        <span class="spany">幼儿性别</span><el-input v-if="item.babygender==0" v-model="nan" placeholder="" :readonly="true" style="width:10vmax"/>
        <el-input v-if="item.babygender==1" v-model="nv" placeholder="" :readonly="true" style="width:10vmax"/><br>
        <span class="spany">幼儿身份证号</span><el-input v-model="item.babycard" placeholder="" :readonly="true" style="width:10vmax" />
        </el-form-item>
      </el-form-item>

      <el-form-item label="适龄幼儿监护人信息录入" prop=""><br>
        <el-form-item>
          <span class="spany">姓名</span><el-input v-model="frestData.guardiansname1" placeholder="" :readonly="true" style="width:10vmax"/><br>
          <span class="spany">身份证号</span><el-input v-model="frestData.guardianscard1" placeholder="" :readonly="true" style="width:10vmax" /><br>
          <span class="spany">手机号</span><el-input v-model="frestData.guardiansmobile1" placeholder="" :readonly="true" style="width:10vmax"/><br>
          <span class="spany">与幼儿关系</span><el-input v-model="frestData.guardiansship1" placeholder="" :readonly="true" style="width:10vmax"/><br>
          <!--<p>户籍关系凭证</p>-->
          <!--<template v-if="imgdata.length > 0" >-->
          <!--  <el-image style="width: 5vmax;height: 5vmax;margin-right:0.5vmax" v-for="(item,index) in imgdata" :key="index" :src="item" :preview-src-list="imgdata" :z-index="2999">-->
          <!--  </el-image>-->
          <!--</template>-->
        </el-form-item>
        <el-form-item v-if="!frestData.guardiansname2==''">
          <span class="spany">姓名</span><el-input v-model="frestData.guardiansname2" placeholder="" :readonly="true" style="width:10vmax"/><br>
          <span class="spany">身份证号</span><el-input v-model="frestData.guardianscard2" placeholder="" :readonly="true" style="width:10vmax" /><br>
          <span class="spany">手机号</span><el-input v-model="frestData.guardiansmobile2" placeholder="" :readonly="true" style="width:10vmax"/><br>
          <span class="spany">与幼儿关系</span><el-input v-model="frestData.guardiansship2" placeholder="" :readonly="true" style="width:10vmax"/><br>
          <!--<p>户籍关系凭证</p>-->
          <!--<template v-if="imgdata2.length > 0" >-->
          <!--  <el-image style="width: 5vmax;height: 5vmax;margin-right:0.5vmax" v-for="(item,index) in imgdata2" :key="index" :src="item" :preview-src-list="imgdata2" :z-index="2999">-->
          <!--  </el-image>-->
          <!--</template>-->
        </el-form-item>
      </el-form-item>

      <el-form-item label="政策优待信息确认" v-if="frestData.policytype!=0"><br>
        <!-- 配套园业主子女 -->
        <div v-if="frestData.policytype==1">
          <span class="spany">您选择的是</span><el-input v-model="youhui" placeholder="" :readonly="true" style="width:10vmax"/><br>
          <span class="spany">小区名称</span><el-input v-model="frestData.communityname" placeholder="" :readonly="true" style="width:10vmax"/><br>
          <!--<p>物业（村委）开具的房产预审凭证</p>-->
          <!--<template v-if="imgdata5.length > 0" >-->
          <!--  <el-image style="width: 5vmax;height: 5vmax;margin-right:0.5vmax" v-for="(item,index) in imgdata5" :key="index" :src="item" :preview-src-list="imgdata5" :z-index="2999"></el-image>-->
          <!--</template>-->
        </div>
        <!-- 幼随长 -->
        <div v-if="frestData.policytype==2">
          <span class="spany">兄姐姓名</span><el-input v-model="frestData.samename" placeholder="" :readonly="true" style="width:10vmax"/><br>
          <span class="spany">兄姐身份证号</span><el-input v-model="frestData.samecard" placeholder="" :readonly="true" style="width:10vmax"/><br>
          <span class="spany">家庭住址</span><el-input v-model="frestData.address" placeholder="" :readonly="true" style="width:10vmax"/><br>
        </div>
        <!-- 高层次人才或企业家子女 -->
        <div v-if="frestData.policytype==3">
          <!--<p>高层次人才或企业家子女材料</p>-->
          <!--<template v-if="imgdata3.length > 0" >-->
          <!--  <el-image style="width: 5vmax;height: 5vmax;margin-right:0.5vmax" v-for="(item,index) in imgdata3" :key="index" :src="item" :preview-src-list="imgdata3" :z-index="2999">-->
          <!--  </el-image>-->
          <!--</template><br>-->
          <span class="spany">家庭住址</span><el-input v-model="frestData.address" placeholder="" :readonly="true" style="width:10vmax"/><br>
        </div>
        <!-- 军人烈士子女 -->
        <div v-if="frestData.policytype==4">
          <span class="spany">家庭住址</span><el-input v-model="frestData.address" placeholder="" :readonly="true" style="width:10vmax"/><br>
        </div>

      </el-form-item>

      <el-form-item>
        <span class="spany">入学幼儿园</span>
        <el-input v-model="frestData.schoolname" placeholder="" :readonly="true" style="width:10vmax"/><br>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="-" @click="saveData" :disabled="disabled">保 存</el-button>
      <el-button size="-" @click="handleClose">返 回</el-button>
    </span>
  </el-dialog>
</template>

<style>
.el-dialog__body{
  overflow: scroll;
}
</style>
<style lang="scss" scoped>
.spany{
  display: inline-block;width: 5vmax;
}
.yang{
  margin-top:5vh !important;
  .el-dialog__body{
  height:75vh
  }
}

</style>
<script>
import { getshlist, getbaomingsh,img } from "@/views/kindern/api/kind";
export default {
  name: 'forestdialog',
  data() {
    return {
      dialogVisible: false,
      tabCard: 'baseinfo',
      title: '',
      frestData: {},
      tableData1: [],
      rules: {
        status: [
          { required: true, trigger: 'change', message: '请选择' },
        ],
        typeId: [
          {
            required: true,
            trigger: 'change',
            message: '请选择所属场所类别',
          },
        ],
      },
      keys: null,
      disabled: false,
      countryList: [
        {
          pid:0,
          areaname:'未审核',
        },
        {
          pid:1,
          areaname:'通过',
        },
        {
          pid:2,
          areaname:'不通过',
        },
      ],
      shid: '',
      url: '/gridfs/artworkmaster/',
      srcList: [
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
      ],
      peitao:'',
      badyarr:[],//宝宝贝信息
      nan:'男',
      nv:'女',
      youhui:'',//选择的报名情况
      imgdata:[],
      imgdata2:[],
      imgdata3:[],
      imgdata4:[],
      imgdata5:[]
    }
  },
  props: ['tcard'],
  components: {},
  created() { },
  mounted() { },
  methods: {
    async showEdit(pid, index) {
      if (index == 2) {
        this.disabled = true
        this.title = "查看"
      } else if(index==3){
        this.title = '审核'
      }
        this.shid=pid
        let { data } = await getshlist({ pid: pid })
        this.badyarr = data.babyList
        //户籍凭证
        this.imgdata = data.guardiansfile1 && data.guardiansfile1 != '' ? data.guardiansfile1.split(',').map(item=>{
          return `${this.$baseUrl}/gridfs/artworkmaster/${item}`
        }) : []
        this.imgdata2 = data.guardiansfile2 && data.guardiansfile2 != '' ? data.guardiansfile2.split(',').map(item=>{
          return `${this.$baseUrl}/gridfs/artworkmaster/${item}`
        }) : []
        //高层次子女凭证
        this.imgdata3 = data.tallfile && data.tallfile != '' ? data.tallfile.split(',').map(item=>{
          return `${this.$baseUrl}/gridfs/artworkmaster/${item}`
        }) : []
        //军人烈士
        this.imgdata4 = data.martyrfile && data.martyrfile != '' ? data.martyrfile.split(',').map(item=>{
          return `${this.$baseUrl}/gridfs/artworkmaster/${item}`
        }) : []
        this.imgdata5 = data.communityfile && data.communityfile != '' ? data.communityfile.split(',').map(item=>{
          return `${this.$baseUrl}/gridfs/artworkmaster/${item}`
        }) : []
        this.peitao = ""+data.policytype+""
        console.log(this.peitao, "arr")
        this.youhui = data.policytype
        if(this.youhui==1){
          this.youhui="配套幼儿园业主子女"
        }else if(this.youhui==2){
          this.youhui="幼随长入学"
        }
        else if(this.youhui==3){
          this.youhui="高层次人才或企业家子女"
        }
        else if(this.youhui==4){
          this.youhui="军人子女"
        }
        this.frestData = data
        let tableData = []
        tableData.push(data)
        const arr = Array.from(data)
        console.log(arr, "arr")
        this.tableData1 = tableData;
        this.dialogVisible = true
    },
    lookClose() {
      this.dialogVisible = false
      this.title = ''
      this.frestData = this.$options.data().frestData
    },
    handleClose() {
      this.dialogVisible = false
      this.disabled = false
      this.title = ''
      this.frestData = this.$options.data().frestData
      this.$refs.frestData.resetFields()
    },

    saveData() {
      this.$refs.frestData.validate(async (valid) => {
        if (valid) {
          let res
            res = await getbaomingsh({pid:this.shid,idea:this.frestData.content,state:this.frestData.status})
          if (res.code == 200) {
            this.$message.success('操作成功')
            this.handleClose()
            this.$emit('getData')
          }
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style lang="scss" >
.shen{
  margin-top: 5vh !important;
  height:80% !important;
  .el-dialog__body{
    height:65vh;
  }
}
</style>
