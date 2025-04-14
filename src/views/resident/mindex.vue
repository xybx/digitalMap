<template>
  <div class="mindex">
    <buttonForm @createUser="createUser" @exportClick="exportClick" @tempexportClick="tempexportClick" @importClick="importClick"/>
    <el-upload :action="uploadUrl" class="uploadfile"
      ref="upload"
      name="file"
      :show-file-list="false"
      accept=".xls"
      :data="filedata"
      :on-success="handleSuccess"
      :file-list="fileLists">
    </el-upload>
    <div class="manage-container">
      <el-row :gutter="10">
        <el-col :span="3">
          <el-card class="box-card animate__animated animate__fadeInLeft">
            <div class="text item">
              <div class="allbox">
                <el-checkbox v-model="checkAll" class="allcheck" :indeterminate="isIndeterminate" @change="handleAllChange">全选</el-checkbox>
                <el-button type="primary" size="mini" @click="savecheck">确 定</el-button>
              </div>
              <el-checkbox-group v-model="checkedVillage" @change="handleVillageChange">
                <el-checkbox v-for="item in villageData" :key="item.pid" :label="item.pid">{{item.areaname}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-card>
        </el-col>
        <el-col :span="21">
          <el-card class="box-card animate__animated animate__fadeInRight">
            <div slot="header">
              <i></i>
              <span>居民信息</span>
            </div>
            <div class="text item">
              <queryForm @queryClick="queryClick" @resetClick="resetClick" />
              <div id="water">
                <canvas id="canvas"></canvas>
              </div>
              <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
                <!--<el-table-column type="selection" align="center" width="55px"></el-table-column>-->
                <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
                <el-table-column prop="membername" label="姓名" align="center"></el-table-column>
                <el-table-column label="性别" align="center">
                  <template v-slot="scope">
                    {{scope.row.gender === 1 ? '男' : '女'}}
                  </template>
                </el-table-column>
                <el-table-column label="出生年月" align="center">
                  <template v-slot="scope">
                    {{scope.row.birthday ? scope.row.birthday.substr(0,10) :''}}
                  </template>
                </el-table-column>
                <el-table-column label="文化程度" align="center">
                  <template v-slot="scope">
                    <template v-if="scope.row.educationlevel">
                      {{scope.row.educationlevel | getshowedu(educateData)}}
                    </template>
                  </template>
                </el-table-column>
                <el-table-column v-if="this.sfgly==0" label="联系电话" align="center" show-overflow-tooltip>
                  <template v-slot="scope">
                    {{scope.row.phonenumber ? regular.tmPhone(scope.row.phonenumber) : ''}}
                  </template>
                </el-table-column>
                <el-table-column v-else label="联系电话" align="center" show-overflow-tooltip>
                  <template v-slot="scope">
                    {{scope.row.phonenumber ? scope.row.phonenumber : ''}}
                  </template>
                </el-table-column>
                <el-table-column label="家庭住址" align="center" show-overflow-tooltip>
                  <template v-slot="scope">
                    {{scope.row.permanentaddress ? scope.row.permanentaddress : ''}}
                  </template>
                </el-table-column>
                <el-table-column v-if="this.sfgly==0" label="身份证号" align="center" show-overflow-tooltip>
                  <template v-slot="scope">
                    {{scope.row.memberid ? regular.tmIdCard(scope.row.memberid) : ''}}
                  </template>
                </el-table-column>
                <el-table-column v-else label="身份证号" align="center" show-overflow-tooltip>
                  <template v-slot="scope">
                    {{scope.row.memberid ? scope.row.memberid : ''}}
                  </template>
                </el-table-column>
                <el-table-column label="户口类型" align="center">
                  <template v-slot="scope">
                    <template v-if="scope.row.familytype">
                      {{scope.row.familytype | getshownode(nodeData)}}
                    </template>
                  </template>
                </el-table-column>
                <el-table-column label="与户主关系" align="center">
                  <template v-slot="scope">
                    <template v-if="scope.row.familyrelationship">
                      {{scope.row.familyrelationship | getshow(relatData)}}
                    </template>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="220px">
                  <template v-slot="scope">
                    <el-button type="text" @click="edituser(scope.row.familyid,scope.row.memberid,scope.row.familyrelationship)">修改</el-button>
                    <el-button type="text" class="reds" @click="deluser(scope.row.memberid,scope.row.headofhousehold)">删除</el-button>
                    <el-button v-if="scope.row.familyrelationship == 21" class="green" type="text" @click="adduser(scope.row.familyid,scope.row.familyrelationship)">添加成员</el-button>
                    <el-button type="text" class="yellow" @click="lookuser(scope.row.familyid,scope.row.memberid)">查看详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <filedialog ref="filedia" @uploadFile="uploadFile" />
    <el-dialog class="processbox" :visible.sync="prodialogVisible" title="文件上传进度" width="20%" top="10%" :append-to-body="true" :close-on-click-modal="false" :show-close="false" center>
        <el-progress type="circle" :percentage="percentage" :stroke-width="8" :width="230"></el-progress>
    </el-dialog>
  </div>
</template>

<script>
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import Query from '@arcgis/core/rest/support/Query'
import * as query from '@arcgis/core/rest/query'
import Graphic from '@arcgis/core/Graphic'
import buttonForm from "./components/buttonForm";
import queryForm from "./components/queryForm";
import filedialog from "./components/filedialog";
import {getmanageList, deleteUser, getvillageList, getDictionaryList, getServerurl, getProcess} from './api/resident'
import {mapGetters} from "vuex";
let app;
let timer = null;
export default {
  name: "mindex",
  data() {
    return {
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      pageNo: 1,
      pageSize: 0,
      pageSizes: [5, 8, 10],
      formData:{},
      checkAll:false,
      checkedVillage:[],
      villageData:[],
      isIndeterminate: true,
      relatData:[],
      educateData:[],
      nodeData:[],
      uploadUrl:'',
      fileLists:[],
      filedata:{},
      prodialogVisible:false,
      percentage:0,
      sfgly:''
    }
  },
  components:{
    buttonForm,
    queryForm,
    filedialog
  },
  filters:{
    getshowedu(val,arr){
      return arr.filter(item=>{return item.dicid == val})[0]?.dicname
    },
    getshownode(val,arr){
      return arr.filter(item=>{return item.dicid == val})[0]?.dicname
    },
    getshow(val,arr){
      return arr.filter(item=>{return item.dicid == val})[0]?.dicname
    }
  },
  computed: {
    ...mapGetters({
      userData:'user/userData'
    })
  },
  created() {
    this.pageSize = this.pageSizes[2];
    this.getvillage()
    this.getfamilyship()
    this.geteducate()
    this.getfamilytype()
    this.getFilecate()
    this.sfgyl = this.userData.isadmin
  },
  mounted() {
    app=this;
    this.uploadUrl = `${this.$baseUrl}/familyimport/importexcel`
    this.getData()
    this.getWater()
  },
  methods: {
    //添加水印
    getWater() {
      const canvas = document.getElementById("canvas");//获取canvas
      canvas.width = 300;//设置画布宽度
      canvas.height = 260;//设置画布高度
      canvas.style.display = "none";//隐藏画布本身
      const ctx = canvas.getContext("2d");//获取画笔
      ctx.font = "1.3vmax sans-serif";//设置文字大小
      ctx.fillStyle = "rgba(0,0,0,.1)";//设置文字颜色及透明度
      ctx.rotate(-0.4);//设置文字旋转角度
      ctx.fillText(this.userData.username, canvas.width / 6, canvas.height / 2);//设置显示文字内容
      const img = canvas.toDataURL("image/png");//参数默认为 image/png,可以是其他image/jpeg等，该方法返回值是一个url，是base64组成的图片的源数据、可以直接赋值给图片的src属性
      const style = `background-image:url(${img});`;//定义样式
      water.setAttribute("style", style);//给要添加水印的元素设置样式
    },
    async geteducate(){
      let res = await getDictionaryList({dictypeid:2})
      if(res.code == 200){
        this.educateData = res.data
      }
    },
    async getfamilytype(){
      let res = await getDictionaryList({dictypeid:3})
      if(res.code == 200){
        this.nodeData = res.data
      }
    },
    async getfamilyship(){
      let res = await getDictionaryList({dictypeid:4})
      if(res.code == 200){
        this.relatData = res.data
      }
    },
    async getFilecate(){
      let res = await getDictionaryList({dictypeid:24})
      if(res.code == 200){
        this.filecate = res.data
      }
    },
    async getData(){
      let data = {
        pagenumber:this.pageNo,
        pagesize:this.pageSize,
        searchtype:1
      }
      let obj = this.formData
      if(this.checkedVillage.length >= 0){
        Object.assign(obj,{villageids:this.checkedVillage})
      }
      let arr = Object.keys(obj)
      for(let i in obj){
        if(i == 'searchtype'){
          Object.assign(data,{searchtype:obj[i] != 1 ? obj[i] : 1})
        } else if(arr.includes(i)){
          Object.assign(data,obj)
        }
      }
      let res = await getmanageList(data)
      if(res.code == 200){
        this.tableData = res.data.list
        this.total = res.data.total
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)
    },
    createUser(){
      this.$router.push({
        path:'/mindex/medit'
      })
    },
    tempexportClick(){
      this.$refs.filedia.showflex(3)
    },
    exportClick(){
      this.$refs.filedia.showflex(1)
    },
    importClick(){
      this.$refs.filedia.showflex(2)
    },
    uploadFile(type){
      this.filedata = {
        areaid:this.userData.areaid,
        type:type
      }
      this.$refs['upload'].$refs['upload-inner'].handleClick()
    },
    handleSuccess(response, file, fileList) {
      if(response.code == 200){
        this.prodialogVisible = true
        timer = window.setInterval(async ()=>{
          this.handleProgress(file)
        },1000)
      }
    },
    async handleProgress(file){
      let res = await getProcess({uuid:file.response.data})
      if(res.code == 200){
        if(res.data.end){
          this.percentage = res.data.schedule
          window.clearInterval(timer)
          setTimeout(()=>{
            this.prodialogVisible = false
            this.$message.success('导入成功')
            this.getData()
          },1000)
        }else {
          this.percentage = res.data.schedule
        }
      }
    },
    queryClick(form){
      this.formData = form
      this.pageNo = 1
      this.getData()
    },
    resetClick(obj){
      this.formData = obj
      this.pageNo = 1
      this.getData()
    },
    SizeChange(val){
      this.pageSize = val;
      this.getData();
    },
    CurrentChange(val){
      this.pageNo = val;
      this.getData();
    },
    handleAllChange(val){
      this.checkedVillage = val ? this.villageData.map(item=>{
        return item.pid
      }) : []
      this.isIndeterminate = false
    },
    handleVillageChange(val){
      let count = val.length;
      this.checkAll = count === this.villageData.length;
      this.isIndeterminate = count > 0 && count < this.villageData.length;
    },
    savecheck(){
      this.getData()
    },
    async getvillage(){
      let res = await getvillageList()
      if(res.code == 200){
        this.villageData = res.data.map(item=>{
          return {
            pid:item.pid,
            areaname:item.areaname
          }
        })
      }
    },
    edituser(fid,mid,rid){
      this.$router.push({
        path:'/mindex/medit',
        query:{type:1,fid,mid,rid}
      });
    },
    async DeletePointSDE(id,typeid) {
      let ret = false;
      let serverdata = await getServerurl({typeid:typeid});
      var featureurl = serverdata.data.replace("MapServer", "FeatureServer");
      var featurelayer1 = new FeatureLayer({
        url: featureurl,
        outFields: ["*"]
      });
        var queryObject = new Query();
        queryObject.where = `hbh = '${id}'`;
        queryObject.outFields = ["*"];
        queryObject.returnGeometry = true;
        try {
          let results = await query.executeQueryJSON(featureurl,queryObject)
          if (results != null) {
            if (results.features.length > 0){
              var feature = results.features[0];
              let result = await featurelayer1.applyEdits({deleteFeatures: [feature]})
              if (result.deleteFeatureResults.length > 0) {
                ret = true;
              } else{
                ret = false;
              }
            }
          }else{
            ret = true;
          }
          return ret;
        }catch (err) {
          console.log(err,'error');
          this.$message.error('删除失败')
          return false
        }
    },
    deluser(mid,hid){
      this.$baseConfirm('你确定要删除该居民信息吗？','删除提示',async ()=>{
        let ret1,ret2
        if(hid == 1){
          ret1 = await this.DeletePointSDE(mid,5)
          ret2 = await this.DeletePointSDE(mid,6)
        }
        let res = await deleteUser({memberid:mid})
        if(res.code === 200){
          this.$message.success(res.msg)
          this.getData()
        }else if(res.code === 201){
          this.$message.success(res.msg)
          return false
        }
      })
    },
    adduser(fid,rid){
      this.$router.push({
        path:'/mindex/medit',
        query:{type:3,fid,rid}
      });
    },
    lookuser(fid,mid){
      this.$router.push({
        path:'/mindex/medit',
        query:{type:2,fid,mid}
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.mindex{
  .uploadfile{
    display: none;
  }
  .manage-container{
    padding: 0 10px 10px;
    .el-row{
      .el-col{
        .el-card{
          height: calc(100vh - 161px)!important;
          overflow-y: auto;
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
                height:16px;
                background-color:#0C9ED7;
                display: inline-block;
                position: relative;
                top: 3px;
              }
            }
            .el-card__body{
              padding:15px;
              .allbox{
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 10px;
                .el-button{
                  padding: 6px 10px;
                  border-radius: 3px;
                }
              }
              .el-checkbox-group{
                .el-checkbox{
                  width: 100%;
                  margin-right: 0;
                  margin-bottom: 5px;
                  &:last-child{
                    margin-bottom: 0;
                  }
                }
              }
               #water{
                width: 100%;
                height: 100%;
                position: absolute;
                left:0;
                top:0;
                pointer-events: none;
                z-index:1;
              }
              .el-table{
                .el-table__body{
                  .el-button{
                    &.reds{
                      color: #fd0c0c;
                    }
                    &.green{
                      color: #09be21;
                    }
                    &.yellow{
                      color: #e7a915;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
.processbox{
  ::v-deep{
    .el-dialog__body{
      display:flex;
      flex-direction:column;
      justify-content: center;
      align-items: center;
    }
  }
}


</style>
