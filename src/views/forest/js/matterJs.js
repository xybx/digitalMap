/*
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2023/4/7 17:26:25
 * @LastEditors: 12390
 * @LastEditTime: 2023/4/7 17:26:25
 * @Description: HTML Page of Javascript
 * Copyright (c) 2022 by xybx, All Rights Reserved.
*/
import {
  getAreaLevel,
  queryPlaceTypeList,
  savePlaceCode,
  editPlaceCode,
  getDetail,
  savePlaceCodeType,
  editPlaceCodeType,
  getPlaceCodeTypeDetail,
  queryQrCode,
  edismatter,
  download,
  getMatterDetail,
  getruleTail,
  gettaskTail,
} from "@/views/forest/api/forest-api";
import {isIdCard, isPhone,} from "@/utils/validate";
export default {
  name: 'placeCodeType',
  data() {
    return {
      dialogVisible:false,
      tabCard:'codefth',
      title:'',
      frestData:{},
      rules:{
        mattername:[{required:true,trigger:'blur',message:'请输入事项名称'}],
      },
      keys:null,
      disabled:false,
      vallageList:[],
      imgdata:[],
      placeCodeType: [],
      countryList:[],
      imga:'',
      imgb:''
    }
  },
  props:['tcard'],
  components: {},
  computed: {},
  created() {

  },
  mounted() {
  },
  methods: {
    async getVillageByLevel() {
      let res = await getAreaLevel({level: 3});
      this.vallageList = res.data ? res.data : [];
    },
    async getCountryByLevel() {
      let res = await getAreaLevel({level: 4});
      this.countryList = res.data ? res.data : [];
    },
    async getPlaceTypeList() {
      let res = await queryPlaceTypeList();
      this.placeCodeType = res.data ? res.data : [];
    },
    async showEdit(pid,index){
      this.keys = index ? index : null
      let trr = [{tname:'新增',mname:'新增类别',kname:'新增事项'},{tname:'查看',cname:'生成二维码',hname:'查看人员身份码',mname:'查看类别',kname:'查看事项'},{tname:'编辑',mname:'编辑类别',kname:'编辑事项'}]
      this.title = this.tcard == 'codefth' ? trr[index-1].mname : this.tcard == 'codevth' ? trr[index-1].kname: this.tcard == 'codest' && index == 2 ? trr[index-1].cname : this.tcard == 'codend' && index == 2 ? trr[index-1].hname : trr[index-1].tname
      if(index !== 1){
        let res = await getMatterDetail({pid: pid})
        this.frestData = res.data ? res.data : this.$options.data.frestData
        // this.disabled = true
      }
      if (index == 2) {
        this.disabled = true;
      }
      this.dialogVisible = true
    },
    handleClose(){
      this.dialogVisible = false
      this.disabled = false
      this.title = ''
      this.$refs.frestData.resetFields()
      this.frestData = this.$options.data().frestData
    },
    saveData(){
      this.$refs.frestData.validate(async (valid)=>{
        if(valid){
          let res;
          res = await edismatter(this.frestData);
          if(res.code == 200){
            this.$message.success("操作成功")
            this.handleClose()
            this.$emit('getData')
          }
        }else {
          return false
        }
      })
    },
    changeParUser(val){
      this.fireData.helpuserids = []
      this.soptions = this.soptions.map(item=>{
          return {
            name:item.name,
            pid:item.pid,
            children:item.children.length > 0 ? item.children.map(v=>{
              Object.assign(v,{disabled:val == v.pid ? true : false})
              return v
            }) : []
          }
      })
    },
    changeSubUser(val){
      this.fireData.helpuserids = val
    },
  }
}
