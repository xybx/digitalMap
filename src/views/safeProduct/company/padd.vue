<template>
  <div class="padd">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>企业添加</span>
      </div>
      <div class="text item">
        <el-form :inline="true" ref="formdata" :rules="formRuels" :model="formdata" @submit.native.prevent label-width="170px">
          <el-form-item label="企业名称" prop="name">
            <el-input v-model="formdata.name" placeholder="请输入企业名称" />
          </el-form-item>
          <el-form-item label="企业分类" prop="typeid">
            <el-select v-model="formdata.typeid" placeholder="请选择企业分类" filterable @change="cateChange">
              <el-option v-for="item in comcate" :key="item.pid" :value="item.pid" :label="item.name"></el-option>
            </el-select>
            <el-input type="hidden" v-model="formdata.typename" style="display: none"/>
          </el-form-item>
          <el-form-item label="统一社会信用代码" prop="cardno">
            <el-input v-model="formdata.cardno" placeholder="请输入统一社会信用代码" />
          </el-form-item>
          <el-form-item label="所属村镇" prop="communityid">
            <el-select v-model="formdata.communityid" placeholder="请选择所属村镇" @change="villChange" filterable>
              <el-option v-for="item in village" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
            </el-select>
            <el-input type="hidden" v-model="formdata.community" style="display: none"/>
          </el-form-item>
          <el-form-item label="注册资金(万元)">
            <el-input v-model="formdata.zcmoney" placeholder="请输入注册资金" />
          </el-form-item>
          <el-form-item label="成立时间" prop="founddata">
            <el-date-picker v-model="formdata.founddata" type="date" value-format="yyyy-MM-dd" placeholder="请选择成立时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="企业地址" prop="address">
            <el-input v-model="formdata.address" placeholder="请输入企业地址" />
          </el-form-item>
          <el-form-item label="企业坐标定位" required>
            <el-input v-model="formdata.location" readonly placeholder="请输入企业坐标定位" @click.native="locationClick" />
            <mapdialog ref="mapbox" @exportAttr="exportAttr"/>
          </el-form-item>
          <el-form-item label="办公电话">
            <el-input v-model="formdata.telphone" placeholder="请输入办公电话" />
          </el-form-item>
          <el-form-item label="主要负责人" prop="mainperson">
            <el-input v-model="formdata.mainperson" placeholder="请输入主要负责人" />
          </el-form-item>
          <el-form-item label="负责人手机号" prop="mainpersonmobile">
            <el-input v-model="formdata.mainpersonmobile" placeholder="请输入负责人手机号" maxlength="11" />
          </el-form-item>
          <el-form-item label="安全负责人">
            <el-input v-model="formdata.safeperson" placeholder="请输入安全负责人" />
          </el-form-item>
          <el-form-item label="负责人手机号">
            <el-input v-model="formdata.safepersonmobile" placeholder="请输入负责人手机号" maxlength="11" />
          </el-form-item>
          <el-form-item label="是否有重大危险源">
            <el-input v-model="formdata.ishavedanger" placeholder="请输入是否有重大危险源" />
          </el-form-item>
          <el-form-item label="生产经营产品">
            <el-input v-model="formdata.production" placeholder="请输入生产经营产品" />
          </el-form-item>
          <el-form-item label="职工人数">
            <el-input v-model="formdata.workers" placeholder="请输入职工人数" />
          </el-form-item>
          <el-form-item label="安全管理机构">
            <el-input v-model="formdata.ishavesafeorg" placeholder="请输入安全管理机构" />
          </el-form-item>
          <el-form-item label="安全管理机构负责人">
            <el-input v-model="formdata.safeorgperson" placeholder="请输入安全管理机构负责人" />
          </el-form-item>
          <el-form-item label="安全管理机构负责人手机">
            <el-input v-model="formdata.safeorgpermobile" placeholder="请输入安全管理机构负责人手机" maxlength="11" />
          </el-form-item>
          <el-form-item label="安全管理机构办公电话">
            <el-input v-model="formdata.safeorgtel" placeholder="请输入安全管理机构负责人手机"/>
          </el-form-item>
          <el-form-item label="安全管理机构值班电话">
            <el-input v-model="formdata.safeorgdutytel" placeholder="请输入安全管理机构值班电话"/>
          </el-form-item>
          <el-form-item label="专（兼）职安全管理人数">
            <el-input v-model="formdata.safemagpernum" placeholder="请输入专（兼）职安全管理员"/>
          </el-form-item>
          <el-form-item label="登录密码" prop="loginpassword">
            <el-input v-model="formdata.loginpassword" placeholder="请输入登录密码" />
          </el-form-item>
          <el-form-item label="营业执照">
            <UploadComImg :fileLists="fileLists" class="uploadBlock" @removeSuccess="removeSuccess" @uploadSuccess="uploadSuccess" />
          </el-form-item>
        </el-form>
        <div class="cardfooter">
          <el-button type="primary" size="medium" @click="saveData">保存</el-button>
          <el-button plain size="medium" @click="resetClick('formdata')">重置</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import UploadComImg from "@/components/UploadComImg";
import mapdialog from "./components/mapdialog";
import {getComyVill,getComyCate,getComySave,deletecomfile,getqyFeature} from './api/company'
import { mapActions, mapGetters } from 'vuex'
import { handleActivePath } from '@/utils/routes'
import Point from '@arcgis/core/geometry/Point'
  import Graphic from '@arcgis/core/Graphic'
  import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
let app
export default {
  name: "padd",
  data() {
    return {
      formdata:{
        pid:null,
        name:'',
        typeid:null,
        typename:'',
        cardno:'',
        communityid:null,
        community:'',
        zcmoney:'',
        founddata:'',
        address:'',
        location:'',
        telphone:'',
        mainperson:'',
        mainpersonmobile:'',
        safeperson:'',
        safepersonmobile:'',
        ishavedanger:'',
        production:'',
        workers:'',
        ishavesafeorg:'',
        safeorgperson:'',
        safeorgpermobile:'',
        safeorgtel:'',
        safeorgdutytel:'',
        safemagpernum:'',
        loginpassword:''
      },
      formRuels:{
        name:[{required: true, trigger: "blur", message: "请选择企业名称"}],
        // typeid:[{required: true, trigger: "change", message: "请选择企业分类"}],
        cardno:[{required: true, trigger: "blur", message: "请选择统一社会信用代码"}],
        // communityid:[{required: true, trigger: "change", message: "请选择所属村镇"}],
        // founddata:[{required: true, trigger: "change", message: "请选择成立时间"}],
        // address:[{required: true, trigger: "blur", message: "请选择企业地址"}],
        // mainperson:[{required: true, trigger: "blur", message: "请选择主要负责人"}],
        // mainpersonmobile:[{required: true, trigger: "blur", message: "请选择负责人手机号"}],
        loginpassword:[{required: true, trigger: "blur", message: "请填写登录密码"}]
      },
      fileLists:[],
      comcate:[],
      village:[],
    }
  },
  components: {
    UploadComImg,
    mapdialog
  },
  computed: {
    ...mapGetters({
      visitedRoutes: 'tabs/visitedRoutes',
      routes: 'routes/routes',
    }),
  },
  created() {
    this.getCate()
    this.getvillage()
  },
  mounted() {
    app = this
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        if(val.path == '/padd'){
          this.getCate()
          this.getvillage()
        }
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions({
        delVisitedRoute: 'tabs/delVisitedRoute',
    }),
    async handleTabRemove(rawPath) {
        await this.delVisitedRoute(rawPath)
        if (this.isActive(rawPath)) this.toLastTab()
    },
    toLastTab() {
      const latestView = this.visitedRoutes.filter(item=>{return item.showMenuIndex === 3}).slice(-1)[0]
      if (latestView) this.$router.push(latestView)
      else this.$router.push('/company')
    },
    isActive(path) {
      return path === handleActivePath(this.$route, true)
    },
    async getCate(){
      let res = await getComyCate()
      this.comcate = res.data
    },
    async getvillage(){
      let res = await getComyVill()
      this.village = res.data
    },
    cateChange(val){
      this.formdata.typeid = val
      let str = this.comcate.filter(item=>{ return item.pid == val})
      this.formdata.typename = str[0].name
    },
    villChange(val){
      this.formdata.communityid = val
      let str = this.village.filter(item=>{ return item.pid == val})
      this.formdata.community = str[0].areaname
    },
    uploadSuccess(fileData) {
      this.fileLists = fileData;
    },
    async removeSuccess(fileId) {
      let res = await deletecomfile({ fileId: fileId});
      if (res.code === 200) {
        this.$message.success("删除成功");
      }
      this.fileLists = [];
    },
    locationClick(){
      this.$refs.mapbox.showmap()
    },
    exportAttr(arr){
      this.$nextTick(()=>{
        this.formdata.location = arr.join(',')
      })
    },
    saveData(){
      this.$refs.formdata.validate(async (valid)=>{
        if(valid){
          let data = this.formdata;
          if(this.fileLists.length > 0){
            Object.assign(data,{licenseimg:this.fileLists[0].fileid})
          }else {
            this.$message.error('请上传营业执照')
            return false
          }
          if(!this.formdata.location){
            this.$message.error('请选择企业坐标定位')
            return false
          }else{
            Object.assign(data,{locationx:this.formdata.location.split(',')[0],locationy:this.formdata.location.split(',')[1]})
          }
          let res = await getComySave(data)
          if(res.code == 200){
            this.$message.success('保存成功')
            this.formdata = res.data
            this.formdata.location = res.data.locationx && res.data.locationy ?  `${res.data.locationx},${res.data.locationy}` : ''
            this.savesde(this.formdata)
            setTimeout(() => {
              this.handleTabRemove(this.$route.path)
              this.$router.push({
                path:'/company'
              })
            }, 300);
          }
        }else{
          return false
        }
      })
    },
    resetClick(form){
      this.$refs[form].resetFields();
      this.$refs.formdata = this.$options.data().formdata
    },
//保存sde
   async savesde(obj) {
      //获取编辑企业的feature服务地址
          var res = await getqyFeature()
          var url = ''
          if (res.code == 200) {
            url = res.data
          }

          var featurelayer = new FeatureLayer({
            //url: qyFeatureServer,
            url: url,
            outFields: ['*'],
          })
          var attr = {
            qyid: obj.pid,
            name: obj.name,
            qydz: obj.address,
            clsj: obj.founddata,
            zczb: obj.zcmoney,
            bgdh: obj.telphone,
            qyfzr: obj.mainperson,
            fzrdh: obj.mainpersonmobile,
            qylx: obj.typeid,
            aqfzr: obj.safeperson,
            aqfzrdh: obj.safepersonmobile,
            scjycp: obj.production,
            zgrs: 0,
            bz: '',
            tyxydm: obj.cardno,
            sfyzdwry: obj.ishavedanger,
            sscz: obj.community,
          } //JSON.stringify(lnglats)
          var point = {
            type: 'point',
            longitude: obj.locationx,
            latitude: obj.locationy,
          }
          var g = new Graphic({
            geometry: point,
            symbol: {
              type: 'simple-marker',
              color: 'white',
              width: 2,
            },
            attributes: attr,
          })
          featurelayer
            .applyEdits({
              addFeatures: [g],
            })
            .then(function (result) {
              if (result.addFeatureResults.length > 0) {
                console.log('sde入库成功')
              }
            })
    },
  }
}
</script>

<style lang="scss" scoped>
.padd{
  width: 100%;
  background: none!important;
  padding: 0!important;
  .el-card{
    min-height: calc(100vh - 104px)!important;
    margin-bottom: 0;
    ::v-deep{
      .el-card__header{
        background-color:#F5F7FA;
        color: #333;
        display: flex;
        justify-content: left;
        align-items: center;
        flex-direction: row;
        padding: 12px 20px;
        span{
          margin-left: 10px;
          line-height: 20px;
          display: inline-block;
        }
        i{
          width: 3px;
          height:20px;
          background-color:#0C9ED7;
          display: inline-block;
          position: relative;
          top: 4px;
        }
      }
      .el-card__body{
        .el-form{
          .el-form-item{
            .el-input,
            .el-select,
            .el-textarea,
            .el-date-picker{
              width: 340px;
            }
            .el-input--small .el-input__inner{
              height:36px;
              line-height:36px;
            }
            &.el-form-item--small{
              margin-bottom:25px;
            }
          }
        }
        .cardfooter{
          display:flex;
          justify-content:center;
          align-items:center;
          flex-direction:row;
          // padding-left:10%;
          margin-top:20px;
          .el-button--medium{
            font-size: 16px;
            padding: 12px 35px;
          }
        }
      }
    }
  }
}
</style>
