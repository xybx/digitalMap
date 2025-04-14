<template>
  <div class="mindex">
    <buttonForm  @exportClick="exportClick"/>
    <div class="manage-container">
      <el-row :gutter="10">
        <el-col :span="3">
          <el-card class="box-card animate__animated animate__fadeInLeft">
            <div class="text item">
              <div class="allbox">
                <el-checkbox v-model="checkAll" class="allcheck" :indeterminate="isIndeterminate" @change="handleAllChange">全选</el-checkbox>
                <el-button type="primary" size="mini" @click="savecheck">确 定</el-button>
              </div>
              <el-tree ref="levtree" :data="treeList" v-loading="loading" element-loading-text="数据加载中" element-loading-spinner="el-icon-loading" show-checkbox node-key="pid" :highlight-current="true" @check="checkChange" :props="defaultProps"></el-tree>
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
                    {{scope.row.gender == 1 ? '男' : '女'}}
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
                <el-table-column label="联系电话" align="center" show-overflow-tooltip>
                  <template v-slot="scope">
                    {{scope.row.phonenumber ? scope.row.phonenumber : ''}}
                  </template>
                </el-table-column>
                <el-table-column label="家庭住址" align="center" show-overflow-tooltip>
                  <template v-slot="scope">
                    {{scope.row.permanentaddress ? scope.row.permanentaddress : ''}}
                  </template>
                </el-table-column>
                <el-table-column label="户编号" align="center" show-overflow-tooltip>
                  <template v-slot="scope">
                    {{scope.row.familyid ? scope.row.familyid : ''}}
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
                <el-table-column label="操作" align="center">
                  <template v-slot="scope">
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
    <filedialog ref="filedia" />
  </div>
</template>

<script>
import buttonForm from "./components/buttonForm";
import queryForm from "./components/queryForm";
import filedialog from "./components/filedialog";
import {getDictionaryList, getServerurl, getLevelList, getlevageList} from './api/levrest'
import {mapGetters} from "vuex";
import esriLoader from "esri-loader";
let app;
export default {
  name: "mindex",
  data() {
    return {
      option:{
       url: '/arcgis_js_api/library/4.23/init.js',
        css: '/arcgis_js_api/library/4.23/esri/css/main.css',
      },
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
      checkedAreaid:[],
      treeList: [],
      loading: true,
      defaultProps:{
        children: 'children',
        label: 'label',
      },
      isIndeterminate: false,
      relatData:[],
      educateData:[],
      nodeData:[],
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
  },
  mounted() {
    app=this;
    this.getData()
    this.getWater()
  },
  methods: {
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
        searchtype:1,
      }
      let obj = this.formData
      if(this.checkedVillage.length > 0){
        Object.assign(obj,{villageids:this.checkedVillage})
      }
      if(this.checkedAreaid.length > 0){
        Object.assign(obj,{areaids:this.checkedAreaid})
      }
      let arr = Object.keys(obj)
      for(let i in obj){
        if(i == 'searchtype'){
          Object.assign(data,{searchtype:obj[i] != 1 ? obj[i] : 1})
        } else if(arr.includes(i)){
          Object.assign(data,obj)
        }
      }
      let res = await getlevageList(data)
      if(res.code == 200){
        this.tableData = res.data.list
        this.total = res.data.total
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)
    },
    exportClick(){
      let arr1 = this.checkedAreaid
      let arr2 = this.checkedVillage
      this.$refs.filedia.showflex(arr1,arr2)
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
    handleAllChange(){
      //这个如果要默认全选就必须加，否则会报错“setCheckedNodes”未定义
      this.$nextTick(() => {
        this.checkAll ? this.$refs.levtree.setCheckedNodes(this.treeList) : this.$refs.levtree.setCheckedKeys([])
      })
      this.checkedVillage = this.checkAll ? this.treeList.map(item=> item.children.map(val=> val.pid)).flat() : []
      this.checkedAreaid = this.checkAll ? this.treeList.map(item=> item.pid) : []
      this.isIndeterminate = false
    },
    checkChange(arr,obj){
      let trr = this.treeList.map(item=>item.pid)
      let parentCheckCount = 0
      let indeterminate_flag = false;//有没有一级节点处于半选状态
      this.treeList.map((item)=>{
        if(this.$refs.levtree.getNode(item).checked == true){
          parentCheckCount += 1
        }
        if(this.$refs.levtree.getNode(item).indeterminate == true){
          indeterminate_flag = true
        }
      })
      if(parentCheckCount == 0){
        this.isIndeterminate = false
        this.checkAll = false
        this.checkedVillage = []
        this.checkedAreaid = []
        if(indeterminate_flag == true){//如果下面有半选的，设置全选按钮的样式为半选样式
          this.isIndeterminate = true;
          this.checkAll = false;
          this.checkedAreaid = obj.halfCheckedKeys
          this.checkedVillage = obj.checkedKeys
        }
      }else if(parentCheckCount == this.treeList.length){
        this.isIndeterminate = false
        this.checkAll = true
        this.checkedAreaid = trr
        this.checkedVillage = obj.checkedKeys.concat(trr).filter(item=> !trr.includes(item))
      }else {
        this.isIndeterminate = true
        this.checkAll = false
        let crr = trr.filter(item => new Set(obj.checkedKeys).has(item))
        this.checkedAreaid = Array.from(new Set([...crr,...obj.halfCheckedKeys]))
        this.checkedVillage = obj.checkedKeys.filter(item=> !new Set(crr).has(item))
      }
      return
    },
    savecheck(){
      this.getData()
    },
    async getvillage(){
      let res = await getLevelList()
      if(res.data.length > 0){
        this.treeList = res.data.map(item=>{
          return {
            pid:item.pid,
            label:item.areaname,
            children:item.children ? item.children.map(val=>{return {
              pid:val.pid,
              label:val.areaname,
            }}) : []
          }
        })
        this.loading = false
      }else {
        this.loading = false
      }
    },
    lookuser(fid,mid){
      this.$router.push({
        path:'/levpeo/levedit',
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
</style>
