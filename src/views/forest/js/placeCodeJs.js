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
  queryQrCode,
  download,
  getruleTail,
  gettaskTail, getAreaLevelChild, queryPlaceTypeVageList, getCodeUserList,
} from "@/views/forest/api/forest-api";
import {isIdCard, isPhone,} from "@/utils/validate";
import {mapGetters} from "vuex";
export default {
  name: 'forestdialog',
  data() {
    let numbermsg = (rule, value, callback)=>{
      if(!value){
        return callback(new Error('请输入户主身份证号'))
      }else if(!isIdCard(value)){
        return callback(new Error('请输入正确的身份证号'))
      }else{
        callback()
      }
    }
    let phonemsg = (rule, value, callback)=>{
      if(!value){
        return callback(new Error('请输入户主电话'))
      }else if(!isPhone(value)){
        return callback(new Error('请输入正确的手机号'))
      }else{
        callback()
      }
    }
    return {
      dialogVisible:false,
      tabCard:'baseinfo',
      title:'',
      frestData:{
        proaddressName:'来访者单位',
        outaddressName:'受访者单位',
        prodicList:[{valuetext:''}],
        outdicList:[{valuetext:''}]
      },
      rules:{
        villageId:[{required:true,trigger:'change',message:'请选择所属镇街'}],
        villageNumber:[{required: true, trigger: "blur", message: "请填写街镇编号"}],
        countryId:[{required: true, trigger: "change", message: "请选择所属村居"}],
        placeName:[{required: true, trigger: "blur", message: "请填写场所名称"}],
        // longitude:[{required: true, trigger: "blur", message: "请填写经度"}],
        // latitude:[{required: true, trigger: "blur", message: "请填写纬度"}],
        // baopianLeader:[{required: true, trigger: "blur", message: "请填写包片领导"}],
        // villageSecretary:[{required: true, trigger: "blur", message: "请填写村书记"}],
        typeId:[{required: true, trigger: "change", message: "请选择区级场所类别"}],
        vtypeId:[{required: true, trigger: "change", message: "请选择镇街场所类别"}],
        userids:[{required: true, trigger: "change", message: "请选择场所关联人员"}],
        codeRule:[{required: true, trigger: "change", message: "请选择登记规则"}],
      },
      options: [],
      props: {
        emitPath:false,
        multiple:true,
        expandTrigger: 'hover',
        value: "id",
        label: "name",
        children: "children",
      },
      keys:null,
      disabled:false,
      vallageList:[],
      imgdata:[],
      placeCodeType: [],
      placeCodeVageType:[],
      countryList:[],
      imga:'',
      imgb:''
    }
  },
  props:['tcard'],
  components: {},
  computed: {...mapGetters({
      userData:'user/userData',
      backData:'user/backData',
      routers:'routes/routes',
      level:'user/level'
    }),},
  created() {

  },
  mounted() {
  },
  methods: {
    changeOption() {
      getAreaLevelChild({level: 4, parentId: this.frestData.villageId}).then(res => {
        if (res.code == 200) {
          this.countryList = res.data ? res.data : [];
        }
      })
    },
    perChange(val){

    },
    addproData(){
      this.frestData.prodicList.push({valuetext:''})
    },
    delproData(obj){
        let index = this.frestData.prodicList.indexOf(obj)
        if (index !== -1) {
          this.frestData.prodicList.splice(index, 1)
        }
    },
    addoutData(){
      this.frestData.outdicList.push({valuetext:''})
    },
    deloutData(obj){
        let index = this.frestData.outdicList.indexOf(obj)
        if (index !== -1) {
          this.frestData.outdicList.splice(index, 1)
        }
    },
    proChange(val){
      if(val == 0){
        this.frestData.prodicList = this.$options.data().frestData.prodicList
      }
    },
    outChange(val){
      if(val == 0){
        this.frestData.outdicList = this.$options.data().frestData.outdicList
      }
    },
    async getVillageByLevel() {
      this.vallageList = [];
      if (this.level == 2) {
        let res = await getAreaLevel({level: 3});
        if (res.code == 200) {
          this.vallageList = res.data;
        }
      } else {
        let town = {
          areaname: this.userData.areaname,
          pid: this.userData.areaid
        }
        this.vallageList.push(town)
      }
    },
    async getCountryByLevelParentId(parentId) {
      let res = await getAreaLevelChild({level: 4, parentId: parentId});
      this.countryList = res.data ? res.data : [];
    },
    async getCountryByLevel() {
      let res = await getAreaLevel({level: 4});
      this.countryList = res.data ? res.data : [];
    },
    async getPlaceTypeList() {
      let res = await queryPlaceTypeList();
      this.placeCodeType = res.data ? res.data : [];
    },
    async getPlaceTypeVageList() {
      let res = await queryPlaceTypeVageList();
      this.placeCodeVageType = res.data ? res.data : [];
    },
    async getPlaceCodeUserList() {
      let res = await getCodeUserList();
      this.options = res.data ? res.data.map(item=>{
        return{
          id:item.pid,
          name:item.name,
          children:item.userList.length > 0 ? item.userList.map(val=>{
            return {
              id:val.pid,
              name:val.username
            }
          }) : []
        }
      }) : []
    },
    async showEdit(pid,index){
      this.keys = index ? index : null
      let trr = [{tname:'新增',mname:'新增类别',kname:'新增事项'},{tname:'查看',cname:'生成二维码',hname:'查看人员身份码',mname:'查看类别',kname:'查看事项'},{tname:'编辑',mname:'编辑类别',kname:'编辑事项'}]
      this.title = this.tcard == 'codefth' ? trr[index-1].mname : this.tcard == 'codevth' ? trr[index-1].kname: this.tcard == 'codest' && index == 2 ? trr[index-1].cname : this.tcard == 'codend' && index == 2 ? trr[index-1].hname : trr[index-1].tname
      if(index !== 1){
        let res = await getDetail({pid: pid})
        await this.getCountryByLevelParentId(res.data.villageId);
        this.frestData = res.data ? res.data : this.$options.data.frestData
        this.frestData.prodicList = !res.data.prodicList || res.data.prodicList.length == 0 ? this.$options.data().frestData.prodicList : res.data.prodicList
        this.frestData.outdicList = !res.data.outdicList || res.data.outdicList.length == 0 ? this.$options.data().frestData.outdicList : res.data.outdicList
        this.frestData.proaddressName = !res.data.proaddressName || res.data.proaddressName == '' ? '来访者单位': res.data.proaddressName
        this.frestData.outaddressName = !res.data.outaddressName || res.data.outaddressName == '' ? '受访者单位': res.data.outaddressName
      }
      if (index !== 2) {
         this.getVillageByLevel();
        if(this.level == 2) {
           this.getCountryByLevel();
        }
         this.getPlaceTypeList();
         this.getPlaceTypeVageList()
         this.getPlaceCodeUserList()
      }
      if (index == 2) {
        queryQrCode({pid: pid, type: 0}).then(res => {
          // 将 Blob 对象转为 URL 地址
          this.imga = window.URL.createObjectURL(res);
        })
        queryQrCode({pid: pid, type: 1}).then(res => {
          // 将 Blob 对象转为 URL 地址
          this.imgb = window.URL.createObjectURL(res);
        })
      }
      this.dialogVisible = true
    },
    lookClose(){
      this.dialogVisible = false
      this.title = ''
      this.frestData = this.$options.data().frestData
    },
    handleClose(){
      this.dialogVisible = false
      this.disabled = false
      this.title = ''
      this.frestData = this.$options.data().frestData
      this.$refs.frestData.resetFields()
    },
    downloadQrCode(val) {
      let param = {
        pid: this.frestData.pid,
        type: val
      }
      let fileName = this.frestData.placeName;
      if (val == 0) {
        fileName += '（入口）.png';
        this.downloadIamge(this.imga, fileName);
      } else {
        fileName += '（出口）.png';
        this.downloadIamge(this.imgb, fileName);
      }
    },
    downloadIamge (imgsrc, name) { // 下载图片地址和图片名
      var image = new Image()
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function () {
        var canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        var context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        var url = canvas.toDataURL('image/png') // 得到图片的base64编码数据
        var a = document.createElement('a') // 生成一个a元素
        var event = new MouseEvent('click') // 创建一个单击事件
        a.download = name || 'photo' // 设置图片名称
        a.href = url // 将生成的URL设置为a.href属性
        a.dispatchEvent(event) // 触发a的单击事件
      }
      image.src = imgsrc
      this.handleClose()
      // this.$emit('getData')
    },
    saveData(){
      this.$refs.frestData.validate(async (valid)=>{
        if(valid){
          if(this.frestData.proaddressName == ''){
            this.$message.error('请输入来访者自定义名称')
            return false
          }else if(this.frestData.proaddressType == null){
            this.$message.error('请选择来访者形式')
            return false
          } else if(this.frestData.outaddressName == ''){
            this.$message.error('请输入受访者自定义名称')
            return false
          }else if(this.frestData.outaddressType == null){
            this.$message.error('请选择受访者形式')
            return false
          }
          if(this.frestData.proaddressType == 1){
            let prr = this.frestData.prodicList.filter(item => item.valuetext =='')
            console.log(prr)
            if(prr.length > 0){
              this.$message.error('请将来访者选项值全部输入')
              return false
            }
          }else if(this.frestData.outaddressType == 1){
            let orr = this.frestData.outdicList.filter(item => item.valuetext =='')
            if(orr.length > 0){
              this.$message.error('请将受访者选项值全部输入')
              return false
            }
          }
          let res= this.keys == 1 ? await savePlaceCode(this.frestData) : await editPlaceCode(this.frestData)
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
