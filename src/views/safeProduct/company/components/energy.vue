<template>
	<div class="energy">
		<el-tabs v-model="activeTab" @tab-click="handleTabClick">
			<el-tab-pane label="年度能耗报表" name="year">
				<Chart
					chartId="yearChart"
					:chartOption="yearOption"
					v-if="showRC"
				></Chart>
			</el-tab-pane>
			<el-tab-pane label="月度能耗报表" name="month">
				<el-radio-group
					v-model="tabPosition"
					style="margin-bottom: 30px"
					@change="changeRadio"
				>
					<el-radio-button label="2019">2019</el-radio-button>
					<el-radio-button label="2020">2020</el-radio-button>
					<el-radio-button label="2021">2021</el-radio-button>
				</el-radio-group>
				<div class="chart-box">
					<Chart
						chartId="monthChart"
						:chartOption="monthOption"
						v-if="showRB"
					></Chart>
				</div>
			</el-tab-pane>
			<el-tab-pane label="能耗清单" name="list" class="tabslist">
				<el-table
					v-loading="tabloading"
					:data="tableData"
					border
					max-height="600px"
					tooltip-effect="dark"
					:element-loading-text="loadingText"
				>
					<el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
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
							{{scope.row.liquefiedgas ? scope.row.liquefiedgas : '暂无液化气' }}
						</template>
					</el-table-column>
					<el-table-column label="天然气" align="center" show-overflow-tooltip>
						<template v-slot="scope">
							{{ scope.row.naturalgas ? scope.row.naturalgas : '暂无天然气' }}
						</template>
					</el-table-column>
					<el-table-column label="添加时间" align="center" show-overflow-tooltip>
						<template v-slot="scope">
							{{scope.row.addtime ? scope.row.addtime.split(' ')[0] : '暂无添加时间' }}
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center">
						<template v-slot="scope">
							<el-button type="primary" plain @click="edit(scope.row)">编辑</el-button>
							<el-button type="danger" plain @click="del(scope.row)">删除</el-button>
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
			</el-tab-pane>
		</el-tabs>

		<!-- dialog -->
		<el-dialog
			title="编辑能耗"
			:visible.sync="dialogEnergy"
			width="30%"
			:modal-append-to-body="false"
			:close-on-click-modal="false"
			@closed="closeEnergyDialog"
		>
			<el-form
				:rules="energyRules"
				ref="energyForm"
				:model="energyForm"
				class="addForm"
			>
				<el-form-item prop="nyear" label="年份">
					<el-input v-model="energyForm.nyear"></el-input>
				</el-form-item>
				<el-form-item prop="nmonth" label="月份">
					<el-input v-model="energyForm.nmonth"></el-input>
				</el-form-item>
				<el-form-item prop="electric" label="用电">
					<el-input v-model="energyForm.electric"></el-input>
				</el-form-item>
				<el-form-item prop="water" label="用水">
					<el-input v-model="energyForm.water"></el-input>
				</el-form-item>
				<el-form-item prop="liquefiedgas" label="液化气">
					<el-input v-model="energyForm.liquefiedgas"></el-input>
				</el-form-item>
				<el-form-item prop="naturalgas" label="天然气">
					<el-input v-model="energyForm.naturalgas"></el-input>
				</el-form-item>
			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="energyFormConfirm">确 定</el-button>
				<el-button @click="energyFormCancel">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import Chart from '@/views/safeProduct/comenergy/chart.vue'
import {getYearEnergyComp, getMonthEnergyComp, getList, delEnergy, editEnergy} from '../api/energy'
import qs from 'qs'
export default {
	name: 'energy',
	data() {
		return {
			activeTab: 'year',
			tabPosition: '2021',
			yearOption: {},
			monthOption: {},
			showRC: false,
			showRB: false,
			tableData: [],
			tabloading: true,
			loadingText: '正在加载...',
			layout: 'total, sizes, prev, pager, next, jumper',
			total: 0,
			pageNo: 1,
			pageSize: 10,
			pageSizes: [10, 15, 20],
			formData: {},
			dialogEnergy: false,
			energyForm: {
				nyear: '',
				nmonth: '',
				electric: '',
				water: '',
				liquefiedgas: '',
				naturalgas: '',
			},
			energyRules: {
				nyear: [{ required: true, message: '年份不能为空', trigger: 'blur' }],
				nmonth: [{ required: true, message: '月份不能为空', trigger: 'blur' }],
				electric: [
					{ required: true, message: '用电不能为空', trigger: 'blur' },
				],
				water: [{ required: true, message: '用水不能为空', trigger: 'blur' }],
				liquefiedgas: [
					{ required: true, message: '液化气不能为空', trigger: 'blur' },
				],
				naturalgas: [
					{ required: true, message: '天然气不能为空', trigger: 'blur' },
				],
			},
		}
	},
	props: { pid: String },
	components: { Chart },
	computed: {},
	created() {},
	mounted() {
		this.$nextTick(() => {
			this.getYearData()
		})
	},
	methods: {
		// 标签页切换
		handleTabClick(obj) {
			if (obj.name === 'month') {
				this.$nextTick(() => {
					this.changeRadio()
				})
			} else if (obj.name === 'year') {
				this.$nextTick(() => {
					this.getYearData()
				})
			} else {
				this.$nextTick(() => {
					this.getEnergyList()
				})
			}
		},
		// 获取年度能耗数据
		async getYearData() {
			let res = await getYearEnergyComp({ compid: this.pid })
			this.yearOption = {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						label: {
							backgroundColor: '#6a7985',
						},
					},
				},
				legend: {
					data: res.data.types,
				},
				grid: {
					top: '5%',
					bottom: '5%',
					containLabel: true,
				},
				xAxis: [
					{
						type: 'category',
						boundaryGap: false,
						data: res.data.years,
					},
				],
				yAxis: [
					{
						type: 'value',
					},
				],
				series: [
					{
						name: res.data.series[0].name,
						smooth: true,
						type: 'line',
						emphasis: {
							focus: 'series',
						},
						data: res.data.series[0].data,
						itemStyle: { color: 'rgb(2,225,181)', width: 2, type: 'solid' },
						areaStyle: {
							normal: {
								//颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
								color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{
										offset: 0,
										color: 'rgba(2, 225, 181, 0.7)',
									},
									{
										offset: 0.34,
										color: 'rgba(2, 225, 181, 0.35)',
									},
									{
										offset: 1,
										color: 'rgba(2, 225, 181, 0)',
									},
								]),
							},
						},
					},
					{
						name: res.data.series[1].name,
						smooth: true,
						type: 'line',
						emphasis: {
							focus: 'series',
						},
						data: res.data.series[1].data,
						itemStyle: { color: 'rgb(71,171,255)', width: 2, type: 'solid' },
						areaStyle: {
							normal: {
								//颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
								color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{
										offset: 0,
										color: 'rgba(71, 171, 255, 0.7)',
									},
									{
										offset: 0.34,
										color: 'rgba(71, 171, 255, 0.35)',
									},
									{
										offset: 1,
										color: 'rgba(71, 171, 255, 0)',
									},
								]),
							},
						},
					},
					{
						name: res.data.series[2].name,
						smooth: true,
						type: 'line',
						emphasis: {
							focus: 'series',
						},
						data: res.data.series[2].data,
						itemStyle: { color: 'rgb(197,71,255)', width: 2, type: 'solid' },
						areaStyle: {
							normal: {
								//颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
								color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{
										offset: 0,
										color: 'rgba(197, 71, 255, 0.7)',
									},
									{
										offset: 0.34,
										color: 'rgba(197, 71, 255, 0.35)',
									},
									{
										offset: 1,
										color: 'rgba(197, 71, 255, 0)',
									},
								]),
							},
						},
					},
					{
						name: res.data.series[3].name,
						smooth: true,
						type: 'line',
						emphasis: {
							focus: 'series',
						},
						data: res.data.series[3].data,
						itemStyle: { color: 'rgb(255,142,71)', width: 2, type: 'solid' },
						areaStyle: {
							normal: {
								//颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
								color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{
										offset: 0,
										color: 'rgba(255, 142, 71, 0.7)',
									},
									{
										offset: 0.34,
										color: 'rgba(255, 142, 71, 0.35)',
									},
									{
										offset: 1,
										color: 'rgba(255, 142, 71, 0)',
									},
								]),
							},
						},
					},
				],
			}
			this.showRC = true
			this.showRB = false
		},
		// 月度年份选择
		async changeRadio(val = this.tabPosition) {
			let obj = { nyear: val, compid: this.pid }
			let res = await getMonthEnergyComp(obj)
			this.monthOption = {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						label: {
							backgroundColor: '#6a7985',
						},
					},
				},
				legend: {
					data: res.data.types,
				},
				grid: {
					top: '5%',
					bottom: '5%',
					containLabel: true,
				},
				xAxis: [
					{
						type: 'category',
						boundaryGap: false,
						data: res.data.months,
					},
				],
				yAxis: [
					{
						type: 'value',
					},
				],
				series: [
					{
						name: res.data.series[0].name,
						smooth: true,
						type: 'line',
						emphasis: {
							focus: 'series',
						},
						data: res.data.series[0].data,
						itemStyle: {
							color: 'rgb(2, 225, 181)',
							width: 2,
							type: 'solid',
						},
						areaStyle: {
							//颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
							color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{
									offset: 0,
									color: 'rgba(2, 225, 181, 0.7)',
								},
								{
									offset: 0.34,
									color: 'rgba(2, 225, 181, 0.35)',
								},
								{
									offset: 1,
									color: 'rgba(2, 225, 181, 0)',
								},
							]),
						},
					},
					{
						name: res.data.series[1].name,
						smooth: true,
						type: 'line',
						emphasis: {
							focus: 'series',
						},
						data: res.data.series[1].data,
						itemStyle: {
							color: 'rgb(71, 171, 255)',
							width: 2,
							type: 'solid',
						},
						areaStyle: {
							//颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
							color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{
									offset: 0,
									color: 'rgba(71, 171, 255, 0.7)',
								},
								{
									offset: 0.34,
									color: 'rgba(71, 171, 255, 0.35)',
								},
								{
									offset: 1,
									color: 'rgba(71, 171, 255, 0)',
								},
							]),
						},
					},
					{
						name: res.data.series[2].name,
						smooth: true,
						type: 'line',
						emphasis: {
							focus: 'series',
						},
						data: res.data.series[2].data,
						itemStyle: {
							color: 'rgb(197,71,255)',
							width: 2,
							type: 'solid',
						},
						areaStyle: {
							//颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
							color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{
									offset: 0,
									color: 'rgba(197, 71, 255, 0.7)',
								},
								{
									offset: 0.34,
									color: 'rgba(197, 71, 255, 0.35)',
								},
								{
									offset: 1,
									color: 'rgba(197, 71, 255, 0)',
								},
							]),
						},
					},
					{
						name: res.data.series[3].name,
						smooth: true,
						type: 'line',
						emphasis: {
							focus: 'series',
						},
						data: res.data.series[3].data,
						itemStyle: {
							color: 'rgb(255,142,71)',
							width: 2,
							type: 'solid',
						},
						areaStyle: {
							//颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
							color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{
									offset: 0,
									color: 'rgba(255, 142, 71, 0.7)',
								},
								{
									offset: 0.34,
									color: 'rgba(255, 142, 71, 0.35)',
								},
								{
									offset: 1,
									color: 'rgba(255, 142, 71, 0)',
								},
							]),
						},
					},
				],
			}
			this.showRC = false
			this.showRB = true
		},
		// 能耗清单
		async getEnergyList() {
			let data = {
				compid: this.pid,
				pageNum: this.pageNo,
				pageSize: this.pageSize,
			}
			let res = await getList(data)
			if (res.code === 200) {
				this.tableData = res.data.list
				this.total = res.data.total
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
		// 删除清单项
		del(obj) {
			this.$confirm('确认要删除此项吗？', {
				cancelButtonText: '取消',
				confirmButtonText: '确定',
				type: 'warning',
			})
				.then(async () => {
					let form = { pid: obj.pid }
					let res = await delEnergy(form)
					if (res.code === 200) {
						this.$message.success('删除成功')
						this.getEnergyList()
					}
				})
				.catch(() => {
					this.$message.info('已取消删除')
				})
		},
		// 编辑清单项
		edit(obj) {
			this.dialogEnergy = true
			Object.assign(this.energyForm, obj)
			console.log(this.energyForm)
		},
		closeEnergyDialog() {
			this.$refs.energyForm.resetFields()
		},
		energyFormConfirm() {
			this.$refs.energyForm.validate(async (valid) => {
				if (valid) {
					let res = await editEnergy(this.energyForm)
					if (res.code === 200) {
						this.$message.success('编辑成功')
						this.dialogEnergy = false
						this.getEnergyList()
					}
				} else {
					this.$message.warning('必填项不能为空')
				}
			})
		},
		energyFormCancel() {
			this.dialogEnergy = false
		},
	},
}
</script>

<style scoped lang="scss">
.energy {
	height: 100%;
	display: flex;
	flex-direction: column;
	// background-color: tomato;
	::v-deep {
		.el-tabs {
			flex: 1;
			display: flex;
			flex-direction: column;
			.el-tabs__content {
				flex: 1;
				display: flex;
				.el-tab-pane {
					flex: 1;
					display: flex;
					flex-direction: column;
					.chart-box {
						flex: 1;
					}
          &.tabslist{
            flex: none;
            display: block;
            width: 100%;
          }
				}
			}
		}
		.el-dialog__footer {
			text-align: center;
		}
	}
}
</style>
