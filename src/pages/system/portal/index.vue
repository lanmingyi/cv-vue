<template>
	<div class="index-container  border-box">
		<card-list @sendTitle="getTitle" />

		<div class="sale-card" style="font-size:14px;padding:8px">
			<span style="font-weight: bold">在线演示：</span>
			<a style="color: blue" href="http://demo.misboot.com/system/login" target="_blank"
			   onclick="_hmt.push(['_trackEvent', '门户', '点击', 'TopJUI版演示'])">智能运输管理ERP系统TopJUI版</a> |
			<a style="color: purple" href="https://vue.misboot.com" target="_blank"
			   onclick="_hmt.push(['_trackEvent', '门户', '点击', 'Vue版演示'])">智能运输管理ERP系统</a> |
			<a style="color: red" href="https://www.zuoyo.com/about.html#contact" target="_blank">联系我们</a>
		</div>

		<div class="sale-card">
			<sale-title @sendCurrent="getCurrent">
				<template slot="title"> {{ currentName }} 统计图 </template>
			</sale-title>
			<a-row class="sale-container" :gutter="16">
				<a-col :xs="24" :md="24" :sm="24" :lg="16" style="height:100%">
					<line-chart :chartData="lineData" :title="currentName" class="chart-line" />
				</a-col>
				<a-col :xs="24" :md="12" :sm="12" :lg="8" style="height:100%">
					<div class="shop-title">门店{{ currentName }}排行榜 Top10</div>
					<shop-rank style="height:calc(100% - 80px)" :rankData="rankData" />
				</a-col>
			</a-row>
		</div>
		<a-row :gutter="24" class="sale-list ">
			<a-col :xs="24" :md="12" :sm="12" :lg="8">
				<a-card title="消费种类占比" :hoverable="true" :bordered="false">
					<pie-chart :chartData="pieData" class="chart-line" />
				</a-card>
			</a-col>
			<a-col :xs="24" :md="12" :sm="12" :lg="8">
				<a-card title="热门搜索" :hoverable="true" :bordered="false">
					<hot-chart :chartData="hotData" class="chart-line" />
				</a-card>
			</a-col>
			<a-col :xs="24" :md="12" :sm="12" :lg="8">
				<a-card title="到店人数统计" :hoverable="true" :bordered="false">
					<more-chart :chartData="moreData" class="chart-line" />
				</a-card>
			</a-col>
		</a-row>
	</div>
</template>

<script>
import { cardList, saleTitle, lineChart, shopRank, pieChart, hotChart, moreChart } from './components';
import { getLineChartData, getRankShopData, getPieTypeData, getHotSearchData, getMoreData } from '@/services/dashboard';
import scrollBar from '@/components/scrollBar';

export default {
	name: 'index',
	components: {
		cardList,
		lineChart,
		saleTitle,
		shopRank,
		pieChart,
		hotChart,
		moreChart,
		scrollBar,
	},
	data() {
		return {
			currentName: '销售额',
			currentKey: 'sale',
			currentType: 'day',
			lineData: {},
			rankData: [],
			pieData: [],
			hotData: [],
			moreData: [],
		};
	},
	mounted() {
		this.getData();
	},
	methods: {
		getTitle(title, key) {
			if (title == this.currentName) {
				return;
			}
			this.currentName = title;
			this.currentKey = key;
			this.getLineData();
			this.getRankData();
		},

		getCurrent(type) {
			this.currentType = type;
			this.getData();
		},

		getData() {
			this.getLineData();
			this.getRankData();
			this.getPieData();
			this.getHotData();
			this.getMoreData();
		},

		async getLineData() {
			const { currentType: type, currentKey } = this;
			const { data } = await getLineChartData({ type, currentKey });
			this.lineData = data || [];
		},

		async getRankData() {
			const { currentType: type, currentKey } = this;
			const { data } = await getRankShopData({ type, currentKey });
			this.rankData = data || [];
		},

		async getPieData() {
			const { currentType: type } = this;
			const { data } = await getPieTypeData({ type });
			this.pieData = data || [];
		},

		async getHotData() {
			const { currentType: type } = this;
			const { data } = await getHotSearchData({ type });
			this.hotData = data || [];
		},

		async getMoreData() {
			const { currentType: type } = this;
			const { data } = await getMoreData({ type });
			this.moreData = data || [];
		},
	},
};
</script>
<style lang="scss" scoped>
.index-container {
	padding: 14px;
	.sale-card {
		background: rgba(255, 255, 255, 1);
		width: 100%;
		margin-top: 6px;

		.sale-container {
			margin: 24px 0;
			height: 350px;
			box-sizing: border-box;
			padding: 0 24px;
			.shop-title {
				height: 50px;
				font-size: 1rem;
			}
		}
	}
	.sale-list {
		margin: 25px 0;
	}
	.chart-line {
		height: 300px;
		width: 100%;
	}
}
</style>
