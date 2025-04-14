<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="40%" top="1%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-radio-group v-if="countData.pid && showkey == 2 && !cate" v-model="tabCard" class="radiogroup" @change="tabChange" size="-">
      <el-radio-button label="baseinfo">基本信息</el-radio-button>
      <el-radio-button label="flowover">互动详情</el-radio-button>
    </el-radio-group>
    <el-form ref="countData" :model="countData" :rules="rules" status-icon label-width="80px">
      <template v-if="cate">
        <el-form-item label="榜单类别" prop="name" label-width="110px">
          <el-input v-model="countData.name" placeholder="请输入榜单类别"/>
        </el-form-item>
        <el-form-item label="类别描述" prop="describe" label-width="110px">
          <el-input type="textarea" :rows="5" v-model="countData.describe" placeholder="请输入类别描述"/>
        </el-form-item>
        <el-form-item label="被赞积分" prop="likedintegral" label-width="110px">
          <el-input v-model="countData.likedintegral" placeholder="请输入被赞积分"/>
        </el-form-item>
        <el-form-item label="被赞最大积分" prop="likedmaxintegral" label-width="110px">
          <el-input v-model="countData.likedmaxintegral" placeholder="请输入被赞最大积分"/>
        </el-form-item>
        <el-form-item label="点赞人积分" prop="likeintegral" label-width="110px">
          <el-input v-model="countData.likeintegral" placeholder="请输入点赞人积分"/>
        </el-form-item>
      </template>
      <template v-else>
        <template v-if="tabCard == 'baseinfo'">
          <template v-if="country">
            <div class="titlebox">
              <i></i>
              <span>基本信息</span>
            </div>
            <el-form-item label="榜单类别" prop="typeid">
              <el-select v-model="countData.typeid" placeholder="请选择榜单类别" @visible-change="visibleChange">
                <el-option v-for="item in cateData" :key="item.pid" :label="item.name + ' ('+ item.likedintegral +'积分)'" :value="item.pid"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属村居" prop="villageid">
              <el-select v-model="countData.villageid" placeholder="请选择所属村居" clearable>
                <el-option v-for="item in villData" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="榜单标题" prop="title" label-width="80px">
              <el-input v-model="countData.title" placeholder="请输入榜单标题" maxlength="100" show-word-limit/>
            </el-form-item>
            <el-form-item label="榜单内容" prop="content">
              <el-input v-model="countData.content" type="textarea" :rows="5" maxlength="300" show-word-limit placeholder="请输入榜单内容" />
            </el-form-item>
            <el-form-item label="榜单图片" required>
              <uploadImage v-if="!countData.pid || (countData.pid && showkey == 1)" :imgLists="imgLists" @removeSuccess="removeSuccess" @uploadSuccess="uploadSuccess" />
              <template v-if="countData.pid && showkey == 2">
                <template v-if="imgdata.length > 0">
                  <el-image v-for="(item,index) in imgdata" :key="index" :src="item" :preview-src-list="imgdata" :z-index="2999"></el-image>
                </template>
                <div v-else class="imagebox">
                  <i class="el-icon-picture-outline"></i>
                  <u>暂无图片</u>
                </div>
              </template>
            </el-form-item>
            <el-divider></el-divider>
            <div class="titlebox">
              <i></i>
              <span>规则设置</span>
            </div>
            <el-form-item label="是否置顶" prop="top">
              <el-select v-model="countData.top" placeholder="请选择是否置顶" clearable>
                <el-option :value="0" label="不置顶"></el-option>
                <el-option :value="1" label="置顶"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否点赞" prop="likebuttonstate">
              <el-select v-model="countData.likebuttonstate" placeholder="请选择是否置顶" clearable>
                <el-option :value="0" label="关闭点赞"></el-option>
                <el-option :value="1" label="开启点赞"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否关联人员" label-width="105px" prop="likedpoints">
              <el-select v-model="countData.likedpoints" placeholder="请选择是否关联人员" clearable>
                <el-option :value="0" label="否"></el-option>
                <el-option :value="1" label="是"></el-option>
              </el-select>
            </el-form-item>
            <template v-if="countData.likedpoints == 1">
              <el-form-item label="积分到账人员" prop="likeds" label-width="105px">
                <el-cascader v-model="countData.likeds" :options="options" :props="props" filterable placeholder="请选择积分到账人员"></el-cascader>
              </el-form-item>
            </template>
            <el-form-item label="积分结束时间" label-width="105px" prop="endtime">
              <el-date-picker v-model="countData.endtime" type="date" value-format="yyyy-MM-dd" :picker-options="pickerOptions" placeholder="请选择积分结束时间" clearable></el-date-picker>
            </el-form-item>
          </template>
          <template v-if="town">
            <el-form-item label="所属村居">
              <el-select v-model="countData.villageid" placeholder="请选择所属村居" clearable>
                <el-option v-for="item in villData" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="countData.uname" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="内容">
              <el-input v-model="countData.tcont" type="textarea" :rows="5" placeholder="请输入内容"/>
            </el-form-item>
            <el-form-item label="图片">
              <template v-if="countData.pid">
                <template v-if="urldata.length > 0">
                  <el-image v-for="(item,index) in urldata" :key="index" :src="item" :preview-src-list="urldata" :z-index="2999"></el-image>
                </template>
                <div v-else class="imagebox">
                  <i class="el-icon-picture-outline"></i>
                  <u>暂无图片</u>
                </div>
              </template>
            </el-form-item>
            <el-form-item label="发布时间">
              <el-date-picker v-model="countData.publishertime" type="date" value-format="yyyy-MM-dd" placeholder="请选择发布时间"></el-date-picker>
            </el-form-item>
          </template>
        </template>
        <template v-if="tabCard == 'flowover'">
          <div class="thumb">
            <div class="titbox">
              <i></i>
              <span>点赞人员</span>
            </div>
            <template v-if="thumbData.length > 0">
              <ul>
                <li v-for="item in thumbData" :key="item.id">{{ town ? item.name : item.username}}</li>
              </ul>
              <el-pagination background :current-page="pageNothumb" :page-size="pageSizethumb" :page-sizes="pageSizesthumb" :layout="layout" :total="totalthumb" @size-change="thumbSizeChange" @current-change="thumbCurrentChange"></el-pagination>
            </template>
            <template v-else>
              <span>暂无点赞</span>
            </template>
          </div>
          <el-divider></el-divider>
          <div class="discuss">
            <div class="titbox">
              <i></i>
              <span>评论列表</span>
            </div>
            <template v-if="cussData.length > 0">
              <ul>
                <li v-for="item in cussData">
                  <p>
                    <span>{{town ? item.name : item.username}}:</span>{{town ? item.content : item.commentcontent}}
                  </p>
                  <span>{{town ? item.comdate : item.commenttime}}</span>
                </li>
              </ul>
              <el-pagination background :current-page="pageNocuss" :page-size="pageSizecuss" :page-sizes="pageSizescuss" :layout="layout" :total="totalcuss" @size-change="cussSizeChange" @current-change="cussCurrentChange"></el-pagination>
            </template>
            <template v-else>
              <span>暂无评论</span>
            </template>
          </div>
        </template>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="showkey == 1||!showkey" type="primary" size="-" @click="saveData">确 定</el-button>
      <el-button size="-" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {getConutryTail, putCountry, getThumbsList, getCommentList, putCateData, getCateTail, getVillagecate, getVillage, getVillageUsers} from "../api/country"
import {getTownCommentList, getTownshipTail, getTownThumbsList} from '../api/township'
import uploadImage from '@/views/petition/components/uploadImage'
import {deleteimgFile} from "@/views/petition/api/petion";
import {isNumber} from '@/utils/validate'
export default {
  name: "coudialog",
  data() {
    let numvalid1 = (rule, value, callback)=>{
        if(!value){
          return callback(new Error('请输入每次点赞积分值'))
        }else if(!isNumber(value)){
          return callback(new Error('请输入数字'))
        }else{
          callback()
        }
    }
    let numvalid2 = (rule, value, callback)=>{
      if(!value){
        return callback(new Error('请输入积分最大值'))
      }else if(!isNumber(value)){
        return callback(new Error('请输入数字'))
      }else{
        callback()
      }
    }
    let numvalid3 = (rule, value, callback)=>{
      if(!value){
        return callback(new Error('请输入点赞人积分'))
      }else if(!isNumber(value)){
        return callback(new Error('请输入数字'))
      }else{
        callback()
      }
    }
    return {
      tabCard:'baseinfo',
      dialogVisible:false,
      title:'',
      countData:{},
      villData:[],
      keys:null,
      rules:{
        typeid:[{required: true, trigger: "change", message: "请选择榜单类别"}],
        villageid:[{required: true, trigger: "change", message: "请选择所属村居"}],
        title:[{required: true, trigger: "blur", message: "请填写榜单标题"}],
        content:[{required: true, trigger: "blur", message: "请填写榜单内容"}],
        top:[{required: true, trigger: "change", message: "请选择是否置顶"}],
        likebuttonstate:[{required: true, trigger: "change", message: "请选择是否点赞"}],
        likedpoints:[{required: true, trigger: "change", message: "请选择是否关联人员"}],
        likeds:[{required: true, trigger: "change", message: "请选择积分到账人员"}],
        endtime:[{required: true, trigger: "change", message: "请选择积分结束时间"}],
        name:[{required: true, trigger: "blur", message: "请输入榜单类别"}],
        describe:[{required: true, trigger: "blur", message: "请输入榜单类别描述"}],
        likedintegral:[{required: true,validator:numvalid1, trigger: "blur"}],
        likedmaxintegral:[{required: true,validator:numvalid2, trigger: "blur"}],
        likeintegral:[{required: true,validator:numvalid3, trigger: "blur"}]
      },
      pickerOptions:{
        disabledDate(time) {
          return time.getTime() <= Date.now();
        },
      },
      options:[],
      props: {
        emitPath:false,
        multiple:true,
        expandTrigger: 'hover',
        value: "id",
        label: "name",
        children: "children",
      },
      cateData:[],
      imgLists:[],
      imgdata:[],
      urldata:[],
      tabname:'',
      layout: "total, sizes, prev, pager, next, jumper",
      totalthumb:0,
      pageNothumb:1,
      pageSizethumb:0,
      pageSizesthumb: [10, 15, 20],
      totalcuss:0,
      pageNocuss:1,
      pageSizecuss:0,
      pageSizescuss: [10, 15, 20],
      thumbData:[],
      cussData:[],
      showkey:null,
    }
  },
  props:['country','cate','town'],
  components: {
    uploadImage
  },
  computed: {},
  created() {
    this.pageSizethumb = this.pageSizesthumb[0];
    this.pageSizecuss = this.pageSizescuss[0];
  },
  mounted() {
    this.getCate()
    this.getvills()
    this.getUsers()
  },
  methods: {
    async getUsers(){
      let res = await getVillageUsers()
      this.options = res.data ? res.data.map(item=>{
        return {
          id:item.pid,
          name:item.areaname,
          children:item.publicusers.length > 0 ? item.publicusers.map(val=>{
            return {
              id:val.pid,
              name:val.name
            }
          }): []
        }
      }) : []
    },
    async getvills(){
      let res = await getVillage()
      this.villData = res.data ? res.data.map(item=>{
        return {
          pid:item.pid,
          areaname:item.areaname,
        }
      }) : []
    },
    async getCate(){
      let res = await getVillagecate()
      this.cateData = res.data ? res.data.map(item=>{
        return {
          pid:item.pid,
          name:item.name,
          likedintegral:item.likedintegral
        }
      }) : []
    },
    visibleChange(e){
      if(e){
        this.cateData.length == 0 ? this.$message.warning('请先在类型规则中添加办单类别') : ''
      }
    },
    async showData(pid,index){
      this.getCate()
      this.getvills()
      this.getUsers()
      if(!pid) {
        this.title = !this.cate ? '添加乡村榜单' : '添加榜单类别'
        this.showkey = null
      }
      if(pid){
        let res
        this.showkey = index

        if(this.cate){
          this.title = index == 1 ? '编辑乡村榜单类别' : '查看乡村榜单类别'
          res = await getCateTail({pid})
          this.countData = res.data
        }else if(this.country){
          this.title = index == 1 ? '编辑乡村榜单' : '查看乡村榜单'
          res = await getConutryTail({pid})
          this.countData = res.data
          if(index == 1){
            if(res.data.images && res.data.images != ''){
              this.getFiles(res.data.images)
            }
          }else{
            this.imgdata = res.data.images && res.data.images != '' ? res.data.images.split(',').map(item=>{
              return `${this.$baseUrl}/gridfs/image/${item}`
            }) : []
            this.getlike()
            this.getcommnet()
          }
        }else if(this.town){
          this.title = '查看乡情圈详情'
          res = await getTownshipTail({pid})
          this.countData = res.data
          this.countData.uname = res.data.name
          this.countData.tcont = res.data.content
          this.urldata = res.data.images && res.data.images != '' ? res.data.images.split(',').map(item=>{
            return `${this.$baseUrl}/gridfs/image/${item}`
          }) : []
          this.getlike()
          this.getcommnet()
        }
      }
      this.dialogVisible = true
    },
    getFiles(str){
      let fileArr = str.split(',').map(item=>{
        return {
          fileid:item,
          url:`${this.$baseUrl}/gridfs/image/${item}`
        }
      });
      this.imgLists = fileArr
    },
    async getlike(){
      let params = {
        pagenum:this.pageNothumb,
        pagesize:this.pageSizethumb,
        pid:this.countData.pid
      }
      let res = this.town ? await getTownThumbsList(params) : await getThumbsList(params)
      if(res.code == 200){
        this.thumbData = res.data.list
        this.totalthumb = res.data.total
      }
    },
    async getcommnet(){
      let params = {
        pagenum:this.pageNocuss,
        pagesize:this.pageSizecuss,
        pid:this.countData.pid
      }
      let res = this.town ? await getTownCommentList(params) : await getCommentList(params)
      if(res.code == 200){
        this.cussData = res.data.list
        this.totalcuss = res.data.total
      }
    },
    saveData(){
      this.$refs.countData.validate(async (valid)=>{
        if(valid){
          let data = Object.assign({},this.countData)
          if(this.country){
            if(this.imgLists.length > 0){
              Object.assign(data,{images:this.imgLists.map(item=> item.fileid).join(',')})
            }else {
              this.$message.error('请上传榜单图片')
              return false
            }
          }
          if(this.cate){
            if(Number(data.likedintegral)  > Number(data.likedmaxintegral)){
              this.$message.error('每次点赞积分不能大于上限值')
              return false
            }
          }
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          let res = this.cate ? await putCateData(data) : await putCountry(data)
          if(res.code === 200){
            loading.close();
            this.$message.success(this.cate ? this.showkey&&this.showkey == 1 ? '榜单类别修改成功': '榜单类别添加成功' : this.showkey&&this.showkey == 1 ? '乡村榜单修改成功':'乡村榜单添加成功')
            this.handleClose()
            this.$emit('getData')
          }else if(res.code == 201){
            loading.close();
            this.$message.error(res.msg)
            return false
          }
        }else {
          return false
        }
      })
    },
    tabChange(val){
      this.tabCard = val
    },
    async removeSuccess(fileId,fileList){
      let res = await deleteimgFile({fileId})
      if(res.code === 200){
        this.$message.success("删除成功")
      }
      this.imgLists = fileList;
    },
    uploadSuccess(fileList){
      this.imgLists = fileList.map(item=>{
        return {
          fileid:item.response.data,
          url:item.url
        }
      })
    },
    handleClose(){
      this.title = ''
      this.tabCard = 'baseinfo'
      this.tabname = ''
      this.imgLists = []
      this.$refs.countData.resetFields()
      this.countData = this.$options.data().countData
      this.dialogVisible = false
    },
    thumbSizeChange(val){
      this.pageSizethumb = val
      this.getlike()
    },
    thumbCurrentChange(val){
      this.pageNothumb = val;
      this.getlike()
    },
    cussSizeChange(val){
      this.pageSizecuss = val
      this.getcommnet()
    },
    cussCurrentChange(val){
      this.pageNocuss = val
      this.getcommnet()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__body{
  .radiogroup {
    display: block;
    text-align: center;
    margin-bottom: 15px;
  }
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
      ::v-deep{
        .el-input--small .el-input__inner{
          height: 38px;
          line-height: 38px;
        }
        .el-cascader{
          .el-cascader__tags{
            flex-direction: row;
            max-height: 160px;
            overflow-y: auto;
            .el-tag{
              width: 48%;
              &:first-child{
                margin-left: 10px;
              }
            }
          }
        }
        .imagebox{
          width: 150px;
          height: 150px;
          background-color: #f3f3f3;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          border-radius: 5px;
          i{
            font-size: 30px;
            color: #999;
          }
          u{
            text-decoration: none;
            font-size: 15px;
            color: #999;
          }
        }
        .el-image{
          width: 140px;
          height: 140px;
          float: left;
          border-radius: 5px;
          box-shadow: 0 1px 3px 1px rgba(0,0,0,.1);
          margin-right: 10px;
          margin-bottom: 10px;
        }
      }
    }
  }
  .thumb,.discuss{
    width: 100%;
    .titbox{
      flex-direction: row;
      justify-content: left;
      i{
        width:4px;
        height:18px;
        background-color: #0b90ca;
        margin-right: 10px;
      }
    }
    &>span{
      font-size: 16px;
      padding-left: 20px;
      color: #999;
    }
  }
  .thumb ul{
    overflow: hidden;
    background-color: #F5F7FA;
    padding: 10px 15px;
    border: 1px solid #EBEEF5;
    li{
      float: left;
      width:10%;
      color: #333;
      margin-bottom: 10px;
    }
  }
  .discuss ul{
    padding-left: 0;
    overflow: hidden;
    li{
      display: flex;
      flex-direction: column;
      p{
        background-color: #F5F7FA;
        padding: 10px 15px;
        border: 1px solid #EBEEF5;
        color:#666;
        font-size: 14px;
        span{
          color: #333;
          font-size: 16px;
          margin-right: 5px;
        }
      }
      &>span{
        text-align: right;
        color: #999;
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
