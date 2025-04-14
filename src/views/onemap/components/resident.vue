<template>
  <el-dialog :visible.sync="dialogVisible" title="户主信息" width="48%" top="2%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <div class="avatarbox">
      <el-upload class="avatar" :action="uploadUrl" name="file" disabled :limit="1" accept=".jpg,.png,.gif,.jpeg" :data="{}" list-type="picture-card" :on-preview="avatarPictureCardPreview" :file-list="avfileLists">
        <i class="el-icon-s-custom"></i>
        <span>用户头像</span>
      </el-upload>
      <el-dialog :visible.sync="avatardialogVisible" :title="avtitle" append-to-body center>
        <img width="100%" :src="avdialogImageUrl" alt="" />
      </el-dialog>
      <el-upload class="card" :action="uploadUrl" name="file" disabled :limit="1" accept=".jpg,.png,.gif,.jpeg" :data="{}" list-type="picture-card" :on-preview="cardPictureCardPreview" :file-list="cafileLists">
        <i class="el-icon-upload"></i>
        <span>房产证附件</span>
      </el-upload>
      <el-dialog :visible.sync="carddialogVisible" :title="catitle" append-to-body center>
        <img width="100%" :src="cadialogImageUrl" alt="" />
      </el-dialog>
      <el-button type="primary" @click="lookuser">查看家庭成员信息</el-button>
    </div>
    <el-form :model="baseData" :inline="true" status-icon>
      <el-form-item label="姓名" prop="membername">
        <el-input v-model="baseData.membername" readonly placeholder="姓名" />
      </el-form-item>
      <el-form-item label="曾用名">
        <el-input v-model="baseData.formername" readonly placeholder="曾用名"/>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-input v-model="baseData.gender" readonly placeholder="性别" />
      </el-form-item>
      <el-form-item label="所属村" prop="villageid">
        <el-input v-model="baseData.villageidname" readonly placeholder="所属村" />
      </el-form-item>
      <el-form-item label="户编号" prop="familyid">
        <el-input v-model="baseData.familyid" readonly placeholder="户编号"/>
      </el-form-item>
      <el-form-item label="出生日期" prop="birthday">
        <el-date-picker v-model="baseData.birthday" type="date" readonly value-format="yyyy-MM-dd" placeholder="请选择出生日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="民族" prop="national">
        <el-input v-model="baseData.national" readonly placeholder="民族"/>
      </el-form-item>
      <el-form-item label="籍贯">
        <el-input v-model="baseData.nativeplace" readonly placeholder="籍贯"/>
      </el-form-item>
      <el-form-item label="身份证号码" prop="memberid">
        <el-input v-model="baseData.memberid" readonly maxlength="18" placeholder="身份证号码"/>
      </el-form-item>
      <el-form-item label="文化程度">
        <el-input v-model="baseData.educationlevelname" readonly placeholder="文化程度"/>
      </el-form-item>
      <el-form-item label="户口类型" prop="familytype">
        <el-input v-model="baseData.familytypename" readonly placeholder="户口类型"/>
      </el-form-item>
      <el-form-item label="与户主关系" prop="familyrelationship">
        <el-input v-model="baseData.familyrelationshipname" readonly placeholder="与户主关系"/>
      </el-form-item>
      <el-form-item label="政治面貌">
        <el-input v-model="baseData.politicallandscapename" readonly placeholder="政治面貌"/>
      </el-form-item>
      <el-form-item label="身高(cm)">
        <el-input v-model="baseData.height" readonly placeholder="身高"/>
      </el-form-item>
      <el-form-item label="血型">
        <el-input v-model="baseData.bloodtype" readonly placeholder="血型"/>
      </el-form-item>
      <el-form-item label="户籍地址" prop="familyaddress">
        <el-input v-model="baseData.familyaddress" readonly placeholder="户籍地址"/>
      </el-form-item>
      <el-form-item label="户籍状态" prop="familystate">
        <el-input v-model="baseData.familystatename" readonly placeholder="户籍状态"/>
      </el-form-item>
      <el-form-item label="家庭住址">
        <el-input v-model="baseData.permanentaddress" readonly placeholder="家庭住址"/>
      </el-form-item>
      <el-form-item label="联系方式" prop="phonenumber">
        <el-input v-model="baseData.phonenumber" readonly placeholder="联系电话" maxlength="11"/>
      </el-form-item>
      <el-form-item label="宗教信仰">
        <el-input v-model="baseData.faithname" readonly placeholder="宗教信仰"/>
      </el-form-item>
      <el-form-item label="婚姻状况">
        <el-input v-model="baseData.maritalstatusname" readonly placeholder="婚姻状况"/>
      </el-form-item>
      <el-form-item label="人口数量">
        <el-input v-model.number="baseData.population" readonly maxlength="2" placeholder="人口数量"/>
      </el-form-item>
      <el-form-item label="住房类型">
        <el-input v-model="baseData.housingtypename" readonly placeholder="住房地址"/>
      </el-form-item>
      <el-form-item label="住房地址">
        <el-input v-model="baseData.housingaddress" readonly placeholder="住房地址"/>
      </el-form-item>
      <el-form-item label="住宅面积">
        <el-input v-model="baseData.houseacreage" readonly placeholder="住宅面积"/>
      </el-form-item>
      <el-form-item label="房结构类型">
        <el-input v-model="baseData.buildingstructurename" readonly placeholder="房结构类型"/>
      </el-form-item>
      <el-form-item label="农田面积">
        <el-input v-model="baseData.landacreage" readonly placeholder="农田面积"/>
      </el-form-item>
      <el-form-item label="房产证编号">
        <el-input v-model="baseData.housepropertycardnumber" readonly placeholder="房产证编号"/>
      </el-form-item>
      <el-form-item label="农田位置">
        <el-input v-model="baseData.landadress" readonly placeholder="农田位置" />
      </el-form-item>
      <el-form-item label="家庭位置">
        <el-input v-model="baseData.houseadress" readonly placeholder="家庭位置"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleClose">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {getFamilyDetail, getMemberDetail} from "@/views/resident/api/resident";
import {mapGetters} from "vuex";
export default {
  name: "resident",
  data() {
    return {
      dialogVisible:false,
      avatardialogVisible:false,
      carddialogVisible:false,
      avtitle:'',
      catitle:'',
      avfileLists:[],
      cafileLists:[],
      baseData:{},
      uploadUrl:'',
      avdialogImageUrl:'',
      cadialogImageUrl:'',
    }
  },
  components: {
  },
  computed: {
    ...mapGetters({
      routers:'routes/routes',
    })
  },
  created() {
  },
  mounted() {
    this.uploadUrl = `${this.$baseUrl}/gridfs/letterfileupload`
  },
  methods: {
    async showEdit(pid){
      let res = await getFamilyDetail({familyId:pid})
      this.getfamily(res.data)
      this.dialogVisible = true
    },
    async getfamily(obj){
      let res = await getMemberDetail({memberid:obj.masterid})
      this.baseData = Object.assign(res.data,{
        buildingstructurename:obj.buildingstructurename,
        housingtypename:obj.housingtypename,
        population:obj.population,
        housingaddress:obj.housingaddress,
        housepropertycard:obj.housepropertycard,
        housepropertycardnumber:obj.housepropertycardnumber,
        houseacreage:obj.houseacreage,
        landacreage:obj.landacreage,
        houseadress:obj.houseadress,
        landadress:obj.landadress
      })
      this.baseData.gender = res.data.gender == 0 ? '女' : '男'
    },
    lookuser(){
      let params = {
        type:2,
        fid:this.baseData.familyid,
        mid:this.baseData.memberid
      }
      let arr = this.routers.filter(item=>{
        return item.showMenuIndex === 6
      })
      if (arr.length > 0) {
        this.$router.push({
          path:'/mindex/medit',
          query:params
        })
      }else {
        this.$baseConfirm('你暂无权限跳转查看，请联系管理员！','信息提示',()=>{
          return false
        })
      }
    },
    avatarPictureCardPreview(file) {
      this.avdialogImageUrl = file.url;
      this.avtitle = "查看头像";
      this.avatardialogVisible = true;
    },
    cardPictureCardPreview(file){
      this.cadialogImageUrl = file.url;
      this.catitle = "查看房产证附件";
      this.carddialogVisible = true;
    },
    handleClose(){
      this.dialogVisible = false;
      this.avfileLists = []
      this.cafileLists = []
      this.baseData = this.$options.data().baseData;
    },
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__wrapper{
  background: rgba(0,0,0,.6);
}
::v-deep{
  .el-dialog{
    background: rgba(2, 30, 65, .8);
    .el-dialog__header{
      background:rgba(16, 97, 159, .6);
      border:1px solid #2F9DF2;
      .el-dialog__title{
        color: #fff;
      }
      .el-dialog__headerbtn{
        i{
          color:#fff;
        }
      }
    }
    .el-dialog__body{
      display: flex;
      flex-direction: row;
      justify-content:space-between;
    }
  }
}
.avatarbox{
  width:18%;
  .el-button{
    width:100%;
    margin-top:20px;
  }
  .avatar{
    height:210px;
    ::v-deep{
      .el-upload{
        &.el-upload--picture-card{
          width:158px;
          height:210px;
          display: flex;
          flex-direction: column;
          background: transparent;
          border-color:#1F6AA8;
          i{
            font-size: 70px;
            color:#0E4777;
            position: relative;
            top:45px;
          }
          span{
            line-height: 30px;
            margin-top: 40px;
            color:#4997D6;
          }
        }
      }
    }
    .el-upload-list--picture-card{
      overflow: hidden;
      .el-upload-list__item{
        width:158px;
        height:210px;
        margin-bottom: 0;
      }
    }
  }
  .card{
    margin-top:30px;
    ::v-deep{
      .el-upload{
        &.el-upload--picture-card{
          width:158px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: transparent;
          border-color:#1F6AA8;
          i{
            font-size: 50px;
            color:#0E4777;
            position: relative;
            top:0;
          }
          span{
            line-height: 30px;
            color:#4997D6;
          }
        }
      }
    }
  }
}
.el-form{
  width:80.5%;
  ::v-deep{
    .btnbox{
      margin-top: 20px;
    }
    .el-form-item{
      width:50%;
      margin:0;
      &:nth-child(1),&:nth-child(2){
        .el-form-item__label,.el-form-item__content{
          border-top: 1px solid #1F6AA8;
        }
        .el-form-item__label{
          height: 47px;
          line-height: 47px;
        }
      }
      &:nth-child(2n-1){
        .el-form-item__label{
          border-left: 1px solid #1F6AA8;
        }
      }
      .el-form-item__label{
        width:27%;
        background-color:#0E4777;
        text-align: left;
        padding-left:8px;
        height: 46px;
        line-height: 46px;
        font-size: 15px;
        border-bottom: 1px solid #1F6AA8;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        color:#fff;
      }
      .el-form-item__content{
        width:73%;
        border-left:1px solid #1F6AA8;
        border-right:1px solid #1F6AA8;
        border-bottom: 1px solid #1F6AA8;
        .el-input,.el-select{
          width: 100%;
          height: 45px;
          line-height: 45px;
          .el-input__inner{
            border: none;
            background: none;
            height: 45px!important;
            line-height: 45px;
            font-size: 15px;
            color: #fff;
            &::-webkit-input-placeholder{
              color: rgba(73, 151, 214, .5);
            }
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
.el-dialog__footer{
  .el-button{
    padding:11px 25px;
    font-size: 15px;
    background-color:#216DA9;
    border-color:#216DA9;
    color: #fff;
  }
}
</style>
