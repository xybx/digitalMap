<template>
  <div class="owner">
    <el-form ref="ownerData" :model="ownerData" :inline="true" :rules="rules" status-icon label-width="80px">
      <el-form-item label="户主姓名" prop="membername">
        <el-input v-model="ownerData.membername" :readonly="dreadonly" placeholder="请输入户主姓名" @input="inputChange"/>
      </el-form-item>
      <el-form-item label="联系方式">
        <el-input type="tel" v-model="ownerData.memberphone" :readonly="readonly" maxlength="11" placeholder="请输入联系方式" @input="inputChange"/>
      </el-form-item>
      <el-form-item label="身份证号" prop="masterid">
        <el-input v-model="ownerData.masterid" :readonly="dreadonly" placeholder="请输入身份证号" maxlength="18" @input="inputChange" />
      </el-form-item>
      <el-form-item label="所属村" prop="villageid">
        <el-select v-model="ownerData.villageid" placeholder="请选择所属村" :disabled="disabled" @change="disChange">
          <el-option v-for="item in villageData" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属网格" prop="gridareaid">
        <el-select v-model="ownerData.gridareaid" placeholder="请选择所属网格" :disabled="disabled" @change="disChange">
          <el-option label="一级网格" :value="1"></el-option>
          <el-option label="二级网格" :value="2"></el-option>
          <el-option label="三级网格" :value="3"></el-option>
          <el-option label="微级网格" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="户编号" prop="familyid">
        <el-input v-model="ownerData.familyid" :readonly="dreadonly" placeholder="请输入户编号" @input="inputChange"/>
      </el-form-item>
      <el-form-item label="人口数量">
        <el-input v-model.number="ownerData.population" :readonly="true" maxlength="2" placeholder="请输入人口数量"/>
      </el-form-item>
      <el-form-item label="住房类型">
        <el-select v-model="ownerData.housingtype" placeholder="请选择住房类型" :disabled="disabled" @change="disChange">
          <el-option v-for="item in accomData" :key="item.dicid" :value="item.dicid" :label="item.dicname"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="住房地址">
        <el-input v-model="ownerData.housingaddress" :readonly="readonly" placeholder="请输入住房地址" @input="inputChange"/>
      </el-form-item>
      <el-form-item label="住房门牌号">
        <el-input v-model="ownerData.housenumber" :readonly="readonly" placeholder="请输入住房门牌号" @input="inputChange"/>
      </el-form-item>
      <el-form-item label="住宅面积">
        <el-input v-model="ownerData.houseacreage" :readonly="readonly" placeholder="请输入住宅面积" @input="inputChange"/>
      </el-form-item>
      <el-form-item label="房结构类型">
        <el-select v-model="ownerData.buildingstructure" placeholder="请选择房结构类型" :disabled="disabled" @change="disChange">
          <el-option v-for="item in flatData" :key="item.dicid" :value="item.dicid" :label="item.dicname"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="房屋等级">
        <el-select v-model="ownerData.houselevel" placeholder="请选择房屋等级" :disabled="disabled" @change="disChange">
          <el-option v-for="item in levelData" :key="item.dicid" :value="item.dicid" :label="item.dicname"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="农田面积">
        <el-input v-model="ownerData.landacreage" :readonly="readonly" placeholder="请输入农田面积" @input="inputChange"/>
      </el-form-item>
      <el-form-item label="房产证编号">
        <el-input v-model="ownerData.housepropertycardnumber" :readonly="readonly" placeholder="请输入房产证编号" @input="inputChange"/>
      </el-form-item>
      <el-form-item label="房屋图片或附件" class="cardfile" label-width="-" align="left">
        <uploadCard :fileLists="fileLists" :showbox="showbox"  @removeSuccess="removeSuccess" @uploadSuccess="uploadSuccess" />
      </el-form-item>
      <el-form-item label="农田位置">
        <el-input v-model="ownerData.landadress" readonly placeholder="请选择农田位置" @click.native="nativeClick(1)"/>
      </el-form-item>
      <el-form-item label="家庭位置">
        <el-input v-model="ownerData.houseadress" readonly placeholder="请选择家庭位置" @click.native="nativeClick(2)" />
      </el-form-item>
      <el-form-item class="btnbox" v-if="partype == null || (partype == 1 && rid == 21)">
        <el-button type="primary" @click="saveData">保 存</el-button>
        <el-button plain v-if="!resetbtn" @click="resetData">重 置</el-button>
      </el-form-item>
      <landmap ref="land" :baseinfo="ownerData" @exportAttr="exportAttr"/>
    </el-form>
  </div>
</template>

<script>
import uploadCard from "./uploadCard";
import landmap from './landmap'
import {getDictionaryList, getFamilyDetail, getvillageList,putFamilyData,deleteImage} from '../api/resident'
import {isPhone,isIdCard} from '@/utils/validate'
export default {
  name: "owner",
  data() {
    let phoneValid = (rule, value, callback)=>{
      if(!value){
        return callback(new Error('请填写联系方式'))
      }else if(!isPhone(value)){
        return callback(new Error('请填写正确的11位联系方式'))
      }else{
        callback()
      }
    }
    let cardidValid = (rule, value, callback)=>{
      if(!value){
        return callback(new Error('请填写身份证号'))
      }else if(!isIdCard(value)){
        return callback(new Error('请填写正确的18位身份证号'))
      }else{
        callback()
      }
    }
    return {
      ownerData:{},
      rules:{
        membername:[{required:true,trigger:'blur',message:'请填写户主姓名'}],
        // memberphone:[{required:true,validator:phoneValid,trigger:'blur'}],
        masterid:[{required:true,validator:cardidValid,trigger:'blur'}],
        villageid:[{required:true,trigger:'change',message:'请填写所属村'}],
        gridareaid:[{required:true,trigger:'change',message:'请填写所属网格'}],
        familyid:[{required:true,trigger:'blur',message:'请填写户编号'}],
      },
      accomData:[],
      flatData:[],
      levelData:[],
      tabCard:'farmland',
      readonly:false,
      disabled:false,
      dreadonly:false,
      villageData:[],
      fileLists:[],
      showbox:false,
      housetypename:'',
      villagename:'',
      resetbtn:false
    }
  },
  props:['partype','parpid','rid'],
  components: {
    uploadCard,
    landmap
  },
  computed: {},
  created() {
    this.getvillage()
    this.gethoustype()
    this.gethousestructe()
    this.gethouslevel()
  },
  mounted() {
  },
  methods: {
    async getvillage(){
      let res = await getvillageList()
      if(res.code == 200){
        this.villageData = res.data
      }
    },
    async gethoustype(){
      let res = await getDictionaryList({dictypeid:1})
      if(res.code == 200){
        this.accomData = res.data
      }
    },
    async gethousestructe(){
      let res = await getDictionaryList({dictypeid:22})
      if(res.code == 200){
        this.flatData = res.data
      }
    },
    async gethouslevel(){
      let res = await getDictionaryList({dictypeid:25})
      if(res.code == 200){
        this.levelData = res.data
      }
    },
    nativeClick(i){
      if(!this.ownerData.membername){
        this.$message.error('请先填写户主姓名后，在选择地址！')
        return false
      }else if(!this.ownerData.villageid){
        this.$message.error('请先选择所属村后，在选择地址！')
        return false
      }else if(!this.ownerData.familyid){
        this.$message.error('请先填写户编号后，在选择地址！')
        return false
      }
      this.gethousename()
      this.getvilagename()
      this.$refs.land.showland(i,this.housetypename,this.villagename)
    },
    getvilagename(){
      this.villagename = this.villageData.filter(item=>{return item.pid==this.ownerData.villageid})[0]?.areaname
    },
    gethousename(){
      this.housetypename = this.accomData.filter(item=>{ return item.dicid == this.ownerData.housingtype})[0]?.dicname
    },
    exportAttr(i,arr){
      let crr = {1:'landadress',2:'houseadress'}
      let krr = Object.keys(crr).map(item=> Number(item))
      if(krr.includes(i)){
        this.$forceUpdate()
        this.ownerData[crr[i]] = arr.join(',')
      }
    },
    async showData(){
      let res = await getFamilyDetail({familyId:this.parpid})
      if(res.data){
        this.ownerData = res.data
        // this.ownerData.houseadress = `${res.data.houselongitude},${res.data.housedimensionality}`
        res.data.memberphone == null ? this.ownerData.memberphone = '' : this.ownerData.memberphone = res.data.memberphone
        this.$emit('uptime',res.data.editdate)
      }else {
        this.ownerData = {}
      }
      if(this.partype == 2 || this.partype == 3){
        this.readonly = true
        this.disabled = true
        this.dreadonly = true
      }else {
        this.readonly = false
        this.disabled = false
        this.dreadonly = true
        if(this.partype == 1){
          this.resetbtn = true
        }else {
          this.resetbtn = false
        }
      }
      let upform = {}
      if(this.partype == 1 || this.partype == 3){
        Object.assign(upform,{membername:res.data.membername,memberid:res.data.masterid,familyid:res.data.familyid})
        sessionStorage.setItem('upform',JSON.stringify(upform))
      }
      if(!res.data.housepropertycard){
        this.showbox = false
      }else {
        this.getFiles(res.data.housepropertycard)
      }
    },
    getFiles(str){
      let fileArr = str.split(',').map(item=>{
        return {
          fileid:item,
          url:`${this.$baseUrl}/gridfs/image/${item}`
        }
      });
      this.showbox = fileArr.length == 3 ? true : false
      this.fileLists = fileArr
    },
    disChange(){
      if(!this.partype && !this.parpid && !this.rid){
        this.$emit('editdata',true)
      }else if(this.partype == 1 && this.rid == 21){
        this.$emit('editdata',true)
      }
    },
    inputChange(){
      if(!this.partype && !this.parpid && !this.rid){
        this.$emit('editdata',true)
      }else if(this.partype == 1 && this.rid == 21){
        this.$emit('editdata',true)
      }
    },
    async removeSuccess(fileId,fileList){
      let res = await deleteImage({fileId})
      if(res.code === 200){
        this.$message.success("删除成功")
      }
      this.showbox = false
      this.fileLists = fileList;
      if(!this.partype && !this.parpid && !this.rid){
        this.$emit('editdata',true)
      }else if(this.partype == 1 && this.rid == 21){
        this.$emit('editdata',true)
      }
    },
    uploadSuccess(filearr){
      this.fileLists = filearr
      if(!this.partype && !this.parpid && !this.rid){
        this.$emit('editdata',true)
      }else if(this.partype == 1 && this.rid == 21){
        this.$emit('editdata',true)
      }
    },
    saveData(){
      this.$refs.ownerData.validate(async (valid)=>{
        if(valid){
          // let arr = this.ownerData.houseadress.split(',')
          let data = Object.assign({},this.ownerData)
          if(this.fileLists.length > 0){
            Object.assign(data,{housepropertycard:this.fileLists.map(item=>{return item.fileid}).join(',')})
          }else {
            Object.assign(data,{housepropertycard:''})
          }
          if(this.partype == 1){
            Object.assign(data,{type:1})
          }
          let upform = {}
          let res = await putFamilyData(data)
          if(res.code == 200){
            this.$message.success('户信息保存成功')
            this.ownerData = res.data
            this.resetbtn = true
            this.dreadonly = true
            Object.assign(upform,{membername:res.data.membername,memberid:res.data.masterid,familyid:res.data.familyid})
            sessionStorage.setItem('upform',JSON.stringify(upform))
            this.$emit('updatebtn',false)
            this.$emit('editdata',false)
          }else if(res.code == 201){
            this.$message.error(res.msg)
            return false
          }
        }else {
          return false
        }
      })
    },
    resetData(){
      this.ownerData = this.$options.data().ownerData
      this.$refs.ownerData.resetFields()
    },
  }
}
</script>

<style lang="scss" scoped>
.owner{
  .el-form{
    ::v-deep{
      .el-form-item{
        width:100%;
        margin: 0;
        margin-bottom: 3px;
        .el-input,.el-select{
          width: 100%;
        }
        &.cardfile,&.mapbox,&.btnbox{
          width: 100%;
        }
        &.mapbox{
          margin-bottom:5px;
        }
        &.cardfile,&.mapbox,&.btnbox{
          .el-form-item__content{
            width: 100%;
          }
        }
        &.btnbox{
          margin-bottom: 0;
          .el-form-item__content{
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
          }
        }
        .el-form-item__content{
          width: calc(100% - 90px);
          .el-input{
            .el-input__inner{
              border: none;
              font-size: 14px;
            }
          }
          .el-form-item__error{
            top: 70%;
            left: 7%;
          }
          .map-show{
            width: 100%;
            height: 150px;
            margin-top:3px;
            #mapShow{
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
