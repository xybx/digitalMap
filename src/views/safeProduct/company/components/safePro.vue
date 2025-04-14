<template>
	<div class="envmaterial">
		<el-radio-group v-model="tabYear" style="margin-bottom:10px" @change="changeRadio">
			<el-radio-button label="2019">2019</el-radio-button>
			<el-radio-button label="2020">2020</el-radio-button>
			<el-radio-button label="2021">2021</el-radio-button>
      <el-radio-button label="2022">2022</el-radio-button>
		</el-radio-group>
		<!-- 图片 -->
    <div class="flexbox">
      <div class="flexleft">
        <span>上传图片</span>
        <el-upload :action="uploadUrl" list-type="picture-card" accept=".jpg,.png,.gif,.jpeg" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSuccess" :file-list="fileList">
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{ file }">
            <img class="el-upload-list__item-thumbnail" :src="file.url" />
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in"></i>
              </span>
              <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                <i class="el-icon-download"></i>
              </span>
              <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                <i class="el-icon-delete"></i>
              </span>
				    </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" custom-class="upload-img" append-to-body center>
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </div>
      <div class="flexright">
        <span>上传文件</span>
        <el-upload class="uploadfile" :action="uploadUrl" :file-list="FilesList" accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf" :on-preview="handleFilePreview" :on-remove="handleFileRemove" :on-success="handleFileSuccess">
          <el-button size="medium" type="primary">上传文件</el-button>
          <template slot="file" slot-scope="{file}">
            <div class="fontbox"><i class="icon iconfont icon-wendang"></i><span>{{file.name}}</span></div>
            <div class="btnbox">
              <el-button type="primary" plain round @click="handleFilePreview(file)">预览</el-button>
              <el-button type="danger" plain round @click="handleFileRemove(file)">删除</el-button>
              <el-button type="success" plain round @click="downClick(file)">下载</el-button>
            </div>
          </template>
        </el-upload>
      </div>
    </div>

	</div>
</template>

<script>
import {getFilesYear, uploadFiles, delFiles, upFilesData} from '../api/safePro'
import uploadLicense from '@/components/uploadLicense.vue'
import qs from 'qs'
export default {
	name: 'envmaterial',
	data() {
		return {
			tabYear: '2022',
			dialogImageUrl: '',
			dialogVisible: false,
			fileList: [],
			type: null,
			uploadUrl: '',
			disabled: false,
      FilesList:[],
		}
	},
	components: { uploadLicense },
	props: { pid: String, dirid: Number },
	watch: {
		dirid: {
			handler(num) {
				this.tabYear = '2022'
				this.getFiles()
        this.getFilesList()
			},
		},
	},
	computed: {},
	created() {
    this.uploadUrl = `${this.$baseUrl}/gridfs/up`
  },
	mounted() {
		this.getFiles()
    this.getFilesList()
	},
	methods: {
		changeRadio(val) {
			this.tabYear = val
			this.getFiles()
      this.getFilesList()
		},
		async getFiles() {
			let form = { comid: this.pid, dirid: this.dirid, year: this.tabYear }
			let res = await getFilesYear(form)
			if (res.code === 200 && res.data.length > 0) {
        this.fileList = res.data[0].list.filter(item => item.filetype == '0').map((val) => {
					return {
						url: `${this.$baseUrl}/gridfs/image/${val.fileid}`,
						pid: val.pid,
						fileid: val.fileid,
					}
				})
			} else {
				this.fileList = []
			}
		},
    async getFilesList() {
      let form = { comid: this.pid, dirid: this.dirid, year: this.tabYear }
      let res = await getFilesYear(form)
      if (res.code === 200 && res.data.length > 0) {
        this.FilesList = res.data[0].list.filter(item => item.filetype == '1').map((val) => {
          return {
            pid: val.pid,
            fileid: val.fileid,
            name:val.filename
          }
        })
      } else {
        this.FilesList = []
      }
    },
		async handleRemove(file) {
			let form = { pid: file.pid }
			let res = await delFiles(qs.stringify(form))
			if (res.code === 200) {
				this.$message.success('删除成功')
				this.getFiles()
			}
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url
			this.dialogVisible = true
		},
		// 上传成功
		async handleSuccess(response, file, fileList) {
			let form = {comid: this.pid, fileid: response.data, year: this.tabYear, dirid: this.dirid,}
			let res = await uploadFiles(JSON.stringify(form))
			if (res.code == 200) {
				this.$message.success('上传成功')
				// this.getFiles()
			}
		},
		// 下载
		handleDownload(file) {
			window.open(`${this.$baseUrl}/gridfs/downloadFile/?fileid=${file.fileid}`, '_self')
		},

    handleFilePreview(file){
      let Base64 = require('js-base64').Base64;
      let previewUrl = `${this.$baseUrl}/gridfs/downloadFile/?fileid=${file.fileid}&fullfilename=${file.name}`;
      window.open(`${this.$fileURL}/onlinePreview?url=${encodeURIComponent(Base64.encode(previewUrl))}`);
    },
    handleFileRemove(file){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let form = { pid: file.pid }
        let res = await delFiles(qs.stringify(form))
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.getFilesList()
        }
      })
    },
    async handleFileSuccess(response, file, fileList){
      let fileobj = {comid: this.pid, fileid: response.data, year: this.tabYear, dirid: this.dirid,filename:file.name}
      let res = await upFilesData(JSON.stringify(fileobj))
      if (res.code == 200) {
        this.$message.success('上传成功')
        this.getFilesList()
      }
    },
    downClick(file){
      window.open(`${this.$baseUrl}/gridfs/downloadFile/?fileid=${file.fileid}`, '_self')
    }
	},
}
</script>

<style scoped lang="scss">
 .envmaterial{
   display: flex;
   flex-direction:column;
   flex:1;
   min-height: 100%;
   .flexbox{
     display: flex;
     flex:1;
     flex-direction: row;
     justify-content: space-between;
     min-height:100%;
     .flexleft,.flexright{
       &>span{
         margin:10px 0;
         display:inline-block;
         font-size:15px;
         font-weight:bold;
       }
     }
     .flexleft{
       width:calc(50% - 2px);
       border-right:2px dashed rgba(129, 133, 153, .4);
       .leftup{
         display:flex;
         flex-wrap: wrap;
         flex-direction: row;
       }
     }
     .flexright{
       width:calc(50% - 10px);
       padding-left: 10px;
       .uploadfile{
         ::v-deep{
           .el-upload-list{
             display: flex;
             flex-direction: column;
             li{
               display: flex;
               flex-direction: row;
               align-items: center;
               justify-content: space-between;
               background: rgba(245, 247, 250, 1);
               border-radius: 5px;
               padding:10px 15px;
               margin-bottom: 10px;
               &:last-child{
                 margin-bottom:0;
               }
               .fontbox{
                 display: flex;
                 flex-direction: row;
                 align-items: center;
                 i{
                   font-size:24px;
                   color:rgba(45, 140, 250, 1);
                   margin-right:10px;
                 }
                 span{
                   color: #333;
                 }
               }
               .btnbox{
                 display: flex;
                 flex-direction: row;
                 align-items: center;
               }
             }
           }
         }
       }
     }
   }
 }
</style>
