<template>
	<div class="chart-container">
		<div class="chart-box" :id="chartId"></div>
	</div>
</template>

<script>
export default {
	name: '',
	props: {
		chartId: String,
		chartOption: {
			type: Object,
		},
	},
	components: {},
	data() {
		return {}
	},
	computed: {},
	watch: {
		// 监听数据变化
		chartOption: {
			handler() {
				this.getChat(this.chartId)
			},
			deep: true,
		},
	},
	methods: {
		// 渲染图表
		getChat(chartId) {
			let app = this
      let myChart = this.initChart(chartId)
			if (myChart != null && myChart != '' && myChart != undefined) {
				myChart.dispose()
			}
			let option = this.chartOption
			// console.log(option,'option');
			// myChart.clear()
			myChart.setOption(option)
			window.addEventListener('resize', function () {
				app.resizeMyChart(chartId)
			})
		},
		// resize 监听
		resizeMyChart(chartId) {
			if (this.initChart(chartId)) {
				this.initChart(chartId).resize()
			}
		},
		// 获取渲染DOM
		initChart(chartId) {
			if (document.getElementById(chartId)) {
				return this.$echarts.init(document.getElementById(chartId))
			}
		},
	},
	created() {
		let myChart
	},
	mounted() {
		this.getChat(this.chartId)
	},
	beforeDestroy() {
		window.removeEventListener('resize', function () {
			app.resizeMyChart()
		})
	},
}
</script>

<style scoped lang="scss">
.chart-container {
	height: 100%;
	.chart-box {
		height: 100%;
	}
}
</style>
