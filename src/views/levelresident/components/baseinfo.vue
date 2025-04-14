<template>
  <div class="baseinfo">
    <div id="water">
      <canvas id="canvas"></canvas>
    </div>
    <div class="basebox">
      <div class="avatarbox">
          <uploadAvatar :fileLists="fileLists" :showbox="showbox" @removeSuccess="removeSuccess" @uploadSuccess="uploadSuccess" />
      </div>
      <el-form ref="baseData" :model="baseData" :inline="true" :rules="rules" status-icon label-width="105px">
          <el-form-item label="姓名" prop="membername">
            <el-input v-model="baseData.membername" :readonly="readonly" placeholder="请输入姓名" @input="inputChange" />
          </el-form-item>
          <el-form-item label="曾用名">
            <el-input v-model="baseData.formername" :readonly="readonly" placeholder="请输入姓名" @input="inputChange"/>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select v-model="baseData.gender" placeholder="请选择性别" @change="seltChange" :disabled="disabled">
              <el-option :value="0" label="女"></el-option>
              <el-option :value="1" label="男"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="与户主关系" prop="familyrelationship">
            <el-select v-model="baseData.familyrelationship" placeholder="请选择与户主关系" :disabled="redisabled" @change="relatChange">
              <el-option v-for="item in arrData.relatData" :key="item.dicid" :value="item.dicid" :label="item.dicname"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出生日期" prop="birthday">
            <el-date-picker v-model="baseData.birthday" type="date" :readonly="readonly" value-format="yyyy-MM-dd" placeholder="请选择出生日期" @change="seltChange"></el-date-picker>
          </el-form-item>
          <el-form-item label="民族" prop="national">
            <el-input v-model="baseData.national" :readonly="readonly" placeholder="请输入民族" @input="inputChange"/>
          </el-form-item>
          <el-form-item label="籍贯">
            <el-input v-model="baseData.nativeplace" :readonly="readonly" placeholder="请输入籍贯" @input="inputChange"/>
          </el-form-item>
          <el-form-item label="身份证号码" prop="memberid">
            <el-input v-model="baseData.memberid" :readonly="readonly" maxlength="18" placeholder="请输入身份证号码" @input="inputChange"/>
          </el-form-item>
          <el-form-item label="文化程度">
            <el-select v-model="baseData.educationlevel" placeholder="请选择文化程度" @change="seltChange" :disabled="disabled">
              <el-option v-for="item in arrData.educateData" :key="item.dicid" :value="item.dicid" :label="item.dicname"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="户口类型" prop="familytype">
            <el-select v-model="baseData.familytype" placeholder="请选择户口类型" @change="seltChange" :disabled="disabled">
              <el-option v-for="item in arrData.nodeData" :key="item.dicid" :value="item.dicid" :label="item.dicname"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="政治面貌">
            <el-select v-model="baseData.politicallandscape" placeholder="请选择政治面貌" @change="seltChange" :disabled="disabled">
              <el-option v-for="item in arrData.govData" :key="item.dicid" :value="item.dicid" :label="item.dicname"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="身高(cm)">
            <el-input v-model="baseData.height" :readonly="readonly" placeholder="请输入身高" @input="inputChange"/>
          </el-form-item>
          <el-form-item label="血型">
            <el-input v-model="baseData.bloodtype" :readonly="readonly" placeholder="请输入血型" @input="inputChange"/>
          </el-form-item>
          <el-form-item label="户籍地址" prop="familyaddress">
            <el-input v-model="baseData.familyaddress" :readonly="readonly" placeholder="请输入户籍地址" @input="inputChange"/>
          </el-form-item>
          <el-form-item label="户籍状态" prop="familystate">
            <el-select v-model="baseData.familystate" placeholder="请选择户籍状态" @change="seltChange" :disabled="disabled">
              <el-option v-for="item in arrData.residentData" :key="item.dicid" :value="item.dicid" :label="item.dicname"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="家庭住址">
            <el-input v-model="baseData.permanentaddress" :readonly="readonly" placeholder="请输入家庭住址" @input="inputChange"/>
          </el-form-item>
          <el-form-item label="联系方式" prop="phonenumber">
            <el-input v-model="baseData.phonenumber" :readonly="readonly" placeholder="请输入联系电话" maxlength="11" @input="inputChange"/>
          </el-form-item>
          <el-form-item label="宗教信仰">
            <el-select v-model="baseData.faith" placeholder="请选择宗教信仰" @change="seltChange" :disabled="disabled">
              <el-option v-for="item in arrData.belData" :key="item.dicid" :value="item.dicid" :label="item.dicname"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="婚姻状况">
            <el-select v-model="baseData.maritalstatus" placeholder="请选择婚姻状况" @change="seltChange" :disabled="disabled">
              <el-option v-for="item in arrData.marData" :key="item.dicid" :value="item.dicid" :label="item.dicname"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="人员状态" prop="isoutwork">
            <el-select v-model="baseData.isoutwork" placeholder="请选择人员状态" :disabled="disabled" @change="seltChange">
              <el-option :value="0" label="常年在家"></el-option>
              <el-option :value="1" label="常年在外"></el-option>
            </el-select>
          </el-form-item>
          <template v-if="baseData.isoutwork == 1">
            <el-form-item label="务工地点" prop="outworkadress">
              <el-input v-model="baseData.outworkadress" :readonly="readonly" placeholder="请输入务工地点" @input="inputChange"/>
            </el-form-item>
          </template>
          <div class="btnbox">
            <el-button type="primary" size="medium" plain @click="goback">返回列表</el-button>
          </div>
        </el-form>
    </div>
  </div>
</template>

<script>
import uploadAvatar from "./uploadAvatar";
import {deleteImage,getDictionaryList, getMemberDetail, putMemberData} from "../api/levrest";
import {isArray, isIdCard, isPhone,compareObj} from "@/utils/validate";
import {mapGetters} from "vuex";
export default {
  name: "baseinfo",
  data() {
    let phoneValid = (rule, value, callback)=>{
      if(!value){
        return callback(new Error('请填写联系方式'))
      } else if(!isPhone(value)){
        return callback(new Error('请填写正确的11位联系方式'))
      }else {
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
    let username = (rule, value, callback)=>{
      if(!value){
        return callback(new Error('请填写姓名'))
      } else {
        callback()
      }
    }
    return {
      fileLists:[],
      baseData:{},
      arrData:{
        educateData:[],
        nodeData:[],
        relatData:[],
        govData:[],
        belData:[],
        marData:[],
        residentData:[],
      },
      // educateData:[],
      // nodeData:[],
      // relatData:[],
      // govData:[],
      // belData:[],
      // marData:[],
      // residentData:[],
      rules:{
        membername:[{required:true,validator:username,trigger:'blur'}],
        gender:[{required:true,trigger:'change',message:'请选择性别'}],
        birthday:[{required:true,trigger:'change',message:'请选择出生日期'}],
        national:[{required:true,trigger:'blur',message:'请填写民族'}],
        memberid:[{required:true,validator:cardidValid,trigger:'blur'}],
        // familytype:[{required:true,trigger:'change',message:'请选择户口类型'}],
        familyrelationship:[{required:true,trigger:'change',message:'请选择与户主关系'}],
        // familystate:[{required:true,trigger:'change',message:'请填写户籍状态'}],
        // familyaddress:[{required:true,trigger:'blur',message:'请填写户籍地址'}],
        phonenumber:[{required:true,validator:phoneValid,trigger:'blur'}],
        isoutwork:[{required:true,trigger:'change',message:'请选择人员状态'}],
        outworkadress:[{required:true,trigger:'blur',message:'请填写务工地点'}],
      },
      readonly:false,
      disabled:false,
      showbox:false,
      redisabled:false,
    }
  },
  props:['partype','parpid','cardid','btndisabled','rid','isedit'],
  components: {
    uploadAvatar
  },
  computed: {
    ...mapGetters({
        username: 'user/username',
    }),
  },
  created() {
    this.getDictionary([2,3,4,5,23,6,7])
  },
  mounted() {
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
      ctx.rotate(-0.3);//设置文字旋转角度
      ctx.fillText(this.username, canvas.width / 6, canvas.height / 2);//设置显示文字内容
      const img = canvas.toDataURL("image/png");//参数默认为 image/png,可以是其他image/jpeg等，该方法返回值是一个url，是base64组成的图片的源数据、可以直接赋值给图片的src属性
      const style = `background-image:url(${img});`;//定义样式
      water.setAttribute("style", style);//给要添加水印的元素设置样式
    },
    async showData(){
      let res = await getMemberDetail({familyid:this.parpid,memberid:this.cardid,membername:''})
      if(res.data){
        this.baseData = res.data
      }else {
        this.baseData = {}
      }
      if(this.partype == 2){
        this.readonly = true
        this.disabled = true
        this.redisabled = true
      }else {
        if(this.partype == 1 && this.rid == 21){
          this.redisabled = true
        }else {
          this.redisabled = false
        }
        this.readonly = false
        this.disabled = false
      }
      if(res.data.image && res.data.image !== ''){
        this.getFiles(res.data.image)
        this.showbox = true
      }else {
        this.showbox = false
      }
    },
    getFiles(str){
      let fileArr = str.split(',').map(item=>{
        return {
          fileid:item,
          url:`${this.$baseUrl}/gridfs/image/${item}`
        }
      });
      this.fileLists = fileArr
    },
    inputChange(val){
      this.$forceUpdate()
      this.$emit('savebase',true)
    },
    seltChange(val){
      this.$forceUpdate()
      this.$emit('savebase',true)
    },
    relatChange(val){
      this.$forceUpdate()
      let familydata = JSON.parse(sessionStorage.getItem('upform'))
      if(val == 21){
        this.baseData.membername = familydata.membername
        this.baseData.memberid = familydata.memberid
        this.baseData.phonenumber = familydata.phonenumber
        this.baseData.familyid = familydata.familyid
      }else{
        this.baseData = {}
        this.baseData.familyrelationship = val
        this.baseData.familyid = familydata.familyid
      }
      this.$emit('savebase',true)
    },
    getDictionary(type){
      let endData = {2:'educateData',3:'nodeData',4:'relatData',5:'govData',23:'residentData',6:'belData',7:'marData'}
      let err = Object.keys(endData).map(item=> Number(item))
      if(isArray(type)){
        type.map(item=>{
          getDictionaryList({dictypeid:item}).then(res=>{
            if(item == 4){
              this.arrData[endData[item]] = (this.rid&&this.rid != 21) || this.partype == 3 ? res.data.filter(item=> item.dicid != 21) : res.data
            } else if(err.includes(item)){
              this.arrData[endData[item]] = res.data
            }
          })
        })
      }
    },
    async removeSuccess(fileId,fileList){
      let res = await deleteImage({fileId})
      if(res.code === 200){
        this.$message.success("删除成功")
      }
      this.showbox = false
      this.fileLists = fileList;
      this.$emit('savebase',true)
    },
    uploadSuccess(fileList){
      this.fileLists = fileList.map(item=>{
        return {
          fileid:item.response.data,
          url:item.url
        }
      })
      this.$emit('savebase',true)
    },
    goback(){
      sessionStorage.removeItem('upform')
      this.$emit('goback')
    },
  }
}
</script>

<style lang="scss" scoped>
 #water{
    width: 100%;
    height: 100%;
    position: absolute;
    left:0;
    top:0;
    pointer-events: none;
    z-index:1;
  }
.baseinfo{
  display: flex;
  flex-direction: column;
  //justify-content: space-between;
  .basebox{
    display: flex;
    flex-direction:row;
    justify-content: space-between;
  }
  .avatarbox{
    width: 160px;
  }
  .el-form{
    width: 89%;
    ::v-deep{
      .btnbox{
        margin-top: 20px;
      }
      .el-form-item{
        width: 33.3%;
        margin:0;
        &:nth-child(1),&:nth-child(2),&:nth-child(3){
          .el-form-item__label,.el-form-item__content{
            border-top: 1px solid #EBEEF5;
          }
          .el-form-item__label{
            height: 47px;
            line-height: 47px;
          }
        }
        &:nth-child(3n-2){
          .el-form-item__label{
            border-left: 1px solid #EBEEF5;
          }
        }
        &.overline{
          .el-form-item__label{
            line-height: 23px;
          }
        }
        .el-form-item__label{
          background-color:#F5F7FA;
          text-align: left;
          padding-left:8px;
          height: 46px;
          line-height: 46px;
          font-size: 15px;
          border-bottom: 1px solid #EBEEF5;
        }
        .el-form-item__content{
          width: calc(100% - 105px);
          border-left:1px solid #EBEEF5;
          border-right:1px solid #EBEEF5;
          border-bottom: 1px solid #EBEEF5;
          .el-input,.el-select{
            width: 100%;
            height: 45px;
            line-height: 45px;
            .el-input__inner{
              border: none;
              height: 45px!important;
              line-height: 45px;
              font-size: 15px;
            }
          }
          .el-form-item__error{
            top: 35%;
            right: 10%;
            left: inherit;
          }
        }
      }
    }
  }
}
</style>
