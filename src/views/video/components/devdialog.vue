<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="42%" top="6%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="videoData" :inline="true" :model="videoData" :rules="rules" status-icon label-width="80px">
      <div class="itemform">
        <div class="vtit">
          <i></i>
          <span>基本信息</span>
        </div>
        <el-form-item label="设备名称" prop="equipmentname">
          <el-input v-model="videoData.equipmentname" placeholder="请输入设备名称"/>
        </el-form-item>
        <el-form-item label="设备形态" prop="shape">
          <el-select v-model="videoData.shape" placeholder="请选择设备形态">
            <el-option :value="1" label="枪形摄像机"></el-option>
            <el-option :value="2" label="球形摄像机"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="连接方式" prop="connection">
          <el-select v-model="videoData.connection" placeholder="请选择连接方式">
            <el-option :value="1" label="直连"></el-option>
            <el-option :value="2" label="非直连"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备ID" prop="equipmentid">
          <el-input v-model="videoData.equipmentid" placeholder="请输入设备ID"/>
        </el-form-item>
        <el-form-item label="IP地址" prop="ipadress">
          <el-input v-model="videoData.ipadress" placeholder="请输入IP地址"/>
        </el-form-item>
        <el-form-item label="端口号" prop="port">
          <el-input v-model="videoData.port" placeholder="请输入端口号"/>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="videoData.account" placeholder="请输入账号"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" show-password v-model="videoData.password" placeholder="请输入密码"/>
        </el-form-item>
        <el-form-item label="RTSP" prop="rtsp" class="fontflex">
          <el-input v-model="videoData.rtsp" placeholder="请输入RTSP"/>
          <p><u>注:</u>rtsp://账号:密码@IP地址:端口号</p>
          <p><u>例如:</u>rtsp://admin:123456@192.168.1.1:8080</p>
        </el-form-item>
        <el-form-item label="映射地址" prop="mappedaddress" class="fontflex">
          <el-input v-model="videoData.mappedaddress" placeholder="请输入映射流地址"/>
          <p><u>注:</u>利用第三方软件vlc将rtsp转化http地址</p>
          <p><u>例如:</u>http://192.168.1.1:8080/video</p>
        </el-form-item>
      </div>
      <div class="itemform">
        <div class="vtit">
          <i></i>
          <span>位置信息</span>
        </div>
        <el-form-item label="所属村居" prop="villageid">
          <el-select v-model="videoData.villageid" placeholder="请选择所属村居">
            <el-option v-for="item in villageData" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备坐标" required>
          <el-input v-model="videoData.coordinate" readonly placeholder="请选择设备坐标" @click.native="nativeClick"/>
          <mapvideo ref="mapvideo" :coordinate="videoData.coordinate" @exportAttr="exportAttr" />
        </el-form-item>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="medium" @click="saveData">确 认</el-button>
      <el-button size="medium" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {getvillageList} from "@/views/resident/api/resident";
import {putVideo,getVdetail} from '../api/video'
import mapvideo from "./mapvideo";
export default {
  name: "devdialog",
  data() {
    return {
      dialogVisible:false,
      title: "",
      videoData:{},
      rules:{
        equipmentname:[{required:true,trigger:'blur',message:'请填写名称'}],
        shape:[{required:true,trigger:'change',message:'请选择设备形态'}],
        connection:[{required:true,trigger:'change',message:'请选择连接方式'}],
        equipmentid:[{required:true,trigger:'blur',message:'请填写设备ID'}],
        ipadress:[{required:true,trigger:'blur',message:'请填写IP地址'}],
        port:[{required:true,trigger:'blur',message:'请填写端口号'}],
        account:[{required:true,trigger:'blur',message:'请填写账号'}],
        password:[{required:true,trigger:'blur',message:'请填写密码'}],
        rtsp:[{required:true,trigger:'blur',message:'请填写RTSP'}],
        mappedaddress:[{required:true,trigger:'change',message:'请输入映射流地址'}],
        villageid:[{required:true,trigger:'change',message:'请选择所属村居'}],
      },
      villageData:[]
    }
  },
  components: {
    mapvideo
  },
  computed: {},
  created() {
    this.getvillage()
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
    async showEdit(pid){
      if(pid){
        this.title = '修改摄像头'
        let res = await getVdetail({pid})
        if(res.data){
          this.videoData = res.data
          this.videoData.pid = pid
        }
      }else {
        this.title = '添加摄像头'
      }
      this.dialogVisible = true
    },
    saveData(){
      this.$refs.videoData.validate(async (valid)=>{
        if(valid){
          let data =Object.assign({},this.videoData)
          if(data.coordinate == ''){
            this.$message.error('请选择设备坐标')
            return false
          }
          let res = await putVideo(data)
          if(res.code == 200){
            this.$message.success(data.pid ? '修改成功': '添加成功')
            this.handleClose()
            this.$emit('getData')
          }
        }else {
          return false
        }
      })
    },
    nativeClick(){
      this.$refs.mapvideo.showmap()
    },
    exportAttr(arr){
      this.$forceUpdate()
      this.videoData.coordinate = arr.join(',')
    },
    handleClose(){
      this.title = ''
      this.dialogVisible = false
      this.$refs.videoData.resetFields()
      this.videoData = this.$options.data().videoData
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep{
  .el-dialog__body{
      padding: 0 0 20px;
      .el-form{
        .itemform{
          padding: 0 20px;
          border-bottom: 1px solid #e1e1e1;
          &:last-child{
            border-bottom: none;
          }
          .vtit{
            margin: 20px 0;
            i{
              display: inline-block;
              width: 4px;
              height: 16px;
              background-color:#0C9ED7;
              position: relative;
              top: 3px;
              margin-right:10px;
              color: #000;
            }
          }
          .el-form-item{
            width:49%;
            &:nth-child(2n+1){
              margin-right: 0;
            }
            &.fontflex{
              p{
                font-size: 13px;
                color: #888;
                line-height: 18px;
                display: block;
                margin-top:5px;
                margin-bottom: 0;
                u{
                  text-decoration: none;
                  color: #333;
                }
              }
            }
            .el-form-item__content{
              width: calc(100% - 80px);
              .el-input,.el-select{
                width: 100%;
              }
            }
          }
        }
      }
    }
}
</style>
