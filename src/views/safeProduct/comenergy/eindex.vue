<template>
	<div class="eindex">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<i></i>
				<span>企业能耗</span>
			</div>
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
			</el-tabs>
		</el-card>
	</div>
</template>

<script>
import Chart from './chart.vue'
import { energyYear, energyMonth } from './api/api'
export default {
	name: 'eindex',
	data() {
		return {
			activeTab: 'year',
			tabPosition: '2021',
			showRC: false,
			showRB: false,
			yearOption: {},
			monthOption: {},
		}
	},
	components: { Chart },
	computed: {},
	created() {},
	mounted() {
		this.$nextTick(() => {
			this.getYearData()
		})
	},
	watch: {
		$route: {
			handler: function (val, oldVal) {
				if(val.name == 'Eindex'){
					this.getYearData()
				}
			},
			deep: true,
		},
  	},
	methods: {
		// 标签页切换
		handleTabClick(obj) {
			if (obj.name === 'month') {
				this.$nextTick(() => {
					this.changeRadio()
				})
			} else {
				this.$nextTick(() => {
					this.getYearData()
				})
			}
		},
		// 获取年度能耗数据
		async getYearData() {
			let res = await energyYear()
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
		async changeRadio(val) {
			let obj = { nyear: val }
			let res = await energyMonth(obj)
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
	},
}
</script>

<style scoped lang="scss">
.eindex {
	width: 100%;
	background: none !important;
	padding: 0 !important;
	.el-card {
		height: calc(100vh - 104px) !important;
		margin-bottom: 0;
		display: flex;
		flex-direction: column;
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
				flex: 1;
				display: flex;
				flex-direction: column;
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
						}
					}
				}
			}
		}
	}
}
</style>
