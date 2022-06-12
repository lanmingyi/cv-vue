<template>
	<div class="cardList-wrapper">
		<a-row :gutter="48">
			<a-col :xs="24" :md="24" :sm="24" :lg="10" :offset="2">
				<div class="card-item card-item-one">
					<div>上班09:00</div>
					<div><a-icon type="time"></a-icon>已打卡</div>
				</div>
			</a-col>
			<a-col :xs="24" :md="24" :sm="24" :lg="10">
				<div class="card-item card-item-two">
					<div>下班18:00</div>
					<div><a-icon type="time"></a-icon>未打卡</div>
				</div>
			</a-col>
		</a-row>
		<div class="ball">
			<div class="ball-info" @click="clockInAndOutByTime()">
				<div class="ball-info-time">
					<h2>打卡</h2>
					<h1>{{ nowTime }}</h1>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { dateFormat, getNowFormatDate } from '@/utils/util';

export default {
	data() {
		return {
			nowTime: '',
		};
	},
	mounted() {
		this.getTime();
		setInterval(() => {
			this.getTime();
		}, 1000);
	},
	methods: {
		getTime() {
			this.nowTime = dateFormat(new Date());
		},
		// 上班下班打卡
		clockInAndOutByTime() {
			let url = '';
			console.log(new Date().getTime());
			let day = getNowFormatDate() + ' 09:00:00';
			let inTime = new Date(day.replace(/-/g, '/')).getTime();
			let outTime = new Date(day.replace(/-/g, '/')).getTime();
			console.log(inTime);
			if (inTime < day) {
				url = '/hr/hrOpenResults/clockIn';
			} else {
				url = '/hr/hrOpenResults/clockOut';
			}
			this.$post(url, { sourceType: '用户打卡' }).then((res) => {
				this.$message.info(res.message);
			});
		},
	},
};
</script>

<style lang="scss" scoped="scoped">
@mixin cardBg($leftColor, $rightColor) {
	background: -webkit-linear-gradient(to right, $leftColor, $rightColor);
	background: -o-linear-gradient(to right, $leftColor, $rightColor);
	background: -moz-linear-gradient (to right, $leftColor, $rightColor);
	background: linear-gradient(to right, $leftColor, $rightColor);
	box-shadow: 0 5px 10px $rightColor;
}
.cardList-wrapper {
	.card-item {
		text-align: center;
		box-sizing: border-box;
		height: 79px;
		border-radius: 6px;
		cursor: pointer;
		margin-bottom: 25px;
		line-height: 3;
		background: rgba($color: #000000, $alpha: 0.25);

		div {
			color: #fff;
		}
	}
	.ball {
		width: 100%;
		padding: 15px 0;
		text-align: center;
		.ball-info {
			width: 150px;
			height: 150px;
			border-radius: 50%;
			margin: 0 auto;
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			align-items: center;
			// @include cardBg(#5171fd, #2f8cfd);
			&:hover {
				box-shadow: 3px 5px 15px rgba(40, 40, 40, 0.36);
				transform: scale(1.03);
				transition: all 0.1s ease-out;
			}
			.ball-info-time {
				h1,
				div,
				h2 {
					color: #fff;
				}
			}
		}
	}
}
</style>
