<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="40%" top="2%" :before-close="keys == 1 ? handleClose:backClose" :append-to-body="true" :close-on-click-modal="false" center>
    <template v-if="keys == 2">
      <el-image class="codeimg" :src="codeimgs" :z-index="2999"></el-image>
    </template>
    <template v-else>
      <el-form ref="codeForm" :model="codeForm" :rules="rules" status-icon label-width="110px">
        <template>
          <el-form-item label="姓名">
            <el-input v-model="codeForm.personnelname" placeholder="请输入姓名" disabled />
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="codeForm.phone" placeholder="请输入电话" disabled />
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="codeForm.address" placeholder="请输入地址" disabled />
          </el-form-item>
          <el-form-item label="投诉部门">
            <el-select v-model="codeForm.departmentid" placeholder="请选择投诉部门" disabled>
              <el-option v-for="item in departData" :key="item.pid" :value="item.pid" :label="item.department"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区域名称">
            <el-input v-model="codeForm.areaname" placeholder="请输入区域名称" disabled />
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="codeForm.card" placeholder="请输入身份证号" disabled />
          </el-form-item>
          <el-form-item label="状态" prop="states">
            <el-select v-model="codeForm.states" placeholder="请选择处理状态" clearable>
              <el-option :value="0" label="待处理"></el-option>
              <el-option :value="1" label="处理中"></el-option>
              <el-option :value="2" label="已处理"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="codeForm.describe" type="textarea" :rows="5" placeholder="请输入描述" disabled />
          </el-form-item>
          <el-form-item label="附件">
            <div v-if="!codeForm.files" class="imagebox">
              <i class="el-icon-picture-outline"></i>
              <u>暂无附件</u>
            </div>
            <template v-else>
              <ul class="flist">
                <li v-for="item in imgdata" :key="item.fileid" @click="downfiles(item.name,item.fileid)">
                  <span>{{item.name}}</span>
                  <i class="el-icon-download"></i>
                </li>
              </ul>
            </template>
          </el-form-item>
          <el-form-item label="图片">
            <div v-if="!codeForm.images" class="imagebox">
              <i class="el-icon-picture-outline"></i>
              <u>暂无图片</u>
            </div>
            <template v-else>
              <div v-for="item in urldata" :key="item">
                <el-image :src="item" :preview-src-list="urldata" :z-index="2999" />
              </div>
            </template>
          </el-form-item>
        </template>
      </el-form>
    </template>
    <span slot="footer" class="dialog-footer">
      <template v-if="keys == 1">
        <el-button size="-" type="primary" @click="saveData">保 存</el-button>
        <el-button size="-" @click="handleClose">取 消</el-button>
      </template>
      <template v-else>
        <el-button size="-" type="primary" @click="imgClick">下载图片</el-button>
        <el-button size="-" @click="backClose">返 回</el-button>
      </template>
    </span>
  </el-dialog>
</template>

<script>
import {putcode,getfilename} from "@/views/codeinspect/api/codeinspect";
import {mapGetters} from "vuex";
export default {
  name: "envdialog",
  data() {
    return {
      dialogVisible: false,
      title: '',
      codeForm: {},
      rules: {
        states: [{ required: true, trigger: "change", message: "请选择处理状态"}],
      },
      imgdata: [],
      urldata: [],
      codeimgs:'',
      keys:null
    }
  },
  props: ['departData'],
  computed: {
     ...mapGetters({
      token:'user/token'
    })
  },
  created() {
  },
  mounted() {
  },
  methods: {
    async showData(obj,index) {
      this.keys = index
      this.title = index == 1 ? '处理信息' : '码上监督二维码'
      if(index == 1){
        this.codeForm = obj
        if(obj.files && obj.files!= ''){
           obj.files.split(',').map(async item => {
            let {data} = await getfilename({fileid:item})
             this.imgdata.push({
                name:data,
                fileid:item
              })
            })
        }
        this.urldata = obj.images && obj.images != ''? obj.images.split(',').map(item => { return `${this.$baseUrl}/gridfs/image/${item}`}) : []
      }else if(index == 2){
        let _this = this
        axios({
          headers: { Authorization:this.token },
          type: 'application/ json; charset = utf-8',
          method: 'GET',
          url: `${window.apiURL}/judical/judicalscan`,
          responseType: 'arraybuffer',
        }).then(function (res) {
          const blob = new Blob([res.data]);
          _this.codeimgs = window.URL.createObjectURL(blob);
        });
      }
      this.dialogVisible = true
    },
    imgClick(){
      var oQrcode = document.querySelectorAll('.codeimg img')
      var url = oQrcode[0].src
      this.downloadIamge(url, '二维码')
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
      this.backClose()
      this.getData()
    },
    downfiles(filename,fileid){
      const loading = this.$loading({
            lock: true,
            text: '文件下载中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.6)'
      });
      let _this = this
      let a = document.createElement("a");
      let event = new MouseEvent("click");
      a.download = filename;
      a.href = `${this.$baseUrl}/gridfs/downloadFile?fileid=${fileid}`;
      a.dispatchEvent(event);
      setTimeout(() => {
          loading.close();
          _this.$message.success('文件下载成功！')
      }, 2000);
    },
    getData() {
      this.$emit('getData')
    },
    //编辑和新增保存按钮
    saveData() {
      this.$refs.codeForm.validate(async (valid) => {
        if (valid) {
          let params = {pid:this.codeForm.pid,status:this.codeForm.states}
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          let res = await putcode(params)
          if (res.code == 200) {
            loading.close();
            this.$message.success('已处理成功')
            this.handleClose()
            this.getData()
          }
        } else {
          return false
        }
      })
    },
    handleClose() {
      this.title = '';
      this.$refs.codeForm.resetFields();
      this.codeForm = this.$options.data().codeForm;
      this.dialogVisible = false;
    },
    backClose(){
      this.title = '';
      this.dialogVisible = false;
    }
  }
}
</script>


<style lang="scss" scoped>
::v-deep{
  .el-dialog__body {
    display: flex;
    flex-direction: column;
    align-items: center;

    .el-form {
      width: 100%;
      .el-form-item {

        .el-input,
        .el-select,
        .el-textarea,
        .el-cascader {
          width: 100%;
        }
.el-input--small .el-input__inner {
            height: 38px;
            line-height: 38px;
          }

          .map-show {
            width: 100%;
            height: 210px;

            #mapShow {
              width: 100%;
              height: 100%;
            }
          }
          .flist{
            display:flex;
            flex-direction: column;
            margin:0;
            padding:0;
            width:80%;
            li{
              display: flex;
              flex-direction:row;
              align-item:center;
              justify-content: space-between;
              cursor: pointer;
              span{
                font-size: 16px;
              }
              i{
                font-size: 22px;
                color:#1890ff;
                position:relative;
                top:3px;
              }
            }
          }
          .imagebox {
            width: 150px;
            height: 150px;
            background-color: #f3f3f3;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            border-radius: 5px;

            i {
              font-size: 30px;
              color: #999;
            }

            u {
              text-decoration: none;
              font-size: 15px;
              color: #999;
            }
          }


        ::v-deep {

        }
      }
    }

    .el-timeline {
      .el-timeline-item {
        .el-timeline-item__timestamp.is-top {
          display: inline-block;
        }

        .el-timeline-item__content {
          .timehead {
            position: absolute;
            top: -1px;
            left: 170px;
            display: flex;
            flex-direction: row;
            align-items: center;

            span {
              font-size: 16px;
              color: #333;
            }

            i {
              margin-left: 20px;
              font-size: 15px;
              border: 1px solid;
              border-radius: 25px;
              padding: 2px 12px;
              color: #FD7837;
              font-style: inherit;

              &.blue {
                color: #2E8CFF;
                border-color: rgba(46, 140, 255, .3);
              }

              &.org {
                color: #FD7837;
                border-color: rgba(253, 120, 55, .3);
              }

              &.red {
                color: #ea373b;
                border-color: rgba(234, 5, 59, .3);
              }

              &.green {
                color: #66ecb7;
                border-color: rgba(102, 236, 183, .3);
              }
            }
          }

          .timebody {
            background-color: #EBEEF5;
            padding: 10px 15px;
            margin-top: 15px;

            span {
              color: #666;
              font-size: 15px;
              display: block;
              margin-bottom: 12px;
            }

            .el-image {
              width: 120px;
              height: 120px;
              margin-right: 12px;
            }
          }
        }
      }
    }

    .noflow {
      font-size: 16px;
      color: #999;
      display: block;
      text-align: center;
    }
  }
}

.el-dialog__footer {
  .el-button {
    padding: 11px 25px;
    font-size: 15px;
  }
}
</style>
