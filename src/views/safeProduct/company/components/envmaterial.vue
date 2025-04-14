<template>
	<div class="envmaterial">
		<el-radio-group
			v-model="tabYear"
			style="margin-bottom: 30px"
			@change="changeRadio"
		>
			<el-radio-button label="2019">2019</el-radio-button>
			<el-radio-button label="2020">2020</el-radio-button>
			<el-radio-button label="2021">2021</el-radio-button>
		</el-radio-group>
		<!-- 图片 -->
		<el-upload
			:action="uploadUrl"
			list-type="picture-card"
			accept=".jpg,.png,.gif,.jpeg"
			:on-preview="handlePictureCardPreview"
			:on-remove="handleRemove"
			:on-success="handleSuccess"
			:file-list="fileList"
		>
			<!-- <i class="el-icon-plus"></i> -->

			<i slot="default" class="el-icon-plus"></i>
			<div slot="file" slot-scope="{ file }">
				<img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
				<span class="el-upload-list__item-actions">
					<span
						class="el-upload-list__item-preview"
						@click="handlePictureCardPreview(file)"
					>
						<i class="el-icon-zoom-in"></i>
					</span>
					<span
						v-if="!disabled"
						class="el-upload-list__item-delete"
						@click="handleDownload(file)"
					>
						<i class="el-icon-download"></i>
					</span>
					<span
						v-if="!disabled"
						class="el-upload-list__item-delete"
						@click="handleRemove(file)"
					>
						<i class="el-icon-delete"></i>
					</span>
				</span>
			</div>
		</el-upload>
		<el-dialog
			:visible.sync="dialogVisible"
			custom-class="upload-img"
			append-to-body
			center
		>
			<img width="100%" :src="dialogImageUrl" alt="" />
		</el-dialog>
	</div>
</template>

<script>
import { getFilesYear, uploadFiles, delFiles, downFiles } from '../api/safePro'
import uploadLicense from '@/components/uploadLicense.vue'
import qs from 'qs'
export default {
	name: 'envmaterial',
	data() {
		return {
			tabYear: '2021',
			dialogImageUrl: '',
			dialogVisible: false,
			fileList: [],
			type: null,
			uploadUrl: '',
			disabled: false,
		}
	},
	components: { uploadLicense },
	props: { pid: String, dirid: Number },
	watch: {
		dirid: {
			handler(num) {
				this.getFiles()
			},
		},
	},
	computed: {},
	created() {},
	mounted() {
		this.uploadUrl = `${this.$baseUrl}/gridfs/up`
		this.getFiles()
	},
	methods: {
		// 年份切换
		changeRadio(val) {
			this.tabYear = val
			this.getFiles()
		},
		async getFiles() {
			let form = { comid: this.pid, dirid: this.dirid, year: this.tabYear }
			let res = await getFilesYear(form)
			console.log(res)
			if (res.code === 200 && res.data.length > 0) {
				let arr = res.data[0].list.map((item) => {
					return {
						url: `${this.$baseUrl}/gridfs/image/${item.fileid}`,
						pid: item.pid,
						fileid: item.fileid,
					}
				})
				this.fileList = arr
				console.log(arr, 'arr')
			} else {
				this.fileList = []
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
			console.log(response, file, fileList)
			let form = {
				comid: this.pid,
				fileid: response.data,
				year: this.tabYear,
				dirid: this.dirid,
			}
			debugger
			let res = await uploadFiles(JSON.stringify(form))
			if (res.code == 200) {
				this.$message.success('上传成功')
				// this.getFiles()
			}
			console.log(res, 'res')
		},
		// 下载
		handleDownload(file) {
			window.open(
				`${this.$baseUrl}/gridfs/downloadFile/?fileid=${file.fileid}`,
				'_self'
			)
		},
	},
}
</script>

<style scoped lang="scss">
// ::v-deep .upload-img {
// 	width: 30vw;
// }
</style>
