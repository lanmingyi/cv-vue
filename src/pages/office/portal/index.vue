<template>
	<div class="index-container  border-box">
		<cardList></cardList>
		<a-row :gutter="24">
			<a-col :xs="24" :md="12" :sm="12" :lg="8">
				<a-card :hoverable="true" :bordered="false">
					<template slot="title">
						<icon-fonts icon="icon-fachuchuanyue" class="card-title-icon" />
						<span @click="navTo(0)">我的传阅</span>
					</template>
					<circulate></circulate>
				</a-card>
			</a-col>
			<a-col :xs="24" :md="12" :sm="12" :lg="8">
				<a-card :hoverable="true" :bordered="false">
					<template slot="title" @click="navTo(1)">
						<icon-fonts icon="icon-renwu2" class="card-title-icon" />
						<span @click="navTo(1)">我的任务</span>
					</template>
					<taskList></taskList>
				</a-card>
			</a-col>
			<a-col :xs="24" :md="12" :sm="12" :lg="8">
				<a-card :hoverable="true" :bordered="false">
					<template slot="title" @click="navTo(2)">
						<icon-fonts icon="icon-tongzhigonggao2" class="card-title-icon" />
						<span @click="navTo(2)">通知公告</span>
					</template>
					<note></note>
				</a-card>
			</a-col>
			<a-col :xs="24" :md="24" :sm="24" :lg="16" class="margin-top">
				<a-card :hoverable="true" :bordered="false">
					<template slot="title">
						<icon-fonts icon="icon-jixiao" class="card-title-icon" /> 本月工作完成情况
					</template>
					<template slot="extra">
						月份选择：<t-date type="month" @change="changeMonth" dateFormat="YYYY-MM"></t-date>
					</template>
					<line-chart :chartData="lineData"></line-chart>
				</a-card>
			</a-col>
			<a-col :xs="24" :md="12" :sm="12" :lg="8">
				<a-card :hoverable="true" :bordered="false" class="margin-top">
					<template slot="title" @click="navTo(3)">
						<icon-fonts icon="icon-xinwen" class="card-title-icon" />
						<span @click="navTo(3)">内部新闻</span>
					</template>
					<news></news>
				</a-card>
			</a-col>
		</a-row>
	</div>
</template>

<script>
import { cardList, taskList, signIn, note, schedule, lineChart, news, circulate } from './components';
import { getLineChartDataByMonth } from '@/services/dashboard';

export default {
	name: 'index',
	data() {
		return {
			year: new Date().getFullYear(),
			month: new Date().getMonth() + 1,
			lineData: {},
		};
	},
	components: { cardList, taskList, note, signIn, schedule, lineChart, news, circulate },
	mounted() {
		this.getLineData();
	},
	methods: {
		async getLineData() {
			const { data } = await getLineChartDataByMonth({ year: this.year, month: this.month });
			this.lineData = data || [];
		},
		changeMonth(e) {
			console.log(e);
			this.year = e.substring(0, 4);
			this.month = e.substring(5, 7);
			console.log(this.year, this.month);
			this.getLineData();
		},
		navTo(val) {
			console.log(val);
			let urlList = [
				'/office/oaChuanyue/Issued',
				'/office/oaTaskBase/indexMy',
				'/office/publicAnnou/index',
				'/office/news/index',
			];
			urlList.forEach((e, index) => {
				if (val === index) {
					this.$router.push({ path: e });
				}
			});
		},
	},
};
</script>

<style lang="less" scoped>
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

	.card-title-icon {
		font-size: 18px;
	}
}
</style>
