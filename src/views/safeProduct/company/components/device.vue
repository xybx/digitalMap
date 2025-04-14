<template>
	<div class="device">
		<div class="text item">
			<!-- query -->
			<el-form :inline="true" :model="searchForm">
				<el-form-item label="设备名称">
					<el-input v-model="searchForm.name"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button
						type="primary"
						@click="handleSearchForm"
						icon="el-icon-search"
					>
						查询
					</el-button>
					<el-button type="primary" @click="handleAddForm" icon="el-icon-plus">
						新增
					</el-button>
				</el-form-item>
			</el-form>
			<el-table
				v-loading="tabloading"
				:data="tableData"
				border
				tooltip-effect="dark"
        max-height="600px"
				:element-loading-text="loadingText"
			>
				<el-table-column
					type="index"
					align="center"
					width="60px"
				></el-table-column>
				<el-table-column prop="name" label="设备名称" align="center">
					<template v-slot="scope">
						{{ scope.row.name ? scope.row.name : '暂无设备名称' }}
					</template>
				</el-table-column>
				<el-table-column prop="specifications" label="规格" align="center">
					<template v-slot="scope">
						{{
							scope.row.specifications ? scope.row.specifications : '暂无规格'
						}}
					</template>
				</el-table-column>
				<el-table-column prop="snumber" label="数量" align="center">
					<template v-slot="scope">
						{{ scope.row.snumber ? scope.row.snumber : '暂无数量' }}
					</template>
				</el-table-column>

				<el-table-column label="图片" align="center">
					<template v-slot="scope">
						<el-image
							style="width: 100px; height: 100px"
							:src="getSrc(scope.row.fileid)"
							fit="scale-down"
							:preview-src-list="srcList"
							v-if="scope.row.fileid"
						></el-image>
						<span v-else>暂无图片</span>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="备注" align="center">
					<template v-slot="scope">
						{{ scope.row.remark ? scope.row.remark : '暂无备注' }}
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template v-slot="scope">
						<el-button type="primary" plain @click="edit(scope.row)">
							编辑
						</el-button>
						<el-button type="danger" plain @click="del(scope.row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				background
				:current-page="pageNo"
				:page-size="pageSize"
				:page-sizes="pageSizes"
				:layout="layout"
				:total="total"
				@size-change="SizeChange"
				@current-change="CurrentChange"
			></el-pagination>
		</div>
		<!-- dialog -->
		<el-dialog
			title="新增设备"
			:visible.sync="dialogAdd"
			width="30%"
			:modal-append-to-body="false"
			@closed="closeAddDialog"
		>
			<el-form :rules="addRules" ref="addForm" :model="addForm" class="addForm">
				<el-form-item prop="name" label="设备名称">
					<el-input v-model="addForm.name"></el-input>
				</el-form-item>
				<el-form-item prop="specifications" label="设备规格">
					<el-input v-model="addForm.specifications"></el-input>
				</el-form-item>
				<el-form-item prop="snumber" label="设备数量">
					<el-input v-model="addForm.snumber"></el-input>
				</el-form-item>
				<el-form-item prop="fileid" label="设备图片">
					<el-upload
						action="action"
						ref="upload"
						list-type="picture-card"
						:on-preview="handlePictureCardPreview"
						:on-remove="handleRemove"
						:limit="1"
						:http-request="uploadImg"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="dialogImageUrl" alt="" />
					</el-dialog>
				</el-form-item>
				<el-form-item prop="remark" label="备注">
					<el-input
						type="textarea"
						:rows="3"
						v-model.trim="addForm.remark"
					></el-input>
				</el-form-item>
			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="addFormConfirm">确 定</el-button>
				<el-button @click="addFormCancel">取 消</el-button>
			</span>
		</el-dialog>

		<el-dialog
			title="编辑设备"
			:visible.sync="dialogEdit"
			width="30%"
			:modal-append-to-body="false"
			:close-on-click-modal="false"
			@closed="closeEditDialog"
		>
			<el-form
				:rules="editRules"
				ref="editForm"
				:model="editForm"
				class="addForm"
			>
				<el-form-item prop="name" label="设备名称">
					<el-input v-model="editForm.name"></el-input>
				</el-form-item>
				<el-form-item prop="specifications" label="设备规格">
					<el-input v-model="editForm.specifications"></el-input>
				</el-form-item>
				<el-form-item prop="snumber" label="设备数量">
					<el-input v-model="editForm.snumber"></el-input>
				</el-form-item>
				<el-form-item prop="fileid" label="设备图片">
					<el-upload
						action="action"
						ref="editupload"
						list-type="picture-card"
						:on-preview="editCardPreview"
						:on-remove="editRemove"
						:on-success="editImgSuccess"
						:http-request="editImg"
						:file-list="fileList"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogImg" :modal="false">
						<img width="100%" :src="editImgUrl" alt="" />
					</el-dialog>
				</el-form-item>
				<el-form-item prop="remark" label="备注">
					<el-input
						type="textarea"
						:rows="3"
						v-model.trim="editForm.remark"
					></el-input>
				</el-form-item>
			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="editFormConfirm">确 定</el-button>
				<el-button @click="editFormCancel">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import {
	getUserList,
	uploadImg,
	addDevice,
	delDevice,
	editDevice,
} from '../api/device'
import qs from 'qs'
export default {
	name: 'device',
	data() {
		return {
			tableData: [],
			tabloading: true,
			loadingText: '正在加载...',
			layout: 'total, sizes, prev, pager, next, jumper',
			total: 0,
			pageNo: 1,
			pageSize: 10,
			pageSizes: [10, 15, 20],
			userpage: true,
			formData: {},
			status: 9,
			searchForm: {
				name: '',
			},
			srcList: [],
			dialogReject: false,
			rejectForm: {
				ckidea: '',
			},
			rules: {
				ckidea: [
					{ required: true, message: '请输入驳回意见', trigger: 'blur' },
				],
			},
			dialogAdd: false,
			addForm: {
				name: '',
				specifications: '',
				snumber: '',
				fileid: '',
				remark: '',
			},
			dialogImageUrl: '',
			dialogVisible: false,
			addRules: {
				name: [
					{ required: true, message: '设备名称不能为空', trigger: 'blur' },
				],
				specifications: [
					{ required: true, message: '设备规格不能为空', trigger: 'blur' },
				],
				snumber: [
					{ required: true, message: '设备数量不能为空', trigger: 'blur' },
				],
			},
			dialogEdit: false,
			editForm: {
				name: '',
				specifications: '',
				snumber: '',
				fileid: '',
				remark: '',
			},
			editImgUrl: '',
			dialogImg: false,
			editRules: {
				name: [
					{ required: true, message: '设备名称不能为空', trigger: 'blur' },
				],
				specifications: [
					{ required: true, message: '设备规格不能为空', trigger: 'blur' },
				],
				snumber: [
					{ required: true, message: '设备数量不能为空', trigger: 'blur' },
				],
			},
			fileList: [],
		}
	},
	components: {},
	computed: {},
	created() {},
	mounted() {
		this.getData()
	},
	methods: {
		async getData(form) {
			let data = {
				status: this.status,
				pageNum: this.pageNo,
				pageSize: this.pageSize,
				compid: this.$route.query.pid,
			}
			if (form?.name) {
				Object.assign(data, {
					name: form.name,
				})
			}
			let res = await getUserList(data)
			if (res.code === 200) {
				this.tableData = res.data.list
				this.total = res.data.total
				this.srcList = res.data.list.map((item) => {
					return `${window.apiURL}/gridfs/image/${item.fileid}`
				})
			}
			setTimeout(() => {
				this.tabloading = false
			}, 200)
		},
		SizeChange(val) {
			this.pageSize = val
			this.getData(this.searchForm)
		},
		CurrentChange(val) {
			this.pageNo = val
			this.getData(this.searchForm)
		},
		// 搜索
		handleSearchForm() {
			console.log('搜索', this.searchForm)
			this.getData(this.searchForm)
		},
		// 新增设备
		handleAddForm() {
			console.log('新增')
			this.dialogAdd = true
		},
		// 新增设备-确定
		addFormConfirm() {
			this.$refs.addForm.validate(async (valid) => {
				if (!valid) {
					this.$message.warning('请补充必填项')
				} else {
					let form = Object.assign(this.addForm, {
						compid: this.$route.query.pid,
					})
					let res = await addDevice(form)
					if (res.code === 200) {
						this.$message.success('添加设备成功')
						this.dialogAdd = false
						this.getData(this.searchForm)
					}
				}
			})
		},
		// 新增设备-取消
		addFormCancel() {
			this.dialogAdd = false
		},
		// 图片上传
		async uploadImg(params) {
			let form = new FormData()
			form.append('file', params.file)
			let res = await uploadImg(form)
			this.addForm.fileid = res.data
		},
		handleRemove(file, fileList) {
			this.addForm.fileid = ''
			console.log(file, fileList)
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url
			this.dialogVisible = true
		},
		// 关闭弹窗
		closeAddDialog() {
			this.$refs.addForm.resetFields()
			this.$refs.upload.clearFiles()
		},
		// 获取图片地址
		getSrc(val) {
			return `${window.apiURL}/gridfs/image/${val}`
		},
		// 编辑
		edit(obj) {
			// console.log(obj)
			this.dialogEdit = true
			if (obj.fileid) {
				this.fileList = [{ url: `${window.apiURL}/gridfs/image/${obj.fileid}` }]
			}
			Object.assign(this.editForm, obj)
		},
		editRemove() {
			this.editForm.fileid = ''
		},
		editCardPreview(file) {
			console.log(file)
			this.editImgUrl = file.url
			this.dialogImg = true
		},
		editImgSuccess(res, file, fileList) {
			this.fileList = fileList
			if (fileList.length > 1) {
				this.fileList = fileList.slice(1)
			}
			// console.log(fileList, 'suc')
		},
		async editImg(params) {
			let form = new FormData()
			form.append('file', params.file)
			let res = await uploadImg(form)
			this.editForm.fileid = res.data
		},
		// 编辑-确定
		async editFormConfirm() {
			let form = Object.assign(this.editForm, { compid: this.$route.query.pid })
			debugger
			let res = await editDevice(form)
			if (res.code === 200) {
				this.$message.success('修改设备成功')
				this.dialogEdit = false
				this.getData(this.searchForm)
			}
			// console.log(res)
		},
		// 编辑-取消
		editFormCancel() {
			this.dialogEdit = false
		},
		// 编辑弹窗-关闭
		closeEditDialog() {
			this.$refs.editForm.resetFields()
			this.$refs.editupload.clearFiles()
		},
		// 删除弹窗
		async del(obj) {
			this.$confirm('确认要删除此项吗？', {
				cancelButtonText: '取消',
				confirmButtonText: '确定',
				type: 'warning',
			})
				.then(async () => {
					let form = { pid: obj.pid }
					debugger
					let res = await delDevice(qs.stringify(form))
					if (res.code === 200) {
						this.$message.success('删除成功')
						this.getData(this.searchForm)
					}
				})
				.catch(() => {
					this.$message.info('已取消删除')
				})
		},
		// 确定驳回按钮
		rejectConfirm() {
			this.$refs.rejectForm.validate(async (valid) => {
				if (valid) {
					let res = await passDevice(qs.stringify(this.rejectForm))
					if (res.code === 200) {
						this.$message.success('已驳回')
						this.dialogReject = false
						this.getData(this.searchForm)
					}
				}
			})
		},
		// 取消驳回按钮
		rejectCancel() {
			this.$refs.rejectForm.resetFields()
			this.dialogReject = false
		},
	},
}
</script>

<style scoped lang="scss">
.el-table {
	.el-table__body {
		.el-button {
			padding: 9px 20px;
			font-size: 14px;
		}
	}
}
.addForm {
	::v-deep {
		.el-form-item__label {
			float: unset;
		}
	}
}
::v-deep .el-dialog__footer {
	text-align: center;
}
</style>
