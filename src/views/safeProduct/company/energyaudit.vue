<template>
	<div class="energyaudit">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<i></i>
				<span>企业能耗审核</span>
			</div>
			<div class="text item">
				<!-- query -->
        <queryForm :audit="true" @queryClick="queryClick"/>
				<el-table
					v-loading="tabloading"
					:data="tableData"
					border
					tooltip-effect="dark"
					:element-loading-text="loadingText"
				>
					<el-table-column
						type="index"
            label="序号"
						align="center"
						width="60px"
					></el-table-column>
					<el-table-column label="企业名称" align="center" show-overflow-tooltip>
						<template v-slot="scope">
							{{ scope.row.company ? scope.row.company : '暂无企业名称' }}
						</template>
					</el-table-column>
					<el-table-column label="年份" align="center" show-overflow-tooltip>
						<template v-slot="scope">
							{{ scope.row.nyear ? scope.row.nyear : '暂无年份' }}
						</template>
					</el-table-column>
					<el-table-column label="月份" align="center" show-overflow-tooltip>
						<template v-slot="scope">
							{{ scope.row.nmonth ? scope.row.nmonth : '暂无月份' }}
						</template>
					</el-table-column>
					<el-table-column label="用电" align="center" show-overflow-tooltip>
						<template v-slot="scope">
							{{ scope.row.electric ? scope.row.electric : '暂无用电' }}
						</template>
					</el-table-column>
					<el-table-column label="用水" align="center" show-overflow-tooltip>
						<template v-slot="scope">
							{{ scope.row.water ? scope.row.water : '暂无用水' }}
						</template>
					</el-table-column>
					<el-table-column label="液化气" align="center" show-overflow-tooltip>
						<template v-slot="scope">
							{{
								scope.row.liquefiedgas ? scope.row.liquefiedgas : '暂无液化气'
							}}
						</template>
					</el-table-column>
					<el-table-column label="天然气" align="center" show-overflow-tooltip>
						<template v-slot="scope">
							{{ scope.row.naturalgas ? scope.row.naturalgas : '暂无天然气' }}
						</template>
					</el-table-column>
					<el-table-column label="添加时间" align="center" show-overflow-tooltip>
						<template v-slot="scope">
							{{
								scope.row.addtime
									? scope.row.addtime.split(' ')[0]
									: '暂无添加时间'
							}}
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" width="240px">
						<template v-slot="scope">
							<el-button type="primary" plain @click="pass(scope.row.pid)">
								通过
							</el-button>
							<el-button type="danger" plain @click="reject(scope.row)">
								驳回
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
				title="驳回审核"
				:visible.sync="dialogReject"
				width="30%"
				top="33vh"
			>
				<el-form :rules="rules" ref="rejectForm" :model="rejectForm">
					<el-form-item prop="ckidea">
						<el-input
							type="textarea"
							:rows="3"
							v-model.trim="rejectForm.ckidea"
							placeholder="请输入驳回意见"
						></el-input>
					</el-form-item>
				</el-form>

				<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="rejectConfirm">确 定</el-button>
					<el-button @click="rejectCancel">取 消</el-button>
				</span>
			</el-dialog>
		</el-card>
	</div>
</template>

<script>
import { getEnergyList, passEnergy, rejectEnergy } from './api/device'
import queryForm from "./components/queryForm";
import qs from 'qs'
export default {
	name: 'energyaudit',
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
			status: 0,
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
		}
	},
	components: {
    queryForm
  },
	computed: {},
	created() {},
	mounted() {
		this.getData()
	},
watch: {
    $route: {
      handler: function (val, oldVal) {
        if(val.path == '/energy'){
         this.getData()
        }
      },
      deep: true,
    },
},
	methods: {
		async getData(form) {
			let data = {
				pageNum: this.pageNo,
				pageSize: this.pageSize,
			}
			if (form?.name) {
				Object.assign(data, {
					company: form.name,
					// areaid: form.areaid.join(','),
				})
			}
			let res = await getEnergyList(data)
			// console.log(res)
			// debugger
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
			this.getData(this.formData)
		},
		CurrentChange(val) {
			this.pageNo = val
			this.getData(this.formData)
		},
    queryClick(form){
      this.formData = form
      this.pageNo = 1
      this.getData(form)
    },
		// 获取图片地址
		getSrc(val) {
			return `${window.apiURL}/gridfs/image/${val}`
		},
		// 通过审核
		async pass(pid) {
			let form = { pid }
			let res = await passEnergy(JSON.stringify(form))
			if (res.code === 200) {
				this.$message.success(res.data)
				this.getData()
			}
		},
		reject(obj) {
			this.dialogReject = true
			Object.assign(this.rejectForm, { pid: obj.pid, stauts: '2' })
		},
		// 确定驳回按钮
		rejectConfirm() {
			this.$refs.rejectForm.validate(async (valid) => {
				if (valid) {
					let res = await rejectEnergy(JSON.stringify(this.rejectForm))
					if (res.code === 200) {
						this.$message.success(res.data)
						this.dialogReject = false
						this.getData()
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
.energyaudit {
	width: 100%;
	background: none !important;
	padding: 0 !important;
	.el-card {
		min-height: calc(100vh - 104px) !important;
		margin-bottom: 0;
		::v-deep {
			.el-card__header {
				background-color: #f5f7fa;
				color: #333;
				display: flex;
				justify-content: left;
				align-items: center;
				flex-direction: row;
				padding: 12px 20px;
				span {
					margin-left: 10px;
					line-height: 20px;
					display: inline-block;
				}
				i {
					width: 2px;
					height: 20px;
					background-color: #0c9ed7;
					display: inline-block;
					position: relative;
					top: 4px;
				}
			}
			.el-card__body {
				.el-table {
					.el-table__body {
						.el-button {
							padding: 9px 20px;
							font-size: 14px;
						}
					}
				}
			}
		}
	}
	::v-deep {
		.el-dialog__header {
			background: #f5f7fa;
		}
		.el-dialog__footer {
			text-align: center;
		}
	}
}
</style>
