<template>
	<div class="cardList-wrapper">
		<a-row :gutter="24">
			<a-col :xs="24" :md="12" :sm="12" :lg="6">
				<div class="card-item card-item-one">
					<div class="card-title">
						<a-space :size="8"> <icon-fonts icon="icon-chuanyue" /> 待办传阅 </a-space>
					</div>
					<div class="all-count">
						<count-to :startVal="0" :endVal="123" :duration="2200" />
						<span class="suffix">个</span>
					</div>
					<div class="card-info relative">
						<div class="abs-bottom flex">
							<div style="margin-right:20px" class="inline-block">
								今日待办：
								<a-space :size="8">
									<span class="bold">10</span>
									<a-icon type="caret-up" class="up" />
								</a-space>
							</div>
							<div class="inline-block">
								同比增长：
								<a-space :size="8">
									<span class="bold">6%</span>
									<a-icon type="caret-down" class="down" />
								</a-space>
							</div>
						</div>
					</div>
				</div>
			</a-col>
			<a-col :xs="24" :md="12" :sm="12" :lg="6">
				<div class="card-item card-item-two">
					<div class="card-title">
						<a-space :size="8"> <icon-fonts icon="icon-renwu" /> 待办任务 </a-space>
					</div>
					<div class="all-count">
						<count-to :startVal="0" :endVal="37" :duration="2200" />
						<span class="suffix">个</span>
					</div>
					<div class="card-info relative">
						<div class="abs-bottom">
							<div style="margin-right:20px" class="inline-block">
								今日完成数：
								<a-space :size="8">
									<span class="bold">15</span>
									<a-icon type="caret-down" class="up" />
								</a-space>
							</div>
						</div>
					</div>
				</div>
			</a-col>
			<a-col :xs="24" :md="12" :sm="12" :lg="6">
				<div class="card-item card-item-three">
					<div class="card-title">
						<a-space :size="8"> <icon-fonts icon="icon-huiyi" /> 待上会议 </a-space>
					</div>
					<div class="all-count">
						<count-to :startVal="0" :endVal="12" :duration="2200" />
						<span class="suffix">个</span>
					</div>
					<div class="card-info relative">
						<div class="abs-bottom">
							<div style="margin-right:20px" class="inline-block">
								今日会议：
								<a-space :size="8">
									<span class="bold">5</span>
									<a-icon type="caret-down" class="up" />
								</a-space>
							</div>
						</div>
					</div>
				</div>
			</a-col>
			<a-col :xs="24" :md="12" :sm="12" :lg="6">
				<div class="card-item card-item-four">
					<div class="card-title">
						<a-space :size="8"> <icon-fonts icon="icon-youjian" :size="20" /> 未读邮件 </a-space>
					</div>
					<div class="all-count">
						<count-to :startVal="0" :endVal="139" :duration="2200" />
						<span class="suffix">封</span>
					</div>
					<div class="card-info relative">
						<div class="abs-bottom flex">
							<div style="margin-right:20px" class="inline-block">
								今日收件：
								<a-space :size="8">
									<span class="bold">19</span>
									<a-icon type="caret-down" class="up" />
								</a-space>
							</div>
							<div class="inline-block">
								阅读率：
								<a-space :size="8">
									<span class="bold">66%</span>
									<a-icon type="caret-up" class="down" />
								</a-space>
							</div>
						</div>
					</div>
				</div>
			</a-col>
		</a-row>
	</div>
</template>

<script>
import countTo from 'vue-count-to';
export default {
	name: 'cardList',
	components: { countTo },
	data() {
		return {};
	},
	mounted() {},
	methods: {
		sendTitle(title, key) {
			this.$emit('sendTitle', title, key);
		},
	},
};
</script>
<style lang="scss" scoped>
@import '@/assets/style/mixin.scss';

.cardList-wrapper {
	.card-item {
		box-sizing: border-box;
		height: 149px;
		padding: 15px 15px 0;
		border-radius: 6px;
		cursor: pointer;
		margin-bottom: 25px;
		&.card-item-one {
			@include cardBg(#5171fd, #c97afd);
		}
		&.card-item-two {
			@include cardBg(#3dadf6, #737bfc);
		}
		&.card-item-three {
			@include cardBg(#ea677c, #ef9b5f);
		}
		&.card-item-four {
			@include cardBg(#42d79b, #a6e25f);
		}
		&:hover {
			box-shadow: 3px 5px 15px rgba(40, 40, 40, 0.36);
			transform: scale(1.03);
			transition: all 0.1s ease-out;
		}
		.card-title {
			color: #fff;
			font-size: 1rem;
			text-align: left;
		}
		.all-count {
			color: #fff;
			font-size: 1.9rem;
			font-weight: bold;
			margin-top: 12px;
			padding-left: 25px;
			.suffix {
				font-size: 0.75rem;
			}
		}
		.card-info {
			color: #fff;
			font-size: 0.85rem;
			height: 46px;
			margin-top: 8px;
			.abs-bottom {
				position: absolute;
				bottom: 7px;
				left: 0;
			}
			.up {
				color: #1afa29;
			}
			.down {
				color: rgb(250, 30, 16);
			}
		}
	}
}
</style>
